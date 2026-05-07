import { Router } from 'express'
import {
  applyPayrollPeriodLeaveAdjustments,
  getPayrollPeriodLeaveImpacts,
} from '../controllers/leaveController'
import {
  getPayrollPeriods,
  getPayrollPeriodById,
  createPayrollPeriod,
  getPayrollRecords,
  getPayrollRecordById,
  getMyPayrollRecords,
  processPayroll,
  approvePayroll,
  releasePayroll,
  downloadPayslip,
  computeEmployeeTax,
} from '../controllers/payrollController'
import { authenticate, employeeSelfService, requireRole } from '../middleware/auth'

const router = Router()

router.use(authenticate)

// Employee
router.get('/my-records', employeeSelfService, getMyPayrollRecords)
router.get('/compute-tax', computeEmployeeTax)

// Admin/Finance
router.get('/periods', requireRole('admin'), getPayrollPeriods)
router.post('/periods', requireRole('admin'), createPayrollPeriod)
router.get('/periods/:id', requireRole('admin'), getPayrollPeriodById)
router.get('/periods/:periodId/leave-impacts', requireRole('admin'), getPayrollPeriodLeaveImpacts)
router.post('/periods/:periodId/apply-leave-adjustments', requireRole('admin'), applyPayrollPeriodLeaveAdjustments)
router.get('/records', requireRole('admin'), getPayrollRecords)
router.get('/records/:id', requireRole('admin'), getPayrollRecordById)
router.get('/records/:id/payslip', downloadPayslip)
router.post('/process', requireRole('admin'), processPayroll)
router.post('/periods/:id/approve', requireRole('admin'), approvePayroll)
router.post('/periods/:id/release', requireRole('admin'), releasePayroll)

export default router
