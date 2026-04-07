import { useState } from 'react'
import { ChevronLeft, ChevronRight, Download } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Table from '../../../components/ui/Table'
import Avatar from '../../../components/ui/Avatar'
import { format, addMonths, subMonths } from '../../../utils/dateHelpers'

interface AttendanceSummaryRow {
  employeeId: string
  name: string
  daysPresent: number
  daysAbsent: number
  daysLate: number
  totalLateMinutes: number
  totalOvertimeHours: number
  totalHoursWorked: number
}

const mockSummary: AttendanceSummaryRow[] = [
  { employeeId: '1', name: 'Maria Santos', daysPresent: 22, daysAbsent: 0, daysLate: 1, totalLateMinutes: 5, totalOvertimeHours: 3, totalHoursWorked: 179 },
  { employeeId: '2', name: 'Juan dela Cruz', daysPresent: 20, daysAbsent: 2, daysLate: 3, totalLateMinutes: 95, totalOvertimeHours: 0, totalHoursWorked: 160 },
  { employeeId: '3', name: 'Ana Reyes', daysPresent: 21, daysAbsent: 1, daysLate: 0, totalLateMinutes: 0, totalOvertimeHours: 1.5, totalHoursWorked: 169.5 },
]

export default function AttendanceSummaryPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3, 1))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink">Attendance Summary</h2>
          <p className="text-sm text-muted mt-0.5">Monthly attendance overview per employee</p>
        </div>
        <Button variant="outline" size="sm" leftIcon={<Download size={14} />}>
          Export Report
        </Button>
      </div>

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
          data={mockSummary}
          rowKey={(r) => r.employeeId}
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
              key: 'totalOvertimeHours',
              header: 'Overtime',
              render: (row) => (
                <span className="text-sm">
                  {row.totalOvertimeHours > 0 ? `${row.totalOvertimeHours}h` : '—'}
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
