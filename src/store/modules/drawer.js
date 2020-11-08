const state = {
  drawer: false
}

const mutations = {
  openDrawer () {
    state.drawer = true
  },
  closeDrawer (state) {
    state.drawer = false
  }
}

const namespaced = true

export default {
  namespaced,
  state,
  mutations
}
