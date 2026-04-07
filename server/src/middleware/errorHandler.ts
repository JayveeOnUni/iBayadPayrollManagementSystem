import { Request, Response, NextFunction } from 'express'

export interface AppError extends Error {
  statusCode?: number
  isOperational?: boolean
}

/**
 * Global Express error handler.
 * Must be mounted AFTER all routes with 4 parameters.
 */
export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode ?? 500
  const message = err.isOperational ? err.message : 'Internal server error'

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[ERROR] ${err.message}`, err.stack)
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
    }),
  })
}

/**
 * Create an operational error with a status code.
 */
export function createError(message: string, statusCode: number): AppError {
  const err: AppError = new Error(message)
  err.statusCode = statusCode
  err.isOperational = true
  return err
}

/**
 * Async route wrapper — catches promise rejections and forwards to error handler.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
