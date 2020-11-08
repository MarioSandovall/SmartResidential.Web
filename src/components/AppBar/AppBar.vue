<template>
  <v-app-bar app color="primary" dark dense>
    <v-app-bar-nav-icon
      v-if="isAuthenticated"
      @click.stop="openDrawer"
    ></v-app-bar-nav-icon>
    <v-toolbar-title v-if="isAuthenticated">{{ residential }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn
      icon
      @click="changeTheme(($vuetify.theme.dark = !$vuetify.theme.dark))"
    >
      <v-icon v-if="$vuetify.theme.dark">mdi-weather-sunny</v-icon>
      <v-icon v-else>mdi-weather-night</v-icon>
    </v-btn>

    <v-menu>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-web</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="changeLanguage('en-US')">
          <v-list-item-title> {{ $t('language.english') }}</v-list-item-title>
        </v-list-item>
        <v-list-item @click="changeLanguage('es-MX')">
          <v-list-item-title> {{ $t('language.spanish') }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
<script>
import themeSerive from '../../services/themeService'
import { mapMutations, mapGetters } from 'vuex'

export default {
  name: 'AppBar',
  computed: {
    ...mapGetters('loginModule', ['isAuthenticated', 'residential'])
  },
  methods: {
    ...mapMutations('drawerModule', ['openDrawer']),
    ...mapMutations('localizationModule', ['setLenguage']),
    changeLanguage (languge) {
      if (this.$root.$i18n.locale !== languge) {
        this.setLenguage(languge)
        this.$root.$i18n.locale = languge
      }
    },
    changeTheme (isDarkTheme) {
      themeSerive.setTheme(isDarkTheme)
    }
  }
}
</script>
