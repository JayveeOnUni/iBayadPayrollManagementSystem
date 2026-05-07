import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Download } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Table from '../../../components/ui/Table'
import Avatar from '../../../components/ui/Avatar'
import { FeedbackMessage, PageHeader } from '../../../components/ui/Page'
import { format, addMonths, subMonths } from '../../../utils/dateHelpers'
import { attendanceService } from '../../../services/attendanceService'
import { employeeService } from '../../../services/employeeService'

interface AttendanceSummaryRow {
  employeeId: string
  name: string
  daysPresent: number
  daysAbsent: number
  daysLate: number
  totalLateMinutes: number
  totalOffsetEarnedHours: number
  totalOffsetUsedHours: number
  totalHoursWorked: number
}

export default function AttendanceSummaryPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [summary, setSummary] = useState<AttendanceSummaryRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setIsLoading(true)
        setMessage(null)
        const employees = await employeeService.list({ limit: 100, status: 'active' })
        const month = currentMonth.getMonth() + 1
        const year = currentMonth.getFullYear()
        const rows = await Promise.all(employees.data.map(async (employee) => {
          const res = await attendanceService.getSummary(employee.id, month, year)
          const data = res.data as unknown as Record<string, string | number>
          return {
            employeeId: employee.id,
            name: `${employee.firstName} ${employee.lastName}`,
            daysPresent: Number(data.present_days ?? 0),
            daysAbsent: Number(data.absent_days ?? 0),
            daysLate: Number(data.late_days ?? 0),
            totalLateMinutes: Number(data.total_late_minutes ?? 0),
            totalOffsetEarnedHours: Number(data.total_offset_earned_hours ?? 0),
            totalOffsetUsedHours: Number(data.total_offset_used_hours ?? 0),
            totalHoursWorked: Math.round((Number(data.total_worked_minutes ?? 0) / 60) * 100) / 100,
          }
        }))
        setSummary(rows)
      } catch (err) {
        setMessage(err instanceof Error ? err.message : 'Unable to load attendance summary.')
      } finally {
        setIsLoading(false)
      }
    }

    loadSummary()
  }, [currentMonth])

  const exportSummary = () => {
    const csv = [
      ['Employee', 'Present', 'Absent', 'Late Days', 'Late Minutes', 'Offset Earned Hours', 'Offset Used Hours', 'Total Hours'],
      ...summary.map((row) => [
        row.name,
        String(row.daysPresent),
        String(row.daysAbsent),
        String(row.daysLate),
        String(row.totalLateMinutes),
        String(row.totalOffsetEarnedHours),
        String(row.totalOffsetUsedHours),
        String(row.totalHoursWorked),
      ]),
    ].map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `attendance-summary-${format(currentMonth, 'yyyy-MM')}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Attendance Summary"
        subtitle="Review monthly attendance totals per active employee."
        actions={
        <Button variant="outline" size="sm" leftIcon={<Download size={14} />} onClick={exportSummary}>
          Export Report
        </Button>
        }
      />

      {message && (
        <FeedbackMessage variant={message.toLowerCase().includes('unable') ? 'danger' : 'info'}>
          {message}
        </FeedbackMessage>
      )}

      {/* Month navigator */}
      <Card>
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
            className="p-2 rounded-lg hover:bg-slate-100 text-muted hover:text-ink"
          >
            <ChevronLeft size={18} />
          </button>
          <p className="text-base font-semibold text-ink">
            {format(currentMonth, 'MMMM yyyy')}
          </p>
          <button
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            className="p-2 rounded-lg hover:bg-slate-100 text-muted hover:text-ink"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </Card>

      <Card padding="none">
        <Table
          data={summary}
          rowKey={(r) => r.employeeId}
          isLoading={isLoading}
          columns={[
            {
              key: 'employee',
              header: 'Employee',
              render: (row) => (
                <div className="flex items-center gap-3">
                  <Avatar name={row.name} size="sm" />
                  <span className="text-sm font-medium">{row.name}</span>
                </div>
              ),
            },
            {
              key: 'daysPresent',
              header: 'Present',
              render: (row) => (
                <span className="text-sm font-semibold text-emerald-600">{row.daysPresent}</span>
              ),
            },
            {
              key: 'daysAbsent',
              header: 'Absent',
              render: (row) => (
                <span className={`text-sm font-semibold ${row.daysAbsent > 0 ? 'text-red-600' : 'text-muted'}`}>
                  {row.daysAbsent}
                </span>
              ),
            },
            {
              key: 'daysLate',
              header: 'Late Days',
              render: (row) => (
                <span className={`text-sm font-semibold ${row.daysLate > 0 ? 'text-amber-600' : 'text-muted'}`}>
                  {row.daysLate}
                </span>
              ),
            },
            {
              key: 'totalLateMinutes',
              header: 'Total Late',
              render: (row) => (
                <span className="text-sm">
                  {row.totalLateMinutes > 0 ? `${row.totalLateMinutes} min` : '—'}
                </span>
              ),
            },
            {
              key: 'totalOffsetEarnedHours',
              header: 'Offset Earned',
              render: (row) => (
                <span className="text-sm">
                  {row.totalOffsetEarnedHours > 0 ? `${row.totalOffsetEarnedHours}h` : '—'}
                </span>
              ),
            },
            {
              key: 'totalOffsetUsedHours',
              header: 'Offset Used',
              render: (row) => (
                <span className="text-sm">
                  {row.totalOffsetUsedHours > 0 ? `${row.totalOffsetUsedHours}h` : '—'}
                </span>
              ),
            },
            {
              key: 'totalHoursWorked',
              header: 'Total Hours',
              render: (row) => (
                <span className="text-sm font-medium">{row.totalHoursWorked}h</span>
              ),
            },
          ]}
        />
      </Card>
    </div>
  )
}
