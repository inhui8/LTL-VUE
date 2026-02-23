import request from '@/utils/request'

// 查询数据统计列表
export function listShipmentData(query) {
  return request({
    url: '/shipments/data/list',
    method: 'get',
    params: query
  })
}

// 导出数据统计
export function exportShipmentData(query) {
  return request({
    url: '/shipments/data/export',
    method: 'post',
    params: query
  })
}

// 手动更新缓存
export function updateCache() {
  return request({
    url: '/shipments/data/updateCache',
    method: 'post'
  })
}

// 获取缓存状态
export function getCacheStatus() {
  return request({
    url: '/shipments/data/cacheStatus',
    method: 'get'
  })
}

// 清除缓存
export function clearCache() {
  return request({
    url: '/shipments/data/clearCache',
    method: 'post'
  })
}

// 获取数据库信息
export function getDatabaseInfo() {
  return request({
    url: '/shipments/data/databaseInfo',
    method: 'get'
  })
}

// 清理遗留缓存
export function cleanLegacyCache() {
  return request({
    url: '/shipments/data/cleanLegacyCache',
    method: 'post'
  })
} 