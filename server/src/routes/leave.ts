import { Router } from 'express'
import {
  getLeaveTypes,
  getLeaveRequests,
  getMyLeaveRequests,
  getLeaveBalance,
  createLeaveRequest,
  approveLeaveRequest,
  cancelLeaveRequest,
  getLeaveCalendar,
} from '../controllers/leaveController'
import { authenticate, requireRole } from '../middleware/auth'

const router = Router()

router.use(authenticate)

// Both roles
router.get('/types', getLeaveTypes)
router.get('/calendar', getLeaveCalendar)

// Employee self-service
router.get('/my-requests', getMyLeaveRequests)
router.get('/balance/:employeeId?', getLeaveBalance)
router.post('/requests', createLeaveRequest)
router.put('/requests/:id/cancel', cancelLeaveRequest)

// Admin/HR
router.get('/requests', requireRole('admin', 'hr_admin'), getLeaveRequests)
router.put('/requests/:id/review', requireRole('admin', 'hr_admin'), approveLeaveRequest)

export default router
