import request from '@/utils/request'

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/ims/users',
    params: query
  })
}

// 查询用户详细
export function getUser(id) {
  return request(`/ims/user/${id}`);
}

// 添加或者编辑用户
export function addOrUpdateUser(data) {
  return request({
    url: '/ims/user',
    method: 'post',
    data: data
  })
}

// 删除用户
export function deleteUser(ids) {
  return request.delete(`/ims/user?ids=${ids}`);
}

// 角色状态编辑
export function changeUserStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/ims/user/status',
    method: 'post',
    data: data
  })
}

// 导出用户
export function exportUser(query) {
  return request({
    url: '/ims/user/export',
    params: query
  })
}