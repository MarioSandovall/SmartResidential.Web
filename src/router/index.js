import Vue from 'vue'
import Router from 'vue-router'

import store from '../store/index'
import { ROLES } from '../utils/constants'
import authService from '../services/authService'

import Home from '../components/Home/Home'
import User from '../components/User/User'
import House from '../components/House/House'
import Login from '../components/Login/Login'
import Residential from '../components/Residential/Residential'
import Announcement from '../components/Announcement/Announcement'
import ExpenseCategory from '../components/ExpenseCategory/ExpenseCategory'

Vue.use(Router)

var router = new Router({
  routes: [
    { path: '/', redirect: 'home' },
    { path: '*', redirect: '/' },
    { path: '/login', name: 'login', component: Login },
    { path: '/user', name: 'user', component: User, meta: { roles: [ROLES.ADMIN] } },
    { path: '/house', name: 'house', component: House, meta: { roles: [ROLES.ADMIN] } },
    { path: '/residential', name: 'residential', component: Residential, meta: { roles: [ROLES.SUPER_ADMIN] } },
    { path: '/expense-category', name: 'expenseCategory', component: ExpenseCategory, meta: { roles: [ROLES.ADMIN] } },
    { path: '/home', name: 'home', component: Home, meta: { roles: [ROLES.ADMIN, ROLES.RESIDENT, ROLES.VIGILANT, ROLES.SUPER_ADMIN] } },
    { path: '/announcement', name: 'announcement', component: Announcement, meta: { roles: [ROLES.ADMIN, ROLES.RESIDENT, ROLES.VIGILANT, ROLES.SUPER_ADMIN] } }
  ]
})

router.beforeEach((to, from, next) => {
  const redirectTo = function (to) {
    if (to.name === 'login') {
      next({ name: 'home' })
    } else if (to.meta.roles) {
      const roles = store.state.loginModule.user.roles
      if (roles.some(role => to.meta.roles.includes(role))) {
        next()
      } else {
        next({ name: 'home' })
      }
    }
  }

  const redirectToLogin = function (to) {
    if (to.name === 'login') {
      next()
    } else {
      next({ name: 'login' })
    }
  }

  const isAuthorized = store.getters['loginModule/isAuthorized']
  if (isAuthorized) {
    const isAuthenticated = store.getters['loginModule/isAuthenticated']
    if (isAuthenticated) {
      redirectTo(to)
    } else {
      authService.getUserIfo().then((r) => {
        redirectTo(to)
        // store.commit('drawerModule/openDrawer')
      })
    }
  } else {
    redirectToLogin(to)
  }
})

export default router
