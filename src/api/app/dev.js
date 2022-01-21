import request from '@/utils/request'

// 分页查询应用
export function listApps(query) {
  return request({
    url: '/app/devs',
    params: query
  })
}

// 查询应用
export function listApp(query) {
  return request({
    url: '/app/dev',
    params: query
  })
}

// 查询应用详细
export function getApp(id) {
  return request(`/app/dev/${id}`);
}

// 添加或者编辑应用
export function addOrUpdateApp(data) {
  return request({
    url: '/app/dev',
    method: 'post',
    data: data
  })
}

// 删除应用
export function deleteApp(ids) {
  return request.delete(`/app/dev?ids=${ids}`);
}

// 应用状态编辑
export function changeAppStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/app/dev/status',
    method: 'post',
    data: data
  })
}