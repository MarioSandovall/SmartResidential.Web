<template>
  <v-container>
    <v-row class="align-self-start">
      <v-btn
        v-if="isAdmin"
        elevation="2"
        absolute
        left
        fab
        small
        color="primary"
        @click="isAddDialogOpen = true"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-row>
    <v-row
      fill-height
      v-if="isLoading"
      class="d-flex align-content-center justify-center flex-wrap"
    >
      <v-progress-circular
        :size="50"
        indeterminate
        color="primary"
      ></v-progress-circular>
    </v-row>

    <v-row v-else class="align-self-start">
      <v-card
        width="420px"
        height="200px"
        v-for="announcement in announcements"
        :key="announcement.id"
        class="ma-2"
      >
        <v-card-title>{{ announcement.title }}</v-card-title>
        <v-card-subtitle class="text">
          {{ announcement.information }}
        </v-card-subtitle>
        <v-card-text class="text">
          {{ announcement.description }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                fab
                small
                v-on="on"
                class="mx-2"
                color="primary"
                @click="view(announcement.id)"
              >
                <v-icon dark>mdi-newspaper</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('button.view') }}</span>
          </v-tooltip>
          <v-tooltip bottom v-if="isAdmin">
            <template v-slot:activator="{ on }">
              <v-btn
                fab
                small
                v-on="on"
                class="mx-2"
                color="primary"
                @click="edit(announcement.id)"
              >
                <v-icon dark> mdi-pencil </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('button.edit') }}</span>
          </v-tooltip>
          <v-tooltip bottom v-if="isAdmin">
            <template v-slot:activator="{ on }">
              <v-btn
                fab
                small
                v-on="on"
                class="mx-2"
                color="primary"
                @click="resendEmail(announcement.id)"
              >
                <v-icon dark> mdi-email </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('button.resend_email') }}</span>
          </v-tooltip>
          <v-tooltip bottom v-if="isAdmin">
            <template v-slot:activator="{ on }">
              <v-btn
                fab
                small
                v-on="on"
                class="mx-2"
                color="error"
                @click="remove(announcement.id)"
              >
                <v-icon dark> mdi-delete </v-icon>
              </v-btn>
            </template>
            {{ $t('button.remove') }}
          </v-tooltip>
        </v-card-actions>
      </v-card>
    </v-row>

    <v-dialog max-width="800" persistent v-model="isAddDialogOpen">
      <AddAnnouncement
        :isOpen="isAddDialogOpen"
        @saved="saved"
        @close="isAddDialogOpen = false"
      ></AddAnnouncement>
    </v-dialog>
    <v-dialog max-width="800" persistent v-model="isEditDialogOpen">
      <EditAnnouncement
        :isOpen="isEditDialogOpen"
        :announcementId="announcementIdToEdit"
        @saved="saved"
        @close="isEditDialogOpen = false"
      ></EditAnnouncement>
    </v-dialog>
    <v-dialog max-width="800" persistent v-model="isViewDialogOpen">
      <ViewAnnouncement
        :isOpen="isViewDialogOpen"
        :announcementId="announcementIdToView"
        @close="isViewDialogOpen = false"
      ></ViewAnnouncement>
    </v-dialog>
    <v-dialog max-width="500" persistent v-model="isConfirmationDialogOpen">
      <ConfirmationDialog
        :title="$t('button.remove')"
        :content="$t('message.are_you_sure_you_want_to_remove_this_item')"
        btnColor="error"
        @close="isConfirmationDialogOpen = false"
        @save="removed"
      >
      </ConfirmationDialog>
    </v-dialog>
    <v-dialog
      max-width="500"
      persistent
      v-model="isConfirmationDialogToResendOpen"
    >
      <ConfirmationDialog
        :title="$t('button.resend_email')"
        :content="$t('email.are_you_sure_you_want_to_resend_the_email')"
        btnColor="primary"
        @save="resentEmail"
        @close="isConfirmationDialogToResendOpen = false"
      ></ConfirmationDialog>
    </v-dialog>
  </v-container>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex'

import AddAnnouncement from '../Announcement/AddAnnouncement'
import EditAnnouncement from '../Announcement/EditAnnouncement'
import ViewAnnouncement from '../Announcement/ViewAnnouncement'
import ConfirmationDialog from '../Shared//ConfirmationDialog/ConfirmationDialog'

export default {
  name: 'Announcement',
  components: {
    AddAnnouncement,
    EditAnnouncement,
    ViewAnnouncement,
    ConfirmationDialog
  },
  data: () => ({
    isLoading: false,
    isAddDialogOpen: false,
    isEditDialogOpen: false,
    isViewDialogOpen: false,
    isConfirmationDialogOpen: false,
    isConfirmationDialogToResendOpen: false,
    announcementIdToEdit: 0,
    announcementIdToView: 0,
    announcementIdToRemove: 0,
    announcementIdToResendEmail: 0,
    announcements: []
  }),
  methods: {
    ...mapMutations('snackbarModule', ['showErrorMessage', 'showSuccessMessage']),
    getAll () {
      this.isLoading = true
      this.$proxy.get(`residential/${this.residentialId}/announcement`)
        .then((response) => {
          this.announcements = response.data.announcements
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
      this.isEditDialogOpen = true
      this.announcementIdToEdit = id
    },
    remove (id) {
      this.announcementIdToRemove = id
      this.isConfirmationDialogOpen = true
    },
    removed () {
      this.isConfirmationDialogOpen = false
      this.$proxy.delete(`residential/${this.residentialId}/announcement/${this.announcementIdToRemove}`)
        .then((response) => {
          const message = this.$t('message.successfully_removed')
          this.showSuccessMessage(message)
          this.getAll()
        }).catch((e) => {
          const message = e?.response?.data || this.$t('message.something_went_wrong')
          this.showErrorMessage(message)
        })
    },
    resendEmail (id) {
      this.announcementIdToResendEmail = id
      this.isConfirmationDialogToResendOpen = true
    },
    resentEmail () {
      this.isConfirmationDialogToResendOpen = false
      this.$proxy.get(`residential/${this.residentialId}/announcement/resend-email/${this.announcementIdToResendEmail}`)
        .then((response) => {
          const message = this.$t('email.email_has_been_sent')
          this.showSuccessMessage(message)
        }).catch((e) => {
          const message = e?.response?.data || this.$t('message.something_went_wrong')
          this.showErrorMessage(message)
        })
    },
    view (id) {
      this.isViewDialogOpen = true
      this.announcementIdToView = id
    }
  },
  computed: {
    ...mapGetters('loginModule', ['residentialId', 'isAdmin'])
  },
  mounted () {
    this.getAll()
  }
}
</script>
<style scoped>
.card-outter {
  position: relative;
  padding-bottom: 50px;
}
.card-actions {
  position: absolute;
  bottom: 0;
  margin: 5px;
}
.text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
