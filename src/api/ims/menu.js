import request from '@/utils/request'

// 查询菜单列表
export function listMenu(query) {
  return request({
    url: '/ims/menus',
    params: query
  })
}

// 新增/修改数菜单
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
export function deleteMenu(ids) {
  return request.delete(`/ims/menu?ids=${ids}`);
}


// 菜单状态修改
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

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: '/ims/menu/treeselect',
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId) {
  return request({
    url: '/ims/menu/roleMenuTreeselect/' + roleId,
  })
}