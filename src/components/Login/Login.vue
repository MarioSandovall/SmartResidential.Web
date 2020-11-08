<template>
  <v-container fill-height>
    <v-row class="justify-center align-center">
      <v-col xs="12" sm="8" md="8" lg="5" xl="4">
        <v-form v-model="isFormValid">
          <v-card :loading="isloading">
            <v-card-title>
              <h3>Smart Residential</h3>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-text-field
                    prepend-icon="mdi-email"
                    :label="$t('login.filed.email')"
                    v-model="login.email"
                    single-line
                    :rules="rules.email"
                  ></v-text-field>
                </v-row>
                <v-row>
                  <v-text-field
                    prepend-icon="mdi-lock"
                    :label="$t('login.filed.password')"
                    v-model="login.password"
                    single-line
                    autocomplete="on"
                    :rules="rules.password"
                    @keypress.enter="summit"
                    :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="showPassword ? 'text' : 'password'"
                    @click:append="showPassword = !showPassword"
                  ></v-text-field>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                @click="summit"
                :disabled="!isFormValid || isloading"
              >
                {{ $t('button.login') }}
                <v-icon class="pa-2">mdi-login</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>

import authService from '../../services/authService'
import emailValidator from '../../utils/emialValidator'
import { mapMutations } from 'vuex'

export default {
  name: 'Login',
  data: (vm) => ({
    isloading: false,
    isFormValid: null,
    showPassword: false,
    login: {
      email: 'mario_sandovall@outlook.com',
      password: 'hola'
    },
    rules: {
      email: [
        v => !!v || vm.$t('login.rule.email_is_required'),
        v => emailValidator.isValid(v) || vm.$t('login.rule.invalid_email_address')
      ],
      password: [
        v => !!v || vm.$t('login.rule.password_is_required')
      ]
    }
  }),
  methods: {
    ...mapMutations('snackbarModule', ['showErrorMessage']),
    summit () {
      this.isloading = true
      authService.login(this.login.email, this.login.password)
        .then()
        .catch((error) => {
          let message = this.$t('message.something_went_wrong')
          if (error.response) {
            switch (error.response.status) {
              case 404:
                message = this.$t('login.message.email_or_password_is_incorrect')
                break
              case 400:
                message = error.response.data || this.$t('message.bad_request')
            }
          }
          this.showErrorMessage(message)
        })
        .finally(() => {
          this.isloading = false
        })
    }
  }
}
</script>
