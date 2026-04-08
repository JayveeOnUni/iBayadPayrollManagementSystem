import { Request, Response } from 'express'
import pool from '../utils/db'
import { asyncHandler, createError } from '../middleware/errorHandler'

export const getLeaveTypes = asyncHandler(async (_req: Request, res: Response) => {
  const result = await pool.query(`SELECT * FROM leave_types WHERE is_active = true ORDER BY name`)
  res.json({ success: true, data: result.rows })
})

export const getLeaveRequests = asyncHandler(async (req: Request, res: Response) => {
  const { status, employeeId, startDate, endDate } = req.query
  const conditions: string[] = []
  const params: unknown[] = []
  let i = 1

  if (status) { conditions.push(`lr.status = $${i++}`); params.push(status) }
  if (employeeId) { conditions.push(`lr.employee_id = $${i++}`); params.push(employeeId) }
  if (startDate) { conditions.push(`lr.start_date >= $${i++}`); params.push(startDate) }
  if (endDate) { conditions.push(`lr.end_date <= $${i++}`); params.push(endDate) }

  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''

  const result = await pool.query(
    `SELECT lr.*, e.first_name, e.last_name, e.employee_number, lt.name AS leave_type_name
     FROM leave_requests lr
     JOIN employees e ON lr.employee_id = e.id
     JOIN leave_types lt ON lr.leave_type_id = lt.id
     ${where}
     ORDER BY lr.created_at DESC`,
    params
  )
  res.json({ success: true, data: result.rows })
})

export const getMyLeaveRequests = asyncHandler(async (req: Request, res: Response) => {
  const result = await pool.query(
    `SELECT lr.*, lt.name AS leave_type_name
     FROM leave_requests lr
     JOIN leave_types lt ON lr.leave_type_id = lt.id
     WHERE lr.employee_id = $1
     ORDER BY lr.created_at DESC`,
    [req.user!.employeeId]
  )
  res.json({ success: true, data: result.rows })
})

export const getLeaveBalance = asyncHandler(async (req: Request, res: Response) => {
  const employeeId = req.params.employeeId ?? req.user!.employeeId
  const year = new Date().getFullYear()

  const result = await pool.query(
    `SELECT lt.id, lt.name, lt.days_per_year AS allowance,
            COALESCE(SUM(CASE WHEN lr.status = 'approved' THEN lr.total_days ELSE 0 END), 0) AS taken,
            lt.days_per_year - COALESCE(SUM(CASE WHEN lr.status = 'approved' THEN lr.total_days ELSE 0 END), 0) AS balance
     FROM leave_types lt
     LEFT JOIN leave_requests lr ON lr.leave_type_id = lt.id
       AND lr.employee_id = $1
       AND EXTRACT(YEAR FROM lr.start_date) = $2
     WHERE lt.is_active = true
     GROUP BY lt.id, lt.name, lt.days_per_year
     ORDER BY lt.name`,
    [employeeId, year]
  )
  res.json({ success: true, data: result.rows })
})

export const createLeaveRequest = asyncHandler(async (req: Request, res: Response) => {
  const { employeeId: requestedEmployeeId, leaveTypeId, startDate, endDate, reason, isHalfDay } = req.body
  if (!leaveTypeId || !startDate || !endDate || !reason) {
    throw createError('leaveTypeId, startDate, endDate, and reason are required', 400)
  }
  const canRequestForOthers = ['super_admin', 'admin', 'hr_admin'].includes(req.user!.role)
  const employeeId = canRequestForOthers && requestedEmployeeId ? requestedEmployeeId : req.user!.employeeId
  if (!employeeId) throw createError('No employee profile is linked to this user', 400)

  // Compute total days (simplified — excludes weekends)
  const start = new Date(startDate)
  const end = new Date(endDate)
  let totalDays = 0
  const cur = new Date(start)
  while (cur <= end) {
    const day = cur.getDay()
    if (day !== 0 && day !== 6) totalDays++
    cur.setDate(cur.getDate() + 1)
  }
  if (isHalfDay) totalDays = 0.5

  // Check leave balance
  const year = start.getFullYear()
  const balance = await pool.query(
    `SELECT lt.days_per_year -
       COALESCE((SELECT SUM(total_days) FROM leave_requests
                 WHERE employee_id = $1 AND leave_type_id = $2
                   AND status = 'approved'
                   AND EXTRACT(YEAR FROM start_date) = $3), 0) AS remaining
     FROM leave_types lt WHERE lt.id = $2`,
    [employeeId, leaveTypeId, year]
  )

  if (!balance.rows[0] || Number(balance.rows[0].remaining) < totalDays) {
    throw createError('Insufficient leave balance', 400)
  }

  const result = await pool.query(
    `INSERT INTO leave_requests (employee_id, leave_type_id, start_date, end_date, total_days, reason, is_half_day, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending') RETURNING *`,
    [employeeId, leaveTypeId, startDate, endDate, totalDays, reason, isHalfDay ?? false]
  )
  res.status(201).json({ success: true, data: result.rows[0] })
})

export const approveLeaveRequest = asyncHandler(async (req: Request, res: Response) => {
  const { action, remarks } = req.body
  if (!action) throw createError('action is required', 400)

  const status = action === 'approve' ? 'approved' : 'rejected'
  const result = await pool.query(
    `UPDATE leave_requests
     SET status = $1, reviewed_by = $2, reviewed_at = NOW(), review_remarks = $3
     WHERE id = $4 AND status = 'pending'
     RETURNING *`,
    [status, req.user!.userId, remarks, req.params.id]
  )
  if (!result.rows[0]) throw createError('Request not found or already reviewed', 404)
  res.json({ success: true, data: result.rows[0] })
})

export const cancelLeaveRequest = asyncHandler(async (req: Request, res: Response) => {
  const result = await pool.query(
    `UPDATE leave_requests SET status = 'cancelled'
     WHERE id = $1 AND employee_id = $2 AND status = 'pending'
     RETURNING *`,
    [req.params.id, req.user!.employeeId]
  )
  if (!result.rows[0]) throw createError('Request not found or cannot be cancelled', 404)
  res.json({ success: true, data: result.rows[0] })
})

export const getLeaveCalendar = asyncHandler(async (req: Request, res: Response) => {
  const { year, month } = req.query
  const conditions = [`lr.status IN ('pending', 'approved')`]
  const params: unknown[] = []
  let i = 1

  if (year && month) {
    conditions.push(`EXTRACT(YEAR FROM lr.start_date) = $${i++}`)
    conditions.push(`EXTRACT(MONTH FROM lr.start_date) = $${i++}`)
    params.push(year, month)
  }

  const result = await pool.query(
    `SELECT lr.*, e.first_name, e.last_name, lt.name AS leave_type_name
     FROM leave_requests lr
     JOIN employees e ON lr.employee_id = e.id
     JOIN leave_types lt ON lr.leave_type_id = lt.id
     WHERE ${conditions.join(' AND ')}
     ORDER BY lr.start_date`,
    params
  )
  res.json({ success: true, data: result.rows })
})
