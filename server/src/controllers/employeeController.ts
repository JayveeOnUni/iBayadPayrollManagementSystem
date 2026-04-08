import { Request, Response } from 'express'
import { EmployeeModel } from '../models/Employee'
import { asyncHandler, createError } from '../middleware/errorHandler'

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
  const employeeNumber = await EmployeeModel.generateEmployeeNumber()

  const {
    firstName, middleName, lastName, email, phone,
    birthDate, gender, civilStatus,
    address, city, province, zipCode,
    departmentId, positionId, employmentType, hireDate,
    basicSalary, sssNumber, philhealthNumber, pagibigNumber, tinNumber,
    bankName, bankAccountNumber, shiftId,
  } = req.body

  if (!firstName || !lastName || !email || !hireDate || !basicSalary) {
    throw createError('firstName, lastName, email, hireDate, and basicSalary are required', 400)
  }

  const dailyRate = basicSalary / 22
  const hourlyRate = dailyRate / 8

  const employee = await EmployeeModel.create({
    employee_number: employeeNumber,
    first_name: firstName,
    middle_name: middleName,
    last_name: lastName,
    email,
    phone,
    birth_date: birthDate,
    gender,
    civil_status: civilStatus,
    address,
    city,
    province,
    zip_code: zipCode,
    department_id: departmentId,
    position_id: positionId,
    employment_type: employmentType || 'regular',
    hire_date: hireDate,
    basic_salary: basicSalary,
    daily_rate: Math.round(dailyRate * 100) / 100,
    hourly_rate: Math.round(hourlyRate * 100) / 100,
    sss_number: sssNumber,
    philhealth_number: philhealthNumber,
    pagibig_number: pagibigNumber,
    tin_number: tinNumber,
    bank_name: bankName,
    bank_account_number: bankAccountNumber,
    shift_id: shiftId,
  })

  res.status(201).json({ success: true, data: employee })
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
    phone: body.phone,
    birth_date: body.birthDate,
    gender: body.gender,
    civil_status: body.civilStatus,
    address: body.address,
    city: body.city,
    province: body.province,
    zip_code: body.zipCode,
    department_id: body.departmentId,
    position_id: body.positionId,
    employment_type: body.employmentType,
    hire_date: body.hireDate,
    basic_salary: body.basicSalary,
    sss_number: body.sssNumber,
    philhealth_number: body.philhealthNumber,
    pagibig_number: body.pagibigNumber,
    tin_number: body.tinNumber,
    bank_name: body.bankName,
    bank_account_number: body.bankAccountNumber,
    shift_id: body.shiftId,
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
