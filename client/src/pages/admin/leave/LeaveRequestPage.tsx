import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import Textarea from '../../../components/ui/Textarea'
import { FeedbackMessage, PageHeader } from '../../../components/ui/Page'
import { employeeService } from '../../../services/employeeService'
import { leaveService } from '../../../services/leaveService'
import type { Employee } from '../../../types'

const leaveRequestSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  leaveTypeId: z.string().min(1, 'Leave type is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  reason: z.string().min(5, 'Please provide a reason (at least 5 characters)'),
  emergencyReasonCategory: z.string().optional(),
  notificationAt: z.string().optional(),
  notificationMethod: z.string().optional(),
  deliveryDate: z.string().optional(),
  deliveryCount: z.coerce.number().optional(),
  spouseDeliveryCount: z.coerce.number().optional(),
  relationshipToDeceased: z.string().optional(),
  acknowledgedPolicy: z.boolean().optional(),
})

type FormValues = z.infer<typeof leaveRequestSchema>

export default function LeaveRequestPage() {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<FormValues>({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: { notificationMethod: 'email', acknowledgedPolicy: true },
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

  const selectedType = leaveTypes.find((leaveType) => leaveType.id === watch('leaveTypeId'))
  const selectedCode = selectedType?.code

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
      <PageHeader
        title="Submit Leave Request"
        subtitle="File a leave request on behalf of an employee or yourself."
      />

      {message && (
        <FeedbackMessage variant={message.toLowerCase().includes('unable') ? 'danger' : 'success'}>
          {message}
        </FeedbackMessage>
      )}

      <div className="max-w-2xl">
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Employee select */}
            <Select
              label="Employee"
              required
              error={errors.employeeId?.message}
                {...register('employeeId')}
              >
                <option value="">Select employee...</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName} ({employee.employeeNumber})
                  </option>
                ))}
            </Select>

            {/* Leave type */}
            <Select
              label="Leave Type"
              required
              error={errors.leaveTypeId?.message}
                {...register('leaveTypeId')}
              >
                <option value="">Select leave type...</option>
                {leaveTypes.map((leaveType) => (
                  <option key={leaveType.id} value={leaveType.id}>
                    {leaveType.name}
                  </option>
                ))}
            </Select>

            {/* Date range */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            {(selectedCode === 'SICK' || selectedCode === 'EMERGENCY') && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Notice Sent At" type="datetime-local" {...register('notificationAt')} error={errors.notificationAt?.message} />
                <Select label="Notice Method" {...register('notificationMethod')}>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="viber">Viber</option>
                    <option value="skype">Skype</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="messenger">Facebook Messenger</option>
                    <option value="call">Call</option>
                </Select>
              </div>
            )}

            {selectedCode === 'EMERGENCY' && (
              <Select label="Emergency Reason" {...register('emergencyReasonCategory')}>
                  <option value="">Select category...</option>
                  <option value="family_accident_hospitalization_serious_sickness">Family accident, hospitalization, or serious sickness</option>
                  <option value="natural_calamity">Natural calamity or fortuitous event</option>
                  <option value="extraordinary_situation">Fire, robbery, kidnapping, eviction, or similar</option>
              </Select>
            )}

            {selectedCode === 'BEREAVEMENT' && (
              <Select label="Relationship" {...register('relationshipToDeceased')}>
                  <option value="">Select relationship...</option>
                  <option value="spouse">Spouse</option>
                  <option value="parents">Parents</option>
                  <option value="siblings">Siblings</option>
                  <option value="parents_in_law">Parents-in-law</option>
              </Select>
            )}

            {(selectedCode === 'MATERNITY' || selectedCode === 'PATERNITY') && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Delivery Date" type="date" {...register('deliveryDate')} />
                <Input
                  label={selectedCode === 'MATERNITY' ? 'Delivery Count' : 'Spouse Delivery Count'}
                  type="number"
                  min={1}
                  max={4}
                  {...register(selectedCode === 'MATERNITY' ? 'deliveryCount' : 'spouseDeliveryCount')}
                />
              </div>
            )}

            <Textarea
              label="Reason"
              required
                {...register('reason')}
                rows={4}
                placeholder="Please provide the reason for this leave..."
              error={errors.reason?.message}
              />

            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" {...register('acknowledgedPolicy')} className="h-4 w-4 rounded border-border text-brand focus:ring-brand-200" />
              Employee acknowledged policy requirements
            </label>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" size="md" isLoading={isSubmitting}>Submit Request</Button>
              <Button type="button" variant="outline" onClick={() => reset()} disabled={isSubmitting}>Reset</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
