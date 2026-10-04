import { useState } from 'react'
import { Plus, Trash2, Tag } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useAdminGetCouponsQuery, useCreateCouponMutation, useDeleteCouponMutation } from '@/features/coupons/services/couponsApi'
import { Skeleton } from '@/components/common/Skeleton'
import { formatDate, formatPrice } from '@/lib/utils'
import type { CouponType } from '@/types'

const TYPE_LABELS: Record<CouponType, string> = { percentage: '% Off', fixed: '$ Off', free_shipping: 'Free Ship', buy_x_get_y: 'BXGY' }

export default function CouponsPage() {
  const [showForm, setShowForm] = useState(false)
  const { data, isLoading } = useAdminGetCouponsQuery({ page: 1 })
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation()
  const [deleteCoupon] = useDeleteCouponMutation()
  const coupons = data?.data ?? []

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 size-4" /> Create Coupon
        </Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
          <Card><CardContent className="pt-4">
            <form className="grid gap-3 sm:grid-cols-3" onSubmit={async (e) => {
              e.preventDefault()
              const fd = new FormData(e.currentTarget)
              await createCoupon({
                code: fd.get('code') as string,
                type: fd.get('type') as CouponType,
                value: Number(fd.get('value')),
                minOrderAmount: fd.get('minOrder') ? Number(fd.get('minOrder')) : undefined,
                usageLimit: fd.get('usageLimit') ? Number(fd.get('usageLimit')) : undefined,
                isActive: true,
              }).unwrap()
              toast.success('Coupon created!')
              setShowForm(false)
            }}>
              <Input name="code" placeholder="COUPON CODE" className="font-mono uppercase" required />
              <select name="type" className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
                <option value="free_shipping">Free Shipping</option>
              </select>
              <Input name="value" type="number" placeholder="Value (% or $)" required />
              <Input name="minOrder" type="number" placeholder="Min order amount" />
              <Input name="usageLimit" type="number" placeholder="Usage limit (optional)" />
              <Button type="submit" loading={isCreating}>Create</Button>
            </form>
          </CardContent></Card>
        </motion.div>
      )}

      <Card><CardContent className="p-0">
        {isLoading ? (
          <div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}</div>
        ) : (
          <table className="w-full">
            <thead><tr className="border-b text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <th className="p-4">Code</th><th className="p-4">Type</th><th className="p-4">Value</th><th className="p-4">Usage</th><th className="p-4">Status</th><th className="p-4">Actions</th>
            </tr></thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="p-4 font-mono font-semibold">{c.code}</td>
                  <td className="p-4 text-sm">{TYPE_LABELS[c.type]}</td>
                  <td className="p-4 text-sm">{c.type === 'percentage' ? `${c.value}%` : c.type === 'fixed' ? formatPrice(c.value) : '—'}</td>
                  <td className="p-4 text-sm">{c.usageCount}{c.usageLimit ? ` / ${c.usageLimit}` : ''}</td>
                  <td className="p-4"><Badge variant={c.isActive ? 'success' : 'secondary'}>{c.isActive ? 'Active' : 'Inactive'}</Badge></td>
                  <td className="p-4">
                    <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive" onClick={async () => { await deleteCoupon(c.id); toast.success('Coupon deleted') }}>
                      <Trash2 className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent></Card>
    </div>
  )
}
