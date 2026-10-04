import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn, formatPrice } from '@/lib/utils'
import type { SearchFilters } from '@/types'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setFilters, resetFilters } from '@/features/search/store/searchSlice'
import { useGetCategoriesQuery } from '@/data/useMockData'

const RATINGS = [4, 3, 2, 1]
const SORT_OPTIONS = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'bestselling', label: 'Best Selling' },
] as const

interface AccordionSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function AccordionSection({ title, children, defaultOpen = true }: AccordionSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b pb-4">
      <button
        className="flex w-full items-center justify-between py-3 text-sm font-semibold"
        onClick={() => setOpen(!open)}
      >
        {title}
        <ChevronDown className={cn('size-4 transition-transform', open && 'rotate-180')} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ProductFilters() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((s) => s.search.filters)
  const { data: categoriesData } = useGetCategoriesQuery()
  const categories = categoriesData?.data ?? []

  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minPrice ?? 0,
    filters.maxPrice ?? 1000,
  ])

  const activeFilterCount = [
    filters.categoryId,
    filters.minPrice,
    filters.maxPrice,
    filters.minRating,
    filters.inStock,
  ].filter(Boolean).length

  const update = (patch: Partial<SearchFilters>) => dispatch(setFilters(patch))

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4" />
          <span className="font-semibold">Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-[11px]">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => dispatch(resetFilters())}>
            <X className="mr-1 size-3" /> Clear all
          </Button>
        )}
      </div>

      {/* Sort */}
      <AccordionSection title="Sort By">
        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={cn(
                'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                filters.sortBy === opt.value
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'hover:bg-accent'
              )}
              onClick={() => update({ sortBy: opt.value })}
            >
              <span
                className={cn(
                  'size-3 rounded-full border-2',
                  filters.sortBy === opt.value ? 'border-primary bg-primary' : 'border-muted-foreground'
                )}
              />
              {opt.label}
            </button>
          ))}
        </div>
      </AccordionSection>

      {/* Categories */}
      <AccordionSection title="Category">
        <div className="max-h-52 overflow-y-auto space-y-1 pr-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={cn(
                'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
                filters.categoryId === cat.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-accent'
              )}
              onClick={() =>
                update({ categoryId: filters.categoryId === cat.id ? undefined : cat.id })
              }
            >
              <span>{cat.name}</span>
              {cat.productCount != null && (
                <span className="text-xs text-muted-foreground">({cat.productCount})</span>
              )}
            </button>
          ))}
        </div>
      </AccordionSection>

      {/* Price */}
      <AccordionSection title="Price Range">
        <div className="px-1 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{formatPrice(priceRange[0])}</span>
            <span className="font-medium">{formatPrice(priceRange[1])}</span>
          </div>
          <div className="relative h-1.5 rounded-full bg-muted">
            <div
              className="absolute h-full rounded-full bg-primary"
              style={{
                left: `${(priceRange[0] / 1000) * 100}%`,
                right: `${100 - (priceRange[1] / 1000) * 100}%`,
              }}
            />
          </div>
          <div className="flex gap-2">
            <input
              type="range"
              min={0}
              max={1000}
              step={10}
              value={priceRange[0]}
              onChange={(e) => {
                const v = Number(e.target.value)
                if (v < priceRange[1]) {
                  setPriceRange([v, priceRange[1]])
                  update({ minPrice: v || undefined })
                }
              }}
              className="w-full accent-primary"
            />
            <input
              type="range"
              min={0}
              max={1000}
              step={10}
              value={priceRange[1]}
              onChange={(e) => {
                const v = Number(e.target.value)
                if (v > priceRange[0]) {
                  setPriceRange([priceRange[0], v])
                  update({ maxPrice: v < 1000 ? v : undefined })
                }
              }}
              className="w-full accent-primary"
            />
          </div>
        </div>
      </AccordionSection>

      {/* Rating */}
      <AccordionSection title="Minimum Rating">
        <div className="space-y-1">
          {RATINGS.map((r) => (
            <button
              key={r}
              className={cn(
                'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                filters.minRating === r ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-accent'
              )}
              onClick={() => update({ minRating: filters.minRating === r ? undefined : r })}
            >
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < r ? 'text-amber-400' : 'text-muted'}>★</span>
                ))}
              </div>
              <span>& up</span>
            </button>
          ))}
        </div>
      </AccordionSection>

      {/* Availability */}
      <AccordionSection title="Availability" defaultOpen={false}>
        <button
          className={cn(
            'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
            filters.inStock ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-accent'
          )}
          onClick={() => update({ inStock: filters.inStock ? undefined : true })}
        >
          <span
            className={cn(
              'flex size-4 items-center justify-center rounded border-2',
              filters.inStock ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'
            )}
          >
            {filters.inStock && <span className="text-[10px]">✓</span>}
          </span>
          In Stock Only
        </button>
      </AccordionSection>
    </div>
  )
}
