import express from 'express'
import { 
  getDashboardStats, 
  getEventRegistrations, 
  updateRegistrationStatus,
  getEventSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule
} from '../controllers/adminController.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const router = express.Router()

// Stats
router.get('/stats', authMiddleware, adminMiddleware, getDashboardStats)

// Registrations
router.get('/events/:eventId/registrations', authMiddleware, adminMiddleware, getEventRegistrations)
router.put('/registrations/:registrationId', authMiddleware, adminMiddleware, updateRegistrationStatus)

// Schedules
router.get('/events/:eventId/schedules', authMiddleware, adminMiddleware, getEventSchedules)
router.post('/events/:eventId/schedules', authMiddleware, adminMiddleware, createSchedule)
router.put('/schedules/:scheduleId', authMiddleware, adminMiddleware, updateSchedule)
router.delete('/schedules/:scheduleId', authMiddleware, adminMiddleware, deleteSchedule)

export default router
