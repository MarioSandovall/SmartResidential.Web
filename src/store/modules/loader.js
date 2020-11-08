const state = {
  isLoading: false
}

const mutations = {
  open () {
    state.isLoading = true
  },
  close () {
    state.isLoading = false
  }
}

const namespaced = true

export default {
  state,
  mutations,
  namespaced
}
