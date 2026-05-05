import { AlertCircle, CalendarClock, LogIn, LogOut, Megaphone } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { attendanceService } from '../../services/attendanceService'
import { dashboardService } from '../../services/dashboardService'
import type { EmployeeDashboardData } from '../../types'

interface ProgressBarProps {
  percent: number
}

function ProgressBar({ percent }: ProgressBarProps) {
  return (
    <div className="h-2 bg-neutral-20 rounded-md overflow-hidden w-full">
      <div className="h-full bg-info rounded-md" style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
    </div>
  )
}

function formatDateTime(value?: string | null, options?: Intl.DateTimeFormatOptions) {
  if (!value) return 'Not recorded'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Not recorded'

  return new Intl.DateTimeFormat('en-PH', options ?? {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function formatTime(value?: string | null) {
  return formatDateTime(value, { hour: 'numeric', minute: '2-digit' })
}

function formatTimeOnly(value?: string | null) {
  if (!value) return '--:--'
  const [hours = '0', minutes = '0'] = value.split(':')
  const date = new Date()
  date.setHours(Number(hours), Number(minutes), 0, 0)
  return new Intl.DateTimeFormat('en-PH', { hour: 'numeric', minute: '2-digit' }).format(date)
}

function hours(value: number) {
  return `${Number(value || 0).toFixed(value % 1 === 0 ? 0 : 1)} hr`
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-dashed border-border rounded-lg px-4 py-8 text-center text-sm text-muted">
      {children}
    </div>
  )
}

export default function EmployeeDashboardPage() {
  const [dashboard, setDashboard] = useState<EmployeeDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [punchAction, setPunchAction] = useState<'in' | 'out' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const loadDashboard = useCallback(async (mode: 'initial' | 'refresh' = 'refresh') => {
    if (mode === 'initial') setIsLoading(true)

    try {
      setError(null)
      const res = await dashboardService.getEmployeeDashboard()
      setDashboard(res.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load dashboard data.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard('initial')
  }, [loadDashboard])

  const punch = async (action: 'in' | 'out') => {
    try {
      setPunchAction(action)
      setMessage(null)
      setError(null)

      if (action === 'in') {
        await attendanceService.clockIn()
        setMessage('Time in recorded.')
      } else {
        await attendanceService.clockOut()
        setMessage('Time out recorded.')
      }

      await loadDashboard('refresh')
    } catch (err) {
      setMessage(null)
      setError(err instanceof Error ? err.message : 'Unable to update attendance.')
    } finally {
      setPunchAction(null)
    }
  }

  const attendance = dashboard?.attendanceToday
  const monthly = dashboard?.monthlyAttendance
  const leave = dashboard?.leaveBalance
  const canTimeIn = attendance?.status === 'Not Timed In'
  const canTimeOut = attendance?.status === 'Timed In'
  const isTimeInDisabled = !canTimeIn || Boolean(punchAction)
  const isTimeOutDisabled = !canTimeOut || Boolean(punchAction)
  const workedPercent = monthly && monthly.expectedHours > 0 ? (monthly.totalHours / monthly.expectedHours) * 100 : 0
  const shortagePercent = monthly && monthly.expectedHours > 0 ? (monthly.shortageHours / monthly.expectedHours) * 100 : 0
  const overtimePercent = monthly && monthly.expectedHours > 0 ? (monthly.overtimeHours / monthly.expectedHours) * 100 : 0

  const leaveStats = useMemo(() => {
    if (!leave) return []
    const totalLeaveAllowance = 15

    return [
      { label: 'Total leave allowance', value: totalLeaveAllowance },
      { label: 'Total leave taken', value: leave.totalTaken },
      { label: 'Total leave available', value: Math.max(0, totalLeaveAllowance - leave.totalTaken) },
      { label: 'Leave request pending', value: leave.pendingRequests },
    ]
  }, [leave])

  if (isLoading) {
    return (
      <div className="bg-surface min-h-full px-8 py-6 space-y-4">
        <div className="h-8 w-40 bg-neutral-20 rounded animate-pulse" />
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white rounded-lg p-6 space-y-4">
            <div className="h-4 w-48 bg-neutral-20 rounded animate-pulse" />
            <div className="h-20 bg-neutral-20 rounded animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-surface min-h-full">
      <div className="bg-surface px-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-medium text-ink">Dashboard</h1>
          {dashboard?.generatedAt && (
            <p className="text-xs text-muted mt-1">{formatDateTime(dashboard.generatedAt)}</p>
          )}
        </div>
      </div>

      <div className="px-4 md:px-8 pb-8 space-y-4">
        {error && (
          <div className="flex items-start gap-2 text-sm text-danger bg-danger-surface border border-red-200 rounded-lg px-4 py-3">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {message && (
          <div className="text-sm text-success bg-success-surface border border-green-200 rounded-lg px-4 py-3">
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg px-4 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <p className="text-base font-bold text-ink tracking-tight">
              Good to see you, {dashboard?.employee.firstName ?? 'Employee'}
            </p>
            <p className="text-sm text-muted mt-0.5">
              {dashboard?.employee.position || 'Position not set'}{dashboard?.employee.department ? `, ${dashboard.employee.department}` : ''}
            </p>
            <p className="text-xs text-muted mt-2">Attendance status: {attendance?.status ?? 'Unavailable'}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8">
            <button
              type="button"
              disabled={isTimeInDisabled}
              aria-busy={punchAction === 'in'}
              aria-label="Time In"
              onClick={() => punch('in')}
              className="group flex items-center gap-2 rounded-lg border border-transparent p-2 text-left transition-colors hover:border-success hover:bg-success-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-transparent disabled:hover:bg-transparent"
            >
              <div className="w-9 h-9 bg-success-surface rounded flex items-center justify-center">
                <LogIn size={18} className={punchAction === 'in' ? 'text-success animate-pulse' : 'text-success'} />
              </div>
              <div className="flex flex-col gap-px">
                <span className="text-xs font-medium text-neutral-90 leading-[18px]">{formatTime(attendance?.timeIn)}</span>
                <span className="text-xs text-muted leading-[18px]">{punchAction === 'in' ? 'Recording time in' : 'Punch in'}</span>
              </div>
            </button>
            <button
              type="button"
              disabled={isTimeOutDisabled}
              aria-busy={punchAction === 'out'}
              aria-label="Time Out"
              onClick={() => punch('out')}
              className="group flex items-center gap-2 rounded-lg border border-transparent p-2 text-left transition-colors hover:border-danger hover:bg-danger-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-transparent disabled:hover:bg-transparent"
            >
              <div className="w-9 h-9 bg-danger-surface rounded flex items-center justify-center">
                <LogOut size={18} className={punchAction === 'out' ? 'text-danger animate-pulse' : 'text-danger'} />
              </div>
              <div className="flex flex-col gap-px">
                <span className="text-xs font-medium text-neutral-90 leading-[18px]">{formatTime(attendance?.timeOut)}</span>
                <span className="text-xs text-muted leading-[18px]">{punchAction === 'out' ? 'Recording time out' : 'Punch out'}</span>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg px-4 md:px-8 py-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {leaveStats.length ? leaveStats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-2">
              <p className="text-sm font-medium text-neutral-90">{stat.label}</p>
              <p className="text-[28px] font-medium text-info leading-9">{stat.value}</p>
            </div>
          )) : (
            <EmptyState>No leave balances are available yet.</EmptyState>
          )}
        </div>

        <div className="bg-white rounded-lg px-4 md:px-8 py-4">
          <h2 className="text-base font-bold text-ink mb-4">Time Log</h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <p className="text-base font-medium text-neutral-90">Today</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-surface rounded-lg px-4 py-3 flex flex-col gap-2">
                  <p className="text-sm font-medium text-neutral-90">{formatTimeOnly(attendance?.scheduledStart)}</p>
                  <p className="text-xs text-neutral-60">Scheduled in</p>
                </div>
                <div className="bg-surface rounded-lg px-4 py-3 flex flex-col gap-2">
                  <p className="text-sm font-medium text-neutral-90">{formatTimeOnly(attendance?.scheduledEnd)}</p>
                  <p className="text-xs text-neutral-60">Scheduled out</p>
                </div>
                <div className="bg-surface rounded-lg px-4 py-3 flex flex-col gap-2">
                  <p className="text-sm font-medium text-neutral-90">{hours(attendance?.totalHours ?? 0)}</p>
                  <p className="text-xs text-neutral-60">Worked today</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-base font-medium text-neutral-90">This month</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-neutral-60">Expected time</span>
                    <span className="text-neutral-90">{hours(monthly?.expectedHours ?? 0)}</span>
                  </div>
                  <ProgressBar percent={100} />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-neutral-60">Worked time</span>
                    <span className="text-neutral-90">{hours(monthly?.totalHours ?? 0)}</span>
                  </div>
                  <ProgressBar percent={workedPercent} />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-neutral-60">Shortage time</span>
                    <span className="text-neutral-90">{hours(monthly?.shortageHours ?? 0)}</span>
                  </div>
                  <ProgressBar percent={shortagePercent} />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-neutral-60">Overtime</span>
                    <span className="text-neutral-90">{hours(monthly?.overtimeHours ?? 0)}</span>
                  </div>
                  <ProgressBar percent={overtimePercent} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg px-4 md:px-8 py-4">
            <h2 className="text-base font-bold text-ink mb-4 flex items-center gap-2">
              <CalendarClock size={16} /> Attendance Summary
            </h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-surface rounded-lg p-3">
                <p className="text-muted text-xs">Present</p>
                <p className="text-xl font-semibold text-ink">{monthly?.presentDays ?? 0}</p>
              </div>
              <div className="bg-surface rounded-lg p-3">
                <p className="text-muted text-xs">Late</p>
                <p className="text-xl font-semibold text-ink">{monthly?.lateDays ?? 0}</p>
              </div>
              <div className="bg-surface rounded-lg p-3">
                <p className="text-muted text-xs">Absent</p>
                <p className="text-xl font-semibold text-ink">{monthly?.absentDays ?? 0}</p>
              </div>
              <div className="bg-surface rounded-lg p-3">
                <p className="text-muted text-xs">On leave</p>
                <p className="text-xl font-semibold text-ink">{monthly?.leaveDays ?? 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg px-4 md:px-8 py-4 xl:col-span-2">
            <h2 className="text-base font-bold text-ink mb-4 flex items-center gap-2">
              <Megaphone size={16} /> Announcements
            </h2>
            {dashboard?.announcements.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[680px]">
                  <thead>
                    <tr className="bg-surface">
                      <th className="text-left p-3 text-xs font-normal text-ink">Title</th>
                      <th className="text-left p-3 text-xs font-normal text-ink border-l border-border">Start date</th>
                      <th className="text-left p-3 text-xs font-normal text-ink border-l border-border">End date</th>
                      <th className="text-left p-3 text-xs font-normal text-ink border-l border-border">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.announcements.map((row) => (
                      <tr key={row.id} className="border-t border-border">
                        <td className="p-3 text-ink text-xs font-medium">{row.title}</td>
                        <td className="p-3 text-ink text-xs">{row.startDate ? formatDateTime(row.startDate, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Always active'}</td>
                        <td className="p-3 text-ink text-xs">{row.endDate ? formatDateTime(row.endDate, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No end date'}</td>
                        <td className="p-3 text-ink text-xs">{row.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState>No active announcements right now.</EmptyState>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
