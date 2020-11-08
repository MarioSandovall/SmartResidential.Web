import axios from 'axios'
import store from '../store'
import router from '../router'

axios.defaults.baseURL = process.env.VUE_APP_WEB_API_URL
axios.defaults.headers['Content-type'] = 'application/json'
axios.defaults.headers['Accept-Language'] = store.state.localizationModule.language
axios.defaults.headers.common.Authorization = `Bearer ${store.state.loginModule.token}`

axios.interceptors.response.use(config => {
  return config
}, error => {
  if (error.response && error.response.status === 401) {
    store.dispatch('loginModule/logout')
    router.push({ name: 'login' })
  }
  return Promise.reject(error)
})

export default {
  install (vue) {
    vue.prototype.$proxy = {}

    vue.prototype.$proxy.get = function (path, params = {}) {
      return new Promise((resolve, reject) => {
        return axios.get(path, params)
          .then((r) => {
            resolve(r)
          })
          .catch((e) => {
            reject(e)
          })
      })
    }

    vue.prototype.$proxy.post = function (path, payload = {}) {
      return new Promise((resolve, reject) => {
        return axios.post(path, payload)
          .then(r => {
            resolve(r)
          })
          .catch(e => {
            reject(e)
          })
      })
    }

    vue.prototype.$proxy.put = function (path, payload = {}) {
      return new Promise((resolve, reject) => {
        return axios.put(path, payload)
          .then(r => {
            resolve(r)
          })
          .catch(e => {
            reject(e)
          })
      })
    }

    vue.prototype.$proxy.delete = function (path) {
      return new Promise((resolve, reject) => {
        return axios.delete(path)
          .then(r => {
            resolve(r)
          })
          .catch(e => {
            reject(e)
          })
      })
    }
  }
}
