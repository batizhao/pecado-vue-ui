import request from '@/utils/request'

// // 查询字典列表
// export function listDictData(query) {
//   return request('/system/dict/data')
// }

// 查询字典详细
export function getDictData(id) {
  return request(`/system/dict/data/${id}`);
}

// 根据字典类型查
export function listDictDataByCode(code) {
  return request(`/system/dict/data?code=${code}`);
}

// 添加或者编辑字典
export function addOrUpdateDictData(data) {
  return request({
    url: '/system/dict/data',
    method: 'post',
    data: data
  })
}

// 删除字典
export function deleteDictData(ids) {
  return request.delete(`/system/dict/data?ids=${ids}`);
}

// 导出字典
export function exportDictData(query) {
  return request({
    url: '/system/dict/data/export',
    params: query
  })
}