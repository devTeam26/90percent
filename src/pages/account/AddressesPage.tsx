import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit, Trash2, Star } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  useGetAddressesQuery, useAddAddressMutation,
  useDeleteAddressMutation, useSetDefaultAddressMutation
} from '@/data/useMockUserData'
import { Skeleton } from '@/components/common/Skeleton'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const addressSchema = z.object({
  label: z.string().min(1),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(3),
  country: z.string().min(2),
  phone: z.string().min(7),
})
type AddressFormValues = z.infer<typeof addressSchema>

export default function AddressesPage() {
  const [showForm, setShowForm] = useState(false)
  const { data, isLoading } = useGetAddressesQuery()
  const [addAddress, { isLoading: isAdding }] = useAddAddressMutation()
  const [deleteAddress] = useDeleteAddressMutation()
  const [setDefault] = useSetDefaultAddressMutation()
  const addresses = data?.data ?? []

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: { label: 'Home', country: 'US' },
  })

  const onSubmit = async (values: AddressFormValues) => {
    try {
      await addAddress({ ...values, isDefault: addresses.length === 0 }).unwrap()
      toast.success('Address added!')
      reset()
      setShowForm(false)
    } catch { toast.error('Failed to add address') }
  }

  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Addresses</h1>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 size-4" /> Add Address
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <Card>
              <CardContent className="pt-4">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                  <Input {...register('label')} placeholder="Label (Home, Work…)" error={errors.label?.message} />
                  <div className="grid grid-cols-2 gap-3">
                    <Input {...register('firstName')} placeholder="First name" error={errors.firstName?.message} />
                    <Input {...register('lastName')} placeholder="Last name" error={errors.lastName?.message} />
                  </div>
                  <Input {...register('addressLine1')} placeholder="Street address" error={errors.addressLine1?.message} />
                  <Input {...register('addressLine2')} placeholder="Apt, suite, etc. (optional)" />
                  <div className="grid grid-cols-3 gap-3">
                    <Input {...register('city')} placeholder="City" error={errors.city?.message} />
                    <Input {...register('state')} placeholder="State" error={errors.state?.message} />
                    <Input {...register('postalCode')} placeholder="ZIP" error={errors.postalCode?.message} />
                  </div>
                  <Input {...register('phone')} placeholder="Phone" type="tel" error={errors.phone?.message} />
                  <div className="flex gap-2">
                    <Button type="submit" loading={isAdding}>Save Address</Button>
                    <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      ) : addresses.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          <p>No addresses saved yet. Add one above!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr, i) => (
            <motion.div key={addr.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className={addr.isDefault ? 'border-primary' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{addr.label}</span>
                        {addr.isDefault && <Badge variant="default" className="text-[11px]">Default</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {addr.firstName} {addr.lastName} · {addr.phone}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {!addr.isDefault && (
                        <Button variant="ghost" size="sm" onClick={() => setDefault(addr.id)}>
                          <Star className="size-3.5 mr-1" /> Set default
                        </Button>
                      )}
                      <Button
                        variant="ghost" size="icon-sm"
                        className="text-destructive hover:text-destructive"
                        onClick={async () => {
                          await deleteAddress(addr.id).unwrap()
                          toast.success('Address deleted')
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
