import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Table from '../../../components/ui/Table'
import Badge from '../../../components/ui/Badge'
import Avatar from '../../../components/ui/Avatar'
import { formatDate } from '../../../utils/dateHelpers'
import type { AttendanceRequest } from '../../../types'

const mockRequests: AttendanceRequest[] = [
  {
    id: '1', employeeId: '2', date: '2026-04-07', type: 'correction',
    requestedTimeIn: '08:00', requestedTimeOut: '17:00',
    reason: 'Forgot to clock in. Was present at 8:00 AM per CCTV.',
    status: 'pending', createdAt: '2026-04-07', updatedAt: '2026-04-07',
  },
  {
    id: '2', employeeId: '1', date: '2026-04-05', type: 'overtime',
    requestedTimeIn: '17:00', requestedTimeOut: '20:00',
    reason: 'Worked overtime for project deadline.',
    status: 'approved', reviewedAt: '2026-04-06', createdAt: '2026-04-05', updatedAt: '2026-04-06',
  },
]

const employeeNames: Record<string, string> = {
  '1': 'Maria Santos',
  '2': 'Juan dela Cruz',
}

export default function AttendanceRequestPage() {
  const [tab, setTab] = useState<'pending' | 'all'>('pending')

  const filtered = tab === 'pending'
    ? mockRequests.filter((r) => r.status === 'pending')
    : mockRequests

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-ink">Attendance Requests</h2>
        <p className="text-sm text-muted mt-0.5">Review and act on employee attendance correction requests</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {(['pending', 'all'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              'px-4 py-2.5 text-sm font-medium capitalize border-b-2 -mb-px transition-colors',
              tab === t
                ? 'border-brand text-brand'
                : 'border-transparent text-muted hover:text-ink',
            ].join(' ')}
          >
            {t === 'pending' ? 'Pending' : 'All Requests'}
            {t === 'pending' && (
              <Badge variant="warning" className="ml-2">
                {mockRequests.filter((r) => r.status === 'pending').length}
              </Badge>
            )}
          </button>
        ))}
      </div>

      <Card padding="none">
        <Table
          data={filtered}
          rowKey={(r) => r.id}
          emptyMessage="No attendance requests found."
          columns={[
            {
              key: 'employee',
              header: 'Employee',
              render: (row) => (
                <div className="flex items-center gap-3">
                  <Avatar name={employeeNames[row.employeeId]} size="sm" />
                  <span className="text-sm font-medium">{employeeNames[row.employeeId]}</span>
                </div>
              ),
            },
            {
              key: 'date',
              header: 'Date',
              render: (row) => <span className="text-sm">{formatDate(row.date)}</span>,
            },
            {
              key: 'type',
              header: 'Type',
              render: (row) => (
                <span className="capitalize text-sm">{row.type.replace('_', ' ')}</span>
              ),
            },
            {
              key: 'time',
              header: 'Requested Time',
              render: (row) => (
                <span className="text-sm">
                  {row.requestedTimeIn} – {row.requestedTimeOut}
                </span>
              ),
            },
            {
              key: 'reason',
              header: 'Reason',
              render: (row) => (
                <p className="text-sm text-muted max-w-xs truncate">{row.reason}</p>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              render: (row) => (
                <Badge
                  variant={row.status === 'approved' ? 'success' : row.status === 'rejected' ? 'danger' : 'warning'}
                  dot
                >
                  {row.status}
                </Badge>
              ),
            },
            {
              key: 'actions',
              header: '',
              render: (row) =>
                row.status === 'pending' ? (
                  <div className="flex gap-2">
                    <Button size="xs" leftIcon={<CheckCircle size={12} />}>
                      Approve
                    </Button>
                    <Button size="xs" variant="danger" leftIcon={<XCircle size={12} />}>
                      Reject
                    </Button>
                  </div>
                ) : null,
            },
          ]}
        />
      </Card>
    </div>
  )
}
