import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useVerifyEmailMutation, useResendVerificationMutation } from '@/features/auth/services/authApi'
import { useAppSelector } from '@/app/hooks'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const user = useAppSelector((s) => s.auth.user)
  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'pending'>('pending')
  const [verifyEmail] = useVerifyEmailMutation()
  const [resend, { isLoading: isResending }] = useResendVerificationMutation()

  useEffect(() => {
    if (!token) { setStatus('pending'); return }
    setStatus('verifying')
    verifyEmail({ token })
      .unwrap()
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [token, verifyEmail])

  if (status === 'verifying') {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="size-12 animate-spin text-primary" />
        <h1 className="text-2xl font-bold">Verifying your email…</h1>
      </div>
    )
  }
  if (status === 'success') {
    return (
      <div className="text-center">
        <CheckCircle className="mx-auto size-16 text-emerald-500" />
        <h1 className="mt-4 text-2xl font-bold">Email verified!</h1>
        <p className="mt-2 text-muted-foreground">Your email has been verified successfully.</p>
        <Button className="mt-6" asChild><Link to="/">Start Shopping</Link></Button>
      </div>
    )
  }
  if (status === 'error') {
    return (
      <div className="text-center">
        <XCircle className="mx-auto size-16 text-destructive" />
        <h1 className="mt-4 text-2xl font-bold">Verification failed</h1>
        <p className="mt-2 text-muted-foreground">This link may have expired or already been used.</p>
        {user?.email && (
          <Button className="mt-6" loading={isResending} onClick={() => resend({ email: user.email })}>
            Resend verification email
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
        <Mail className="size-8 text-primary" />
      </div>
      <h1 className="text-2xl font-bold">Verify your email</h1>
      <p className="mt-2 text-muted-foreground">
        We sent a verification link to{' '}
        {user?.email ? <strong>{user.email}</strong> : 'your email address'}.
        Please check your inbox.
      </p>
      {user?.email && (
        <Button variant="outline" className="mt-6" loading={isResending}
          onClick={() => resend({ email: user.email })}>
          Resend verification email
        </Button>
      )}
      <p className="mt-4 text-sm text-muted-foreground">
        <Link to="/" className="text-primary hover:underline">Skip for now</Link>
      </p>
    </div>
  )
}
