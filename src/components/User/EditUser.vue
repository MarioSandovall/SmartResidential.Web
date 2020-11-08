<template>
  <v-form ref="form" v-model="isFormValid">
    <v-card>
      <v-card-title>
        <label class="title">{{ $t('user.edit_user') }}</label>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field
                :label="$t('user.field.name')"
                required
                v-model="user.name"
                :counter="50"
                :rules="rules.name"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                :label="$t('user.field.last_name')"
                v-model="user.lastName"
                :counter="50"
                :rules="rules.lastName"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-select
                multiple
                :items="roles"
                :loading="isRoleLoading"
                :label="$t('user.field.role')"
                item-value="id"
                item-text="name"
                :rules="rules.roles"
                v-model="user.roles"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                :label="$t('user.field.email')"
                required
                v-model="user.email"
                :counter="50"
                :rules="rules.email"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                :label="$t('user.field.password')"
                required
                v-model="user.password"
                :counter="50"
                :rules="rules.password"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                :label="$t('user.field.land_phone')"
                v-model="user.landPhone"
                :counter="20"
                :rules="rules.landPhone"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                :label="$t('user.field.cell_phone')"
                v-model="user.cellPhone"
                :counter="20"
                :rules="rules.cellPhone"
              ></v-text-field>
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
          :disabled="!isFormValid || isLoading || isRoleLoading"
          :loading="isLoading"
        >{{ $t('button.save') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex'

import emailValidator from '../../utils/emialValidator'
export default {
  name: 'EditUser',
  props: {
    isOpen: { type: Boolean, required: true },
    userId: { type: Number, required: true }
  },
  data: (vm) => ({
    isLoading: false,
    isRoleLoading: false,
    isFormValid: null,
    roles: [],
    user: {
      id: 0,
      name: '',
      lastName: '',
      email: '',
      password: '',
      landPhone: '',
      cellPhone: '',
      residentialId: 0,
      roles: []
    },
    rules: {
      name: [
        v => !!v || vm.$t('user.rule.name_is_required'),
        v => !v || v.length <= 50 || vm.$t('user.rule.name_must_be_equal_to_or_less_than_50')
      ],
      lastName: [
        v => !v || v.length <= 50 || vm.$t('user.rule.last_name_must_be_equal_to_or_less_than_50')
      ],
      email: [
        v => !!v || vm.$t('user.rule.email_is_required'),
        v => !v || v.length <= 50 || vm.$t('user.rule.email_must_be_equal_to_or_less_than_50'),
        v => emailValidator.isValid(v) || vm.$t('user.rule.invalid_email_address')
      ],
      password: [
        v => !!v || vm.$t('user.rule.password_is_required'),
        v => !v || v.length <= 50 || vm.$t('user.rule.password_must_be_equal_to_or_less_than_50')
      ],
      landPhone: [
        v => !v || v.length <= 20 || vm.$t('user.rule.land_phone_must_be_equal_to_or_less_than_20')
      ],
      cellPhone: [
        v => !v || v.length <= 20 || vm.$t('user.rule.cell_phone_must_be_equal_to_or_less_than_20')
      ],
      roles: [
        v => v.length > 0 || vm.$t('user.rule.role_is_required')
      ]
    }
  }),
  methods: {
    ...mapMutations('snackbarModule', ['showErrorMessage', 'showSuccessMessage']),
    clear () {
      this.user = {
        id: 0,
        name: '',
        lastName: '',
        password: '',
        landPhone: '',
        cellPhone: '',
        roles: []
      }
      this.$refs.form.reset()
    },
    save () {
      this.isLoading = true
      this.$proxy.put(`residential/${this.residentialId}/user/${this.userId}`, this.user)
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
    },
    getRoles () {
      this.isRoleLoading = true
      this.$proxy.get(`residential/${this.residentialId}/user/role`)
        .then((response) => {
          this.roles = response.data.roles
        }).catch((e) => {
          const message = e?.response?.data || this.$t('message.something_went_wrong')
          this.showErrorMessage(message)
        }).finally(() => {
          this.isRoleLoading = false
        })
    },
    getUser () {
      this.isLoading = true
      this.$proxy.get(`residential/${this.residentialId}/user/${this.userId}`)
        .then((response) => {
          this.user = response.data
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
        this.getUser()
      }
    }
  },
  mounted () {
    this.getUser()
    this.getRoles()
  }
}
</script>
