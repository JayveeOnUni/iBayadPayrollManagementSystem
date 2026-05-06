-- Adds one-time employee account activation support.
-- Run this against databases created before users gained activation fields.

ALTER TABLE users
  ALTER COLUMN password_hash DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS activation_token_hash TEXT,
  ADD COLUMN IF NOT EXISTS activation_token_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS activation_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS activated_at TIMESTAMPTZ;

UPDATE users
SET activated_at = COALESCE(activated_at, created_at)
WHERE is_active = true
  AND password_hash IS NOT NULL
  AND activated_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_users_activation_token_hash
  ON users(activation_token_hash)
  WHERE activation_token_hash IS NOT NULL;
