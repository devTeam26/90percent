import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Lock, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useChangePasswordMutation } from '@/features/auth/services/authApi'

const pwSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, { message: "Passwords don't match", path: ['confirmPassword'] })
type PwValues = z.infer<typeof pwSchema>

export default function SecurityPage() {
  const [changePassword, { isLoading }] = useChangePasswordMutation()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PwValues>({ resolver: zodResolver(pwSchema) })

  const onSubmit = async (values: PwValues) => {
    try {
      await changePassword(values).unwrap()
      toast.success('Password changed successfully!')
      reset()
    } catch { toast.error('Failed to change password') }
  }

  return (
    <div className="container max-w-2xl py-8 space-y-6">
      <h1 className="text-2xl font-bold">Security Settings</h1>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Lock className="size-5" /> Change Password</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Current Password</label>
              <Input {...register('currentPassword')} type="password" error={errors.currentPassword?.message} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">New Password</label>
              <Input {...register('newPassword')} type="password" error={errors.newPassword?.message} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Confirm New Password</label>
              <Input {...register('confirmPassword')} type="password" error={errors.confirmPassword?.message} />
            </div>
            <Button type="submit" loading={isLoading}>Change Password</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="size-5" /> Two-Factor Authentication</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security to your account.</p>
          <Button variant="outline">Enable 2FA</Button>
        </CardContent>
      </Card>
    </div>
  )
}
