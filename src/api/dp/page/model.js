import request from '@/utils/request'

// 添加编辑
export function addOrEditTemplate (data) {
  return request({
    url:  '/dp/page/model',
    method: 'post',
    data
  })
}

// 删除
export function deleteTemplate (ids = '') {
  return request({
    url: '/dp/page/model',
    method: 'delete',
    params: {
      ids
    }
  })
}

// 详情
export function getTemplateDetail (id) {
  return request({
    url: '/dp/page/model/' + id,
    method: 'get'
  })
}

// 页面模型
export function getPageModelBy (params) {
  return request({
    url: '/dp/page/model/by',
    method: 'get',
    params
  })
}

// 状态更改
export function changeFormStatus (id, status) {
  return request({
    url: '/dp/page/model/status',
    method: 'post',
    data: {
      id,
      status
    }
  })
}
