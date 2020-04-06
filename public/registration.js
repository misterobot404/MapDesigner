(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{138:function(t,e,r){"use strict";r.r(e);var i=r(40),n={name:"Registration",data:function(){var t=this;return{dialog:!1,valid:!1,name:"",nameInputSuccessful:!1,nameLoading:!1,nameError:"",email:"",password:"",passwordShow:!1,passwordConfirm:"",passwordConfirmShow:!1,rules:{name:[function(t){return!t||RegExp("^[A-Za-zА-Яа-я0-9]+( [A-Za-zА-Яа-я0-9]+)*$").test(t)||"Имя пользователя должно содержать только буквы и цифры."},function(t){return!t||t.length>=4&&t.length<=30||"Имя пользователя должно содержать от 4 до 30 символов."},function(e){return t.nameError="",e&&RegExp("^[A-Za-zА-Яа-я0-9]+( [A-Za-zА-Яа-я0-9]+)*$").test(e)&&e.length>=4&&e.length<=30&&(t.nameInputSuccessful=!0),!0}],email:[function(t){return!t||/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(t)||"Введите действующий адрес электронной почты."}],password:[function(t){return!t||t.length>=6||"Пароль должен содержать от 6 символов."}],passwordConfirm:[function(e){return!e||e===t.password||"Пароли не совпадают. Повторите попытку."}]}}},computed:{filled:function(){return 0!==this.name.length&&0!==this.email.length&&0!==this.password.length&&0!==this.passwordConfirm.length}},methods:{registration:function(){this.$store.dispatch("auth/register",{name:this.name,email:this.email,password:this.password}),this.dialog=!1},inputName:r.n(i)()((function(t){var e=this;this.nameInputSuccessful&&(this.nameLoading=!0,this.$store.dispatch("auth/checkRegistrationName",{name:t}).then((function(t){var r=t.data;200!==r.status&&r.name===e.name&&(e.nameError="Это имя пользователя недоступно.")})).finally((function(){e.nameLoading=!1})),this.nameInputSuccessful=!1)}),600)}},a=r(11),o=r(12),s=r.n(o),l=r(154),u=r(30),c=r(8),d=r(152),p=r(136),f=r(2),h=r(18),m=r(19),v=Object(f.a)(h.a,Object(m.b)("form")).extend({name:"v-form",inheritAttrs:!1,props:{lazyValidation:Boolean,value:Boolean},data:()=>({inputs:[],watchers:[],errorBag:{}}),watch:{errorBag:{handler(t){const e=Object.values(t).includes(!0);this.$emit("input",!e)},deep:!0,immediate:!0}},methods:{watchInput(t){const e=t=>t.$watch("hasError",e=>{this.$set(this.errorBag,t._uid,e)},{immediate:!0}),r={_uid:t._uid,valid:()=>{},shouldValidate:()=>{}};return this.lazyValidation?r.shouldValidate=t.$watch("shouldValidate",i=>{i&&(this.errorBag.hasOwnProperty(t._uid)||(r.valid=e(t)))}):r.valid=e(t),r},validate(){return 0===this.inputs.filter(t=>!t.validate(!0)).length},reset(){this.inputs.forEach(t=>t.reset()),this.resetErrorBag()},resetErrorBag(){this.lazyValidation&&setTimeout(()=>{this.errorBag={}},0)},resetValidation(){this.inputs.forEach(t=>t.resetValidation()),this.resetErrorBag()},register(t){this.inputs.push(t),this.watchers.push(this.watchInput(t))},unregister(t){const e=this.inputs.find(e=>e._uid===t._uid);if(!e)return;const r=this.watchers.find(t=>t._uid===e._uid);r&&(r.valid(),r.shouldValidate()),this.watchers=this.watchers.filter(t=>t._uid!==e._uid),this.inputs=this.inputs.filter(t=>t._uid!==e._uid),this.$delete(this.errorBag,e._uid)}},render(t){return t("form",{staticClass:"v-form",attrs:{novalidate:!0,...this.attrs$},on:{submit:t=>this.$emit("submit",t)}},this.$slots.default)}}),w=r(153),g=r(137),b=r(10),x=Object(a.a)(n,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("v-dialog",{attrs:{"max-width":"420px"},scopedSlots:t._u([{key:"activator",fn:function(e){var i=e.on;return[r("v-btn",t._g({attrs:{text:"",color:"primary"}},i),[t._v("\n            Регистрация\n        ")])]}}]),model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[t._v(" "),r("v-card",[r("v-toolbar",{attrs:{color:"primary",dark:"",flat:""}},[r("v-card-title",[t._v("Зарегистрироваться")])],1),t._v(" "),r("v-card-text",{staticClass:"pt-2 pb-0"},[r("v-form",{model:{value:t.valid,callback:function(e){t.valid=e},expression:"valid"}},[r("v-row",[r("v-col",{attrs:{cols:"12"}},[r("v-text-field",{attrs:{"error-messages":t.nameError,loading:t.nameLoading,rules:t.rules.name,label:"Имя пользователя",autocomplete:"name","prepend-icon":"person",hint:"Под этим именем вас будут знать другие пользователи MapDesigner.",required:""},on:{input:t.inputName},model:{value:t.name,callback:function(e){t.name=e},expression:"name"}})],1),t._v(" "),r("v-col",{attrs:{cols:"12"}},[r("v-text-field",{attrs:{label:"Эл. почта",autocomplete:"email","prepend-icon":"mail",rules:t.rules.email,hint:"Вам нужно будет подтвердить, что этот адрес электронной почты принадлежит вам.",required:""},model:{value:t.email,callback:function(e){t.email=e},expression:"email"}})],1),t._v(" "),r("v-col",{attrs:{cols:"12"}},[r("v-text-field",{attrs:{label:"Пароль",type:t.passwordShow?"text":"password","append-icon":t.passwordShow?"visibility_off":"visibility",autocomplete:"new-password","prepend-icon":"lock",rules:t.rules.password,hint:"Пароль должен содержать не менее 6 символов.",required:""},on:{"click:append":function(e){t.passwordShow=!t.passwordShow}},model:{value:t.password,callback:function(e){t.password=e},expression:"password"}})],1),t._v(" "),r("v-col",{attrs:{cols:"12"}},[r("v-text-field",{attrs:{label:"Подтвердите пароль",type:t.passwordConfirmShow?"text":"password","append-icon":t.passwordConfirmShow?"visibility_off":"visibility","prepend-icon":"lock",rules:t.rules.passwordConfirm,required:""},on:{"click:append":function(e){t.passwordConfirmShow=!t.passwordConfirmShow}},model:{value:t.passwordConfirm,callback:function(e){t.passwordConfirm=e},expression:"passwordConfirm"}})],1)],1)],1)],1),t._v(" "),r("v-card-actions",{staticClass:"px-6 pb-6"},[r("v-btn",{attrs:{color:"primary",block:"",disabled:!t.valid||!t.filled||t.nameLoading||t.nameInputSuccessful},on:{click:function(e){return t.registration()}}},[t._v("Зарегистироваться\n            ")])],1)],1)],1)}),[],!1,null,null,null);e.default=x.exports;s()(x,{VBtn:l.a,VCard:u.a,VCardActions:c.a,VCardText:c.b,VCardTitle:c.c,VCol:d.a,VDialog:p.a,VForm:v,VRow:w.a,VTextField:g.a,VToolbar:b.a})},36:function(t,e){t.exports=function(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)}},37:function(t,e,r){var i=r(55),n="object"==typeof self&&self&&self.Object===Object&&self,a=i||n||Function("return this")();t.exports=a},38:function(t,e,r){var i=r(37).Symbol;t.exports=i},40:function(t,e,r){var i=r(36),n=r(54),a=r(56),o=Math.max,s=Math.min;t.exports=function(t,e,r){var l,u,c,d,p,f,h=0,m=!1,v=!1,w=!0;if("function"!=typeof t)throw new TypeError("Expected a function");function g(e){var r=l,i=u;return l=u=void 0,h=e,d=t.apply(i,r)}function b(t){return h=t,p=setTimeout(y,e),m?g(t):d}function x(t){var r=t-f;return void 0===f||r>=e||r<0||v&&t-h>=c}function y(){var t=n();if(x(t))return _(t);p=setTimeout(y,function(t){var r=e-(t-f);return v?s(r,c-(t-h)):r}(t))}function _(t){return p=void 0,w&&l?g(t):(l=u=void 0,d)}function S(){var t=n(),r=x(t);if(l=arguments,u=this,f=t,r){if(void 0===p)return b(f);if(v)return clearTimeout(p),p=setTimeout(y,e),g(f)}return void 0===p&&(p=setTimeout(y,e)),d}return e=a(e)||0,i(r)&&(m=!!r.leading,c=(v="maxWait"in r)?o(a(r.maxWait)||0,e):c,w="trailing"in r?!!r.trailing:w),S.cancel=function(){void 0!==p&&clearTimeout(p),h=0,l=f=u=p=void 0},S.flush=function(){return void 0===p?d:_(n())},S}},54:function(t,e,r){var i=r(37);t.exports=function(){return i.Date.now()}},55:function(t,e,r){(function(e){var r="object"==typeof e&&e&&e.Object===Object&&e;t.exports=r}).call(this,r(24))},56:function(t,e,r){var i=r(36),n=r(57),a=/^\s+|\s+$/g,o=/^[-+]0x[0-9a-f]+$/i,s=/^0b[01]+$/i,l=/^0o[0-7]+$/i,u=parseInt;t.exports=function(t){if("number"==typeof t)return t;if(n(t))return NaN;if(i(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=i(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(a,"");var r=s.test(t);return r||l.test(t)?u(t.slice(2),r?2:8):o.test(t)?NaN:+t}},57:function(t,e,r){var i=r(58),n=r(61);t.exports=function(t){return"symbol"==typeof t||n(t)&&"[object Symbol]"==i(t)}},58:function(t,e,r){var i=r(38),n=r(59),a=r(60),o=i?i.toStringTag:void 0;t.exports=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":o&&o in Object(t)?n(t):a(t)}},59:function(t,e,r){var i=r(38),n=Object.prototype,a=n.hasOwnProperty,o=n.toString,s=i?i.toStringTag:void 0;t.exports=function(t){var e=a.call(t,s),r=t[s];try{t[s]=void 0;var i=!0}catch(t){}var n=o.call(t);return i&&(e?t[s]=r:delete t[s]),n}},60:function(t,e){var r=Object.prototype.toString;t.exports=function(t){return r.call(t)}},61:function(t,e){t.exports=function(t){return null!=t&&"object"==typeof t}}}]);