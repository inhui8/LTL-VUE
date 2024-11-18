// src/api/appointment.js

import request from '@/utils/request'

// 提交装车预约信息
export function submitAppointment(data) {
  return request({
    url: '/appointment/appointment', // 修改后的接口地址
    method: 'post',
    data: data
  })
}

// Fetch all events from the backend
export function fetchAppointments() {
  return request({
    url: '/appointment/appointment/events', // Make sure the endpoint matches your backend
    method: 'get'
  });
}

// Update an existing appointment by ID
export function updateAppointment(id, data) {
  return request({
    url: `/appointment/appointment/${id}`,
    method: 'put',
    data: data
  })
}

// Delete an appointment by ID
export function deleteAppointment(id) {
  return request({
    url: `/appointment/appointment/${id}`,
    method: 'delete'
  })
}

export function saveAppointmentSettings(data) {
  return request({
    url: '/appointment/appointment/save',
    method: 'post',
    data
  });
}

export function getAppointmentSettings(date) {
  return request({
    url: '/appointment/appointment/get',
    method: 'get',
    params: { appointmentDate: date }
  });
}

export function getAppointmentLimits(date, timeSlot) {
  return request({
    url: `/appointment/appointment/limits`,
    method: 'get',
    params: { date, timeSlot }
  });
}


// Get current appointments for a specific date, time slot, and cargo type
export function getCurrentAppointments(date, timeSlot, cargoType) {
  return request({
    url: `/appointment/appointment/current`,
    method: 'get',
    params: { date, timeSlot, cargoType } // Add cargoType as 'type' parameter
  });
}

export function checkDateAvailability(date) {
  return request({
    url: `/appointment/appointment/isOpen`,
    method: 'get',
    params: { date }
  });
}