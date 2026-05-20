import express from 'express'
import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent, getPublicSchedules } from '../controllers/eventController.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'
import { uploadEventBanner } from '../middleware/upload.js'

const router = express.Router()

router.get('/', getAllEvents)
router.get('/:id', getEventById)
router.get('/:id/schedules', getPublicSchedules)
router.post('/', authMiddleware, adminMiddleware, uploadEventBanner, createEvent)
router.put('/:id', authMiddleware, adminMiddleware, uploadEventBanner, updateEvent)
router.delete('/:id', authMiddleware, adminMiddleware, deleteEvent)

export default router
