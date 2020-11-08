<template>
  <v-container>
    <v-card>
      <v-card-title>
        <label class="title">{{ $t('user.users') }}</label>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="users"
          :items-per-page="itemsPerPage"
          :loading="isLoading"
          :options.sync="options"
          :server-items-length="totalOfItems"
          :no-data-text="$t('table.no_data_available')"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-text-field
                v-model="filter"
                :label="$t('table.filter')"
                append-icon="mdi-magnify"
                single-line
                hide-details
              ></v-text-field>
              <v-spacer></v-spacer>
              <template>
                <v-btn
                  class="mx-2"
                  fab
                  small
                  color="primary"
                  @click="isAddDialogOpen = true"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-icon
                  medium
                  color="blue"
                  class="mr-2"
                  v-on="on"
                  @click="resendEmail(item.id)"
                  >mdi-email</v-icon
                >
              </template>
              <span>{{ $t('button.resend_invitation') }}</span>
            </v-tooltip>
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-icon
                  medium
                  color="blue"
                  class="mr-2"
                  v-on="on"
                  @click="edit(item.id)"
                  >mdi-pencil</v-icon
                >
              </template>
              <span>{{ $t('button.edit') }}</span>
            </v-tooltip>
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-icon
                  medium
                  color="blue"
                  class="mr-2"
                  v-on="on"
                  @click="remove(item.id)"
                  >mdi-delete</v-icon
                >
              </template>
              <span>{{ $t('button.remove') }}</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog max-width="800" persistent v-model="isAddDialogOpen">
      <AddUser
        @close="isAddDialogOpen = false"
        @saved="saved"
        :isOpen="isAddDialogOpen"
      ></AddUser>
    </v-dialog>
    <v-dialog max-width="800" persistent v-model="isEditDialogOpen">
      <EditUser
        @close="isEditDialogOpen = false"
        @saved="saved"
        :isOpen="isEditDialogOpen"
        :userId="userIdToEdit"
      ></EditUser>
    </v-dialog>
    <v-dialog
      max-width="500"
      persistent
      v-model="isConfirmationDialogToRemoveOpen"
    >
      <ConfirmationDialog
        :title="$t('button.remove')"
        :content="$t('message.are_you_sure_you_want_to_remove_this_item')"
        btnColor="error"
        @save="removed"
        @close="isConfirmationDialogToRemoveOpen = false"
      ></ConfirmationDialog>
    </v-dialog>
    <v-dialog
      max-width="500"
      persistent
      v-model="isConfirmationDialogToResendOpen"
    >
      <ConfirmationDialog
        :title="$t('button.resend_invitation')"
        :content="$t('email.are_you_sure_you_want_to_resend_the_invitation')"
        btnColor="primary"
        @save="resentEmail"
        @close="isConfirmationDialogToResendOpen = false"
      ></ConfirmationDialog>
    </v-dialog>
  </v-container>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex'

import AddUser from './AddUser'
import EditUser from './EditUser'
import debounce from '../../utils/debounce'
import ConfirmationDialog from '../Shared/ConfirmationDialog/ConfirmationDialog'

export default {
  name: 'User',
  components: {
    AddUser,
    EditUser,
    ConfirmationDialog
  },
  data: () => ({
    page: 1,
    itemsPerPage: 5,
    totalOfItems: 0,
    sortBy: undefined,
    isSortDesc: undefined,
    options: {},
    filter: '',
    isLoading: false,
    users: [],
    isAddDialogOpen: false,
    isEditDialogOpen: false,
    isConfirmationDialogToRemoveOpen: false,
    isConfirmationDialogToResendOpen: false,
    userIdToRemove: 0,
    userIdToEdit: 0,
    userIdToResendEmail: 0
  }),
  methods: {
    ...mapMutations('snackbarModule', ['showErrorMessage', 'showSuccessMessage']),
    getAll () {
      this.isLoading = true
      const params = this.params
      this.$proxy.get(`residential/${this.residentialId}/user`, { params })
        .then((response) => {
          this.users = response.data.items
          this.totalOfItems = response.data.totalOfItems
        }).catch((e) => {
          const message = e?.response?.data || this.$t('message.something_went_wrong')
          this.showErrorMessage(message)
        }).finally(() => {
          this.isLoading = false
        })
    },
    saved () {
      this.isAddDialogOpen = false
      this.isEditDialogOpen = false
      this.getAll()
    },
    edit (id) {
      this.userIdToEdit = id
      this.isEditDialogOpen = true
    },
    remove (id) {
      this.userIdToRemove = id
      this.isConfirmationDialogToRemoveOpen = true
    },
    removed () {
      this.isLoading = true
      this.isConfirmationDialogToRemoveOpen = false
      this.$proxy.delete(`residential/${this.residentialId}/user/${this.userIdToRemove}`)
        .then((response) => {
          const message = this.$t('message.successfully_removed')
          this.showSuccessMessage(message)
          this.getAll()
        }).catch((e) => {
          const message = e?.response?.data || this.$t('message.something_went_wrong')
          this.showErrorMessage(message)
        }).finally(() => {
          this.isLoading = false
        })
    },
    resendEmail (id) {
      this.userIdToResendEmail = id
      this.isConfirmationDialogToResendOpen = true
    },
    resentEmail () {
      this.isLoading = true
      this.isConfirmationDialogToResendOpen = false
      this.$proxy.get(`residential/${this.residentialId}/user/resend-invitation/${this.userIdToResendEmail}`)
        .then((response) => {
          const message = this.$t('email.email_has_been_sent')
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
    ...mapGetters('loginModule', ['residentialId']),
    headers () {
      return [
        { text: this.$t('user.field.name'), value: 'name' },
        { text: this.$t('user.field.last_name'), value: 'lastName' },
        { text: this.$t('user.field.email'), value: 'email' },
        { text: this.$t('user.field.role_names'), value: 'roleNames' },
        { text: '', value: 'actions', sortable: false }
      ]
    },
    params () {
      const params = new URLSearchParams()

      params.append('page', this.page)

      params.append('itemsPerPage', this.itemsPerPage)

      if (this.sortBy !== undefined) {
        params.append('sortBy', this.sortBy)
      }

      if (this.isSortDesc !== undefined) {
        params.append('isSortDesc', this.isSortDesc)
      }

      if (this.filter !== undefined && this.filter !== '') {
        params.append('filter', this.filter)
      }

      return params
    }
  },
  watch: {
    options: {
      handler () {
        const { sortBy, sortDesc, page, itemsPerPage } = this.options

        this.page = page
        this.itemsPerPage = itemsPerPage
        this.sortBy = sortBy.length > 0 ? sortBy[0] : undefined
        this.isSortDesc = sortDesc.length > 0 ? sortDesc[0] : undefined

        this.getAll()
      },
      deep: true
    },
    filter: debounce(function () {
      this.getAll()
    }, 500)
  }
}
</script>
