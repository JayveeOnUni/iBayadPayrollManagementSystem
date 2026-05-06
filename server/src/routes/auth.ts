import { Router } from 'express'
import {
  activateAccount,
  changePassword,
  login,
  logout,
  me,
  refreshToken,
  verifyActivationToken,
} from '../controllers/authController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.post('/login', login)
router.post('/activate/verify', verifyActivationToken)
router.post('/activate', activateAccount)
router.post('/refresh', refreshToken)
router.post('/logout', authenticate, logout)
router.get('/me', authenticate, me)
router.put('/change-password', authenticate, changePassword)

export default router
