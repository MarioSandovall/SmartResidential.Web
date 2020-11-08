<template>
  <v-form ref="form" v-model="isFormValid">
    <v-card>
      <v-card-title>
        <label class="title">{{ $t('announcement.edit_announcement') }}</label>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field
                required
                :counter="20"
                :label="$t('announcement.title')"
                v-model="announcement.title"
                :rules="rules.title"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea
                required
                :counter="2000"
                :label="$t('announcement.description')"
                v-model="announcement.description"
                :rules="rules.description"
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-checkbox
                :label="$t('announcement.send_email')"
                v-model="announcement.canSendEmail"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('close')">{{ $t('button.close') }}</v-btn>
        <v-btn
          color="primary"
          @click="save"
          :disabled="!isFormValid"
          :loading="isLoading"
          >{{ $t('button.save') }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-form>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex'

export default {
  name: 'EditAnnouncement',
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
      residentialId: 0,
      canSendEmail: false
    },
    rules: {
      title: [
        v => !!v || vm.$t('rule.this_field_is_required'),
        v => !v || v.length <= 20 || vm.$t('rule.value_exceeds_maximum_allowed_length')
      ],
      description: [
        v => !!v || vm.$t('rule.this_field_is_required'),
        v => !v || v.length <= 2000 || vm.$t('rule.value_exceeds_maximum_allowed_length')
      ]
    }
  }),
  methods: {
    ...mapMutations('snackbarModule', ['showErrorMessage', 'showSuccessMessage']),
    clear () {
      this.announcement = {
        id: 0,
        title: '',
        description: '',
        residentialId: 0,
        canSendEmail: false
      }
      this.$refs.form.reset()
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
    },
    save () {
      this.isLoading = true
      this.$proxy.put(`residential/${this.residentialId}/announcement/${this.announcementId}`, this.announcement)
        .then((response) => {
          this.$emit('saved')
          const message = this.$t('message.successfully_saved')
          this.showSuccessMessage(message)
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
