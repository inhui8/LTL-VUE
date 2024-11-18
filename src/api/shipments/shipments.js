import request from '@/utils/request'

// 查询shipments列表
export function listShipments(query) {
  return request({
    url: '/shipments/shipments/list',
    method: 'get',
    params: query
  })
}

// 查询shipments详细
export function getShipments(id) {
  return request({
    url: '/shipments/shipments/' + id,
    method: 'get'
  })
}

// 新增shipments
export function addShipments(data) {
  return request({
    url: '/shipments/shipments',
    method: 'post',
    data: data
  })
}

// 修改shipments
export function updateShipments(data) {
  return request({
    url: '/shipments/shipments',
    method: 'put',
    data: data
  })
}

// 删除shipments
export function delShipments(id) {
  return request({
    url: '/shipments/shipments/' + id,
    method: 'delete'
  })
}

export function submitQuoteForm(formData) {

  // 创建一个 map 来合并相同 so_number 的项目
  const mergedData = {};

  formData.forEach(item => {
    const soNumber = String(item.so_number).trim(); // 强制转换为字符串并修剪空格

    // 如果 map 中不存在这个 so_number，则初始化它
    if (!mergedData[soNumber]) {
      mergedData[soNumber] = {
        soNumber: soNumber,
        accName: item.accessorials || '',
        deliveryZip: item.delivery_zip,
        pickUpDate: item.pick_up_date,
        deliveryServiceType: item.delivery_service_type,
        locationType: item.location_type,
        hasPalletJackForklift: item.has_pallet_jack_forklift === 'Yes' ? 1 : 0,
        shipmentServiceType: item.shipment_service_type,
        itemsList: [], // 初始化空的 itemsList
        warehouseLocation: item.warehouse_location,
        customWarehouseAddress: item.custom_warehouse_address || '', // 添加 custom_warehouse_address
        pickupLocationType: item.pickup_location_type || '', // 添加 pickup_location_type
        customPickupAccessorials: item.custom_pickup_accessorials
      };
    }

    // 将当前项目的货物信息添加到 itemsList 中
    mergedData[soNumber].itemsList.push({
      dimensions: item.mesurement || '',  // 处理空或缺失的 mesurement 字段
      weight: item.weight || 0,           // 处理空或缺失的 weight 字段
      pallets: item.pallets || 0,          // 处理空或缺失的 pallets 字段
      pcs: item.pcs || 0  
    });
  });

  // 将 mergedData 中的对象转化为数组
  const payload = Object.values(mergedData);

  console.log('合并后的 Payload:', payload);  // 打印调试 payload

  // 发送请求
  return request({
    url: '/shipments/shipments/process_form',
    method: 'post',
    data: payload,  // 发送合并后的 payload 数组
    headers: {
      'Content-Type': 'application/json'
    }
  });
}


export function saveApiSelection(data) {
  return request({
    url: '/shipments/shipments/saveApiSelection',
    method: 'post',
    data
  });
}

export function getApiSelection(id) {
  return request({
    url: '/shipments/shipments/getApiSelection',
    method: 'get',
    params: { id }  // 传递配置的 ID
  });
}

