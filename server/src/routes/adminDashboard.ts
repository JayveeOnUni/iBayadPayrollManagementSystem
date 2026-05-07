import { Router } from 'express'
import { getAdminDashboard } from '../controllers/adminDashboardController'
import { authenticate, requireRole } from '../middleware/auth'

const router = Router()

router.use(authenticate)
router.use(requireRole('admin'))

router.get('/', getAdminDashboard)

export default router
