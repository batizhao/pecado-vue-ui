import request from '@/utils/request'

// 分页查询日志
export function listLog(query) {
  return request({
    url: '/system/logs',
    params: query
  })
}

// 查询日志详细
export function getLog(id) {
  return request(`/system/log/${id}`);
}

// 删除日志
export function deleteLog(ids) {
  return request.delete(`/system/log?ids=${ids}`);
}

// 删除日志
export function cleanLog() {
  return request.delete(`/system/log`);
}