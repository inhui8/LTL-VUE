<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="仓库代码" prop="warehouseCode">
        <el-input
          v-model="queryParams.warehouseCode"
          placeholder="请输入仓库代码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="仓库号码" prop="customerNumber">
        <el-input
          v-model="queryParams.customerNumber"
          placeholder="请输入仓库号码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入客户名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="街道" prop="streetAddress">
        <el-input
          v-model="queryParams.streetAddress"
          placeholder="请输入街道"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="城市" prop="city">
        <el-input
          v-model="queryParams.city"
          placeholder="请输入城市"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="州" prop="state">
        <el-input
          v-model="queryParams.state"
          placeholder="请输入州"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="zip邮编" prop="zip">
        <el-input
          v-model="queryParams.zip"
          placeholder="请输入zip邮编"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="仓库名称" prop="warehouseName">
        <el-input
          v-model="queryParams.warehouseName"
          placeholder="请输入仓库名称"
          clearable
          @keyup.enter="handleQuery"
        />
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
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="仓库代码" align="center" prop="warehouseCode" />
      <el-table-column label="仓库名称" align="center" prop="warehouseName" />
      <el-table-column label="仓库号码" align="center" prop="customerNumber" />
      <el-table-column label="客户名称" align="center" prop="customerName" />
      <el-table-column label="街道" align="center" prop="streetAddress" />
      <el-table-column label="城市" align="center" prop="city" />
      <el-table-column label="州" align="center" prop="state" />
      <el-table-column label="zip邮编" align="center" prop="zip" />
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

    <!-- 添加或修改warehouseInfo对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="shipmentsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="仓库代码" prop="warehouseCode">
          <el-input v-model="form.warehouseCode" placeholder="请输入仓库代码" />
        </el-form-item>
        <el-form-item label="仓库号码" prop="customerNumber">
          <el-input v-model="form.customerNumber" placeholder="请输入仓库号码" />
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="街道" prop="streetAddress">
          <el-input v-model="form.streetAddress" placeholder="请输入街道" />
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input v-model="form.city" placeholder="请输入城市" />
        </el-form-item>
        <el-form-item label="州" prop="state">
          <el-input v-model="form.state" placeholder="请输入州" />
        </el-form-item>
        <el-form-item label="zip邮编" prop="zip">
          <el-input v-model="form.zip" placeholder="请输入zip邮编" />
        </el-form-item>
        <el-form-item label="仓库名称" prop="warehouseName">
          <el-input v-model="form.warehouseName" placeholder="请输入仓库名称" />
        </el-form-item>
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
import { listShipment, getShipment, delShipment, addShipment, updateShipment } from "@/api/shipments/shipments";

const { proxy } = getCurrentInstance();

const shipmentsList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    warehouseCode: null,
    customerNumber: null,
    customerName: null,
    streetAddress: null,
    city: null,
    state: null,
    zip: null,
    warehouseName: null
  },
  rules: {
    warehouseCode: [
      { required: true, message: "仓库代码不能为空", trigger: "blur" }
    ],
    customerNumber: [
      { required: true, message: "仓库号码不能为空", trigger: "blur" }
    ],
    customerName: [
      { required: true, message: "客户名称不能为空", trigger: "blur" }
    ],
    streetAddress: [
      { required: true, message: "街道不能为空", trigger: "blur" }
    ],
    city: [
      { required: true, message: "城市不能为空", trigger: "blur" }
    ],
    state: [
      { required: true, message: "州不能为空", trigger: "blur" }
    ],
    zip: [
      { required: true, message: "zip邮编不能为空", trigger: "blur" }
    ],
    warehouseName: [
      { required: true, message: "仓库名称不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询warehouseInfo列表 */
function getList() {
  loading.value = true;
  listShipment(queryParams.value).then(response => {
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
    warehouseCode: null,
    customerNumber: null,
    customerName: null,
    streetAddress: null,
    city: null,
    state: null,
    zip: null,
    warehouseName: null
  };
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
  title.value = "添加warehouseInfo";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getShipment(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改warehouseInfo";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["shipmentsRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateShipment(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addShipment(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除warehouseInfo编号为"' + _ids + '"的数据项？').then(function() {
    return delShipment(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('shipments/shipments/export', {
    ...queryParams.value
  }, `shipments_${new Date().getTime()}.xlsx`)
}

getList();
</script>
