import { Request, Response } from 'express'
import pool from '../utils/db'
import { asyncHandler, createError } from '../middleware/errorHandler'
import { processBatchPayroll } from '../services/payrollService'
import { computeDeductions } from '../utils/taxComputation'

export const getPayrollPeriods = asyncHandler(async (_req: Request, res: Response) => {
  const result = await pool.query(
    `SELECT * FROM payroll_periods ORDER BY start_date DESC LIMIT 24`
  )
  res.json({ success: true, data: result.rows })
})

export const getPayrollPeriodById = asyncHandler(async (req: Request, res: Response) => {
  const result = await pool.query(
    `SELECT pp.*,
            COUNT(pr.id) AS record_count,
            COALESCE(SUM(pr.gross_pay), 0) AS total_gross,
            COALESCE(SUM(pr.net_pay), 0) AS total_net
     FROM payroll_periods pp
     LEFT JOIN payroll_records pr ON pr.payroll_period_id = pp.id
     WHERE pp.id = $1
     GROUP BY pp.id`,
    [req.params.id]
  )
  if (!result.rows[0]) throw createError('Payroll period not found', 404)
  res.json({ success: true, data: result.rows[0] })
})

export const createPayrollPeriod = asyncHandler(async (req: Request, res: Response) => {
  const { name, startDate, endDate, payDate, payFrequency } = req.body
  if (!name || !startDate || !endDate || !payDate) {
    throw createError('name, startDate, endDate, and payDate are required', 400)
  }
  const normalizedFrequency = payFrequency === 'semi_monthly' ? 'semi-monthly' : payFrequency ?? 'semi-monthly'
  if (!['weekly', 'semi-monthly', 'monthly'].includes(normalizedFrequency)) {
    throw createError('payFrequency must be weekly, semi-monthly, or monthly', 400)
  }

  const result = await pool.query(
    `INSERT INTO payroll_periods (name, start_date, end_date, pay_date, pay_frequency, created_by)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [name, startDate, endDate, payDate, normalizedFrequency, req.user!.userId]
  )
  res.status(201).json({ success: true, data: result.rows[0] })
})

export const getPayrollRecords = asyncHandler(async (req: Request, res: Response) => {
  const { periodId, employeeId } = req.query
  const conditions: string[] = []
  const params: unknown[] = []
  let i = 1

  if (periodId) { conditions.push(`pr.payroll_period_id = $${i++}`); params.push(periodId) }
  if (employeeId) { conditions.push(`pr.employee_id = $${i++}`); params.push(employeeId) }

  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''

  const result = await pool.query(
    `SELECT pr.*, e.first_name, e.last_name, e.employee_number, d.name AS department
     FROM payroll_records pr
     JOIN employees e ON pr.employee_id = e.id
     LEFT JOIN departments d ON e.department_id = d.id
     ${where}
     ORDER BY e.last_name, e.first_name`,
    params
  )
  res.json({ success: true, data: result.rows })
})

export const downloadPayslip = asyncHandler(async (req: Request, res: Response) => {
  const params: unknown[] = [req.params.id]
  const employeeFilter = req.user!.role === 'employee' ? 'AND pr.employee_id = $2' : ''
  if (employeeFilter) params.push(req.user!.employeeId)

  const result = await pool.query(
    `SELECT pr.*, pp.name AS period_name, pp.start_date, pp.end_date, pp.pay_date,
            e.first_name, e.last_name, e.employee_number
     FROM payroll_records pr
     JOIN payroll_periods pp ON pp.id = pr.payroll_period_id
     JOIN employees e ON e.id = pr.employee_id
     WHERE pr.id = $1 ${employeeFilter}`,
    params
  )

  const record = result.rows[0]
  if (!record) throw createError('Payslip not found', 404)

  const lines = [
    'iBayad Payslip',
    `Employee: ${record.first_name} ${record.last_name} (${record.employee_number})`,
    `Period: ${record.period_name}`,
    `Pay date: ${record.pay_date}`,
    '',
    `Gross pay: ${record.gross_pay}`,
    `Total deductions: ${record.total_deductions}`,
    `Net pay: ${record.net_pay}`,
  ]

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Content-Disposition', `attachment; filename="payslip-${record.employee_number}-${record.pay_date}.txt"`)
  res.send(lines.join('\n'))
})

export const getMyPayrollRecords = asyncHandler(async (req: Request, res: Response) => {
  const result = await pool.query(
    `SELECT pr.*, pp.name AS period_name, pp.pay_date
     FROM payroll_records pr
     JOIN payroll_periods pp ON pr.payroll_period_id = pp.id
     WHERE pr.employee_id = $1
     ORDER BY pp.pay_date DESC`,
    [req.user!.employeeId]
  )
  res.json({ success: true, data: result.rows })
})

export const processPayroll = asyncHandler(async (req: Request, res: Response) => {
  const { payrollPeriodId } = req.body
  if (!payrollPeriodId) throw createError('payrollPeriodId is required', 400)

  const { processed, errors } = await processBatchPayroll(payrollPeriodId)

  // Update period status to 'processing'
  await pool.query(
    `UPDATE payroll_periods SET status = 'processing', updated_at = NOW() WHERE id = $1`,
    [payrollPeriodId]
  )
  await pool.query(
    `UPDATE payroll_records SET status = 'processing', updated_at = NOW() WHERE payroll_period_id = $1`,
    [payrollPeriodId]
  )

  res.json({
    success: true,
    data: { processed, errors, message: `Processed ${processed} payroll records` },
  })
})

export const approvePayroll = asyncHandler(async (req: Request, res: Response) => {
  await pool.query(
    `UPDATE payroll_periods SET status = 'approved', approved_by = $1, approved_at = NOW() WHERE id = $2`,
    [req.user!.userId, req.params.id]
  )
  await pool.query(
    `UPDATE payroll_records SET status = 'approved' WHERE payroll_period_id = $1`,
    [req.params.id]
  )
  res.json({ success: true, message: 'Payroll approved' })
})

export const releasePayroll = asyncHandler(async (req: Request, res: Response) => {
  await pool.query(
    `UPDATE payroll_periods SET status = 'released', updated_at = NOW() WHERE id = $1`,
    [req.params.id]
  )
  await pool.query(
    `UPDATE payroll_records SET status = 'released' WHERE payroll_period_id = $1`,
    [req.params.id]
  )
  res.json({ success: true, message: 'Payroll released' })
})

export const computeEmployeeTax = asyncHandler(async (req: Request, res: Response) => {
  const { monthlyBasicSalary } = req.query
  if (!monthlyBasicSalary) throw createError('monthlyBasicSalary is required', 400)

  const salary = Number(monthlyBasicSalary)
  if (isNaN(salary) || salary <= 0) throw createError('Invalid salary amount', 400)

  const deductions = computeDeductions(salary)
  res.json({ success: true, data: deductions })
})
