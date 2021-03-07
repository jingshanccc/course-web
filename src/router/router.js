import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout'

Vue.use(Router)

export const RouterMap = [
  {
    path: '/',
    redirect: '/home',
    component: Layout,
    children: [
      {
        path: 'home',
        name: 'Home',
        component: (resolve) => require(['@/views/home'], resolve)
      }
    ]
  }
]

export default new Router({
  mode: 'history',
  routes: RouterMap
})
