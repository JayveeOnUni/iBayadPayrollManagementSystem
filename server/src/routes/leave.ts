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
import { authenticate, employeeSelfService, requireRole } from '../middleware/auth'

const router = Router()

router.use(authenticate)

// Both roles
router.get('/types', getLeaveTypes)
router.get('/calendar', getLeaveCalendar)

// Employee self-service
router.get('/my-requests', employeeSelfService, getMyLeaveRequests)
router.get('/balance/:employeeId?', getLeaveBalance)
router.post('/requests', createLeaveRequest)
router.put('/requests/:id/cancel', employeeSelfService, cancelLeaveRequest)

// Admin/HR
router.get('/requests', requireRole('admin'), getLeaveRequests)
router.put('/requests/:id/review', requireRole('admin'), approveLeaveRequest)

export default router
