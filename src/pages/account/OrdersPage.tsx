import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, ChevronRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { OrderCardSkeleton } from '@/components/common/Skeleton'
import { useGetOrdersQuery } from '@/features/orders/services/ordersApi'
import { formatPrice, formatDate } from '@/lib/utils'
import type { OrderStatus } from '@/types'

const STATUS_COLORS: Record<OrderStatus, 'warning' | 'info' | 'success' | 'destructive' | 'secondary'> = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'info',
  shipped: 'info',
  out_for_delivery: 'info',
  delivered: 'success',
  cancelled: 'destructive',
  return_requested: 'warning',
  returned: 'secondary',
  refunded: 'secondary',
}

const STATUS_TABS: { value: OrderStatus | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('')
  const { data, isLoading } = useGetOrdersQuery({ status: statusFilter || undefined })
  const orders = data?.data ?? []

  return (
    <div className="container max-w-3xl py-8 animate-fade-in">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" asChild>
          <Link to="/account"><ArrowLeft className="size-4" /></Link>
        </Button>
        <h1 className="text-2xl font-bold">My Orders</h1>
      </div>

      {/* Status filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_TABS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              statusFilter === value
                ? 'bg-primary text-primary-foreground'
                : 'border hover:border-foreground/30'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <OrderCardSkeleton key={i} />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <Package className="size-16 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">No orders yet</h2>
          <p className="mt-2 text-muted-foreground">When you place orders, they'll appear here.</p>
          <Button className="mt-6" asChild>
            <Link to="/products">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/account/orders/${order.id}`}
                className="block rounded-xl border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold">{order.orderNumber}</span>
                      <Badge variant={STATUS_COLORS[order.status]}>
                        {order.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatPrice(order.total)}</p>
                    <p className="text-xs text-muted-foreground">{order.items.length} item(s)</p>
                  </div>
                </div>

                {/* Product thumbnails */}
                <div className="mt-3 flex gap-2">
                  {order.items.slice(0, 4).map((item) => (
                    <div key={item.id} className="size-14 overflow-hidden rounded-lg bg-muted">
                      {item.product.images[0] && (
                        <img src={item.product.images[0].url} alt="" className="size-full object-cover" />
                      )}
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="flex size-14 items-center justify-center rounded-lg bg-muted text-sm font-medium">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between text-sm">
                  {order.shipment?.trackingNumber ? (
                    <span className="text-muted-foreground">
                      Tracking: <span className="font-mono">{order.shipment.trackingNumber}</span>
                    </span>
                  ) : (
                    <span />
                  )}
                  <div className="flex items-center gap-1 text-primary">
                    View details <ChevronRight className="size-3.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
