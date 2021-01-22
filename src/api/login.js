import request from '@/utils/request'

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  }
  return request({
    url: '/uaa/oauth/token?username='+username+'&password='+password+'&grant_type=password',
    method: 'post',
    // data: data,
    headers: {'Authorization': 'Basic Y2xpZW50X2FwcDoxMjM0NTY='}
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/ims/user/me',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    method: 'get'
  })
}