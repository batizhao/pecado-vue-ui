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

// 获取当前用户详细信息
export function getInfo() {
  return request('/ims/user/me')
}

// 添加或者编辑用户
export function addOrUpdateUser(data) {
  return request({
    url: '/ims/user',
    method: 'post',
    data: data
  })
}

// 更换头像
export function changeUserAvatar(data) {
  return request({
    url: `/ims/user/avatar`,
    method: 'post',
    data: data
  })
}

// 更新密码
export function changeUserPassword(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: `/ims/user/password`,
    method: 'post',
    params: data
  })
}

// 删除用户
export function deleteUser(ids) {
  return request.delete(`/ims/user?ids=${ids}`);
}

// 用户状态编辑
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

// 分配用户角色
export function changeUserRoles(roles) {
  return request({
    url: '/ims/user/role',
    method: 'post',
    data: roles
  })
}

// 分配用户岗位
export function changeUserPosts(posts) {
  return request({
    url: '/ims/user/post',
    method: 'post',
    data: posts
  })
}

// 分配用户部门
export function changeUserDepartments(departments) {
  return request({
    url: '/ims/user/department',
    method: 'post',
    data: departments
  })
}

// 根据部门ID查询领导
export function listLeaderByDepartmentId(departmentId) {
  return request(`/ims/user/leader?departmentId=${departmentId}`);
}

// 导出用户
export function exportUser(query) {
  return request({
    url: '/ims/user/export',
    params: query
  })
}