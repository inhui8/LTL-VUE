<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="SO" prop="soNumber">
        <el-input
          v-model="queryParams.soNumber"
          placeholder="请输入SO"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="仓库地址" prop="warehouseLocation">
        <el-select v-model="queryParams.warehouseLocation" placeholder="请选择仓库地址" clearable>
          <el-option
            v-for="dict in warehouse_location"
            :key="dict.value"
            :label="dict.label"
            :value="dict.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="提货时间" prop="pickUpDate">
        <el-date-picker clearable
          v-model="queryParams.pickUpDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择提货时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="送货ZIP" prop="deliveryZip">
        <el-input
          v-model="queryParams.deliveryZip"
          placeholder="请输入送货ZIP"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收货电话" prop="consigneeNumber">
        <el-input
          v-model="queryParams.consigneeNumber"
          placeholder="请输入收货电话"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收货人名" prop="consigneeName">
        <el-input
          v-model="queryParams.consigneeName"
          placeholder="请输入收货人名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收货地址" prop="streetAddress">
        <el-input
          v-model="queryParams.streetAddress"
          placeholder="请输入收货地址"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createdAtRange">
  <el-date-picker 
    clearable
    v-model="queryParams.createdAtRange"
    type="daterange"
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    value-format="YYYY-MM-DD"
    placeholder="请选择创建时间段">
  </el-date-picker>
</el-form-item>

      <el-form-item label="价格确认" prop="priceConfirmed">
        <el-select v-model="queryParams.priceConfirmed" placeholder="请选择价格确认" clearable>
          <el-option label="Daylight" value="Daylight"></el-option>
          <el-option label="Flock Freight_Standard" value="Flock Freight_Standard"></el-option>
          <el-option label="Flock Freight_Direct" value="Flock Freight_Direct"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
      
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['shipments:shipments:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['shipments:shipments:edit']"
        >修改</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['shipments:shipments:remove']"
        >删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['shipments:shipments:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            <!-- 新增列设置按钮 -->
            <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Setting"
          @click="columnSettingsDialogVisible = true"
        >列设置</el-button>
      </el-col>
    </el-row>
<!-- 列设置对话框 -->
<el-dialog title="列设置" v-model="columnSettingsDialogVisible" width="30%">
      <el-checkbox-group v-model="visibleColumnsKeys">
        <el-checkbox label="id">报价ID</el-checkbox>
        <el-checkbox label="priceConfirmed">价格确认</el-checkbox>
        <el-checkbox label="soNumber">SO</el-checkbox>
        <el-checkbox label="warehouseLocation">仓库地址</el-checkbox>
        <el-checkbox label="pickUpDate">提货时间</el-checkbox>
        <el-checkbox label="deliveryZip">送货ZIP</el-checkbox>
        <el-checkbox label="deliveryServiceType">送货类型</el-checkbox>
        <el-checkbox label="hasPalletJackForklift">有托盘车和叉车</el-checkbox>
        <el-checkbox label="locationType">地址类型</el-checkbox>
        <el-checkbox label="shipmentServiceType">提货类型</el-checkbox>
        <el-checkbox label="consigneeNumber">收货电话</el-checkbox>
        <el-checkbox label="consigneeName">收货人名</el-checkbox>
        <el-checkbox label="streetAddress">收货地址</el-checkbox>
        <el-checkbox label="city">收货城市</el-checkbox>
        <el-checkbox label="state">收货州</el-checkbox>
        <el-checkbox label="accName">accName</el-checkbox>
        <el-checkbox label="createdAt">创建时间</el-checkbox>
        <el-checkbox label="daylightPrice">Daylight</el-checkbox>
        <el-checkbox label="flockfreightStandardPrice">FlockFreight_standard</el-checkbox>
        <el-checkbox label="flockfreightFlockDirectPrice">FlockFreight_Direct</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="columnSettingsDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    <el-table v-loading="loading" :data="shipmentsList" @selection-change="handleSelectionChange"  height="590">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column v-if="visibleColumns.id" label="报价ID" align="center" prop="id" />
      <el-table-column v-if="visibleColumns.priceConfirmed" label="价格确认" align="center" prop="priceConfirmed">
        <template #default="scope">
          <span>{{ scope.row.priceConfirmed }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="visibleColumns.soNumber" label="SO" align="center" prop="soNumber" />
      <el-table-column v-if="visibleColumns.warehouseLocation" label="仓库地址" align="center" prop="warehouseLocation">
        <!-- <template #default="scope">
          <dict-tag :options="warehouse_location" :value="scope.row.warehouseLocation"/>
        </template> -->
      </el-table-column>
      <el-table-column v-if="visibleColumns.pickUpDate" label="提货时间" align="center" prop="pickUpDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.pickUpDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="visibleColumns.deliveryZip" label="送货ZIP" align="center" prop="deliveryZip" />
      <el-table-column v-if="visibleColumns.deliveryServiceType" label="送货类型" align="center" prop="deliveryServiceType">
        <!-- <template #default="scope">
          <dict-tag :options="service_type" :value="scope.row.deliveryServiceType"/>
        </template> -->
      </el-table-column>
      <el-table-column v-if="visibleColumns.locationType" label="地址类型" align="center" prop="locationType">
        <!-- <template #default="scope">
          <dict-tag :options="location_type" :value="scope.row.locationType"/>
        </template> -->
      </el-table-column>
      <el-table-column v-if="visibleColumns.hasPalletJackForklift" label="有托盘车和叉车" align="center" prop="hasPalletJackForklift">
        <template #default="scope">
          <dict-tag :options="pallet_jack" :value="scope.row.hasPalletJackForklift"/>
          <span>{{ scope.row.hasPalletJackForklift ? '否' : '是' }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="visibleColumns.shipmentServiceType" label="提货类型" align="center" prop="shipmentServiceType">
        <!-- <template #default="scope">
          <dict-tag :options="service_type" :value="scope.row.shipmentServiceType"/>
        </template> -->
      </el-table-column>
      <el-table-column v-if="visibleColumns.consigneeNumber" label="收货电话" align="center" prop="consigneeNumber" />
      <el-table-column v-if="visibleColumns.consigneeNumber" label="收货人名" align="center" prop="consigneeName" />
      <el-table-column v-if="visibleColumns.streetAddress" label="收货地址" align="center" prop="streetAddress" />
      <el-table-column v-if="visibleColumns.city" label="收货城市" align="center" prop="city" />
      <el-table-column v-if="visibleColumns.state" label="收货州" align="center" prop="state" />
      <el-table-column v-if="visibleColumns.accName" label="accName" align="center" prop="accName">
        <template #default="scope">
          <span v-if="scope.row.accName">
            <!-- 将 accName 的值转换为对应的 label -->
            {{ convertAccNameToLabels(scope.row.accName) }}
          </span>
        </template>
      </el-table-column>

      <el-table-column v-if="visibleColumns.createdAt" label="创建时间" align="center" prop="createdAt" width="180" sortable>
        <template #default="scope">
          <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="visibleColumns.daylightPrice" label="Daylight" align="center" prop="daylightPrice" />
      <el-table-column v-if="visibleColumns.flockfreightStandardPrice" label="FlockFreight_standard" align="center" prop="flockfreightStandardPrice" />
      <el-table-column v-if="visibleColumns.flockfreightFlockDirectPrice" label="FlockFreight_Direct" align="center" prop="flockfreightFlockDirectPrice" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['shipments:shipments:edit']">修改</el-button>
          <!-- <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['shipments:shipments:remove']">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />


  <!-- 添加或修改shipments对话框 -->
  <el-dialog :title="title" v-model="open" width="500px" append-to-body>
    <el-form ref="shipmentsRef" :model="form" :rules="rules" label-width="80px">
    <el-form-item label="价格确认" prop="priceConfirmed">
      <el-select
        v-model="form.priceConfirmed"
        placeholder="请选择价格确认"
        :disabled="!!form.priceConfirmed"
      >
        <el-option label="Daylight" value="Daylight"></el-option>
        <el-option label="Flock Freight_Standard" value="Flock Freight_Standard"></el-option>
        <el-option label="Flock Freight_Direct" value="Flock Freight_Direct"></el-option>
      </el-select>
    </el-form-item>

      <!-- SO 输入框，只读 -->
      <el-form-item label="SO" prop="soNumber">
        <el-input v-model="form.soNumber" placeholder="请输入SO" />
      </el-form-item>

      <!-- 仓库地址 下拉选择，禁用 -->
      <el-form-item label="仓库地址" prop="warehouseLocation">
        <el-select v-model="form.warehouseLocation" placeholder="请选择仓库地址" disabled>
          <el-option
            v-for="dict in warehouse_location"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 提货时间 日期选择器，禁用 -->
      <el-form-item label="提货时间" prop="pickUpDate">
        <el-date-picker clearable
          v-model="form.pickUpDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择提货时间"
          disabled
        >
        </el-date-picker>
      </el-form-item>

      <!-- 送货ZIP 输入框，只读 -->
      <el-form-item label="送货ZIP" prop="deliveryZip">
        <el-input v-model="form.deliveryZip" placeholder="请输入送货ZIP" readonly/>
      </el-form-item>

      <!-- 送货类型 下拉选择，禁用 -->
      <el-form-item label="送货类型" prop="deliveryServiceType">
        <el-select v-model="form.deliveryServiceType" placeholder="请选择送货类型" disabled>
          <el-option
            v-for="dict in service_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 地址类型 下拉选择，禁用 -->
      <el-form-item label="地址类型" prop="locationType">
        <el-select v-model="form.locationType" placeholder="请选择地址类型" disabled>
          <el-option
            v-for="dict in location_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- PalletJack 下拉选择，禁用 -->
      <el-form-item label="PalletJack" prop="hasPalletJackForklift">
        <el-select v-model="form.hasPalletJackForklift" placeholder="请选择hasPalletJackForklift" disabled>
          <el-option
            v-for="dict in pallet_jack"
            :key="dict.value"
            :label="dict.label"
            :value="parseInt(dict.value)"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 提货类型 下拉选择，禁用 -->
      <el-form-item label="提货类型" prop="shipmentServiceType">
        <el-select v-model="form.shipmentServiceType" placeholder="请选择提货类型" disabled>
          <el-option
            v-for="dict in service_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          ></el-option>
        </el-select>
      </el-form-item>


        <el-form-item label="收货电话" prop="consigneeNumber">
          <el-input v-model="form.consigneeNumber" placeholder="请输入收货电话" />
        </el-form-item>
        <el-form-item label="收货人名" prop="consigneeName">
          <el-input v-model="form.consigneeName" placeholder="请输入收货人名" />
        </el-form-item>
        <el-form-item label="收货地址" prop="streetAddress">
          <el-input v-model="form.streetAddress" placeholder="请输入收货地址" />
        </el-form-item>
        <el-form-item label="收货城市" prop="city">
          <el-input v-model="form.city" placeholder="请输入收货城市" />
        </el-form-item>
        <el-form-item label="收货州" prop="state">
          <el-input v-model="form.state" placeholder="请输入收货州" />
        </el-form-item>
        <el-form-item label="accName" prop="accName">
          <el-checkbox-group v-model="form.accName" :disabled="true">
            <el-checkbox
              v-for="dict in acc_name"
              :key="dict.value"
              :label="dict.value">
              {{ dict.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>


        <el-divider content-position="center">货物信息信息</el-divider>
        <!-- <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="Plus" @click="handleAddItems">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="Delete" @click="handleDeleteItems">删除</el-button>
          </el-col>
        </el-row> -->
        <el-table :data="itemsList" :row-class-name="rowItemsIndex" @selection-change="handleItemsSelectionChange" ref="items">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="报价ID" prop="shipmentId" width="150">
            <template #default="scope">
              <!-- 使用 el-input，并设置为只读 -->
              <el-input v-model="scope.row.shipmentId" readonly></el-input>
            </template>
          </el-table-column>
          <el-table-column label="货物描述" prop="description" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.description" placeholder="请输入货物描述" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="货物件数" prop="pcs" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.pcs" placeholder="请输入货物件数" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="货物板数" prop="pallets" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.pallets" placeholder="请输入货物板数" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="货物重量" prop="weight" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.weight" placeholder="请输入货物重量" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="货物尺寸" prop="dimensions" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.dimensions" placeholder="请输入货物尺寸" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="货物class" prop="freightClass" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.freightClass" placeholder="请输入货物class" disabled/>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Shipments">
import { listShipments, getShipments, delShipments, addShipments, updateShipments } from "@/api/shipments/shipments";

const { proxy } = getCurrentInstance();
const { warehouse_location, location_type, acc_name, pallet_jack, service_type, acc_id } = proxy.useDict('warehouse_location', 'location_type', 'acc_name', 'pallet_jack', 'service_type', 'acc_id');

// 定义表格数据和控制变量
const shipmentsList = ref([]);
const itemsList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const checkedItems = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const columnSettingsDialogVisible = ref(false);
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    soNumber: null,
    warehouseLocation: null,
    pickUpDate: null,
    deliveryZip: null,
    consigneeNumber: null,
    consigneeName: null,
    streetAddress: null,
    createdAt: null,
    priceConfirmed: null,  // Add priceConfirmed to query parameters
  },
  rules: {
    soNumber: [
      { required: true, message: "SO不能为空", trigger: "blur" }
    ],
    warehouseLocation: [
      { required: true, message: "仓库地址不能为空", trigger: "change" }
    ],
    pickUpDate: [
      { required: true, message: "提货时间不能为空", trigger: "blur" }
    ],
    deliveryZip: [
      { required: true, message: "送货ZIP不能为空", trigger: "blur" }
    ],
    deliveryServiceType: [
      { required: true, message: "送货类型不能为空", trigger: "change" }
    ],
    locationType: [
      { required: true, message: "地址类型不能为空", trigger: "change" }
    ],
    hasPalletJackForklift: [
      { required: true, message: "hasPalletJackForklift不能为空", trigger: "change" }
    ],
    shipmentServiceType: [
      { required: true, message: "提货类型不能为空", trigger: "change" }
    ],
    consigneeNumber: [
      { required: true, message: "收货电话不能为空", trigger: "blur" }
    ],
    consigneeName: [
      { required: true, message: "收货人名不能为空", trigger: "blur" }
    ],
    streetAddress: [
      { required: true, message: "收货地址不能为空", trigger: "blur" }
    ],
    city: [
      { required: true, message: "收货城市不能为空", trigger: "blur" }
    ],
    state: [
      { required: true, message: "收货州不能为空", trigger: "blur" }
    ],
    accId: [
      { required: true, message: "accId不能为空", trigger: "change" }
    ],
    accName: [
      { required: true, message: "accName不能为空", trigger: "blur" }
    ],
  }
});
const visibleColumns = computed(() => {
  const columns = {};
  visibleColumnsKeys.value.forEach(key => {
    columns[key] = true;
  });
  return columns;
});
const { queryParams, form, rules } = toRefs(data);
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
/** 查询shipments列表 */
function getList() {
  loading.value = true;

  // if (queryParams.value.pickUpDate) {
  //   queryParams.value.pickUpDate = formatDate(queryParams.value.pickUpDate);
  // }
  // if (queryParams.value.createdAt) {
  //   queryParams.value.createdAt = formatDate(queryParams.value.createdAt);
  // }

  listShipments(queryParams.value).then(response => {
    shipmentsList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}
function convertAccNameToLabels(accName) {
  if (!accName) return '';

  // 如果 accName 是字符串，则先转换为数组
  const accNameArray = typeof accName === 'string' ? accName.split(',') : accName;

  // 使用 acc_name 来找到对应的 label
  return accNameArray
    .map(value => {
      const found = acc_name.value.find(item => item.value === value.trim());
      return found ? found.label : value;
    })
    .join(', ');
}
// 控制列显示的 keys 和 columns
const visibleColumnsKeys = ref([
  'id', 'priceConfirmed', 'soNumber', 'warehouseLocation', 'pickUpDate', 'deliveryZip', 
  'deliveryServiceType', 'locationType', 'shipmentServiceType', 'consigneeNumber', 'consigneeName', 
  'streetAddress', 'city', 'state', 'accName', 'createdAt', 'daylightPrice', 
  'flockfreightStandardPrice', 'flockfreightFlockDirectPrice', 'hasPalletJackForklift'  // 添加这一行
]);


// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    soNumber: null,
    warehouseLocation: null,
    pickUpDate: null,
    deliveryZip: null,
    deliveryServiceType: null,
    locationType: null,
    hasPalletJackForklift: null,
    shipmentServiceType: null,
    consigneeNumber: null,
    consigneeName: null,
    streetAddress: null,
    city: null,
    state: null,
    accId: null,
    accName: [],
    createdAt: null,
    updatedAt: null,
    isDeleted: null,
    deletedAt: null,
    version: null,
    daylightPrice: null,
    flockfreightStandardPrice: null,
    flockfreightFlockDirectPrice: null
  };
  itemsList.value = [];
  proxy.resetForm("shipmentsRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  if (queryParams.value.createdAtRange && queryParams.value.createdAtRange.length === 2) {
    const startOfDay = `${queryParams.value.createdAtRange[0]} 00:00:00`;
    const endOfDay = `${queryParams.value.createdAtRange[1]} 23:59:59`;
    queryParams.value.createdAtStart = startOfDay;
    queryParams.value.createdAtEnd = endOfDay;
  }
  queryParams.value.pageNum = 1;
  getList();
}


/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加shipments";
}

  
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value;

  // 从后端获取数据
  getShipments(_id).then(response => {
    form.value = response.data;

    // 将 accName 从字符串转换为数组
    if (form.value.accName) {
      form.value.accName = form.value.accName.split(',').map(value => value.trim());
    } else {
      form.value.accName = [];
    }

    itemsList.value = response.data.itemsList;
    open.value = true;
    title.value = "修改shipments";
  });
}






function submitForm() {
  proxy.$refs["shipmentsRef"].validate(valid => {
    if (valid) {
      // 提交时将 accName 转换为字符串
      if (Array.isArray(form.value.accName)) {
        form.value.accName = form.value.accName.join(",");
      }

      form.value.itemsList = itemsList.value;
      if (form.value.id != null) {
        updateShipments(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addShipments(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}



/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除shipments编号为"' + _ids + '"的数据项？').then(function() {
    return delShipments(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 货物信息序号 */
function rowItemsIndex({ row, rowIndex }) {
  row.index = rowIndex + 1;
}

/** 货物信息添加按钮操作 */
function handleAddItems() {
  let obj = {};
  obj.shipmentId = "";
  obj.description = "";
  obj.pcs = "";
  obj.pallets = "";
  obj.weight = "";
  obj.dimensions = "";
  obj.freightClass = "";
  itemsList.value.push(obj);
}

/** 货物信息删除按钮操作 */
function handleDeleteItems() {
  if (checkedItems.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的货物信息数据");
  } else {
    const itemss = itemsList.value;
    const checkedItemss = checkedItems.value;
    itemsList.value = itemss.filter(function(item) {
      return checkedItemss.indexOf(item.index) == -1
    });
  }
}

/** 复选框选中数据 */
function handleItemsSelectionChange(selection) {
  checkedItems.value = selection.map(item => item.index)
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('shipments/shipments/export', {
    ...queryParams.value
  }, `shipments_${new Date().getTime()}.xlsx`)
}

getList();
</script>
