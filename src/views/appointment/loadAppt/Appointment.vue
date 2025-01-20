<template>
    <div>
      <!-- FullCalendar with CRUD capabilities -->
      <FullCalendar :options="calendarOptions" />
  
      <!-- Event Modal Dialog -->
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <h2 v-if="editMode">编辑预约信息</h2>
          <h2 v-else>创建预约信息</h2>
  
          <div class="form-group">
            <label for="pcNumber">PC号:<span class="required">*</span></label>
            <input type="text" v-model="pcNumber" placeholder="输入PC号" required />
          </div>
  
          <div class="form-group">
            <label for="supplierName">供应商名称：<span class="required">*</span></label>
            <input type="text" v-model="supplierName" placeholder="输入供应商名称" required />
          </div>
  
          <div class="form-group">
            <label for="appointmentDate">预约日期：<span class="required">*</span></label>
            <input type="date" v-model="appointmentDate" required />
          </div>
  
          <div class="form-group">
            <label for="appointmentTime">预约时间段：<span class="required">*</span></label>
            <select v-model="appointmentTime" required>
              <option disabled value="">请选择时间</option>
              <option v-for="time in availableTimeSlots" :key="time" :value="time">{{ time }}</option>
            </select>
          </div>
  
          <div class="form-group">
            <label for="driverPhone">司机电话：<span class="required">*</span></label>
            <input type="tel" v-model="driverPhone" placeholder="输入司机电话" required />
          </div>
  
          <div class="form-group">
            <label for="cargoType">货物类型：<span class="required">*</span></label>
            <select v-model="cargoType" required>
              <option disabled value="">请选择货物类型</option>
              <option value="地板">地板</option>
              <option value="卡板">卡板</option>
            </select>
          </div>
          <div class="form-group">
            <label for="loadType">装柜类型：<span class="required">*</span></label>
            <select v-model="loadType" required>
              <option disabled value="">请选择装柜类型</option>
              <option value="liveload">Liveload</option>
              <option value="drop">Drop</option>
            </select>
          </div>
  
          <div class="form-actions">
            <button class="btn-save" @click="editMode ? handleUpdate() : handleSave()">保存</button>
            <button class="btn-delete" @click="handleDelete" v-if="editMode">删除</button>
            <button class="btn-cancel" @click="closeModal">取消</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import FullCalendar from '@fullcalendar/vue3';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import interactionPlugin from '@fullcalendar/interaction';
  import timeGridPlugin from '@fullcalendar/timegrid';
  import listPlugin from '@fullcalendar/list';
  import {
    submitAppointment,
    fetchAppointments,
    updateAppointment,
    deleteAppointment
  } from '@/api/appointment/appointment';
  
  export default {
    components: {
      FullCalendar
    },
    data() {
      return {
        calendarOptions: {
          plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
          height: 800,
          validRange: {
            start: new Date()
          },
          headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridDay,timeGridWeek,dayGridMonth,listWeek'
          },
          initialView: 'dayGridMonth',
          weekends: true,
          editable: true,
          events: [],
          dayMaxEvents: 2,
          eventMaxStack: 2,
          dayMaxEventRows: 2,
          dayMaxEventRows: true,
          dateClick: this.handleDateClick,
          eventClick: this.handleEventClick,
          eventDrop: this.handleEventDrop,
        },
        showModal: false,
        pcNumber: '',
        supplierName: '',
        appointmentDate: '',
        appointmentTime: '',
        driverPhone: '',
        cargoType: '',
        loadType: '',
        clickedDate: '',
        selectedEvent: null,
        editMode: false,
        availableTimeSlots: [
          '08:00:00', '09:00:00', '10:00:00', '11:00:00', '12:00:00', 
          '13:00:00', '14:00:00', '15:00:00', '16:00:00', '17:00:00', '18:00:00', '19:00:00','20:00:00','21:00:00','22:00:00','23:00:00'
        ]
      };
    },
    mounted() {
      this.loadEvents();
    },
    methods: {
      async loadEvents() {
        try {
          const response = await fetchAppointments();
          const events = Array.isArray(response) ? response.map(event => ({
            id: event.id,
            title: `PC: ${event.pcNumber}, ${event.supplierName}`,
            start: `${event.appointmentDate}T${event.appointmentTime}`,
            allDay: false,
            extendedProps: {
              pcNumber: event.pcNumber,
              supplierName: event.supplierName,
              driverPhone: event.driverPhone,
              cargoType: event.cargoType,
              loadType: event.loadType,
              appointmentTime: event.appointmentTime
            }
          })) : [];
          this.calendarOptions.events = events;
        } catch (error) {
          console.error("Failed to load events:", error);
        }
      },
      handleDateClick(info) {
        this.resetForm();
        this.appointmentDate = info.dateStr;
        this.editMode = false;
        this.showModal = true;
      },
      handleEventClick(info) {
        this.selectedEvent = info.event;
        this.pcNumber = this.selectedEvent.extendedProps.pcNumber;
        this.supplierName = this.selectedEvent.extendedProps.supplierName;
        this.appointmentDate = this.selectedEvent.start.toISOString().split('T')[0];
        this.appointmentTime = this.selectedEvent.extendedProps.appointmentTime;
        this.driverPhone = this.selectedEvent.extendedProps.driverPhone;
        this.cargoType = this.selectedEvent.extendedProps.cargoType;
        this.loadType = this.selectedEvent.extendedProps.loadType;
        this.editMode = true;
        this.showModal = true;
      },
      async handleEventDrop(eventDropInfo) {
        const { event } = eventDropInfo;

        // Ensure we work with the local timezone
        const appointmentDate = event.start.toLocaleDateString('en-CA'); // YYYY-MM-DD format
        const appointmentTime = event.start.toLocaleTimeString('en-GB', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
        }); // HH:mm:ss format

        const updatedAppointment = {
        pcNumber: event.extendedProps.pcNumber,
        supplierName: event.extendedProps.supplierName,
        appointmentDate,
        appointmentTime,
        driverPhone: event.extendedProps.driverPhone,
        cargoType: event.extendedProps.cargoType,
        loadType: event.extendedProps.loadType 
        };

        try {
        await updateAppointment(event.id, updatedAppointment);
        this.loadEvents(); // Refresh events after drag update
        } catch (error) {
        console.error("Error updating appointment after drag:", error);
        alert("更新预约时间失败，请重试！");
        }
    },
      validateForm() {
        return (
          this.pcNumber &&
          this.supplierName &&
          this.appointmentDate &&
          this.appointmentTime &&
          this.driverPhone &&
          this.cargoType &&
          this.loadType
        );
      },
      async handleSave() {
        if (!this.validateForm()) {
          alert("所有字段都是必填的！");
          return;
        }
        const newAppointment = {
          pcNumber: this.pcNumber,
          supplierName: this.supplierName,
          appointmentDate: this.appointmentDate,
          appointmentTime: this.appointmentTime,
          driverPhone: this.driverPhone,
          cargoType: this.cargoType,
          loadType: this.loadType
        };
        try {
          await submitAppointment(newAppointment);
          this.loadEvents(); // Refresh events after save
          this.closeModal();
        } catch (error) {
          console.error("Error saving appointment:", error);
        }
      },
      async handleUpdate() {
        if (!this.validateForm()) {
          alert("所有字段都是必填的！");
          return;
        }
        const updatedAppointment = {
          pcNumber: this.pcNumber,
          supplierName: this.supplierName,
          appointmentDate: this.appointmentDate,
          appointmentTime: this.appointmentTime,
          driverPhone: this.driverPhone,
          cargoType: this.cargoType,
          loadType: this.loadType
        };
        try {
          await updateAppointment(this.selectedEvent.id, updatedAppointment);
          this.loadEvents(); // Refresh events after update
          this.closeModal();
        } catch (error) {
          console.error("Error updating appointment:", error);
        }
      },
      async handleDelete() {
        try {
          await deleteAppointment(this.selectedEvent.id);
          this.loadEvents(); // Refresh events after deletion
          this.closeModal();
        } catch (error) {
          console.error("Error deleting appointment:", error);
        }
      },
      closeModal() {
        this.resetForm();
        this.showModal = false;
      },
      resetForm() {
        this.pcNumber = '';
        this.supplierName = '';
        this.appointmentDate = '';
        this.appointmentTime = '';
        this.driverPhone = '';
        this.cargoType = '';
        this.loadType = '';
        this.selectedEvent = null;
        this.editMode = false;
      },
      renderEventContent(arg) {
        const { pcNumber, supplierName, driverPhone, cargoType , loadType} = arg.event.extendedProps;
        return {
          html: `
            <div class="fc-event-custom-content">
              <strong>PC: ${pcNumber}</strong><br>
              <span>供应商: ${supplierName}</span><br>
              <span>司机电话: ${driverPhone}</span><br>
              <span>货物类型: ${cargoType}</span>
              <span>装柜类型: ${loadType}</span>
            </div>
          `
        };
      }
    }
  };
  </script>
  
  <style scoped>
  .modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }
  .modal-content {
    background-color: white;
    padding: 30px;
    border-radius: 8px;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }
  h2 {
    margin-bottom: 20px;
  }
  .form-group {
    margin-bottom: 15px;
  }
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  .form-group .required {
    color: red;
    margin-left: 4px;
  }
  .form-group input,
  .form-group select {
    width: 100%;
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .form-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  .btn-save,
  .btn-cancel,
  .btn-delete {
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .btn-save {
    background-color: #28a745;
    color: white;
  }
  .btn-delete {
    background-color: #dc3545;
    color: white;
  }
  .btn-cancel {
    background-color: #6c757d;
    color: white;
  }
  </style>