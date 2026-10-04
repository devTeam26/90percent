import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Camera, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { updateUser } from '@/features/auth/store/authSlice'
import { useUpdateProfileMutation } from '@/features/users/services/usersApi'
import { getInitials } from '@/lib/utils'

const schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().optional(),
})
type FormValues = z.infer<typeof schema>

export default function ProfilePage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const [updateProfile, { isLoading }] = useUpdateProfileMutation()

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: user?.firstName, lastName: user?.lastName, phone: user?.phone },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      const result = await updateProfile(values).unwrap()
      dispatch(updateUser(result.data))
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile')
    }
  }

  if (!user) return null

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="mb-6 text-2xl font-bold">My Profile</h1>
      <Card>
        <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="size-20 rounded-full object-cover" />
              ) : (
                <div className="flex size-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  {getInitials(user.firstName, user.lastName)}
                </div>
              )}
              <button className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full bg-primary text-white shadow-md">
                <Camera className="size-3.5" />
              </button>
            </div>
            <div>
              <p className="font-semibold">{user.firstName} {user.lastName}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium">First Name</label>
                <Input {...register('firstName')} error={errors.firstName?.message} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Last Name</label>
                <Input {...register('lastName')} error={errors.lastName?.message} />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Phone Number</label>
              <Input {...register('phone')} placeholder="+1 (555) 000-0000" type="tel" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email Address</label>
              <Input value={user.email} disabled className="opacity-60" />
              <p className="mt-1 text-xs text-muted-foreground">Email cannot be changed. Contact support if needed.</p>
            </div>
            <Button type="submit" loading={isLoading}>
              <Save className="mr-2 size-4" /> Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
