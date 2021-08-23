import request from '@/utils/request'

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    // username,
    // password,
    code,
    uuid
  }
  return request({
    url: '/uaa/token?username='+username+'&password='+password+'&code=1234',
    method: 'post',
    data: data,
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