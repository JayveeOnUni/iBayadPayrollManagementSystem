import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { format, addMonths, subMonths } from '../../utils/dateHelpers'

const mockAttendance = [
  { date: '2026-04-07', timeIn: '08:02', timeOut: '17:05', hoursWorked: 9, status: 'present', overtime: 0 },
  { date: '2026-04-06', timeIn: '08:00', timeOut: '17:00', hoursWorked: 8, status: 'present', overtime: 0 },
  { date: '2026-04-05', timeIn: '08:10', timeOut: '17:00', hoursWorked: 7.83, status: 'present', overtime: 0 },
  { date: '2026-04-04', timeIn: '09:20', timeOut: '17:00', hoursWorked: 6.67, status: 'late', overtime: 0 },
  { date: '2026-04-03', timeIn: undefined, timeOut: undefined, hoursWorked: 0, status: 'absent', overtime: 0 },
  { date: '2026-04-02', timeIn: '08:00', timeOut: '17:00', hoursWorked: 8, status: 'present', overtime: 0 },
  { date: '2026-04-01', timeIn: '08:05', timeOut: '17:00', hoursWorked: 7.9, status: 'present', overtime: 0 },
]

const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  present: 'success',
  late: 'warning',
  absent: 'danger',
  on_leave: 'info',
}

export default function AttendancePage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3, 1))
  const [isModalOpen, setIsModalOpen] = useState(false)

  const present = mockAttendance.filter((a) => a.status === 'present' || a.status === 'late').length
  const absent = mockAttendance.filter((a) => a.status === 'absent').length
  const late = mockAttendance.filter((a) => a.status === 'late').length

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink">My Attendance</h2>
          <p className="text-sm text-muted mt-0.5">Track your daily time in and time out</p>
        </div>
        <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => setIsModalOpen(true)}>
          Request Correction
        </Button>
      </div>

      {/* Month nav */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
            className="p-2 rounded-lg hover:bg-slate-100 text-muted"
          >
            <ChevronLeft size={18} />
          </button>
          <p className="text-base font-semibold text-ink">
            {format(currentMonth, 'MMMM yyyy')}
          </p>
          <button
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            className="p-2 rounded-lg hover:bg-slate-100 text-muted"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Days Present', value: present, color: 'text-emerald-600' },
            { label: 'Days Absent', value: absent, color: 'text-red-600' },
            { label: 'Late Days', value: late, color: 'text-amber-600' },
          ].map((s) => (
            <div key={s.label} className="text-center bg-slate-50 rounded-xl p-3">
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
          {mockAttendance.map((a, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3.5">
              <div>
                <p className="text-sm font-medium text-ink">
                  {format(new Date(a.date), 'EEEE, MMMM d')}
                </p>
                <p className="text-xs text-muted">
                  {a.timeIn && a.timeOut
                    ? `${a.timeIn} – ${a.timeOut} · ${a.hoursWorked.toFixed(1)}h`
                    : 'No record'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {a.overtime > 0 && (
                  <span className="text-xs text-brand font-medium">+{a.overtime}h OT</span>
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
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsModalOpen(false)}>Submit Request</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-ink">Date</label>
            <input type="date" className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-ink">Correct Time In</label>
              <input type="time" className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-ink">Correct Time Out</label>
              <input type="time" className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-ink">Reason</label>
            <textarea
              rows={3}
              placeholder="Please explain why you need this correction..."
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 resize-none"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
