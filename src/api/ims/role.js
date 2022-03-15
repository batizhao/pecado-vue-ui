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

// 分配用户角色
export function changeRoleMenus(menus) {
  return request({
    url: '/ims/role/menu',
    method: 'post',
    data: menus
  })
}

// 分配角色数据权限
export function changeDataScope(role) {
  return request({
    url: '/ims/role/department',
    method: 'post',
    data: role
  })
}

// 分配用户角色
export function changeRoleUsers(users) {
  return request({
    url: '/ims/role/user',
    method: 'post',
    data: users
  })
}