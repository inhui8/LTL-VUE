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
            :value="dict.value"
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
      <el-form-item label="创建时间" prop="createdAt">
        <el-date-picker clearable
          v-model="queryParams.createdAt"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择创建时间">
        </el-date-picker>
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
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['shipments:shipments:remove']"
        >删除</el-button>
      </el-col>
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
    </el-row>

    <el-table v-loading="loading" :data="shipmentsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="报价ID" align="center" prop="id" />
      <el-table-column label="SO" align="center" prop="soNumber" />
      <el-table-column label="仓库地址" align="center" prop="warehouseLocation">
        <!-- <template #default="scope">
          <dict-tag :options="warehouse_location" :value="scope.row.warehouseLocation"/>
        </template> -->
      </el-table-column>
      <el-table-column label="提货时间" align="center" prop="pickUpDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.pickUpDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="送货ZIP" align="center" prop="deliveryZip" />
      <el-table-column label="送货类型" align="center" prop="deliveryServiceType">
        <!-- <template #default="scope">
          <dict-tag :options="service_type" :value="scope.row.deliveryServiceType"/>
        </template> -->
      </el-table-column>
      <el-table-column label="地址类型" align="center" prop="locationType">
        <!-- <template #default="scope">
          <dict-tag :options="location_type" :value="scope.row.locationType"/>
        </template> -->
      </el-table-column>
      <el-table-column label="hasPalletJackForklift" align="center" prop="hasPalletJackForklift">
        <template #default="scope">
          <dict-tag :options="pallet_jack" :value="scope.row.hasPalletJackForklift"/>
          <span>{{ scope.row.hasPalletJackForklift ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提货类型" align="center" prop="shipmentServiceType">
        <!-- <template #default="scope">
          <dict-tag :options="service_type" :value="scope.row.shipmentServiceType"/>
        </template> -->
      </el-table-column>
      <el-table-column label="收货电话" align="center" prop="consigneeNumber" />
      <el-table-column label="收货人名" align="center" prop="consigneeName" />
      <el-table-column label="收货地址" align="center" prop="streetAddress" />
      <el-table-column label="收货城市" align="center" prop="city" />
      <el-table-column label="收货州" align="center" prop="state" />
      <el-table-column label="accName" align="center" prop="accName">
        <!-- <template #default="scope">
          <dict-tag :options="acc_name" :value="scope.row.accName ? scope.row.accName.split(',') : []"/>
        </template> -->
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createdAt" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商价格1" align="center" prop="daylightPrice" />
      <el-table-column label="供应商价格2" align="center" prop="flockfreightStandardPrice" />
      <el-table-column label="	 供应商价格2" align="center" prop="flockfreightFlockDirectPrice" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['shipments:shipments:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['shipments:shipments:remove']">删除</el-button>
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
        <el-form-item label="SO" prop="soNumber">
          <el-input v-model="form.soNumber" placeholder="请输入SO" />
        </el-form-item>
        <el-form-item label="仓库地址" prop="warehouseLocation">
          <el-select v-model="form.warehouseLocation" placeholder="请选择仓库地址">
            <el-option
              v-for="dict in warehouse_location"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提货时间" prop="pickUpDate">
          <el-date-picker clearable
            v-model="form.pickUpDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择提货时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="送货ZIP" prop="deliveryZip">
          <el-input v-model="form.deliveryZip" placeholder="请输入送货ZIP" />
        </el-form-item>
        <el-form-item label="送货类型" prop="deliveryServiceType">
          <el-select v-model="form.deliveryServiceType" placeholder="请选择送货类型">
            <el-option
              v-for="dict in service_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址类型" prop="locationType">
          <el-select v-model="form.locationType" placeholder="请选择地址类型">
            <el-option
              v-for="dict in location_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="hasPalletJackForklift" prop="hasPalletJackForklift">
          <el-select v-model="form.hasPalletJackForklift" placeholder="请选择hasPalletJackForklift">
            <el-option
              v-for="dict in pallet_jack"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提货类型" prop="shipmentServiceType">
          <el-select v-model="form.shipmentServiceType" placeholder="请选择提货类型">
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
          <el-checkbox-group v-model="form.accName">
            <el-checkbox
              v-for="dict in acc_name"
              :key="dict.value"
              :label="dict.value">
              {{dict.label}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-divider content-position="center">货物信息信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="Plus" @click="handleAddItems">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="Delete" @click="handleDeleteItems">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="itemsList" :row-class-name="rowItemsIndex" @selection-change="handleItemsSelectionChange" ref="items">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="报价ID" prop="shipmentId" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.shipmentId" placeholder="请输入报价ID" />
            </template>
          </el-table-column>
          <el-table-column label="货物描述" prop="description" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.description" placeholder="请输入货物描述" />
            </template>
          </el-table-column>
          <el-table-column label="货物件数" prop="pcs" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.pcs" placeholder="请输入货物件数" />
            </template>
          </el-table-column>
          <el-table-column label="货物板数" prop="pallets" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.pallets" placeholder="请输入货物板数" />
            </template>
          </el-table-column>
          <el-table-column label="货物重量" prop="weight" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.weight" placeholder="请输入货物重量" />
            </template>
          </el-table-column>
          <el-table-column label="货物尺寸" prop="dimensions" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.dimensions" placeholder="请输入货物尺寸" />
            </template>
          </el-table-column>
          <el-table-column label="货物class" prop="freightClass" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.freightClass" placeholder="请输入货物class" />
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

const { queryParams, form, rules } = toRefs(data);

/** 查询shipments列表 */
function getList() {
  loading.value = true;
  listShipments(queryParams.value).then(response => {
    console.log("后端返回的数据: ", response);
    shipmentsList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

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

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getShipments(_id).then(response => {
    form.value = response.data;
    form.value.accName = form.value.accName.split(",");
    itemsList.value = response.data.itemsList;
    open.value = true;
    title.value = "修改shipments";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["shipmentsRef"].validate(valid => {
    if (valid) {
      form.value.accName = form.value.accName.join(",");
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
