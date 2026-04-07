import { Router } from 'express'
import { login, logout, me, refreshToken, changePassword } from '../controllers/authController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.post('/login', login)
router.post('/refresh', refreshToken)
router.post('/logout', authenticate, logout)
router.get('/me', authenticate, me)
router.put('/change-password', authenticate, changePassword)

export default router
