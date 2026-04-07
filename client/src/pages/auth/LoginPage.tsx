import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, CreditCard, Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useAuth } from '../../hooks/useAuth'
import type { LoginCredentials } from '../../types'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { login, isLoading, error } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginCredentials) => {
    await login(data)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sidebar to-slate-800 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-brand/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand to-brand-600 px-8 py-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <CreditCard size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-xl leading-tight">iBayad</h1>
                <p className="text-blue-200 text-xs">Payroll Management System</p>
              </div>
            </div>
            <h2 className="text-white text-2xl font-semibold">Welcome back</h2>
            <p className="text-blue-200 text-sm mt-1">Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            {error && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Email */}
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-sm font-medium text-ink">
                  Email address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@ibayad.com"
                    className={[
                      'w-full pl-9 pr-4 py-2.5 h-10 text-sm rounded-lg border bg-white',
                      'placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-brand',
                      errors.email
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-border focus:ring-brand-200',
                    ].join(' ')}
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-ink">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <a
                    href="#"
                    className="text-xs text-brand hover:text-brand-700 font-medium transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className={[
                      'w-full pl-9 pr-10 py-2.5 h-10 text-sm rounded-lg border bg-white',
                      'placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-brand',
                      errors.password
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-border focus:ring-brand-200',
                    ].join(' ')}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={isLoading}
                className="mt-2"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-muted">
              Having trouble accessing your account?{' '}
              <a href="mailto:support@ibayad.com" className="text-brand hover:underline font-medium">
                Contact support
              </a>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          © {new Date().getFullYear()} iBayad. All rights reserved.
        </p>
      </div>
    </div>
  )
}
