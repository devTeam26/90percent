import type { Category } from '@/types'

export const mockCategories: Category[] = [
  {
    id: 'cat-power-banks',
    name: 'Power Banks',
    slug: 'power-banks',
    description: '90percent compact power banks — fast charge, built-in cables, and travel designs',
    image: '',
    isActive: true,
    sortOrder: 1,
    productCount: 8,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-accessories',
    name: 'Accessories',
    slug: 'accessories',
    description: '90percent braided cables, car mounts, and essential accessories',
    image: '',
    isActive: true,
    sortOrder: 2,
    productCount: 14,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-speakers',
    name: 'Speakers',
    slug: 'speakers',
    description: '90percent SoundPod wireless speakers and earbuds — hi-fi audio anywhere',
    image: '',
    isActive: true,
    sortOrder: 3,
    productCount: 12,
    createdAt: '2024-01-01T00:00:00Z',
  },
]

export const getCategoryById   = (id: string)   => mockCategories.find((c) => c.id === id)
export const getCategoryBySlug = (slug: string) => mockCategories.find((c) => c.slug === slug)
