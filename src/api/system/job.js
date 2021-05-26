import request from '@/utils/request'

// 分页查询任务调度
export function listJobs(query) {
  return request({
    url: '/system/jobs',
    params: query
  })
}

// 查询任务调度
export function listJob(query) {
  return request({
    url: '/system/job',
    params: query
  })
}

// 查询任务调度详细
export function getJob(id) {
  return request(`/system/job/${id}`);
}

// 添加或者编辑任务调度
export function addOrUpdateJob(data) {
  return request({
    url: '/system/job',
    method: 'post',
    data: data
  })
}

// 删除任务调度
export function deleteJob(ids) {
  return request.delete(`/system/job?ids=${ids}`);
}

// 任务调度状态编辑
export function changeJobStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/system/job/status',
    method: 'post',
    data: data
  })
}

// 定时任务立即执行一次
export function runJob(id, jobGroup) {
  const data = {
    id,
    jobGroup
  }
  return request({
    url: '/system/job/run',
    method: 'post',
    data: data
  })
}