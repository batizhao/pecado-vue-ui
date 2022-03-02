import request from '@/utils/request'

// 添加实体模型
export function addOrEditEntityModel (data) {
  return request({
    url:  '/app/table',
    method: 'post',
    data
  })
}

// 添加实体模型
export function updateCodeMetadata (data) {
  return request({
    url:  '/app/table/code',
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

// 查询生成元数据列表
export function listTableEntity(query) {
  return request({
    url: '/app/table/entity',
    params: query
  })
}

// 导入生成元数据
export function importTableEntity(data) {
  return request({
    url: '/app/table/import',
    method: 'post',
    data: data
  })
}

// 预览生成代码
export function previewCode(id) {
  return request(`/app/table/preview/${id}`)
}

// 生成代码（自定义路径）
export function genCode(id) {
  return request({
    url: `/app/table/path/${id}`,
    method: 'post'
  })
}

// 获取关联表
export function getTableRelations(id) {
  return request({
    url: `/app/table/relations/${id}`,
    method: 'get'
  })
}