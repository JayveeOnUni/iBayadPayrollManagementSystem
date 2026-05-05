import { Request, Response } from 'express'
import pool from '../utils/db'
import { asyncHandler, createError } from '../middleware/errorHandler'

interface ShiftSchedule {
  start_time: string
  end_time: string
  break_minutes: number
  work_hours: string | number
}

function localDateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function scheduledTime(date: Date, time: string): Date {
  const [hours, minutes, seconds = '0'] = time.split(':')
  const scheduled = new Date(date)
  scheduled.setHours(Number(hours), Number(minutes), Number(seconds), 0)
  return scheduled
}

async function getEmployeeShift(employeeId: string): Promise<ShiftSchedule> {
  const result = await pool.query(
    `SELECT ws.start_time, ws.end_time, ws.break_minutes, ws.work_hours
     FROM employees e
     LEFT JOIN work_shifts ws ON ws.id = e.shift_id AND ws.is_active = true
     WHERE e.id = $1`,
    [employeeId]
  )

  if (!result.rows[0]) throw createError('Employee profile not found', 404)

  return {
    start_time: result.rows[0].start_time ?? '08:00:00',
    end_time: result.rows[0].end_time ?? '17:00:00',
    break_minutes: Number(result.rows[0].break_minutes ?? 60),
    work_hours: result.rows[0].work_hours ?? 8,
  }
}

export const getAttendanceLogs = asyncHandler(async (req: Request, res: Response) => {
  const { employeeId, startDate, endDate, status } = req.query
  const conditions: string[] = []
  const params: unknown[] = []
  let i = 1

  if (employeeId) { conditions.push(`a.employee_id = $${i++}`); params.push(employeeId) }
  if (startDate) { conditions.push(`a.date >= $${i++}`); params.push(startDate) }
  if (endDate) { conditions.push(`a.date <= $${i++}`); params.push(endDate) }
  if (status) { conditions.push(`a.status = $${i++}`); params.push(status) }

  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''

  const result = await pool.query(
    `SELECT a.*, e.first_name, e.last_name, e.employee_number
     FROM attendance a
     JOIN employees e ON a.employee_id = e.id
     ${where}
     ORDER BY a.date DESC, e.last_name`,
    params
  )
  res.json({ success: true, data: result.rows })
})

export const getMyAttendance = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query
  const conditions = ['a.employee_id = $1']
  const params: unknown[] = [req.user!.employeeId]
  let i = 2

  if (startDate) { conditions.push(`a.date >= $${i++}`); params.push(startDate) }
  if (endDate) { conditions.push(`a.date <= $${i++}`); params.push(endDate) }

  const result = await pool.query(
    `SELECT * FROM attendance a WHERE ${conditions.join(' AND ')} ORDER BY a.date DESC`,
    params
  )
  res.json({ success: true, data: result.rows })
})

export const clockIn = asyncHandler(async (req: Request, res: Response) => {
  const now = new Date()
  const today = localDateString(now)

  // Check if already clocked in today
  const existing = await pool.query(
    `SELECT id, time_in FROM attendance WHERE employee_id = $1 AND date = $2`,
    [req.user!.employeeId, today]
  )

  if (existing.rows[0]?.time_in) {
    throw createError('Already clocked in today', 400)
  }

  const shift = await getEmployeeShift(req.user!.employeeId!)
  const scheduleStart = scheduledTime(now, shift.start_time)
  const lateMins = now > scheduleStart ? Math.floor((now.getTime() - scheduleStart.getTime()) / 60000) : 0

  const result = await pool.query(
    `INSERT INTO attendance (employee_id, date, time_in, late_minutes, status)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (employee_id, date) DO UPDATE SET time_in = $3, late_minutes = $4
     RETURNING *`,
    [req.user!.employeeId, today, now.toISOString(), lateMins, lateMins > 0 ? 'late' : 'present']
  )
  res.json({ success: true, data: result.rows[0] })
})

export const clockOut = asyncHandler(async (req: Request, res: Response) => {
  const now = new Date()
  const today = localDateString(now)

  const existing = await pool.query(
    `SELECT * FROM attendance WHERE employee_id = $1 AND date = $2`,
    [req.user!.employeeId, today]
  )

  if (!existing.rows[0]) throw createError('No clock-in record found for today', 400)
  if (existing.rows[0].time_out) throw createError('Already clocked out today', 400)

  const timeIn = new Date(existing.rows[0].time_in)
  const shift = await getEmployeeShift(req.user!.employeeId!)
  const scheduleStart = scheduledTime(now, shift.start_time)
  const scheduleEnd = scheduledTime(now, shift.end_time)
  if (scheduleEnd <= scheduleStart) scheduleEnd.setDate(scheduleEnd.getDate() + 1)

  const elapsedMins = Math.floor((now.getTime() - timeIn.getTime()) / 60000)
  const totalWorkedMins = Math.max(0, elapsedMins - shift.break_minutes)
  const overtimeHours = now > scheduleEnd ? (now.getTime() - scheduleEnd.getTime()) / 3600000 : 0

  const result = await pool.query(
    `UPDATE attendance
     SET time_out = $1, total_worked_minutes = $2, overtime_hours = $3
     WHERE employee_id = $4 AND date = $5
     RETURNING *`,
    [now.toISOString(), totalWorkedMins, Math.round(overtimeHours * 100) / 100, req.user!.employeeId, today]
  )
  res.json({ success: true, data: result.rows[0] })
})

export const createAttendanceRecord = asyncHandler(async (req: Request, res: Response) => {
  const { employeeId, date, timeIn, timeOut, status, remarks } = req.body
  if (!employeeId || !date) throw createError('employeeId and date are required', 400)

  const result = await pool.query(
    `INSERT INTO attendance (employee_id, date, time_in, time_out, status, remarks, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (employee_id, date) DO UPDATE
     SET time_in = $3, time_out = $4, status = $5, remarks = $6, updated_at = NOW()
     RETURNING *`,
    [employeeId, date, timeIn, timeOut, status ?? 'present', remarks, req.user!.userId]
  )
  res.status(201).json({ success: true, data: result.rows[0] })
})

export const getAttendanceSummary = asyncHandler(async (req: Request, res: Response) => {
  const { employeeId, year, month } = req.query
  if (!employeeId || !year || !month) throw createError('employeeId, year, and month are required', 400)

  const result = await pool.query(
    `SELECT
       COUNT(*) FILTER (WHERE status = 'present') AS present_days,
       COUNT(*) FILTER (WHERE status = 'absent') AS absent_days,
       COUNT(*) FILTER (WHERE status = 'late') AS late_days,
       COUNT(*) FILTER (WHERE status = 'half_day') AS half_days,
       COALESCE(SUM(late_minutes), 0) AS total_late_minutes,
       COALESCE(SUM(overtime_hours), 0) AS total_overtime_hours,
       COALESCE(SUM(total_worked_minutes), 0) AS total_worked_minutes
     FROM attendance
     WHERE employee_id = $1
       AND EXTRACT(YEAR FROM date) = $2
       AND EXTRACT(MONTH FROM date) = $3`,
    [employeeId, year, month]
  )
  res.json({ success: true, data: result.rows[0] })
})

export const getAttendanceRequests = asyncHandler(async (req: Request, res: Response) => {
  const params: unknown[] = []
  const where = req.query.status ? 'WHERE ar.status = $1' : ''
  if (req.query.status) params.push(req.query.status)

  const result = await pool.query(
    `SELECT ar.*, e.first_name, e.last_name, e.employee_number
     FROM attendance_requests ar
     JOIN employees e ON ar.employee_id = e.id
     ${where}
     ORDER BY ar.created_at DESC`,
    params
  )
  res.json({ success: true, data: result.rows })
})

export const createAttendanceRequest = asyncHandler(async (req: Request, res: Response) => {
  const { date, requestedStatus, requestedTimeIn, requestedTimeOut, reason } = req.body
  if (!req.user!.employeeId) throw createError('Only employee-linked accounts can submit attendance requests', 400)
  if (!date || !reason) throw createError('date and reason are required', 400)

  const result = await pool.query(
    `INSERT INTO attendance_requests (
       employee_id, date, requested_status, requested_time_in, requested_time_out, reason, status
     ) VALUES ($1, $2, $3, $4, $5, $6, 'pending')
     RETURNING *`,
    [
      req.user!.employeeId,
      date,
      requestedStatus ?? 'present',
      requestedTimeIn || null,
      requestedTimeOut || null,
      reason,
    ]
  )

  res.status(201).json({ success: true, data: result.rows[0] })
})

export const approveAttendanceRequest = asyncHandler(async (req: Request, res: Response) => {
  const { action, remarks } = req.body // action: 'approve' | 'reject'
  if (!action) throw createError('action is required', 400)
  if (action !== 'approve' && action !== 'reject') throw createError('action must be approve or reject', 400)

  const status = action === 'approve' ? 'approved' : 'rejected'
  const result = await pool.query(
    `UPDATE attendance_requests
     SET status = $1, reviewed_by = $2, reviewed_at = NOW(), review_remarks = $3
     WHERE id = $4 RETURNING *`,
    [status, req.user!.userId, remarks, req.params.id]
  )
  if (!result.rows[0]) throw createError('Request not found', 404)

  // If approved, update the actual attendance record
  if (action === 'approve') {
    const request = result.rows[0]
    await pool.query(
      `INSERT INTO attendance (employee_id, date, status, time_in, time_out, created_by)
       VALUES ($4, $5, $1, $2, $3, $6)
       ON CONFLICT (employee_id, date) DO UPDATE
       SET status = EXCLUDED.status,
           time_in = COALESCE(EXCLUDED.time_in, attendance.time_in),
           time_out = COALESCE(EXCLUDED.time_out, attendance.time_out),
           updated_at = NOW()`,
      [request.requested_status, request.requested_time_in, request.requested_time_out,
       request.employee_id, request.date, req.user!.userId]
    )
  }

  res.json({ success: true, data: result.rows[0] })
})
