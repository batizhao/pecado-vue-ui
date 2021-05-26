import request from '@/utils/request'

// 分页查询岗位
export function listPost(query) {
  return request({
    url: '/ims/posts',
    params: query
  })
}

// 查询所有岗位
export function listAllPost(query) {
  return request({
    url: '/ims/post',
    params: query
  })
}

// 查询岗位详细
export function getPost(id) {
  return request(`/ims/post/${id}`);
}

// 添加或者编辑岗位
export function addOrUpdatePost(data) {
  return request({
    url: '/ims/post',
    method: 'post',
    data: data
  })
}

// 删除岗位
export function deletePost(ids) {
  return request.delete(`/ims/post?ids=${ids}`);
}

// 岗位状态编辑
export function changePostStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/ims/post/status',
    method: 'post',
    data: data
  })
}

// 根据用户ID查询岗位
export function listPostByUserId(userId) {
  return request(`/ims/post?userId=${userId}`);
}