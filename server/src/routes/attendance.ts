import { Router } from 'express'
import {
  getAttendanceLogs,
  getMyAttendance,
  clockIn,
  clockOut,
  createAttendanceRecord,
  getAttendanceSummary,
  getAttendanceRequests,
  createAttendanceRequest,
  approveAttendanceRequest,
} from '../controllers/attendanceController'
import { authenticate, requireRole } from '../middleware/auth'

const router = Router()

router.use(authenticate)

// Employee self-service
router.get('/my-logs', getMyAttendance)
router.post('/clock-in', clockIn)
router.post('/clock-out', clockOut)
router.post('/requests', createAttendanceRequest)

// Admin
router.get('/', requireRole('admin', 'hr_admin', 'finance_admin'), getAttendanceLogs)
router.post('/', requireRole('admin', 'hr_admin'), createAttendanceRecord)
router.get('/summary', requireRole('admin', 'hr_admin', 'finance_admin'), getAttendanceSummary)
router.get('/requests', requireRole('admin', 'hr_admin'), getAttendanceRequests)
router.put('/requests/:id', requireRole('admin', 'hr_admin'), approveAttendanceRequest)

export default router
