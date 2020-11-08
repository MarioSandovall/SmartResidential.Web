<template>
  <v-container>
    <v-col>
      <v-row class="justify-center">
        <v-card
          v-for="option in getMenu"
          :key="option.name"
          @click="redirectTo(option.component)"
          class="text-center ma-2 d-flex align-content-center flex-wrap"
          width="300px"
          height="150px"
          tile
        >
          <v-card-text>
            <v-icon x-large>{{ option.icon }}</v-icon>
            <h3>{{ $t(option.name) }}</h3>
          </v-card-text>
        </v-card>
        <v-card
          class="text-center ma-2 d-flex align-content-center flex-wrap"
          @click="logout"
          width="300px"
          height="150px"
        >
          <v-card-text>
            <v-icon x-large>mdi-logout</v-icon>
            <h3>{{ $t('menu.logout') }}</h3>
          </v-card-text>
        </v-card>
      </v-row>
    </v-col>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import router from '../../router'
import authService from '../../services/authService'

export default {
  name: 'Home',
  methods: {
    logout () {
      authService.openLogoutConfirmation()
    },
    redirectTo (component) {
      if (router.currentRoute.name !== component) {
        router.push({ name: component })
      }
    }
  },
  computed: {
    ...mapGetters('loginModule', ['getMenu'])
  }
}
</script>
