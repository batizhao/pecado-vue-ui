import request from '@/utils/request'

// 查询菜单列表
export function listMenu(query) {
  return request({
    url: '/ims/menus',
    params: query
  })
}

// 添加/编辑菜单
export function addOrUpdateMenu(data) {
  return request({
    url: '/ims/menu',
    method: 'post',
    data: data
  })
}

// 查询菜单详细
export function getMenu(id) {
  return request(`/ims/menu/${id}`);
}

// 删除菜单
export function deleteMenu(id) {
  return request.delete(`/ims/menu?id=${id}`);
}

// 菜单状态编辑
export function changeMenuStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/ims/menu/status',
    method: 'post',
    data: data
  })
}

// 根据角色ID查询菜单下拉树结构
export function listMenusByRoleId(roleId) {
  return request(`/ims/menu?roleId=${roleId}`)
}