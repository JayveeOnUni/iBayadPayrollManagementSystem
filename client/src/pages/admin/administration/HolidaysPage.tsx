import { useState } from 'react'
import { Plus, Calendar } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Table from '../../../components/ui/Table'
import Badge from '../../../components/ui/Badge'
import { formatDate } from '../../../utils/dateHelpers'
import type { Holiday } from '../../../types'

const mockHolidays: Holiday[] = [
  { id: '1', name: "New Year's Day", date: '2026-01-01', type: 'regular', isRecurring: true, createdAt: '', updatedAt: '' },
  { id: '2', name: 'Araw ng Kagitingan', date: '2026-04-09', type: 'regular', isRecurring: true, createdAt: '', updatedAt: '' },
  { id: '3', name: 'Maundy Thursday', date: '2026-04-02', type: 'regular', isRecurring: false, createdAt: '', updatedAt: '' },
  { id: '4', name: 'Good Friday', date: '2026-04-03', type: 'regular', isRecurring: false, createdAt: '', updatedAt: '' },
  { id: '5', name: 'Labor Day', date: '2026-05-01', type: 'regular', isRecurring: true, createdAt: '', updatedAt: '' },
  { id: '6', name: 'Independence Day', date: '2026-06-12', type: 'regular', isRecurring: true, createdAt: '', updatedAt: '' },
  { id: '7', name: "All Saints' Day", date: '2026-11-01', type: 'special_non_working', isRecurring: true, createdAt: '', updatedAt: '' },
  { id: '8', name: 'Christmas Day', date: '2026-12-25', type: 'regular', isRecurring: true, createdAt: '', updatedAt: '' },
  { id: '9', name: "Rizal Day", date: '2026-12-30', type: 'regular', isRecurring: true, createdAt: '', updatedAt: '' },
]

const typeVariant: Record<string, 'danger' | 'warning' | 'info'> = {
  regular: 'danger',
  special_non_working: 'warning',
  special_working: 'info',
}

const typeLabel: Record<string, string> = {
  regular: 'Regular Holiday',
  special_non_working: 'Special Non-Working',
  special_working: 'Special Working',
}

export default function HolidaysPage() {
  const [year, setYear] = useState(2026)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink">Holidays</h2>
          <p className="text-sm text-muted mt-0.5">Manage official and special holidays affecting payroll</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 bg-white"
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <Button size="sm" leftIcon={<Plus size={14} />}>Add Holiday</Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Regular Holidays', count: mockHolidays.filter((h) => h.type === 'regular').length, variant: 'danger' as const },
          { label: 'Special Non-Working', count: mockHolidays.filter((h) => h.type === 'special_non_working').length, variant: 'warning' as const },
          { label: 'Special Working', count: mockHolidays.filter((h) => h.type === 'special_working').length, variant: 'info' as const },
        ].map((s) => (
          <Card key={s.label} className="text-center">
            <p className="text-2xl font-bold text-ink">{s.count}</p>
            <p className="text-xs text-muted mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      <Card padding="none">
        <Table
          data={mockHolidays.filter((h) => new Date(h.date).getFullYear() === year)}
          rowKey={(r) => r.id}
          columns={[
            {
              key: 'name',
              header: 'Holiday',
              render: (row) => (
                <div className="flex items-center gap-2.5">
                  <Calendar size={15} className="text-muted" />
                  <span className="text-sm font-medium text-ink">{row.name}</span>
                </div>
              ),
            },
            {
              key: 'date',
              header: 'Date',
              render: (row) => <span className="text-sm">{formatDate(row.date, 'MMMM d, yyyy (EEEE)')}</span>,
            },
            {
              key: 'type',
              header: 'Type',
              render: (row) => (
                <Badge variant={typeVariant[row.type]}>{typeLabel[row.type]}</Badge>
              ),
            },
            {
              key: 'isRecurring',
              header: 'Recurring',
              render: (row) => (
                <Badge variant={row.isRecurring ? 'success' : 'neutral'}>
                  {row.isRecurring ? 'Yes' : 'No'}
                </Badge>
              ),
            },
          ]}
        />
      </Card>
    </div>
  )
}
