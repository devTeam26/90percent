import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGetOrderQuery } from '@/data/useMockUserData'
import { formatPrice } from '@/lib/utils'

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const { data } = useGetOrderQuery(orderId!)
  const order = data?.data

  return (
    <div className="container max-w-lg py-16 text-center animate-fade-in">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}>
        <CheckCircle className="mx-auto size-20 text-emerald-500" />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h1 className="mt-6 text-3xl font-bold">Order Confirmed!</h1>
        {order && (
          <p className="mt-2 text-muted-foreground">
            Order <span className="font-mono font-semibold">{order.orderNumber}</span> · {formatPrice(order.total)}
          </p>
        )}
        <p className="mt-3 text-muted-foreground">
          Thank you for your purchase! You'll receive a confirmation email shortly.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Button size="lg" asChild>
            <Link to="/account/orders">
              <Package className="mr-2 size-4" /> Track Order
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/products">Continue Shopping <ArrowRight className="ml-2 size-4" /></Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
