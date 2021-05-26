import request from '@/utils/request'


// 查询所有部门
export function listAllDepartment(query) {
  return request({
    url: '/ims/department',
    params: query
  })
}

// 查询部门详细
export function getDepartment(id) {
  return request(`/ims/department/${id}`);
}

// 添加或者编辑部门
export function addOrUpdateDepartment(data) {
  return request({
    url: '/ims/department',
    method: 'post',
    data: data
  })
}

// 删除部门
export function deleteDepartment(id) {
  return request.delete(`/ims/department?id=${id}`);
}

// 部门状态编辑
export function changeDepartmentStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/ims/department/status',
    method: 'post',
    data: data
  })
}

// 根据用户ID查询部门
export function listDepartmentByUserId(userId) {
  return request(`/ims/department?userId=${userId}`);
}

// 分配用户部门
export function changeDepartmentLeaders(departments) {
  return request({
    url: '/ims/department/leader',
    method: 'post',
    data: departments
  })
}