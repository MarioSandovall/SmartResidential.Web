<template>
  <v-app>
    <navigation-drawer></navigation-drawer>
    <app-bar></app-bar>
    <v-content>
      <router-view></router-view>
      <snackbar></snackbar>
      <loader></loader>
      <logout></logout>
    </v-content>
  </v-app>
</template>
<script>
import { mapGetters } from 'vuex'

import AppBar from './components/AppBar/AppBar'
import Loader from './components/Shared/Loader/Loader'
import Logout from './components/Shared/Logout/Logout'
import Snackbar from './components/Shared/Snackbar/Snackbar'
import NavigationDrawer from './components/NavigationDrawer/NavigationDrawer'

export default {
  name: 'App',
  components: {
    AppBar,
    Loader,
    Logout,
    Snackbar,
    NavigationDrawer
  },
  computed: {
    ...mapGetters('loginModule', ['isAuthenticated'])
  }
}
</script>
