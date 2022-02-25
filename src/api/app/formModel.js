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
export function getDataDetail (id) {
  return request({
    url: url + '/' + id,
    method: 'get'
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

// 通过key查询表单
export function getFormByKey(key) {
  return request(`/dp/form?key=${key}`);
}

// 添加表单元数据
export function addFormMetaData(id, formKey, metadata) {
  const data = {
    id,
    formKey,
    metadata,
  }
  return request({
    url: '/dp/form',
    method: 'post',
    data: data
  })
}
