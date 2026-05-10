import express from 'express'
import { registerEvent, getMyRegistrations, cancelRegistration } from '../controllers/registrationController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.post('/', authMiddleware, registerEvent)
router.get('/', authMiddleware, (req, res) => {
  // redirect to /api/my-registrations
  getMyRegistrations(req, res)
})
router.delete('/:id', authMiddleware, cancelRegistration)

export default router
