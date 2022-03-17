import request from '@/utils/request'

// 获取app流程对象
export function getAppProcess (appId) {
  return request({
    url: '/app/init/' + appId,
    method: 'get'
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
export function getCandidate (processDefId, taskDefKey) {
  return request({
    url: '/oa/candidate',
    params: {
      processDefId,
      taskDefKey
    }
  })
}