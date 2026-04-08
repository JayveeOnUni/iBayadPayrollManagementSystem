import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { employeeService } from '../../../services/employeeService'
import { leaveService } from '../../../services/leaveService'
import type { Employee } from '../../../types'

const leaveRequestSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  leaveTypeId: z.string().min(1, 'Leave type is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  reason: z.string().min(5, 'Please provide a reason (at least 5 characters)'),
})

type FormValues = z.infer<typeof leaveRequestSchema>

export default function LeaveRequestPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(leaveRequestSchema),
  })
  const [employees, setEmployees] = useState<Employee[]>([])
  const [leaveTypes, setLeaveTypes] = useState<Array<{ id: string; name: string; code: string }>>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [employeeRes, typeRes] = await Promise.all([
          employeeService.list({ limit: 100, status: 'active' }),
          leaveService.getTypes(),
        ])
        setEmployees(employeeRes.data)
        setLeaveTypes(typeRes.data)
      } catch (err) {
        setMessage(err instanceof Error ? err.message : 'Unable to load leave request options.')
      }
    }

    loadOptions()
  }, [])

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true)
      setMessage(null)
      await leaveService.apply(data)
      setMessage('Leave request submitted successfully.')
      reset()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Unable to submit leave request.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-ink">Submit Leave Request</h2>
        <p className="text-sm text-muted mt-0.5">File a leave request on behalf of an employee or yourself</p>
      </div>

      {message && (
        <div className="text-sm text-ink bg-slate-50 border border-border rounded-lg px-4 py-3">
          {message}
        </div>
      )}

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
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName} ({employee.employeeNumber})
                  </option>
                ))}
              </select>
              {errors.employeeId && <p className="text-xs text-red-600">{errors.employeeId.message}</p>}
            </div>

            {/* Leave type */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-ink">
                Leave Type <span className="text-red-500">*</span>
              </label>
              <select
                {...register('leaveTypeId')}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 bg-white"
              >
                <option value="">Select leave type...</option>
                {leaveTypes.map((leaveType) => (
                  <option key={leaveType.id} value={leaveType.id}>
                    {leaveType.name}
                  </option>
                ))}
              </select>
              {errors.leaveTypeId && <p className="text-xs text-red-600">{errors.leaveTypeId.message}</p>}
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
              <Button type="submit" size="md" isLoading={isSubmitting}>Submit Request</Button>
              <Button type="button" variant="outline" onClick={() => reset()} disabled={isSubmitting}>Reset</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
