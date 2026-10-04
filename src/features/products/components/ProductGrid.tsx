import { motion } from 'framer-motion'
import ProductCard from './ProductCard'
import { ProductCardSkeleton } from '@/components/common/Skeleton'
import type { Product } from '@/types'

interface ProductGridProps {
  products?: Product[]
  isLoading?: boolean
  columns?: 2 | 3 | 4 | 5
}

const GRID_COLS = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
}

export default function ProductGrid({ products = [], isLoading = false, columns = 4 }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className={`grid gap-4 ${GRID_COLS[columns]}`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl">🛍️</div>
        <h3 className="mt-4 text-lg font-semibold">No products found</h3>
        <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters or search terms.</p>
      </div>
    )
  }

  return (
    <motion.div
      layout
      className={`grid gap-4 ${GRID_COLS[columns]}`}
    >
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  )
}
