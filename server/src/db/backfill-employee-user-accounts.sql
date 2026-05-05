-- Creates login accounts for active employee profiles that do not have one yet.
-- Useful for employees created before POST /api/employees created linked users.
-- Temporary password: Ibayad123!

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

INSERT INTO users (employee_id, email, password_hash, role, is_active)
SELECT e.id, e.email, crypt('Ibayad123!', gen_salt('bf', 10)), 'employee'::user_role, true
FROM employees e
LEFT JOIN users linked_user ON linked_user.employee_id = e.id
WHERE linked_user.id IS NULL
  AND e.employment_status = 'active'
  AND NOT EXISTS (
    SELECT 1
    FROM users email_user
    WHERE email_user.email = e.email
  );
