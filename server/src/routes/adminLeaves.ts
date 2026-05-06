import { Router } from 'express'
import {
  adjustLeaveBalance,
  approveLeaveRequest,
  cancelLeaveRequest,
  getLeavePayrollImpact,
  getLeaveReports,
  getLeaveRequestById,
  getLeaveRequests,
  processCarryOver,
  processCashConversion,
  processYearEnd,
  rejectLeaveRequest,
} from '../controllers/leaveController'
import { authenticate, requireRole } from '../middleware/auth'

const router = Router()

router.use(authenticate)
router.use(requireRole('admin'))

router.get('/requests', getLeaveRequests)
router.get('/requests/:id', getLeaveRequestById)
router.patch('/requests/:id/approve', approveLeaveRequest)
router.patch('/requests/:id/reject', rejectLeaveRequest)
router.patch('/requests/:id/cancel', cancelLeaveRequest)
router.patch('/balances/:employeeId/adjust', adjustLeaveBalance)
router.post('/year-end/process', processYearEnd)
router.post('/carry-over/process', processCarryOver)
router.post('/cash-conversion/process', processCashConversion)
router.get('/reports', getLeaveReports)
router.get('/payroll-impact', getLeavePayrollImpact)

export default router
