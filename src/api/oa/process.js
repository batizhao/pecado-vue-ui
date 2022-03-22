import request from '@/utils/request'

// 获取app流程对象
export function getAppProcess (appId, taskId) {
  return request({
    url: '/app/init/' + appId,
    method: 'get',
    params: {
      taskId
    }
  })
}

// 获取环节的输出路由及路由后的任务环节配置信息
export function getProcessConfigInfo ({ processDefinitionId, taskDefKey }) {
  return request({
    url: `/oa/process/${processDefinitionId}/${taskDefKey}`,
    method: 'get'
  })
}

// 获取流程指定环节意见
export function getProcessComments ({ procInstId, taskDefKeyList, orderRule }) {
  return request({
    url: '/oa/comments',
    method: 'get',
    params: {
      procInstId,
      taskDefKeyList,
      orderRule
    }
  })
}

// 获取送审稿的人员
export function getCandidate (processDefId, taskDefKey, procInstId) {
  return request({
    url: '/oa/candidate',
    params: {
      processDefId,
      taskDefKey,
      procInstId
    }
  })
}

// 流程启动
export function startProcess (data) {
  return request({
    url: '/oa/start',
    method: 'post',
    data
  })
}

// 流程提交
export function submitProcess (data) {
  return request({
    url: '/oa/submit',
    method: 'post',
    data
  })
}