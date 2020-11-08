import { SNACKBAR_COLOR } from '../../utils/constants'

class Snackbar {
  message = ''
  color = ''
  left = false
  right = false
  top = false
  bottom = true
  multiLine = false
  vertical = false
  visible = false
  timeout = 6000

  showErrorMessage (message) {
    this.visible = true
    this.message = message
    this.color = SNACKBAR_COLOR.ERROR
  }

  showSuccessMessage (message) {
    this.visible = true
    this.message = message
    this.color = SNACKBAR_COLOR.SUCCESS
  }

  showInfoMessage (message) {
    this.visible = true
    this.message = message
    this.color = SNACKBAR_COLOR.INFO
  }
}

const state = {
  snackbar: new Snackbar()
}

const mutations = {
  showErrorMessage (state, message) {
    state.snackbar.showErrorMessage(message)
  },
  showSuccessMessage (state, message) {
    state.snackbar.showSuccessMessage(message)
  },
  showInfoMessage (state, message) {
    state.snackbar.showInfoMessage(message)
  }
}
const namespaced = true

export default {
  namespaced,
  state,
  mutations
}
