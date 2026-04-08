import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Building2, Save } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'

interface GeneralSettingsForm {
  companyName: string
  address: string
  city: string
  province: string
  zipCode: string
  phone: string
  email: string
  tin: string
  sssEmployerNumber: string
  philhealthEmployerNumber: string
  pagibigEmployerNumber: string
}

export default function GeneralSettingsPage() {
  const [message, setMessage] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors } } = useForm<GeneralSettingsForm>({
    defaultValues: {
      companyName: 'iBayad Corporation',
      address: '123 Business Park, Ortigas Center',
      city: 'Pasig',
      province: 'Metro Manila',
      zipCode: '1605',
      phone: '+63 2 8888 0000',
      email: 'hr@ibayad.com',
      tin: '123-456-789-000',
      sssEmployerNumber: '03-1234567-8',
      philhealthEmployerNumber: '12-000000001-2',
      pagibigEmployerNumber: 'IBAY-0001',
    },
  })

  const onSubmit = (data: GeneralSettingsForm) => {
    localStorage.setItem('ibayad-general-settings', JSON.stringify(data))
    setMessage('General settings saved for this workstation.')
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-ink">General Settings</h2>
        <p className="text-sm text-muted mt-0.5">Configure company information and government IDs</p>
      </div>

      {message && <div className="text-sm text-ink bg-slate-50 border border-border rounded-lg px-4 py-3">{message}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Card>
          <div className="flex items-center gap-2.5 mb-5">
            <Building2 size={18} className="text-muted" />
            <h3 className="text-sm font-semibold text-ink">Company Information</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input label="Company Name" required {...register('companyName', { required: 'Required' })} error={errors.companyName?.message} />
            </div>
            <div className="sm:col-span-2">
              <Input label="Address" required {...register('address')} />
            </div>
            <Input label="City" {...register('city')} />
            <Input label="Province" {...register('province')} />
            <Input label="ZIP Code" {...register('zipCode')} />
            <Input label="Phone" type="tel" {...register('phone')} />
            <div className="sm:col-span-2">
              <Input label="HR Email" type="email" {...register('email')} />
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-ink mb-5">Government Registration Numbers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="BIR TIN" placeholder="123-456-789-000" {...register('tin')} />
            <Input label="SSS Employer Number" placeholder="03-0000000-0" {...register('sssEmployerNumber')} />
            <Input label="PhilHealth Employer Number" placeholder="12-000000001-2" {...register('philhealthEmployerNumber')} />
            <Input label="Pag-IBIG Employer ID" placeholder="XXXX-0000" {...register('pagibigEmployerNumber')} />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" leftIcon={<Save size={15} />}>Save Changes</Button>
        </div>
      </form>
    </div>
  )
}
