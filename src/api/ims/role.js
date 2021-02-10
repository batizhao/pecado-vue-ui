import request from '@/utils/request'

// 查询角色列表（分页）
export function listRole(query) {
  return request({
    url: '/ims/roles',
    params: query
  })
}

// 查询角色列表
export function listAllRole() {
  return request('/ims/role')
}

// 查询角色详细
export function getRole(id) {
  return request(`/ims/role/${id}`);
}

// 添加或者编辑角色
export function addOrUpdateRole(data) {
  return request({
    url: '/ims/role',
    method: 'post',
    data: data
  })
}

// 删除角色
export function deleteRole(ids) {
  return request.delete(`/ims/role?ids=${ids}`);
}

// 角色状态编辑
export function changeRoleStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/ims/role/status',
    method: 'post',
    data: data
  })
}

// 根据用户ID查询角色
export function listRoleByUserId(userId) {
  return request(`/ims/role?userId=${userId}`);
}

// 导出角色
export function exportRole(query) {
  return request({
    url: '/ims/role/export',
    params: query
  })
}