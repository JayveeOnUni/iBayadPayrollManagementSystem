import pool from '../utils/db'

export interface LeaveApplicationRow {
  id: string
  employee_id: string
  leave_type: string
  start_date: Date
  end_date: Date
  total_days: number
  reason: string
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  approved_by?: string
  approved_at?: Date
  rejection_reason?: string
  created_at: Date
  updated_at: Date
}

export interface LeaveBalanceRow {
  id: string
  employee_id: string
  leave_type: string
  allocated: number
  used: number
  remaining: number
  year: number
}

export class LeaveModel {
  static async findAll(params: {
    page: number
    limit: number
    employeeId?: string
    status?: string
    leaveType?: string
    year?: number
  }) {
    const offset = (params.page - 1) * params.limit
    const conditions: string[] = []
    const values: (string | number)[] = []
    let idx = 1

    if (params.employeeId) {
      conditions.push(`la.employee_id = $${idx++}`)
      values.push(params.employeeId)
    }
    if (params.status) {
      conditions.push(`la.status = $${idx++}`)
      values.push(params.status)
    }
    if (params.leaveType) {
      conditions.push(`la.leave_type = $${idx++}`)
      values.push(params.leaveType)
    }
    if (params.year) {
      conditions.push(`EXTRACT(YEAR FROM la.start_date) = $${idx++}`)
      values.push(params.year)
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    const [count, data] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM leave_applications la ${where}`, values),
      pool.query(
        `SELECT la.*, e.first_name, e.last_name, e.employee_number
         FROM leave_applications la
         JOIN employees e ON la.employee_id = e.id
         ${where}
         ORDER BY la.created_at DESC
         LIMIT $${idx} OFFSET $${idx + 1}`,
        [...values, params.limit, offset]
      ),
    ])

    return {
      data: data.rows as LeaveApplicationRow[],
      total: parseInt(count.rows[0].count, 10),
    }
  }

  static async findById(id: string) {
    const result = await pool.query(
      `SELECT la.*, e.first_name, e.last_name, e.employee_number
       FROM leave_applications la
       JOIN employees e ON la.employee_id = e.id
       WHERE la.id = $1`,
      [id]
    )
    return result.rows[0] as LeaveApplicationRow | undefined
  }

  static async create(data: {
    employeeId: string
    leaveType: string
    startDate: string
    endDate: string
    totalDays: number
    reason: string
  }) {
    const result = await pool.query(
      `INSERT INTO leave_applications
        (employee_id, leave_type, start_date, end_date, total_days, reason, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending') RETURNING *`,
      [data.employeeId, data.leaveType, data.startDate, data.endDate, data.totalDays, data.reason]
    )
    return result.rows[0] as LeaveApplicationRow
  }

  static async updateStatus(
    id: string,
    status: 'approved' | 'rejected' | 'cancelled',
    reviewedBy?: string,
    rejectionReason?: string
  ) {
    const result = await pool.query(
      `UPDATE leave_applications
       SET status = $2, approved_by = $3, approved_at = NOW(), rejection_reason = $4, updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id, status, reviewedBy ?? null, rejectionReason ?? null]
    )
    return result.rows[0] as LeaveApplicationRow
  }

  static async getBalances(employeeId: string, year: number) {
    const result = await pool.query(
      `SELECT * FROM leave_balances WHERE employee_id = $1 AND year = $2`,
      [employeeId, year]
    )
    return result.rows as LeaveBalanceRow[]
  }

  static async deductBalance(employeeId: string, leaveType: string, days: number, year: number) {
    await pool.query(
      `UPDATE leave_balances
       SET used = used + $3, remaining = remaining - $3, updated_at = NOW()
       WHERE employee_id = $1 AND leave_type = $2 AND year = $4`,
      [employeeId, leaveType, days, year]
    )
  }
}
