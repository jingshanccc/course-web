import request from '@/api/request'
import { encrypt } from '@/utils/rsa'

/**
 * oauth获取授权码
 */
export function authorize(loginUser) {
  return request({
    baseURL: process.env.VUE_APP_BASE_API,
    url: 'oauth/authorize',
    method: 'get',
    params: {
      'response_type': 'code',
      'client_id': process.env.VUE_APP_CLIENT_ID,
      'scope': 'admin',
      'redirect_uri': process.env.VUE_APP_BASE_API + 'oauth/redirect',
      // 'state': '' 自定义值 可防伪造攻击
      'state': process.env.VUE_APP_CLIENT_ID,
      ...loginUser,
      'type': 'member'
    }
  })
}

/**
 *  用户注册发送邮箱验证码
 */
export function sendEmailCode(email) {
  return request({
    url: '/email-code?Str=' + email,
    method: 'get'
  })
}
/**
 *  用户换绑邮箱发送验证码
 */
export function sendResetEmailCode(email) {
  return request({
    url: '/user/email-code?email=' + email,
    method: 'get'
  })
}

/**
 * 获取图形验证码
 */
export function getImgCode() {
  return request({
    baseURL: process.env.VUE_APP_BASE_API,
    url: 'oauth/captcha/image-code',
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
    baseURL: process.env.VUE_APP_BASE_API,
    url: 'oauth/logout',
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

export function updatePass(user) {
  const data = {
    oldPass: encrypt(user.oldPass),
    newPass: encrypt(user.newPass),
    isMember: true
  }
  return request({
    url: 'user/update-pass',
    method: 'POST',
    data
  })
}

export function updateEmail(form) {
  const data = {
    pass: encrypt(form.pass),
    email: form.email,
    code: form.code,
    isMember: true
  }
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

export function courseInfo(id) {
  return request({
    url: 'user/course-info',
    method: 'POST',
    data: {
      Str: id
    }
  })
}

export function saveLearnInfo(id, info) {
  return request({
    url: 'user/save-learn-info',
    method: 'POST',
    data: {
      Rows: [id, info]
    }
  })
}

export function experience(id) {
  return request({
    url: 'user/experience',
    method: 'POST',
    data: {
      Str: id
    }
  })
}
