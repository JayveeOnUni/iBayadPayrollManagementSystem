import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { EmployeeModel, type EmployeeRow } from '../models/Employee'
import { asyncHandler, createError } from '../middleware/errorHandler'
import pool from '../utils/db'

const DEFAULT_EMPLOYEE_PASSWORD = process.env.DEFAULT_EMPLOYEE_PASSWORD || 'Ibayad123!'

function emptyToNull(value: unknown): string | null {
  if (value == null) return null
  const trimmed = String(value).trim()
  return trimmed === '' ? null : trimmed
}

function emptyToNullIfPresent(value: unknown): string | null | undefined {
  return value === undefined ? undefined : emptyToNull(value)
}

function requiredDate(value: unknown, fieldName: string): string {
  const date = emptyToNull(value)
  if (!date) throw createError(`${fieldName} is required`, 400)
  return date
}

function optionalNumber(value: unknown): number | null {
  if (value === '' || value == null) return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function isEmployeeNumberDuplicateError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'constraint' in error &&
    error.code === '23505' &&
    error.constraint === 'employees_employee_number_key'
  )
}

export const listEmployees = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1)
  const limit = Math.min(100, parseInt(req.query.limit as string) || 20)

  const result = await EmployeeModel.findAll({
    page,
    limit,
    search: req.query.search as string | undefined,
    departmentId: req.query.departmentId as string | undefined,
    status: req.query.status as string | undefined,
  })

  res.json({
    success: true,
    data: result.data,
    total: result.total,
    page,
    limit,
    totalPages: Math.ceil(result.total / limit),
  })
})

export const getEmployee = asyncHandler(async (req: Request, res: Response) => {
  const employee = await EmployeeModel.findById(req.params.id)
  if (!employee) throw createError('Employee not found', 404)
  res.json({ success: true, data: employee })
})

export const createEmployee = asyncHandler(async (req: Request, res: Response) => {
  const {
    firstName, middleName, lastName, email, phone,
    birthDate, gender, civilStatus,
    address, city, province, zipCode,
    departmentId, positionId, employmentType, hireDate,
    basicSalary, sssNumber, philhealthNumber, pagibigNumber, tinNumber,
    bankName, bankAccountNumber, shiftId,
  } = req.body

  const salary = optionalNumber(basicSalary)
  const normalizedHireDate = requiredDate(hireDate, 'hireDate')

  if (!firstName || !lastName || !email || salary == null) {
    throw createError('firstName, lastName, email, hireDate, and basicSalary are required', 400)
  }

  const dailyRate = salary / 22
  const hourlyRate = dailyRate / 8

  const client = await pool.connect()
  let employee: EmployeeRow | undefined
  try {
    await client.query('BEGIN')

    for (let attempt = 1; attempt <= 3; attempt++) {
      const employeeNumber = await EmployeeModel.generateEmployeeNumber(client)

      try {
        await client.query('SAVEPOINT employee_number_attempt')
        employee = await EmployeeModel.create({
          employee_number: employeeNumber,
          first_name: emptyToNull(firstName) ?? '',
          middle_name: emptyToNull(middleName),
          last_name: emptyToNull(lastName) ?? '',
          email: emptyToNull(email) ?? '',
          phone: emptyToNull(phone),
          birth_date: emptyToNull(birthDate),
          gender,
          civil_status: civilStatus,
          address: emptyToNull(address),
          city: emptyToNull(city),
          province: emptyToNull(province),
          zip_code: emptyToNull(zipCode),
          department_id: emptyToNull(departmentId),
          position_id: emptyToNull(positionId),
          employment_type: employmentType || 'regular',
          hire_date: normalizedHireDate,
          basic_salary: salary,
          daily_rate: Math.round(dailyRate * 100) / 100,
          hourly_rate: Math.round(hourlyRate * 100) / 100,
          sss_number: emptyToNull(sssNumber),
          philhealth_number: emptyToNull(philhealthNumber),
          pagibig_number: emptyToNull(pagibigNumber),
          tin_number: emptyToNull(tinNumber),
          bank_name: emptyToNull(bankName),
          bank_account_number: emptyToNull(bankAccountNumber),
          shift_id: emptyToNull(shiftId),
        }, client)
        await client.query('RELEASE SAVEPOINT employee_number_attempt')
        break
      } catch (error) {
        await client.query('ROLLBACK TO SAVEPOINT employee_number_attempt')
        if (attempt === 3 || !isEmployeeNumberDuplicateError(error)) throw error
      }
    }

    if (!employee) throw createError('Unable to generate a unique employee number', 500)

    const passwordHash = await bcrypt.hash(DEFAULT_EMPLOYEE_PASSWORD, 12)
    await client.query(
      `INSERT INTO users (employee_id, email, password_hash, role, is_active)
       VALUES ($1, $2, $3, 'employee', true)`,
      [employee.id, employee.email, passwordHash]
    )

    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }

  res.status(201).json({
    success: true,
    data: employee,
    message: `Employee account created. Temporary password: ${DEFAULT_EMPLOYEE_PASSWORD}`,
  })
})

export const updateEmployee = asyncHandler(async (req: Request, res: Response) => {
  const existing = await EmployeeModel.findById(req.params.id)
  if (!existing) throw createError('Employee not found', 404)

  const body = req.body
  const data = {
    first_name: body.firstName,
    middle_name: body.middleName,
    last_name: body.lastName,
    email: body.email,
    phone: emptyToNullIfPresent(body.phone),
    birth_date: emptyToNullIfPresent(body.birthDate),
    gender: body.gender,
    civil_status: body.civilStatus,
    address: emptyToNullIfPresent(body.address),
    city: emptyToNullIfPresent(body.city),
    province: emptyToNullIfPresent(body.province),
    zip_code: emptyToNullIfPresent(body.zipCode),
    department_id: emptyToNullIfPresent(body.departmentId),
    position_id: emptyToNullIfPresent(body.positionId),
    employment_type: body.employmentType,
    hire_date: body.hireDate === undefined ? undefined : requiredDate(body.hireDate, 'hireDate'),
    basic_salary: body.basicSalary,
    sss_number: emptyToNullIfPresent(body.sssNumber),
    philhealth_number: emptyToNullIfPresent(body.philhealthNumber),
    pagibig_number: emptyToNullIfPresent(body.pagibigNumber),
    tin_number: emptyToNullIfPresent(body.tinNumber),
    bank_name: emptyToNullIfPresent(body.bankName),
    bank_account_number: emptyToNullIfPresent(body.bankAccountNumber),
    shift_id: emptyToNullIfPresent(body.shiftId),
  }
  const sanitized = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined))
  const updated = await EmployeeModel.update(req.params.id, sanitized as never)
  res.json({ success: true, data: updated })
})

export const deactivateEmployee = asyncHandler(async (req: Request, res: Response) => {
  const employee = await EmployeeModel.findById(req.params.id)
  if (!employee) throw createError('Employee not found', 404)

  const updated = await EmployeeModel.update(req.params.id, {
    employment_status: 'inactive',
  } as never)
  res.json({ success: true, data: updated })
})

export const activateEmployee = asyncHandler(async (req: Request, res: Response) => {
  const employee = await EmployeeModel.findById(req.params.id)
  if (!employee) throw createError('Employee not found', 404)

  const updated = await EmployeeModel.update(req.params.id, {
    employment_status: 'active',
  } as never)
  res.json({ success: true, data: updated })
})
