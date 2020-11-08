<template>
  <v-form ref="form" v-model="isFormValid">
    <v-card>
      <v-card-title>
        <label class="title">{{ $t('residential.edit_residential') }}</label>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field
                :label="$t('residential.field.name')"
                required
                v-model="residential.name"
                :rules="nameRules"
                :counter="50"
              />
            </v-col>
            <v-col>
              <v-select
                :label="$t('residential.field.status')"
                :items="status"
                required
                item-text="name"
                item-value="id"
                :loading="isStatusLoading"
                v-model="residential.statusId"
                :rules="statusRules"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                :label="$t('residential.field.land_phone')"
                v-model="residential.landPhone"
                :rules="landPhoneRules"
                counter="20"
              />
            </v-col>
            <v-col>
              <v-text-field
                :label="$t('residential.field.cell_phone')"
                v-model="residential.cellphone"
                :rules="cellphoneRules"
                counter="20"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                :label="$t('residential.field.address')"
                v-model="residential.address"
                :rules="addressRules"
                counter="300"
                class="ma-1"
              />
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
        >{{ $t('button.save') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  props: {
    id: { type: Number, required: true },
    isOpen: { type: Boolean, required: true, default: false }
  },
  name: 'EditResidential',
  data: (vm) => ({
    isLoading: false,
    isStatusLoading: false,
    isFormValid: null,
    status: [],
    residential: {
      name: '',
      address: '',
      cellphone: '',
      landPhone: '',
      statusId: 0
    },
    nameRules: [
      v => !!v || vm.$t('residential.rule.name_is_required'),
      v => !v || v.length <= 50 || vm.$t('residential.rule.name_must_be_equal_to_or_less_than_50')
    ],
    statusRules: [
      v => !!v || vm.$t('residential.rule.status_is_required')
    ],
    addressRules: [
      v => !v || v.length < 300 || vm.$t('residential.rule.address_must_be_equal_to_or_less_than_300')
    ],
    landPhoneRules: [
      v => !v || v.length < 20 || vm.$t('residential.rule.land_phone_must_be_equal_to_or_less_than_20')
    ],
    cellphoneRules: [
      v => !v || v.length < 20 || vm.$t('residential.rule.cell_phone_must_be_equal_to_or_less_than_20')
    ]
  }),
  methods: {
    ...mapMutations('snackbarModule', ['showErrorMessage', 'showSuccessMessage']),
    clear () {
      this.$refs.form.reset()
    },
    save () {
      this.isLoading = true
      this.$proxy.put(`residential/${this.id}`, this.residential)
        .then(() => {
          this.$emit('saved')
          const message = this.$t('message.successfully_saved')
          this.showSuccessMessage(message)
        }).catch((error) => {
          let message = this.$t('message.something_went_wrong')
          if (error.response) {
            switch (error.response.status) {
              case 400:
                message = this.$t('message.bad_request')
            }
          }
          this.showErrorMessage(message)
        }).finally(() => {
          this.isLoading = false
        })
    },
    getResidential () {
      this.isLoading = true
      this.$proxy.get(`residential/${this.id}`)
        .then((response) => {
          this.residential = response.data
        }).catch((e) => {
          const message = this.$t('residential.message.could_not_retrieve_residential_information')
          this.showErrorMessage(message)
        }).finally(() => {
          this.isLoading = false
        })
    },
    getStatus () {
      this.isStatusLoading = true
      this.$proxy.get('residential/status')
        .then((response) => {
          this.status = response.data.status
        }).catch((e) => {
          const message = this.$t('residential.message.could_not_retrieve_residential_status')
          this.showErrorMessage(message)
        }).finally(() => {
          this.isStatusLoading = false
        })
    }
  },
  watch: {
    isOpen () {
      if (this.isOpen) {
        this.clear()
        this.getStatus()
        this.getResidential()
      }
    }
  },
  mounted () {
    if (this.isOpen) {
      this.getStatus()
      this.getResidential()
    }
  }
}
</script>
