import request from '@/utils/request'

export function getNavBarData () {
  return request({
    url: '/app/menu/me',
    method: 'get'
  })
}