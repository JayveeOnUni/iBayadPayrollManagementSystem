import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthPayload {
  userId: string
  email: string
  role: string
  employeeId?: string
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload
    }
  }
}

/**
 * Middleware: verify JWT access token and attach decoded payload to req.user.
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'No token provided' })
    return
  }

  const token = authHeader.slice(7)
  const secret = process.env.JWT_SECRET

  if (!secret) {
    res.status(500).json({ success: false, message: 'Server configuration error' })
    return
  }

  try {
    const decoded = jwt.verify(token, secret) as AuthPayload
    req.user = decoded
    next()
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ success: false, message: 'Token expired' })
    } else {
      res.status(401).json({ success: false, message: 'Invalid token' })
    }
  }
}

/**
 * Middleware factory: require specific roles.
 * Usage: requireRole('super_admin', 'hr_admin')
 */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' })
      return
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${roles.join(', ')}`,
      })
      return
    }

    next()
  }
}

/**
 * Admin-only shorthand.
 */
export const adminOnly = requireRole('super_admin', 'admin', 'hr_admin', 'finance_admin')
