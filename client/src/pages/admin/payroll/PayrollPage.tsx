import { useEffect, useMemo, useState } from 'react'
import { Play, CheckCircle, DollarSign, Plus, ChevronDown, CalendarDays, Users } from 'lucide-react'
import Card, { CardHeader, StatCard } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Table, { Pagination } from '../../../components/ui/Table'
import Badge from '../../../components/ui/Badge'
import Modal from '../../../components/ui/Modal'
import Input from '../../../components/ui/Input'
import { FeedbackMessage, PageHeader } from '../../../components/ui/Page'
import { formatDate } from '../../../utils/dateHelpers'
import { formatPeso } from '../../../utils/taxComputation'
import type { PayrollPeriod } from '../../../types'
import { payrollService } from '../../../services/payrollService'

const statusVariant: Record<string, 'success' | 'info' | 'neutral' | 'warning' | 'danger'> = {
  released: 'success',
  approved: 'success',
  processing: 'info',
  draft: 'neutral',
  cancelled: 'danger',
}

export default function PayrollPage() {
  const [page, setPage] = useState(1)
  const [, setSelectedPeriod] = useState<string | null>(null)
  const [periods, setPeriods] = useState<PayrollPeriod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [isNewOpen, setIsNewOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    payDate: new Date().toISOString().slice(0, 10),
  })

  const loadPeriods = async () => {
    try {
      setIsLoading(true)
      setMessage(null)
      const res = await payrollService.listPeriods()
      setPeriods(res.data)
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Unable to load payroll periods.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPeriods()
  }, [])

  const currentPeriod = useMemo(() => periods[0], [periods])

  const createPeriod = async () => {
    try {
      setIsSaving(true)
      setMessage(null)
      await payrollService.createPeriod({ ...form, frequency: 'semi-monthly' })
      setIsNewOpen(false)
      setForm({ name: '', startDate: new Date().toISOString().slice(0, 10), endDate: new Date().toISOString().slice(0, 10), payDate: new Date().toISOString().slice(0, 10) })
      await loadPeriods()
      setMessage('Payroll period created.')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Unable to create payroll period.')
    } finally {
      setIsSaving(false)
    }
  }

  const runAction = async (period: PayrollPeriod, action: 'process' | 'approve' | 'release') => {
    try {
      setMessage(null)
      if (action === 'process') {
        const res = await payrollService.processPayroll(period.id)
        setMessage(res.data.message)
      } else if (action === 'approve') {
        await payrollService.approvePayroll(period.id)
        setMessage('Payroll approved.')
      } else {
        await payrollService.markAsPaid(period.id)
        setMessage('Payroll released.')
      }
      await loadPeriods()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Unable to update payroll period.')
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Payroll"
        subtitle="Create payroll periods, process employee pay, and release approved runs."
        actions={
        <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => setIsNewOpen(true)}>
          New Period
        </Button>
        }
      />

      {message && (
        <FeedbackMessage variant={message.toLowerCase().includes('unable') ? 'danger' : 'info'}>
          {message}
        </FeedbackMessage>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Current period"
          value={currentPeriod?.name ?? 'No period yet'}
          delta={currentPeriod ? `${formatDate(currentPeriod.startDate)} - ${formatDate(currentPeriod.endDate)}` : 'Create a payroll period to begin'}
          icon={<CalendarDays size={20} />}
          tone="brand"
        />
        <StatCard
          label="Employees on payroll"
          value="All active"
          delta="Included during processing"
          deltaType="up"
          icon={<Users size={20} />}
          tone="success"
        />
        <StatCard
          label="Estimated payroll amount"
          value={formatPeso(0)}
          delta="Available after processing records"
          icon={<DollarSign size={20} />}
          tone="warning"
        />
      </div>

      {/* Payroll periods table */}
      <Card padding="none">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <CardHeader title="Payroll Periods" className="mb-0" />
          <div className="flex items-center gap-2">
            <button type="button" className="flex items-center gap-1.5 rounded-md border border-border bg-white px-3 py-1.5 text-sm text-muted hover:bg-neutral-20">
              2026 <ChevronDown size={13} />
            </button>
          </div>
        </div>

        <Table
          data={periods}
          rowKey={(r) => r.id}
          onRowClick={(r) => setSelectedPeriod(r.id)}
          isLoading={isLoading}
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
                <span className="capitalize text-sm">{row.frequency}</span>
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
              render: () => (
                <span className="text-sm font-medium">
                  —
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
                    <Button size="xs" leftIcon={<Play size={12} />} onClick={(event) => { event.stopPropagation(); runAction(row, 'process') }}>
                      Process
                    </Button>
                  )}
                  {row.status === 'processing' && (
                    <Button size="xs" variant="secondary" leftIcon={<CheckCircle size={12} />} onClick={(event) => { event.stopPropagation(); runAction(row, 'approve') }}>
                      Approve
                    </Button>
                  )}
                  {row.status === 'approved' && (
                    <Button size="xs" leftIcon={<DollarSign size={12} />} onClick={(event) => { event.stopPropagation(); runAction(row, 'release') }}>
                      Mark Released
                    </Button>
                  )}
                  {row.status === 'released' && (
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
          total={periods.length}
          limit={10}
          onPageChange={setPage}
        />
      </Card>

      <Modal
        isOpen={isNewOpen}
        onClose={() => setIsNewOpen(false)}
        title="New Payroll Period"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsNewOpen(false)} disabled={isSaving}>Cancel</Button>
            <Button onClick={createPeriod} isLoading={isSaving}>Create Period</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <Input label="Start Date" type="date" required value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
          <Input label="End Date" type="date" required value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} />
          <Input label="Pay Date" type="date" required value={form.payDate} onChange={(e) => setForm((f) => ({ ...f, payDate: e.target.value }))} />
        </div>
      </Modal>
    </div>
  )
}
