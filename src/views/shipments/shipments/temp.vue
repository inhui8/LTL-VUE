<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" @submit.native.prevent="handleQuery">
      <el-form-item label="仓库编号">
        <el-input v-model="queryParams.warehouseCode" placeholder="请输入仓库编号" clearable />
      </el-form-item>
      <el-button type="primary" @click="handleQuery">查询</el-button>
      <el-button type="success" @click="handleAdd">新增</el-button>
    </el-form>

    <el-table :data="warehouseList" border>
      <el-table-column label="仓库编号" prop="warehouseCode" />
      <el-table-column label="仓库名称" prop="warehouseName" />
      <el-table-column label="客户编号" prop="customerNumber" />
      <el-table-column label="客户名称" prop="customerName" />
      <el-table-column label="地址" prop="streetAddress" />
      <el-table-column label="城市" prop="city" />
      <el-table-column label="州" prop="state" />
      <el-table-column label="邮编" prop="zip" />
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button size="samll" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="仓库信息">
      <el-form :model="warehouseForm">
        <el-form-item label="仓库编号">
          <el-input v-model="warehouseForm.warehouseCode" />
        </el-form-item>
        <el-form-item label="仓库名称"> <!-- 新增字段 -->
          <el-input v-model="warehouseForm.warehouseName" />
        </el-form-item>
        <el-form-item label="客户编号">
          <el-input v-model="warehouseForm.customerNumber" />
        </el-form-item>
        <el-form-item label="客户名称">
          <el-input v-model="warehouseForm.customerName" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="warehouseForm.streetAddress" />
        </el-form-item>
        <el-form-item label="城市">
          <el-input v-model="warehouseForm.city" />
        </el-form-item>
        <el-form-item label="州">
          <el-input v-model="warehouseForm.state" />
        </el-form-item>
        <el-form-item label="邮编">
          <el-input v-model="warehouseForm.zip" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listWarehouses, addWarehouse, updateWarehouse, deleteWarehouse } from '@/api/shipments/shipments'

export default {
data() {
  return {
    warehouseList: [],
    queryParams: {},
    dialogVisible: false,
    warehouseForm: {}
  };
},
methods: {
  handleQuery() {
    listWarehouses(this.queryParams).then(response => {
      console.log("API Response:", response);
      this.warehouseList = response.rows || response;
    }).catch(error => {
      console.error("查询失败", error);
    });
  },
  handleAdd() {
    this.dialogVisible = true;
    this.warehouseForm = {};
  },
  handleEdit(row) {
    this.dialogVisible = true;
    this.warehouseForm = { ...row };
  },
  handleSave() {
    console.log("Saving Data:", this.warehouseForm);
    const saveAction = this.warehouseForm.id ? updateWarehouse : addWarehouse;
    saveAction(this.warehouseForm).then(() => {
      this.dialogVisible = false;
      this.handleQuery();
    }).catch(error => {
      console.error("保存失败", error);
    });
  },
  handleDelete(id) {
    console.log("Deleting ID:", id);
    deleteWarehouse(id).then(() => {
      this.handleQuery();
    }).catch(error => {
      console.error("删除失败", error);
    });
  }
},
mounted() {
  this.handleQuery();
}
};
</script>