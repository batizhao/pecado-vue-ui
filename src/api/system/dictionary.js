import request from '@/utils/request'

// 查询字典类型列表
export function listDictionary(query) {
  return request({
    url: '/system/dictionaries',
    params: query
  })
}

// 获取字典选择框列表
export function dictionaryOptionSelect() {
  return request('/system/dictionary')
}

// 查询字典类型详细
export function listDictDataByCode(code) {
  return request(`/system/dictionary/${code}`);
}

// 添加或者编辑字典类型
export function addOrUpdateDictionary(data) {
  return request({
    url: '/system/dictionary',
    method: 'post',
    data: data
  })
}

// 删除字典类型
export function deleteDictionary(ids) {
  return request.delete(`/system/dictionary?ids=${ids}`);
}

// 字典类型状态编辑
export function changeDictionaryStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/system/dictionary/status',
    method: 'post',
    data: data
  })
}