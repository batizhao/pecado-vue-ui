import request from '@/utils/request'

const url = '/app/form'

// 添加编辑
export function addOrEditData (data) {
  return request({
    url,
    method: 'post',
    data
  })
}

// 删除
export function deleteData (ids = '') {
  return request({
    url,
    method: 'delete',
    params: {
      ids
    }
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