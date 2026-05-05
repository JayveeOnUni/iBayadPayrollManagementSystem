-- Collapse existing user roles to the supported Admin and Employee roles.
-- Run this against databases created before user_role was reduced to admin/employee.

BEGIN;

UPDATE users
SET role = 'admin'
WHERE role::text IN ('super_admin', 'hr_admin', 'finance_admin');

ALTER TABLE users ALTER COLUMN role DROP DEFAULT;

CREATE TYPE user_role_new AS ENUM ('admin', 'employee');

ALTER TABLE users
  ALTER COLUMN role TYPE user_role_new
  USING role::text::user_role_new;

DROP TYPE user_role;
ALTER TYPE user_role_new RENAME TO user_role;

ALTER TABLE users ALTER COLUMN role SET DEFAULT 'employee';

COMMIT;
