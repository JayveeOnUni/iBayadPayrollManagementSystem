// ─── Auth & Users ────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'employee'

export interface User {
  id: string
  email: string
  role: UserRole
  employeeId?: string
  firstName: string
  lastName: string
  avatarUrl?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

// ─── Department & Position ────────────────────────────────────────────────────

export interface Department {
  id: string
  name: string
  code: string
  headId?: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Position {
  id: string
  title: string
  departmentId: string
  department?: Department
  basicSalary: number
  salaryType: 'monthly' | 'daily' | 'hourly'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// ─── Employee ─────────────────────────────────────────────────────────────────

export type EmploymentStatus = 'active' | 'inactive' | 'resigned' | 'terminated' | 'on_leave'
export type CivilStatus = 'single' | 'married' | 'widowed' | 'separated'
export type EmploymentType = 'regular' | 'probationary' | 'contractual' | 'part_time'

export interface Employee {
  id: string
  employeeNumber: string
  firstName: string
  middleName?: string
  lastName: string
  email: string
  phone?: string
  birthDate: string
  gender: 'male' | 'female' | 'other'
  civilStatus: CivilStatus
  address: string
  city: string
  province: string
  zipCode: string

  // Employment details
  departmentId: string
  department?: Department
  positionId: string
  position?: Position
  employmentType: EmploymentType
  employmentStatus: EmploymentStatus
  hireDate: string
  regularizationDate?: string
  resignationDate?: string

  // Government IDs
  sssNumber?: string
  philhealthNumber?: string
  pagibigNumber?: string
  tinNumber?: string

  // Compensation
  basicSalary: number
  dailyRate: number
  hourlyRate: number

  // Banking
  bankName?: string
  bankAccountNumber?: string

  avatarUrl?: string
  shiftId?: string
  shift?: Shift

  userId?: string
  createdAt: string
  updatedAt: string
}

// ─── Shift ────────────────────────────────────────────────────────────────────

export interface Shift {
  id: string
  name: string
  startTime: string   // "08:00"
  endTime: string     // "17:00"
  breakMinutes: number
  workingHoursPerDay: number
  isNightShift: boolean
  createdAt: string
  updatedAt: string
}

// ─── Attendance ───────────────────────────────────────────────────────────────

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half_day' | 'on_leave' | 'holiday'

export interface AttendanceRecord {
  id: string
  employeeId: string
  employee?: Pick<Employee, 'id' | 'firstName' | 'lastName' | 'employeeNumber'>
  date: string
  timeIn?: string
  timeOut?: string
  hoursWorked: number
  overtimeHours: number
  lateMinutes: number
  undertimeMinutes: number
  status: AttendanceStatus
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface AttendanceRequest {
  id: string
  employeeId: string
  employee?: Pick<Employee, 'id' | 'firstName' | 'lastName' | 'employeeNumber'>
  date: string
  type: 'correction' | 'overtime' | 'undertime_excuse'
  requestedTimeIn?: string
  requestedTimeOut?: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  reviewedBy?: string
  reviewedAt?: string
  createdAt: string
  updatedAt: string
}

// ─── Leave ────────────────────────────────────────────────────────────────────

export type LeaveType = 'vacation' | 'sick' | 'emergency' | 'maternity' | 'paternity' | 'bereavement' | 'solo_parent' | 'others'
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'

export interface LeaveBalance {
  id: string
  employeeId: string
  leaveType: LeaveType
  allocated: number
  used: number
  remaining: number
  year: number
}

export interface LeaveApplication {
  id: string
  employeeId: string
  employee?: Pick<Employee, 'id' | 'firstName' | 'lastName' | 'employeeNumber'>
  leaveType: LeaveType
  startDate: string
  endDate: string
  totalDays: number
  reason: string
  status: LeaveStatus
  approvedBy?: string
  approvedAt?: string
  rejectionReason?: string
  createdAt: string
  updatedAt: string
}

// ─── Holiday ──────────────────────────────────────────────────────────────────

export type HolidayType = 'regular' | 'special_non_working' | 'special_working'

export interface Holiday {
  id: string
  name: string
  date: string
  type: HolidayType
  isRecurring: boolean
  createdAt: string
  updatedAt: string
}

// ─── Payroll ──────────────────────────────────────────────────────────────────

export type PayFrequency = 'weekly' | 'semi-monthly' | 'monthly'
export type PayrollStatus = 'draft' | 'processing' | 'approved' | 'released' | 'cancelled'

export interface PayrollPeriod {
  id: string
  name: string
  frequency: PayFrequency
  startDate: string
  endDate: string
  payDate: string
  status: PayrollStatus
  createdAt: string
  updatedAt: string
}

export interface GovernmentContributions {
  sss: number
  philhealth: number
  pagibig: number
  totalEmployee: number
  sssEmployer: number
  philhealthEmployer: number
  pagibigEmployer: number
  totalEmployer: number
}

export interface TaxWithholding {
  taxableIncome: number
  withholdingTax: number
  bracket: string
}

export interface PayrollRecord {
  id: string
  payrollPeriodId: string
  payrollPeriod?: PayrollPeriod
  employeeId: string
  employee?: Employee

  // Earnings
  basicPay: number
  overtimePay: number
  holidayPay: number
  nightDifferential: number
  thirteenthMonthPay: number
  allowances: number
  otherEarnings: number
  grossPay: number

  // Deductions
  contributions: GovernmentContributions
  withholdingTax: number
  absenceDeduction: number
  lateDeduction: number
  loanDeductions: number
  otherDeductions: number
  totalDeductions: number

  // Net
  netPay: number

  // Meta
  daysWorked: number
  hoursWorked: number
  overtimeHours: number
  absentDays: number
  lateDays: number

  status: PayrollStatus
  remarks?: string
  processedBy?: string
  processedAt?: string
  createdAt: string
  updatedAt: string
}

// ─── Loan ─────────────────────────────────────────────────────────────────────

export type LoanType = 'sss_loan' | 'pagibig_loan' | 'company_loan' | 'cash_advance'
export type LoanStatus = 'active' | 'fully_paid' | 'cancelled'

export interface Loan {
  id: string
  employeeId: string
  employee?: Pick<Employee, 'id' | 'firstName' | 'lastName' | 'employeeNumber'>
  loanType: LoanType
  principalAmount: number
  interestRate: number
  totalAmount: number
  monthlyAmortization: number
  balance: number
  startDate: string
  endDate: string
  status: LoanStatus
  createdAt: string
  updatedAt: string
}

// ─── Announcement ─────────────────────────────────────────────────────────────

export interface Announcement {
  id: string
  title: string
  content: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  targetAudience: 'all' | 'admin' | 'employee' | 'department'
  targetDepartmentId?: string
  publishedAt?: string
  expiresAt?: string
  isPublished: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
}

// ─── Role & Permissions ───────────────────────────────────────────────────────

export interface Permission {
  id: string
  module: string
  action: 'read' | 'create' | 'update' | 'delete'
  description: string
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

// ─── System Settings ──────────────────────────────────────────────────────────

export interface CompanySettings {
  companyName: string
  companyLogo?: string
  address: string
  city: string
  province: string
  zipCode: string
  phone: string
  email: string
  tin: string
  sssEmployerNumber: string
  philhealthEmployerNumber: string
  pagibigEmployerNumber: string
}

export interface PayrollSettings {
  payFrequency: PayFrequency
  semiMonthlyCutoff1: number
  semiMonthlyCutoff2: number
  semiMonthlyPayDay1: number
  semiMonthlyPayDay2: number
  workingHoursPerDay: number
  workingDaysPerWeek: number
  overtimeRate: number
  nightDifferentialStartTime: string
  nightDifferentialEndTime: string
  nightDifferentialRate: number
  regularHolidayRate: number
  specialHolidayRate: number
  thirteenthMonthEnabled: boolean
}

export interface LeaveSettings {
  vacationLeaveCredits: number
  sickLeaveCredits: number
  emergencyLeaveCredits: number
  leaveAccrualEnabled: boolean
  unusedLeaveConvertible: boolean
  unusedLeaveConversionRate: number
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export interface DashboardStats {
  totalEmployees: number
  activeEmployees: number
  onLeaveToday: number
  presentToday: number
  absentToday: number
  pendingLeaveRequests: number
  pendingAttendanceRequests: number
  upcomingPayDate?: string
  lastPayrollTotal?: number
  currentPeriod?: PayrollPeriod
}

export interface EmployeeDashboardData {
  employee: {
    id: string
    employeeNumber: string
    name: string
    firstName: string
    lastName: string
    email: string
    department?: string
    position?: string
  }
  attendanceToday: {
    id: string | null
    status: 'Not Timed In' | 'Timed In' | 'Timed Out'
    attendanceStatus: AttendanceStatus | null
    date: string
    timeIn: string | null
    timeOut: string | null
    totalHours: number
    scheduledStart: string
    scheduledEnd: string
    scheduledHours: number
    lateMinutes: number
    overtimeHours: number
  }
  monthlyAttendance: {
    presentDays: number
    lateDays: number
    absentDays: number
    halfDays: number
    leaveDays: number
    totalHours: number
    expectedHours: number
    shortageHours: number
    overtimeHours: number
    lateMinutes: number
  }
  leaveBalance: {
    vacationLeave: number
    sickLeave: number
    emergencyLeave: number
    totalAllowance: number
    totalTaken: number
    totalAvailable: number
    pendingRequests: number
    items: Array<{
      id: string
      name: string
      code: string
      isPaid: boolean
      allowance: number
      taken: number
      pending: number
      balance: number
    }>
  }
  announcements: Array<{
    id: string
    title: string
    message: string
    startDate: string | null
    endDate: string | null
    isPinned: boolean
    createdAt: string
  }>
  generatedAt: string
}

// ─── API Response wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
}

// ─── Form types ───────────────────────────────────────────────────────────────

export interface EmployeeFormData {
  firstName: string
  middleName?: string
  lastName: string
  email: string
  phone?: string
  birthDate: string
  gender: 'male' | 'female' | 'other'
  civilStatus: CivilStatus
  address: string
  city: string
  province: string
  zipCode: string
  departmentId: string
  positionId: string
  employmentType: EmploymentType
  hireDate: string
  basicSalary: number
  sssNumber?: string
  philhealthNumber?: string
  pagibigNumber?: string
  tinNumber?: string
  bankName?: string
  bankAccountNumber?: string
  shiftId?: string
}

export interface LeaveApplicationFormData {
  leaveType: LeaveType
  startDate: string
  endDate: string
  reason: string
}
