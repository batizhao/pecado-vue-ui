import request from '@/utils/request'

// 查询流程定义
export function getProcessDefinition(key) {
  return request(`/oa/task?key=${key}`);
}

// 分页查询任务
export function listTasks(query) {
  return request({
    url: '/oa/tasks',
    params: query
  })
}

// 查询任务详细
export function getTask(id) {
  return request(`/oa/task?id=${id}`);
}

// 提交任务
export function submitTask(data) {
  return request({
    url: '/oa/task',
    method: 'post',
    data: data
  })
}