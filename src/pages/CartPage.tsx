import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Plus, Minus, Heart, ArrowRight, Tag, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  removeItem, updateQuantity, saveForLater, moveToCart,
  applyCoupon, removeCoupon
} from '@/features/cart/store/cartSlice'
import { addToWishlist } from '@/features/wishlist/store/wishlistSlice'
import { useValidateCouponMutation } from '@/features/coupons/services/couponsApi'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const dispatch = useAppDispatch()
  const cart = useAppSelector((s) => s.cart.cart)
  const [couponInput, setCouponInput] = useState(cart?.couponCode ?? '')
  const [validateCoupon, { isLoading: validatingCoupon }] = useValidateCouponMutation()

  const activeItems = cart?.items.filter((i) => !i.savedForLater) ?? []
  const savedItems = cart?.items.filter((i) => i.savedForLater) ?? []

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return
    try {
      const result = await validateCoupon({ code: couponInput, orderAmount: cart?.subtotal ?? 0 }).unwrap()
      dispatch(applyCoupon({ code: couponInput, discount: result.data.discount }))
      toast.success(`Coupon applied! You saved ${formatPrice(result.data.discount)}`)
    } catch {
      toast.error('Invalid or expired coupon code')
    }
  }

  if (!cart || activeItems.length === 0) {
    return (
      <div className="container flex flex-col items-center justify-center py-24 text-center">
        <div className="flex size-24 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="size-12 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Looks like you haven't added anything yet.</p>
        <Button className="mt-6" size="lg" asChild>
          <Link to="/products">Start Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="mb-6 text-2xl font-bold">Shopping Cart ({activeItems.length} items)</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence>
            {activeItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                transition={{ duration: 0.2 }}
                className="flex gap-4 rounded-xl border bg-card p-4"
              >
                <Link to={`/products/${item.product.slug}`} className="size-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {item.product.images[0] && (
                    <img src={item.product.images[0].url} alt={item.product.name} className="size-full object-cover" />
                  )}
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/products/${item.product.slug}`} className="font-medium hover:text-primary line-clamp-2">
                      {item.product.name}
                    </Link>
                    <button
                      onClick={() => { dispatch(removeItem(item.id)); toast.success('Removed from cart') }}
                      className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  {item.variant && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {Object.entries(item.variant.attributes).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center rounded-lg border">
                      <button
                        onClick={() => dispatch(updateQuantity({ itemId: item.id, quantity: item.quantity - 1 }))}
                        className="flex size-9 items-center justify-center hover:bg-accent transition-colors"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => dispatch(updateQuantity({ itemId: item.id, quantity: item.quantity + 1 }))}
                        className="flex size-9 items-center justify-center hover:bg-accent transition-colors"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => {
                          dispatch(saveForLater(item.id))
                          toast.success('Saved for later')
                        }}
                      >
                        <Heart className="size-3.5" /> Save for later
                      </button>
                      <span className="font-bold text-lg">{formatPrice(item.totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Saved for later */}
          {savedItems.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-3 font-semibold text-muted-foreground">Saved for Later ({savedItems.length})</h2>
              <div className="space-y-3">
                {savedItems.map((item) => (
                  <div key={item.id} className="flex gap-4 rounded-xl border bg-card/50 p-4 opacity-70">
                    <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {item.product.images[0] && (
                        <img src={item.product.images[0].url} alt="" className="size-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.product.name}</p>
                      <p className="mt-1 font-semibold">{formatPrice(item.price)}</p>
                      <div className="mt-2 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { dispatch(moveToCart(item.id)); toast.success('Moved to cart') }}
                        >
                          Move to cart
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            dispatch(addToWishlist(item.product))
                            dispatch(removeItem(item.id))
                            toast.success('Added to wishlist')
                          }}
                        >
                          <Heart className="size-3.5 mr-1" /> Wishlist
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div>
          <div className="sticky top-20 rounded-xl border bg-card p-5 space-y-4">
            <h2 className="font-bold text-lg">Order Summary</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({activeItems.length} items)</span>
                <span className="font-medium">{formatPrice(cart.subtotal)}</span>
              </div>
              {cart.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span className="font-medium">-{formatPrice(cart.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">
                  {cart.shipping === 0 ? (
                    <Badge variant="success" className="text-[11px]">Free</Badge>
                  ) : formatPrice(cart.shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (est.)</span>
                <span className="font-medium">{formatPrice(cart.tax)}</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <Tag className="size-3.5" /> Coupon Code
              </label>
              <div className="flex gap-2">
                <Input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="ENTER CODE"
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  onClick={handleApplyCoupon}
                  loading={validatingCoupon}
                  disabled={!couponInput}
                >
                  Apply
                </Button>
              </div>
              {cart.couponCode && (
                <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 dark:bg-emerald-900/20">
                  <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
                    <Tag className="size-3.5" />
                    <span className="font-mono font-bold">{cart.couponCode}</span>
                    <span>applied</span>
                  </div>
                  <button
                    className="text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => { dispatch(removeCoupon()); setCouponInput('') }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(cart.total)}</span>
              </div>
            </div>

            <Button className="w-full gap-2" size="lg" asChild>
              <Link to="/checkout">
                Proceed to Checkout <ArrowRight className="size-4" />
              </Link>
            </Button>

            <Link to="/products" className="block text-center text-sm text-primary hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
