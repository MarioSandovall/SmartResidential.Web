<template>
  <v-snackbar
    class="mb-2"
    v-model="snackbar.visible"
    :bottom="snackbar.bottom"
    :color="snackbar.color"
    :left="snackbar.left"
    :multi-line="snackbar.multiLine"
    :right="snackbar.right"
    :timeout="snackbar.timeout"
    :top="snackbar.top"
    :vertical="snackbar.vertical"
  >
    {{ snackbar.message }}
    <v-btn text @click="snackbar.visible = false">{{ $t('button.close') }}</v-btn>
  </v-snackbar>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'Snackbar',
  computed: {
    ...mapState('snackbarModule', ['snackbar'])
  }
}
</script>
