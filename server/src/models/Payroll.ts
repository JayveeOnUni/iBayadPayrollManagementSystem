import pool from '../utils/db'

export interface PayrollPeriodRow {
  id: string
  name: string
  frequency: 'weekly' | 'semi_monthly' | 'monthly'
  start_date: Date
  end_date: Date
  pay_date: Date
  status: 'draft' | 'processing' | 'approved' | 'paid' | 'cancelled'
  created_at: Date
  updated_at: Date
}

export interface PayrollRecordRow {
  id: string
  payroll_period_id: string
  employee_id: string
  basic_pay: number
  overtime_pay: number
  holiday_pay: number
  night_differential: number
  thirteenth_month_pay: number
  allowances: number
  other_earnings: number
  gross_pay: number
  sss_employee: number
  philhealth_employee: number
  pagibig_employee: number
  withholding_tax: number
  absence_deduction: number
  late_deduction: number
  loan_deductions: number
  other_deductions: number
  total_deductions: number
  net_pay: number
  days_worked: number
  hours_worked: number
  overtime_hours: number
  absent_days: number
  late_days: number
  status: string
  remarks?: string
  processed_by?: string
  processed_at?: Date
  created_at: Date
  updated_at: Date
}

export class PayrollPeriodModel {
  static async findAll(params: { page: number; limit: number; status?: string }) {
    const offset = (params.page - 1) * params.limit
    const where = params.status ? `WHERE status = $3` : ''
    const values: (string | number)[] = params.status
      ? [params.limit, offset, params.status]
      : [params.limit, offset]

    const [count, data] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM payroll_periods ${where}`, params.status ? [params.status] : []),
      pool.query(
        `SELECT * FROM payroll_periods ${where} ORDER BY start_date DESC LIMIT $1 OFFSET $2`,
        values
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

  static async create(data: Partial<PayrollPeriodRow>) {
    const result = await pool.query(
      `INSERT INTO payroll_periods (name, frequency, start_date, end_date, pay_date, status)
       VALUES ($1, $2, $3, $4, $5, 'draft') RETURNING *`,
      [data.name, data.frequency, data.start_date, data.end_date, data.pay_date]
    )
    return result.rows[0] as PayrollPeriodRow
  }

  static async updateStatus(id: string, status: string) {
    const result = await pool.query(
      `UPDATE payroll_periods SET status = $2, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id, status]
    )
    return result.rows[0] as PayrollPeriodRow
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

  static async upsert(data: Partial<PayrollRecordRow>) {
    const result = await pool.query(
      `INSERT INTO payroll_records (
        payroll_period_id, employee_id,
        basic_pay, overtime_pay, holiday_pay, night_differential,
        thirteenth_month_pay, allowances, other_earnings, gross_pay,
        sss_employee, philhealth_employee, pagibig_employee, withholding_tax,
        absence_deduction, late_deduction, loan_deductions, other_deductions, total_deductions,
        net_pay, days_worked, hours_worked, overtime_hours, absent_days, late_days, status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19,
        $20, $21, $22, $23, $24, $25, $26
      )
      ON CONFLICT (payroll_period_id, employee_id)
      DO UPDATE SET
        basic_pay = EXCLUDED.basic_pay,
        net_pay = EXCLUDED.net_pay,
        updated_at = NOW()
      RETURNING *`,
      [
        data.payroll_period_id, data.employee_id,
        data.basic_pay, data.overtime_pay, data.holiday_pay, data.night_differential,
        data.thirteenth_month_pay, data.allowances, data.other_earnings, data.gross_pay,
        data.sss_employee, data.philhealth_employee, data.pagibig_employee, data.withholding_tax,
        data.absence_deduction, data.late_deduction, data.loan_deductions, data.other_deductions, data.total_deductions,
        data.net_pay, data.days_worked, data.hours_worked, data.overtime_hours, data.absent_days, data.late_days, 'draft',
      ]
    )
    return result.rows[0] as PayrollRecordRow
  }
}
