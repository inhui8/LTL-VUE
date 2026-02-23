<template>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="用户账号" prop="userName">
          <el-input
            v-model="queryParams.userName"
            placeholder="请输入用户账号"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickName">
          <el-input
            v-model="queryParams.nickName"
            placeholder="请输入用户昵称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input
            v-model="queryParams.email"
            placeholder="请输入用户邮箱"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="手机号码" prop="phonenumber">
          <el-input
            v-model="queryParams.phonenumber"
            placeholder="请输入手机号码"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="利润值" prop="profit">
          <el-input
            v-model="queryParams.profit"
            placeholder="请输入利润值"
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
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['UserProfit:UserProfit:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['UserProfit:UserProfit:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
  
      <el-table v-loading="loading" :data="UserProfitList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="用户ID" align="center" prop="userId" />
        <el-table-column label="用户账号" align="center" prop="userName" />
        <el-table-column label="用户昵称" align="center" prop="nickName" />
        <el-table-column label="用户类型" align="center" prop="userType" />
        <el-table-column label="用户邮箱" align="center" prop="email" />
        <el-table-column label="手机号码" align="center" prop="phonenumber" />
        <el-table-column label="创建者" align="center" prop="createBy" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="利润值" align="center" prop="profit">
          <template #default="scope">
            <span>{{ scope.row.profit }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
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
  
      <!-- 添加或修改用户信息对话框 -->
      <el-dialog :title="title" v-model="open" width="500px" append-to-body>
        <el-form ref="UserProfitRef" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入用户邮箱" />
          </el-form-item>
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input v-model="form.phonenumber" placeholder="请输入手机号码" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="利润值" prop="profit">
            <el-input v-model="form.profit" placeholder="请输入利润值" />
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
  
  <script setup name="UserProfit">
  import { listUserProfit, getUserProfit, delUserProfit, addUserProfit, updateUserProfit } from "@/api/system/profit";
  
  const { proxy } = getCurrentInstance();
  
  const UserProfitList = ref([]);
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
      userName: null,
      nickName: null,
      userType: null,
      email: null,
      phonenumber: null,
      sex: null,
      status: null,
      loginDate: null,
      profit: null
    },
    rules: {
      userName: [
        { required: true, message: "用户账号不能为空", trigger: "blur" }
      ],
      nickName: [
        { required: true, message: "用户昵称不能为空", trigger: "blur" }
      ],
    }
  });
  
  const { queryParams, form, rules } = toRefs(data);
  
  /** 查询用户信息列表 */
  function getList() {
    loading.value = true;
    listUserProfit(queryParams.value).then(response => {
      UserProfitList.value = response.rows;
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
      userId: null,
      deptId: null,
      userName: null,
      nickName: null,
      userType: null,
      email: null,
      phonenumber: null,
      sex: null,
      avatar: null,
      password: null,
      status: null,
      delFlag: null,
      loginIp: null,
      loginDate: null,
      createBy: null,
      createTime: null,
      updateBy: null,
      updateTime: null,
      remark: null,
      profit: null
    };
    proxy.resetForm("UserProfitRef");
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
    ids.value = selection.map(item => item.userId);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
  }
  
  /** 新增按钮操作 */
  function handleAdd() {
    reset();
    open.value = true;
    title.value = "添加用户信息";
  }
  
  /** 修改按钮操作 */
  function handleUpdate(row) {
    reset();
    const _userId = row.userId || ids.value
    getUserProfit(_userId).then(response => {
      form.value = response.data;
      open.value = true;
      title.value = "修改用户信息";
    });
  }
  
  /** 提交按钮 */
  function submitForm() {
    proxy.$refs["UserProfitRef"].validate(valid => {
      if (valid) {
        if (form.value.userId != null) {
          updateUserProfit(form.value).then(response => {
            proxy.$modal.msgSuccess("修改成功");
            open.value = false;
            getList();
          });
        } else {
          addUserProfit(form.value).then(response => {
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
    const _userIds = row.userId || ids.value;
    proxy.$modal.confirm('是否确认删除用户信息编号为"' + _userIds + '"的数据项？').then(function() {
      return delUserProfit(_userIds);
    }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  }
  
  /** 导出按钮操作 */
  function handleExport() {
    proxy.download('UserProfit/UserProfit/export', {
      ...queryParams.value
    }, `UserProfit_${new Date().getTime()}.xlsx`)
  }
  
  getList();
  </script>
  