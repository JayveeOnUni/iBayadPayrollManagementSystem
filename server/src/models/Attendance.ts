import pool from '../utils/db'

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half_day' | 'holiday' | 'rest_day' | 'on_leave'

export interface AttendanceRow {
  id: string
  employee_id: string
  date: Date
  time_in?: Date
  time_out?: Date
  status: AttendanceStatus
  scheduled_shift_id?: string
  scheduled_start?: Date
  scheduled_end?: Date
  required_work_minutes: number
  actual_rendered_minutes: number
  late_minutes: number
  undertime_minutes: number
  excess_minutes: number
  offset_earned_minutes: number
  offset_used_minutes: number
  overtime_hours: number
  holiday_hours: number
  night_diff_hours: number
  total_worked_minutes: number
  remarks?: string
  created_by?: string
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
    status?: AttendanceStatus
  }) {
    const offset = (params.page - 1) * params.limit
    const conditions: string[] = []
    const values: (string | number)[] = []
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
}
