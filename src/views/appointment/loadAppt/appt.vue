<template>
  <div class="appointment-form">
    <h2>装车预约</h2>
    
    <!-- PC号输入 -->
    <div class="form-group">
      <label for="pcNumber">PC号/PC Number：<span class="required">*</span></label>
      <input type="text" v-model="pcNumber" placeholder="输入PC号/PC Number" />
    </div>

    <!-- 供应商名称输入 -->
    <div class="form-group">
      <label for="supplierName">供应商名称/Vendor Name：<span class="required">*</span></label>
      <input type="text" v-model="supplierName" placeholder="输入供应商名称/Vendor Name" />
    </div>

    <!-- 预约日期选择 -->
    <div class="form-group">
      <label for="appointmentDate">预约日期/appointment date：<span class="required">*</span></label>
      <input 
        type="date" 
        v-model="appointmentDate" 
        :min="today" 
        @change="checkDateAvailability" 
      />
    </div>

    <!-- 预约时间段选择 -->
    <div class="form-group" v-if="isDateOpen">
      <label for="appointmentTime">预约时间段/appointment time：<span class="required">*</span></label>
      <select v-model="appointmentTime" @change="fetchAppointmentLimit">
        <option disabled value="">请选择时间/Please select time slot</option>
        <option v-for="time in availableTimeSlots" :key="time" :value="time" :disabled="!isTimeAvailableForBooking(time)">
          {{ time }}{{ !isTimeAvailableForBooking(time) ? ' (未开放预约/Not Available Yet)' : '' }}
        </option>
      </select>
      <!-- 显示最大预约数 -->
      <p v-if="appointmentLimit">
        卡板最大预约数: {{ appointmentLimit.pallet }}，地板最大预约数: {{ appointmentLimit.floor }}
      </p>
      <!-- 显示当前美西时间 -->
      <p class="time-info">当前美西时间: {{ currentPacificTimeFormatted }}</p>
    </div>
    
    <!-- 提示信息：日期未开放预约 -->
    <p v-else class="warning-text">该日期未开放预约</p>

    <!-- 司机电话输入 -->
    <div class="form-group">
      <label for="driverPhone">司机电话/Driver Phone Number：<span class="required">*</span></label>
      <input type="tel" v-model="driverPhone" placeholder="输入司机电话/Driver Phone Number" />
    </div>

    <!-- 货物类型选择 -->
    <div class="form-group">
      <label for="cargoType">货物类型/Cargo Type：<span class="required">*</span></label>
      <select v-model="cargoType">
        <option disabled value="">请选择货物类型/please select Cargo Type</option>
        <option value="地板">地板/floor</option>
        <option value="卡板">卡板/pallet</option>
      </select>
    </div>
        <!-- 装柜类型选择 -->
    <div class="form-group">
      <label for="loadType">装柜类型/Load type：<span class="required">*</span></label>
      <select v-model="loadType">
        <option disabled value="">请选择装柜类型/please select load type</option>
        <option value="liveload">Liveload</option>
        <option value="drop">Drop</option>
      </select>
    </div>

    <!-- 提示信息：预约时间开放规则 -->
    <p class="info-text">注意：只能预约当前美西时间6小时后的时间段/Note: You can only book time slots that are at least 6 hours after the current Pacific Time</p>

    <!-- 提交预约按钮：根据isSubmitVisible计算属性动态控制 -->
    <button @click="handleSubmit" class="btn-submit" :disabled="!isSubmitVisible">提交预约/Submit</button>
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
      loadType: '',
      availableTimeSlots: [
        '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
      ],
      appointmentLimit: null,  // { pallet: number, floor: number }
      isDateOpen: true,        
      today: this.getTodayDate(),
      // 更新当前时间的计时器
      clockTimer: null
    };
  },
  computed: {
    isSubmitVisible() {
      return this.isDateOpen && 
             this.appointmentDate && 
             this.appointmentTime && 
             this.cargoType &&
             this.isTimeAvailableForBooking(this.appointmentTime);
    },
    currentPacificTimeFormatted() {
      // 获取当前美西时间的格式化字符串
      const options = { 
        timeZone: 'America/Los_Angeles',
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false
      };
      return new Date().toLocaleString('en-US', options);
    }
  },
  created() {
    // 创建一个每秒更新时间的计时器
    this.clockTimer = setInterval(() => {
      // 更新计算属性
      this.$forceUpdate();
    }, 1000);
  },
  beforeDestroy() {
    // 在组件销毁前清除计时器
    if (this.clockTimer) {
      clearInterval(this.clockTimer);
    }
  },
  methods: {
    getTodayDate() {
      // 获取美西时区的当前日期
      const options = { timeZone: 'America/Los_Angeles', timeZoneName: 'short' };
      const pacificDate = new Date().toLocaleDateString('en-US', options);
      const parts = pacificDate.split('/');
      // 将日期格式化为YYYY-MM-DD
      const formattedDate = `${parts[2].split(' ')[0]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
      return formattedDate;
    },
    
    // 获取当前美西时间
    getCurrentPacificTime() {
      const options = { timeZone: 'America/Los_Angeles' };
      return new Date().toLocaleString('en-US', options);
    },
    
    // 将时间字符串转换为美西时区的Date对象
    getPacificTimeDate(dateStr, timeStr) {
      // 组合日期和时间字符串
      const [hours, minutes] = timeStr.split(':').map(Number);
      
      // 创建一个新的Date对象
      const date = new Date(`${dateStr}T${timeStr}:00`);
      
      return date;
    },
    
    isTimeAvailableForBooking(timeSlot) {
      if (!this.appointmentDate) return false;
      
      // 获取当前美西时间
      const now = new Date(this.getCurrentPacificTime());
      
      // 获取预约时间
      const appointmentDateTime = this.getPacificTimeDate(this.appointmentDate, timeSlot);
      
      // 计算时间差（毫秒）
      const timeDiff = appointmentDateTime.getTime() - now.getTime();
      
      // 检查是否至少在6小时以后 (6小时 = 6 * 60 * 60 * 1000 毫秒)
      return timeDiff >= 6 * 60 * 60 * 1000;
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
          !this.appointmentTime || !this.driverPhone || !this.cargoType || !this.loadType) {
        this.$message.error('请填写所有必填项/please type all info。');
        return;
      }

      if (!this.isDateOpen) {
        this.$message.error('该日期未开放预约，无法提交/the date not available。');
        return;
      }
      
      // 检查是否满足预约时间规则（至少6小时以后）
      if (!this.isTimeAvailableForBooking(this.appointmentTime)) {
        this.$message.error('只能预约当前美西时间6小时后的时间段/You can only book time slots that are at least 6 hours after the current Pacific Time.');
        return;
      }
      
      if (this.appointmentDate && this.appointmentTime && this.cargoType) {
        try {
          const response = await getCurrentAppointments(this.appointmentDate, this.appointmentTime, this.cargoType);
          const currentAppointments = response.data;

          const maxLimit = this.cargoType === '卡板' ? this.appointmentLimit.pallet : this.appointmentLimit.floor;

          if (currentAppointments >= maxLimit) {
            this.$message.error(`时间段 ${this.appointmentTime} 已达到最大预约数量，无法提交/Appointment are full。`);
            return;
          }
        } catch (error) {
          console.error('检查当前预约数量时出错：', error);
          this.$message.error('提交失败，请重试！/please try again');
          return;
        }
      }

      const appointmentData = {
        pcNumber: this.pcNumber,
        supplierName: this.supplierName,
        appointmentDate: this.appointmentDate,
        appointmentTime: this.appointmentTime,
        driverPhone: this.driverPhone,
        cargoType: this.cargoType,
        loadType: this.loadType
      };

      try {
        await submitAppointment(appointmentData);
        this.$message.success('预约已提交！/ Successful');
        this.resetForm();
      } catch (error) {
        this.$message.error('提交失败，请重试！/ please try again');
      }
    },

    resetForm() {
      this.pcNumber = '';
      this.supplierName = '';
      this.appointmentDate = '';
      this.appointmentTime = '';
      this.driverPhone = '';
      this.cargoType = '';
      this.loadType = '';
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
.info-text {
  color: #007bff;
  font-weight: bold;
  margin: 10px 0;
}
.time-info {
  color: #28a745;
  font-weight: bold;
  margin: 10px 0;
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