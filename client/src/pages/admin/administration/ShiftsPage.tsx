import { useState } from 'react'
import { Plus, Edit2, Clock } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import Modal from '../../../components/ui/Modal'
import Input from '../../../components/ui/Input'
import type { Shift } from '../../../types'

const mockShifts: Shift[] = [
  { id: '1', name: 'Morning Shift', startTime: '08:00', endTime: '17:00', breakMinutes: 60, workingHoursPerDay: 8, isNightShift: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '2', name: 'Mid Shift', startTime: '12:00', endTime: '21:00', breakMinutes: 60, workingHoursPerDay: 8, isNightShift: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '3', name: 'Night Shift', startTime: '22:00', endTime: '06:00', breakMinutes: 60, workingHoursPerDay: 8, isNightShift: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
]

function formatShiftTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${h12}:${String(m).padStart(2, '0')} ${period}`
}

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>(mockShifts)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingShift, setEditingShift] = useState<Shift | null>(null)
  const [form, setForm] = useState({ name: '', startTime: '08:00', endTime: '17:00', breakMinutes: 60 })

  const openShiftModal = (shift?: Shift) => {
    setEditingShift(shift ?? null)
    setForm({
      name: shift?.name ?? '',
      startTime: shift?.startTime ?? '08:00',
      endTime: shift?.endTime ?? '17:00',
      breakMinutes: shift?.breakMinutes ?? 60,
    })
    setIsModalOpen(true)
  }

  const saveShift = () => {
    if (!form.name) return
    const shift: Shift = {
      id: editingShift?.id ?? crypto.randomUUID(),
      name: form.name,
      startTime: form.startTime,
      endTime: form.endTime,
      breakMinutes: form.breakMinutes,
      workingHoursPerDay: 8,
      isNightShift: Number(form.startTime.slice(0, 2)) >= 18,
      createdAt: editingShift?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setShifts((current) => editingShift ? current.map((item) => item.id === shift.id ? shift : item) : [...current, shift])
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink">Work Shifts</h2>
          <p className="text-sm text-muted mt-0.5">Manage employee shift schedules</p>
        </div>
        <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => openShiftModal()}>Add Shift</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {shifts.map((shift) => (
          <Card key={shift.id}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                  <Clock size={18} className="text-brand" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-ink">{shift.name}</h3>
                  {shift.isNightShift && (
                    <Badge variant="info" size="sm">Night Differential</Badge>
                  )}
                </div>
              </div>
              <Button size="xs" variant="ghost" leftIcon={<Edit2 size={12} />} onClick={() => openShiftModal(shift)}>Edit</Button>
            </div>

            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Start Time</span>
                <span className="font-medium text-ink">{formatShiftTime(shift.startTime)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">End Time</span>
                <span className="font-medium text-ink">{formatShiftTime(shift.endTime)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Break</span>
                <span className="font-medium text-ink">{shift.breakMinutes} minutes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Working Hours</span>
                <span className="font-medium text-ink">{shift.workingHoursPerDay}h / day</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingShift ? 'Edit Shift' : 'Add Shift'}
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={saveShift}>Save Shift</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Shift Name" value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} required />
          <Input label="Start Time" type="time" value={form.startTime} onChange={(e) => setForm((current) => ({ ...current, startTime: e.target.value }))} required />
          <Input label="End Time" type="time" value={form.endTime} onChange={(e) => setForm((current) => ({ ...current, endTime: e.target.value }))} required />
          <Input label="Break Minutes" type="number" value={form.breakMinutes} onChange={(e) => setForm((current) => ({ ...current, breakMinutes: Number(e.target.value) }))} required />
        </div>
      </Modal>
    </div>
  )
}
