import request from '@/utils/request'

// 添加实体模型
export function addOrEditEntityModel ({ appId, id, tableName, tableComment, dsName, columnMetadata}) {
  const columnMetadataJSON = JSON.stringify(columnMetadata)
  return request({
    url:  '/app/table',
    method: 'post',
    data: { appId, id, tableName, tableComment, dsName, columnMetadata: columnMetadataJSON}
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