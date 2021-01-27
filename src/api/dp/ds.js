import request from '@/utils/request'

// 查询数据源列表
export function listDsPage(query) {
  return request({
    url: '/dp/dss',
    params: query
  })
}

// 数据源详情
export function getDs(id) {
  return request(`/dp/ds/${id}`);
}

// 新增/修改数据源
export function addOrUpdateDs(data) {
  return request({
    url: '/dp/ds',
    method: 'post',
    data: data
  })
}

// 删除数据源
export function deleteDs(ids) {
  request.delete(`/dp/ds?ids=${ids}`);
}

// 数据源状态修改
export function changeDsStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/dp/ds/status',
    method: 'post',
    data: data
  })
}