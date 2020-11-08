<template>
  <v-form ref="form" v-model="isFormValid">
    <v-card>
      <v-card-title>
        <label class="title">{{ $t('house.new_house') }}</label>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field
                :label="$t('house.field.name')"
                required
                v-model="house.name"
                :counter="50"
                :rules="rules.name"
              />
            </v-col>
            <v-col>
              <v-text-field
                :label="$t('house.field.street')"
                required
                v-model="house.street"
                :counter="200"
                :rules="rules.street"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                :label="$t('house.field.interior_number')"
                required
                v-model="house.interiorNumber"
                :counter="10"
                :rules="rules.interiorNumber"
              />
            </v-col>
            <v-col>
              <v-text-field
                :label="$t('house.field.outdoor_number')"
                required
                v-model="house.outdoorNumber"
                :counter="10"
                :rules="rules.outdoorNumber"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <UserSearch
                :users="users"
                :usersSelected="house.users"
                @usersChanged="usersChanged"
                @selectChanged="selectChanged"
              ></UserSearch>
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

import UserSearch from '../Shared/UserSearch/UserSearch'

export default {
  name: 'AddHouse',
  props: {
    isOpen: { type: Boolean, required: true }
  },
  components: {
    UserSearch
  },
  data: (vm) => ({
    isLoading: false,
    isFormValid: null,
    users: [],
    house: {
      name: '',
      street: '',
      interiorNumber: '',
      outdoorNumber: '',
      residentialId: 0,
      users: []
    },
    rules: {
      name: [
        v => !!v || vm.$t('house.rule.name_is_required'),
        v => !v || v.length <= 50 || vm.$t('house.rule.name_must_be_equal_to_or_less_than_50')
      ],
      street: [
        v => !!v || vm.$t('house.rule.street_is_required'),
        v => !v || v.length <= 200 || vm.$t('house.rule.street_must_be_equal_to_or_less_than_200')
      ],
      interiorNumber: [
        v => !v || v.length <= 10 || vm.$t('house.rule.interior_number_must_be_equal_to_or_less_than_10')
      ],
      outdoorNumber: [
        v => !v || v.length <= 10 || vm.$t('house.rule.outdoor_number_must_be_equal_to_or_less_than_10')
      ]
    }
  }),
  methods: {
    ...mapMutations('snackbarModule', ['showErrorMessage', 'showSuccessMessage']),
    clear () {
      this.house = {
        name: '',
        street: '',
        interiorNumber: '',
        outdoorNumber: '',
        residentialId: 0
      }
      this.$refs.form.reset()
    },
    save () {
      this.isLoading = true
      this.house.residentialId = this.residentialId
      this.$proxy.post(`residential/${this.residentialId}/house`, this.house)
        .then(() => {
          this.$emit('saved')
          const message = this.$t('message.successfully_saved')
          this.showSuccessMessage(message)
        }).catch((e) => {
          const message = e?.response?.data || this.$t('message.something_went_wrong')
          this.showErrorMessage(message)
        }).finally(() => {
          this.isLoading = false
        })
    },
    usersChanged (users) {
      this.users = users
    },
    selectChanged (users) {
      this.house.users = users
    }
  },
  computed: {
    ...mapGetters('loginModule', ['residentialId'])
  },
  watch: {
    isOpen () {
      if (this.isOpen) {
        this.clear()
      }
    }
  }
}
</script>
