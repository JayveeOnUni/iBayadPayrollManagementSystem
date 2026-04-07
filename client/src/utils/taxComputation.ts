/**
 * Philippine Government Contribution & Tax Computation Utilities
 * Based on:
 *  - SSS Contribution Table (effective 2023 - 14% rate, split 4.5% EE / 9.5% ER)
 *  - PhilHealth Contribution (effective 2024 - 5%, capped at PHP 100,000 MSC)
 *  - Pag-IBIG (HDMF) - 2% of MBC up to PHP 5,000
 *  - BIR TRAIN Law (RA 10963) revised withholding tax table (annual brackets)
 */

// ─── SSS ──────────────────────────────────────────────────────────────────────

/** SSS contribution table entry */
interface SSSBracket {
  minMSC: number
  maxMSC: number
  msc: number
  totalContribution: number
  employeeShare: number
  employerShare: number
  ecEmployer: number
}

/**
 * SSS Monthly Salary Credit (MSC) table — 2023 schedule.
 * Employee share = 4.5%, Employer share = 9.5%, EC = 10 or 30
 */
const SSS_TABLE: SSSBracket[] = [
  { minMSC: 0,      maxMSC: 4249.99,  msc: 4000,  totalContribution: 560.00,  employeeShare: 180.00,  employerShare: 380.00,  ecEmployer: 10 },
  { minMSC: 4250,   maxMSC: 4749.99,  msc: 4500,  totalContribution: 630.00,  employeeShare: 202.50,  employerShare: 427.50,  ecEmployer: 10 },
  { minMSC: 4750,   maxMSC: 5249.99,  msc: 5000,  totalContribution: 700.00,  employeeShare: 225.00,  employerShare: 475.00,  ecEmployer: 10 },
  { minMSC: 5250,   maxMSC: 5749.99,  msc: 5500,  totalContribution: 770.00,  employeeShare: 247.50,  employerShare: 522.50,  ecEmployer: 10 },
  { minMSC: 5750,   maxMSC: 6249.99,  msc: 6000,  totalContribution: 840.00,  employeeShare: 270.00,  employerShare: 570.00,  ecEmployer: 10 },
  { minMSC: 6250,   maxMSC: 6749.99,  msc: 6500,  totalContribution: 910.00,  employeeShare: 292.50,  employerShare: 617.50,  ecEmployer: 10 },
  { minMSC: 6750,   maxMSC: 7249.99,  msc: 7000,  totalContribution: 980.00,  employeeShare: 315.00,  employerShare: 665.00,  ecEmployer: 10 },
  { minMSC: 7250,   maxMSC: 7749.99,  msc: 7500,  totalContribution: 1050.00, employeeShare: 337.50,  employerShare: 712.50,  ecEmployer: 10 },
  { minMSC: 7750,   maxMSC: 8249.99,  msc: 8000,  totalContribution: 1120.00, employeeShare: 360.00,  employerShare: 760.00,  ecEmployer: 10 },
  { minMSC: 8250,   maxMSC: 8749.99,  msc: 8500,  totalContribution: 1190.00, employeeShare: 382.50,  employerShare: 807.50,  ecEmployer: 10 },
  { minMSC: 8750,   maxMSC: 9249.99,  msc: 9000,  totalContribution: 1260.00, employeeShare: 405.00,  employerShare: 855.00,  ecEmployer: 10 },
  { minMSC: 9250,   maxMSC: 9749.99,  msc: 9500,  totalContribution: 1330.00, employeeShare: 427.50,  employerShare: 902.50,  ecEmployer: 10 },
  { minMSC: 9750,   maxMSC: 10249.99, msc: 10000, totalContribution: 1400.00, employeeShare: 450.00,  employerShare: 950.00,  ecEmployer: 10 },
  { minMSC: 10250,  maxMSC: 10749.99, msc: 10500, totalContribution: 1470.00, employeeShare: 472.50,  employerShare: 997.50,  ecEmployer: 30 },
  { minMSC: 10750,  maxMSC: 11249.99, msc: 11000, totalContribution: 1540.00, employeeShare: 495.00,  employerShare: 1045.00, ecEmployer: 30 },
  { minMSC: 11250,  maxMSC: 11749.99, msc: 11500, totalContribution: 1610.00, employeeShare: 517.50,  employerShare: 1092.50, ecEmployer: 30 },
  { minMSC: 11750,  maxMSC: 12249.99, msc: 12000, totalContribution: 1680.00, employeeShare: 540.00,  employerShare: 1140.00, ecEmployer: 30 },
  { minMSC: 12250,  maxMSC: 12749.99, msc: 12500, totalContribution: 1750.00, employeeShare: 562.50,  employerShare: 1187.50, ecEmployer: 30 },
  { minMSC: 12750,  maxMSC: 13249.99, msc: 13000, totalContribution: 1820.00, employeeShare: 585.00,  employerShare: 1235.00, ecEmployer: 30 },
  { minMSC: 13250,  maxMSC: 13749.99, msc: 13500, totalContribution: 1890.00, employeeShare: 607.50,  employerShare: 1282.50, ecEmployer: 30 },
  { minMSC: 13750,  maxMSC: 14249.99, msc: 14000, totalContribution: 1960.00, employeeShare: 630.00,  employerShare: 1330.00, ecEmployer: 30 },
  { minMSC: 14250,  maxMSC: 14749.99, msc: 14500, totalContribution: 2030.00, employeeShare: 652.50,  employerShare: 1377.50, ecEmployer: 30 },
  { minMSC: 14750,  maxMSC: 15249.99, msc: 15000, totalContribution: 2100.00, employeeShare: 675.00,  employerShare: 1425.00, ecEmployer: 30 },
  { minMSC: 15250,  maxMSC: 15749.99, msc: 15500, totalContribution: 2170.00, employeeShare: 697.50,  employerShare: 1472.50, ecEmployer: 30 },
  { minMSC: 15750,  maxMSC: 16249.99, msc: 16000, totalContribution: 2240.00, employeeShare: 720.00,  employerShare: 1520.00, ecEmployer: 30 },
  { minMSC: 16250,  maxMSC: 16749.99, msc: 16500, totalContribution: 2310.00, employeeShare: 742.50,  employerShare: 1567.50, ecEmployer: 30 },
  { minMSC: 16750,  maxMSC: 17249.99, msc: 17000, totalContribution: 2380.00, employeeShare: 765.00,  employerShare: 1615.00, ecEmployer: 30 },
  { minMSC: 17250,  maxMSC: 17749.99, msc: 17500, totalContribution: 2450.00, employeeShare: 787.50,  employerShare: 1662.50, ecEmployer: 30 },
  { minMSC: 17750,  maxMSC: 18249.99, msc: 18000, totalContribution: 2520.00, employeeShare: 810.00,  employerShare: 1710.00, ecEmployer: 30 },
  { minMSC: 18250,  maxMSC: 18749.99, msc: 18500, totalContribution: 2590.00, employeeShare: 832.50,  employerShare: 1757.50, ecEmployer: 30 },
  { minMSC: 18750,  maxMSC: 19249.99, msc: 19000, totalContribution: 2660.00, employeeShare: 855.00,  employerShare: 1805.00, ecEmployer: 30 },
  { minMSC: 19250,  maxMSC: 19749.99, msc: 19500, totalContribution: 2730.00, employeeShare: 877.50,  employerShare: 1852.50, ecEmployer: 30 },
  { minMSC: 19750,  maxMSC: 20249.99, msc: 20000, totalContribution: 2800.00, employeeShare: 900.00,  employerShare: 1900.00, ecEmployer: 30 },
  { minMSC: 20250,  maxMSC: Infinity, msc: 20000, totalContribution: 2800.00, employeeShare: 900.00,  employerShare: 1900.00, ecEmployer: 30 },
]

export interface SSSContribution {
  msc: number
  employeeShare: number
  employerShare: number
  ecEmployer: number
  total: number
}

/**
 * Compute SSS monthly contribution based on gross monthly salary.
 */
export function computeSSS(monthlyBasicSalary: number): SSSContribution {
  const bracket = SSS_TABLE.find(
    (b) => monthlyBasicSalary >= b.minMSC && monthlyBasicSalary <= b.maxMSC
  ) ?? SSS_TABLE[SSS_TABLE.length - 1]

  return {
    msc: bracket.msc,
    employeeShare: bracket.employeeShare,
    employerShare: bracket.employerShare,
    ecEmployer: bracket.ecEmployer,
    total: bracket.totalContribution,
  }
}

// ─── PhilHealth ───────────────────────────────────────────────────────────────

const PHILHEALTH_RATE = 0.05          // 5% total; split 50/50
const PHILHEALTH_MIN_MSC = 10000      // minimum monthly basic salary for computation
const PHILHEALTH_MAX_MSC = 100000     // ceiling

export interface PhilHealthContribution {
  monthlyPremium: number
  employeeShare: number
  employerShare: number
}

/**
 * Compute PhilHealth monthly contribution (2024 rate: 5%).
 * Salary ceiling: PHP 100,000
 */
export function computePhilHealth(monthlyBasicSalary: number): PhilHealthContribution {
  const clampedSalary = Math.min(Math.max(monthlyBasicSalary, PHILHEALTH_MIN_MSC), PHILHEALTH_MAX_MSC)
  const monthlyPremium = clampedSalary * PHILHEALTH_RATE
  const share = monthlyPremium / 2

  return {
    monthlyPremium: round2(monthlyPremium),
    employeeShare: round2(share),
    employerShare: round2(share),
  }
}

// ─── Pag-IBIG (HDMF) ─────────────────────────────────────────────────────────

const PAGIBIG_LOW_RATE = 0.01         // 1% if salary <= 1,500
const PAGIBIG_HIGH_RATE = 0.02        // 2% if salary > 1,500
const PAGIBIG_MAX_MBC = 5000          // max monthly basic compensation for rate
const PAGIBIG_EMPLOYEE_MAX = 100      // max employee contribution

export interface PagIBIGContribution {
  employeeShare: number
  employerShare: number
  total: number
}

/**
 * Compute Pag-IBIG/HDMF monthly contribution.
 * Employee: 1% if salary <= 1,500 else 2% (max 100)
 * Employer: 2% always
 */
export function computePagIBIG(monthlyBasicSalary: number): PagIBIGContribution {
  const mbc = Math.min(monthlyBasicSalary, PAGIBIG_MAX_MBC)
  const rate = monthlyBasicSalary <= 1500 ? PAGIBIG_LOW_RATE : PAGIBIG_HIGH_RATE
  const employeeShare = Math.min(mbc * rate, PAGIBIG_EMPLOYEE_MAX)
  const employerShare = mbc * 0.02

  return {
    employeeShare: round2(employeeShare),
    employerShare: round2(employerShare),
    total: round2(employeeShare + employerShare),
  }
}

// ─── BIR Withholding Tax (TRAIN Law) ─────────────────────────────────────────

/**
 * TRAIN Law annual income tax brackets (RA 10963).
 * format: { min, max, fixedTax, rate, excessOver }
 */
interface TaxBracket {
  min: number
  max: number
  fixedTax: number
  rate: number
  excessOver: number
  label: string
}

const TRAIN_ANNUAL_BRACKETS: TaxBracket[] = [
  {
    min: 0,
    max: 250000,
    fixedTax: 0,
    rate: 0,
    excessOver: 0,
    label: 'Up to ₱250,000 — Exempt',
  },
  {
    min: 250000.01,
    max: 400000,
    fixedTax: 0,
    rate: 0.15,
    excessOver: 250000,
    label: '₱250,001 – ₱400,000 — 15% of excess over ₱250,000',
  },
  {
    min: 400000.01,
    max: 800000,
    fixedTax: 22500,
    rate: 0.20,
    excessOver: 400000,
    label: '₱400,001 – ₱800,000 — ₱22,500 + 20% of excess over ₱400,000',
  },
  {
    min: 800000.01,
    max: 2000000,
    fixedTax: 102500,
    rate: 0.25,
    excessOver: 800000,
    label: '₱800,001 – ₱2,000,000 — ₱102,500 + 25% of excess over ₱800,000',
  },
  {
    min: 2000000.01,
    max: 8000000,
    fixedTax: 402500,
    rate: 0.30,
    excessOver: 2000000,
    label: '₱2,000,001 – ₱8,000,000 — ₱402,500 + 30% of excess over ₱2,000,000',
  },
  {
    min: 8000000.01,
    max: Infinity,
    fixedTax: 2202500,
    rate: 0.35,
    excessOver: 8000000,
    label: 'Over ₱8,000,000 — ₱2,202,500 + 35% of excess over ₱8,000,000',
  },
]

export interface WithholdingTaxResult {
  annualTaxableIncome: number
  annualTax: number
  monthlyTax: number
  bracket: string
}

/**
 * Compute BIR withholding tax using TRAIN Law annual brackets.
 *
 * @param monthlyBasicSalary   Gross monthly basic pay before any deductions
 * @param monthlyNonTaxable    Non-taxable allowances (de minimis, etc.)
 * @param sssEmployee          Monthly SSS employee share
 * @param philhealthEmployee   Monthly PhilHealth employee share
 * @param pagibigEmployee      Monthly Pag-IBIG employee share
 */
export function computeWithholdingTax(
  monthlyBasicSalary: number,
  monthlyNonTaxable = 0,
  sssEmployee = 0,
  philhealthEmployee = 0,
  pagibigEmployee = 0
): WithholdingTaxResult {
  const monthlyTaxableIncome =
    monthlyBasicSalary - monthlyNonTaxable - sssEmployee - philhealthEmployee - pagibigEmployee

  // Annualize (TRAIN Law brackets are annual)
  const annualTaxableIncome = monthlyTaxableIncome * 12

  const bracket = TRAIN_ANNUAL_BRACKETS.find(
    (b) => annualTaxableIncome >= b.min && annualTaxableIncome <= b.max
  ) ?? TRAIN_ANNUAL_BRACKETS[TRAIN_ANNUAL_BRACKETS.length - 1]

  const annualTax = bracket.fixedTax + (annualTaxableIncome - bracket.excessOver) * bracket.rate
  const monthlyTax = annualTax / 12

  return {
    annualTaxableIncome: round2(annualTaxableIncome),
    annualTax: round2(Math.max(0, annualTax)),
    monthlyTax: round2(Math.max(0, monthlyTax)),
    bracket: bracket.label,
  }
}

// ─── All-in-one computation ───────────────────────────────────────────────────

export interface AllContributions {
  sss: SSSContribution
  philhealth: PhilHealthContribution
  pagibig: PagIBIGContribution
  withholdingTax: WithholdingTaxResult
  totalEmployeeDeductions: number
  totalEmployerContributions: number
  netPay: number
}

/**
 * Compute all mandatory Philippine government contributions and withholding tax.
 *
 * @param grossMonthlySalary  Employee's gross monthly salary
 * @param nonTaxableAllowances  Non-taxable de minimis benefits
 */
export function computeAllContributions(
  grossMonthlySalary: number,
  nonTaxableAllowances = 0
): AllContributions {
  const sss = computeSSS(grossMonthlySalary)
  const philhealth = computePhilHealth(grossMonthlySalary)
  const pagibig = computePagIBIG(grossMonthlySalary)
  const withholdingTax = computeWithholdingTax(
    grossMonthlySalary,
    nonTaxableAllowances,
    sss.employeeShare,
    philhealth.employeeShare,
    pagibig.employeeShare
  )

  const totalEmployeeDeductions =
    sss.employeeShare +
    philhealth.employeeShare +
    pagibig.employeeShare +
    withholdingTax.monthlyTax

  const totalEmployerContributions =
    sss.employerShare +
    sss.ecEmployer +
    philhealth.employerShare +
    pagibig.employerShare

  const netPay = grossMonthlySalary + nonTaxableAllowances - totalEmployeeDeductions

  return {
    sss,
    philhealth,
    pagibig,
    withholdingTax,
    totalEmployeeDeductions: round2(totalEmployeeDeductions),
    totalEmployerContributions: round2(totalEmployerContributions),
    netPay: round2(netPay),
  }
}

// ─── Semi-monthly helpers ─────────────────────────────────────────────────────

/**
 * Convert monthly contributions to semi-monthly amounts (divide by 2).
 */
export function toSemiMonthly(monthly: AllContributions): AllContributions {
  return {
    sss: {
      ...monthly.sss,
      employeeShare: round2(monthly.sss.employeeShare / 2),
      employerShare: round2(monthly.sss.employerShare / 2),
      total: round2(monthly.sss.total / 2),
    },
    philhealth: {
      ...monthly.philhealth,
      monthlyPremium: round2(monthly.philhealth.monthlyPremium / 2),
      employeeShare: round2(monthly.philhealth.employeeShare / 2),
      employerShare: round2(monthly.philhealth.employerShare / 2),
    },
    pagibig: {
      ...monthly.pagibig,
      employeeShare: round2(monthly.pagibig.employeeShare / 2),
      employerShare: round2(monthly.pagibig.employerShare / 2),
      total: round2(monthly.pagibig.total / 2),
    },
    withholdingTax: {
      ...monthly.withholdingTax,
      monthlyTax: round2(monthly.withholdingTax.monthlyTax / 2),
    },
    totalEmployeeDeductions: round2(monthly.totalEmployeeDeductions / 2),
    totalEmployerContributions: round2(monthly.totalEmployerContributions / 2),
    netPay: round2(monthly.netPay / 2),
  }
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

/**
 * Format a number as Philippine Peso.
 */
export function formatPeso(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(amount)
}
