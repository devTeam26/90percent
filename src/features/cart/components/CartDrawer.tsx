import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setCartDrawer } from '@/features/ui/store/uiSlice'
import { removeItem, updateQuantity } from '@/features/cart/store/cartSlice'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

export default function CartDrawer() {
  const dispatch = useAppDispatch()
  const open = useAppSelector((s) => s.ui.cartDrawerOpen)
  const cart = useAppSelector((s) => s.cart.cart)
  const items = cart?.items.filter((i) => !i.savedForLater) ?? []

  const close = () => dispatch(setCartDrawer(false))

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1C2B28]/50 backdrop-blur-sm"
            onClick={close}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-background shadow-2xl sm:max-w-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="size-5" />
                <span className="font-semibold">Your Cart</span>
                {items.length > 0 && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                    {items.reduce((a, i) => a + i.quantity, 0)}
                  </span>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={close}>
                <X className="size-5" />
              </Button>
            </div>

            {/* Items */}
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="flex size-20 items-center justify-center rounded-full bg-muted">
                  <ShoppingCart className="size-10 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Your cart is empty</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add items to start shopping
                  </p>
                </div>
                <Button asChild onClick={close}>
                  <Link to="/products">Browse Products</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-3 rounded-xl border bg-card p-3"
                      >
                        {/* Image */}
                        <Link
                          to={`/products/${item.product.slug}`}
                          onClick={close}
                          className="size-16 shrink-0 overflow-hidden rounded-lg bg-muted"
                        >
                          {item.product.images[0] && (
                            <img
                              src={item.product.images[0].url}
                              alt={item.product.name}
                              className="size-full object-cover"
                            />
                          )}
                        </Link>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <Link
                            to={`/products/${item.product.slug}`}
                            onClick={close}
                            className="line-clamp-2 text-sm font-medium hover:text-primary transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          {item.variant && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {Object.entries(item.variant.attributes)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(', ')}
                            </p>
                          )}
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center rounded-lg border">
                              <button
                                onClick={() => dispatch(updateQuantity({ itemId: item.id, quantity: item.quantity - 1 }))}
                                className="flex size-7 items-center justify-center hover:bg-accent transition-colors"
                              >
                                <Minus className="size-3" />
                              </button>
                              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                              <button
                                onClick={() => dispatch(updateQuantity({ itemId: item.id, quantity: item.quantity + 1 }))}
                                className="flex size-7 items-center justify-center hover:bg-accent transition-colors"
                              >
                                <Plus className="size-3" />
                              </button>
                            </div>
                            <span className="font-semibold text-sm">{formatPrice(item.totalPrice)}</span>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => {
                            dispatch(removeItem(item.id))
                            toast.success('Item removed')
                          }}
                          className="self-start text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="border-t p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">{formatPrice(cart?.subtotal ?? 0)}</span>
                  </div>
                  {(cart?.discount ?? 0) > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-600">Discount</span>
                      <span className="font-semibold text-emerald-600">-{formatPrice(cart?.discount ?? 0)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">{(cart?.shipping ?? 0) === 0 ? 'Free' : formatPrice(cart?.shipping ?? 0)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-3">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-xl">{formatPrice(cart?.total ?? 0)}</span>
                  </div>

                  <Button
                    className="w-full gap-2"
                    size="lg"
                    asChild
                    onClick={close}
                  >
                    <Link to="/checkout">
                      Checkout <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full" asChild onClick={close}>
                    <Link to="/cart">View full cart</Link>
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
