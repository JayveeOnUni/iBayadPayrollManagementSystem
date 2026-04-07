import { useForm } from 'react-hook-form'
import { Save, Info } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'

interface PayrollSettingsForm {
  payFrequency: 'weekly' | 'semi_monthly' | 'monthly'
  semiMonthlyCutoff1: number
  semiMonthlyCutoff2: number
  semiMonthlyPayDay1: number
  semiMonthlyPayDay2: number
  workingHoursPerDay: number
  workingDaysPerWeek: number
  overtimeRate: number
  nightDifferentialStartTime: string
  nightDifferentialEndTime: string
  nightDifferentialRate: number
  regularHolidayRate: number
  specialHolidayRate: number
  thirteenthMonthEnabled: boolean
}

export default function PayrollSettingsPage() {
  const { register, handleSubmit, watch } = useForm<PayrollSettingsForm>({
    defaultValues: {
      payFrequency: 'semi_monthly',
      semiMonthlyCutoff1: 15,
      semiMonthlyCutoff2: 31,
      semiMonthlyPayDay1: 20,
      semiMonthlyPayDay2: 5,
      workingHoursPerDay: 8,
      workingDaysPerWeek: 5,
      overtimeRate: 1.25,
      nightDifferentialStartTime: '22:00',
      nightDifferentialEndTime: '06:00',
      nightDifferentialRate: 0.10,
      regularHolidayRate: 2.00,
      specialHolidayRate: 1.30,
      thirteenthMonthEnabled: true,
    },
  })

  const onSubmit = (data: PayrollSettingsForm) => {
    console.log('Saving payroll settings:', data)
    alert('Payroll settings saved.')
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-ink">Payroll Settings</h2>
        <p className="text-sm text-muted mt-0.5">Configure pay frequency, work hours, overtime, and holiday rules</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Pay Frequency */}
        <Card>
          <h3 className="text-sm font-semibold text-ink mb-5">Pay Schedule</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-ink">Pay Frequency</label>
              <select {...register('payFrequency')} className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 bg-white">
                <option value="weekly">Weekly</option>
                <option value="semi_monthly">Semi-Monthly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex gap-2">
              <Info size={15} className="text-brand mt-0.5 flex-shrink-0" />
              <p className="text-xs text-brand">
                Semi-monthly pay means employees are paid twice a month. Cutoff dates determine which period's attendance and deductions are included.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted uppercase tracking-wide">1st Period</p>
              <Input label="Cutoff Day" type="number" min={1} max={31} {...register('semiMonthlyCutoff1', { valueAsNumber: true })} hint="Day of month (e.g. 15)" />
              <Input label="Pay Day" type="number" min={1} max={31} {...register('semiMonthlyPayDay1', { valueAsNumber: true })} hint="Pay date (e.g. 20)" />
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted uppercase tracking-wide">2nd Period</p>
              <Input label="Cutoff Day" type="number" min={1} max={31} {...register('semiMonthlyCutoff2', { valueAsNumber: true })} hint="End of month = 31" />
              <Input label="Pay Day" type="number" min={1} max={31} {...register('semiMonthlyPayDay2', { valueAsNumber: true })} hint="5th of next month" />
            </div>
          </div>
        </Card>

        {/* Work Hours */}
        <Card>
          <h3 className="text-sm font-semibold text-ink mb-5">Working Hours</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Working Hours / Day" type="number" step="0.5" {...register('workingHoursPerDay', { valueAsNumber: true })} />
            <Input label="Working Days / Week" type="number" {...register('workingDaysPerWeek', { valueAsNumber: true })} />
          </div>
        </Card>

        {/* Overtime & Rates */}
        <Card>
          <h3 className="text-sm font-semibold text-ink mb-5">Pay Rate Multipliers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-ink">Overtime Rate</label>
              <Input type="number" step="0.01" {...register('overtimeRate', { valueAsNumber: true })} hint="e.g. 1.25 = 125%" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-ink">Regular Holiday Rate</label>
              <Input type="number" step="0.01" {...register('regularHolidayRate', { valueAsNumber: true })} hint="e.g. 2.00 = 200%" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-ink">Special Holiday Rate</label>
              <Input type="number" step="0.01" {...register('specialHolidayRate', { valueAsNumber: true })} hint="e.g. 1.30 = 130%" />
            </div>
          </div>
        </Card>

        {/* Night Differential */}
        <Card>
          <h3 className="text-sm font-semibold text-ink mb-5">Night Differential</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Start Time" type="time" {...register('nightDifferentialStartTime')} />
            <Input label="End Time" type="time" {...register('nightDifferentialEndTime')} />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-ink">Rate (additional)</label>
              <Input type="number" step="0.01" {...register('nightDifferentialRate', { valueAsNumber: true })} hint="e.g. 0.10 = +10%" />
            </div>
          </div>
        </Card>

        {/* 13th Month */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-ink">13th Month Pay</h3>
              <p className="text-xs text-muted mt-0.5">Auto-compute 13th month pay (= Total Basic Salary ÷ 12)</p>
            </div>
            <input
              type="checkbox"
              {...register('thirteenthMonthEnabled')}
              className="w-5 h-5 accent-brand"
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
