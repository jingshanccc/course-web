import Vue from 'vue'
import App from './App.vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import store from './store'
import router from './router/router'
import './router/index'
import Print from 'vue-iframe-print'

import './assets/styles/index.scss'

Vue.use(Element)
Vue.use(Print)

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
