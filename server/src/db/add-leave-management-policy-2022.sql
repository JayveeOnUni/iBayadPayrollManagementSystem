-- Leave Management Module - Implementation of Leaves Effective Year 2022
-- Additive migration for the memo-backed leave policy.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'leave_day_count_type') THEN
    CREATE TYPE leave_day_count_type AS ENUM ('working_days', 'calendar_days');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'leave_document_status') THEN
    CREATE TYPE leave_document_status AS ENUM ('pending', 'verified', 'rejected');
  END IF;
END $$;

ALTER TABLE leave_types
  ADD COLUMN IF NOT EXISTS is_accrual_based BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS requires_balance BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS applies_to_probationary BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS applies_to_regular BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS max_days_per_request NUMERIC(6,2),
  ADD COLUMN IF NOT EXISTS filing_deadline_days INT,
  ADD COLUMN IF NOT EXISTS filing_deadline_type VARCHAR(30),
  ADD COLUMN IF NOT EXISTS requires_document BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS document_rule TEXT,
  ADD COLUMN IF NOT EXISTS is_cash_convertible BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_carry_over_allowed BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_statutory BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS day_count_type leave_day_count_type DEFAULT 'working_days',
  ADD COLUMN IF NOT EXISTS policy_notes TEXT;

UPDATE leave_types SET code = 'VACATION' WHERE code IN ('VL', 'VACATION') OR LOWER(name) = 'vacation leave';
UPDATE leave_types SET code = 'SICK' WHERE code IN ('SL', 'SICK') OR LOWER(name) = 'sick leave';
UPDATE leave_types SET code = 'EMERGENCY' WHERE code IN ('EL', 'EMERGENCY') OR LOWER(name) = 'emergency leave';
UPDATE leave_types SET code = 'MATERNITY' WHERE code IN ('ML', 'MATERNITY') OR LOWER(name) = 'maternity leave';
UPDATE leave_types SET code = 'PATERNITY' WHERE code IN ('PL', 'PATERNITY') OR LOWER(name) = 'paternity leave';

INSERT INTO leave_types (
  name, code, days_per_year, is_paid, is_convertible, requires_docs, description, is_active,
  is_accrual_based, requires_balance, applies_to_probationary, applies_to_regular,
  max_days_per_request, filing_deadline_days, filing_deadline_type, requires_document,
  document_rule, is_cash_convertible, is_carry_over_allowed, is_statutory, day_count_type, policy_notes
) VALUES
  ('Vacation Leave', 'VACATION', 15, true, true, false, 'Paid vacation leave credits under the 2022 leave memo.', true, true, true, false, true, 3, 7, 'working_days_before_start', false, 'Vacation Leave Form by email; file 7 working days before requested date.', true, true, false, 'working_days', 'Conflict unresolved: memo says max 3 consecutive days but also routes more than 3 days to department head.'),
  ('Sick Leave', 'SICK', 15, true, false, true, 'Paid sick leave credits under the 2022 leave memo.', true, true, true, false, true, NULL, NULL, 'one_hour_before_shift', true, 'Medical certificate required if more than 2 days; medical clearance required for contagious disease.', false, false, false, 'working_days', 'Memo uses notice language; approval workflow requires HR confirmation.'),
  ('Emergency Leave', 'EMERGENCY', 0, true, false, false, 'Emergency leave deducted from sick credits, then vacation credits, then unpaid excess.', true, false, false, true, true, NULL, NULL, 'one_hour_before_shift', false, 'Emergency documentation requirement is not specified in the memo.', false, false, false, 'working_days', 'Regular employees use sick then vacation credits; probationary emergency leave is unpaid.'),
  ('Bereavement Leave', 'BEREAVEMENT', 5, false, false, false, 'Bereavement leave for immediate family members.', true, false, false, true, true, 5, NULL, NULL, false, 'Supporting documents not specified in memo.', false, false, false, 'working_days', 'Paid/unpaid and deduction behavior are unresolved and configurable.'),
  ('Non-Paid Leave', 'NON_PAID', 0, false, false, false, 'Unpaid leave classification for unsupported, unapproved, or excess leave.', true, false, false, true, true, NULL, NULL, NULL, false, NULL, false, false, false, 'working_days', 'Creates payroll deduction records.'),
  ('Maternity Leave', 'MATERNITY', 105, true, false, false, '105 calendar days statutory paid maternity leave under RA 11210.', true, false, false, true, true, 105, NULL, NULL, false, 'Detailed guidelines are in separate maternity leave policy.', false, false, true, 'calendar_days', 'First four deliveries only; childbirth and miscarriage included; SSS reimbursable allowance.'),
  ('Paternity Leave', 'PATERNITY', 7, true, false, false, '7 working days statutory paid paternity leave.', true, false, false, true, true, 7, NULL, NULL, false, 'Supporting documents not specified in memo.', false, false, true, 'working_days', 'First four legitimate spouse deliveries; within 60 calendar days before or after delivery.')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  days_per_year = EXCLUDED.days_per_year,
  is_paid = EXCLUDED.is_paid,
  is_convertible = EXCLUDED.is_convertible,
  requires_docs = EXCLUDED.requires_docs,
  description = EXCLUDED.description,
  is_active = true,
  is_accrual_based = EXCLUDED.is_accrual_based,
  requires_balance = EXCLUDED.requires_balance,
  applies_to_probationary = EXCLUDED.applies_to_probationary,
  applies_to_regular = EXCLUDED.applies_to_regular,
  max_days_per_request = EXCLUDED.max_days_per_request,
  filing_deadline_days = EXCLUDED.filing_deadline_days,
  filing_deadline_type = EXCLUDED.filing_deadline_type,
  requires_document = EXCLUDED.requires_document,
  document_rule = EXCLUDED.document_rule,
  is_cash_convertible = EXCLUDED.is_cash_convertible,
  is_carry_over_allowed = EXCLUDED.is_carry_over_allowed,
  is_statutory = EXCLUDED.is_statutory,
  day_count_type = EXCLUDED.day_count_type,
  policy_notes = EXCLUDED.policy_notes,
  updated_at = NOW();

CREATE TABLE IF NOT EXISTS leave_policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  leave_type_id UUID NOT NULL REFERENCES leave_types(id),
  effective_date DATE NOT NULL DEFAULT DATE '2022-01-01',
  employment_status VARCHAR(30) NOT NULL,
  entitlement_days NUMERIC(6,2) NOT NULL DEFAULT 0,
  monthly_credit NUMERIC(6,2) NOT NULL DEFAULT 0,
  carry_over_limit NUMERIC(6,2),
  cash_conversion_limit NUMERIC(6,2),
  forfeiture_rule TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_leave_policies_unique
  ON leave_policies (leave_type_id, effective_date, employment_status, entitlement_days, monthly_credit);

INSERT INTO leave_policies (leave_type_id, effective_date, employment_status, entitlement_days, monthly_credit, carry_over_limit, cash_conversion_limit, forfeiture_rule, notes)
SELECT lt.id, DATE '2022-01-01', p.employment_status, p.entitlement_days, p.monthly_credit, p.carry_over_limit, p.cash_conversion_limit, p.forfeiture_rule, p.notes
FROM leave_types lt
JOIN (
  VALUES
    ('VACATION', 'pre_2022_regular', 15.00, 1.25, 10.00, 5.00, 'Forfeit unused credits above 10 by Dec 31; convert up to 5 carried-over credits by Jun 30; forfeit excess.', 'Regular on or before Dec 31, 2021.'),
    ('VACATION', 'probationary', 0.00, 0.00, NULL, NULL, NULL, 'Probationary period is 6 months from hire date.'),
    ('VACATION', 'regular_first_entitlement', 5.00, 0.42, 10.00, 5.00, 'Same vacation carry-over, forfeiture, and conversion rules.', 'Exact entitlement progression requires HR confirmation.'),
    ('VACATION', 'regular_following_entitlement', 10.00, 0.83, 10.00, 5.00, 'Same vacation carry-over, forfeiture, and conversion rules.', 'Exact entitlement progression requires HR confirmation.'),
    ('VACATION', 'regular_later_entitlement', 15.00, 1.25, 10.00, 5.00, 'Same vacation carry-over, forfeiture, and conversion rules.', 'Exact entitlement progression requires HR confirmation.'),
    ('SICK', 'pre_2022_regular', 15.00, 1.25, NULL, NULL, 'Unused sick leave is not carried over and not converted to cash.', 'Regular on or before Dec 31, 2021.'),
    ('SICK', 'probationary', 0.00, 0.00, NULL, NULL, NULL, 'Probationary period is 6 months from hire date.'),
    ('SICK', 'regular_first_entitlement', 5.00, 0.42, NULL, NULL, 'Unused sick leave is not carried over and not converted to cash.', 'Exact entitlement progression requires HR confirmation.'),
    ('SICK', 'regular_following_entitlement', 10.00, 0.83, NULL, NULL, 'Unused sick leave is not carried over and not converted to cash.', 'Exact entitlement progression requires HR confirmation.'),
    ('SICK', 'regular_later_entitlement', 15.00, 1.25, NULL, NULL, 'Unused sick leave is not carried over and not converted to cash.', 'Exact entitlement progression requires HR confirmation.'),
    ('MATERNITY', 'statutory', 105.00, 0.00, NULL, NULL, 'Cannot be converted to cash.', 'First four deliveries only.'),
    ('PATERNITY', 'statutory', 7.00, 0.00, NULL, NULL, 'Not cumulative and cannot be converted to cash.', 'First four legitimate spouse deliveries only.')
) AS p(code, employment_status, entitlement_days, monthly_credit, carry_over_limit, cash_conversion_limit, forfeiture_rule, notes)
  ON lt.code = p.code
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS leave_balances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id),
  leave_type_id UUID NOT NULL REFERENCES leave_types(id),
  year INT NOT NULL,
  opening_balance NUMERIC(8,2) DEFAULT 0,
  earned_credits NUMERIC(8,2) DEFAULT 0,
  used_credits NUMERIC(8,2) DEFAULT 0,
  pending_credits NUMERIC(8,2) DEFAULT 0,
  carried_over_credits NUMERIC(8,2) DEFAULT 0,
  forfeited_credits NUMERIC(8,2) DEFAULT 0,
  converted_to_cash_credits NUMERIC(8,2) DEFAULT 0,
  available_balance NUMERIC(8,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (employee_id, leave_type_id, year)
);

ALTER TABLE leave_requests
  ADD COLUMN IF NOT EXISTS emergency_reason_category VARCHAR(80),
  ADD COLUMN IF NOT EXISTS day_count_type leave_day_count_type DEFAULT 'working_days',
  ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS unpaid_days NUMERIC(6,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS deducted_sick_days NUMERIC(6,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS deducted_vacation_days NUMERIC(6,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS deducted_other_days NUMERIC(6,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payroll_impact_status VARCHAR(40) DEFAULT 'not_applied',
  ADD COLUMN IF NOT EXISTS attendance_impact_status VARCHAR(40) DEFAULT 'not_applied',
  ADD COLUMN IF NOT EXISTS notification_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS notification_method VARCHAR(40),
  ADD COLUMN IF NOT EXISTS email_follow_up_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS is_contagious BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS delivery_date DATE,
  ADD COLUMN IF NOT EXISTS delivery_count INT,
  ADD COLUMN IF NOT EXISTS spouse_delivery_count INT,
  ADD COLUMN IF NOT EXISTS relationship_to_deceased VARCHAR(80),
  ADD COLUMN IF NOT EXISTS acknowledged_policy BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS leave_approval_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  leave_request_id UUID NOT NULL REFERENCES leave_requests(id) ON DELETE CASCADE,
  action_by_employee_id UUID REFERENCES employees(id),
  action_by_user_id UUID REFERENCES users(id),
  action_role VARCHAR(50),
  previous_status VARCHAR(60),
  new_status VARCHAR(60),
  action VARCHAR(60) NOT NULL,
  remarks TEXT,
  action_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leave_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  leave_request_id UUID NOT NULL REFERENCES leave_requests(id) ON DELETE CASCADE,
  document_type VARCHAR(80) NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  mime_type VARCHAR(120),
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMPTZ,
  status leave_document_status DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS payroll_leave_adjustments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payroll_period_id UUID REFERENCES payroll_periods(id),
  employee_id UUID NOT NULL REFERENCES employees(id),
  leave_request_id UUID REFERENCES leave_requests(id),
  adjustment_type VARCHAR(80) NOT NULL,
  days NUMERIC(8,2) NOT NULL DEFAULT 0,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  description TEXT,
  status VARCHAR(40) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  applied_at TIMESTAMPTZ
);

ALTER TABLE holidays
  ADD COLUMN IF NOT EXISTS holiday_date DATE,
  ADD COLUMN IF NOT EXISTS holiday_type VARCHAR(40),
  ADD COLUMN IF NOT EXISTS country VARCHAR(80) DEFAULT 'Philippines',
  ADD COLUMN IF NOT EXISTS city_or_province VARCHAR(120),
  ADD COLUMN IF NOT EXISTS is_working_holiday BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS source TEXT;

UPDATE holidays
SET holiday_date = COALESCE(holiday_date, date),
    holiday_type = COALESCE(holiday_type, type),
    is_working_holiday = COALESCE(is_working_holiday, type = 'special_working')
WHERE holiday_date IS NULL OR holiday_type IS NULL;

CREATE INDEX IF NOT EXISTS idx_leave_requests_employee_dates ON leave_requests(employee_id, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_leave_documents_request ON leave_documents(leave_request_id);
CREATE INDEX IF NOT EXISTS idx_leave_approval_history_request ON leave_approval_history(leave_request_id);
CREATE INDEX IF NOT EXISTS idx_payroll_leave_adjustments_period ON payroll_leave_adjustments(payroll_period_id);
CREATE INDEX IF NOT EXISTS idx_holidays_location_date ON holidays(country, city_or_province, holiday_date);
