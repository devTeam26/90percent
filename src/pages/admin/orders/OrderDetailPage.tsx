import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetOrderQuery, useUpdateOrderStatusMutation } from '@/features/orders/services/ordersApi'
import { formatPrice, formatDate } from '@/lib/utils'
import { Skeleton } from '@/components/common/Skeleton'
import type { OrderStatus } from '@/types'

const STATUS_FLOW: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered']

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useGetOrderQuery(id!)
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation()
  const order = data?.data

  if (isLoading) return <div className="p-6"><Skeleton className="h-96 rounded-xl" /></div>
  if (!order) return <div className="p-6">Order not found</div>

  const currentIdx = STATUS_FLOW.indexOf(order.status as OrderStatus)

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" asChild><Link to="/admin/orders"><ArrowLeft className="size-4" /></Link></Button>
        <h1 className="text-xl font-bold">Order {order.orderNumber}</h1>
        <Badge>{order.status.replace(/_/g, ' ')}</Badge>
      </div>

      {/* Status stepper */}
      <Card>
        <CardHeader><CardTitle className="text-base">Order Progress</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {STATUS_FLOW.map((s, i) => (
              <div key={s} className="flex items-center gap-2 shrink-0">
                <div className={`flex flex-col items-center gap-1`}>
                  <div className={`flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold ${i <= currentIdx ? 'border-primary bg-primary text-primary-foreground' : 'border-muted text-muted-foreground'}`}>
                    {i < currentIdx ? <CheckCircle className="size-4" /> : i + 1}
                  </div>
                  <span className="text-[11px] text-muted-foreground capitalize">{s.replace(/_/g, ' ')}</span>
                </div>
                {i < STATUS_FLOW.length - 1 && <div className={`h-px w-8 ${i < currentIdx ? 'bg-primary' : 'bg-border'}`} />}
              </div>
            ))}
          </div>
          {currentIdx < STATUS_FLOW.length - 1 && (
            <Button
              className="mt-4" size="sm"
              loading={isUpdating}
              onClick={async () => {
                const next = STATUS_FLOW[currentIdx + 1]
                await updateStatus({ id: order.id, status: next }).unwrap()
                toast.success(`Status updated to ${next.replace(/_/g, ' ')}`)
              }}
            >
              Advance to: {STATUS_FLOW[currentIdx + 1]?.replace(/_/g, ' ')}
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Items ({order.items.length})</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="size-12 shrink-0 rounded-lg overflow-hidden bg-muted">
                  {item.product.images[0] && <img src={item.product.images[0].url} alt="" className="size-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity} × {formatPrice(item.unitPrice)}</p>
                </div>
                <span className="text-sm font-semibold">{formatPrice(item.totalPrice)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Customer & Shipping</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {order.user && (
              <div>
                <p className="font-medium">{order.user.firstName} {order.user.lastName}</p>
                <p className="text-muted-foreground">{order.user.email}</p>
              </div>
            )}
            <div className="border-t pt-2 text-muted-foreground">
              <p>{order.shippingAddress.addressLine1}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
            </div>
            <div className="border-t pt-2">
              <p className="font-medium">Payment: {order.paymentMethod.toUpperCase()}</p>
              <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>{order.paymentStatus}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
