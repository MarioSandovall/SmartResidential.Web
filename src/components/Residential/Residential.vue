<template>
  <v-container>
    <v-card>
      <v-card-title>
        <h1 class="title">{{ $t('residential.residentials') }}</h1>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="residentials"
        :items-per-page="5"
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
              <v-btn class="mx-2" fab dark small color="primary" @click="isAddDialogOpen = true">
                <v-icon dark>mdi-plus</v-icon>
              </v-btn>
            </template>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-tooltip left>
            <template v-slot:activator="{ on }">
              <v-icon medium color="blue" class="mr-2" v-on="on" @click="edit(item.id)">mdi-pencil</v-icon>
            </template>
            <span>{{ $t('button.edit') }}</span>
          </v-tooltip>
          <v-tooltip left>
            <template v-slot:activator="{on}">
              <v-icon
                medium
                color="blue"
                class="mr-2"
                v-on="on"
                @click="redirectToHouse(item.id)"
              >mdi-home</v-icon>
            </template>
            <span>{{ $t('button.houses') }}</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog max-width="800" persistent v-model="isAddDialogOpen">
      <AddResidential
        @close="isAddDialogOpen = false"
        @saved="savedResidential"
        :isOpen="isAddDialogOpen"
      ></AddResidential>
    </v-dialog>
    <v-dialog max-width="800" persistent v-model="isEditDialogOpen">
      <EditResidential
        @close="isEditDialogOpen = false"
        :id="residentialId"
        :isOpen="isEditDialogOpen"
        @saved="editedResidential"
      ></EditResidential>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex'
import AddResidential from './AddResidenital'
import EditResidential from './EditResidential'

export default {
  name: 'Residential',
  components: {
    AddResidential,
    EditResidential
  },
  data: () => ({
    filter: '',
    residentialId: 0,
    isLoading: false,
    isAddDialogOpen: false,
    isEditDialogOpen: false,
    page: 1,
    itemsPerPage: 5,
    totalOfItems: 0,
    sortBy: undefined,
    isSortDesc: undefined,
    options: {},
    residentials: []
  }),
  methods: {
    getAll () {
      this.isLoading = true
      const params = this.params
      this.$proxy.get('residential', { params })
        .then((response) => {
          this.residentials = response.data.items
          this.totalOfItems = response.data.totalOfItems
        }).catch((e) => {
          const message = this.$t('residential.message.could_not_retrieve_residentials')
          this.showErrorMessage(message)
        }).finally(() => {
          this.isLoading = false
        })
    },
    edit (id) {
      this.residentialId = id
      this.isEditDialogOpen = true
    },
    savedResidential () {
      this.isAddDialogOpen = false
      this.getAll()
    },
    editedResidential () {
      this.isEditDialogOpen = false
      this.getAll()
    },
    redirectToHouse (residentialId) {
      this.$router.push({ name: 'house', params: { id: residentialId } })
    }
  },
  computed: {
    ...mapMutations('snackbarModule', ['showErrorMessage']),
    headers () {
      return [
        { text: this.$t('residential.field.name'), value: 'name' },
        { text: this.$t('residential.field.status'), value: 'status' },
        { text: this.$t('residential.field.address'), value: 'address' },
        { text: this.$t('residential.field.land_phone'), value: 'landPhone' },
        { text: this.$t('residential.field.cell_phone'), value: 'cellphone' },
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
    filter () {
      this.getAll()
    }
  }
}
</script>
