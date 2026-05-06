-- Creates inactive user records for active employee profiles that do not have one yet.
-- This does not generate usable activation links. Resend activation from an admin
-- endpoint/UI after creating these records.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

INSERT INTO users (employee_id, email, role, is_active)
SELECT e.id, e.email, 'employee'::user_role, false
FROM employees e
LEFT JOIN users linked_user ON linked_user.employee_id = e.id
WHERE linked_user.id IS NULL
  AND e.employment_status = 'active'
  AND NOT EXISTS (
    SELECT 1
    FROM users email_user
    WHERE email_user.email = e.email
  );
