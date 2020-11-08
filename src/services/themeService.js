import { SMART_RESIDENTIAL } from '../utils/constants'

export default {
  setTheme (isDarkTheme) {
    window.localStorage.setItem(SMART_RESIDENTIAL.IS_DARK_THEME, isDarkTheme)
  },
  isDarkTheme () {
    return window.localStorage.getItem(SMART_RESIDENTIAL.IS_DARK_THEME) === 'true'
  }
}
