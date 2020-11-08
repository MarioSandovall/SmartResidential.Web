<template>
  <v-card>
    <v-card-title>
      <label class="title">{{ announcement.title }}</label>
    </v-card-title>
    <v-card-text class="content">
      {{ announcement.description }}
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('close')">{{ $t('button.close') }}</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex'

export default {
  name: 'ViewAnnouncement',
  props: {
    isOpen: { type: Boolean, required: true },
    announcementId: { type: Number, required: true }
  },
  data: (vm) => ({
    isLoading: false,
    isFormValid: null,
    announcement: {
      id: 0,
      title: '',
      description: '',
      residentialId: 0
    }
  }),
  methods: {
    ...mapMutations('snackbarModule', ['showErrorMessage', 'showSuccessMessage']),
    clear () {
      this.announcement = {
        id: 0,
        title: '',
        description: '',
        residentialId: 0
      }
    },
    getAnnouncement () {
      this.isLoading = true
      this.$proxy.get(`residential/${this.residentialId}/announcement/${this.announcementId}`)
        .then((response) => {
          this.announcement = response.data
        }).catch((e) => {
          const message = e?.response?.data || this.$t('message.something_went_wrong')
          this.showErrorMessage(message)
        }).finally(() => {
          this.isLoading = false
        })
    }
  },
  computed: {
    ...mapGetters('loginModule', ['residentialId'])
  },
  watch: {
    isOpen () {
      if (this.isOpen) {
        this.clear()
        this.getAnnouncement()
      }
    }
  },
  mounted () {
    if (this.isOpen) {
      this.getAnnouncement()
    }
  }
}
</script>
<style scoped>
.content {
  white-space: break-spaces;
}
</style>
