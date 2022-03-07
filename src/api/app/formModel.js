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

// 详情
export function getDataDetail (formKey) {
  return request({
    url: url,
    method: 'get',
    params: {
      key: formKey
    }
  })
}

// 修改表单状态
export function changeFormStatus (id, status) {
  return request({
    url: url + '/status',
    method: 'post',
    data: {
      id,
      status
    }
  })
}
