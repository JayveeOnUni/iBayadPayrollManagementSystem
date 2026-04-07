import { useForm } from 'react-hook-form'
import { User, Lock, CreditCard, Save } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Avatar from '../../components/ui/Avatar'
import { useAuthStore } from '../../store/authStore'

export default function ProfilePage() {
  const { user } = useAuthStore()
  const fullName = user ? `${user.firstName} ${user.lastName}` : ''

  const { register: registerPersonal, handleSubmit: handlePersonal } = useForm({
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      phone: '09171234567',
      address: '123 Rizal Street, Brgy. Poblacion',
      city: 'Makati',
      province: 'Metro Manila',
    },
  })

  const { register: registerPassword, handleSubmit: handlePassword, reset: resetPassword } = useForm({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  const onSavePersonal = (data: unknown) => {
    console.log('Saving profile:', data)
    alert('Profile update request submitted. HR will review changes.')
  }

  const onChangePassword = (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    if (data.newPassword !== data.confirmPassword) {
      alert('Passwords do not match.')
      return
    }
    console.log('Changing password')
    alert('Password changed successfully.')
    resetPassword()
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-ink">My Profile</h2>
        <p className="text-sm text-muted mt-0.5">View and request updates to your personal information</p>
      </div>

      {/* Profile header */}
      <Card>
        <div className="flex items-center gap-5">
          <Avatar name={fullName} size="xl" />
          <div>
            <h3 className="text-lg font-bold text-ink">{fullName}</h3>
            <p className="text-sm text-muted">{user?.email}</p>
            <p className="text-xs text-slate-400 mt-0.5">Employee Portal</p>
          </div>
        </div>
      </Card>

      {/* Personal info */}
      <Card>
        <div className="flex items-center gap-2.5 mb-5">
          <User size={18} className="text-muted" />
          <h3 className="text-sm font-semibold text-ink">Personal Information</h3>
        </div>
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
          Changes to personal information require HR approval. Submit a request and HR will review it.
        </p>
        <form onSubmit={handlePersonal(onSavePersonal)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" {...registerPersonal('firstName')} />
            <Input label="Last Name" {...registerPersonal('lastName')} />
          </div>
          <Input label="Email Address" type="email" {...registerPersonal('email')} />
          <Input label="Phone Number" type="tel" {...registerPersonal('phone')} />
          <Input label="Address" {...registerPersonal('address')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="City" {...registerPersonal('city')} />
            <Input label="Province" {...registerPersonal('province')} />
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" size="sm" leftIcon={<Save size={14} />}>
              Submit Update Request
            </Button>
          </div>
        </form>
      </Card>

      {/* Change password */}
      <Card>
        <div className="flex items-center gap-2.5 mb-5">
          <Lock size={18} className="text-muted" />
          <h3 className="text-sm font-semibold text-ink">Change Password</h3>
        </div>
        <form onSubmit={handlePassword(onChangePassword)} className="space-y-4">
          <Input label="Current Password" type="password" {...registerPassword('currentPassword')} required />
          <Input label="New Password" type="password" hint="Minimum 8 characters" {...registerPassword('newPassword')} required />
          <Input label="Confirm New Password" type="password" {...registerPassword('confirmPassword')} required />
          <div className="flex justify-end pt-2">
            <Button type="submit" size="sm" leftIcon={<Lock size={14} />}>
              Update Password
            </Button>
          </div>
        </form>
      </Card>

      {/* Government IDs (view-only) */}
      <Card>
        <div className="flex items-center gap-2.5 mb-5">
          <CreditCard size={18} className="text-muted" />
          <h3 className="text-sm font-semibold text-ink">Government IDs (View Only)</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'SSS Number', value: '33-1234567-8' },
            { label: 'PhilHealth No.', value: '12-345678901-2' },
            { label: 'Pag-IBIG No.', value: '1234-5678-9012' },
            { label: 'TIN', value: '123-456-789-000' },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs text-muted">{item.label}</p>
              <p className="text-sm font-medium text-ink font-mono">{item.value}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted mt-4">
          To update government IDs, please contact HR directly.
        </p>
      </Card>
    </div>
  )
}
