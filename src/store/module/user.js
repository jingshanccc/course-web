import { getRefreshToken, getToken, removeToken, setToken } from '@/utils/auth'
import { encrypt } from '@/utils/rsa'
import { logout, authorize, getUserInfo } from '@/api/user'
import { Notification } from 'element-ui'

const user = {
  state: {
    token: getToken(),
    refreshToken: '',
    userInfo: {}
  },
  mutations: {
    SET_TOKEN: (state, token, refreshToken) => {
      state.token = token
      state.refreshToken = refreshToken
    },
    SET_USER: (state, user) => {
      state.userInfo = user
    }
  },
  actions: {
    Login({ commit }, loginUser) {
      return new Promise((resolve, reject) => {
        loginUser.password = encrypt(loginUser.password)
        authorize(loginUser).then(res => {
          if (res.success) {
            const content = JSON.parse(res.content)
            setToken(content.access_token, content.refresh_token)
            commit('SET_TOKEN', content.access_token, content.refresh_token)
            resolve()
          } else {
            Notification.error({
              title: '登录失败',
              message: res.message,
              duration: 5000
            })
            reject()
          }
        }).catch(err => {
          reject(err)
        })
      })
    },

    UserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(res => {
          if (res.success) {
            commit('SET_USER', res.content)
            resolve()
          }
        }).catch(err => {
          reject(err)
        })
      })
    },

    Logout({ commit }) {
      return new Promise((resolve, reject) => {
        logout(getToken(), getRefreshToken()).then(res => {
          console.log('退出成功：' + res)
          DoLogout(commit)
          resolve()
        }).catch(err => {
          DoLogout(commit)
          reject(err)
        })
      })
    }
  }
}

export const DoLogout = (commit) => {
  commit('SET_TOKEN', '', '')
  commit('SET_USER', {})
  removeToken()
}

export default user
