import request from '@/utils/request'

// 查询字典类型列表
export function listDictType(query) {
  return request({
    url: '/system/dict/types',
    params: query
  })
}

// 查询字典类型详细
export function listDictDataByCode(id) {
  return request(`/system/dict/type/${id}`);
}

// 添加或者编辑字典类型
export function addOrUpdateDictType(data) {
  return request({
    url: '/system/dict/type',
    method: 'post',
    data: data
  })
}

// 删除字典类型
export function deleteDictType(ids) {
  return request.delete(`/system/dict/type?ids=${ids}`);
}

// 导出字典类型
export function exportDictType(query) {
  return request({
    url: '/system/dict/type/export',
    params: query
  })
}

// 获取字典选择框列表
export function optionSelect() {
  return request('/system/dict/type')
}

// 菜单状态编辑
export function changeDictTypeStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/system/dict/type/status',
    method: 'post',
    data: data
  })
}