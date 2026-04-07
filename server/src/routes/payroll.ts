import { Router } from 'express'
import {
  getPayrollPeriods,
  getPayrollPeriodById,
  createPayrollPeriod,
  getPayrollRecords,
  getMyPayrollRecords,
  processPayroll,
  approvePayroll,
  computeEmployeeTax,
} from '../controllers/payrollController'
import { authenticate, requireRole } from '../middleware/auth'

const router = Router()

router.use(authenticate)

// Employee
router.get('/my-records', getMyPayrollRecords)
router.get('/compute-tax', computeEmployeeTax)

// Admin/Finance
router.get('/periods', requireRole('admin', 'hr_admin', 'finance_admin'), getPayrollPeriods)
router.post('/periods', requireRole('admin', 'hr_admin', 'finance_admin'), createPayrollPeriod)
router.get('/periods/:id', requireRole('admin', 'hr_admin', 'finance_admin'), getPayrollPeriodById)
router.get('/records', requireRole('admin', 'hr_admin', 'finance_admin'), getPayrollRecords)
router.post('/process', requireRole('admin', 'finance_admin'), processPayroll)
router.post('/periods/:id/approve', requireRole('admin', 'finance_admin'), approvePayroll)

export default router
