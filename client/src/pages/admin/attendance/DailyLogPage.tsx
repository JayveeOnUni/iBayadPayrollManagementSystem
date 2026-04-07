import { useState } from 'react'
import { Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Table from '../../../components/ui/Table'
import Badge from '../../../components/ui/Badge'
import Avatar from '../../../components/ui/Avatar'
import { formatDate, formatTime, addDays, subMonths, addMonths, format } from '../../../utils/dateHelpers'
import type { AttendanceRecord } from '../../../types'

const today = new Date()

const mockLogs: AttendanceRecord[] = [
  { id: '1', employeeId: '1', date: format(today, 'yyyy-MM-dd'), timeIn: '08:02', timeOut: '17:05', hoursWorked: 9, overtimeHours: 0, lateMinutes: 2, undertimeMinutes: 0, status: 'present', createdAt: '', updatedAt: '' },
  { id: '2', employeeId: '2', date: format(today, 'yyyy-MM-dd'), timeIn: '09:15', timeOut: '18:00', hoursWorked: 8, overtimeHours: 0, lateMinutes: 75, undertimeMinutes: 0, status: 'late', createdAt: '', updatedAt: '' },
  { id: '3', employeeId: '3', date: format(today, 'yyyy-MM-dd'), timeIn: undefined, timeOut: undefined, hoursWorked: 0, overtimeHours: 0, lateMinutes: 0, undertimeMinutes: 0, status: 'absent', createdAt: '', updatedAt: '' },
]

const employeeNames: Record<string, string> = {
  '1': 'Maria Santos',
  '2': 'Juan dela Cruz',
  '3': 'Ana Reyes',
}

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

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink">Daily Attendance Log</h2>
          <p className="text-sm text-muted mt-0.5">Track employee time-in and time-out records</p>
        </div>
        <Button variant="outline" size="sm" leftIcon={<Download size={14} />}>
          Export
        </Button>
      </div>

      {/* Date navigator */}
      <Card>
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedDate((d) => addDays(d, -1))}
            className="p-2 rounded-lg hover:bg-slate-100 text-muted hover:text-ink transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="text-center">
            <p className="text-base font-semibold text-ink">{formatDate(selectedDate, 'EEEE')}</p>
            <p className="text-sm text-muted">{formatDate(selectedDate, 'MMMM d, yyyy')}</p>
          </div>
          <button
            onClick={() => setSelectedDate((d) => addDays(d, 1))}
            className="p-2 rounded-lg hover:bg-slate-100 text-muted hover:text-ink transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Summary pills */}
        <div className="flex gap-3 mt-4 flex-wrap">
          {[
            { label: 'Present', count: 107, variant: 'success' as const },
            { label: 'Late', count: 8, variant: 'warning' as const },
            { label: 'Absent', count: 5, variant: 'danger' as const },
            { label: 'On Leave', count: 4, variant: 'info' as const },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-border">
              <Badge variant={s.variant}>{s.label}</Badge>
              <span className="text-sm font-semibold text-ink">{s.count}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card padding="none">
        <div className="px-5 py-4 border-b border-border flex items-center gap-3">
          <input
            type="text"
            placeholder="Search employee..."
            className="flex-1 max-w-xs px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          <Button variant="outline" size="sm" leftIcon={<Filter size={14} />}>
            Filter Status
          </Button>
        </div>

        <Table
          data={mockLogs}
          rowKey={(r) => r.id}
          columns={[
            {
              key: 'employee',
              header: 'Employee',
              render: (row) => (
                <div className="flex items-center gap-3">
                  <Avatar name={employeeNames[row.employeeId]} size="sm" />
                  <span className="text-sm font-medium text-ink">{employeeNames[row.employeeId]}</span>
                </div>
              ),
            },
            {
              key: 'timeIn',
              header: 'Time In',
              render: (row) => (
                <span className="text-sm">{row.timeIn ? formatTime(`2000-01-01T${row.timeIn}`) : '—'}</span>
              ),
            },
            {
              key: 'timeOut',
              header: 'Time Out',
              render: (row) => (
                <span className="text-sm">{row.timeOut ? formatTime(`2000-01-01T${row.timeOut}`) : '—'}</span>
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
                <span className={`text-sm ${row.lateMinutes > 0 ? 'text-amber-600 font-medium' : 'text-muted'}`}>
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
