import request from '@/utils/request'

const url = '/app/list'

// 获取所有数据
export function getListData (appId) {
  return request({
    url: '/app/lists',
    params: {
      appId,
      size: 999,
      current: 1
    }
  })
}

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
export function changeStatus (id, status) {
  return request({
    url: url + '/status',
    method: 'post',
    data: {
      id,
      status
    }
  })
}