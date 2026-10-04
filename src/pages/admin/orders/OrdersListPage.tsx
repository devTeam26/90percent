import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Eye, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdminGetOrdersQuery } from '@/features/orders/services/ordersApi'
import { formatPrice, formatDate } from '@/lib/utils'
import { Skeleton } from '@/components/common/Skeleton'
import Pagination from '@/components/common/Pagination'
import type { OrderStatus } from '@/types'

const STATUS_COLORS: Record<OrderStatus, string> = {
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
} as Record<OrderStatus, string>

const STATUS_OPTIONS: { value: OrderStatus | ''; label: string }[] = [
  { value: '', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'return_requested', label: 'Return Requested' },
]

export default function OrdersListPage() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<OrderStatus | ''>('')
  const [search, setSearch] = useState('')

  const { data, isLoading } = useAdminGetOrdersQuery({ page, limit: 20, status: status || undefined, search })
  const orders = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap gap-3 p-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search order # or customer…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              startIcon={<Search className="size-4" />}
            />
          </div>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value as OrderStatus | ''); setPage(1) }}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="p-4">Order</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <span className="font-mono text-sm font-semibold">{order.orderNumber}</span>
                      </td>
                      <td className="p-4">
                        {order.user && (
                          <div>
                            <p className="text-sm font-medium">{order.user.firstName} {order.user.lastName}</p>
                            <p className="text-xs text-muted-foreground">{order.user.email}</p>
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {formatDate(order.createdAt, { dateStyle: 'medium' })}
                      </td>
                      <td className="p-4 text-sm">{order.items.length} item(s)</td>
                      <td className="p-4 text-sm font-semibold">{formatPrice(order.total)}</td>
                      <td className="p-4">
                        <Badge variant={(STATUS_COLORS[order.status] as 'warning' | 'info' | 'success' | 'destructive' | 'secondary') || 'secondary'}>
                          {order.status.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Button variant="ghost" size="icon-sm" asChild>
                          <Link to={`/admin/orders/${order.id}`}>
                            <Eye className="size-4" />
                          </Link>
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  No orders found
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {meta && meta.totalPages > 1 && (
        <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />
      )}
    </div>
  )
}
