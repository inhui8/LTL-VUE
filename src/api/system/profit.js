import request from '@/utils/request'

// 查询用户利润列表
export function listUserProfit(query) {
  return request({
    url: '/system/profit/list',
    method: 'get',
    params: query
  })
}

// 获取用户利润详细信息
export function getUserProfit(userId) {
  return request({
    url: '/system/profit/' + userId,
    method: 'get'
  })
}
export function addUserProfit(data) {
    return request({
      url: '/system/profit',
      method: 'post',
      data: data
    })
  }
// 更新用户利润
export function updateUserProfit(data) {
  return request({
    url: '/system/profit',
    method: 'put',
    data: data
  })
}

// 批量更新用户利润
export function batchUpdateUserProfit(data) {
  return request({
    url: '/system/profit/batch',
    method: 'put',
    data: data
  })
}

// 删除用户信息
export function delUserProfit(userId) {
    return request({
      url: '/system/profit/' + userId,
      method: 'delete'
    })
  }