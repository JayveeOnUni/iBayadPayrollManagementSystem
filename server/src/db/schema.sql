-- iBayad Payroll Management System
-- PostgreSQL Database Schema

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Enums ───────────────────────────────────────────────────────────────────

CREATE TYPE employment_type AS ENUM ('regular', 'probationary', 'contractual', 'part_time', 'intern');
CREATE TYPE employment_status AS ENUM ('active', 'inactive', 'terminated', 'resigned');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE civil_status AS ENUM ('single', 'married', 'widowed', 'separated');
CREATE TYPE pay_frequency AS ENUM ('weekly', 'semi-monthly', 'monthly');
CREATE TYPE payroll_status AS ENUM ('draft', 'processing', 'approved', 'released', 'cancelled');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'half_day', 'holiday', 'rest_day', 'on_leave');
CREATE TYPE leave_request_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');
CREATE TYPE user_role AS ENUM ('admin', 'employee');
CREATE TYPE loan_status AS ENUM ('active', 'paid', 'defaulted', 'cancelled');

-- ─── Departments ─────────────────────────────────────────────────────────────

CREATE TABLE departments (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          VARCHAR(100) NOT NULL,
  code          VARCHAR(20) UNIQUE NOT NULL,
  description   TEXT,
  manager_id    UUID,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Positions ───────────────────────────────────────────────────────────────

CREATE TABLE positions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         VARCHAR(100) NOT NULL,
  code          VARCHAR(20) UNIQUE NOT NULL,
  department_id UUID REFERENCES departments(id),
  base_salary   NUMERIC(12,2),
  description   TEXT,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Shifts ──────────────────────────────────────────────────────────────────

CREATE TABLE work_shifts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(100) NOT NULL,
  start_time      TIME NOT NULL,
  end_time        TIME NOT NULL,
  break_minutes   INT DEFAULT 60,
  work_hours      NUMERIC(4,2) DEFAULT 8,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Employees ───────────────────────────────────────────────────────────────

CREATE TABLE employees (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_number      VARCHAR(20) UNIQUE NOT NULL,
  first_name           VARCHAR(100) NOT NULL,
  middle_name          VARCHAR(100),
  last_name            VARCHAR(100) NOT NULL,
  suffix               VARCHAR(10),
  email                VARCHAR(255) UNIQUE NOT NULL,
  phone                VARCHAR(20),
  birth_date           DATE,
  gender               gender_type,
  civil_status         civil_status,
  nationality          VARCHAR(50) DEFAULT 'Filipino',
  -- Address
  address              TEXT,
  city                 VARCHAR(100),
  province             VARCHAR(100),
  zip_code             VARCHAR(10),
  -- Employment
  department_id        UUID REFERENCES departments(id),
  position_id          UUID REFERENCES positions(id),
  shift_id             UUID REFERENCES work_shifts(id),
  employment_type      employment_type DEFAULT 'regular',
  employment_status    employment_status DEFAULT 'active',
  hire_date            DATE NOT NULL,
  regularization_date  DATE,
  separation_date      DATE,
  -- Salary
  basic_salary         NUMERIC(12,2) NOT NULL,
  daily_rate           NUMERIC(10,4),
  hourly_rate          NUMERIC(10,4),
  work_days_per_month  INT DEFAULT 22,
  work_hours_per_day   INT DEFAULT 8,
  -- Government IDs
  sss_number           VARCHAR(30),
  philhealth_number    VARCHAR(30),
  pagibig_number       VARCHAR(30),
  tin_number           VARCHAR(30),
  -- Banking
  bank_name            VARCHAR(100),
  bank_account_number  VARCHAR(50),
  -- Profile
  avatar_url           TEXT,
  notes                TEXT,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- Dept manager FK (deferred to avoid circular dependency)
ALTER TABLE departments ADD CONSTRAINT fk_dept_manager
  FOREIGN KEY (manager_id) REFERENCES employees(id) DEFERRABLE INITIALLY DEFERRED;

-- ─── Users ───────────────────────────────────────────────────────────────────

CREATE TABLE users (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id           UUID UNIQUE REFERENCES employees(id) ON DELETE SET NULL,
  email                 VARCHAR(255) UNIQUE NOT NULL,
  password_hash         TEXT,
  role                  user_role NOT NULL DEFAULT 'employee',
  is_active             BOOLEAN DEFAULT true,
  activation_token_hash TEXT,
  activation_token_expires_at TIMESTAMPTZ,
  activation_sent_at    TIMESTAMPTZ,
  activated_at          TIMESTAMPTZ,
  refresh_token_hash    TEXT,
  last_login_at         TIMESTAMPTZ,
  two_factor_enabled    BOOLEAN DEFAULT false,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Payroll Periods ─────────────────────────────────────────────────────────

CREATE TABLE payroll_periods (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           VARCHAR(100) NOT NULL,
  start_date     DATE NOT NULL,
  end_date       DATE NOT NULL,
  pay_date       DATE NOT NULL,
  pay_frequency  pay_frequency DEFAULT 'semi-monthly',
  status         payroll_status DEFAULT 'draft',
  created_by     UUID REFERENCES users(id),
  approved_by    UUID REFERENCES users(id),
  approved_at    TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Payroll Records ─────────────────────────────────────────────────────────

CREATE TABLE payroll_records (
  id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id            UUID NOT NULL REFERENCES employees(id),
  payroll_period_id      UUID NOT NULL REFERENCES payroll_periods(id),
  -- Base
  basic_salary           NUMERIC(12,2) NOT NULL,
  daily_rate             NUMERIC(10,4),
  hourly_rate            NUMERIC(10,4),
  -- Earnings
  regular_pay            NUMERIC(12,2) DEFAULT 0,
  overtime_pay           NUMERIC(12,2) DEFAULT 0,
  holiday_pay            NUMERIC(12,2) DEFAULT 0,
  night_diff_pay         NUMERIC(12,2) DEFAULT 0,
  allowances             NUMERIC(12,2) DEFAULT 0,
  other_earnings         NUMERIC(12,2) DEFAULT 0,
  gross_pay              NUMERIC(12,2) DEFAULT 0,
  -- Deductions
  absence_deduction      NUMERIC(12,2) DEFAULT 0,
  late_deduction         NUMERIC(12,2) DEFAULT 0,
  sss_employee           NUMERIC(10,2) DEFAULT 0,
  phil_health_employee   NUMERIC(10,2) DEFAULT 0,
  pag_ibig_employee      NUMERIC(10,2) DEFAULT 0,
  withholding_tax        NUMERIC(12,2) DEFAULT 0,
  loan_deductions        NUMERIC(12,2) DEFAULT 0,
  other_deductions       NUMERIC(12,2) DEFAULT 0,
  total_deductions       NUMERIC(12,2) DEFAULT 0,
  -- Employer contributions
  sss_employer           NUMERIC(10,2) DEFAULT 0,
  phil_health_employer   NUMERIC(10,2) DEFAULT 0,
  pag_ibig_employer      NUMERIC(10,2) DEFAULT 0,
  -- Net
  net_pay                NUMERIC(12,2) NOT NULL DEFAULT 0,
  status                 payroll_status DEFAULT 'draft',
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (employee_id, payroll_period_id)
);

-- ─── Attendance ──────────────────────────────────────────────────────────────

CREATE TABLE attendance (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id           UUID NOT NULL REFERENCES employees(id),
  date                  DATE NOT NULL,
  time_in               TIMESTAMPTZ,
  time_out              TIMESTAMPTZ,
  status                attendance_status DEFAULT 'present',
  late_minutes          INT DEFAULT 0,
  overtime_hours        NUMERIC(5,2) DEFAULT 0,
  holiday_hours         NUMERIC(5,2) DEFAULT 0,
  night_diff_hours      NUMERIC(5,2) DEFAULT 0,
  total_worked_minutes  INT DEFAULT 0,
  remarks               TEXT,
  created_by            UUID REFERENCES users(id),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (employee_id, date)
);

CREATE TABLE attendance_requests (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id           UUID NOT NULL REFERENCES employees(id),
  date                  DATE NOT NULL,
  requested_status      attendance_status,
  requested_time_in     TIMESTAMPTZ,
  requested_time_out    TIMESTAMPTZ,
  reason                TEXT NOT NULL,
  status                leave_request_status DEFAULT 'pending',
  reviewed_by           UUID REFERENCES users(id),
  reviewed_at           TIMESTAMPTZ,
  review_remarks        TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Leave Types ─────────────────────────────────────────────────────────────

CREATE TABLE leave_types (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(100) NOT NULL,
  code            VARCHAR(20) UNIQUE NOT NULL,
  days_per_year   NUMERIC(5,1) NOT NULL DEFAULT 0,
  is_paid         BOOLEAN DEFAULT true,
  is_convertible  BOOLEAN DEFAULT false,
  requires_docs   BOOLEAN DEFAULT false,
  description     TEXT,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Leave Requests ──────────────────────────────────────────────────────────

CREATE TABLE leave_requests (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id       UUID NOT NULL REFERENCES employees(id),
  leave_type_id     UUID NOT NULL REFERENCES leave_types(id),
  start_date        DATE NOT NULL,
  end_date          DATE NOT NULL,
  total_days        NUMERIC(5,1) NOT NULL,
  reason            TEXT NOT NULL,
  is_half_day       BOOLEAN DEFAULT false,
  supporting_doc    TEXT,
  status            leave_request_status DEFAULT 'pending',
  reviewed_by       UUID REFERENCES users(id),
  reviewed_at       TIMESTAMPTZ,
  review_remarks    TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Loans ───────────────────────────────────────────────────────────────────

CREATE TABLE loans (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id     UUID NOT NULL REFERENCES employees(id),
  loan_type       VARCHAR(50) NOT NULL, -- 'sss_loan', 'company_loan', 'cash_advance'
  principal       NUMERIC(12,2) NOT NULL,
  balance         NUMERIC(12,2) NOT NULL,
  monthly_payment NUMERIC(12,2) NOT NULL,
  interest_rate   NUMERIC(5,4) DEFAULT 0,
  start_date      DATE NOT NULL,
  end_date        DATE,
  status          loan_status DEFAULT 'active',
  notes           TEXT,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Announcements ───────────────────────────────────────────────────────────

CREATE TABLE announcements (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       VARCHAR(255) NOT NULL,
  content     TEXT NOT NULL,
  start_date  DATE,
  end_date    DATE,
  is_pinned   BOOLEAN DEFAULT false,
  created_by  UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Holidays ────────────────────────────────────────────────────────────────

CREATE TABLE holidays (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          VARCHAR(100) NOT NULL,
  date          DATE NOT NULL,
  type          VARCHAR(20) NOT NULL CHECK (type IN ('regular', 'special_non_working')),
  is_recurring  BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Audit Logs ──────────────────────────────────────────────────────────────

CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id),
  action      VARCHAR(100) NOT NULL,
  entity      VARCHAR(50) NOT NULL,
  entity_id   UUID,
  old_values  JSONB,
  new_values  JSONB,
  ip_address  INET,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── System Settings ─────────────────────────────────────────────────────────

CREATE TABLE system_settings (
  key         VARCHAR(100) PRIMARY KEY,
  value       JSONB NOT NULL,
  description TEXT,
  updated_by  UUID REFERENCES users(id),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────

CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_status ON employees(employment_status);
CREATE INDEX idx_users_activation_token_hash ON users(activation_token_hash) WHERE activation_token_hash IS NOT NULL;
CREATE INDEX idx_attendance_employee_date ON attendance(employee_id, date);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_leave_requests_employee ON leave_requests(employee_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_payroll_records_period ON payroll_records(payroll_period_id);
CREATE INDEX idx_payroll_records_employee ON payroll_records(employee_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity, entity_id);

-- ─── Seed: Default Leave Types ───────────────────────────────────────────────

INSERT INTO leave_types (name, code, days_per_year, is_paid, description) VALUES
  ('Vacation Leave', 'VL', 15, true, 'Annual vacation leave credits'),
  ('Sick Leave', 'SL', 15, true, 'Sick leave for health-related absences'),
  ('Emergency Leave', 'EL', 5, true, 'Emergency and bereavement leave'),
  ('Maternity Leave', 'ML', 105, true, 'Maternity leave per RA 11210'),
  ('Paternity Leave', 'PL', 7, true, 'Paternity leave per RA 8187'),
  ('Solo Parent Leave', 'SPL', 7, true, 'Solo parent leave per RA 8972');

-- ─── Seed: Default Work Shift ────────────────────────────────────────────────

INSERT INTO work_shifts (name, start_time, end_time, break_minutes, work_hours) VALUES
  ('Regular Day Shift', '08:00', '17:00', 60, 8),
  ('Morning Shift', '06:00', '14:00', 30, 8),
  ('Night Shift', '22:00', '06:00', 30, 8);

-- ─── Seed: Default System Settings ──────────────────────────────────────────

INSERT INTO system_settings (key, value, description) VALUES
  ('company_name', '"iBayad Corporation"', 'Company name'),
  ('pay_frequency', '"semi-monthly"', 'Default pay frequency'),
  ('work_days_per_month', '22', 'Standard working days per month'),
  ('work_hours_per_day', '8', 'Standard working hours per day'),
  ('overtime_rate', '1.25', 'Overtime rate multiplier'),
  ('holiday_rate', '2.0', 'Regular holiday rate multiplier'),
  ('night_differential_rate', '0.10', 'Night differential rate (10%)');
