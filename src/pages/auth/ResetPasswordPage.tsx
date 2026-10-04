import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useResetPasswordMutation } from '@/features/auth/services/authApi'

const schema = z
  .object({
    password: z.string().min(8, 'At least 8 characters').regex(/[A-Z]/).regex(/[0-9]/),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  const [resetPassword, { isLoading }] = useResetPasswordMutation()

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (values: FormValues) => {
    if (!token) {
      toast.error('Invalid or expired reset link')
      return
    }
    try {
      await resetPassword({ token, ...values }).unwrap()
      setSuccess(true)
      setTimeout(() => navigate('/auth/login'), 3000)
    } catch {
      toast.error('Failed to reset password. The link may have expired.')
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <CheckCircle className="mx-auto size-16 text-emerald-500" />
        <h1 className="mt-4 text-2xl font-bold">Password reset!</h1>
        <p className="mt-2 text-muted-foreground">
          Your password has been successfully reset. Redirecting to sign in…
        </p>
        <Link to="/auth/login" className="mt-4 inline-block text-sm text-primary hover:underline">
          Sign in now
        </Link>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Invalid reset link</h1>
        <p className="mt-2 text-muted-foreground">This link is invalid or has expired.</p>
        <Link to="/auth/forgot-password" className="mt-4 inline-block text-sm text-primary hover:underline">
          Request a new link
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Set new password</h1>
        <p className="mt-2 text-muted-foreground">Choose a strong, unique password.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">New password</label>
          <Input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder="Create new password"
            startIcon={<Lock className="size-4" />}
            endIcon={
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            }
            error={errors.password?.message}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Confirm new password</label>
          <Input
            {...register('confirmPassword')}
            type="password"
            placeholder="Repeat password"
            startIcon={<Lock className="size-4" />}
            error={errors.confirmPassword?.message}
          />
        </div>
        <Button type="submit" className="w-full" size="lg" loading={isLoading}>
          Reset password
        </Button>
      </form>
    </div>
  )
}
