-- iBayad demo/test accounts
-- Run after schema.sql:
-- psql -U postgres -d ibayad_payroll -f server/src/db/seed-test-accounts.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

INSERT INTO departments (name, code, description)
VALUES
  ('Administration', 'ADMIN', 'System administration and executive operations'),
  ('Human Resources', 'HR', 'People operations and employee services'),
  ('Finance', 'FIN', 'Payroll, accounting, and finance operations'),
  ('Operations', 'OPS', 'Employee operations and service delivery')
ON CONFLICT (code) DO UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    updated_at = NOW();

INSERT INTO positions (title, code, department_id, base_salary, description)
VALUES
  ('Super Administrator', 'SUPER-ADMIN', (SELECT id FROM departments WHERE code = 'ADMIN'), 90000, 'Full system administration access'),
  ('Payroll Administrator', 'ADMIN', (SELECT id FROM departments WHERE code = 'ADMIN'), 75000, 'General payroll system administrator'),
  ('HR Administrator', 'HR-ADMIN', (SELECT id FROM departments WHERE code = 'HR'), 65000, 'Human resources administrator'),
  ('Finance Administrator', 'FIN-ADMIN', (SELECT id FROM departments WHERE code = 'FIN'), 70000, 'Finance and payroll approver'),
  ('Operations Employee', 'EMPLOYEE', (SELECT id FROM departments WHERE code = 'OPS'), 35000, 'Standard employee portal user')
ON CONFLICT (code) DO UPDATE
SET title = EXCLUDED.title,
    department_id = EXCLUDED.department_id,
    base_salary = EXCLUDED.base_salary,
    description = EXCLUDED.description,
    updated_at = NOW();

INSERT INTO employees (
  employee_number, first_name, last_name, email, phone, birth_date, gender, civil_status,
  address, city, province, zip_code, department_id, position_id, shift_id,
  employment_type, employment_status, hire_date, basic_salary, daily_rate, hourly_rate,
  sss_number, philhealth_number, pagibig_number, tin_number, bank_name, bank_account_number
)
VALUES
  ('TST-001', 'Sofia', 'Superadmin', 'super.admin@ibayad.test', '09170000001', '1988-01-15', 'female', 'single',
   'iBayad HQ', 'Pasig', 'Metro Manila', '1605',
   (SELECT id FROM departments WHERE code = 'ADMIN'),
   (SELECT id FROM positions WHERE code = 'SUPER-ADMIN'),
   (SELECT id FROM work_shifts WHERE name = 'Regular Day Shift' LIMIT 1),
   'regular', 'active', '2023-01-02', 90000, 4090.91, 511.36,
   '33-0000001-1', '12-000000001-1', '0001-0001-0001', '100-000-001-000', 'BDO', '0000000001'),
  ('TST-002', 'Alden', 'Admin', 'admin@ibayad.test', '09170000002', '1987-02-16', 'male', 'married',
   'iBayad HQ', 'Pasig', 'Metro Manila', '1605',
   (SELECT id FROM departments WHERE code = 'ADMIN'),
   (SELECT id FROM positions WHERE code = 'ADMIN'),
   (SELECT id FROM work_shifts WHERE name = 'Regular Day Shift' LIMIT 1),
   'regular', 'active', '2023-02-01', 75000, 3409.09, 426.14,
   '33-0000002-2', '12-000000002-2', '0002-0002-0002', '100-000-002-000', 'BDO', '0000000002'),
  ('TST-003', 'Hannah', 'HR', 'hr.admin@ibayad.test', '09170000003', '1990-03-17', 'female', 'single',
   'iBayad HQ', 'Pasig', 'Metro Manila', '1605',
   (SELECT id FROM departments WHERE code = 'HR'),
   (SELECT id FROM positions WHERE code = 'HR-ADMIN'),
   (SELECT id FROM work_shifts WHERE name = 'Regular Day Shift' LIMIT 1),
   'regular', 'active', '2023-03-01', 65000, 2954.55, 369.32,
   '33-0000003-3', '12-000000003-3', '0003-0003-0003', '100-000-003-000', 'BDO', '0000000003'),
  ('TST-004', 'Finn', 'Finance', 'finance.admin@ibayad.test', '09170000004', '1989-04-18', 'male', 'married',
   'iBayad HQ', 'Pasig', 'Metro Manila', '1605',
   (SELECT id FROM departments WHERE code = 'FIN'),
   (SELECT id FROM positions WHERE code = 'FIN-ADMIN'),
   (SELECT id FROM work_shifts WHERE name = 'Regular Day Shift' LIMIT 1),
   'regular', 'active', '2023-04-03', 70000, 3181.82, 397.73,
   '33-0000004-4', '12-000000004-4', '0004-0004-0004', '100-000-004-000', 'BDO', '0000000004'),
  ('TST-005', 'Emma', 'Employee', 'employee@ibayad.test', '09170000005', '1995-05-19', 'female', 'single',
   'iBayad HQ', 'Pasig', 'Metro Manila', '1605',
   (SELECT id FROM departments WHERE code = 'OPS'),
   (SELECT id FROM positions WHERE code = 'EMPLOYEE'),
   (SELECT id FROM work_shifts WHERE name = 'Regular Day Shift' LIMIT 1),
   'regular', 'active', '2023-05-02', 35000, 1590.91, 198.86,
   '33-0000005-5', '12-000000005-5', '0005-0005-0005', '100-000-005-000', 'BDO', '0000000005')
ON CONFLICT (employee_number) DO UPDATE
SET first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    department_id = EXCLUDED.department_id,
    position_id = EXCLUDED.position_id,
    shift_id = EXCLUDED.shift_id,
    employment_status = EXCLUDED.employment_status,
    basic_salary = EXCLUDED.basic_salary,
    daily_rate = EXCLUDED.daily_rate,
    hourly_rate = EXCLUDED.hourly_rate,
    updated_at = NOW();

WITH seeded_users AS (
  SELECT 'super.admin@ibayad.test' AS email, 'super_admin'::user_role AS role, 'TST-001' AS employee_number
  UNION ALL SELECT 'admin@ibayad.test', 'admin'::user_role, 'TST-002'
  UNION ALL SELECT 'hr.admin@ibayad.test', 'hr_admin'::user_role, 'TST-003'
  UNION ALL SELECT 'finance.admin@ibayad.test', 'finance_admin'::user_role, 'TST-004'
  UNION ALL SELECT 'employee@ibayad.test', 'employee'::user_role, 'TST-005'
)
INSERT INTO users (employee_id, email, password_hash, role, is_active)
SELECT e.id, su.email, crypt('Ibayad123!', gen_salt('bf', 10)), su.role, true
FROM seeded_users su
JOIN employees e ON e.employee_number = su.employee_number
ON CONFLICT (email) DO UPDATE
SET employee_id = EXCLUDED.employee_id,
    password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role,
    is_active = true,
    updated_at = NOW();

INSERT INTO payroll_periods (name, start_date, end_date, pay_date, pay_frequency, status)
VALUES ('Demo April 2026 - 1st Period', '2026-04-01', '2026-04-15', '2026-04-20', 'semi-monthly', 'draft')
ON CONFLICT DO NOTHING;
