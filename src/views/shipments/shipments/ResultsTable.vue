<template>
  <div>
    <el-table :data="groupedTableData" style="width: 100%" border height="450">
      <el-table-column label="删除/delete" width="100">
        <template #default="scope">
          <el-button 
            type="danger" 
            @click="deleteRow(scope.$index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
      <!-- Add the column for the quote button -->
      <el-table-column 
        label="查看报价/check quote" 
        :width="customWidths.viewQuote"
      >
        <template #default="scope">
          <el-button 
            @click="$emit('show-quote', scope.row)"
            type="primary"    
            size="default"  
            class="view-quote-button" 
          >
            查看报价
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="shipmentId" label="Shipment ID/货件编号" :width="customWidths.shipmentId" show-overflow-tooltip :resizable="true"></el-table-column>
      <el-table-column prop="so_number" label="SO/货件编号" :width="customWidths.so_number" show-overflow-tooltip :resizable="true"></el-table-column>
      <el-table-column prop="accessorials" label="Accessorials/附加服务" :width="customWidths.accessorials" show-overflow-tooltip :resizable="true"></el-table-column>
      <el-table-column prop="warehouse_location" label="Warehouse Location/仓库位置" :width="customWidths.warehouse_location" show-overflow-tooltip :resizable="true"></el-table-column>

      <!-- 合并后的cargo信息展示 -->
      <el-table-column label="Mesurement(货物尺寸）/长度(inch)">
        <template #default="scope">
          <div v-html="scope.row.mesurement"></div>
        </template>
      </el-table-column>

      <el-table-column label="Weight/重量">
        <template #default="scope">
          <div v-html="scope.row.weight"></div>
        </template>
      </el-table-column>

      <el-table-column label="Pallet Number/托盘数量">
        <template #default="scope">
          <div v-html="scope.row.pallets"></div>
        </template>
      </el-table-column>
      <el-table-column label="PCS/件数" :width="customWidths.pcs" show-overflow-tooltip :resizable="true">
        <template #default="scope">
          <div v-html="scope.row.pcs"></div>
        </template>
      </el-table-column>

      <!-- 其他字段 -->
      <el-table-column prop="delivery_zip" label="Delivery Zip/送货邮编" :width="customWidths.delivery_zip" show-overflow-tooltip :resizable="true"></el-table-column>
      <el-table-column prop="pick_up_date" label="Pick Up Date/提货日期" :width="customWidths.pick_up_date" show-overflow-tooltip :resizable="true"></el-table-column>
      <el-table-column prop="delivery_service_type" label="Delivery Service Type/送货服务类型" :width="customWidths.delivery_service_type" show-overflow-tooltip :resizable="true"></el-table-column>
      <el-table-column prop="location_type" label="Location Type/位置类型" :width="customWidths.location_type" show-overflow-tooltip :resizable="true"></el-table-column>
      <el-table-column prop="has_pallet_jack_forklift" label="Has Pallet Jack and Forklift/是否有托盘搬运车和叉车" :width="customWidths.has_pallet_jack_forklift" show-overflow-tooltip :resizable="true"></el-table-column>
      <el-table-column prop="shipment_service_type" label="Shipment Service Type/货运服务类型" :width="customWidths.shipment_service_type" show-overflow-tooltip :resizable="true"></el-table-column>
      <el-table-column label="Pick up Address/提货ZIP CODE" :width="customWidths.pickupAddress">
        <template #default="scope">
          <div>{{ scope.row.custom_warehouse_address || '-' }}</div>
        </template>
      </el-table-column>
      
      <!-- Custom Pick-up Location Type Field -->
      <el-table-column label="Pick-up Location Type/提货位置类型" :width="customWidths.pickupLocationType">
        <template #default="scope">
          <div>{{ scope.row.pickup_location_type || '-' }}</div>
        </template>
      </el-table-column>
      
      <!-- Custom Pick-up Accessorials Field -->
      <el-table-column prop="custom_pickup_accessorials" label="Accessorials/附加服务" :width="customWidths.accessorials" show-overflow-tooltip :resizable="true"></el-table-column>

      <!-- Daylight 列 -->
      <el-table-column prop="daylight" label="Daylight" :width="customWidths.daylight" show-overflow-tooltip :resizable="true">
        <template #default="scope">
          <div :style="{ backgroundColor: getLowestPriceStyle(scope.row, 'daylight') }">{{ scope.row.daylight }}</div>
        </template>
      </el-table-column>

      <!-- Flock Freight Standard 列 -->
      <el-table-column prop="auptix_standard_inflexible" label="Flock Freight Standard" :width="customWidths.auptix_standard_inflexible" show-overflow-tooltip :resizable="true">
        <template #default="scope">
          <div :style="{ backgroundColor: getLowestPriceStyle(scope.row, 'auptix_standard_inflexible') }">{{ scope.row.auptix_standard_inflexible }}</div>
        </template>
      </el-table-column>

      <!-- Flock Freight Direct 列 -->
      <el-table-column prop="auptix_flock_direct_inflexible" label="Flock Freight Direct" :width="customWidths.auptix_flock_direct_inflexible" show-overflow-tooltip :resizable="true">
        <template #default="scope">
          <div :style="{ backgroundColor: getLowestPriceStyle(scope.row, 'auptix_flock_direct_inflexible') }">{{ scope.row.auptix_flock_direct_inflexible }}</div>
        </template>
      </el-table-column>
            <!-- Add the new customPrice column -->
      <el-table-column prop="customPrice" label="Custom Price" :width="customWidths.customPrice" show-overflow-tooltip :resizable="true">
        <template #default="scope">
          <div :style="{ backgroundColor: getLowestPriceStyle(scope.row, 'customPrice') }">{{ scope.row.customPrice }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="xpo_price" label="XPO Price" :width="customWidths.xpo" show-overflow-tooltip :resizable="true">
        <template #default="scope">
          <div :style="{ backgroundColor: getLowestPriceStyle(scope.row, 'xpo_price') }">{{ scope.row.xpo_price }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="mothership_price" label="Mothership Price" :width="customWidths.mothership_price" show-overflow-tooltip :resizable="true">
        <template #default="scope">
          <div :style="{ backgroundColor: getLowestPriceStyle(scope.row, 'mothership_price') }">{{ scope.row.mothership_price }}</div>
        </template>
      </el-table-column>



      <el-table-column
        prop="priceConfirmed"
        label="Price Confirmed/价格确认"
        :width="customWidths.priceConfirmed"
        show-overflow-tooltip
        :resizable="true"
      >
        <template #default="scope">
          <el-select
            v-model="scope.row.priceConfirmed"
            placeholder="请选择确认价格"
            clearable
            style="width: 200px;"
          >
            <el-option label="Daylight" value="Daylight"></el-option>
            <el-option label="Flock Freight_Standard" value="Flock Freight_Standard"></el-option>
            <el-option label="Flock Freight_Direct" value="Flock Freight_Direct"></el-option>
            <el-option label="Custom Price" value="Custom Price"></el-option> <!-- Added customPrice option -->
            <el-option label="XPO Price" value="XPO Price"></el-option> <!-- Added customPrice option -->
            <el-option label="Mothership Price" value="Mothership Price"></el-option> 
          </el-select>
        </template>
      </el-table-column>


      <!-- 空字段，内容是确认按钮 -->
      <el-table-column label="">
        <template #default="scope">
          <el-button 
            type="primary" 
            @click="updatePriceConfirmed(scope.row)"
          >
            确认
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
  </div>
</template>


<script setup>
import { computed, defineProps, reactive } from 'vue'
import { updateShipments } from '@/api/shipments/shipments'; // 使用你已有的更新方法
import { ElMessage } from 'element-plus';

// Update price method
const updatePriceConfirmed = async (row) => {
  try {
    const shipments = {
      id: row.shipmentId,
      priceConfirmed: row.priceConfirmed,
    };

    // Call the API to save the data
    const response = await updateShipments(shipments);
    if (response.code === 200) {
      ElMessage.success('价格确认状态已更新');
    } else {
      ElMessage.error('更新失败');
    }
  } catch (error) {
    ElMessage.error('更新价格确认状态失败，请重试');
    console.error('更新价格确认状态时出错:', error);
  }
};
defineExpose({
  updatePriceConfirmed,
});
// 辅助函数：格式化日期为yyyy-mm-dd
const formatDate = (date) => {
  if (typeof date === 'number') {
    // 如果是 Excel 格式的日期 (数字)，将其转换为 Date 对象
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const daysOffset = date - 1; // Excel日期从1900-01-01开始
    return new Date(excelEpoch.getTime() + daysOffset * 86400000).toISOString().split('T')[0];
  } else if (date instanceof Date) {
    // 如果是 Date 对象，直接格式化
    return date.toISOString().split('T')[0];
  } else if (typeof date === 'string') {
    // 如果是字符串形式的 Date 对象，尝试将其转换为标准格式
    return new Date(date).toISOString().split('T')[0];
  }
  return date;
}

// 接收传递进来的tableData
const props = defineProps({
  tableData: {
    type: Array,
    default: () => []
  }
})

const customWidths = reactive({
  shipmentId: 150, // 新增的 shipmentId 字段宽度
  so_number: 120,
  accessorials: 200,
  warehouse_location: 150,
  length: 120,
  width: 120,
  height: 120,
  weight: 120,
  delivery_zip: 120,
  pallets: 150,
  pcs: 120,
  pick_up_date: 150,
  delivery_service_type: 200,
  location_type: 150,
  has_pallet_jack_forklift: 220,
  shipment_service_type: 200,
  pickupAddress: 180,
  pickupLocationType: 180,
  pickupAccessorials: 250,
  daylight: 120,
  daylight_class: 150,
  auptix_class: 150,
  auptix_standard_inflexible: 220,
  auptix_flock_direct_inflexible: 250,
  priceConfirmed: 150, // 新增价格确认字段的宽度
  customPrice: 150, // New field for customPrice
  xpo: 120, // Add the width for the new XPO column
  mothership_price: 150,
  viewQuote: 150,
  default: 150
})
// Handle row deletion
const deleteRow = (index) => {
  props.tableData.splice(index, 1);
};

// 合并相同SO和仓库位置的数据
const groupedTableData = computed(() => {
  const grouped = {};
  props.tableData.forEach(item => {
    const key = `${item.so_number}-${item.warehouse_location}`;

    if (!grouped[key]) {
      // Initialize merged data for unique SO and warehouse location
      grouped[key] = {
        shipmentId: item.shipmentId,
        so_number: item.so_number,
        warehouse_location: item.warehouse_location,
        accessorials: item.accessorials,
        delivery_zip: item.delivery_zip,
        pick_up_date: formatDate(item.pick_up_date),
        delivery_service_type: item.delivery_service_type,
        location_type: item.location_type,
        has_pallet_jack_forklift: item.has_pallet_jack_forklift,
        shipment_service_type: item.shipment_service_type,
        daylight: item.daylight,
        auptix_standard_inflexible: item.auptix_standard_inflexible,
        auptix_flock_direct_inflexible: item.auptix_flock_direct_inflexible,
        xpo_price: item.xpo_price,
        mothership_price: item.mothership_price,
        mesurement: [],
        weight: [],
        pallets: [],
        pcs: [],
        priceConfirmed: item.priceConfirmed,
        customPrice: item.customPrice,
        custom_warehouse_address: item.custom_warehouse_address || '',
        pickup_location_type: item.pickup_location_type || '',
        custom_pickup_accessorials: item.custom_pickup_accessorials || []
      };
    }

    // Merge cargo information
    grouped[key].mesurement.push(item.mesurement);
    grouped[key].weight.push(item.weight);
    grouped[key].pallets.push(item.pallets);
    grouped[key].pcs.push(item.pcs);
  });

  // Convert merged data to array format and join cargo information with line breaks
  return Object.values(grouped).map(group => ({
    ...group,
    mesurement: group.mesurement.join('<br>'),
    weight: group.weight.join('<br>'),
    pallets: group.pallets.join('<br>'),
    pcs: group.pcs.join('<br>')
  }));
});


// Helper function for background color
const getLowestPriceStyle = (row, priceType) => {
  // Parse all prices and handle cases where they are not valid numbers
  const prices = [
    row.daylight === 'N/A' || row.daylight === null || row.daylight === undefined ? Infinity : Number(row.daylight),
    row.auptix_standard_inflexible === 'N/A' || row.auptix_standard_inflexible === null || row.auptix_standard_inflexible === undefined ? Infinity : Number(row.auptix_standard_inflexible),
    row.auptix_flock_direct_inflexible === 'N/A' || row.auptix_flock_direct_inflexible === null || row.auptix_flock_direct_inflexible === undefined ? Infinity : Number(row.auptix_flock_direct_inflexible),
    row.customPrice === 'N/A' || row.customPrice === null || row.customPrice === undefined ? Infinity : Number(row.customPrice),
    row.xpo === 'N/A' || row.xpo === null || row.xpo === undefined ? Infinity : Number(row.xpo), // Include XPO price
    row.mothership_price === 'N/A' ? Infinity : Number(row.mothership_price)
  ];

  // Find the minimum price from the list
  const lowestPrice = Math.min(...prices);
  // If all prices are Infinity, there is no valid price to compare
  if (lowestPrice === Infinity) {
    return ''; // No valid price, so return an empty string
  }
  // Check if the current price is the lowest
  if (Number(row[priceType]) === lowestPrice) {
    return '#FF8888'; // Highlight the cell if it's the lowest price
  }
  return ''; // Default return if the price is not the lowest
};
</script>

<style scoped>
/* 样式调整，使表格更加美观 */
.el-table {
  margin-top: 20px;
}

.el-table th, .el-table td {
  text-align: center;
}

.el-table-column {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
