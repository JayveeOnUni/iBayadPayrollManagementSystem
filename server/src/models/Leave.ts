import pool from '../utils/db'

export type LeaveRequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'

export interface LeaveRequestRow {
  id: string
  employee_id: string
  leave_type_id: string
  start_date: Date
  end_date: Date
  total_days: number
  reason: string
  is_half_day: boolean
  supporting_doc?: string
  status: LeaveRequestStatus
  reviewed_by?: string
  reviewed_at?: Date
  review_remarks?: string
  created_at: Date
  updated_at: Date
}

export interface LeaveBalanceRow {
  id: string
  name: string
  allowance: number
  taken: number
  balance: number
}

export class LeaveModel {
  static async findAll(params: {
    page: number
    limit: number
    employeeId?: string
    status?: LeaveRequestStatus
    leaveTypeId?: string
    year?: number
  }) {
    const offset = (params.page - 1) * params.limit
    const conditions: string[] = []
    const values: (string | number)[] = []
    let idx = 1

    if (params.employeeId) {
      conditions.push(`lr.employee_id = $${idx++}`)
      values.push(params.employeeId)
    }
    if (params.status) {
      conditions.push(`lr.status = $${idx++}`)
      values.push(params.status)
    }
    if (params.leaveTypeId) {
      conditions.push(`lr.leave_type_id = $${idx++}`)
      values.push(params.leaveTypeId)
    }
    if (params.year) {
      conditions.push(`EXTRACT(YEAR FROM lr.start_date) = $${idx++}`)
      values.push(params.year)
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    const [count, data] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM leave_requests lr ${where}`, values),
      pool.query(
        `SELECT lr.*, e.first_name, e.last_name, e.employee_number, lt.name AS leave_type_name
         FROM leave_requests lr
         JOIN employees e ON lr.employee_id = e.id
         JOIN leave_types lt ON lr.leave_type_id = lt.id
         ${where}
         ORDER BY lr.created_at DESC
         LIMIT $${idx} OFFSET $${idx + 1}`,
        [...values, params.limit, offset]
      ),
    ])

    return {
      data: data.rows as LeaveRequestRow[],
      total: parseInt(count.rows[0].count, 10),
    }
  }

  static async findById(id: string) {
    const result = await pool.query(
      `SELECT lr.*, e.first_name, e.last_name, e.employee_number, lt.name AS leave_type_name
       FROM leave_requests lr
       JOIN employees e ON lr.employee_id = e.id
       JOIN leave_types lt ON lr.leave_type_id = lt.id
       WHERE lr.id = $1`,
      [id]
    )
    return result.rows[0] as LeaveRequestRow | undefined
  }

  static async create(data: {
    employeeId: string
    leaveTypeId: string
    startDate: string
    endDate: string
    totalDays: number
    reason: string
    isHalfDay?: boolean
  }) {
    const result = await pool.query(
      `INSERT INTO leave_requests
        (employee_id, leave_type_id, start_date, end_date, total_days, reason, is_half_day, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending') RETURNING *`,
      [data.employeeId, data.leaveTypeId, data.startDate, data.endDate, data.totalDays, data.reason, data.isHalfDay ?? false]
    )
    return result.rows[0] as LeaveRequestRow
  }

  static async updateStatus(
    id: string,
    status: Exclude<LeaveRequestStatus, 'pending'>,
    reviewedBy?: string,
    reviewRemarks?: string
  ) {
    const result = await pool.query(
      `UPDATE leave_requests
       SET status = $2, reviewed_by = $3, reviewed_at = NOW(), review_remarks = $4, updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id, status, reviewedBy ?? null, reviewRemarks ?? null]
    )
    return result.rows[0] as LeaveRequestRow | undefined
  }

  static async getBalances(employeeId: string, year: number) {
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
    return result.rows as LeaveBalanceRow[]
  }
}
