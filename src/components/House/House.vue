<template>
  <v-container>
    <v-card>
      <v-card-title>
        <label class="title">{{ $t('house.houses') }}</label>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="houses"
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
      <AddHouse
        @close="isAddDialogOpen = false"
        @saved="houseSaved"
        :isOpen="isAddDialogOpen"
      ></AddHouse>
    </v-dialog>
    <v-dialog max-width="800" persistent v-model="isEditDialogOpen">
      <EditHouse
        @close="isEditDialogOpen = false"
        @saved="houseSaved"
        :isOpen="isEditDialogOpen"
        :houseId="houseIdToEdit"
      ></EditHouse>
    </v-dialog>
    <v-dialog max-width="500" persistent v-model="isConfirmationDialogOpen">
      <ConfirmationDialog
        :title="$t('button.remove')"
        :content="$t('message.are_you_sure_you_want_to_remove_this_item')"
        btnColor="error"
        @close="isConfirmationDialogOpen = false"
        @save="houseRemoved"
      >
      </ConfirmationDialog>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

import AddHouse from './AddHouse'
import EditHouse from './EditHouse'
import debounce from '../../utils/debounce'
import ConfirmationDialog from '../Shared/ConfirmationDialog/ConfirmationDialog'

export default {
  name: 'House',
  components: {
    AddHouse,
    EditHouse,
    ConfirmationDialog
  },
  data: () => ({
    page: 1,
    itemsPerPage: 5,
    filter: '',
    houseIdToEdit: 0,
    houseIdToRemove: 0,
    totalOfItems: 0,
    isLoading: false,
    sortBy: undefined,
    isSortDesc: undefined,
    options: {},
    houses: [],
    isAddDialogOpen: false,
    isEditDialogOpen: false,
    isConfirmationDialogOpen: false
  }),
  methods: {
    ...mapMutations('snackbarModule', ['showErrorMessage', 'showSuccessMessage']),
    getAll () {
      this.isLoading = true
      const params = this.params
      this.$proxy.get(`residential/${this.residentialId}/house`, { params })
        .then((response) => {
          this.houses = response.data.items
          this.totalOfItems = response.data.totalOfItems
        }).catch((e) => {
          const message = e?.response?.data || this.$t('message.something_went_wrong')
          this.showErrorMessage(message)
        }).finally(() => {
          this.isLoading = false
        })
    },
    houseSaved () {
      this.isAddDialogOpen = false
      this.isEditDialogOpen = false
      this.getAll()
    },
    edit (id) {
      this.houseIdToEdit = id
      this.isEditDialogOpen = true
    },
    remove (id) {
      this.houseIdToRemove = id
      this.isConfirmationDialogOpen = true
    },
    houseRemoved () {
      this.isLoading = true
      this.isConfirmationDialogOpen = false
      this.$proxy.delete(`residential/${this.residentialId}/house/${this.houseIdToRemove}`)
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
    }
  },
  computed: {
    ...mapGetters('loginModule', ['residentialId']),
    headers () {
      return [
        { text: this.$t('house.field.name'), value: 'name' },
        { text: this.$t('house.field.street'), value: 'street' },
        { text: this.$t('house.field.users'), value: 'users', sortable: false },
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
