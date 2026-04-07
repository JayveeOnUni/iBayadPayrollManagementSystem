import { computeAllContributions, toSemiMonthly } from './taxComputation'
import type { Employee, AttendanceRecord, PayrollRecord, PayrollPeriod } from '../types'

export interface PayrollComputationInput {
  employee: Employee
  period: PayrollPeriod
  attendanceRecords: AttendanceRecord[]
  overtimeHours: number
  holidayDays: number        // regular holiday days worked
  specialHolidayDays: number // special non-working holidays worked
  nightDifferentialHours: number
  thirteenthMonthPay?: number
  allowances?: number
  loanDeductions?: number
  otherDeductions?: number
  otherEarnings?: number
}

export interface PayrollComputationResult {
  // Earnings
  basicPay: number
  overtimePay: number
  holidayPay: number
  specialHolidayPay: number
  nightDifferential: number
  thirteenthMonthPay: number
  allowances: number
  otherEarnings: number
  grossPay: number

  // Deductions
  sssEmployee: number
  philhealthEmployee: number
  pagibigEmployee: number
  withholdingTax: number
  absenceDeduction: number
  lateDeduction: number
  loanDeductions: number
  otherDeductions: number
  totalDeductions: number

  // Net
  netPay: number

  // Attendance
  daysWorked: number
  hoursWorked: number
  overtimeHours: number
  absentDays: number
  lateDays: number
  lateMinutes: number
}

const WORKING_DAYS_PER_MONTH = 22
const WORKING_HOURS_PER_DAY = 8
const OVERTIME_RATE = 1.25
const REGULAR_HOLIDAY_RATE = 2.0
const SPECIAL_HOLIDAY_RATE = 1.30
const NIGHT_DIFFERENTIAL_RATE = 0.10

/**
 * Compute full payroll for a single employee for a given period.
 */
export function computePayroll(input: PayrollComputationInput): PayrollComputationResult {
  const {
    employee,
    period,
    attendanceRecords,
    overtimeHours,
    holidayDays,
    specialHolidayDays,
    nightDifferentialHours,
    allowances = 0,
    loanDeductions = 0,
    otherDeductions = 0,
    otherEarnings = 0,
  } = input

  const isSemiMonthly = period.frequency === 'semi_monthly'
  const divisor = isSemiMonthly ? 2 : 1

  // Daily and hourly rates
  const monthlyRate = employee.basicSalary
  const dailyRate = monthlyRate / WORKING_DAYS_PER_MONTH
  const hourlyRate = dailyRate / WORKING_HOURS_PER_DAY

  // Attendance summary
  const daysWorked = attendanceRecords.filter(
    (r) => r.status === 'present' || r.status === 'late'
  ).length
  const absentDays = attendanceRecords.filter((r) => r.status === 'absent').length
  const lateRecords = attendanceRecords.filter((r) => r.lateMinutes > 0)
  const lateDays = lateRecords.length
  const totalLateMinutes = lateRecords.reduce((sum, r) => sum + r.lateMinutes, 0)
  const totalHoursWorked = attendanceRecords.reduce((sum, r) => sum + r.hoursWorked, 0)

  // Earnings
  const basicPay = round2((monthlyRate / divisor) - (absentDays * dailyRate))
  const overtimePay = round2(overtimeHours * hourlyRate * OVERTIME_RATE)
  const holidayPay = round2(holidayDays * dailyRate * (REGULAR_HOLIDAY_RATE - 1))
  const specialHolidayPay = round2(specialHolidayDays * dailyRate * (SPECIAL_HOLIDAY_RATE - 1))
  const nightDifferential = round2(nightDifferentialHours * hourlyRate * NIGHT_DIFFERENTIAL_RATE)

  // 13th month pay (December or on separation) – simplified: 1/12 of basic per month
  const thirteenthMonthPay = input.thirteenthMonthPay ?? 0

  const grossPay = round2(
    basicPay + overtimePay + holidayPay + specialHolidayPay + nightDifferential +
    thirteenthMonthPay + allowances + otherEarnings
  )

  // Government contributions (based on monthly salary, then halved if semi-monthly)
  let contributions = computeAllContributions(monthlyRate)
  if (isSemiMonthly) contributions = toSemiMonthly(contributions)

  // Late deduction (proportional by minute)
  const absenceDeduction = round2(absentDays * dailyRate)
  const lateDeduction = round2((totalLateMinutes / 60) * hourlyRate)

  const totalDeductions = round2(
    contributions.sss.employeeShare +
    contributions.philhealth.employeeShare +
    contributions.pagibig.employeeShare +
    contributions.withholdingTax.monthlyTax +
    absenceDeduction +
    lateDeduction +
    loanDeductions +
    otherDeductions
  )

  const netPay = round2(grossPay - totalDeductions)

  return {
    basicPay,
    overtimePay,
    holidayPay: round2(holidayPay + specialHolidayPay),
    specialHolidayPay,
    nightDifferential,
    thirteenthMonthPay,
    allowances,
    otherEarnings,
    grossPay,

    sssEmployee: contributions.sss.employeeShare,
    philhealthEmployee: contributions.philhealth.employeeShare,
    pagibigEmployee: contributions.pagibig.employeeShare,
    withholdingTax: contributions.withholdingTax.monthlyTax,
    absenceDeduction,
    lateDeduction,
    loanDeductions,
    otherDeductions,
    totalDeductions,

    netPay,

    daysWorked,
    hoursWorked: totalHoursWorked,
    overtimeHours,
    absentDays,
    lateDays,
    lateMinutes: totalLateMinutes,
  }
}

/**
 * Compute 13th month pay.
 * Formula: Total Basic Salary for the year / 12
 */
export function compute13thMonthPay(
  monthlyBasicSalary: number,
  monthsWorked: number
): number {
  return round2((monthlyBasicSalary * monthsWorked) / 12)
}

/**
 * Compute daily rate from monthly salary.
 */
export function getDailyRate(monthlySalary: number, workingDaysPerMonth = WORKING_DAYS_PER_MONTH): number {
  return round2(monthlySalary / workingDaysPerMonth)
}

/**
 * Compute hourly rate from daily rate.
 */
export function getHourlyRate(dailyRate: number, hoursPerDay = WORKING_HOURS_PER_DAY): number {
  return round2(dailyRate / hoursPerDay)
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

/**
 * Map PayrollComputationResult to a partial PayrollRecord shape.
 */
export function toPayrollRecord(
  result: PayrollComputationResult,
  employeeId: string,
  periodId: string
): Partial<PayrollRecord> {
  return {
    employeeId,
    payrollPeriodId: periodId,
    basicPay: result.basicPay,
    overtimePay: result.overtimePay,
    holidayPay: result.holidayPay,
    nightDifferential: result.nightDifferential,
    thirteenthMonthPay: result.thirteenthMonthPay,
    allowances: result.allowances,
    otherEarnings: result.otherEarnings,
    grossPay: result.grossPay,
    contributions: {
      sss: result.sssEmployee,
      philhealth: result.philhealthEmployee,
      pagibig: result.pagibigEmployee,
      totalEmployee: result.sssEmployee + result.philhealthEmployee + result.pagibigEmployee,
      sssEmployer: 0,
      philhealthEmployer: 0,
      pagibigEmployer: 0,
      totalEmployer: 0,
    },
    withholdingTax: result.withholdingTax,
    absenceDeduction: result.absenceDeduction,
    lateDeduction: result.lateDeduction,
    loanDeductions: result.loanDeductions,
    otherDeductions: result.otherDeductions,
    totalDeductions: result.totalDeductions,
    netPay: result.netPay,
    daysWorked: result.daysWorked,
    hoursWorked: result.hoursWorked,
    overtimeHours: result.overtimeHours,
    absentDays: result.absentDays,
    lateDays: result.lateDays,
    status: 'draft',
  }
}
