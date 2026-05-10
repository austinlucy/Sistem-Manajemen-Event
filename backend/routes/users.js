import express from 'express'
import { getUserProfile, updateUserProfile, uploadPhoto } from '../controllers/userController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.get('/profile', authMiddleware, getUserProfile)
router.put('/profile', authMiddleware, updateUserProfile)
router.post('/upload-photo', authMiddleware, uploadPhoto)

export default router
