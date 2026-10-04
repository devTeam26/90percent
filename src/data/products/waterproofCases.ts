import type { Product } from '@/types'
import { getCategoryById } from '../mockCategories'
const wp_black = '', wp_blue = '', wp_pink = '', wp_green = '', wp_white = ''

const cat = getCategoryById('cat-accessories')!

const WP_SPECS = [
  { label: 'Protection',    value: 'IP68 Waterproof — submersible up to 2m for 30 minutes' },
  { label: 'Drop rating',   value: 'Military-grade MIL-STD-810H drop protection' },
  { label: 'Material',      value: 'Polycarbonate hard shell + TPU inner layer' },
  { label: 'Screen access', value: 'Full touchscreen compatible front cover' },
  { label: 'Ports',         value: 'Sealed port covers for charging and headphone jack' },
  { label: 'Colors',        value: 'Black, Blue, Pink, Green, White' },
]

export const waterproofCases: Product[] = [
  {
    id: 'prod-wp-case',
    name: '90percent WaterProof Case',
    slug: '90percent-waterproof-case',
    description: 'The 90percent WaterProof Case delivers full IP68 protection — submersible up to 2 metres for 30 minutes — wrapped in a dual-layer polycarbonate and TPU shell that meets military-grade drop standards. Available in five colours with sealed port covers, it keeps your phone safe without sacrificing access to any function. Built for adventures, beaches, kitchens, and every moment in between.',
    shortDescription: 'IP68 waterproof · MIL-STD-810H · 5 colours',
    sku: 'ASL-WPC-MULTI',
    price: 19.99,
    compareAtPrice: 29.99,
    costPrice: 6,
    categoryId: 'cat-accessories',
    category: cat,
    attributes: [],
    variants: [],
    images: [
      { id: 'img-wp-black', url: wp_black, alt: '90percent WaterProof Case Black',  sortOrder: 0 },
      { id: 'img-wp-blue',  url: wp_blue,  alt: '90percent WaterProof Case Blue',   sortOrder: 1 },
      { id: 'img-wp-pink',  url: wp_pink,  alt: '90percent WaterProof Case Pink',   sortOrder: 2 },
      { id: 'img-wp-green', url: wp_green, alt: '90percent WaterProof Case Green',  sortOrder: 3 },
      { id: 'img-wp-white', url: wp_white, alt: '90percent WaterProof Case White',  sortOrder: 4 },
    ],
    specifications: WP_SPECS,
    tags: ['waterproof-case', 'case', 'accessories', 'ip68', 'protective'],
    status: 'active',
    isFeatured: false,
    isDigital: false,
    weight: 85,
    stock: 200,
    lowStockThreshold: 20,
    averageRating: 4.6,
    reviewCount: 138,
    salesCount: 620,
    viewCount: 7400,
    createdAt: '2025-03-01T00:00:00Z',
    updatedAt: '2025-07-01T00:00:00Z',
  },
]
