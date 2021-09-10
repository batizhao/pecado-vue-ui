import request from '@/utils/request'

// 分页查询审批
export function listComments(query) {
  return request({
    url: '/oa/comments',
    params: query
  })
}

//获取流程指定环节意见
export function getFlowNodeComments(query) {
  return request({
    url: '/oa/comments',
    params:query,
    data: {},
    method: 'post',
  })
}

// 查询审批
export function listComment(query) {
  return request({
    url: '/oa/comment',
    params: query
  })
}

// 查询审批详细
export function getComment(id) {
  return request(`/oa/comment/${id}`);
}

// 添加或者编辑审批
export function addOrUpdateComment(data) {
  return request({
    url: '/oa/comment',
    method: 'post',
    data: data
  })
}

// 删除审批
export function deleteComment(ids) {
  return request.delete(`/oa/comment?ids=${ids}`);
}

// 审批状态编辑
export function changeCommentStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/oa/comment/status',
    method: 'post',
    data: data
  })
}