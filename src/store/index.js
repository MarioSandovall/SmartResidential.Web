import Vue from 'vue'
import Vuex from 'vuex'

import loginModule from './modules/login'
import loaderModule from './modules/loader'
import drawerModule from './modules/drawer'
import snackbarModule from './modules/snackbar'
import localizationModule from './modules/localization'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    loginModule,
    drawerModule,
    loaderModule,
    snackbarModule,
    localizationModule
  }
})

export default store
