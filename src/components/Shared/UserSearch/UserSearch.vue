<template>
  <v-autocomplete
    v-model="usersLocalSelected"
    :items="usersLocal"
    :loading="isLoading"
    :search-input.sync="search"
    hide-no-data
   :label="$t('user_search.users')"
    item-text="fullName"
    chips
    multiple
    return-object
  >
    <template v-slot:selection="data">
      <v-chip
        close
        v-bind="data.attrs"
        :input-value="data.selected"
        @click="data.select"
        @click:close="removeUser(data.item)"
      >
        <v-avatar left>
          <v-icon medium>mdi-account</v-icon>
        </v-avatar>
        {{ data.item.fullName }}
      </v-chip>
    </template>
    <template v-slot:item="data">
      <template v-if="typeof data.item !== 'object'">
        <v-list-item-content v-text="data.item"></v-list-item-content>
      </template>
      <template v-else>
        <v-list-item-avatar>
          <v-icon large>mdi-account</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-html="data.item.fullName"></v-list-item-title>
          <v-list-item-subtitle v-html="data.item.email"></v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </template>
  </v-autocomplete>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex'

import debounce from '../../../utils/debounce'

export default {
  name: 'UserSearch',
  props: {
    users: { type: Array, default: () => [] },
    usersSelected: { type: Array, required: true }
  },
  data: () => ({
    isLoading: false,
    search: null
  }),
  methods: {
    ...mapMutations('snackbarModule', ['showErrorMessage']),
    searchUser () {
      const params = new URLSearchParams()
      params.append('name', this.search)

      this.isLoading = true
      this.$proxy.get(`residential/${this.residentialId}/user/search`, { params })
        .then((response) => {
          this.usersLocal = response.data.users
        }).catch((e) => {
          const message = e?.response?.data || this.$t('message.something_went_wrong')
          this.showErrorMessage(message)
        }).finally(() => {
          this.isLoading = false
        })
    },
    isEmpty (value) {
      return value === undefined || value === null || value === ''
    },
    removeUser (user) {
      const index = this.usersSelected.findIndex(x => x.id === user.id)
      if (index >= 0) this.usersSelected.splice(index, 1)
    }
  },
  computed: {
    ...mapGetters('loginModule', ['residentialId']),
    usersLocalSelected: {
      get: function () {
        return this.usersSelected
      },
      set: function (users) {
        this.$emit('selectChanged', users)
      }
    },
    usersLocal: {
      get: function () {
        return this.users
      },
      set: function (users) {
        this.$emit('usersChanged', users)
      }
    }
  },
  watch: {
    search: debounce(function () {
      if (!this.isUserLoading && !this.isEmpty(this.search)) {
        this.searchUser()
      }
    }, 500)
  }
}
</script>
