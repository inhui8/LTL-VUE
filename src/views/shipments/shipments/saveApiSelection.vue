<template>
  <div>
    <!-- LTL报价配置标题 -->
    <h2 style="text-align: center; margin-bottom: 20px;">LTL 报价配置</h2>

    <el-form @submit.native.prevent="submitForm">
      <!-- API选择复选框 -->
      <el-checkbox-group v-model="selectedApis" style="margin-bottom: 20px;">
        <el-checkbox label="daylight">Daylight API</el-checkbox>
        <el-checkbox label="auptix">Auptix API</el-checkbox>
        <el-checkbox label="customPrice">custom API</el-checkbox>
        <el-checkbox label="XPO">XPO API</el-checkbox>
        <el-checkbox label="MotherShip">MotherShip API</el-checkbox>
      </el-checkbox-group>

      <!-- 非联宇利润 和 联宇利润 在同一行 -->
      <el-row :gutter="20" style="margin-bottom: 20px;">
        <el-col :span="12">
          <el-form-item label="非联宇利润">
            <el-input v-model="nonLienyuProfit" placeholder="请输入非联宇利润">
              <template #append>%</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联宇利润">
            <el-input v-model="lienyuProfit" placeholder="请输入联宇利润">
              <template #append>%</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 提交按钮 -->
      <el-button type="primary" @click="submitForm">保存配置</el-button>
    </el-form>

    <div v-if="response" style="margin-top: 20px;">
      <h3>配置保存结果</h3>
      <pre>{{ response }}</pre>
    </div>
  </div>
</template>

<script>
import { saveApiSelection, getApiSelection } from '@/api/shipments/shipments';

export default {
  data() {
    return {
      selectedApis: [],  // 应该是一个数组
      nonLienyuProfit: '',
      lienyuProfit: '',
      response: null
    };
  },
  async mounted() {
    try {
      const res = await getApiSelection(1);  // 假设你要获取 ID 为 1 的配置
      const config = res.data;  // 假设返回的数据在 data 属性中
      console.log(res.data);
      // 检查 selectedApis 并将其转换为数组
      this.selectedApis = config.selectedApis ? config.selectedApis.split(',') : [];
      this.nonLienyuProfit = config.nonLienyuProfit || '';
      this.lienyuProfit = config.lienyuProfit || '';
    } catch (error) {
      console.error('获取API配置失败', error);
    }
  },
  methods: {
    async submitForm() {
      try {
        const payload = {
          selectedApis: this.selectedApis.join(','),  // 将数组转换为字符串发送到后端
          nonLienyuProfit: this.nonLienyuProfit,
          lienyuProfit: this.lienyuProfit,
          id: 1  // 假设你要更新ID为1的配置
        };
        const res = await saveApiSelection(payload);
        this.response = '配置保存成功';
      } catch (error) {
        this.response = '配置保存失败';
        console.error('API 调用失败', error);
      }
    }
  }
};


</script>

<style scoped>
/* 美化页面 */
.el-checkbox-group {
  display: flex;
  gap: 20px;
}

.el-form-item {
  margin-bottom: 0;
}

.el-button {
  margin-top: 20px;
  width: 100%;
}

h2 {
  font-size: 24px;
  font-weight: bold;
}

h3 {
  font-size: 18px;
  font-weight: normal;
}
</style>
