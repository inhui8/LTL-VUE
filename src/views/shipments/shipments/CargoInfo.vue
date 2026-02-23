<template>
  <div>
    <!-- Add cargo information and unit selection -->
    <el-row :gutter="20" class="top-bar">

      <el-col :span="12" class="unit-selection">
        <el-form-item label="单位选择/Unit select">
          <el-select v-model="currentUnit" placeholder="选择单位">
            <el-option label="CM + KG" value="cm_kg"></el-option>
            <el-option label="INCH + LBS" value="inch_lbs"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- Display cargo information in a single row -->
    <el-row :gutter="10" v-for="(item, index) in cargoItems" :key="index" class="cargo-row">
      <el-col :span="3.5">
        <el-form-item :label="'Length (' + unitLabels.length + ') ' + (index + 1)" :rules="[{ required: true, message: '请输入Length', trigger: 'blur' }]">
          <el-input v-model="item.length" placeholder="请输入Length" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="3.5">
        <el-form-item :label="'Width (' + unitLabels.length + ') ' + (index + 1)" :rules="[{ required: true, message: '请输入Width', trigger: 'blur' }]">
          <el-input v-model="item.width" placeholder="请输入Width" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="3.5">
        <el-form-item :label="'Height (' + unitLabels.length + ') ' + (index + 1)" :rules="[{ required: true, message: '请输入Height', trigger: 'blur' }]">
          <el-input v-model="item.height" placeholder="请输入Height" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="3.5">
        <el-form-item :label="'Weight (' + unitLabels.weight + ') ' + (index + 1)" :rules="[{ required: true, message: '请输入Weight', trigger: 'blur' }]">
          <el-input v-model="item.weight" placeholder="请输入Weight" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="3.5">
        <el-form-item :label="'Pallet Number ' + (index + 1)" :rules="[{ required: true, message: '请输入Pallet Number', trigger: 'blur' }]">
          <el-input v-model="item.pallets" placeholder="请输入Pallet Number" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="3.5">
        <el-form-item :label="'Pieces ' + (index + 1)" :rules="[{ required: true, message: '请输入件数', trigger: 'blur' }]">
          <el-input v-model="item.pcs" placeholder="请输入件数" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="addCargo">添加货物</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="danger" @click="removeCargo(index)" class="remove-button" v-if="cargoItems.length > 1">删除货物</el-button>
      </el-col>
    </el-row>
  </div>
</template>



<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  cargoItems: {
    type: Array,
    default: () => [{ length: '', width: '', height: '', weight: '', pallets: '', pcs: '' }]
  }
})

const emit = defineEmits(['update:cargoItems'])

// 当前单位和标签
const currentUnit = ref('cm_kg'); // 默认单位为 CM + KG
const unitLabels = reactive({ length: 'CM', weight: 'KG' });

// 监听单位变化
watch(currentUnit, (newUnit, oldUnit) => {
  if (newUnit !== oldUnit) {
    updateUnits(newUnit, oldUnit);
  }
});

// 更新单位转换
const updateUnits = (newUnit, oldUnit) => {
  props.cargoItems.forEach((item) => {
    if (newUnit === 'inch_lbs') {
      // 从 CM + KG 转换为 INCH + LBS
      item.length = convertToInch(item.length);
      item.width = convertToInch(item.width);
      item.height = convertToInch(item.height);
      item.weight = convertToLbs(item.weight);
    } else if (newUnit === 'cm_kg') {
      // 从 INCH + LBS 转换为 CM + KG
      item.length = convertToCm(item.length);
      item.width = convertToCm(item.width);
      item.height = convertToCm(item.height);
      item.weight = convertToKg(item.weight);
    }
  });

  // 更新标签
  unitLabels.length = newUnit === 'inch_lbs' ? 'INCH' : 'CM';
  unitLabels.weight = newUnit === 'inch_lbs' ? 'LBS' : 'KG';
  emit('update:cargoItems', props.cargoItems);
};

// 添加新货物信息
const addCargo = () => {
  const newCargo = {
    length: '',
    width: '',
    height: '',
    weight: '',
    pallets: '',
    pcs: ''
  };
  props.cargoItems.push(newCargo);
  emit('update:cargoItems', props.cargoItems);
};

// 删除货物信息
const removeCargo = (index) => {
  props.cargoItems.splice(index, 1);
  emit('update:cargoItems', props.cargoItems);
};

// 单位转换函数
const convertToInch = (value) => (value ? Math.round(value / 2.54) : '');
const convertToLbs = (value) => (value ? Math.round(value * 2.2046) : '');
const convertToCm = (value) => (value ? Math.round(value * 2.54) : '');
const convertToKg = (value) => (value ? Math.round(value / 2.2046) : '');
</script>


<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.cargo-row {
  display: flex;
  flex-wrap: nowrap; /* Ensure fields are on a single row */
  align-items: center;
  margin-bottom: 10px;
}

.remove-button {
  margin-left: 10px;
  align-self: flex-end;
}

.add-button-container {
  text-align: left;
}

.unit-selection {
  text-align: right;
}
</style>


