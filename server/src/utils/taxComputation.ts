/**
 * Philippine Tax & Contribution Computation Utilities
 * Based on: TRAIN Law (RA 10963), SSS Circular 2023-001,
 *           PhilHealth Circular 2023-0007, Pag-IBIG Circular 460
 */

// ─── SSS Contribution ────────────────────────────────────────────────────────

/**
 * Compute SSS contribution (2023 schedule).
 * Based on monthly basic pay.
 */
export function computeSSS(monthlyBasicPay: number): {
  employee: number
  employer: number
  total: number
} {
  // Simplified SSS table (2023). Full table has ~50 brackets.
  const minPay = 4_250
  const maxPay = 29_750
  const employeeRate = 0.045
  const employerRate = 0.095

  const clampedPay = Math.max(minPay, Math.min(maxPay, monthlyBasicPay))
  // Round to nearest 500
  const msc = Math.round(clampedPay / 500) * 500

  const employee = Math.round(msc * employeeRate * 100) / 100
  const employer = Math.round(msc * employerRate * 100) / 100

  return { employee, employer, total: employee + employer }
}

// ─── PhilHealth Contribution ─────────────────────────────────────────────────

/**
 * Compute PhilHealth contribution (2023: 4% of basic salary, shared equally).
 * Minimum monthly basic: ₱10,000 | Maximum: ₱80,000
 */
export function computePhilHealth(monthlyBasicPay: number): {
  employee: number
  employer: number
  total: number
} {
  const rate = 0.04
  const minSalary = 10_000
  const maxSalary = 80_000

  const salary = Math.max(minSalary, Math.min(maxSalary, monthlyBasicPay))
  const total = Math.round(salary * rate * 100) / 100
  const half = Math.round(total / 2 * 100) / 100

  return { employee: half, employer: total - half, total }
}

// ─── Pag-IBIG Contribution ───────────────────────────────────────────────────

/**
 * Compute Pag-IBIG contribution.
 * <= ₱1,500: employee 1%, employer 2%
 * > ₱1,500: employee 2%, employer 2%
 * Max monthly compensation for contribution purposes: ₱5,000
 */
export function computePagIBIG(monthlyBasicPay: number): {
  employee: number
  employer: number
  total: number
} {
  const maxForContrib = 5_000
  const base = Math.min(monthlyBasicPay, maxForContrib)

  const employeeRate = monthlyBasicPay <= 1_500 ? 0.01 : 0.02
  const employerRate = 0.02

  const employee = Math.round(base * employeeRate * 100) / 100
  const employer = Math.round(base * employerRate * 100) / 100

  return { employee, employer, total: employee + employer }
}

// ─── BIR Withholding Tax (TRAIN Law) ─────────────────────────────────────────

/**
 * TRAIN Law tax brackets (effective 2023, monthly taxable income).
 * RA 10963 as amended by RA 11534.
 */
const TRAIN_BRACKETS_MONTHLY = [
  { min: 0,        max: 20_833,   base: 0,         rate: 0 },
  { min: 20_834,   max: 33_332,   base: 0,         rate: 0.15 },
  { min: 33_333,   max: 66_666,   base: 2_500,     rate: 0.20 },
  { min: 66_667,   max: 166_666,  base: 10_833,    rate: 0.25 },
  { min: 166_667,  max: 666_666,  base: 40_833.33, rate: 0.30 },
  { min: 666_667,  max: Infinity, base: 200_833.33, rate: 0.35 },
]

/**
 * Compute monthly BIR withholding tax on taxable income.
 * Taxable income = gross income - mandatory deductions (SSS + PhilHealth + Pag-IBIG employee share)
 */
export function computeWithholdingTax(monthlyTaxableIncome: number): number {
  if (monthlyTaxableIncome <= 0) return 0

  for (const bracket of TRAIN_BRACKETS_MONTHLY) {
    if (monthlyTaxableIncome >= bracket.min && monthlyTaxableIncome <= bracket.max) {
      const excess = monthlyTaxableIncome - bracket.min
      const tax = bracket.base + excess * bracket.rate
      return Math.round(tax * 100) / 100
    }
  }
  return 0
}

// ─── Full Payroll Deduction Summary ──────────────────────────────────────────

export interface DeductionSummary {
  sss: { employee: number; employer: number }
  philHealth: { employee: number; employer: number }
  pagIBIG: { employee: number; employer: number }
  withholdingTax: number
  totalEmployeeDeductions: number
  totalEmployerContributions: number
  netPay: number
}

/**
 * Compute full deduction summary for a given gross monthly pay.
 */
export function computeDeductions(grossMonthlyPay: number): DeductionSummary {
  const sss = computeSSS(grossMonthlyPay)
  const philHealth = computePhilHealth(grossMonthlyPay)
  const pagIBIG = computePagIBIG(grossMonthlyPay)

  const mandatoryDeductions = sss.employee + philHealth.employee + pagIBIG.employee
  const taxableIncome = grossMonthlyPay - mandatoryDeductions
  const withholdingTax = computeWithholdingTax(taxableIncome)

  const totalEmployeeDeductions = mandatoryDeductions + withholdingTax
  const totalEmployerContributions = sss.employer + philHealth.employer + pagIBIG.employer

  return {
    sss: { employee: sss.employee, employer: sss.employer },
    philHealth: { employee: philHealth.employee, employer: philHealth.employer },
    pagIBIG: { employee: pagIBIG.employee, employer: pagIBIG.employer },
    withholdingTax,
    totalEmployeeDeductions,
    totalEmployerContributions,
    netPay: Math.round((grossMonthlyPay - totalEmployeeDeductions) * 100) / 100,
  }
}

// ─── 13th Month Pay ───────────────────────────────────────────────────────────

/**
 * Compute 13th month pay. = Total basic pay for the year / 12
 * Pro-rated if employee did not work the full year.
 */
export function compute13thMonthPay(totalBasicPayForYear: number, monthsWorked = 12): number {
  return Math.round((totalBasicPayForYear / 12) * (monthsWorked / 12) * 100) / 100
}

// ─── Overtime ────────────────────────────────────────────────────────────────

export function computeOvertimePay(
  dailyRate: number,
  overtimeHours: number,
  type: 'regular' | 'rest_day' | 'regular_holiday' | 'special_holiday' = 'regular'
): number {
  const rates: Record<typeof type, number> = {
    regular: 1.25,
    rest_day: 1.30,
    regular_holiday: 2.60,
    special_holiday: 1.30,
  }
  const hourlyRate = dailyRate / 8
  return Math.round(hourlyRate * overtimeHours * rates[type] * 100) / 100
}

// ─── Night Differential ──────────────────────────────────────────────────────

/**
 * 10% of hourly rate for hours worked between 10 PM and 6 AM
 */
export function computeNightDifferential(hourlyRate: number, ndHours: number): number {
  return Math.round(hourlyRate * ndHours * 0.10 * 100) / 100
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formatPeso(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(amount)
}
