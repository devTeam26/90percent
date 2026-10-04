import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Star, Eye, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn, getDiscountPercentage } from '@/lib/utils'
import type { Product } from '@/types'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { addToWishlist, removeFromWishlist } from '@/features/wishlist/store/wishlistSlice'
import { addToRecentlyViewed } from '@/features/search/store/searchSlice'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact' | 'horizontal'
}

export default function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const dispatch = useAppDispatch()
  const [imageIdx, setImageIdx] = useState(0)

  const isWishlisted = useAppSelector((s) =>
    s.wishlist.items.some((i) => i.productId === product.id)
  )

  const mainImage = product.images[imageIdx]?.url || product.images[0]?.url
  const hoverImage = product.images[1]?.url
  const discountPct = product.compareAtPrice
    ? getDiscountPercentage(product.price, product.compareAtPrice)
    : 0

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id))
      toast.success('Removed from wishlist')
    } else {
      dispatch(addToWishlist(product))
      toast.success('Added to wishlist')
    }
  }

  if (variant === 'horizontal') {
    return (
      <Link
        to={`/products/${product.slug}`}
        className="flex gap-3 rounded-xl border bg-card p-3 hover:shadow-md transition-all duration-200"
        onClick={() => dispatch(addToRecentlyViewed(product.id))}
      >
        <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
          {mainImage && (
            <img src={mainImage} alt={product.name} className="size-full object-cover" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{product.name}</p>
          <div className="mt-1 flex items-center gap-1">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            <span className="text-xs text-muted-foreground">{product.averageRating.toFixed(1)}</span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      <Link
        to={`/products/${product.slug}`}
        className={cn(
          'block overflow-hidden rounded-xl border bg-card transition-all duration-300',
          'hover:shadow-lg hover:-translate-y-1',
          variant === 'compact' && 'flex gap-3 p-2'
        )}
        onClick={() => dispatch(addToRecentlyViewed(product.id))}
      >
        {/* Image container */}
        <div
          className={cn(
            'relative overflow-hidden bg-[#EEF3F2]',
            variant === 'default' ? 'aspect-square' : 'size-20 shrink-0 rounded-lg'
          )}
        >
          {mainImage && (
            <img
              src={mainImage}
              alt={product.name}
              className={cn(
                'size-full object-contain transition-all duration-500',
                hoverImage && 'group-hover:opacity-0'
              )}
              loading="lazy" decoding="async"
            />
          )}
          {hoverImage && (
            <img
              src={hoverImage}
              alt={product.name}
              className="absolute inset-0 size-full object-contain opacity-0 transition-all duration-500 group-hover:opacity-100"
              loading="lazy" decoding="async"
            />
          )}

          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {discountPct > 0 && (
              <Badge variant="destructive" className="text-[11px] px-1.5 py-0">
                -{discountPct}%
              </Badge>
            )}
            {product.isFeatured && (
              <Badge className="text-[11px] px-1.5 py-0">
                <Zap className="mr-0.5 size-2.5" /> Featured
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="secondary" className="text-[11px] px-1.5 py-0">
                Out of stock
              </Badge>
            )}
          </div>

          {/* Wishlist */}
          {variant === 'default' && (
            <button
              onClick={handleWishlist}
              className={cn(
                'absolute right-2 top-2 flex size-8 items-center justify-center rounded-full border bg-background/80 backdrop-blur-sm',
                'opacity-0 group-hover:opacity-100 transition-all duration-200',
                'hover:scale-110 active:scale-95',
                isWishlisted && '!opacity-100 bg-primary/10 border-primary'
              )}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                className={cn(
                  'size-4 transition-colors',
                  isWishlisted ? 'fill-primary text-primary' : 'text-muted-foreground'
                )}
              />
            </button>
          )}

          {/* Quick view */}
          {variant === 'default' && (
            <div className="absolute bottom-0 left-0 right-0 flex translate-y-full items-center justify-center gap-2 bg-gradient-to-t from-black/60 p-3 transition-transform duration-300 group-hover:translate-y-0">
              <Button size="icon-sm" variant="secondary" asChild>
                <Link to={`/products/${product.slug}`} onClick={(e) => e.stopPropagation()}>
                  <Eye className="size-3" />
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className={cn('p-3', variant === 'compact' && 'py-1')}>
          {product.brand && (
            <p className="text-xs font-medium text-primary">{product.brand.name}</p>
          )}
          <h3 className={cn('font-medium leading-snug line-clamp-2', variant === 'compact' ? 'text-xs' : 'text-sm mt-0.5')}>
            {product.name}
          </h3>

          {variant !== 'compact' && (
            <div className="mt-1 flex items-center gap-1">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'size-3',
                      i < Math.floor(product.averageRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-muted text-muted'
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
            </div>
          )}

          {/* Image dots */}
          {variant === 'default' && product.images.length > 1 && (
            <div className="mt-2 flex gap-1">
              {product.images.slice(0, 4).map((_, i) => (
                <button
                  key={i}
                  onMouseEnter={(e) => { e.preventDefault(); setImageIdx(i) }}
                  className={cn(
                    'h-1 rounded-full transition-all duration-200',
                    i === imageIdx ? 'w-4 bg-primary' : 'w-1 bg-muted-foreground/30'
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
