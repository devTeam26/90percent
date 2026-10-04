// ─── Imports ─────────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setCredentials } from '@/features/auth/store/authSlice'

// API: keep useLoginMutation; remove mockLogin & isMockNetworkError when backend is live
import { useLoginMutation } from '@/features/auth/services/authApi'
import { mockLogin, isMockNetworkError, MOCK_ACCOUNTS } from '@/data/mockAuth'

// ─── Brand colors ─────────────────────────────────────────────────────────────
const ORANGE = '#8BADA4'
const DARK   = '#1C2B28'

// ─── Validation ───────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email:      z.string().email('Invalid email address'),
  password:   z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})
type LoginFormValues = z.infer<typeof loginSchema>

// ─── Social providers ─────────────────────────────────────────────────────────
// API: add OAuth redirect URL per provider when integrating
const SOCIAL_PROVIDERS = [
  { label: 'Google',   icon: 'G' },
  { label: 'Facebook', icon: 'f' },
  { label: 'Apple',    icon: '' },
]

// ─── Component ────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const dispatch            = useAppDispatch()
  const navigate            = useNavigate()
  const location            = useLocation()
  const { isAuthenticated } = useAppSelector((s) => s.auth)
  const [showPassword, setShowPassword] = useState(false)
  const redirectTo = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/'

  // API: POST /auth/login → { data: { user, accessToken, refreshToken } }
  const [login, { isLoading }] = useLoginMutation()

  const { register, handleSubmit, setValue, formState: { errors } } =
    useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  useEffect(() => {
    if (isAuthenticated) navigate(redirectTo, { replace: true })
  }, [isAuthenticated, navigate, redirectTo])

  // ── Submit ────────────────────────────────────────────────────────────────
  const onSubmit = async (values: LoginFormValues) => {
    try {
      // API: real login call
      const result = await login(values).unwrap()
      dispatch(setCredentials(result.data))
      toast.success(`Welcome back, ${result.data.user.firstName}!`)
      navigate(redirectTo, { replace: true })
    } catch (err: unknown) {
      // API: REMOVE this block when backend is live
      if (isMockNetworkError(err)) {
        try {
          const mockResult = mockLogin(values.email, values.password)
          dispatch(setCredentials(mockResult))
          toast.success(`Welcome back, ${mockResult.user.firstName}!`)
          const dest = ['admin', 'vendor', 'support'].includes(mockResult.user.role)
            ? '/admin' : redirectTo
          navigate(dest, { replace: true })
        } catch { toast.error('Invalid email or password') }
        return
      }
      const message = (err as { data?: { message?: string } })?.data?.message ?? 'Login failed'
      toast.error(message)
    }
  }

  // API: REPLACE with OAuth redirect per provider
  const handleSocialLogin = (provider: string) =>
    toast.info(`${provider} login coming soon!`)

  // DEV ONLY
  const fillDemo = (email: string, password: string) => {
    setValue('email', email)
    setValue('password', password)
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="w-full">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: DARK }}>
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm" style={{ color: 'rgba(45,58,74,0.6)' }}>
          Sign in to continue to your account
        </p>
      </div>

      {/* Social login buttons */}
      <div className="flex gap-3 mb-6">
        {SOCIAL_PROVIDERS.map(({ label, icon }) => (
          <button
            key={label}
            type="button"
            onClick={() => handleSocialLogin(label.toLowerCase())}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all"
            style={{
              borderColor: 'rgba(45,58,74,0.15)',
              color: DARK,
              background: '#f8f9fb',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = ORANGE
              ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(139,173,164,0.05)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(45,58,74,0.15)'
              ;(e.currentTarget as HTMLButtonElement).style.background = '#f8f9fb'
            }}
          >
            <span className="font-bold text-base leading-none">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="relative my-6 flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: 'rgba(45,58,74,0.12)' }} />
        <span className="text-xs font-medium" style={{ color: 'rgba(45,58,74,0.4)' }}>
          or continue with email
        </span>
        <div className="h-px flex-1" style={{ background: 'rgba(45,58,74,0.12)' }} />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Email */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold" style={{ color: DARK }}>
            Email address
          </label>
          <Input
            {...register('email')}
            type="email"
            placeholder="you@example.com"
            startIcon={<Mail className="size-4" style={{ color: ORANGE }} />}
            error={errors.email?.message}
            autoComplete="email"
          />
        </div>

        {/* Password */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-semibold" style={{ color: DARK }}>
              Password
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-xs font-medium hover:underline"
              style={{ color: ORANGE }}
            >
              Forgot password?
            </Link>
          </div>
          <Input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            startIcon={<Lock className="size-4" style={{ color: ORANGE }} />}
            endIcon={
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{ color: 'rgba(45,58,74,0.4)' }}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            }
            error={errors.password?.message}
            autoComplete="current-password"
          />
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2">
          <input
            {...register('rememberMe')}
            type="checkbox"
            id="rememberMe"
            className="size-4 rounded"
            style={{ accentColor: ORANGE }}
          />
          <label htmlFor="rememberMe" className="text-sm" style={{ color: 'rgba(45,58,74,0.6)' }}>
            Remember me for 30 days
          </label>
        </div>

        {/* Submit — API: isLoading from useLoginMutation */}
        <Button
          type="submit"
          className="w-full text-white font-semibold"
          size="lg"
          loading={isLoading}
          style={{ background: `linear-gradient(135deg, ${ORANGE} 0%, #5C8880 100%)`, border: 'none' }}
        >
          Sign in <ArrowRight className="ml-2 size-4" />
        </Button>

      </form>

      {/* Register link */}
      <p className="mt-6 text-center text-sm" style={{ color: 'rgba(45,58,74,0.6)' }}>
        Don't have an account?{' '}
        <Link
          to="/auth/register"
          className="font-semibold hover:underline"
          style={{ color: ORANGE }}
        >
          Create one free
        </Link>
      </p>

      {/* Demo accounts — DEV ONLY: API: REMOVE before production */}
      <div className="mt-8 rounded-2xl border border-dashed p-4"
        style={{ borderColor: 'rgba(45,58,74,0.15)', background: 'rgba(45,58,74,0.03)' }}>
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'rgba(45,58,74,0.4)' }}>
          Demo accounts — click to fill
        </p>
        <div className="grid grid-cols-2 gap-2">
          {MOCK_ACCOUNTS.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => fillDemo(account.email, account.password)}
              className="rounded-xl border px-3 py-2.5 text-left transition-all"
              style={{ borderColor: 'rgba(45,58,74,0.12)', background: '#fff' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = ORANGE
                ;(e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 0 1px ${ORANGE}20`
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(45,58,74,0.12)'
                ;(e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium" style={{ color: DARK }}>{account.email}</p>
                  <p className="text-[11px]" style={{ color: 'rgba(45,58,74,0.5)' }}>{account.password}</p>
                </div>
                <span className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize"
                  style={{ background: 'rgba(139,173,164,0.1)', color: ORANGE }}>
                  {account.role}
                </span>
              </div>
            </button>
          ))}
        </div>
        <p className="mt-3 text-center text-xs" style={{ color: 'rgba(45,58,74,0.4)' }}>
          Click an account above, then press <strong>Sign in</strong>
        </p>
      </div>

    </div>
  )
}
