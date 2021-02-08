import request from '@/utils/request'

// 查询代码表清单
export function listCodePage(query) {
  return request({
    url: 'dp/codes',
    params: query
  })
}

// 编辑代码表
export function addOrUpdateCode(data) {
  return request({
    url: 'dp/code',
    method: 'post',
    data: data
  })
}

// 删除代码表
export function deleteCode(ids) {
  return request.delete(`/dp/code?ids=${ids}`);
}

// 查询代码表详细信息
export function getCode(id) {
  return request(`/dp/code/${id}`);
}

// 查询生成元数据列表
export function listCodeMetaPage(query) {
  return request({
    url: 'dp/code/tables',
    params: query
  })
}

// 导入生成元数据
export function importCodeMeta(data) {
  return request({
    url: 'dp/code/table',
    method: 'post',
    data: data
  })
}

// 同步生成元数据
export function syncCodeMeta(id) {
  return request({
    url: 'dp/code/sync/' + id,
    method: 'post'
  })
}

// 预览生成代码
export function previewCode(id) {
  return request(`/dp/code/preview/${id}`)
}

// 生成代码（自定义路径）
export function genCode(id) {
  return request({
    url: `/dp/code/path/${id}`,
    method: 'post',
  })
}
