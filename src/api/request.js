import axios from 'axios'
import Setting from '@/settings'
import { Notification } from 'element-ui'

const service = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? process.env.VUE_APP_BASE_API : '/',
  timeout: Setting.timeout
})

service.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  error => {
    Promise.reject(error)
  }
)

service.interceptors.response.use(
  res => {
    return res.data
  },
  err => {
    let code = 0
    try {
      code = err.response.status
    } catch (e) {
      if (err.toString().indexOf('Error: time out') !== -1) {
        Notification.error({
          title: '网络请求超时',
          duration: 5000
        })
      }
      return Promise.reject(err)
    }
    if (code) {
      const errorMsg = err.response.data.message
      if (errorMsg !== undefined) {
        Notification.error({
          title: errorMsg,
          duration: 5000
        })
      }
    } else {
      Notification.error({
        title: '接口请求失败',
        duration: 5000
      })
    }
    return Promise.reject(err)
  }
)

export default service
