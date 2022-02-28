import request from '@/utils/request'

// 添加实体模型
export function addOrEditEntityModel (data) {
  return request({
    url:  '/app/table',
    method: 'post',
    data
  })
}

// 删除实体模型
export function deleteEntityModel (ids = '') {
  return request({
    url: '/app/table',
    method: 'delete',
    params: {
      ids
    }
  })
}

// 详情
export function entityModelDetail (id) {
  return request({
    url: '/app/table/' + id,
    method: 'get'
  })
}

// 同步实体表
export function syncEntityModel (id) { 
  return request({
    url: '/app/table/sync/' + id,
    method: 'post'
  })
 }

// 生产代码/生产代码
export function submitGenarateCode (id) {
  return request({
    url: '/app/table/zip/' + id,
    method: 'post'
  })
}

// 查询代码元数据表详细信息
export function listCodeMeta(id) {
  return request(`/dp/code/meta?codeId=${id}`);
}

// 查询生成元数据列表
export function listCodeMetaPage(query) {
  return request({
    url: '/dp/code/tables',
    params: query
  })
}

// 导入生成元数据
export function importCodeMeta(data) {
  return request({
    url: '/dp/code/table',
    method: 'post',
    data: data
  })
}

// 预览生成代码
export function previewCode(id) {
  return request(`/dp/code/preview/${id}`)
}