import { CreditCard, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useGetSavedPaymentMethodsQuery, useRemovePaymentMethodMutation } from '@/features/payments/services/paymentsApi'
import { Skeleton } from '@/components/common/Skeleton'

export default function PaymentMethodsPage() {
  const { data, isLoading } = useGetSavedPaymentMethodsQuery()
  const [remove, { isLoading: isRemoving }] = useRemovePaymentMethodMutation()
  const methods = data?.data ?? []

  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Payment Methods</h1>
        <Button size="sm"><Plus className="mr-2 size-4" /> Add Card</Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : methods.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          <CreditCard className="mx-auto size-10 mb-2 opacity-50" />
          <p>No saved payment methods</p>
        </div>
      ) : (
        <div className="space-y-3">
          {methods.map((m) => (
            <Card key={m.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                    <CreditCard className="size-5" />
                  </div>
                  <div>
                    <p className="font-medium capitalize">{m.brand} •••• {m.last4}</p>
                    <p className="text-xs text-muted-foreground">Expires {m.expMonth}/{m.expYear}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive hover:text-destructive"
                  loading={isRemoving}
                  onClick={async () => {
                    await remove(m.id)
                    toast.success('Card removed')
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
