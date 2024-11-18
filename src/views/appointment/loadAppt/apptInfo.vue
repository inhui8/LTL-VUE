<template>
  <div class="appointment-form">
    <h2>预约设置</h2>

    <!-- 日期选择器 -->
    <div class="form-group">
      <label for="appointmentDate">选择日期：</label>
      <input type="date" v-model="appointmentDate" @change="loadSettings" />
    </div>

    <!-- 设置每个时间段的最大预约数量 -->
    <h3>设置时间段的最大预约数量</h3>
    <div class="time-slot-container">
      <div v-for="time in timeSlots" :key="time" class="time-slot">
        <h4>{{ time }}</h4>
        <div class="input-row">
          <label :for="time + '-pallet'">卡板</label>
          <input
            type="number"
            v-model="maxAppointments[time].pallet"
            placeholder="卡板预约数"
            min="0"
            class="input-field"
          />
          <label :for="time + '-floor'">地板</label>
          <input
            type="number"
            v-model="maxAppointments[time].floor"
            placeholder="地板预约数"
            min="0"
            class="input-field"
          />
        </div>
      </div>
    </div>

    <!-- 是否开放当天预约 -->
    <div class="form-group">
      <label for="isOpen">该日期是否开放预约：</label>
      <input type="checkbox" v-model="isOpen" />
    </div>

    <!-- 保存按钮 -->
    <button @click="saveSettings">保存设置</button>
  </div>
</template>

<script>
import { saveAppointmentSettings, getAppointmentSettings } from '@/api/appointment/appointment';

export default {
  data() {
    return {
      appointmentDate: '',
      timeSlots: [
        '08:00', '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
      ],
      maxAppointments: {},
      isOpen: true
    };
  },
  created() {
    this.timeSlots.forEach(time => {
      this.maxAppointments[time] = { pallet: 0, floor: 0 };
    });
  },
  methods: {
    async loadSettings() {
      try {
        const response = await getAppointmentSettings(this.appointmentDate);
        if (response && response.data) {
          this.isOpen = response.data[0]?.isOpen || false;
          this.timeSlots.forEach(time => {
            this.maxAppointments[time] = { pallet: 0, floor: 0 };
          });
          response.data.forEach(setting => {
            this.maxAppointments[setting.timeSlot] = {
              pallet: setting.palletMaxAppointments || 0,
              floor: setting.floorMaxAppointments || 0
            };
          });
        }
      } catch (error) {
        console.error('加载设置时出错：', error);
      }
    },
    async saveSettings() {
      const maxAppointmentsArray = Object.keys(this.maxAppointments).map(timeSlot => ({
        appointmentDate: this.appointmentDate,
        timeSlot: timeSlot,
        palletMaxAppointments: this.maxAppointments[timeSlot].pallet || 0,
        floorMaxAppointments: this.maxAppointments[timeSlot].floor || 0,
        isOpen: this.isOpen
      }));

      try {
        await saveAppointmentSettings(maxAppointmentsArray);
        alert('设置已保存！');
      } catch (error) {
        console.error('保存设置时出错：', error);
      }
    }
  }
};
</script>

<style scoped>
.appointment-form {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.time-slot-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.time-slot {
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.time-slot h4 {
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-row label {
  font-size: 14px;
  color: #555;
  flex: 1;
}

.input-field {
  flex: 2;
  padding: 5px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-width: 80px; /* 限制输入框宽度 */
}

button {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  font-size: 16px;
}

button:hover {
  background-color: #218838;
}
</style>
