const LOGIN_MODULE = {
  LOGIN: 'loginModule/login',
  LOGOUT: 'loginModule/logout',
  SET_TOKEN: 'loginModule/setToken',
  IS_LOGOUT_CONFIRMATION_OPEN: 'loginModule/isLogoutConfirmationOpen'
}

const SNACKBAR_MODULE = {
  SHOW_INFO_MESSAGE: 'snackbarModule/showInfoMessage',
  SHOW_ERROR_MESSAGE: 'snackbarModule/showErrorMessage',
  SHOW_SUCCESS_MESSAGE: 'snackbarModule/showSuccessMessage'
}

const DRAWER_MODULE = {
  OPEN: 'drawerModule/open',
  CLOSE: 'drawerModule/closeDrawer'
}

const LOCALIZATION_MODULE = {
  SET_LANGUAGE: 'localizationModule/setLenguage'
}

const LOADER_MODULE = {
  OPEN: 'loaderModule/open',
  CLOSE: 'loaderModule/close'
}

export {
  LOGIN_MODULE,
  LOADER_MODULE,
  DRAWER_MODULE,
  SNACKBAR_MODULE,
  LOCALIZATION_MODULE
}
