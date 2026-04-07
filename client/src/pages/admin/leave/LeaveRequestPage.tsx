import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'

const leaveRequestSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  leaveType: z.enum(['vacation', 'sick', 'emergency', 'maternity', 'paternity', 'bereavement', 'others']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  reason: z.string().min(5, 'Please provide a reason (at least 5 characters)'),
})

type FormValues = z.infer<typeof leaveRequestSchema>

export default function LeaveRequestPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(leaveRequestSchema),
  })

  const onSubmit = (data: FormValues) => {
    console.log('Leave request:', data)
    alert('Leave request submitted successfully.')
    reset()
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-ink">Submit Leave Request</h2>
        <p className="text-sm text-muted mt-0.5">File a leave request on behalf of an employee or yourself</p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Employee select */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-ink">
                Employee <span className="text-red-500">*</span>
              </label>
              <select
                {...register('employeeId')}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 bg-white"
              >
                <option value="">Select employee...</option>
                <option value="1">Maria Santos (EMP-001)</option>
                <option value="2">Juan dela Cruz (EMP-002)</option>
                <option value="3">Ana Reyes (EMP-003)</option>
              </select>
              {errors.employeeId && <p className="text-xs text-red-600">{errors.employeeId.message}</p>}
            </div>

            {/* Leave type */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-ink">
                Leave Type <span className="text-red-500">*</span>
              </label>
              <select
                {...register('leaveType')}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 bg-white"
              >
                <option value="">Select leave type...</option>
                <option value="vacation">Vacation Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="emergency">Emergency Leave</option>
                <option value="maternity">Maternity Leave</option>
                <option value="paternity">Paternity Leave</option>
                <option value="bereavement">Bereavement Leave</option>
                <option value="others">Others</option>
              </select>
              {errors.leaveType && <p className="text-xs text-red-600">{errors.leaveType.message}</p>}
            </div>

            {/* Date range */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                required
                {...register('startDate')}
                error={errors.startDate?.message}
              />
              <Input
                label="End Date"
                type="date"
                required
                {...register('endDate')}
                error={errors.endDate?.message}
              />
            </div>

            {/* Reason */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-ink">
                Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('reason')}
                rows={4}
                placeholder="Please provide the reason for this leave..."
                className={[
                  'w-full px-3 py-2 text-sm border rounded-lg resize-none',
                  'focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand',
                  errors.reason ? 'border-red-400' : 'border-border',
                ].join(' ')}
              />
              {errors.reason && <p className="text-xs text-red-600">{errors.reason.message}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" size="md">Submit Request</Button>
              <Button type="button" variant="outline" onClick={() => reset()}>Reset</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
