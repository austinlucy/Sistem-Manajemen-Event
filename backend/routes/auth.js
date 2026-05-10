import express from 'express'
import { registerUser, loginUser, loginAdmin, verifyToken } from '../controllers/authController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/login-admin', loginAdmin)
router.get('/verify', authMiddleware, verifyToken)

export default router
