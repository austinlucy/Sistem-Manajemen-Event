import express from 'express'
import { getMyRegistrations } from '../controllers/registrationController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authMiddleware, getMyRegistrations)

export default router
