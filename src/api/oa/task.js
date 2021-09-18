import request from '@/utils/request'

// 查询流程定义
export function getProcessDefinition(key) {
  return request(`/oa/process?key=${key}`);
}

// 获取环节的输出路由及路由后的任务环节配置信息
export function getProcessRouter(processDefinitionId, taskDefKey) {
  return request(`/oa/process/${processDefinitionId}/${taskDefKey}`);
}

// 待办任务
export function listTodoTasks(query) {
  return request({
    url: '/oa/task/todo',
    params: query
  })
}

// 已办任务
export function listDoneTasks(query) {
  return request({
    url: '/oa/task/done',
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

//获取流程指定环节意见
export function getFlowNodeComments(query) {
  return request({
    url: '/oa/comments',
    params:query,
  })
}

//签收
export function signTask(query) {
  return request({
    url: '/oa/task/sign',
    method: 'post',
    params:query
  })
}