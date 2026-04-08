import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Save } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'

interface LeaveSettingsForm {
  vacationLeaveCredits: number
  sickLeaveCredits: number
  emergencyLeaveCredits: number
  maternityLeaveCredits: number
  paternityLeaveCredits: number
  bereavementLeaveCredits: number
  leaveAccrualEnabled: boolean
  unusedLeaveConvertible: boolean
  unusedLeaveConversionRate: number
}

export default function LeaveSettingsPage() {
  const [message, setMessage] = useState<string | null>(null)
  const { register, handleSubmit } = useForm<LeaveSettingsForm>({
    defaultValues: {
      vacationLeaveCredits: 15,
      sickLeaveCredits: 15,
      emergencyLeaveCredits: 3,
      maternityLeaveCredits: 105,
      paternityLeaveCredits: 7,
      bereavementLeaveCredits: 3,
      leaveAccrualEnabled: true,
      unusedLeaveConvertible: true,
      unusedLeaveConversionRate: 100,
    },
  })

  const onSubmit = (data: LeaveSettingsForm) => {
    localStorage.setItem('ibayad-leave-settings', JSON.stringify(data))
    setMessage('Leave settings saved for this workstation.')
  }

  const leaveTypes = [
    { key: 'vacationLeaveCredits' as const, label: 'Vacation Leave', hint: 'Days per year' },
    { key: 'sickLeaveCredits' as const, label: 'Sick Leave', hint: 'Days per year' },
    { key: 'emergencyLeaveCredits' as const, label: 'Emergency Leave', hint: 'Days per year' },
    { key: 'maternityLeaveCredits' as const, label: 'Maternity Leave', hint: 'Calendar days (per RA 11210)' },
    { key: 'paternityLeaveCredits' as const, label: 'Paternity Leave', hint: 'Days (per RA 8187)' },
    { key: 'bereavementLeaveCredits' as const, label: 'Bereavement Leave', hint: 'Days per occurrence' },
  ]

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-ink">Leave Settings</h2>
        <p className="text-sm text-muted mt-0.5">Configure leave types, credits, and conversion rules</p>
      </div>

      {message && <div className="text-sm text-ink bg-slate-50 border border-border rounded-lg px-4 py-3">{message}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Card>
          <h3 className="text-sm font-semibold text-ink mb-5">Leave Credits Per Year</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {leaveTypes.map((lt) => (
              <Input
                key={lt.key}
                label={lt.label}
                type="number"
                hint={lt.hint}
                {...register(lt.key, { valueAsNumber: true })}
              />
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-ink mb-5">Accrual & Conversion</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="text-sm font-medium text-ink">Leave Accrual</p>
                <p className="text-xs text-muted">Distribute leave credits gradually (e.g. 1.25 days per month)</p>
              </div>
              <input type="checkbox" {...register('leaveAccrualEnabled')} className="w-5 h-5 accent-brand" />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="text-sm font-medium text-ink">Unused Leave Conversion</p>
                <p className="text-xs text-muted">Allow employees to convert unused leaves to cash at year-end</p>
              </div>
              <input type="checkbox" {...register('unusedLeaveConvertible')} className="w-5 h-5 accent-brand" />
            </div>

            <Input
              label="Conversion Rate (per day)"
              type="number"
              step="0.01"
              hint="Amount paid per unused leave day"
              {...register('unusedLeaveConversionRate', { valueAsNumber: true })}
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" leftIcon={<Save size={15} />}>Save Changes</Button>
        </div>
      </form>
    </div>
  )
}
