import request from '@/utils/request'

// 分页查询应用表
export function listAppTables(query) {
  return request({
    url: '/app/tables',
    params: query
  })
}

// 查询应用表
export function listAppTable(query) {
  return request({
    url: '/app/table',
    params: query
  })
}

// 查询应用表详细
export function getAppTable(id) {
  return request(`/app/table/${id}`);
}

// 添加或者编辑应用表
export function addOrUpdateAppTable(data) {
  return request({
    url: '/app/table',
    method: 'post',
    data: data
  })
}

// 删除应用表
export function deleteAppTable(ids) {
  return request.delete(`/app/table?ids=${ids}`);
}

// 应用表状态编辑
export function changeAppTableStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/app/table/status',
    method: 'post',
    data: data
  })
}