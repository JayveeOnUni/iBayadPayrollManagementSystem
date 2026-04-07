import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Routes
import authRoutes from './routes/auth'
import employeeRoutes from './routes/employees'
import payrollRoutes from './routes/payroll'
import attendanceRoutes from './routes/attendance'
import leaveRoutes from './routes/leave'

// Middleware
import { errorHandler } from './middleware/errorHandler'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT) || 3001

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Request logger (simple, replace with winston in production)
app.use((req, _res, next) => {
  const ts = new Date().toISOString()
  console.log(`[${ts}] ${req.method} ${req.path}`)
  next()
})

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use('/api/auth', authRoutes)
app.use('/api/employees', employeeRoutes)
app.use('/api/payroll', payrollRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/leave', leaveRoutes)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  })
})

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// ─── Error handler (must be last) ─────────────────────────────────────────────
app.use(errorHandler)

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n iBayad Payroll API`)
  console.log(` Running on: http://localhost:${PORT}`)
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(` Health check: http://localhost:${PORT}/api/health\n`)
})

export default app
