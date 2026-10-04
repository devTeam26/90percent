import type { Product } from '@/types'
import { powerbanks }   from './products/powerbanks'
import { cablesMounts } from './products/cablesMounts'
import { earphones }    from './products/earphones'

export { mockCategories, getCategoryById, getCategoryBySlug } from './mockCategories'

export const mockProducts: Product[] = [
  ...powerbanks,
  ...cablesMounts,
  ...earphones,
]

export const featuredProducts: Product[] = mockProducts.filter((p) => p.isFeatured)

export const bestSellers: Product[] = [...mockProducts]
  .sort((a, b) => b.salesCount - a.salesCount)
  .slice(0, 12)

export const newArrivals: Product[] = [...mockProducts]
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 12)

export const topRated: Product[] = [...mockProducts]
  .sort((a, b) => b.averageRating - a.averageRating || b.reviewCount - a.reviewCount)
  .slice(0, 12)

export const onSale: Product[] = mockProducts.filter(
  (p) => p.compareAtPrice && p.compareAtPrice > p.price
)

export const getProductById   = (id: string):   Product | undefined => mockProducts.find((p) => p.id   === id)
export const getProductBySlug = (slug: string): Product | undefined => mockProducts.find((p) => p.slug === slug)

export const getProductsByCategorySlug = (slug: string): Product[] =>
  mockProducts.filter((p) => p.category.slug === slug)

export const getRelatedProducts = (product: Product, limit = 8): Product[] =>
  mockProducts
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, limit)

export const getSuggestions = (query: string, limit = 8): string[] => {
  const q = query.toLowerCase()
  const matches = mockProducts
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    )
    .map((p) => p.name)
  return [...new Set(matches)].slice(0, limit)
}
