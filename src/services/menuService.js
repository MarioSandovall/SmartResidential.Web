import { ROLES } from '../utils/constants'

const menu = [
  { name: 'menu.home', icon: 'mdi-home', component: 'home', roles: [ROLES.ADMIN, ROLES.VIGILANT, ROLES.RESIDENT, ROLES.SUPER_ADMIN] },
  { name: 'menu.announcements', icon: 'mdi-message', component: 'announcement', roles: [ROLES.ADMIN, ROLES.VIGILANT, ROLES.RESIDENT, ROLES.SUPER_ADMIN] },
  { name: 'menu.residential', icon: 'mdi-city', component: 'residential', roles: [ROLES.SUPER_ADMIN] },
  { name: 'menu.houses', icon: 'mdi-home-variant', component: 'house', roles: [ROLES.ADMIN] },
  { name: 'menu.users', icon: 'mdi-account-multiple', component: 'user', roles: [ROLES.ADMIN] },
  { name: 'menu.expense_categories', icon: 'mdi-layers', component: 'expenseCategory', roles: [ROLES.ADMIN] }

]

export default {
  getMenu (roles = []) {
    return menu.filter(o => o.roles.some(r => roles.includes(r)))
  }
}
