import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import pool from '../utils/db'
import { asyncHandler, createError } from '../middleware/errorHandler'
import type { AuthPayload } from '../middleware/auth'

function signAccessToken(payload: AuthPayload): string {
  const secret = process.env.JWT_SECRET!
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  } as jwt.SignOptions)
}

function signRefreshToken(payload: AuthPayload): string {
  const secret = process.env.JWT_REFRESH_SECRET!
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  } as jwt.SignOptions)
}

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw createError('Email and password are required', 400)
  }

  // Fetch user
  const result = await pool.query(
    `SELECT u.*, e.id AS employee_id, e.first_name, e.last_name
     FROM users u
     LEFT JOIN employees e ON u.employee_id = e.id
     WHERE u.email = $1`,
    [email]
  )

  const user = result.rows[0]
  if (!user) {
    throw createError('Invalid email or password', 401)
  }

  if (!user.password_hash && user.activation_token_hash) {
    throw createError('Activate your account before signing in', 403)
  }
  if (!user.is_active || !user.password_hash) {
    throw createError('Account is inactive', 403)
  }

  const isMatch = await bcrypt.compare(password, user.password_hash)
  if (!isMatch) {
    throw createError('Invalid email or password', 401)
  }

  const payload: AuthPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    employeeId: user.employee_id,
  }

  const accessToken = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)

  // Store refresh token hash
  await pool.query(
    `UPDATE users SET refresh_token_hash = $1, last_login_at = NOW() WHERE id = $2`,
    [await bcrypt.hash(refreshToken, 8), user.id]
  )

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        employeeId: user.employee_id,
        firstName: user.first_name,
        lastName: user.last_name,
        isActive: user.is_active,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
      tokens: { accessToken, refreshToken },
    },
  })
})

export const verifyActivationToken = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body
  if (!token) throw createError('Activation token is required', 400)

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  const result = await pool.query(
    `SELECT u.id, u.email, u.password_hash, u.activated_at,
            u.activation_token_expires_at,
            e.first_name, e.last_name
     FROM users u
     LEFT JOIN employees e ON e.id = u.employee_id
     WHERE u.activation_token_hash = $1`,
    [tokenHash]
  )

  const user = result.rows[0]
  if (!user) throw createError('Activation link is invalid or has already been used', 400)
  if (user.activated_at || user.password_hash) throw createError('Account is already activated', 400)

  const expiresAt = user.activation_token_expires_at
  if (!expiresAt || new Date(expiresAt).getTime() <= Date.now()) {
    throw createError('Activation link has expired', 400)
  }

  res.json({
    success: true,
    data: {
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      expiresAt,
    },
  })
})

export const activateAccount = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body
  if (!token || !password) throw createError('Activation token and password are required', 400)
  if (String(password).length < 8) throw createError('Password must be at least 8 characters', 400)

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  const result = await pool.query(
    `SELECT id, activation_token_expires_at, activated_at, password_hash
     FROM users
     WHERE activation_token_hash = $1`,
    [tokenHash]
  )

  const user = result.rows[0]
  if (!user) throw createError('Activation link is invalid or has already been used', 400)
  if (user.activated_at || user.password_hash) throw createError('Account is already activated', 400)

  const expiresAt = user.activation_token_expires_at
  if (!expiresAt || new Date(expiresAt).getTime() <= Date.now()) {
    throw createError('Activation link has expired', 400)
  }

  const passwordHash = await bcrypt.hash(password, 12)
  await pool.query(
    `UPDATE users
     SET password_hash = $1,
         is_active = true,
         activated_at = NOW(),
         activation_token_hash = NULL,
         activation_token_expires_at = NULL,
         refresh_token_hash = NULL,
         updated_at = NOW()
     WHERE id = $2`,
    [passwordHash, user.id]
  )

  res.json({ success: true, message: 'Account activated successfully. You can now sign in.' })
})

export const logout = asyncHandler(async (req: Request, res: Response) => {
  if (req.user) {
    await pool.query(
      `UPDATE users SET refresh_token_hash = NULL WHERE id = $1`,
      [req.user.userId]
    )
  }
  res.json({ success: true, message: 'Logged out successfully' })
})

export const me = asyncHandler(async (req: Request, res: Response) => {
  const result = await pool.query(
    `SELECT u.id, u.email, u.role, u.is_active, u.created_at, u.updated_at,
            e.id AS employee_id, e.first_name, e.last_name, e.avatar_url
     FROM users u
     LEFT JOIN employees e ON u.employee_id = e.id
     WHERE u.id = $1`,
    [req.user!.userId]
  )

  const user = result.rows[0]
  if (!user) throw createError('User not found', 404)

  res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employee_id,
      firstName: user.first_name,
      lastName: user.last_name,
      avatarUrl: user.avatar_url,
      isActive: user.is_active,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    },
  })
})

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken: token } = req.body
  if (!token) throw createError('Refresh token required', 400)

  let decoded: AuthPayload
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as AuthPayload
  } catch {
    throw createError('Invalid or expired refresh token', 401)
  }

  const result = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId])
  const user = result.rows[0]
  if (!user || !user.refresh_token_hash) throw createError('Session not found', 401)

  const isValid = await bcrypt.compare(token, user.refresh_token_hash)
  if (!isValid) throw createError('Invalid refresh token', 401)

  const payload: AuthPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    employeeId: user.employee_id,
  }

  const newAccessToken = signAccessToken(payload)
  res.json({ success: true, data: { accessToken: newAccessToken } })
})

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body
  if (!currentPassword || !newPassword) {
    throw createError('Current and new passwords are required', 400)
  }

  const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.user!.userId])
  const user = result.rows[0]

  const isMatch = await bcrypt.compare(currentPassword, user.password_hash)
  if (!isMatch) throw createError('Current password is incorrect', 400)

  const newHash = await bcrypt.hash(newPassword, 12)
  await pool.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [newHash, user.id])

  res.json({ success: true, message: 'Password updated successfully' })
})
