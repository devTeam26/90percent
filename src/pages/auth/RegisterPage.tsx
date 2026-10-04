import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRegisterMutation } from '@/features/auth/services/authApi'
import { setCredentials } from '@/features/auth/store/authSlice'
import { useAppDispatch } from '@/app/hooks'

const schema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

const PasswordStrength = ({ password }: { password: string }) => {
  const checks = [
    { label: '8+ characters', pass: password.length >= 8 },
    { label: 'Uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /[0-9]/.test(password) },
    { label: 'Special character', pass: /[^A-Za-z0-9]/.test(password) },
  ]
  const score = checks.filter((c) => c.pass).length
  const color = score <= 1 ? 'bg-destructive' : score === 2 ? 'bg-amber-500' : score === 3 ? 'bg-yellow-400' : 'bg-emerald-500'

  if (!password) return null
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${i < score ? color : 'bg-muted'}`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {checks.map(({ label, pass }) => (
          <span key={label} className={`text-[11px] ${pass ? 'text-emerald-600' : 'text-muted-foreground'}`}>
            {pass ? '✓' : '○'} {label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [register, { isLoading }] = useRegisterMutation()

  const {
    register: reg,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const password = watch('password', '')

  const onSubmit = async (values: FormValues) => {
    try {
      const result = await register(values).unwrap()
      dispatch(setCredentials(result.data))
      toast.success('Account created! Welcome to 90percent!')
      navigate('/')
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message || 'Registration failed'
      toast.error(msg)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create account</h1>
        <p className="mt-2 text-muted-foreground">
          Join thousands of happy customers
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium">First name</label>
            <Input
              {...reg('firstName')}
              placeholder="John"
              startIcon={<User className="size-4" />}
              error={errors.firstName?.message}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Last name</label>
            <Input
              {...reg('lastName')}
              placeholder="Doe"
              error={errors.lastName?.message}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Email address</label>
          <Input
            {...reg('email')}
            type="email"
            placeholder="you@example.com"
            startIcon={<Mail className="size-4" />}
            error={errors.email?.message}
            autoComplete="email"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Password</label>
          <Input
            {...reg('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            startIcon={<Lock className="size-4" />}
            endIcon={
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            }
            error={errors.password?.message}
          />
          <PasswordStrength password={password} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Confirm password</label>
          <Input
            {...reg('confirmPassword')}
            type="password"
            placeholder="Repeat your password"
            startIcon={<Lock className="size-4" />}
            error={errors.confirmPassword?.message}
          />
        </div>

        <p className="text-xs text-muted-foreground">
          By creating an account, you agree to our{' '}
          <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and{' '}
          <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
        </p>

        <Button type="submit" className="w-full" size="lg" loading={isLoading}>
          Create free account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/auth/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
