import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForgotPasswordMutation } from '@/features/auth/services/authApi'

const schema = z.object({ email: z.string().email('Invalid email address') })
type FormValues = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (values: FormValues) => {
    try {
      await forgotPassword(values).unwrap()
      setSent(true)
    } catch {
      toast.error('Failed to send reset email. Please try again.')
    }
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <CheckCircle className="size-16 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold">Check your email</h1>
        <p className="mt-2 text-muted-foreground">
          We've sent a password reset link to your email address.
          Check your inbox and follow the instructions.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Didn't receive it? Check your spam folder or{' '}
          <button
            onClick={() => setSent(false)}
            className="text-primary hover:underline"
          >
            try again
          </button>.
        </p>
        <Link
          to="/auth/login"
          className="mt-6 inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="size-4" /> Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Reset your password</h1>
        <p className="mt-2 text-muted-foreground">
          Enter your email and we'll send you a reset link.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email address</label>
          <Input
            {...register('email')}
            type="email"
            placeholder="you@example.com"
            startIcon={<Mail className="size-4" />}
            error={errors.email?.message}
          />
        </div>
        <Button type="submit" className="w-full" size="lg" loading={isLoading}>
          Send reset link
        </Button>
      </form>
      <div className="mt-6 text-center">
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to sign in
        </Link>
      </div>
    </div>
  )
}
