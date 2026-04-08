import { useEffect, useMemo, useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Table from '../../../components/ui/Table'
import Badge from '../../../components/ui/Badge'
import Avatar from '../../../components/ui/Avatar'
import { formatDate } from '../../../utils/dateHelpers'
import type { AttendanceRequest } from '../../../types'
import { attendanceService } from '../../../services/attendanceService'

export default function AttendanceRequestPage() {
  const [tab, setTab] = useState<'pending' | 'all'>('pending')
  const [requests, setRequests] = useState<AttendanceRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)

  const loadRequests = async () => {
    try {
      setIsLoading(true)
      setMessage(null)
      const res = await attendanceService.listRequests(tab === 'pending' ? { status: 'pending' } : undefined)
      setRequests(res.data)
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Unable to load attendance requests.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [tab])

  const filtered = useMemo(
    () => tab === 'pending' ? requests.filter((r) => r.status === 'pending') : requests,
    [requests, tab]
  )

  const reviewRequest = async (id: string, action: 'approve' | 'reject') => {
    try {
      setMessage(null)
      if (action === 'approve') {
        await attendanceService.approveRequest(id)
      } else {
        await attendanceService.rejectRequest(id, 'Rejected by reviewer')
      }
      await loadRequests()
      setMessage(`Attendance request ${action === 'approve' ? 'approved' : 'rejected'}.`)
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Unable to review request.')
    }
  }

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
                {requests.filter((r) => r.status === 'pending').length}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {message && (
        <div className="text-sm text-ink bg-slate-50 border border-border rounded-lg px-4 py-3">
          {message}
        </div>
      )}

      <Card padding="none">
        <Table
          data={filtered}
          rowKey={(r) => r.id}
          isLoading={isLoading}
          emptyMessage="No attendance requests found."
          columns={[
            {
              key: 'employee',
              header: 'Employee',
              render: (row) => (
                <div className="flex items-center gap-3">
                  <Avatar name={row.employee ? `${row.employee.firstName} ${row.employee.lastName}` : 'Employee'} size="sm" />
                  <span className="text-sm font-medium">
                    {row.employee ? `${row.employee.firstName} ${row.employee.lastName}` : row.employeeId}
                  </span>
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
                    <Button size="xs" leftIcon={<CheckCircle size={12} />} onClick={() => reviewRequest(row.id, 'approve')}>
                      Approve
                    </Button>
                    <Button size="xs" variant="danger" leftIcon={<XCircle size={12} />} onClick={() => reviewRequest(row.id, 'reject')}>
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
