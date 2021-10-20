import request from '@/utils/request'

// 分页查询模板配置
export function listCodeTemplates(query) {
  return request({
    url: '/dp/code/templates',
    params: query
  })
}

// 查询模板配置
export function listCodeTemplate(query) {
  return request({
    url: '/dp/code/template',
    params: query
  })
}

// 查询模板配置详细
export function getCodeTemplate(path) {
  return request(`/dp/code/template?path=${path}`);
}

// 添加或者编辑模板配置
export function addOrUpdateCodeTemplate(data) {
  return request({
    url: '/dp/code/template',
    method: 'post',
    data: data
  })
}

// 删除模板配置
export function deleteCodeTemplate(ids) {
  return request.delete(`/dp/code/template?ids=${ids}`);
}

// 模板配置状态编辑
export function changeCodeTemplateStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/dp/code/template/status',
    method: 'post',
    data: data
  })
}