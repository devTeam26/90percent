import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Package, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetOrderQuery, useCancelOrderMutation } from '@/features/orders/services/ordersApi'
import { formatPrice, formatDate } from '@/lib/utils'
import { Skeleton } from '@/components/common/Skeleton'
import { toast } from 'sonner'
import type { OrderStatus } from '@/types'

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useGetOrderQuery(id!)
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation()
  const order = data?.data

  if (isLoading) return <div className="container py-8"><Skeleton className="h-96 rounded-xl" /></div>
  if (!order) return (
    <div className="container py-8 text-center">
      <p>Order not found</p>
      <Button className="mt-4" asChild><Link to="/account/orders">Back to Orders</Link></Button>
    </div>
  )

  const canCancel = ['pending', 'confirmed'].includes(order.status)

  return (
    <div className="container max-w-3xl py-8 space-y-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" asChild><Link to="/account/orders"><ArrowLeft className="size-4" /></Link></Button>
        <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Badge>{order.status.replace(/_/g, ' ')}</Badge>
        <span className="text-sm text-muted-foreground">Placed {formatDate(order.createdAt)}</span>
        {canCancel && (
          <Button
            variant="destructive" size="sm"
            loading={isCancelling}
            onClick={async () => {
              await cancelOrder({ id: order.id }).unwrap()
              toast.success('Order cancelled')
            }}
          >
            Cancel Order
          </Button>
        )}
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Package className="size-5" /> Items</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="size-16 shrink-0 rounded-lg overflow-hidden bg-muted">
                {item.product.images[0] && <img src={item.product.images[0].url} alt="" className="size-full object-cover" />}
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <span className="font-semibold">{formatPrice(item.totalPrice)}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {order.shipment && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Truck className="size-5" /> Tracking</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm">Carrier: {order.shipment.carrier}</p>
            <p className="text-sm font-mono">{order.shipment.trackingNumber}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4 space-y-2">
          {[
            { l: 'Subtotal', v: formatPrice(order.subtotal) },
            { l: 'Shipping', v: order.shipping === 0 ? 'Free' : formatPrice(order.shipping) },
            { l: 'Tax', v: formatPrice(order.tax) },
            ...(order.discount ? [{ l: 'Discount', v: `-${formatPrice(order.discount)}` }] : []),
          ].map(({ l, v }) => (
            <div key={l} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{l}</span><span>{v}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold border-t pt-2">
            <span>Total</span><span>{formatPrice(order.total)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
