import api from './api'

// Event services
export const eventService = {
  getAllEvents: (params) => api.get('/events', { params }),
  getEventById: (id) => api.get(`/events/${id}`),
  getEventSchedules: (id) => api.get(`/events/${id}/schedules`),
  createEvent: (data) => {
    // If FormData, let Axios set Content-Type automatically
    if (data instanceof FormData) {
      return api.post('/events', data)
    }
    return api.post('/events', data)
  },
  updateEvent: (id, data) => {
    if (data instanceof FormData) {
      return api.put(`/events/${id}`, data)
    }
    return api.put(`/events/${id}`, data)
  },
  deleteEvent: (id) => api.delete(`/events/${id}`),
}

// Registration services
export const registrationService = {
  registerEvent: (eventId) => api.post('/registrations', { event_id: eventId }),
  getMyRegistrations: () => api.get('/my-registrations'),
  cancelRegistration: (registrationId) => api.delete(`/registrations/${registrationId}`),
}

// User services
export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadPhoto: (formData) => api.post('/users/upload-photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}

// Admin services
export const adminService = {
  getDashboardStats: () => api.get('/admin/stats'),
  getRegistrations: (eventId) => api.get(`/admin/events/${eventId}/registrations`),
  updateRegistrationStatus: (registrationId, status) => 
    api.put(`/admin/registrations/${registrationId}`, { status }),
  getSchedules: (eventId) => api.get(`/admin/events/${eventId}/schedules`),
  createSchedule: (eventId, data) => api.post(`/admin/events/${eventId}/schedules`, data),
  updateSchedule: (scheduleId, data) => api.put(`/admin/schedules/${scheduleId}`, data),
  deleteSchedule: (scheduleId) => api.delete(`/admin/schedules/${scheduleId}`),
}

// Category services
export const categoryService = {
  getAllCategories: () => api.get('/categories'),
}
