/**
 * Mock data hooks — return the same shape as RTK Query so pages need
 * only a one-line import swap to switch between mock and real API.
 */
import { useMemo } from 'react'
import type { SearchFilters } from '@/types'
import {
  mockProducts,
  mockCategories,
  featuredProducts,
  bestSellers,
  newArrivals,
  getProductBySlug,
  getProductsByCategorySlug,
  getRelatedProducts,
  getSuggestions,
} from './mockProducts'

// ─── helpers ────────────────────────────────────────────────────────────────

function paginate<T>(items: T[], page: number, limit: number) {
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * limit
  return {
    items: items.slice(start, start + limit),
    meta: { total, page: safePage, totalPages, limit },
  }
}

function applyFilters(filters: SearchFilters) {
  let items = [...mockProducts]

  if (filters.query) {
    const q = filters.query.toLowerCase().trim()
    items = items.filter((p) => p.name.toLowerCase().includes(q))
  }

  if (filters.categoryId) {
    items = items.filter(
      (p) => p.category.id === filters.categoryId || p.category.slug === filters.categoryId
    )
  }

  if (filters.minPrice !== undefined) {
    items = items.filter((p) => p.price >= filters.minPrice!)
  }

  if (filters.maxPrice !== undefined) {
    items = items.filter((p) => p.price <= filters.maxPrice!)
  }

  if (filters.minRating !== undefined) {
    items = items.filter((p) => p.averageRating >= filters.minRating!)
  }

  if (filters.inStock) {
    items = items.filter((p) => p.stock > 0)
  }

  switch (filters.sortBy) {
    case 'price_asc':
      items.sort((a, b) => a.price - b.price)
      break
    case 'price_desc':
      items.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      items.sort((a, b) => b.averageRating - a.averageRating)
      break
    case 'newest':
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    case 'bestselling':
      items.sort((a, b) => b.salesCount - a.salesCount)
      break
    default:
      items.sort((a, b) => b.salesCount - a.salesCount)
  }

  return items
}

// ─── hooks ──────────────────────────────────────────────────────────────────

export function useGetProductsQuery(filters: SearchFilters) {
  const result = useMemo(() => {
    const filtered = applyFilters(filters)
    const { items, meta } = paginate(filtered, filters.page ?? 1, filters.limit ?? 24)
    return { data: { data: items, meta }, isLoading: false, isFetching: false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.query, filters.categoryId, filters.sortBy,
    filters.minPrice, filters.maxPrice, filters.minRating,
    filters.inStock, filters.page, filters.limit,
  ])
  return result
}

export function useGetFeaturedProductsQuery() {
  return useMemo(
    () => ({ data: { data: featuredProducts }, isLoading: false }),
    []
  )
}

export function useGetBestsellersQuery(args: { limit?: number }) {
  return useMemo(
    () => ({ data: { data: bestSellers.slice(0, args.limit ?? 12) }, isLoading: false }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [args.limit]
  )
}

export function useGetNewArrivalsQuery(args: { limit?: number }) {
  return useMemo(
    () => ({ data: { data: newArrivals.slice(0, args.limit ?? 12) }, isLoading: false }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [args.limit]
  )
}

export function useGetCategoriesQuery() {
  return useMemo(() => ({ data: { data: mockCategories }, isLoading: false }), [])
}

export function useGetCategoryQuery(slug: string) {
  const cat = useMemo(() => mockCategories.find((c) => c.slug === slug), [slug])
  return { data: cat ? { data: cat } : undefined, isLoading: false }
}

export function useGetProductQuery(slug: string, opts?: { skip?: boolean }) {
  const product = useMemo(
    () => (opts?.skip ? undefined : getProductBySlug(slug)),
    [slug, opts?.skip]
  )
  return { data: product ? { data: product } : undefined, isLoading: false }
}

export function useGetRelatedProductsQuery(
  productId: string,
  opts?: { skip?: boolean }
) {
  const related = useMemo(() => {
    if (opts?.skip || !productId) return []
    const product = mockProducts.find((p) => p.id === productId)
    return product ? getRelatedProducts(product, 8) : []
  }, [productId, opts?.skip])
  return { data: { data: related } }
}

export function useGetProductsByCategoryQuery(slug: string) {
  const products = useMemo(() => getProductsByCategorySlug(slug), [slug])
  return { data: { data: products }, isLoading: false }
}

export function useSearchSuggestionsQuery(
  query: string,
  opts?: { skip?: boolean }
) {
  const suggestions = useMemo(() => {
    if (opts?.skip || !query) return []
    return getSuggestions(query, 8)
  }, [query, opts?.skip])
  return { data: { data: { suggestions } } }
}
