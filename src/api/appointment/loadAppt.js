import request from '@/utils/request'

// 查询apptAllInfos列表
export function listLoadAppt(query) {
  return request({
    url: '/appointment/loadAppt/list',
    method: 'get',
    params: query
  })
}

// 查询apptAllInfos详细
export function getLoadAppt(id) {
  return request({
    url: '/appointment/loadAppt/' + id,
    method: 'get'
  })
}

// 新增apptAllInfos
export function addLoadAppt(data) {
  return request({
    url: '/appointment/loadAppt',
    method: 'post',
    data: data
  })
}

// 修改apptAllInfos
export function updateLoadAppt(data) {
  return request({
    url: '/appointment/loadAppt',
    method: 'put',
    data: data
  })
}

// 删除apptAllInfos
export function delLoadAppt(id) {
  return request({
    url: '/appointment/loadAppt/' + id,
    method: 'delete'
  })
}
