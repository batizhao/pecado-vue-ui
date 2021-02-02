import request from '@/utils/request'

// 查询生成表数据
export function listCodePage(query) {
  return request({
    url: 'dp/codes',
    params: query
  })
}
// 查询db数据库列表
export function listCodeTablePage(query) {
  return request({
    url: 'dp/code/tables',
    params: query
  })
}

// 导入表
export function importCodeTable(data) {
  return request({
    url: 'dp/code/table',
    method: 'post',
    data: data
  })
}

// 删除表数据
export function deleteCode(ids) {
  return request.delete(`/dp/code?ids=${ids}`);
}

// 查询表详细信息
export function getCode(id) {
  return request(`/dp/code/${id}`);
}

// 预览生成代码
export function previewCode(id) {
  return request(`/dp/code/preview/${id}`)
}

// 同步数据库
export function syncCodeMeta(id) {
  return request({
    url: 'dp/code/sync/' + id,
    method: 'post'
  })
}

// 修改代码生成信息
export function updateGenTable(data) {
  return request({
    url: 'dp/code',
    method: 'put',
    data: data
  })
}

// 生成代码（自定义路径）
export function genCode(tableName) {
  return request({
    url: 'dp/code/genCode/' + tableName,
    method: 'get'
  })
}
