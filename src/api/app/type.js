import request from '@/utils/request'

// 分页查询应用分类
export function listAppTypes(query) {
  return request({
    url: '/app/types',
    params: query
  })
}

// 查询应用分类
export function listAppType(query) {
  return request({
    url: '/app/type',
    params: query
  })
}

// 查询应用分类详细
export function getAppType(id) {
  return request(`/app/type/${id}`);
}

// 添加或者编辑应用分类
export function addOrUpdateAppType(data) {
  return request({
    url: '/app/type',
    method: 'post',
    data: data
  })
}

// 删除应用分类
export function deleteAppType(ids) {
  return request.delete(`/app/type?ids=${ids}`);
}

// 应用分类状态编辑
export function changeAppTypeStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/app/type/status',
    method: 'post',
    data: data
  })
}