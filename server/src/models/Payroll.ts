import pool from '../utils/db'

export type PayFrequency = 'weekly' | 'semi-monthly' | 'monthly'
export type PayrollStatus = 'draft' | 'processing' | 'approved' | 'released' | 'cancelled'

export interface PayrollPeriodRow {
  id: string
  name: string
  start_date: Date
  end_date: Date
  pay_date: Date
  pay_frequency: PayFrequency
  status: PayrollStatus
  created_by?: string
  approved_by?: string
  approved_at?: Date
  created_at: Date
  updated_at: Date
}

export interface PayrollRecordRow {
  id: string
  employee_id: string
  payroll_period_id: string
  basic_salary: number
  daily_rate: number
  hourly_rate: number
  regular_pay: number
  overtime_pay: number
  holiday_pay: number
  night_diff_pay: number
  allowances: number
  other_earnings: number
  gross_pay: number
  absence_deduction: number
  late_deduction: number
  sss_employee: number
  phil_health_employee: number
  pag_ibig_employee: number
  withholding_tax: number
  loan_deductions: number
  other_deductions: number
  total_deductions: number
  sss_employer: number
  phil_health_employer: number
  pag_ibig_employer: number
  net_pay: number
  status: PayrollStatus
  created_at: Date
  updated_at: Date
}

export class PayrollPeriodModel {
  static async findAll(params: { page: number; limit: number; status?: PayrollStatus }) {
    const offset = (params.page - 1) * params.limit
    const where = params.status ? `WHERE status = $1` : ''
    const countValues = params.status ? [params.status] : []
    const dataValues = params.status ? [params.status, params.limit, offset] : [params.limit, offset]
    const limitParam = params.status ? 2 : 1
    const offsetParam = params.status ? 3 : 2

    const [count, data] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM payroll_periods ${where}`, countValues),
      pool.query(
        `SELECT * FROM payroll_periods ${where} ORDER BY start_date DESC LIMIT $${limitParam} OFFSET $${offsetParam}`,
        dataValues
      ),
    ])

    return {
      data: data.rows as PayrollPeriodRow[],
      total: parseInt(count.rows[0].count, 10),
    }
  }

  static async findById(id: string) {
    const result = await pool.query('SELECT * FROM payroll_periods WHERE id = $1', [id])
    return result.rows[0] as PayrollPeriodRow | undefined
  }

  static async create(data: {
    name: string
    startDate: string
    endDate: string
    payDate: string
    payFrequency?: PayFrequency
    createdBy?: string
  }) {
    const result = await pool.query(
      `INSERT INTO payroll_periods (name, start_date, end_date, pay_date, pay_frequency, created_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [data.name, data.startDate, data.endDate, data.payDate, data.payFrequency ?? 'semi-monthly', data.createdBy ?? null]
    )
    return result.rows[0] as PayrollPeriodRow
  }

  static async updateStatus(id: string, status: PayrollStatus, approvedBy?: string) {
    const result = await pool.query(
      `UPDATE payroll_periods
       SET status = $2,
           approved_by = COALESCE($3, approved_by),
           approved_at = CASE WHEN $2 = 'approved' THEN NOW() ELSE approved_at END,
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, status, approvedBy ?? null]
    )
    return result.rows[0] as PayrollPeriodRow | undefined
  }
}

export class PayrollRecordModel {
  static async findByPeriod(periodId: string) {
    const result = await pool.query(
      `SELECT pr.*, e.first_name, e.last_name, e.employee_number
       FROM payroll_records pr
       JOIN employees e ON pr.employee_id = e.id
       WHERE pr.payroll_period_id = $1
       ORDER BY e.last_name, e.first_name`,
      [periodId]
    )
    return result.rows as PayrollRecordRow[]
  }

  static async findById(id: string) {
    const result = await pool.query(
      `SELECT pr.*, e.first_name, e.last_name, e.employee_number, e.department_id,
              d.name AS department_name, p.title AS position_title
       FROM payroll_records pr
       JOIN employees e ON pr.employee_id = e.id
       LEFT JOIN departments d ON e.department_id = d.id
       LEFT JOIN positions p ON e.position_id = p.id
       WHERE pr.id = $1`,
      [id]
    )
    return result.rows[0] as PayrollRecordRow | undefined
  }

  static async findByEmployee(employeeId: string) {
    const result = await pool.query(
      `SELECT pr.*, pp.name AS period_name, pp.pay_date
       FROM payroll_records pr
       JOIN payroll_periods pp ON pp.id = pr.payroll_period_id
       WHERE pr.employee_id = $1
       ORDER BY pp.pay_date DESC`,
      [employeeId]
    )
    return result.rows as PayrollRecordRow[]
  }
}
