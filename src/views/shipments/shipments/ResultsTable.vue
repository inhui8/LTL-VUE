<template>
  <div>
    <el-table :data="groupedTableData" style="width: 100%" border>
      <el-table-column prop="so_number" label="SO/货件编号" :width="customWidths.so_number" show-overflow-tooltip :resizable="true"></el-table-column>
      <el-table-column prop="accessorials" label="Accessorials/附加服务" :width="customWidths.accessorials" show-overflow-tooltip :resizable="true"></el-table-column>
      <el-table-column prop="warehouse_location" label="Warehouse Location/仓库位置" :width="customWidths.warehouse_location" show-overflow-tooltip :resizable="true"></el-table-column>

      <!-- 合并后的cargo信息展示 -->
      <el-table-column label="Mesurement(货物尺寸）/长度(英寸)">
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

      <!-- 其他字段 -->
      <el-table-column prop="delivery_zip" label="Delivery Zip/送货邮编" :width="customWidths.delivery_zip" show-overflow-tooltip :resizable="true"></el-table-column>
      <el-table-column prop="pick_up_date" label="Pick Up Date/提货日期" :width="customWidths.pick_up_date" show-overflow-tooltip :resizable="true"></el-table-column>
      <el-table-column prop="delivery_service_type" label="Delivery Service Type/送货服务类型" :width="customWidths.delivery_service_type" show-overflow-tooltip :resizable="true"></el-table-column>
      <el-table-column prop="location_type" label="Location Type/位置类型" :width="customWidths.location_type" show-overflow-tooltip :resizable="true"></el-table-column>
      <el-table-column prop="has_pallet_jack_forklift" label="Has Pallet Jack and Forklift/是否有托盘搬运车和叉车" :width="customWidths.has_pallet_jack_forklift" show-overflow-tooltip :resizable="true"></el-table-column>
      <el-table-column prop="shipment_service_type" label="Shipment Service Type/货运服务类型" :width="customWidths.shipment_service_type" show-overflow-tooltip :resizable="true"></el-table-column>
      <el-table-column prop="daylight" label="供应商1价格" :width="customWidths.daylight" show-overflow-tooltip :resizable="true"></el-table-column>
      <el-table-column prop="auptix_standard_inflexible" label="供应商2 Standard Inflexible" :width="customWidths.auptix_standard_inflexible" show-overflow-tooltip :resizable="true"></el-table-column>
      <el-table-column prop="auptix_flock_direct_inflexible" label="供应商2 Flock Direct Inflexible" :width="customWidths.auptix_flock_direct_inflexible" show-overflow-tooltip :resizable="true"></el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { computed, defineProps, reactive } from 'vue'

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

// 可自定义每列宽度的配置
const customWidths = reactive({
  so_number: 120,
  accessorials: 200,
  warehouse_location: 150,
  length: 120,
  width: 120,
  height: 120,
  weight: 120,
  delivery_zip: 120,
  pallets: 150,
  pick_up_date: 150,
  delivery_service_type: 200,
  location_type: 150,
  has_pallet_jack_forklift: 220,
  shipment_service_type: 200,
  daylight: 120,
  daylight_class: 150,
  auptix_class: 150,
  auptix_standard_inflexible: 220,
  auptix_flock_direct_inflexible: 250
})

// 合并相同SO和仓库位置的数据
const groupedTableData = computed(() => {
  const grouped = {}
  props.tableData.forEach(item => {
    const key = `${item.so_number}-${item.warehouse_location}`

    if (!grouped[key]) {
      // 初始化一个合并后的数据
      grouped[key] = {
        so_number: item.so_number,
        warehouse_location: item.warehouse_location,
        accessorials: item.accessorials,
        delivery_zip: item.delivery_zip,
        pick_up_date: formatDate(item.pick_up_date), // 格式化提货日期
        delivery_service_type: item.delivery_service_type,
        location_type: item.location_type,
        has_pallet_jack_forklift: item.has_pallet_jack_forklift,
        shipment_service_type: item.shipment_service_type,
        daylight: item.daylight,
        auptix_standard_inflexible: item.auptix_standard_inflexible,
        auptix_flock_direct_inflexible: item.auptix_flock_direct_inflexible,
        mesurement: [],
        weight: [],
        pallets: []
      }
    }

    // 合并货物信息
    grouped[key].mesurement.push(item.mesurement)
    grouped[key].weight.push(item.weight)
    grouped[key].pallets.push(item.pallets)
  })

  // 将合并后的数据转换为数组格式，并将合并后的货物信息进行换行处理
  return Object.values(grouped).map(group => ({
    ...group,
    mesurement: group.mesurement.join('<br>'),
    weight: group.weight.join('<br>'),
    pallets: group.pallets.join('<br>')
  }))
})
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
