import axios from 'axios'
import store from '../store'
import router from '../router'

import { LOGIN_MODULE, LOADER_MODULE } from '../utils/vuexStorage'

export default {
  login (email, password) {
    return axios.post('login', { email, password })
      .then((response) => {
        store.dispatch(LOGIN_MODULE.SET_TOKEN, response.data)
        router.push({ name: 'home' })
      })
  },
  openLogoutConfirmation () {
    const open = true
    store.commit(LOGIN_MODULE.IS_LOGOUT_CONFIRMATION_OPEN, open)
  },
  closeLogoutConfirmation () {
    const close = false
    store.commit(LOGIN_MODULE.IS_LOGOUT_CONFIRMATION_OPEN, close)
  },
  logout () {
    store.commit(LOGIN_MODULE.LOGOUT)
    router.push({ name: 'login' })
  },
  getUserIfo () {
    store.commit(LOADER_MODULE.OPEN)
    return axios.get('login/user')
      .then((response) => {
        store.dispatch(LOGIN_MODULE.LOGIN, response.data)
      }).catch(() => {
        this.logout()
      }).finally(() => {
        store.commit(LOADER_MODULE.CLOSE)
      })
  }
}
