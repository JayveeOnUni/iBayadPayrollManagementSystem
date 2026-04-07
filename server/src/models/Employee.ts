import pool from '../utils/db'

export interface EmployeeRow {
  id: string
  employee_number: string
  first_name: string
  middle_name?: string
  last_name: string
  email: string
  phone?: string
  birth_date: Date
  gender: string
  civil_status: string
  address: string
  city: string
  province: string
  zip_code: string
  department_id: string
  position_id: string
  employment_type: string
  employment_status: string
  hire_date: Date
  regularization_date?: Date
  resignation_date?: Date
  basic_salary: number
  daily_rate: number
  hourly_rate: number
  sss_number?: string
  philhealth_number?: string
  pagibig_number?: string
  tin_number?: string
  bank_name?: string
  bank_account_number?: string
  avatar_url?: string
  shift_id?: string
  user_id?: string
  created_at: Date
  updated_at: Date
}

export class EmployeeModel {
  static async findAll(params: {
    page: number
    limit: number
    search?: string
    departmentId?: string
    status?: string
  }) {
    const offset = (params.page - 1) * params.limit
    const conditions: string[] = []
    const values: (string | number)[] = []
    let paramIdx = 1

    if (params.search) {
      conditions.push(`(
        e.first_name ILIKE $${paramIdx} OR
        e.last_name ILIKE $${paramIdx} OR
        e.email ILIKE $${paramIdx} OR
        e.employee_number ILIKE $${paramIdx}
      )`)
      values.push(`%${params.search}%`)
      paramIdx++
    }

    if (params.departmentId) {
      conditions.push(`e.department_id = $${paramIdx}`)
      values.push(params.departmentId)
      paramIdx++
    }

    if (params.status) {
      conditions.push(`e.employment_status = $${paramIdx}`)
      values.push(params.status)
      paramIdx++
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    const countQuery = `SELECT COUNT(*) FROM employees e ${where}`
    const dataQuery = `
      SELECT
        e.*,
        d.name AS department_name,
        p.title AS position_title
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN positions p ON e.position_id = p.id
      ${where}
      ORDER BY e.last_name, e.first_name
      LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
    `

    const [countResult, dataResult] = await Promise.all([
      pool.query(countQuery, values),
      pool.query(dataQuery, [...values, params.limit, offset]),
    ])

    return {
      data: dataResult.rows as EmployeeRow[],
      total: parseInt(countResult.rows[0].count, 10),
    }
  }

  static async findById(id: string) {
    const result = await pool.query(
      `SELECT e.*, d.name AS department_name, p.title AS position_title, s.name AS shift_name
       FROM employees e
       LEFT JOIN departments d ON e.department_id = d.id
       LEFT JOIN positions p ON e.position_id = p.id
       LEFT JOIN shifts s ON e.shift_id = s.id
       WHERE e.id = $1`,
      [id]
    )
    return result.rows[0] as EmployeeRow | undefined
  }

  static async create(data: Partial<EmployeeRow>) {
    const result = await pool.query(
      `INSERT INTO employees (
        employee_number, first_name, middle_name, last_name, email, phone,
        birth_date, gender, civil_status, address, city, province, zip_code,
        department_id, position_id, employment_type, hire_date,
        basic_salary, daily_rate, hourly_rate,
        sss_number, philhealth_number, pagibig_number, tin_number,
        bank_name, bank_account_number, shift_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12, $13,
        $14, $15, $16, $17,
        $18, $19, $20,
        $21, $22, $23, $24,
        $25, $26, $27
      ) RETURNING *`,
      [
        data.employee_number, data.first_name, data.middle_name, data.last_name,
        data.email, data.phone,
        data.birth_date, data.gender, data.civil_status,
        data.address, data.city, data.province, data.zip_code,
        data.department_id, data.position_id, data.employment_type, data.hire_date,
        data.basic_salary, data.daily_rate, data.hourly_rate,
        data.sss_number, data.philhealth_number, data.pagibig_number, data.tin_number,
        data.bank_name, data.bank_account_number, data.shift_id,
      ]
    )
    return result.rows[0] as EmployeeRow
  }

  static async update(id: string, data: Partial<EmployeeRow>) {
    const fields = Object.keys(data)
      .map((key, i) => `${key} = $${i + 2}`)
      .join(', ')
    const values = Object.values(data)

    const result = await pool.query(
      `UPDATE employees SET ${fields}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id, ...values]
    )
    return result.rows[0] as EmployeeRow
  }

  static async generateEmployeeNumber(): Promise<string> {
    const result = await pool.query(
      `SELECT employee_number FROM employees ORDER BY created_at DESC LIMIT 1`
    )
    if (result.rows.length === 0) return 'EMP-001'
    const last = result.rows[0].employee_number as string
    const num = parseInt(last.replace('EMP-', ''), 10)
    return `EMP-${String(num + 1).padStart(3, '0')}`
  }
}
