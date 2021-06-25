import request from '@/utils/request'

// 获取路由
export const getFromUrl = (url,query) => {
  return request({
    url,
    method: 'get',
    params: query
  })
}