import express from 'express'
import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } from '../controllers/eventController.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.get('/', getAllEvents)
router.get('/:id', getEventById)
router.post('/', authMiddleware, adminMiddleware, createEvent)
router.put('/:id', authMiddleware, adminMiddleware, updateEvent)
router.delete('/:id', authMiddleware, adminMiddleware, deleteEvent)

export default router
