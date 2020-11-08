<template>
  <v-overlay v-if="isLoading">
    <v-col>
      <v-row class="justify-center align-center">
        <v-progress-circular indeterminate :size="80"></v-progress-circular>
      </v-row>
      <v-row>
        <label class="title">Smart Residential</label>
      </v-row>
    </v-col>
  </v-overlay>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'Loader',
  computed: {
    ...mapState('loaderModule', ['isLoading'])
  }
}
</script>
