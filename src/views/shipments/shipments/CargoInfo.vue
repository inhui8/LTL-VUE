<template>
  <div>
        <!-- 添加货物信息按钮 -->
    <div class="add-button-container">
      <el-button type="primary" @click="addCargo">添加货物信息</el-button>
    </div>
    <!-- 显示货物信息 -->
    <el-row :gutter="20" v-for="(item, index) in cargoItems" :key="index" class="cargo-row">
      <el-col :span="4">
        <el-form-item :label="'Length (inch) ' + (index + 1)" :rules="[{ required: true, message: '请输入Length', trigger: 'blur' }]">
          <el-input v-model="item.length" placeholder="请输入Length" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item :label="'Width (inch) ' + (index + 1)" :rules="[{ required: true, message: '请输入Width', trigger: 'blur' }]">
          <el-input v-model="item.width" placeholder="请输入Width" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item :label="'Height (inch) ' + (index + 1)" :rules="[{ required: true, message: '请输入Height', trigger: 'blur' }]">
          <el-input v-model="item.height" placeholder="请输入Height" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item :label="'Weight (Lbs) ' + (index + 1)" :rules="[{ required: true, message: '请输入Weight', trigger: 'blur' }]">
          <el-input v-model="item.weight" placeholder="请输入Weight" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item :label="'Pallet Number ' + (index + 1)" :rules="[{ required: true, message: '请输入Pallet Number', trigger: 'blur' }]">
          <el-input v-model="item.pallets" placeholder="请输入Pallet Number" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-button type="danger" @click="removeCargo(index)" class="remove-button" v-if="cargoItems.length > 1">删除货物信息</el-button>
      </el-col>
    </el-row>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  cargoItems: {
    type: Array,
    default: () => [{ length: '', width: '', height: '', weight: '', pallets: '' }] // 一开始就有一个空对象
  }
})
const emit = defineEmits(['update:cargoItems'])

// 添加新货物信息
const addCargo = () => {
  const newCargo = {
    length: '',
    width: '',
    height: '',
    weight: '',
    pallets: ''
  }
  props.cargoItems.push(newCargo)
  emit('update:cargoItems', props.cargoItems)
}

// 删除货物信息
const removeCargo = (index) => {
  props.cargoItems.splice(index, 1)
  emit('update:cargoItems', props.cargoItems)
}
</script>

<style scoped>
.cargo-row {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.remove-button {
  margin-top: 32px; /* 调整按钮与输入框垂直对齐 */
}

.add-button-container {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
