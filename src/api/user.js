import request from '@/api/request'
import { encrypt } from '@/utils/rsa'

/**
 * oauth获取授权码
 */
export function authorize(loginUser) {
  return request({
    baseURL: process.env.VUE_APP_AUTH_API,
    url: 'authorize',
    method: 'get',
    params: {
      'response_type': 'code',
      'client_id': process.env.VUE_APP_CLIENT_ID,
      'scope': 'admin',
      'redirect_uri': process.env.VUE_APP_AUTH_API + 'redirect',
      // 'state': '' 自定义值 可防伪造攻击
      'state': process.env.VUE_APP_CLIENT_ID,
      ...loginUser,
      'type': 'member'
    }
  })
}

/**
 *  发送邮箱验证码
 */
export function sendEmailCode(email) {
  return request({
    url: '/email-code?Str=' + email,
    method: 'get'
  })
}

/**
 * 获取图形验证码
 */
export function getImgCode() {
  return request({
    baseURL: process.env.VUE_APP_AUTH_API,
    url: 'captcha/image-code',
    method: 'get'
  })
}

/**
 * 注册
 */
export function register(data) {
  data.password = encrypt(data.password)
  console.log(data)
  return request({
    url: '/register',
    method: 'POST',
    data
  })
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return request({
    url: 'user/info',
    method: 'POST'
  })
}

/**
 * 退出
 */
export function logout(token, refreshToken) {
  return request({
    baseURL: process.env.VUE_APP_AUTH_API,
    url: 'user/logout',
    method: 'get',
    params: {
      Str: token + '$' + refreshToken
    }
  })
}

export function saveUser(user) {
  return request({
    url: 'user/save',
    method: 'POST',
    data: user
  })
}

export function courses(id) {
  return request({
    url: 'user/courses?Str=' + id,
    method: 'GET'
  })
}

export function updatePass(data) {
  return request({
    url: 'user/update-pass',
    method: 'POST',
    data
  })
}

export function updateEmail(data) {
  return request({
    url: 'user/update-email',
    method: 'POST',
    data
  })
}

export function uploadAvatar(photo) {
  return request({
    url: 'user/upload-avatar',
    method: 'POST',
    data: {
      Str: photo
    }
  })
}

export function addCourse(id) {
  return request({
    url: 'user/add-course',
    method: 'POST',
    data: {
      Str: id
    }
  })
}
