<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="PC号" prop="pcNumber">
        <el-input
          v-model="queryParams.pcNumber"
          placeholder="请输入PC号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="供应商" prop="supplierName">
        <el-input
          v-model="queryParams.supplierName"
          placeholder="请输入供应商"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="预约日期" style="width: 308px">
        <el-date-picker
          v-model="queryParams.appointmentDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择预约日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="预约时间" prop="appointmentTime">
  <el-time-picker
    v-model="queryParams.appointmentTime"
    placeholder="请选择时间"
    format="HH:mm"
    value-format="HH:mm"
    clearable>
  </el-time-picker>
</el-form-item>

      <el-form-item label="司机电话" prop="driverPhone">
        <el-input
          v-model="queryParams.driverPhone"
          placeholder="请输入司机电话"
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
      <el-form-item label="刷新时间" prop="updatedAt">
        <el-date-picker clearable
          v-model="queryParams.updatedAt"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择刷新时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="装柜类型" prop="loadType">
        <el-select v-model="queryParams.loadType" placeholder="请选择装柜类型" clearable>
          <el-option label="Liveload" value="liveload"></el-option>
          <el-option label="Drop" value="drop"></el-option>
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
        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['appointment:loadAppt:edit']"
        >修改</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['appointment:loadAppt:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="loadApptList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="PC号" align="center" prop="pcNumber" />
      <el-table-column label="供应商" align="center" prop="supplierName" />
      <el-table-column label="预约日期" align="center" prop="appointmentDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.appointmentDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预约时间" align="center" prop="appointmentTime" width="180">
        <template #default="scope">
          <span>{{ scope.row.appointmentTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="司机电话" align="center" prop="driverPhone" />
      <el-table-column label="货物类型" align="center" prop="cargoType" />
      <el-table-column label="装柜类型" align="center" prop="loadType">
        <template #default="scope">
          <span>{{ scope.row.loadType }}</span>
        </template>
      </el-table-column>


      <el-table-column label="创建时间" align="center" prop="createdAt" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updatedAt" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updatedAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <!-- <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['appointment:loadAppt:edit']">修改</el-button> -->
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改apptAllInfos对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="loadApptRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="PC号" prop="pcNumber">
          <el-input v-model="form.pcNumber" placeholder="请输入PC号" />
        </el-form-item>
        <el-form-item label="供应商" prop="supplierName">
          <el-input v-model="form.supplierName" placeholder="请输入供应商" />
        </el-form-item>
        <el-form-item label="预约日期" prop="appointmentDate">
          <el-date-picker clearable
            v-model="form.appointmentDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择预约日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预约时间" prop="appointmentTime">
          <el-date-picker clearable
            v-model="form.appointmentTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择预约时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="司机电话" prop="driverPhone">
          <el-input v-model="form.driverPhone" placeholder="请输入司机电话" />
        </el-form-item>
        <el-form-item label="装柜类型" prop="loadType">
          <el-select v-model="form.loadType" placeholder="请选择装柜类型" clearable>
            <el-option label="Liveload" value="liveload"></el-option>
            <el-option label="Drop" value="drop"></el-option>
          </el-select>
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

<script setup name="LoadAppt">
import { ref, reactive, toRefs, getCurrentInstance } from 'vue';
import { listLoadAppt, getLoadAppt, delLoadAppt, addLoadAppt, updateLoadAppt } from "@/api/appointment/loadAppt";
const { proxy } = getCurrentInstance();

const loadApptList = ref([]);
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
    pcNumber: null,
    supplierName: null,
    appointmentDate: null, // 单一日期选择器绑定的字段
    appointmentTime: null,
    driverPhone: null,
    cargoType: null,
    loadType: null,
    createdAt: null,
    updatedAt: null
  },
  rules: {
    pcNumber: [{ required: true, message: "PC号不能为空", trigger: "blur" }],
    supplierName: [{ required: true, message: "供应商不能为空", trigger: "blur" }],
    appointmentDate: [{ required: true, message: "预约日期不能为空", trigger: "blur" }],
    appointmentTime: [{ required: true, message: "预约时间不能为空", trigger: "blur" }],
    driverPhone: [{ required: true, message: "司机电话不能为空", trigger: "blur" }],
    cargoType: [{ required: true, message: "货物类型不能为空", trigger: "change" }],
    loadType: [{ required: true, message: "装柜类型不能为空", trigger: "change" }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询列表 */
function getList() {
  loading.value = true;
  queryParams.value.params = {};
  listLoadAppt(queryParams.value).then(response => {
    console.log(response.rows);
    loadApptList.value = response.rows;
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
    pcNumber: null,
    supplierName: null,
    appointmentDate: null,
    appointmentTime: null,
    driverPhone: null,
    cargoType: null,
    createdAt: null,
    updatedAt: null
  };
  proxy.resetForm("loadApptRef");
}

/** 搜索操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置搜索条件 */
function resetQuery() {
  queryParams.value.appointmentDate = null;
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length !== 1;
  multiple.value = !selection.length;
}

/** 新增操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加预约信息";
}
function formatTimeForBackend(time) {
  if (!time) return null;
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}:00`; // 添加秒部分
}

/** 修改操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value;
  getLoadAppt(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改预约信息";
  });
}

/** 提交表单 */
function submitForm() {
  proxy.$refs["loadApptRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateLoadAppt(form.value).then(() => {
          open.value = false;
          getList();
        });
      } else {
        addLoadAppt(form.value).then(() => {
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除预约信息编号为 "' + _ids + '" 的数据项？').then(function() {
    return delLoadAppt(_ids);
  }).then(() => {
    getList();
  }).catch(() => {});
}

/** 导出操作 */
function handleExport() {
  console.log('开始导出请求...');
  console.log('导出请求路径:', 'appointment/loadAppt/export');
  console.log('导出请求参数 (queryParams):', JSON.parse(JSON.stringify(queryParams.value)));

  proxy.download('appointment/loadAppt/export', {
    ...JSON.parse(JSON.stringify(queryParams.value)) // 使用深拷贝
  }, `loadAppt_${new Date().getTime()}.xlsx`);

  console.log('导出请求已发送...');
}





getList();
</script>

<style scoped>
.app-container {
  padding: 20px;
}
</style>
