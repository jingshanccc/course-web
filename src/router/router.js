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
      },
      {
        path: 'course/list',
        name: 'Course',
        component: (resolve) => require(['@/views/course/index'], resolve)
      },
      {
        path: 'course/detail',
        name: 'CourseDetail',
        component: (resolve) => require(['@/views/course/detail'], resolve)
      },
      {
        path: 'user',
        name: 'User',
        component: (resolve) => require(['@/views/user/index'], resolve)
      },
      {
        path: 'learn/:randomCode',
        name: 'Learning',
        component: (resolve) => require(['@/views/learn/index'], resolve),
        meta: {
          notKeep: true
        }
      }
    ]
  }
]

export default new Router({
  mode: 'history',
  routes: RouterMap
})
