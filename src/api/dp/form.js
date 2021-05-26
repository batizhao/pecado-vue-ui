import request from '@/utils/request'

// 分页查询表单
export function listForm(query) {
  return request({
    url: '/dp/forms',
    params: query
  })
}

// 查询表单详细
export function getForm(id) {
  return request(`/dp/form/${id}`);
}

// 添加或者编辑表单
export function addOrUpdateForm(data) {
  return request({
    url: '/dp/form',
    method: 'post',
    data: data
  })
}

// 添加表单元数据
export function addFormMetaData(id, metadata) {
  const data = {
    id,
    metadata,
  }
  return request({
    url: '/dp/form',
    method: 'post',
    data: data
  })
}

// 删除表单
export function deleteForm(ids) {
  return request.delete(`/dp/form?ids=${ids}`);
}

// 表单状态编辑
export function changeFormStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/dp/form/status',
    method: 'post',
    data: data
  })
}