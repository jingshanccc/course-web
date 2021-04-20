import Vue from 'vue'
import App from './App.vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import axios from 'axios'
import store from './store'
import router from './router/router'
import './router/index'
import Print from 'vue-iframe-print'

import './assets/icons'
import './assets/styles/index.scss'

Vue.use(Element)
Vue.use(Print)

Vue.config.productionTip = false

Vue.prototype.axios = axios
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
