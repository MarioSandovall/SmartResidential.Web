import menuService from '../../services/menuService'
import axiosService from '../../services/axiosService'
import { SMART_RESIDENTIAL, ROLES } from '../../utils/constants'

class User {
  id = 0
  name = ''
  email = ''
  roles = []
  residential = ''
  residentialId = 0
  isAuthenticated = false
}

const state = {
  user: new User(),
  isLogoutConfirmationOpen: false,
  token: window.localStorage.getItem(SMART_RESIDENTIAL.TOKEN) || null
}

const actions = {
  login ({ commit }, user) {
    commit('login', user)
  },
  setToken ({ commit }, token) {
    commit('setToken', token)
  },
  isLogoutConfirmationOpen ({ commit }, isOpen) {
    commit('isLogoutConfirmationOpen', isOpen)
  },
  logout ({ commit }) {
    commit('logout')
  }
}

const mutations = {
  login (state, user) {
    state.user = new User()
    state.user.id = user.id
    state.user.name = user.name
    state.user.email = user.email
    state.user.roles = user.roles
    state.user.isAuthenticated = true
    state.user.residential = user.residential || 'Smart Residential'
    state.user.residentialId = user.residentialId
  },
  setToken (state, token) {
    state.token = token
    axiosService.setAuthorization(token)
    window.localStorage.setItem(SMART_RESIDENTIAL.TOKEN, token)
  },
  isLogoutConfirmationOpen (state, isOpen) {
    state.isLogoutConfirmationOpen = isOpen
  },
  logout (state) {
    state.token = null
    state.user = new User()
    state.isLogoutConfirmationOpen = false
    window.localStorage.removeItem(SMART_RESIDENTIAL.TOKEN)
  }
}

const getters = {
  isAuthorized (state) {
    return state.token !== null
  },
  residential () {
    return state.user.residential
  },
  isAdmin () {
    return state.user.roles.includes(ROLES.ADMIN)
  },
  residentialId () {
    return state.user.residentialId
  },
  isAuthenticated (state) {
    return state.user.isAuthenticated
  },
  getMenu (state) {
    return menuService.getMenu(state.user.roles)
  }
}

const namespaced = true

export default {
  namespaced,
  state,
  actions,
  mutations,
  getters
}
