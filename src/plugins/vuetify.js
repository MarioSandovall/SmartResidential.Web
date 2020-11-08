import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import themeService from '../services/themeService'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    dark: themeService.isDarkTheme()
  }
})
