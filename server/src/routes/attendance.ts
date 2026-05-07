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
  getOffsetBalancesReport,
  getOffsetCreditsReport,
  reviewOffsetCreditRequest,
  getOffsetUsagesReport,
  submitOffsetUsage,
  reviewOffsetUsageRequest,
  createOffsetAdjustmentRecord,
} from '../controllers/attendanceController'
import { authenticate, employeeSelfService, requireRole } from '../middleware/auth'

const router = Router()

router.use(authenticate)

// Employee self-service
router.get('/my-logs', employeeSelfService, getMyAttendance)
router.post('/clock-in', employeeSelfService, clockIn)
router.post('/clock-out', employeeSelfService, clockOut)
router.post('/requests', employeeSelfService, createAttendanceRequest)
router.get('/my-offset-balance', employeeSelfService, getOffsetBalancesReport)
router.post('/offset-usages', submitOffsetUsage)

// Admin
router.get('/offset-balances', requireRole('admin'), getOffsetBalancesReport)
router.get('/offset-credits', requireRole('admin'), getOffsetCreditsReport)
router.put('/offset-credits/:id', requireRole('admin'), reviewOffsetCreditRequest)
router.get('/offset-usages', requireRole('admin'), getOffsetUsagesReport)
router.put('/offset-usages/:id', requireRole('admin'), reviewOffsetUsageRequest)
router.post('/offset-adjustments', requireRole('admin'), createOffsetAdjustmentRecord)
router.get('/', requireRole('admin'), getAttendanceLogs)
router.post('/', requireRole('admin'), createAttendanceRecord)
router.get('/summary', requireRole('admin'), getAttendanceSummary)
router.get('/requests', requireRole('admin'), getAttendanceRequests)
router.put('/requests/:id', requireRole('admin'), approveAttendanceRequest)

export default router
