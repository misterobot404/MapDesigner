<template>
    <v-row
        no-gutters
        class="mt-3"
        style="max-height: 36vh; min-height: 36vh;"
    >
        <v-col
            cols="6"
            class="pr-1 d-flex flex-column"
            style="max-height: 100%; overflow: auto"
        >
            <v-text-field
                v-model.trim="model_title"
                label="Название события..."
                single-line
                outlined
                hide-details
                clearable
                class="border-color-gray"
                style="flex-grow: 0;"
            />
            <tiptap-vuetify
                v-model="model_description"
                class="d-flex flex-grow-1 mt-3"
                :extensions="extensions"
                :card-props="{ outlined: true, style: 'width: 100%' }"
                placeholder="Описание события..."
            />
        </v-col>
        <v-col
            cols="6"
            class="d-flex flex-column pl-2"
            style="max-height: 100%;"
        >
            <v-card
                height="100%"
                outlined
                class="d-flex flex-column"
            >
                <v-card-title style="font-size: 1rem !important;">
                    <v-icon class="mr-2">perm_media</v-icon>
                    Медиа-содержимое
                </v-card-title>
                <v-divider/>
                <v-card-text
                    class="d-flex flex"
                    style="max-height: 100%; overflow: auto;"
                >
                    <v-col cols="6" class="d-flex flex-column justify-center">
                        <!-- Add media -->
                        <EventFormAddMediaDialog/>
                        <!-- Change icon -->
                        <v-btn
                            block
                            large
                            style="flex-grow: 0"
                            @click="changeIconDialog = true"
                        >
                            <v-img
                                max-height="32"
                                max-width="32"
                                contain
                                :src="selectedEvent.marker.url"
                                class="mr-2"
                            />
                            Изменить иконку
                        </v-btn>
                        <v-dialog
                            v-model="changeIconDialog"
                            max-width="320"
                        >
                            <v-card>
                                <v-toolbar
                                    height="68"
                                    flat
                                    class="pr-1"
                                >
                                    <v-toolbar-title>
                                        <v-icon large class="mr-1 pb-1">location_on</v-icon>
                                        Изменение иконки
                                    </v-toolbar-title>
                                </v-toolbar>
                                <v-card-text class="pb-0">
                                    <v-text-field
                                        v-model="iconUrl"
                                        label="Ссылка на иконку"
                                    />
                                    <v-row>
                                        <v-col cols="6">
                                            <v-text-field
                                                v-model="iconWidth"
                                                label="Ширина"
                                            />
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                v-model="iconHeight"
                                                label="Высота"
                                            />
                                        </v-col>
                                    </v-row>

                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer/>
                                    <div class="d-flex flex-column align-end">
                                        <v-btn
                                            class="my-1"
                                            text
                                            @click="changeIconDialog = false; SET_ICON_FOR_ALL_EVENTS({index:indexSelectedEvent, iconUrl: iconUrl, size: [iconWidth, iconHeight]})"
                                        >
                                            Применить ко всем
                                        </v-btn>
                                        <v-btn
                                            color="primary"
                                            class="flex-grow-0 my-1"
                                            text
                                            @click="changeIconDialog = false; SET_ICON_FOR_EVENT({index:indexSelectedEvent, iconUrl: iconUrl, size: [iconWidth, iconHeight]})"
                                        >
                                            Применить
                                        </v-btn>
                                    </div>

                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-col>
                    <v-col
                        cols="6"
                        class="d-flex flex-column justify-center"
                        style="max-height: 100%; overflow: auto;"
                    >
                        <MediaContent height="100%"/>
                    </v-col>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import Vue from "vue"
import vuetify from "@/plugins/vuetify"
import {TiptapVuetifyPlugin} from 'tiptap-vuetify'
import 'tiptap-vuetify/dist/main.css'

Vue.use(TiptapVuetifyPlugin, {
    vuetify,
    iconsGroup: 'md'
})
import {mapGetters, mapMutations} from 'vuex'
import MediaContent from "./../MediaContentForEvent"
import {
    TiptapVuetify,
    Heading,
    Bold,
    Italic,
    Strike,
    Underline,
    Code,
    CodeBlock,
    Paragraph,
    BulletList,
    OrderedList,
    ListItem,
    Link,
    Blockquote,
    HardBreak,
    HorizontalRule,
    History
} from 'tiptap-vuetify'
import EventFormAddMediaDialog from "./EventFormAddMediaDialog";

export default {
    name: "ConstructorForm",
    components: {
        EventFormAddMediaDialog,
        MediaContent,
        TiptapVuetify
    },
    data() {
        return {
            // Dialog. Change icon.
            changeIconDialog: false,
            iconUrl: "",
            iconWidth: null,
            iconHeight: null,
            // declare extensions you want to use  in html editor
            extensions: [
                History,
                Link,
                [Heading, {
                    options: {
                        levels: [1, 2, 3, 4]
                    }
                }],
                Underline,
                Strike,
                Italic,
                Bold,
                ListItem,
                BulletList,
                OrderedList,
                Blockquote,
                HorizontalRule,
                Paragraph,
                HardBreak,
                Code,
                CodeBlock
            ],
        }
    },
    watch: {
        changeIconDialog(val) {
            if (val) {
                this.iconUrl = this.selectedEvent.marker.url;
                this.iconWidth = this.selectedEvent.marker.size[0];
                this.iconHeight = this.selectedEvent.marker.size[1];
            }
        }
    },
    computed: {
        ...mapGetters('map', [
            'selectedEvent',
            'indexSelectedEvent'
        ]),
        model_title: {
            get() {
                return this.selectedEvent.title
            },
            set(value) {
                const payload = {'index': this.indexSelectedEvent, 'title': value};
                this.SET_EVENT_TITLE(payload)
            }
        },
        model_description: {
            get() {
                return this.selectedEvent.description
            },
            set(value) {
                const payload = {'index': this.indexSelectedEvent, 'description': value};
                this.SET_EVENT_DESCRIPTION(payload)
            }
        },
        model_mediaUrl: {
            get() {
                return this.selectedEvent.mediaUrl
            },
            set(value) {
                const payload = {'index': this.indexSelectedEvent, 'mediaUrl': value};
                this.SET_EVENT_MEDIA_URL(payload)
            }
        }
    },
    methods: {
        ...mapMutations('map', [
            "SET_EVENT_TITLE",
            "SET_EVENT_DESCRIPTION",
            'SET_ICON_FOR_EVENT',
            'SET_ICON_FOR_ALL_EVENTS'
        ]),
    }
}
</script>

<style lang="sass" scoped>
::v-deep .border-color-gray:not(.v-input--is-focused) .v-input__control > .v-input__slot fieldset
    color: rgba(0, 0, 0, 0.2) !important
</style>
