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
import { authenticate, employeeSelfService, requireRole } from '../middleware/auth'

const router = Router()

router.use(authenticate)

// Employee self-service
router.get('/my-logs', employeeSelfService, getMyAttendance)
router.post('/clock-in', employeeSelfService, clockIn)
router.post('/clock-out', employeeSelfService, clockOut)
router.post('/requests', employeeSelfService, createAttendanceRequest)

// Admin
router.get('/', requireRole('admin', 'hr_admin', 'finance_admin'), getAttendanceLogs)
router.post('/', requireRole('admin', 'hr_admin'), createAttendanceRecord)
router.get('/summary', requireRole('admin', 'hr_admin', 'finance_admin'), getAttendanceSummary)
router.get('/requests', requireRole('admin', 'hr_admin'), getAttendanceRequests)
router.put('/requests/:id', requireRole('admin', 'hr_admin'), approveAttendanceRequest)

export default router
