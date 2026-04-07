import pool from '../utils/db'

export interface AttendanceRow {
  id: string
  employee_id: string
  date: Date
  time_in?: string
  time_out?: string
  hours_worked: number
  overtime_hours: number
  late_minutes: number
  undertime_minutes: number
  status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave' | 'holiday'
  notes?: string
  created_at: Date
  updated_at: Date
}

export class AttendanceModel {
  static async findAll(params: {
    page: number
    limit: number
    employeeId?: string
    startDate?: string
    endDate?: string
    status?: string
  }) {
    const offset = (params.page - 1) * params.limit
    const conditions: string[] = []
    const values: (string | number | Date)[] = []
    let idx = 1

    if (params.employeeId) {
      conditions.push(`a.employee_id = $${idx++}`)
      values.push(params.employeeId)
    }
    if (params.startDate) {
      conditions.push(`a.date >= $${idx++}`)
      values.push(params.startDate)
    }
    if (params.endDate) {
      conditions.push(`a.date <= $${idx++}`)
      values.push(params.endDate)
    }
    if (params.status) {
      conditions.push(`a.status = $${idx++}`)
      values.push(params.status)
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    const [count, data] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM attendance a ${where}`, values),
      pool.query(
        `SELECT a.*, e.first_name, e.last_name, e.employee_number
         FROM attendance a
         JOIN employees e ON a.employee_id = e.id
         ${where}
         ORDER BY a.date DESC
         LIMIT $${idx} OFFSET $${idx + 1}`,
        [...values, params.limit, offset]
      ),
    ])

    return {
      data: data.rows as AttendanceRow[],
      total: parseInt(count.rows[0].count, 10),
    }
  }

  static async findByEmployeeAndDate(employeeId: string, date: string) {
    const result = await pool.query(
      'SELECT * FROM attendance WHERE employee_id = $1 AND date = $2',
      [employeeId, date]
    )
    return result.rows[0] as AttendanceRow | undefined
  }

  static async clockIn(employeeId: string) {
    const now = new Date()
    const date = now.toISOString().split('T')[0]
    const time = now.toTimeString().slice(0, 5)

    // Check for existing record
    const existing = await this.findByEmployeeAndDate(employeeId, date)
    if (existing) {
      throw new Error('Already clocked in today')
    }

    const result = await pool.query(
      `INSERT INTO attendance (employee_id, date, time_in, status, hours_worked, overtime_hours, late_minutes, undertime_minutes)
       VALUES ($1, $2, $3, 'present', 0, 0, 0, 0) RETURNING *`,
      [employeeId, date, time]
    )
    return result.rows[0] as AttendanceRow
  }

  static async clockOut(employeeId: string) {
    const now = new Date()
    const date = now.toISOString().split('T')[0]
    const timeOut = now.toTimeString().slice(0, 5)

    const record = await this.findByEmployeeAndDate(employeeId, date)
    if (!record || !record.time_in) {
      throw new Error('No clock-in record found for today')
    }

    // Compute hours worked
    const [inH, inM] = record.time_in.split(':').map(Number)
    const [outH, outM] = timeOut.split(':').map(Number)
    const hoursWorked = ((outH * 60 + outM) - (inH * 60 + inM)) / 60

    const result = await pool.query(
      `UPDATE attendance SET time_out = $1, hours_worked = $2, updated_at = NOW()
       WHERE employee_id = $3 AND date = $4 RETURNING *`,
      [timeOut, Math.max(0, hoursWorked - 1), employeeId, date] // -1 for 1h break
    )
    return result.rows[0] as AttendanceRow
  }
}
