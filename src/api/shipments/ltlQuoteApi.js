import axios from 'axios'

/**
 * 提交LTL报价表单
 * @param {Object} formData - 表单数据
 * @returns {Promise} - 返回API请求的Promise
 */
export const submitQuoteForm = (formData) => {
  // 只传递 mesurement，不传 length, width, height
  const cargoItems = formData.cargoItems.map(item => ({
    mesurement: `${item.length}*${item.width}*${item.height}`,  // 尺寸格式化为一个字段
    weight: item.weight,
    pallets: item.pallets,
  }));

  // 构建 payload
  const payload = {
    so: formData.so_number,
    accessorials: formData.field116.join(','),  // 将附加服务连接成字符串
    zip: formData.delivery_zip,
    pick_up_date: formData.pick_up_date,
    delivery_ServiceType: formData.delivery_service_type,
    locationType: formData.location_type,
    hasPalletJackAndForklift: formData.has_pallet_jack_forklift,
    shipmentServiceType: formData.shipment_service_type,
    cargoItems: cargoItems,
    warehouseLocation: formData.warehouse_location,
  };

  // API请求，改为本地的URL
  return axios.post('http://localhost:3000/process_form', [payload], {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
