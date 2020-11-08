<template>
  <v-form ref="form" v-model="isFormValid">
    <v-card>
      <v-card-title>
        <label class="title">{{ $t('expense_category.new_expense_category') }}</label>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field
                :label="$t('expense_category.field.name')"
                required
                v-model="category.name"
                :counter="50"
                :rules="rules.name"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea
                :label="$t('expense_category.field.description')"
                v-model="category.description"
                :counter="500"
                :rules="rules.description"
              ></v-textarea>
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
import { mapMutations, mapGetters } from 'vuex'

export default {
  name: 'AddExpenseCategory',
  props: {
    isOpen: { type: Boolean, required: true }
  },
  data: (vm) => ({
    isLoading: false,
    isFormValid: null,
    category: {
      name: '',
      description: '',
      residentialId: 0
    },
    rules: {
      name: [
        v => !!v || vm.$t('rule.this_field_is_required'),
        v => !v || v.length <= 50 || vm.$t('rule.value_exceeds_maximum_allowed_length')
      ],
      description: [
        v => !v || v.length <= 500 || vm.$t('rule.value_exceeds_maximum_allowed_length')
      ]
    }
  }),
  methods: {
    ...mapMutations('snackbarModule', ['showErrorMessage', 'showSuccessMessage']),
    clear () {
      this.category = {
        name: '',
        description: '',
        residentialId: 0
      }
      this.$refs.form.reset()
    },
    save () {
      this.isLoading = true
      this.category.residentialId = this.residentialId
      this.$proxy.post(`residential/${this.residentialId}/expense-category`, this.category)
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
      }
    }
  }
}
</script>
