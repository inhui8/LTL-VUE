<template>
  <div class="appointment-form">
    <h2>装车预约</h2>
    
    <!-- PC号输入 -->
    <div class="form-group">
      <label for="pcNumber">PC号：<span class="required">*</span></label>
      <input type="text" v-model="pcNumber" placeholder="输入PC号" />
    </div>

    <!-- 供应商名称输入 -->
    <div class="form-group">
      <label for="supplierName">供应商名称：<span class="required">*</span></label>
      <input type="text" v-model="supplierName" placeholder="输入供应商名称" />
    </div>

    <!-- 预约日期选择 -->
    <div class="form-group">
      <label for="appointmentDate">预约日期：<span class="required">*</span></label>
      <input 
        type="date" 
        v-model="appointmentDate" 
        :min="today" 
        @change="checkDateAvailability" 
      />
    </div>

    <!-- 预约时间段选择 -->
    <div class="form-group" v-if="isDateOpen">
      <label for="appointmentTime">预约时间段：<span class="required">*</span></label>
      <select v-model="appointmentTime" @change="fetchAppointmentLimit">
        <option disabled value="">请选择时间</option>
        <option v-for="time in availableTimeSlots" :key="time" :value="time">{{ time }}</option>
      </select>
      <!-- 显示最大预约数 -->
      <p v-if="appointmentLimit">
        卡板最大预约数: {{ appointmentLimit.pallet }}，地板最大预约数: {{ appointmentLimit.floor }}
      </p>
    </div>
    
    <!-- 提示信息：日期未开放预约 -->
    <p v-else class="warning-text">该日期未开放预约</p>

    <!-- 司机电话输入 -->
    <div class="form-group">
      <label for="driverPhone">司机电话：<span class="required">*</span></label>
      <input type="tel" v-model="driverPhone" placeholder="输入司机电话" />
    </div>

    <!-- 货物类型选择 -->
    <div class="form-group">
      <label for="cargoType">货物类型：<span class="required">*</span></label>
      <select v-model="cargoType">
        <option disabled value="">请选择货物类型</option>
        <option value="地板">地板</option>
        <option value="卡板">卡板</option>
      </select>
    </div>

    <!-- 提交预约按钮：根据isSubmitVisible计算属性动态控制 -->
    <button @click="handleSubmit" class="btn-submit" :disabled="!isSubmitVisible">提交预约</button>
  </div>
</template>

<script>
import { submitAppointment, getAppointmentLimits, checkDateAvailability, getCurrentAppointments } from '@/api/appointment/appointment';

export default {
  data() {
    return {
      pcNumber: '',
      supplierName: '',
      appointmentDate: '',
      appointmentTime: '',
      driverPhone: '',
      cargoType: '',
      availableTimeSlots: [
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00','20:00','21:00','22:00','23:00'
      ],
      appointmentLimit: null,  // { pallet: number, floor: number }
      isDateOpen: true,        
      today: this.getTodayDate()
    };
  },
  computed: {
    isSubmitVisible() {
      return this.isDateOpen && this.appointmentDate && this.appointmentTime && this.cargoType;
    }
  },
  methods: {
    getTodayDate() {
      const today = new Date();
      today.setDate(today.getDate() + 1);
      today.setHours(0, 0, 0, 0);
      return today.toISOString().split('T')[0];
    },
    async checkDateAvailability() {
      if (this.appointmentDate) {
        try {
          const response = await checkDateAvailability(this.appointmentDate);
          this.isDateOpen = response.data;
          if (this.isDateOpen) {
            this.fetchAppointmentLimit();
          } else {
            this.appointmentTime = ""; 
            this.appointmentLimit = null;
          }
        } catch (error) {
          console.error('检查日期开放状态时出错：', error);
          this.isDateOpen = false;
        }
      }
    },

    async fetchAppointmentLimit() {
  if (this.appointmentDate && this.appointmentTime && this.isDateOpen) {
    try {
      const response = await getAppointmentLimits(this.appointmentDate, this.appointmentTime);
      this.appointmentLimit = response.data; // Contains both pallet and floor limits
    } catch (error) {
      console.error('获取最大预约数时出错：', error);
      this.appointmentLimit = null;
    }
  }
},


    async handleSubmit() {
      if (!this.pcNumber || !this.supplierName || !this.appointmentDate || 
          !this.appointmentTime || !this.driverPhone || !this.cargoType) {
        this.$message.error('请填写所有必填项。');
        return;
      }

      if (!this.isDateOpen) {
        this.$message.error('该日期未开放预约，无法提交。');
        return;
      }
      
      if (this.appointmentDate && this.appointmentTime && this.cargoType) {
        try {
          const response = await getCurrentAppointments(this.appointmentDate, this.appointmentTime, this.cargoType);
          const currentAppointments = response.data;

          const maxLimit = this.cargoType === '卡板' ? this.appointmentLimit.pallet : this.appointmentLimit.floor;

          if (currentAppointments >= maxLimit) {
            this.$message.error(`时间段 ${this.appointmentTime} 已达到最大预约数量，无法提交。`);
            return;
          }
        } catch (error) {
          console.error('检查当前预约数量时出错：', error);
          this.$message.error('提交失败，请重试！');
          return;
        }
      }

      const appointmentData = {
        pcNumber: this.pcNumber,
        supplierName: this.supplierName,
        appointmentDate: this.appointmentDate,
        appointmentTime: this.appointmentTime,
        driverPhone: this.driverPhone,
        cargoType: this.cargoType
      };

      try {
        await submitAppointment(appointmentData);
        this.$message.success('预约已提交！');
        this.resetForm();
      } catch (error) {
        this.$message.error('提交失败，请重试！');
      }
    },

    resetForm() {
      this.pcNumber = '';
      this.supplierName = '';
      this.appointmentDate = '';
      this.appointmentTime = '';
      this.driverPhone = '';
      this.cargoType = '';
      this.appointmentLimit = null;
      this.isDateOpen = true;
    }
  },
  watch: {
    appointmentDate(newDate) {
      if (newDate) {
        this.checkDateAvailability();
      }
    },
    appointmentTime() {
      this.fetchAppointmentLimit();
    },
    cargoType() {
      this.fetchAppointmentLimit();
    }
  }
};
</script>

<style scoped>
.warning-text {
  color: red;
  font-weight: bold;
}
.required {
  color: red;
}
.appointment-form {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
input,
select {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.btn-submit {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-submit:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
