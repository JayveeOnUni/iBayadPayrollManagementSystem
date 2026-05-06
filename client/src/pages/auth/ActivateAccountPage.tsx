import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, CreditCard, Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react'
import Button from '../../components/ui/Button'
import { authService } from '../../services/authService'
import type { ActivationTokenInfo } from '../../types'

const activationSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Confirm your password'),
}).refine((value) => value.password === value.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type ActivationFormValues = z.infer<typeof activationSchema>

export default function ActivateAccountPage() {
  const [searchParams] = useSearchParams()
  const token = useMemo(() => searchParams.get('token') ?? '', [searchParams])
  const [account, setAccount] = useState<ActivationTokenInfo | null>(null)
  const [isChecking, setIsChecking] = useState(true)
  const [isActivating, setIsActivating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ActivationFormValues>({
    resolver: zodResolver(activationSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('Activation token is missing.')
        setIsChecking(false)
        return
      }

      try {
        setIsChecking(true)
        setError(null)
        const data = await authService.verifyActivationToken(token)
        setAccount(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Activation link is invalid or expired.')
      } finally {
        setIsChecking(false)
      }
    }

    verifyToken()
  }, [token])

  const onSubmit = async (values: ActivationFormValues) => {
    try {
      setIsActivating(true)
      setError(null)
      const res = await authService.activateAccount(token, values.password)
      setSuccess(res.message ?? 'Account activated successfully. You can now sign in.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to activate account.')
    } finally {
      setIsActivating(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="bg-brand px-8 py-7">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <CreditCard size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight text-white">iBayad</h1>
              <p className="text-xs text-blue-100">Payroll Management System</p>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-white">Activate account</h2>
          <p className="mt-1 text-sm text-blue-100">Set your password to finish employee portal access.</p>
        </div>

        <div className="px-8 py-8">
          {isChecking && (
            <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
              Checking activation link...
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="space-y-5">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <div className="flex gap-2">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                  <span>{success}</span>
                </div>
              </div>
              <Link to="/login">
                <Button fullWidth>Go to sign in</Button>
              </Link>
            </div>
          )}

          {!isChecking && account && !success && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div className="rounded-lg border border-border bg-slate-50 px-4 py-3">
                <div className="flex items-start gap-2">
                  <ShieldCheck size={18} className="mt-0.5 shrink-0 text-brand" />
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {account.firstName} {account.lastName}
                    </p>
                    <p className="text-xs text-muted">{account.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-sm font-medium text-ink">
                  New password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={[
                      'h-10 w-full rounded-lg border bg-white py-2.5 pl-9 pr-10 text-sm',
                      'focus:border-brand focus:outline-none focus:ring-2',
                      errors.password ? 'border-red-400 focus:ring-red-200' : 'border-border focus:ring-brand-200',
                    ].join(' ')}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-ink">
                  Confirm password <span className="text-red-500">*</span>
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={[
                    'h-10 w-full rounded-lg border bg-white px-3 py-2.5 text-sm',
                    'focus:border-brand focus:outline-none focus:ring-2',
                    errors.confirmPassword ? 'border-red-400 focus:ring-red-200' : 'border-border focus:ring-brand-200',
                  ].join(' ')}
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>}
              </div>

              <Button type="submit" fullWidth size="lg" isLoading={isActivating}>
                Activate account
              </Button>
            </form>
          )}

          {!isChecking && !success && (
            <p className="mt-6 text-center text-xs text-muted">
              Already activated?{' '}
              <Link to="/login" className="font-medium text-brand hover:underline">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
