import request from '@/utils/request'

// 分页查询手工开票
export function listInvoices(query) {
  return request({
    url: '/oa/invoices',
    params: query
  })
}

// 查询手工开票
export function listInvoice(query) {
  return request({
    url: '/oa/invoice',
    params: query
  })
}

// 查询手工开票详细
export function getInvoice(id) {
  return request(`/oa/invoice/${id}`);
}

// 添加或者编辑手工开票
export function addOrUpdateInvoice(data) {
  return request({
    url: '/oa/invoice',
    method: 'post',
    data: data
  })
}

// 删除手工开票
export function deleteInvoice(ids) {
  return request.delete(`/oa/invoice?ids=${ids}`);
}