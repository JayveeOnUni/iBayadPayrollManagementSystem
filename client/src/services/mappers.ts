import type {
  AttendanceRecord,
  AttendanceRequest,
  Employee,
  LeaveApplication,
  PayrollPeriod,
  PayrollRecord,
} from '../types'

type Row = Record<string, unknown>

function str(value: unknown, fallback = ''): string {
  return value == null ? fallback : String(value)
}

function num(value: unknown, fallback = 0): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

export function mapEmployee(row: Row): Employee {
  return {
    id: str(row.id),
    employeeNumber: str(row.employee_number ?? row.employeeNumber),
    firstName: str(row.first_name ?? row.firstName),
    middleName: row.middle_name ? str(row.middle_name) : undefined,
    lastName: str(row.last_name ?? row.lastName),
    email: str(row.email),
    phone: row.phone ? str(row.phone) : undefined,
    birthDate: str(row.birth_date ?? row.birthDate),
    gender: (row.gender as Employee['gender']) ?? 'other',
    civilStatus: (row.civil_status ?? row.civilStatus ?? 'single') as Employee['civilStatus'],
    address: str(row.address),
    city: str(row.city),
    province: str(row.province),
    zipCode: str(row.zip_code ?? row.zipCode),
    departmentId: str(row.department_id ?? row.departmentId),
    department: row.department_name
      ? {
          id: str(row.department_id ?? row.departmentId),
          name: str(row.department_name),
          code: str(row.department_code),
          isActive: true,
          createdAt: '',
          updatedAt: '',
        }
      : undefined,
    positionId: str(row.position_id ?? row.positionId),
    position: row.position_title
      ? {
          id: str(row.position_id ?? row.positionId),
          title: str(row.position_title),
          departmentId: str(row.department_id ?? row.departmentId),
          basicSalary: num(row.basic_salary ?? row.basicSalary),
          salaryType: 'monthly',
          isActive: true,
          createdAt: '',
          updatedAt: '',
        }
      : undefined,
    employmentType: (row.employment_type ?? row.employmentType ?? 'regular') as Employee['employmentType'],
    employmentStatus: (row.employment_status ?? row.employmentStatus ?? 'active') as Employee['employmentStatus'],
    hireDate: str(row.hire_date ?? row.hireDate),
    regularizationDate: row.regularization_date ? str(row.regularization_date) : undefined,
    sssNumber: row.sss_number ? str(row.sss_number) : undefined,
    philhealthNumber: row.philhealth_number ? str(row.philhealth_number) : undefined,
    pagibigNumber: row.pagibig_number ? str(row.pagibig_number) : undefined,
    tinNumber: row.tin_number ? str(row.tin_number) : undefined,
    basicSalary: num(row.basic_salary ?? row.basicSalary),
    dailyRate: num(row.daily_rate ?? row.dailyRate),
    hourlyRate: num(row.hourly_rate ?? row.hourlyRate),
    bankName: row.bank_name ? str(row.bank_name) : undefined,
    bankAccountNumber: row.bank_account_number ? str(row.bank_account_number) : undefined,
    avatarUrl: row.avatar_url ? str(row.avatar_url) : undefined,
    shiftId: row.shift_id ? str(row.shift_id) : undefined,
    createdAt: str(row.created_at ?? row.createdAt),
    updatedAt: str(row.updated_at ?? row.updatedAt),
  }
}

export function mapAttendance(row: Row): AttendanceRecord {
  const minutes = num(row.total_worked_minutes ?? row.totalWorkedMinutes)
  return {
    id: str(row.id),
    employeeId: str(row.employee_id ?? row.employeeId),
    employee: row.first_name || row.employee
      ? {
          id: str(row.employee_id ?? row.employeeId),
          firstName: str(row.first_name ?? (row.employee as Row | undefined)?.firstName),
          lastName: str(row.last_name ?? (row.employee as Row | undefined)?.lastName),
          employeeNumber: str(row.employee_number ?? (row.employee as Row | undefined)?.employeeNumber),
        }
      : undefined,
    date: str(row.date),
    timeIn: row.time_in ? str(row.time_in) : undefined,
    timeOut: row.time_out ? str(row.time_out) : undefined,
    hoursWorked: num(row.hours_worked ?? row.hoursWorked, minutes ? minutes / 60 : 0),
    overtimeHours: num(row.overtime_hours ?? row.overtimeHours),
    lateMinutes: num(row.late_minutes ?? row.lateMinutes),
    undertimeMinutes: num(row.undertime_minutes ?? row.undertimeMinutes),
    status: (row.status ?? 'present') as AttendanceRecord['status'],
    notes: row.remarks ? str(row.remarks) : undefined,
    createdAt: str(row.created_at ?? row.createdAt),
    updatedAt: str(row.updated_at ?? row.updatedAt),
  }
}

export function mapAttendanceRequest(row: Row): AttendanceRequest {
  return {
    id: str(row.id),
    employeeId: str(row.employee_id ?? row.employeeId),
    employee: row.first_name
      ? {
          id: str(row.employee_id ?? row.employeeId),
          firstName: str(row.first_name),
          lastName: str(row.last_name),
          employeeNumber: str(row.employee_number),
        }
      : undefined,
    date: str(row.date),
    type: 'correction',
    requestedTimeIn: row.requested_time_in ? str(row.requested_time_in) : undefined,
    requestedTimeOut: row.requested_time_out ? str(row.requested_time_out) : undefined,
    reason: str(row.reason),
    status: (row.status ?? 'pending') as AttendanceRequest['status'],
    reviewedBy: row.reviewed_by ? str(row.reviewed_by) : undefined,
    reviewedAt: row.reviewed_at ? str(row.reviewed_at) : undefined,
    createdAt: str(row.created_at ?? row.createdAt),
    updatedAt: str(row.updated_at ?? row.updatedAt),
  }
}

export function mapLeave(row: Row): LeaveApplication {
  return {
    id: str(row.id),
    employeeId: str(row.employee_id ?? row.employeeId),
    employee: row.first_name
      ? {
          id: str(row.employee_id ?? row.employeeId),
          firstName: str(row.first_name),
          lastName: str(row.last_name),
          employeeNumber: str(row.employee_number),
        }
      : undefined,
    leaveType: str(row.leave_type_name ?? row.leave_type ?? row.leaveType).toLowerCase().replace(' leave', '').replace(/\s+/g, '_') as LeaveApplication['leaveType'],
    startDate: str(row.start_date ?? row.startDate),
    endDate: str(row.end_date ?? row.endDate),
    totalDays: num(row.total_days ?? row.totalDays),
    reason: str(row.reason),
    status: (row.status ?? 'pending') as LeaveApplication['status'],
    approvedBy: row.reviewed_by ? str(row.reviewed_by) : undefined,
    approvedAt: row.reviewed_at ? str(row.reviewed_at) : undefined,
    rejectionReason: row.review_remarks ? str(row.review_remarks) : undefined,
    createdAt: str(row.created_at ?? row.createdAt),
    updatedAt: str(row.updated_at ?? row.updatedAt),
  }
}

export function mapPayrollPeriod(row: Row): PayrollPeriod {
  return {
    id: str(row.id),
    name: str(row.name),
    frequency: str(row.pay_frequency ?? row.frequency, 'semi-monthly').replace('-', '_') as PayrollPeriod['frequency'],
    startDate: str(row.start_date ?? row.startDate),
    endDate: str(row.end_date ?? row.endDate),
    payDate: str(row.pay_date ?? row.payDate),
    status: str(row.status).replace('released', 'paid') as PayrollPeriod['status'],
    createdAt: str(row.created_at ?? row.createdAt),
    updatedAt: str(row.updated_at ?? row.updatedAt),
  }
}

export function mapPayrollRecord(row: Row): PayrollRecord {
  return {
    id: str(row.id),
    payrollPeriodId: str(row.payroll_period_id ?? row.payrollPeriodId),
    payrollPeriod: row.period_name || row.pay_date
      ? {
          id: str(row.payroll_period_id ?? row.payrollPeriodId),
          name: str(row.period_name),
          frequency: 'semi_monthly',
          startDate: str(row.start_date),
          endDate: str(row.end_date),
          payDate: str(row.pay_date),
          status: (str(row.status) || 'draft') as PayrollPeriod['status'],
          createdAt: '',
          updatedAt: '',
        }
      : undefined,
    employeeId: str(row.employee_id ?? row.employeeId),
    employee: row.first_name ? mapEmployee(row) : undefined,
    basicPay: num(row.regular_pay ?? row.basic_pay ?? row.basic_salary),
    overtimePay: num(row.overtime_pay),
    holidayPay: num(row.holiday_pay),
    nightDifferential: num(row.night_diff_pay ?? row.night_differential),
    thirteenthMonthPay: num(row.thirteenth_month_pay),
    allowances: num(row.allowances),
    otherEarnings: num(row.other_earnings),
    grossPay: num(row.gross_pay),
    contributions: {
      sss: num(row.sss_employee),
      philhealth: num(row.phil_health_employee ?? row.philhealth_employee),
      pagibig: num(row.pag_ibig_employee ?? row.pagibig_employee),
      totalEmployee:
        num(row.sss_employee) +
        num(row.phil_health_employee ?? row.philhealth_employee) +
        num(row.pag_ibig_employee ?? row.pagibig_employee),
      sssEmployer: num(row.sss_employer),
      philhealthEmployer: num(row.phil_health_employer ?? row.philhealth_employer),
      pagibigEmployer: num(row.pag_ibig_employer ?? row.pagibig_employer),
      totalEmployer:
        num(row.sss_employer) +
        num(row.phil_health_employer ?? row.philhealth_employer) +
        num(row.pag_ibig_employer ?? row.pagibig_employer),
    },
    withholdingTax: num(row.withholding_tax),
    absenceDeduction: num(row.absence_deduction),
    lateDeduction: num(row.late_deduction),
    loanDeductions: num(row.loan_deductions),
    otherDeductions: num(row.other_deductions),
    totalDeductions: num(row.total_deductions),
    netPay: num(row.net_pay),
    daysWorked: num(row.days_worked),
    hoursWorked: num(row.hours_worked),
    overtimeHours: num(row.overtime_hours),
    absentDays: num(row.absent_days),
    lateDays: num(row.late_days),
    status: str(row.status).replace('released', 'paid') as PayrollRecord['status'],
    remarks: row.remarks ? str(row.remarks) : undefined,
    processedBy: row.processed_by ? str(row.processed_by) : undefined,
    processedAt: row.processed_at ? str(row.processed_at) : undefined,
    createdAt: str(row.created_at ?? row.createdAt),
    updatedAt: str(row.updated_at ?? row.updatedAt),
  }
}
