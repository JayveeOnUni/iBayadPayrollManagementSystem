import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import { FeedbackMessage, PageHeader } from '../../components/ui/Page'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, formatTime } from '../../utils/dateHelpers'
import { attendanceService } from '../../services/attendanceService'
import type { AttendanceRecord } from '../../types'

const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  present: 'success',
  late: 'warning',
  absent: 'danger',
  on_leave: 'info',
}

export default function AttendancePage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [requestForm, setRequestForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    requestedTimeIn: '',
    requestedTimeOut: '',
    reason: '',
  })

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        setIsLoading(true)
        setMessage(null)
        const res = await attendanceService.getMyAttendance({
          startDate: format(startOfMonth(currentMonth), 'yyyy-MM-dd'),
          endDate: format(endOfMonth(currentMonth), 'yyyy-MM-dd'),
        })
        setAttendance(res.data)
      } catch (err) {
        setMessage(err instanceof Error ? err.message : 'Unable to load attendance.')
      } finally {
        setIsLoading(false)
      }
    }

    loadAttendance()
  }, [currentMonth])

  const present = useMemo(() => attendance.filter((a) => a.status === 'present' || a.status === 'late').length, [attendance])
  const absent = useMemo(() => attendance.filter((a) => a.status === 'absent').length, [attendance])
  const late = useMemo(() => attendance.filter((a) => a.status === 'late').length, [attendance])

  const submitCorrection = async () => {
    try {
      setIsSubmitting(true)
      setMessage(null)
      await attendanceService.submitRequest({
        date: requestForm.date,
        requestedStatus: 'present',
        requestedTimeIn: requestForm.requestedTimeIn ? `${requestForm.date}T${requestForm.requestedTimeIn}:00` : undefined,
        requestedTimeOut: requestForm.requestedTimeOut ? `${requestForm.date}T${requestForm.requestedTimeOut}:00` : undefined,
        reason: requestForm.reason,
      })
      setIsModalOpen(false)
      setRequestForm({ date: new Date().toISOString().slice(0, 10), requestedTimeIn: '', requestedTimeOut: '', reason: '' })
      setMessage('Attendance correction request submitted for review.')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Unable to submit attendance request.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="My Attendance"
        subtitle="Track your daily time in and time out."
        actions={
          <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => setIsModalOpen(true)}>
            Request Correction
          </Button>
        }
      />

      {message && (
        <FeedbackMessage variant={message.toLowerCase().includes('unable') ? 'danger' : 'info'}>
          {message}
        </FeedbackMessage>
      )}

      {/* Month nav */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
            className="rounded-md p-2 text-muted hover:bg-neutral-20 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
          >
            <ChevronLeft size={18} />
          </button>
          <p className="text-base font-semibold text-ink">
            {format(currentMonth, 'MMMM yyyy')}
          </p>
          <button
            type="button"
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            className="rounded-md p-2 text-muted hover:bg-neutral-20 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Days Present', value: present, color: 'text-success' },
            { label: 'Days Absent', value: absent, color: 'text-danger' },
            { label: 'Late Days', value: late, color: 'text-warning' },
          ].map((s) => (
            <div key={s.label} className="rounded-lg bg-neutral-20 p-3 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Attendance list */}
      <Card padding="none">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-ink">Attendance Log</h3>
        </div>
        <div className="divide-y divide-border">
          {isLoading && <div className="px-5 py-6 text-sm text-muted">Loading attendance...</div>}
          {!isLoading && attendance.length === 0 && <div className="px-5 py-6 text-sm text-muted">No attendance logs for this month.</div>}
          {!isLoading && attendance.map((a) => (
            <div key={a.id} className="flex items-center justify-between px-5 py-3.5">
              <div>
                <p className="text-sm font-medium text-ink">
                  {format(new Date(a.date), 'EEEE, MMMM d')}
                </p>
                <p className="text-xs text-muted">
                  {a.timeIn && a.timeOut
                    ? `${formatTime(a.timeIn)} – ${formatTime(a.timeOut)} · ${a.hoursWorked.toFixed(1)}h`
                    : 'No record'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {a.overtimeHours > 0 && (
                  <span className="text-xs text-brand font-medium">+{a.overtimeHours}h OT</span>
                )}
                <Badge variant={statusVariant[a.status]} dot>
                  {a.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Request correction modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Request Attendance Correction"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={submitCorrection} isLoading={isSubmitting}>Submit Request</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Date"
            type="date"
            value={requestForm.date}
            onChange={(e) => setRequestForm((f) => ({ ...f, date: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Correct Time In"
              type="time"
              value={requestForm.requestedTimeIn}
              onChange={(e) => setRequestForm((f) => ({ ...f, requestedTimeIn: e.target.value }))}
            />
            <Input
              label="Correct Time Out"
              type="time"
              value={requestForm.requestedTimeOut}
              onChange={(e) => setRequestForm((f) => ({ ...f, requestedTimeOut: e.target.value }))}
            />
          </div>
          <Textarea
            label="Reason"
            rows={3}
            value={requestForm.reason}
            onChange={(e) => setRequestForm((f) => ({ ...f, reason: e.target.value }))}
            placeholder="Please explain why you need this correction..."
          />
        </div>
      </Modal>
    </div>
  )
}
