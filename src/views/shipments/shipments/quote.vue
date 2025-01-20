<template>
  <div class="container" v-loading="loading" element-loading-text="正在询价中，批量询价需要较长时间...请稍候" element-loading-spinner="el-icon-loading">
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
              <el-option label="Dallas盈仓" value="DAL"></el-option>
              <el-option label="西雅图代理仓" value="Seattle"></el-option>
              <el-option label="芝加哥代理仓" value="Chicago"></el-option>
              <el-option label="休斯顿代理仓" value="Houston"></el-option>
              <el-option label="FL代理仓" value="Miami"></el-option>
              <el-option label="加州代理仓" value="Hayward"></el-option>
              <el-option label="Custom/自定义" value="custom"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- Custom Warehouse Address Field -->
        <el-col v-if="formData.warehouse_location === 'custom'" :span="12">
          <el-form-item label="Pick up Address/提货ZIP CODE" prop="custom_pickup_zip_code">
            <el-input v-model="formData.custom_warehouse_address" placeholder="Enter custom warehouse ZIP CODE" clearable :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>

        <el-col v-if="formData.warehouse_location === 'custom'" :span="12">
          <el-form-item label="Pick-up Location Type/提货位置类型" prop="custom_pickup_location_type">
            <el-select v-model="formData.pickup_location_type" placeholder="Select Pick-up Location Type" clearable :style="{width: '100%'}">
              <el-option label="Business with Dock/有货台的商业地址" value="BUSINESS_DOCK"></el-option>
              <el-option label="Business without Dock/无货台的商业地址" value="BUSINESS_NO_DOCK"></el-option>
              <el-option label="Residential/住宅" value="RESIDENTIAL"></el-option>
              <el-option label="Limited Access/有限进入权限" value="LIMITED_ACCESS"></el-option>
              <el-option label="Trade Show/贸易展" value="TRADE_SHOW"></el-option>
              <el-option label="Construction/建筑工地" value="CONSTRUCTION"></el-option>
              <el-option label="Farm/农场" value="FARM"></el-option>
              <el-option label="Airport/机场" value="AIRPORT"></el-option>
              <el-option label="Church/教堂" value="CHURCH"></el-option>
              <el-option label="Military Base/军事基地" value="MILITARY_BASE"></el-option>
              <el-option label="Port/港口" value="PORT"></el-option>
              <el-option label="School/学校" value="SCHOOL"></el-option>
              <!-- Add more options as needed -->
            </el-select>
          </el-form-item>
        </el-col>

        <el-col v-if="formData.warehouse_location === 'custom'" :span="24" class="checkbox-group">
          <el-form-item label="Pick-up Accessorials/提货附加服务" prop="custom_pickup_accessorials">
            <el-checkbox-group v-model="formData.custom_pickup_accessorials">
              <el-checkbox label="Inside Pickup">Inside Pickup/室内提货</el-checkbox>
              <el-checkbox label="Limited Access or Constr Site Pickup">Limited Access or Constr Site Pickup/限制区域或建筑工地提货</el-checkbox>
              <el-checkbox label="Construction-Utility-Mine or Rmt Pickup">Construction-Utility-Mine or Rmt Pickup/建筑工地或偏远地区提货</el-checkbox>
              <el-checkbox label="Lift Gate Pickup">Lift Gate Pickup/升降门提货</el-checkbox>
              <el-checkbox label="Overlength 8 ft but less than 12 ft">Overlength 8 ft but less than 12 ft/长度超过 243.84 cm 但小于 365.76 cm</el-checkbox>
              <el-checkbox label="Overlength 12 ft but less than 20 ft">Overlength 12 ft but less than 20 ft/长度超过 365.76 cm 但小于 609.6 cm</el-checkbox>
              <el-checkbox label="Overlength 20 ft or greater">Overlength 20 ft or greater/长度超过 609.6 cm 或更长</el-checkbox>
              <el-checkbox label="Compliance Services Fee">Compliance Services Fee/合规服务费</el-checkbox>
            </el-checkbox-group>
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
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="Location Type/位置类型" prop="location_type">
            <el-select v-model="formData.location_type" placeholder="请选择Location Type" clearable :style="{width: '100%'}">
              <el-option label="Business with Dock/有货台的商业地址" value="BUSINESS_DOCK"></el-option>
              <el-option label="Business without Dock/无货台的商业地址" value="BUSINESS_NO_DOCK"></el-option>
              <el-option label="Residential/住宅" value="RESIDENTIAL"></el-option>
              <el-option label="Limited Access/有限进入权限" value="LIMITED_ACCESS"></el-option>
              <el-option label="Trade Show/贸易展" value="TRADE_SHOW"></el-option>
              <el-option label="Construction/建筑工地" value="CONSTRUCTION"></el-option>
              <el-option label="Farm/农场" value="FARM"></el-option>
              <el-option label="Airport/机场" value="AIRPORT"></el-option>
              <el-option label="Church/教堂" value="CHURCH"></el-option>
              <el-option label="Military Base/军事基地" value="MILITARY_BASE"></el-option>
              <el-option label="Port/港口" value="PORT"></el-option>
              <el-option label="School/学校" value="SCHOOL"></el-option>
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
              <el-checkbox label="Lift Gate Delivery" >Lift Gate Delivery/升降门配送</el-checkbox>
              <el-checkbox label="Appointment Fee" >Appointment Fee/预约费</el-checkbox>
              <el-checkbox label="Overlength 8 ft but less than 12 ft" >Overlength 8 ft but less than 12 ft/长度超过 243.84 cm 但小于 365.76 cm</el-checkbox>
              <el-checkbox label="Overlength 12 ft but less than 20 ft" >Overlength 12 ft but less than 20 ft/长度超过 365.76 cm 但小于 609.6 cm</el-checkbox>
              <el-checkbox label="Overlength 20 ft or greater" >Overlength 20 ft or greater/长度超过 609.6 cm 或更长</el-checkbox>
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
        </el-col>
                 <!-- 按钮：弹窗触发按钮 -->
        <el-col :span="24" class="button-group">
          <el-button type="primary" @click="openUploadDialog">批量上传报价信息</el-button>
        </el-col>

        <!-- 结果表格 -->
        <el-col :span="24">
          <results-table ref="resultsTableRef" :tableData="tableData" @show-quote="showQuoteDetails"></results-table>
        </el-col>
      </el-row>
    </el-form>
    <el-dialog
      title="报价详情"
      v-model="quoteDialogVisible"
      custom-class="custom-quote-dialog"
      width="450px"
      append-to-body
      :style="{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.3)', borderRadius: '10px', padding: '20px' }"
    >
      <!-- Recommended Price Card -->
      <div v-if="recommendedPrice.price !== 'N/A'" class="quote-cards-container">
        <el-card 
          class="quote-card recommended-card"
          :class="{'selected-quote': selectedQuote === recommendedPrice.label}"
          @click="selectQuote(recommendedPrice)"
        >
          <div slot="header">
            <span>推荐价格: {{ recommendedPrice.label }}</span>
          </div>
          <p>报价: {{ recommendedPrice.price }}</p>
        </el-card>
      </div>

      <!-- Scrollable container for other quotes -->
      <div 
        v-if="selectedQuoteDetails.length > 0" 
        class="quote-cards-container" 
        style="max-height: 500px; overflow-y: auto; padding-right: 10px;"
      >
        <el-card 
          class="quote-card" 
          v-for="(quote, index) in selectedQuoteDetails" 
          :key="index" 
          :class="{'selected-quote': selectedQuote === quote.label}"
          @click="selectQuote(quote)"
        >
          <div slot="header">
            <span>{{ quote.label }}</span>
          </div>
          <p>报价: {{ quote.price }}</p>
        </el-card>
      </div>

      <div v-else>
        <p>没有可显示的报价信息。</p>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="quoteDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="confirmSelectedQuote" :disabled="!selectedQuote">确认</el-button>
      </span>
    </el-dialog>





    <!-- 弹窗 -->
    <el-dialog title="上传和下载Excel模板" v-model="uploadDialogVisible" width="50%">
      <!-- 上传Excel -->
      <el-upload
        class="upload-demo"
        drag
        :before-upload="handleFileUpload"
        accept=".xls,.xlsx"
        :show-file-list="false"
      >
        <el-button type="primary">上传报价文件</el-button>
        <div slot="tip" class="el-upload__tip">支持扩展名为 .xls 和 .xlsx 的文件</div>
      </el-upload>

      <!-- 下载模板按钮 -->
      <el-button type="success" @click="downloadTemplate">下载报价模板</el-button>

      <!-- 关闭弹窗按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
        title="Mothership Prices"
        v-model="mothershipDialogVisible"
        width="500px"
      >
        <el-table :data="selectedMothershipPrices" style="width: 100%">
          <el-table-column prop="provider" label="Provider"></el-table-column>
          <el-table-column prop="serviceType" label="Service Type"></el-table-column>
          <el-table-column prop="price" label="Price"></el-table-column>
          <el-table-column prop="estimatedDeliveryDate" label="Estimated Delivery"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="mothershipDialogVisible = false">关闭</el-button>
        </span>
      </el-dialog>
    <!-- 固定按钮在页面底部 -->
    <div class="fixed-buttons">
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="resetForm">重置表单</el-button>
      <el-button type="success" @click="downloadResults">下载结果</el-button>
      <el-button type="danger" @click="clearAllData">清空页面</el-button> <!-- 清空页面按钮 -->
    </div>
        <!-- Add the custom footer at the end of the page -->
        <custom-footer></custom-footer>
        
  </div>

</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import * as XLSX from 'xlsx'
import CargoInfo from './CargoInfo.vue'
import ResultsTable from './ResultsTable.vue'
import { submitQuoteForm } from '@/api/shipments/shipments'
import CustomFooter from './notice.vue';
// 控制表单加载的状态
const loading = ref(false);
// 弹窗控制变量
const uploadDialogVisible = ref(false)
// 辅助函数：打开弹窗
const openUploadDialog = () => {
  
  uploadDialogVisible.value = true
}
const mothershipDialogVisible = ref(false); // 控制弹窗的显示状态
const selectedMothershipPrices = ref([]);   // 用于存储选择的Mothership报价信息

const resultsTableRef = ref(null);
const quoteDialogVisible = ref(false);
const selectedQuoteDetails = ref([]);
const selectedQuote = ref(null); // Track the selected quote
const currentRow = ref(null); // Store the current row for updating
const recommendedPrice = ref({ label: '', price: 'N/A' }); 
// Method to show quote details
const showQuoteDetails = (row) => {
  selectedQuoteDetails.value = [
    { label: 'Daylight', price: row.daylight || 'N/A' },
    { label: 'Flock Freight Standard', price: row.auptix_standard_inflexible || 'N/A' },
    { label: 'Flock Freight Direct', price: row.auptix_flock_direct_inflexible || 'N/A' },
    { label: 'Custom Price', price: row.customPrice || 'N/A' },
    { label: 'XPO Price', price: row.xpo_price || 'N/A' },
    { label: 'Mothership Price', price: row.mothership_price || 'N/A' }
  ];

  currentRow.value = row;
  selectedQuote.value = null;
  calculateRecommendedPrice(row);
  quoteDialogVisible.value = true;
};

// Method to select a quote
const selectQuote = (quote) => {
  selectedQuote.value = quote.label; // Track the selected quote label
};
// Method to calculate the recommended (lowest) price
const calculateRecommendedPrice = (row) => {
  const prices = [
    { label: 'Daylight', price: row.daylight },
    { label: 'Flock Freight Standard', price: row.auptix_standard_inflexible },
    { label: 'Flock Freight Direct', price: row.auptix_flock_direct_inflexible },
    { label: 'Custom Price', price: row.customPrice },
    { label: 'XPO Price', price: row.xpo_price },
    { label: 'Mothership Price', price: row.mothership_price }
  ];

  const validPrices = prices.filter(item => item.price !== 'N/A' && item.price !== null && item.price !== undefined);
  if (validPrices.length > 0) {
    const lowest = validPrices.reduce((min, current) => (Number(current.price) < Number(min.price) ? current : min));
    recommendedPrice.value = lowest;
  } else {
    recommendedPrice.value = { label: '', price: 'N/A' };
  }
};


// Method to confirm the selected quote
const confirmSelectedQuote = () => {
  if (currentRow.value && selectedQuote.value) {
    // Update the priceConfirmed field in the table row
    currentRow.value.priceConfirmed = selectedQuote.value;
    
    // Optionally, call an API to save the change in the backend
    if (resultsTableRef.value) {
      resultsTableRef.value.updatePriceConfirmed(currentRow.value);
    }

    quoteDialogVisible.value = false; // Close the dialog
  }
};
// 初始化表单数据
const formRef = ref(null)
const formData = reactive({
  warehouse_location: '',
  custom_warehouse_address: '', // Add custom warehouse address
  pickup_location_type: '',     // Add custom pickup location type
  custom_pickup_accessorials: [],
  so_number: '',
  delivery_zip: '',
  pick_up_date: '',
  delivery_service_type: '',
  location_type: '',
  has_pallet_jack_forklift: '',
  shipment_service_type: 'WINDOW',
  field116: [],
  cargoItems: [{ length: '', width: '', height: '', weight: '', pallets: '', pcs: '' }]
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
  field116: [{ required: true, type: 'array', message: '请选择至少一个附加服务', trigger: 'change' }],
  price_confirmed: false // 新增字段
})
function convertExcelDate(excelDate) {
  const baseDate = new Date(Date.UTC(1899, 11, 30)); // Excel 基准日期是 1899-12-30
  const offsetDays = excelDate; // Excel 日期偏移天数
  const convertedDate = new Date(baseDate.getTime() + offsetDays * 86400000); // 加上天数并转换为毫秒

  // 确保返回本地时间，而不是 UTC 时间
  return new Date(convertedDate.getUTCFullYear(), convertedDate.getUTCMonth(), convertedDate.getUTCDate()).toISOString().split('T')[0];
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
  console.log('Submitting formData:', formData);
  loading.value = true;

  // Convert all dates in tableData to the proper format
  tableData.value = tableData.value.map(row => {
    return {
      ...row,
      pick_up_date: formatDate(row.pick_up_date)  // Format the date
    };
  });

  // Validate the table data
  if (tableData.value.length === 0) {
    ElMessage({
      message: '表格中没有数据，无法提交',
      type: 'error',
      duration: 5000
    });
    loading.value = false;
    return;
  }

  const unquotedData = tableData.value.filter(row => !row.isQuoted);

  if (unquotedData.length === 0) {
    ElMessage({
      message: '没有新的数据需要提交报价',
      type: 'error',
      duration: 5000
    });
    loading.value = false;
    return;
  }

  try {
    const response = await submitQuoteForm(tableData.value);
    console.log(response);

    if (response && response.data && Array.isArray(response.data)) {
      let index1 = 0, index2 = 0;

      while (index1 < tableData.value.length && index2 < response.data.length) {
        const row = tableData.value[index1];
        const responseItem = response.data[index2];

        // Handle Daylight API response
        const daylightResponse = responseItem.DaylightApiResponse;
        row.daylight = daylightResponse && !daylightResponse.startsWith("Error") ? daylightResponse : 'N/A';

        // Handle SO number
        const responseSoNumber = String(responseItem['So_Number:']).trim();
        const tableSoNumber = String(row.so_number).trim();
        const shipmentId = responseItem.shipmentId;

        // If SO number matches, handle other responses
        if (tableSoNumber === responseSoNumber) {
          row.shipmentId = shipmentId;


          row.auptix_flock_direct_inflexible = responseItem.auptixFlockDirectResponse && !responseItem.auptixFlockDirectResponse.startsWith("Error")
            ? responseItem.auptixFlockDirectResponse
            : 'N/A';
          row.auptix_standard_inflexible = responseItem.auptixFlockResponse && !responseItem.auptixFlockResponse.startsWith("Error")
            ? responseItem.auptixFlockResponse
            : 'N/A';
          // Handle customPrice response
          row.customPrice = responseItem.customPriceApiResponse && !responseItem.customPriceApiResponse.startsWith("Error")
            ? responseItem.customPriceApiResponse
            : 'N/A';

          // Handle XPO price response
          row.xpo_price = responseItem.XPOResponse && !responseItem.XPOResponse.startsWith("Error")
            ? responseItem.XPOResponse
            : 'N/A';
          row.mothership_price = responseItem.mothershipResponse && !responseItem.mothershipResponse.startsWith("Error")
            ? responseItem.mothershipResponse
            : 'N/A';


          index1++;
          index2++;
        } else {
          index1++;
        }
      }
    }

    // Mark the data as quoted
    unquotedData.forEach(row => {
      row.isQuoted = true;
    });
    ElMessage({
      message: '表单提交成功！',
      type: 'success',
      duration: 5000
    });
  } catch (error) {
    console.error('提交表单时出错:', error);

    if (error.response && error.response.data && error.response.data.message) {
      ElMessage({
        message: `表单提交失败: ${error.response.data.message}`,
        type: 'error',
        duration: 5000
      });
    } else {
      ElMessage({
        message: '表单提交失败，请重试',
        type: 'error',
        duration: 5000
      });
    }
  } finally {
    loading.value = false;
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

    // 将 Excel 数据映射到表单字段
    const convertedData = jsonData.map(row => ({
      so_number: row['货件编码'],  // Shipment Code
      accessorials: row['附加服务'],  // Accessorial Services
      warehouse_location: row['提货仓库'],  // Warehouse Location
      delivery_zip: row['送货zip'],  // Delivery Zip
      pick_up_date: formatDate(row['提货时间']),  // Pick Up Date with date formatting
      delivery_service_type: row['送货服务类型'],  // Delivery Service Type
      location_type: row['送货地址类型'],  // Delivery Address Type
      shipment_service_type: row['提货服务类型'],  // Shipment Service Type
      mesurement: row['货物尺寸'],
      weight: row['货物重量'],
      pallets: row['货物板数'],
      has_pallet_jack_forklift: row['可独立卸货'],  // Can Unload Independently (true/false)
    }));

    // 将新上传的数据追加到现有的 tableData 中
    tableData.value = [...tableData.value, ...convertedData];
  };
  reader.readAsArrayBuffer(file);
  uploadDialogVisible.value = false;
  // 阻止默认上传行为
  return false;
};



const addToTable = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      // Add the new data including pcs and customPrice
      const cargoItemsWithMeasurement = formData.cargoItems.map(item => ({
        so_number: formData.so_number,
        warehouse_location: formData.warehouse_location,
        delivery_zip: formData.delivery_zip,
        pick_up_date: formData.pick_up_date,
        delivery_service_type: formData.delivery_service_type,
        location_type: formData.location_type,
        has_pallet_jack_forklift: formData.has_pallet_jack_forklift,
        shipment_service_type: formData.shipment_service_type,
        custom_warehouse_address: formData.custom_warehouse_address, // Save the address
        pickup_location_type: formData.pickup_location_type, // Save pickup type
        custom_pickup_accessorials: formData.custom_pickup_accessorials.join(', '), 
        accessorials: formData.field116.join(', '),
        pallets: item.pallets,
        weight: item.weight,
        pcs: item.pcs, // Add pcs field
        mesurement: `${item.length}*${item.width}*${item.height}`, // Generate Measurement field
        isQuoted: false  // Default to not quoted
      }));

      // Push new data into the table
      console.log(tableData.value);

      tableData.value.push(...cargoItemsWithMeasurement);
      ElMessage.success('数据已成功添加到表格');
    } else {
      ElMessage.error('请检查输入项是否正确');
    }
  });
};

const downloadTemplate = () => {
  const link = document.createElement('a');
  link.href = '/templates/LTL_Quote_Template.xls';  // 指向 public 目录中的模板文件路径
  link.download = 'LTL_Quote_Template.xls';  // 下载文件名
  link.click();
}


const downloadResults = () => {
  const dataToDownload = tableData.value.map(row => ({
    "SO Number": row.so_number,
    "Warehouse Location": row.warehouse_location,
    "Accessorials": row.accessorials,
    "Mesurement (Length*Width*Height)": row.mesurement.replace(/<br>/g, '\n'),
    "Weight": row.weight.replace(/<br>/g, '\n'),
    "Pallet Number": row.pallets.replace(/<br>/g, '\n'),
    "Pieces": row.pcs, // Add pcs to the download
    "Delivery Zip": row.delivery_zip,
    "Pick Up Date": row.pick_up_date,
    "Delivery Service Type": row.delivery_service_type,
    "Location Type": row.location_type,
    "Has Pallet Jack and Forklift": row.has_pallet_jack_forklift,
    "Shipment Service Type": row.shipment_service_type,
    "Daylight Price": row.daylight,
    "Auptix Standard Inflexible Price": row.auptix_standard_inflexible,
    "Auptix Flock Direct Inflexible Price": row.auptix_flock_direct_inflexible,
    "Custom Price": row.customPrice, // Add customPrice to the download
    "XPO Price": row.xpo_price, // Add xpo_price to the download
    "Mothership Price": row.mothership_price
  }));

  // Convert data to Excel format and download
  const ws = XLSX.utils.json_to_sheet(dataToDownload);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Results');
  XLSX.writeFile(wb, 'results.xlsx');
};



// 保存数据到 sessionStorage
const saveDataToSession = () => {
  sessionStorage.setItem('formData', JSON.stringify(formData));  // 将表单数据转换为 JSON 字符串并保存
  sessionStorage.setItem('tableData', JSON.stringify(tableData.value));  
};

// 从 sessionStorage 恢复数据
const loadDataFromSession = () => {
  const savedData = sessionStorage.getItem('formData');
  const savedTableData = sessionStorage.getItem('tableData');
  if (savedData) {
    Object.assign(formData, JSON.parse(savedData));  // 恢复数据并覆盖到表单的响应式对象中
  }
    // 恢复表格数据
    if (savedTableData) {
    tableData.value = JSON.parse(savedTableData);
  }
};

// 页面加载时恢复数据
onMounted(() => {
  loadDataFromSession();  // 页面挂载时从 sessionStorage 恢复数据
});

// 监听 formData 的变化，并将其保存到 sessionStorage
watch(formData, (newValue) => {
  saveDataToSession();  // 表单数据变化时保存到 sessionStorage
}, { deep: true });
watch(tableData, () => {
  saveDataToSession();  // 表格数据变化时保存
}, { deep: true });
// 清空表单和 sessionStorage 数据

const clearAllData = () => {
  sessionStorage.removeItem('formData');
  sessionStorage.removeItem('tableData');  // 清除表格数据
  formRef.value.resetFields() // 重置表单
  tableData.value = [] // 清空表格数据
  formData.cargoItems = [{ length: '', width: '', height: '', weight: '', pallets: '', pcs: '' }] // 重置货物信息
  ElMessage.success('页面已清空')
};


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
.container {
  width: 80%;
  max-width: 1800px;
  margin: 40px auto;
  padding: 20px;
  background: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

/* Add styles for the quote cards */
.quote-card {
  cursor: pointer;
  transition: 0.3s;
  border-radius: 10px;
  margin: 20px;
}

.quote-card:hover {
  border-color: #409EFF;
  transform: scale(1.05);
}

/* Style for the selected quote */
.selected-quote {
  border: 2px solid #409EFF;
}

/* Style for the recommended price card */
.recommended-card {
  border: 2px solid #67C23A;
  background-color: #f0f9eb;
}
</style>

