import express from 'express'
import { getMyNotifications, markNotificationRead } from '../controllers/notificationController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authMiddleware, getMyNotifications)
router.put('/:id/read', authMiddleware, markNotificationRead)

export default router
