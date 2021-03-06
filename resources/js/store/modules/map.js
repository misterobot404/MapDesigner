import axios from "axios"
import router from "../../routes"

export default {
    namespaced: true,
    state: {
        //// Data from db
        id: "",
        name: "",
        description: "",
        subject_id: "",
        tile_id: "",
        tile_for_create: null,
        config: {eventListWidth: 227}, // {selectedEventId, eventListWidth}
        events: [], // [{title, description, id, marker {position, url, height }, mediaUrl:[]}]

        //// Computed data
        // Initial state of the card, to which you can roll back
        oldMap: null,
        // Next event will be created with this id
        nextEventId: 0,
        // Current coordinate of the view center
        tileCenter: {}
    },
    getters: {
        indexSelectedEvent(state) {
            // return -1 indicating that no element passed the test
            return state.events.findIndex(obj => obj.id === state.config.selectedEventId);
        },
        selectedEvent: function (state) {
            return state.events.find(obj => obj.id === state.config.selectedEventId);
        },
        getEventIdByIndex: state => index => {
            return state.events[index].id;
        },
        arrayMarker: state => state.events.map(a => a.marker.position),
        // Detect changes map
        wasChanges(state) {
            // data not get
            if (!state.oldMap) return false;
            // Remove unused space
            let currentMap = {
                id: state.id,
                name: state.name,
                subject_id: state.subject_id,
                description: state.description,
                tile_id: state.tile_id,
                events: state.events
            };
            let currentMapJSON = JSON.stringify(currentMap).split(' ').join('');
            let oldMapJSON = JSON.stringify(state.oldMap).split(' ').join('');
            return oldMapJSON !== currentMapJSON
        }
    },
    actions: {
        getMap({state, getters, commit, rootState, rootGetters}, mapId) {
            // Clear previous map
            commit('CLEAR_STATE');
            // Send request
            return axios.get('/api/maps/' + mapId)
                .then(response => {
                    commit('SET_MAP', response.data.data.map);
                    commit('SET_OLD_MAP', response.data.data.map);
                    commit('SET_NEXT_EVENT_ID');
                    // set tile center on first event
                    commit('SET_TILE_CENTER', getters.selectedEvent.marker.position);
                    // Если атлас загружен не авторизированным пользователем, то атлас публичный, поэтому тайл для атласа идёт с респонсом
                    if (!rootGetters["auth/isAuth"]) {
                        commit('tiles/SET_TILES', [response.data.data.tile], {root: true})
                    }
                })
        },
        setEmptyExampleMap({state, commit, getters, rootState, rootGetters}) {
            // Clear previous map
            commit('CLEAR_STATE');
            let map = rootState.maps.editableExample;
            commit('SET_MAP', map);
            commit('SET_OLD_MAP', map);
            commit('SET_NEXT_EVENT_ID');
            // set tile center on first event
            commit('SET_TILE_FOR_CREATE', rootGetters["tiles/selectedTile"]);
            commit('SET_TILE_CENTER', getters.selectedEvent.marker.position);
        },
        saveMap({state, commit, dispatch}) {
            // Save current width event list
            commit('SET_EVENT_LIST_WIDTH');

            // Save new map
            if (state.id === "test") {
                let map = {
                    name: state.name,
                    subject_id: state.subject_id,
                    description: state.description,
                    config: state.config,
                    tile_id: state.tile_id,
                    tile_for_create: state.tile_for_create,
                    events: state.events
                };
                return dispatch('maps/createMap', map, {root: true})
                    .then(_ => {
                        commit('SET_TILE_FOR_CREATE', null);
                        router.push("/library").then();
                    })
            }
            // Save existing map
            else {
                let map = {
                    id: state.id,
                    name: state.name,
                    subject_id: state.subject_id,
                    description: state.description,
                    config: JSON.stringify(state.config),
                    tile_id: state.tile_id,
                    events: JSON.stringify(state.events)
                };
                return axios.put('/api/maps/' + state.id, map)
                    .then(response => {
                        commit('SET_OLD_MAP', response.data.data.map);
                        // в массиве атласов обновить измененные данные (там отображается старая версия атласа)
                        commit('maps/REPLACE_MAP', map, {root: true});
                    })
            }
        },
        recoveryMap({state, commit}) {
            // Recovery state
            commit('RECOVERY_MAP');
            // Computed some state
            commit('SET_NEXT_EVENT_ID');
        },

        //// Events
        addEvent({state, commit}) {
            commit('PUSH_EMPTY_EVENT');
            commit('ITERATION_ID');
            commit('SET_SELECTED_EVENT_ID', state.events[state.events.length - 1].id)
        },
        deleteEventByIndex({state, getters, commit}, index) {
            // Удалаяем событие
            commit('DELETE_EVENT_BY_INDEX', index);
            // Если было удалёно активное событие (активное событие не надено), устанавливаем новое
            let deletedEventIndex = index;

            // Если удаленный элемент являлся последним в массиве, смещаем текущий активный элемент назад
            if (state.events.length === deletedEventIndex) {
                deletedEventIndex--;
            }
            // Установка нового активного элемента
            commit('SET_SELECTED_EVENT_ID', getters.getEventIdByIndex(deletedEventIndex));
        },

        //// Event
        addMedia({state, getters, commit}, mediaFile) {
            // Формируем тело запроса
            let formData = new FormData();
            formData.append('media_file', mediaFile);

            // Сохранение медиа на сервере и получение ссылки
            return axios.post('/api/maps/' + state.id + '/events/' + getters.selectedEvent.id + '/addMedia', formData, {headers: {'Content-Type': 'multipart/form-data'}})
                .then(response => {
                    // Добавляем ссылку на файл к медиа контенту события
                    commit('ADD_EVENT_MEDIA_URL', {
                        index: getters.indexSelectedEvent,
                        mediaUrl: response.data.data.addedMediaUrl
                    })
                });
        },
        deleteMedia({state, getters, commit}, payload) {
            // Если медиа файл получен с сервера, удалить его физически
            if (state.events[payload.indexEvent].mediaUrl[payload.indexMediaUrl].includes("storage/event_media/")) {
                return axios.put('/api/maps/' + state.id + '/events/' + getters.selectedEvent.id + '/deleteMedia', {
                    mediaUrl: state.events[payload.indexEvent].mediaUrl[payload.indexMediaUrl]
                })
                    .then(_ => commit('REMOVE_EVENT_MEDIA_URL', payload));
            }
            // Сохранение медиа на сервере и получение ссылки
            else commit('REMOVE_EVENT_MEDIA_URL', payload);
        },
    },
    mutations: {
        SET_MAP: (state, map) => {
            state.id = map.id;
            state.name = map.name;
            state.subject_id = map.subject_id;
            state.description = map.description;
            state.config = JSON.parse(map.config);
            state.tile_id = map.tile_id;
            state.events = JSON.parse(map.events);
        },
        SET_OLD_MAP: (state, map) => {
            // config is not compared
            state.oldMap = {
                id: map.id,
                name: map.name,
                subject_id: map.subject_id,
                description: map.description,
                tile_id: map.tile_id,
                events: JSON.parse(map.events)
            };
        },
        CLEAR_STATE: (state) => {
            state.id = "";
            state.name = "";
            state.subject_id = "";
            state.description = "";
            state.config = {eventListWidth: 227};
            state.tile_id = "";
            state.events = [];
            state.oldMap = null;
        },
        RECOVERY_MAP: (state) => {
            // Recovery state
            state.name = state.oldMap.name;
            state.subject_id = state.oldMap.subject_id;
            state.description = state.oldMap.description;
            // Copy object. Not reference
            state.tile_id = state.oldMap.tile_id;
            // Copy array of object. Not references.
            state.events = state.oldMap.events.map(a => Object.assign({}, a));
        },
        SET_NEXT_EVENT_ID: (state) => {
            let maxId = 1;
            state.events.forEach(element => {
                if (element.id > maxId) maxId = element.id;
            });
            state.nextEventId = maxId + 1;
        },
        SET_MAP_NAME: (state, name) => state.name = name,
        SET_MAP_DESCRIPTION: (state, description) => state.description = description,
        SET_MAP_SUBJECT_ID: (state, subject_id) => state.subject_id = subject_id,
        SET_TILE_FOR_CREATE: (state, tile_for_create) => state.tile_for_create = tile_for_create,
        SET_TILE_ID: (state, tile_id) => state.tile_id = tile_id,
        SET_TILE_CENTER: (state, center) => state.tileCenter = center,

        //// Events
        SET_EVENTS: (state, events) => state.events = events,
        PUSH_EMPTY_EVENT: (state) => {
            state.events.push({
                id: state.nextEventId,
                title: "Событие " + (state.events.length + 1),
                description: "",
                mediaUrl: [],
                marker: {
                    position: state.tileCenter,
                    url: "https://image.flaticon.com/icons/svg/148/148828.svg",
                    size: [32, 38]
                },
            });
        },
        DELETE_EVENT_BY_INDEX: (state, index) => state.events.splice(index, 1),
        SET_EVENT_MARKER_POSITION: (state, payload) => state.events[payload.index].marker.position = payload.position,
        SET_EVENT_TITLE: (state, payload) => state.events[payload.index].title = payload.title,
        SET_EVENT_DESCRIPTION: (state, payload) => state.events[payload.index].description = payload.description,
        ADD_EVENT_MEDIA_URL: (state, payload) => state.events[payload.index].mediaUrl.push(payload.mediaUrl),
        REMOVE_EVENT_MEDIA_URL: (state, payload) => state.events[payload.indexEvent].mediaUrl.splice(payload.indexMediaUrl, 1),
        SET_ICON_FOR_ALL_EVENTS: (state, payload) => {
            state.events.forEach(event => {
                event.marker.url = payload.iconUrl;
                event.marker.size = payload.size;
            })
        },
        SET_ICON_FOR_EVENT: (state, payload) => {
            state.events[payload.index].marker.url = payload.iconUrl;
            state.events[payload.index].marker.size = payload.size;
        },

        //// Config
        ITERATION_ID: (state) => state.nextEventId++,
        SET_SELECTED_EVENT_ID: (state, id) => state.config.selectedEventId = id,
        SET_EVENT_LIST_WIDTH: state => state.config.eventListWidth = document.getElementById('eventList').offsetWidth,
        SET_MIN_TILE_ZOOM: (state, zoom) => state.config.minZoom = zoom,
        SET_MAX_TILE_ZOOM: (state, zoom) => state.config.maxZoom = zoom,
        SET_SHOW_POLYLINE: (state, value) => state.config.showPolyline = value,
        SET_POLYLINE_WEIGHT: (state, value) => state.config.polylineWeight = value
    }
}
