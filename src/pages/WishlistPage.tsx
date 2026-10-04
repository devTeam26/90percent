import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingCart, Trash2, Share2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { removeFromWishlist } from '@/features/wishlist/store/wishlistSlice'
import { addItem } from '@/features/cart/store/cartSlice'
import { setCartDrawer } from '@/features/ui/store/uiSlice'
import { formatPrice } from '@/lib/utils'

export default function WishlistPage() {
  const dispatch = useAppDispatch()
  const items = useAppSelector((s) => s.wishlist.items)

  const handleMoveToCart = (productId: string) => {
    const item = items.find((i) => i.productId === productId)
    if (!item) return
    dispatch(addItem({ product: item.product }))
    dispatch(removeFromWishlist(productId))
    dispatch(setCartDrawer(true))
    toast.success('Moved to cart!')
  }

  if (items.length === 0) {
    return (
      <div className="container flex flex-col items-center justify-center py-24 text-center">
        <div className="flex size-24 items-center justify-center rounded-full bg-muted">
          <Heart className="size-12 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Your wishlist is empty</h1>
        <p className="mt-2 text-muted-foreground">Save products you love for later.</p>
        <Button className="mt-6" size="lg" asChild>
          <Link to="/products">Explore Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8 animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Wishlist ({items.length})</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            navigator.clipboard?.writeText(window.location.href)
            toast.success('Wishlist link copied!')
          }}
        >
          <Share2 className="mr-2 size-4" /> Share
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence>
          {items.map((item, i) => (
            <motion.div
              key={item.productId}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border bg-card overflow-hidden group"
            >
              <Link to={`/products/${item.product.slug}`} className="relative block aspect-square bg-muted">
                {item.product.images[0] && (
                  <img
                    src={item.product.images[0].url}
                    alt={item.product.name}
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    dispatch(removeFromWishlist(item.productId))
                    toast.success('Removed from wishlist')
                  }}
                  className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </Link>
              <div className="p-3">
                <Link to={`/products/${item.product.slug}`} className="text-sm font-medium hover:text-primary line-clamp-2">
                  {item.product.name}
                </Link>
                <div className="mt-1 flex items-center justify-between">
                  <span className="font-bold">{formatPrice(item.product.price)}</span>
                  {item.product.stock === 0 && (
                    <span className="text-xs text-destructive">Out of stock</span>
                  )}
                </div>
                <Button
                  className="mt-3 w-full gap-2"
                  size="sm"
                  disabled={item.product.stock === 0}
                  onClick={() => handleMoveToCart(item.productId)}
                >
                  <ShoppingCart className="size-3.5" /> Add to Cart
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
