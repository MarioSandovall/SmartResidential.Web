<template>
  <v-navigation-drawer temporary v-model="drawer" absolute app>
    <v-list>
      <v-list-item two-line>
        <v-list-item-avatar>
          <v-icon large>mdi-account</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{user.name}}</v-list-item-title>
          <v-list-item-subtitle>{{user.email}}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item
        v-for="option in getMenu"
        :key="option.name"
        @click="redirectTo(option.component)"
      >
        <v-list-item-icon>
          <v-icon>{{ option.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $t(option.name) }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item @click="logout">
        <v-list-item-icon>
          <v-icon>mdi-logout</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $t('menu.logout') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import { mapState, mapGetters } from 'vuex'

import authService from '../../services/authService'
import { DRAWER_MODULE } from '../../utils/vuexStorage'

export default {
  name: 'NavigationDrawer',
  methods: {
    redirectTo (component) {
      if (this.$router.currentRoute.name !== component) {
        this.$router.push({ name: component })
      }
    },
    logout () {
      authService.openLogoutConfirmation()
    }
  },
  computed: {
    ...mapState('loginModule', ['user']),
    ...mapGetters('loginModule', ['getMenu']),
    drawer: {
      get () {
        return this.$store.state.drawerModule.drawer
      },
      set (value) {
        if (!value) {
          this.$store.commit(DRAWER_MODULE.CLOSE)
        }
      }
    }
  }
}
</script>
