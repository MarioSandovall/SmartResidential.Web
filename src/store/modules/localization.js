import axiosService from '../../services/axiosService'
import { SMART_RESIDENTIAL } from '../../utils/constants'

const state = {
  language: window.localStorage.getItem(SMART_RESIDENTIAL.LANGUAGE) || null
}

const mutations = {
  setLenguage (state, language) {
    state.language = language
    axiosService.setLenguage(language)
    window.localStorage.setItem(SMART_RESIDENTIAL.LANGUAGE, language)
  }
}

const namespaced = true

export default {
  namespaced,
  state,
  mutations
}
