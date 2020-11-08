<template>
  <v-dialog max-width="500" persistent v-model="isLogoutConfirmationOpen">
    <v-card>
      <v-card-title>
        <label class="title">{{ $t('login.message.log_out') }}</label>
      </v-card-title>
      <v-card-text>
        <v-container>
          <h3>{{ $t('login.message.are_you_sure_you_want_to_log_out') }}</h3>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="close">{{ $t('button.close') }}</v-btn>
        <v-btn color="primary" @click="logout">
          {{ $t('button.yes') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapState } from 'vuex'

import authServie from '../../../services/authService'

export default {
  name: 'Logout',
  methods: {
    logout () {
      authServie.logout()
    },
    close () {
      authServie.closeLogoutConfirmation()
    }
  },
  computed: {
    ...mapState('loginModule', ['isLogoutConfirmationOpen'])
  }
}
</script>
