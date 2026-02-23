<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="仓库地址" prop="warehouseLocation">
        <el-input
          v-model="queryParams.warehouseLocation"
          placeholder="请输入仓库地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="送货ZIP" prop="deliveryZip">
        <el-input
          v-model="queryParams.deliveryZip"
          placeholder="请输入送货ZIP"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="accName">
        <el-input
          v-model="queryParams.accName"
          placeholder="请输入客户名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['shipments:data:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-refresh"
          size="mini"
          @click="handleUpdateCache"
          v-hasPermi="['shipments:data:cache']"
        >更新缓存</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          @click="handleCleanLegacyCache"
          v-hasPermi="['shipments:data:cache']"
        >清理遗留缓存</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="dataList">
      <el-table-column label="仓库地址" align="center" prop="warehouseLocation" />
      <el-table-column label="送货ZIP" align="center" prop="deliveryZip" />
      <el-table-column label="板数" align="center" prop="palletCount" />
      <el-table-column label="客户名称" align="center" prop="accName" />
      <el-table-column label="总板数" align="center" prop="totalPallets" />
      <el-table-column label="总重量" align="center" prop="totalWeight" />
      <el-table-column label="平均单板重量" align="center" prop="avgWeightPerPallet" />
      <el-table-column label="记录数量" align="center" prop="recordCount" />
      <el-table-column label="Daylight价格平均值" align="center" prop="avgDaylightPrice">
        <template v-slot="scope">
          ${{ formatPrice(scope.row.avgDaylightPrice) }}
        </template>
      </el-table-column>
      <el-table-column label="FlockFreight Standard价格平均值" align="center" prop="avgFlockfreightStandardPrice">
        <template v-slot="scope">
          ${{ formatPrice(scope.row.avgFlockfreightStandardPrice) }}
        </template>
      </el-table-column>
      <el-table-column label="FlockFreight Direct价格平均值" align="center" prop="avgFlockfreightFlockDirectPrice">
        <template v-slot="scope">
          ${{ formatPrice(scope.row.avgFlockfreightFlockDirectPrice) }}
        </template>
      </el-table-column>
      <el-table-column label="Custom价格平均值" align="center" prop="avgCustomPrice">
        <template v-slot="scope">
          ${{ formatPrice(scope.row.avgCustomPrice) }}
        </template>
      </el-table-column>
      <el-table-column label="XPO价格平均值" align="center" prop="avgXpoPrice">
        <template v-slot="scope">
          ${{ formatPrice(scope.row.avgXpoPrice) }}
        </template>
      </el-table-column>
      <el-table-column label="Mothership价格平均值" align="center" prop="avgMothershipPrice">
        <template v-slot="scope">
          ${{ formatPrice(scope.row.avgMothershipPrice) }}
        </template>
      </el-table-column>
      <el-table-column label="单板平均价格-Daylight" align="center" prop="avgDaylightPricePerPallet">
        <template v-slot="scope">
          ${{ formatPrice(scope.row.avgDaylightPricePerPallet) }}
        </template>
      </el-table-column>
      <el-table-column label="单板平均价格-FlockFreight Standard" align="center" prop="avgFlockfreightStandardPricePerPallet">
        <template v-slot="scope">
          ${{ formatPrice(scope.row.avgFlockfreightStandardPricePerPallet) }}
        </template>
      </el-table-column>
      <el-table-column label="单板平均价格-FlockFreight Direct" align="center" prop="avgFlockfreightDirectPricePerPallet">
        <template v-slot="scope">
          ${{ formatPrice(scope.row.avgFlockfreightDirectPricePerPallet) }}
        </template>
      </el-table-column>
      <el-table-column label="单板平均价格-Custom" align="center" prop="avgCustomPricePerPallet">
        <template v-slot="scope">
          ${{ formatPrice(scope.row.avgCustomPricePerPallet) }}
        </template>
      </el-table-column>
      <el-table-column label="单板平均价格-XPO" align="center" prop="avgXpoPricePerPallet">
        <template v-slot="scope">
          ${{ formatPrice(scope.row.avgXpoPricePerPallet) }}
        </template>
      </el-table-column>
      <el-table-column label="单板平均价格-Mothership" align="center" prop="avgMothershipPricePerPallet">
        <template v-slot="scope">
          ${{ formatPrice(scope.row.avgMothershipPricePerPallet) }}
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="handlePaginationChange"
    />
  </div>
</template>

<script>
import { 
  listShipmentData, 
  updateCache, 
  cleanLegacyCache 
} from "@/api/shipmentsData/data";

export default {
  name: "ShipmentData",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 数据统计表格数据
      dataList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        warehouseLocation: null,
        deliveryZip: null,
        accName: null
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询数据统计列表 */
    getList() {
      this.loading = true;
      listShipmentData(this.queryParams).then(response => {
        this.dataList = response.rows;
        this.total = response.total;
        this.loading = false;
      }).catch((error) => {
        console.error('请求失败:', error);
        this.loading = false;
      });
    },
    /** 分页处理 */
    handlePaginationChange(val) {
      // 处理不同的参数格式
      if (typeof val === 'object' && val !== null) {
        // 如果是对象，可能包含page和limit
        if (val.page !== undefined) {
          this.queryParams.pageNum = val.page;
        }
        if (val.limit !== undefined) {
          this.queryParams.pageSize = val.limit;
        }
      } else if (typeof val === 'number') {
        // 如果直接是数字，可能是页码
        this.queryParams.pageNum = val;
      }
      this.getList();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('shipments/data/export', {
        ...this.queryParams
      }, `shipment_data_${new Date().getTime()}.xlsx`)
    },
    /** 格式化价格显示 */
    formatPrice(value) {
      if (value === null || value === undefined) {
        return '0.00';
      }
      return value.toFixed(2);
    },
    /** 更新缓存 */
    handleUpdateCache() {
      this.$modal.confirm('确认要更新数据统计缓存吗？').then(() => {
        updateCache().then(response => {
          this.$modal.msgSuccess(response.msg);
          this.getList(); // 刷新数据
        }).catch(() => {
          this.$modal.msgError('缓存更新失败');
        });
      });
    },

    /** 清理遗留缓存 */
    handleCleanLegacyCache() {
      this.$modal.confirm('确认要清理遗留的缓存数据吗？这将清除所有旧的缓存key。').then(() => {
        cleanLegacyCache().then(response => {
          this.$modal.msgSuccess(response.msg);
        }).catch(() => {
          this.$modal.msgError('清理遗留缓存失败');
        });
      });
    }
  }
};
</script> 