import route from './router'
import store from '@/store'
import Setting from '@/settings'
import { getToken } from '@/utils/auth'

route.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title + ' - ' + Setting.title
  }
  if (getToken()) { // 已登录
    if (!store.getters.userInfo.id) {
      store.dispatch('UserInfo')
    }
    next()
  } else {
    if (to.path === '/home') {
      next()
    } else {
      next('/')
    }
  }
})
