-- Payroll Operations Workspace
-- Additive indexes used by period summaries, lifecycle filtering, records, and audit history.

CREATE INDEX IF NOT EXISTS idx_payroll_periods_status_start
  ON payroll_periods(status, start_date DESC);

CREATE INDEX IF NOT EXISTS idx_payroll_periods_pay_date
  ON payroll_periods(pay_date);

CREATE INDEX IF NOT EXISTS idx_payroll_records_period_status
  ON payroll_records(payroll_period_id, status);

CREATE INDEX IF NOT EXISTS idx_audit_logs_payroll_period
  ON audit_logs(entity, entity_id, created_at DESC)
  WHERE entity = 'payroll_period';
