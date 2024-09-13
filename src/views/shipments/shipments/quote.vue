<template>
  <div class="container">
    <h1>LTL报价</h1>
    <el-form ref="formRef" :model="formData" :rules="rules" size="default" label-width="160px" label-position="top">
      <el-row :gutter="20">
        <!-- 表单字段 -->
        <el-col :span="12">
          <el-form-item label="Warehouse Location/仓库位置" prop="warehouse_location">
            <el-select v-model="formData.warehouse_location" placeholder="Select Warehouse Location" clearable :style="{width: '100%'}">
              <el-option label="LA盈仓" value="LA"></el-option>
              <el-option label="NJ盈仓" value="NJ"></el-option>
              <el-option label="SVG盈仓" value="SVG"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="SO/货件编号" prop="so_number">
            <el-input v-model="formData.so_number" placeholder="请输入SO" clearable :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="Delivery Zip/送货邮编" prop="delivery_zip">
            <el-input v-model="formData.delivery_zip" placeholder="请输入Delivery Zip" clearable :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="Pick Up Date/提货日期" prop="pick_up_date">
            <el-date-picker v-model="formData.pick_up_date" type="date" placeholder="请选择时间" clearable :style="{width: '100%'}"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="Delivery Service Type/送货服务类型" prop="delivery_service_type">
            <el-select v-model="formData.delivery_service_type" placeholder="请选择Delivery Service Type" clearable :style="{width: '100%'}">
              <el-option label="Call for Appointment" value="CALL_FOR_APPOINTMENT"></el-option>
              <el-option label="Direct Delivery" value="DIRECT_DELIVERY"></el-option>
              <el-option label="Standard Delivery" value="STANDARD_DELIVERY"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="Location Type/位置类型" prop="location_type">
            <el-select v-model="formData.location_type" placeholder="请选择Location Type" clearable :style="{width: '100%'}">
              <el-option label="Business with Dock/有货台的商业地址" value="BUSINESS_DOCK"></el-option>
              <el-option label="Business without Dock/无货台的商业地址" value="BUSINESS_NO_DOCK"></el-option>
              <el-option label="Residential/住宅" value="RESIDENTIAL"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="Has Pallet Jack and Forklift/有托盘车和叉车" prop="has_pallet_jack_forklift">
            <el-select v-model="formData.has_pallet_jack_forklift" placeholder="请选择选项" clearable :style="{width: '100%'}">
              <el-option label="Yes" value="Yes"></el-option>
              <el-option label="No" value="No"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="Shipment Service Type/货运服务类型" prop="shipment_service_type">
            <el-input v-model="formData.shipment_service_type" placeholder="请输入Shipment Service Type" value="WINDOW" readonly :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="checkbox-group">
          <el-form-item label="Accessorials/附加服务" prop="field116">
            <el-checkbox-group v-model="formData.field116">
              <el-checkbox label="Residential Delivery" >Residential Delivery/住宅配送</el-checkbox>
              <el-checkbox label="Inside Delivery" >Inside Delivery/室内配送</el-checkbox>
              <el-checkbox label="Limited Access or Constr Site Dlvry" >Limited Access or Constr Site Dlvry/限制区域或建筑工地配送</el-checkbox>
              <el-checkbox label="Construction-Utility-Mine or Rmt Del" >Construction-Utility-Mine or Rmt Del/建筑工地或偏远地区配送</el-checkbox>
              <el-checkbox label="Lift Gate Delivery" >Lift Gate Delivery/尾板配送</el-checkbox>
              <el-checkbox label="Appointment Fee" >Appointment Fee/预约费</el-checkbox>
              <el-checkbox label="Overlength 8 ft but less than 12 ft" >Overlength 8 ft but less than 12 ft/长度超过8英尺但小于12英尺</el-checkbox>
              <el-checkbox label="Overlength 12 ft but less than 20 ft" >Overlength 12 ft but less than 20 ft/长度超过12英尺但小于20英尺</el-checkbox>
              <el-checkbox label="Overlength 20 ft or greater" >Overlength 20 ft or greater/长度超过20英尺或更长</el-checkbox>
              <el-checkbox label="Compliance Services Fee" >Compliance Services Fee/合规服务费</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>

        <!-- Cargo Info -->
        <el-col :span="24">
          <cargo-info :cargoItems="formData.cargoItems" @update:cargoItems="formData.cargoItems = $event"></cargo-info>
        </el-col>

        <!-- 上传Excel和添加按钮 -->
        <el-col :span="24" class="button-group">
          <el-button type="primary" @click="addToTable">添加</el-button>
          <el-upload
            class="upload-demo"
            drag
            :before-upload="handleFileUpload"
            accept=".xls,.xlsx"
            :show-file-list="false"
          >
            <el-button type="primary">上传Excel文件</el-button>
            <div slot="tip" class="el-upload__tip">支持扩展名为 .xls 和 .xlsx 的文件</div>
          </el-upload>
        </el-col>

        <!-- 结果表格 -->
        <el-col :span="24">
          <results-table :tableData="tableData"></results-table>
        </el-col>
      </el-row>
    </el-form>

    <!-- 固定按钮在页面底部 -->
    <div class="fixed-buttons">
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="resetForm">重置表单</el-button>
      <el-button type="success" @click="downloadResults">下载结果</el-button>
      <el-button type="danger" @click="clearAllData">清空页面</el-button> <!-- 清空页面按钮 -->
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import * as XLSX from 'xlsx'
import CargoInfo from './CargoInfo.vue'
import ResultsTable from './ResultsTable.vue'
import { submitQuoteForm } from '@/api/shipments/shipments'

// 初始化表单数据
const formRef = ref(null)
const formData = reactive({
  warehouse_location: '',
  so_number: '',
  delivery_zip: '',
  pick_up_date: '',
  delivery_service_type: '',
  location_type: '',
  has_pallet_jack_forklift: '',
  shipment_service_type: 'WINDOW',
  field116: [],
  cargoItems: [{ length: '', width: '', height: '', weight: '', pallets: '' }]
})

const rules = reactive({
  warehouse_location: [{ required: true, message: '请选择仓库位置', trigger: 'change' }],
  so_number: [{ required: true, message: '请输入SO编号', trigger: 'blur' }],
  delivery_zip: [{ required: true, message: '请输入送货邮编', trigger: 'blur' }],
  pick_up_date: [{ required: true, message: '请选择提货日期', trigger: 'change' }],
  delivery_service_type: [{ required: true, message: '请选择送货服务类型', trigger: 'change' }],
  location_type: [{ required: true, message: '请选择位置类型', trigger: 'change' }],
  has_pallet_jack_forklift: [{ required: true, message: '请选择是否有托盘车和叉车', trigger: 'change' }],
  shipment_service_type: [{ required: true, message: '请输入货运服务类型', trigger: 'blur' }],
  field116: [{ required: true, type: 'array', message: '请选择至少一个附加服务', trigger: 'change' }]
})
// 辅助函数：将 Excel 日期序列号转换为标准日期
function convertExcelDate(excelDate) {
  const baseDate = new Date(Date.UTC(1899, 11, 30)); // Excel 基准日期为 1899-12-30
  const convertedDate = new Date(baseDate.getTime() + (excelDate - 1) * 86400000); // 加上天数
  return convertedDate.toISOString().split('T')[0]; // 格式化为 yyyy-MM-dd
}

// 辅助函数：处理日期格式（Excel 日期或标准日期）
function formatDate(date) {
  if (typeof date === 'number') {
    // 如果是 Excel 日期格式（数字），则转换为标准日期
    return convertExcelDate(date);
  } else if (typeof date === 'string') {
    // 如果是标准日期格式（字符串），直接返回
    return new Date(date).toISOString().split('T')[0];
  }
  return date;
}
const tableData = ref([]) // 用于显示结果表格的数据

const submitForm = async () => {
  // 遍历所有表格数据，转换日期格式
  tableData.value = tableData.value.map(row => {
    return {
      ...row,
      pick_up_date: formatDate(row.pick_up_date)  // 处理日期格式
    };
  });

  // 提交表单逻辑
  if (tableData.value.length === 0) {
    ElMessage.error('表格中没有数据，无法提交');
    return;
  }

  try {
    const response = await submitQuoteForm(tableData.value);
    console.log(response);

    if (response && response.data && Array.isArray(response.data)) {
      let index1 = 0, index2 = 0;  // 初始化索引

      // 使用 while 循环遍历 tableData 和 response.data
      while (index1 < tableData.value.length && index2 < response.data.length) {
        const row = tableData.value[index1];  // 获取当前表格行
        const responseItem = response.data[index2];  // 获取当前响应项

        // 获取 Daylight 的 Net Charge 和 SO 编号
        const netCharge = responseItem.DaylightApiResponse;
        const responseSoNumber = String(responseItem['So_Number:']).trim(); // 确保是字符串并去除空格
        const tableSoNumber = String(row.so_number).trim(); // 确保是字符串并去除空格

        // 检查 SO 编号是否匹配
        if (tableSoNumber === responseSoNumber) {
          // 更新当前表格行的 Daylight 列
          row.daylight = netCharge;

          // 提取 auptixApiResponse 中的价格
          const auptixResponse = responseItem.auptixApiResponse;
          console.log(auptixResponse);
          const { standardPrice, flockDirectPrice } = extractAuptixPrices(auptixResponse);
          console.log(standardPrice);
          // 更新表格行中的 auptix 的两个价格
          row.auptix_standard_inflexible = standardPrice;
          row.auptix_flock_direct_inflexible = flockDirectPrice;

          // 如果匹配上了，两个索引都递增
          index1++;
          index2++;
        } else {
          // 如果不匹配，只递增表格的索引
          index1++;
        }
      }
    }

    ElMessage.success('表单提交成功！');
  } catch (error) {
    console.error('提交表单时出错:', error);  // 打印错误信息
    ElMessage.error('表单提交失败，请重试');
  }
};


function extractAuptixPrices(auptixResponse) {
  const rates = {};
  const lines = auptixResponse.split('Price:'); // 按照 'Price:' 进行分割

  // 遍历每个分割后的部分来提取价格和服务类型
  lines.forEach(line => {
    if (line.includes('STANDARD')) {
      const standardMatch = line.match(/([\d.]+) Service Level: STANDARD/);
      if (standardMatch) {
        rates.standardPrice = parseFloat(standardMatch[1]);
      }
    } else if (line.includes('FLOCK_DIRECT')) {
      const flockMatch = line.match(/([\d.]+) Service Level: FLOCK_DIRECT/);
      if (flockMatch) {
        rates.flockDirectPrice = parseFloat(flockMatch[1]);
      }
    }
  });
  console.log(rates.standardPrice)
  console.log(rates.flockDirectPrice)
  return {
    standardPrice: rates.standardPrice || null,
    flockDirectPrice: rates.flockDirectPrice || null
  };
}





// 重置表单
const resetForm = () => {
  formRef.value.resetFields()
}

// 文件上传处理函数，解析Excel文件并显示在表格中
const handleFileUpload = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet);

    // 将 Excel 日期转换为标准日期格式
    const convertedData = jsonData.map(row => ({
      ...row,
      pick_up_date: formatDate(row.pick_up_date)  // 转换 Excel 日期
    }));

    // 将新上传的数据追加到现有的 tableData 中
    tableData.value = [...tableData.value, ...convertedData];
  };
  reader.readAsArrayBuffer(file);

  // 阻止默认上传行为
  return false;
};

// 添加表单数据到表格
const addToTable = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      // 验证通过后将表单数据添加到表格中
      const cargoItemsWithMeasurement = formData.cargoItems.map(item => ({
        so_number: formData.so_number,
        warehouse_location: formData.warehouse_location,
        delivery_zip: formData.delivery_zip,
        pick_up_date: formData.pick_up_date,
        delivery_service_type: formData.delivery_service_type,
        location_type: formData.location_type,
        has_pallet_jack_forklift: formData.has_pallet_jack_forklift,
        shipment_service_type: formData.shipment_service_type,
        accessorials: formData.field116.join(', '),
        pallets: item.pallets,
        weight: item.weight,
        mesurement: `${item.length}*${item.width}*${item.height}` // 生成Measurement字段
      }))

      // 将新数据添加到表格中
      tableData.value.push(...cargoItemsWithMeasurement)
      ElMessage.success('数据已成功添加到表格')
    } else {
      ElMessage.error('请检查输入项是否正确')
    }
  })
}


// 下载结果为Excel文件
const downloadResults = () => {
  // 重新整理并创建需要下载的数据结构
  const dataToDownload = tableData.value.map(row => ({
    "SO Number": row.so_number,
    "Warehouse Location": row.warehouse_location,
    "Accessorials": row.accessorials,
    "Mesurement (Length*Width*Height)": row.mesurement.replace(/<br>/g, '\n'), // 将换行标签转换为换行符
    "Weight": row.weight.replace(/<br>/g, '\n'),
    "Pallet Number": row.pallets.replace(/<br>/g, '\n'),
    "Delivery Zip": row.delivery_zip,
    "Pick Up Date": row.pick_up_date,
    "Delivery Service Type": row.delivery_service_type,
    "Location Type": row.location_type,
    "Has Pallet Jack and Forklift": row.has_pallet_jack_forklift,
    "Shipment Service Type": row.shipment_service_type,
    "Daylight Price": row.daylight,
    "Auptix Standard Inflexible Price": row.auptix_standard_inflexible,
    "Auptix Flock Direct Inflexible Price": row.auptix_flock_direct_inflexible
  }));

  // 使用 XLSX 将数据转换为 Excel 格式
  const ws = XLSX.utils.json_to_sheet(dataToDownload);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Results');

  // 下载 Excel 文件
  XLSX.writeFile(wb, 'results.xlsx');
};


// 清空页面所有数据
const clearAllData = () => {
  formRef.value.resetFields() // 重置表单
  tableData.value = [] // 清空表格数据
  formData.cargoItems = [{ length: '', width: '', height: '', weight: '', pallets: '' }] // 重置货物信息
  ElMessage.success('页面已清空')
}
</script>

<style scoped>
.container {
  width: 80%; /* 设置页面宽度为当前视口的80% */
  max-width: 1800px; /* 设置最大宽度为1800px */
  margin: 40px auto;
  padding: 20px;
  background: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.table-container {
  overflow-x: auto;
  margin-top: 20px; /* 为表格和按钮组之间添加间距 */
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.form-item {
  margin-bottom: 20px; /* 增加下方间距 */
}

.checkbox-group {
  margin-top: 20px; /* 增加复选框与上方表单项之间的距离 */
}

.button-group {
  display: flex;
  justify-content: space-between; /* 让按钮组的按钮分散排列 */
  margin-top: 20px;
}

.fixed-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  padding: 15px;
  text-align: center;
  z-index: 100;
}

.fixed-buttons .el-button {
  margin: 0 15px;
}
</style>

