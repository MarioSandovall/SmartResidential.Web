import axios from 'axios'

export default {
  setLenguage (lenguage) {
    axios.defaults.headers['Accept-Language'] = lenguage
  },
  setAuthorization (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
  }
}
