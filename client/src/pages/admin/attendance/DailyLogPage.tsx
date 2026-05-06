import { useEffect, useMemo, useState } from 'react'
import { Filter, Download, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Table from '../../../components/ui/Table'
import Badge from '../../../components/ui/Badge'
import Avatar from '../../../components/ui/Avatar'
import Input from '../../../components/ui/Input'
import { FeedbackMessage, PageHeader } from '../../../components/ui/Page'
import { formatDate, formatTime, addDays, format } from '../../../utils/dateHelpers'
import type { AttendanceRecord } from '../../../types'
import { attendanceService } from '../../../services/attendanceService'

const today = new Date()

const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'neutral' | 'info'> = {
  present: 'success',
  late: 'warning',
  absent: 'danger',
  half_day: 'warning',
  on_leave: 'info',
  holiday: 'info',
}

export default function DailyLogPage() {
  const [selectedDate, setSelectedDate] = useState(today)
  const [logs, setLogs] = useState<AttendanceRecord[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const loadLogs = async () => {
      try {
        setIsLoading(true)
        setMessage(null)
        const date = format(selectedDate, 'yyyy-MM-dd')
        const res = await attendanceService.list({ startDate: date, endDate: date, status: status || undefined })
        setLogs(res.data)
      } catch (err) {
        setMessage(err instanceof Error ? err.message : 'Unable to load attendance logs.')
      } finally {
        setIsLoading(false)
      }
    }

    loadLogs()
  }, [selectedDate, status])

  const filteredLogs = useMemo(() => logs.filter((log) => {
    const employeeName = log.employee ? `${log.employee.firstName} ${log.employee.lastName}`.toLowerCase() : ''
    return employeeName.includes(search.toLowerCase())
  }), [logs, search])

  const countStatus = (value: AttendanceRecord['status']) => filteredLogs.filter((log) => log.status === value).length

  const exportLogs = () => {
    const csv = [
      ['Employee', 'Date', 'Time In', 'Time Out', 'Hours', 'Late Minutes', 'Status'],
      ...filteredLogs.map((log) => [
        log.employee ? `${log.employee.firstName} ${log.employee.lastName}` : log.employeeId,
        log.date,
        log.timeIn ?? '',
        log.timeOut ?? '',
        String(log.hoursWorked),
        String(log.lateMinutes),
        log.status,
      ]),
    ].map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `attendance-${format(selectedDate, 'yyyy-MM-dd')}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Daily Attendance Log"
        subtitle="Track employee time-in, time-out, late minutes, and daily status."
        actions={
        <Button variant="outline" size="sm" leftIcon={<Download size={14} />} onClick={exportLogs}>
          Export
        </Button>
        }
      />

      {message && (
        <FeedbackMessage variant={message.toLowerCase().includes('unable') ? 'danger' : 'info'}>
          {message}
        </FeedbackMessage>
      )}

      {/* Date navigator */}
      <Card>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSelectedDate((d) => addDays(d, -1))}
            className="rounded-md p-2 text-muted transition-colors hover:bg-neutral-20 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="text-center">
            <p className="text-base font-semibold text-ink">{formatDate(selectedDate, 'EEEE')}</p>
            <p className="text-sm text-muted">{formatDate(selectedDate, 'MMMM d, yyyy')}</p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedDate((d) => addDays(d, 1))}
            className="rounded-md p-2 text-muted transition-colors hover:bg-neutral-20 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Summary pills */}
        <div className="flex gap-3 mt-4 flex-wrap">
          {[
            { label: 'Present', count: countStatus('present'), variant: 'success' as const },
            { label: 'Late', count: countStatus('late'), variant: 'warning' as const },
            { label: 'Absent', count: countStatus('absent'), variant: 'danger' as const },
            { label: 'On Leave', count: countStatus('on_leave'), variant: 'info' as const },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2 rounded-lg border border-border bg-neutral-20 px-3 py-2">
              <Badge variant={s.variant}>{s.label}</Badge>
              <span className="text-sm font-semibold text-ink">{s.count}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card padding="none">
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center">
          <Input
            type="text"
            placeholder="Search employee..."
            value={search}
            leftAddon={<Search size={15} />}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:max-w-xs"
          />
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Filter size={14} />}
            onClick={() => setStatus((current) => current ? '' : 'late')}
          >
            Filter Status
          </Button>
        </div>

        <Table
          data={filteredLogs}
          rowKey={(r) => r.id}
          isLoading={isLoading}
          columns={[
            {
              key: 'employee',
              header: 'Employee',
              render: (row) => (
                <div className="flex items-center gap-3">
                  <Avatar name={row.employee ? `${row.employee.firstName} ${row.employee.lastName}` : 'Employee'} size="sm" />
                  <span className="text-sm font-medium text-ink">
                    {row.employee ? `${row.employee.firstName} ${row.employee.lastName}` : row.employeeId}
                  </span>
                </div>
              ),
            },
            {
              key: 'timeIn',
              header: 'Time In',
              render: (row) => (
                <span className="text-sm">{row.timeIn ? formatTime(row.timeIn) : '—'}</span>
              ),
            },
            {
              key: 'timeOut',
              header: 'Time Out',
              render: (row) => (
                <span className="text-sm">{row.timeOut ? formatTime(row.timeOut) : '—'}</span>
              ),
            },
            {
              key: 'hoursWorked',
              header: 'Hours',
              render: (row) => <span className="text-sm">{row.hoursWorked > 0 ? `${row.hoursWorked}h` : '—'}</span>,
            },
            {
              key: 'lateMinutes',
              header: 'Late',
              render: (row) => (
                <span className={`text-sm ${row.lateMinutes > 0 ? 'font-medium text-warning' : 'text-muted'}`}>
                  {row.lateMinutes > 0 ? `${row.lateMinutes} min` : '—'}
                </span>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              render: (row) => (
                <Badge variant={statusVariant[row.status]} dot>
                  {row.status.replace('_', ' ')}
                </Badge>
              ),
            },
          ]}
        />
      </Card>
    </div>
  )
}
