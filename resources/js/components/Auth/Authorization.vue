<template>
    <div>
        <v-card-text class="pt-2 px-6 pb-0">
            <v-alert
                :value="showError"
                class="my-4"
                border="left"
                transition="scale-transition"
                colored-border
                type="error"
                elevation="2"
            >
                <h4>Не удаётся войти.</h4>
                <span>Пожалуйста, проверьте правильность написания логина и пароля.</span>
            </v-alert>
            <v-form v-model="valid">
                <v-row>
                    <v-col cols="12">
                        <v-text-field v-model="email"
                                      :rules="rules.email"
                                      label="Эл. почта"
                                      autocomplete="email"
                                      prepend-icon="mail"
                                      required/>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="password"
                                      label="Пароль"
                                      :rules="rules.password"
                                      :type="passwordShow ? 'text' : 'password'"
                                      :append-icon="passwordShow ? 'visibility_off' : 'visibility'"
                                      @click:append="passwordShow = !passwordShow"
                                      autocomplete="current-password"
                                      prepend-icon="lock"
                                      hint="Пароль должен содержать не менее 6 символов."
                                      required/>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <v-card-actions class="pb-6 justify-center">
            <v-btn color="primary"
                   outlined
                   class="px-5"
                   :loading="authProcess"
                   :disabled="!valid || !filled"
                   @click="auth()"
            >
                <v-icon class="mr-1">exit_to_app</v-icon>
                Войти
            </v-btn>
        </v-card-actions>
    </div>
</template>

<script>
export default {
    name: "Authorization",
    data() {
        return {
            email: "",
            password: "",

            showError: false,
            passwordShow: false,
            valid: false,
            authProcess: false,

            rules: {
                email: [
                    v => {
                        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        return !v || pattern.test(v) || 'Введите корректный адрес электронной почты.'
                    }
                ],
                password: [v => !v || v.length >= 6 || 'Пароль должен содержать от 6 символов.']
            }
        }
    },
    computed: {
        filled() {
            return this.email && this.password
        }
    },
    methods: {
        auth() {
            this.showError = false;
            this.authProcess = true;

            this.$store.dispatch('auth/login', {
                email: this.email,
                password: this.password
            })
                .then(_ => this.$emit('done'))
                .catch(_ => this.showError = true)
                .finally(() => this.authProcess = false)
        }
    }
}
</script>
