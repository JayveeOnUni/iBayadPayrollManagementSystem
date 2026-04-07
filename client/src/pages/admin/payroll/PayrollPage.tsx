import { useState } from 'react'
import { Play, CheckCircle, DollarSign, Plus, ChevronDown } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Table, { Pagination } from '../../../components/ui/Table'
import Badge from '../../../components/ui/Badge'
import { formatDate } from '../../../utils/dateHelpers'
import { formatPeso } from '../../../utils/taxComputation'
import type { PayrollPeriod } from '../../../types'

const mockPeriods: PayrollPeriod[] = [
  {
    id: '1', name: 'April 2026 – 1st Period', frequency: 'semi_monthly',
    startDate: '2026-04-01', endDate: '2026-04-15', payDate: '2026-04-20',
    status: 'paid', createdAt: '2026-03-25', updatedAt: '2026-04-20',
  },
  {
    id: '2', name: 'April 2026 – 2nd Period', frequency: 'semi_monthly',
    startDate: '2026-04-16', endDate: '2026-04-30', payDate: '2026-05-05',
    status: 'processing', createdAt: '2026-04-01', updatedAt: '2026-04-08',
  },
  {
    id: '3', name: 'May 2026 – 1st Period', frequency: 'semi_monthly',
    startDate: '2026-05-01', endDate: '2026-05-15', payDate: '2026-05-20',
    status: 'draft', createdAt: '2026-04-01', updatedAt: '2026-04-01',
  },
]

const mockTotals: Record<string, number> = {
  '1': 1_062_300,
  '2': 1_082_400,
  '3': 0,
}

const statusVariant: Record<string, 'success' | 'info' | 'neutral' | 'warning'> = {
  paid: 'success',
  approved: 'success',
  processing: 'info',
  draft: 'neutral',
  cancelled: 'warning',
}

export default function PayrollPage() {
  const [page, setPage] = useState(1)
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink">Payroll</h2>
          <p className="text-sm text-muted mt-0.5">Process and manage payroll periods</p>
        </div>
        <Button size="sm" leftIcon={<Plus size={14} />}>
          New Period
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <p className="text-xs text-muted">Current Period</p>
          <p className="text-base font-bold text-ink mt-1">April 2026 – 2nd</p>
          <p className="text-xs text-muted mt-0.5">Apr 16 – Apr 30, 2026</p>
        </Card>
        <Card>
          <p className="text-xs text-muted">Employees on Payroll</p>
          <p className="text-2xl font-bold text-ink mt-1">118</p>
          <p className="text-xs text-emerald-600 mt-0.5">All active employees included</p>
        </Card>
        <Card>
          <p className="text-xs text-muted">Estimated Payroll Amount</p>
          <p className="text-2xl font-bold text-brand mt-1">{formatPeso(1_082_400)}</p>
          <p className="text-xs text-muted mt-0.5">Net pay total</p>
        </Card>
      </div>

      {/* Payroll periods table */}
      <Card padding="none">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink">Payroll Periods</h3>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-sm text-muted border border-border rounded-lg px-3 py-1.5 hover:bg-slate-50">
              2026 <ChevronDown size={13} />
            </button>
          </div>
        </div>

        <Table
          data={mockPeriods}
          rowKey={(r) => r.id}
          onRowClick={(r) => setSelectedPeriod(r.id)}
          columns={[
            {
              key: 'name',
              header: 'Period',
              render: (row) => (
                <div>
                  <p className="font-medium text-sm text-ink">{row.name}</p>
                  <p className="text-xs text-muted">
                    {formatDate(row.startDate)} – {formatDate(row.endDate)}
                  </p>
                </div>
              ),
            },
            {
              key: 'frequency',
              header: 'Frequency',
              render: (row) => (
                <span className="capitalize text-sm">{row.frequency.replace('_', '-')}</span>
              ),
            },
            {
              key: 'payDate',
              header: 'Pay Date',
              render: (row) => <span className="text-sm">{formatDate(row.payDate)}</span>,
            },
            {
              key: 'total',
              header: 'Net Total',
              render: (row) => (
                <span className="text-sm font-medium">
                  {mockTotals[row.id] ? formatPeso(mockTotals[row.id]) : '—'}
                </span>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              render: (row) => (
                <Badge variant={statusVariant[row.status] ?? 'neutral'} dot>
                  {row.status}
                </Badge>
              ),
            },
            {
              key: 'actions',
              header: '',
              render: (row) => (
                <div className="flex items-center gap-2 justify-end">
                  {row.status === 'draft' && (
                    <Button size="xs" leftIcon={<Play size={12} />}>
                      Process
                    </Button>
                  )}
                  {row.status === 'processing' && (
                    <Button size="xs" variant="secondary" leftIcon={<CheckCircle size={12} />}>
                      Approve
                    </Button>
                  )}
                  {row.status === 'approved' && (
                    <Button size="xs" leftIcon={<DollarSign size={12} />}>
                      Mark Paid
                    </Button>
                  )}
                  {row.status === 'paid' && (
                    <Button size="xs" variant="ghost">
                      View
                    </Button>
                  )}
                </div>
              ),
            },
          ]}
        />
        <Pagination
          page={page}
          totalPages={1}
          total={mockPeriods.length}
          limit={10}
          onPageChange={setPage}
        />
      </Card>
    </div>
  )
}
