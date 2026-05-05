import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Send } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import { leaveService } from '../../services/leaveService'
import { format } from '../../utils/dateHelpers'
import type { LeaveApplication, LeaveBalance } from '../../types'

interface LeaveTypeOption {
  id: string
  name: string
  code: string
}

const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
  approved: 'success',
  pending: 'warning',
  rejected: 'danger',
  cancelled: 'default',
}

const TOTAL_LEAVE_ALLOWANCE = 15

export default function EmployeeLeavePage() {
  const [leaveTypes, setLeaveTypes] = useState<LeaveTypeOption[]>([])
  const [balances, setBalances] = useState<LeaveBalance[]>([])
  const [requests, setRequests] = useState<LeaveApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [form, setForm] = useState({
    leaveTypeId: '',
    startDate: '',
    endDate: '',
    reason: '',
    isHalfDay: false,
  })

  const loadLeave = async () => {
    try {
      setIsLoading(true)
      const [typeRes, balanceRes, requestRes] = await Promise.all([
        leaveService.getTypes(),
        leaveService.getMyBalances(),
        leaveService.getMyApplications(),
      ])
      setLeaveTypes(typeRes.data)
      setBalances(balanceRes.data)
      setRequests(requestRes.data)
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Unable to load leave records.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadLeave()
  }, [])

  const totals = useMemo(() => {
    const used = balances.reduce((sum, row) => sum + row.used, 0)

    return {
      allocated: TOTAL_LEAVE_ALLOWANCE,
      used,
      remaining: Math.max(0, TOTAL_LEAVE_ALLOWANCE - used),
    }
  }, [balances])

  const submitLeave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      setIsSubmitting(true)
      setMessage(null)
      await leaveService.apply(form)
      setForm({ leaveTypeId: '', startDate: '', endDate: '', reason: '', isHalfDay: false })
      setMessage('Leave request submitted for review.')
      await loadLeave()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Unable to submit leave request.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-ink">My Leave</h2>
        <p className="text-sm text-muted mt-0.5">File leave requests and review your leave balances</p>
      </div>

      {message && (
        <div className="text-sm text-ink bg-slate-50 border border-border rounded-lg px-4 py-3">
          {message}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Allowance', value: totals.allocated },
          { label: 'Used', value: totals.used },
          { label: 'Remaining', value: totals.remaining },
        ].map((item) => (
          <Card key={item.label}>
            <p className="text-sm text-muted">{item.label}</p>
            <p className="text-2xl font-bold text-ink mt-1">{item.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-[minmax(0,420px)_1fr] gap-5">
        <Card>
          <form onSubmit={submitLeave} className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-ink">Submit Leave Request</h3>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-ink">Leave Type</label>
              <select
                value={form.leaveTypeId}
                onChange={(e) => setForm((current) => ({ ...current, leaveTypeId: e.target.value }))}
                required
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 bg-white"
              >
                <option value="">Select leave type...</option>
                {leaveTypes.map((leaveType) => (
                  <option key={leaveType.id} value={leaveType.id}>
                    {leaveType.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Start Date"
                type="date"
                required
                value={form.startDate}
                onChange={(e) => setForm((current) => ({ ...current, startDate: e.target.value }))}
              />
              <Input
                label="End Date"
                type="date"
                required
                value={form.endDate}
                onChange={(e) => setForm((current) => ({ ...current, endDate: e.target.value }))}
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={form.isHalfDay}
                onChange={(e) => setForm((current) => ({ ...current, isHalfDay: e.target.checked }))}
                className="h-4 w-4 rounded border-border"
              />
              Half day
            </label>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-ink">Reason</label>
              <textarea
                rows={4}
                required
                minLength={5}
                value={form.reason}
                onChange={(e) => setForm((current) => ({ ...current, reason: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-200"
              />
            </div>

            <Button type="submit" leftIcon={<Send size={14} />} isLoading={isSubmitting}>
              Submit Request
            </Button>
          </form>
        </Card>

        <Card padding="none">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-ink">Leave Requests</h3>
          </div>
          <div className="divide-y divide-border">
            {isLoading && <div className="px-5 py-6 text-sm text-muted">Loading leave requests...</div>}
            {!isLoading && requests.length === 0 && <div className="px-5 py-6 text-sm text-muted">No leave requests yet.</div>}
            {!isLoading && requests.map((request) => (
              <div key={request.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-ink capitalize">{request.leaveType.replace('_', ' ')}</p>
                  <p className="text-xs text-muted">
                    {format(new Date(request.startDate), 'MMM d')} - {format(new Date(request.endDate), 'MMM d, yyyy')} · {request.totalDays} day{request.totalDays === 1 ? '' : 's'}
                  </p>
                </div>
                <Badge variant={statusVariant[request.status]} dot>
                  {request.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
