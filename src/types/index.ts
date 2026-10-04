// ─── Common ────────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message?: string
}

export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
  statusCode: number
}

// ─── Auth ──────────────────────────────────────────────────────────────────────

export type Role = 'customer' | 'admin' | 'vendor' | 'support'

export interface Permission {
  id: string
  name: string
  resource: string
  action: 'create' | 'read' | 'update' | 'delete' | 'manage'
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  phone?: string
  role: Role
  permissions: Permission[]
  isEmailVerified: boolean
  isTwoFactorEnabled: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface LoginPayload {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

// ─── Address ───────────────────────────────────────────────────────────────────

export interface Address {
  id: string
  userId: string
  label: string
  firstName: string
  lastName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
  isDefault: boolean
  createdAt: string
}

// ─── Category ──────────────────────────────────────────────────────────────────

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  parent?: Category
  children?: Category[]
  productCount?: number
  isActive: boolean
  sortOrder: number
  createdAt: string
}

// ─── Brand ─────────────────────────────────────────────────────────────────────

export interface Brand {
  id: string
  name: string
  slug: string
  logo?: string
  description?: string
  website?: string
  isActive: boolean
  productCount?: number
  createdAt: string
}

// ─── Product ───────────────────────────────────────────────────────────────────

export type ProductStatus = 'active' | 'draft' | 'archived'

export interface ProductAttribute {
  id: string
  name: string
  values: string[]
}

export interface ProductVariant {
  id: string
  productId: string
  sku: string
  attributes: Record<string, string>
  price: number
  compareAtPrice?: number
  costPrice?: number
  stock: number
  lowStockThreshold: number
  weight?: number
  images: string[]
  isActive: boolean
}

export interface ProductImage {
  id: string
  url: string
  alt?: string
  sortOrder: number
}

export interface ProductSpecification {
  label: string
  value: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  sku: string
  price: number
  compareAtPrice?: number
  costPrice?: number
  categoryId: string
  category: Category
  brandId?: string
  brand?: Brand
  variants: ProductVariant[]
  attributes: ProductAttribute[]
  images: ProductImage[]
  videos?: string[]
  specifications: ProductSpecification[]
  tags: string[]
  status: ProductStatus
  isFeatured: boolean
  isDigital: boolean
  weight?: number
  dimensions?: { length: number; width: number; height: number }
  stock: number
  lowStockThreshold: number
  averageRating: number
  reviewCount: number
  salesCount: number
  viewCount: number
  metaTitle?: string
  metaDescription?: string
  createdAt: string
  updatedAt: string
}

// ─── Cart ──────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string
  productId: string
  product: Product
  variantId?: string
  variant?: ProductVariant
  quantity: number
  price: number
  totalPrice: number
  savedForLater?: boolean
}

export interface Cart {
  id: string
  userId?: string
  sessionId?: string
  items: CartItem[]
  subtotal: number
  discount: number
  tax: number
  shipping: number
  total: number
  couponCode?: string
  coupon?: Coupon
  createdAt: string
  updatedAt: string
}

// ─── Order ─────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'return_requested'
  | 'returned'
  | 'refunded'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'

export interface OrderItem {
  id: string
  productId: string
  product: Product
  variantId?: string
  variant?: ProductVariant
  quantity: number
  unitPrice: number
  totalPrice: number
  discount: number
}

export interface ShipmentTracking {
  carrier: string
  trackingNumber: string
  trackingUrl?: string
  estimatedDelivery?: string
  events: {
    status: string
    location: string
    timestamp: string
    description: string
  }[]
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  user?: User
  items: OrderItem[]
  shippingAddress: Address
  billingAddress?: Address
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: string
  subtotal: number
  discount: number
  tax: number
  shipping: number
  total: number
  couponCode?: string
  notes?: string
  shipment?: ShipmentTracking
  createdAt: string
  updatedAt: string
}

// ─── Payment ───────────────────────────────────────────────────────────────────

export type PaymentMethod = 'stripe' | 'paypal' | 'wallet' | 'cod'

export interface PaymentIntent {
  id: string
  clientSecret: string
  amount: number
  currency: string
  status: string
}

// ─── Review ────────────────────────────────────────────────────────────────────

export type ReviewStatus = 'pending' | 'approved' | 'rejected'

export interface Review {
  id: string
  productId: string
  userId: string
  user: User
  rating: number
  title: string
  body: string
  images?: string[]
  isVerifiedPurchase: boolean
  helpfulCount: number
  userVote?: 'helpful' | 'not_helpful'
  status: ReviewStatus
  adminReply?: string
  createdAt: string
}

// ─── Wishlist ──────────────────────────────────────────────────────────────────

export interface WishlistItem {
  id: string
  productId: string
  product: Product
  addedAt: string
}

export interface Wishlist {
  id: string
  userId: string
  name: string
  isPublic: boolean
  items: WishlistItem[]
  shareToken?: string
}

// ─── Coupon ────────────────────────────────────────────────────────────────────

export type CouponType = 'percentage' | 'fixed' | 'free_shipping' | 'buy_x_get_y'

export interface Coupon {
  id: string
  code: string
  type: CouponType
  value: number
  minOrderAmount?: number
  maxDiscountAmount?: number
  usageLimit?: number
  usageCount: number
  userUsageLimit?: number
  applicableProducts?: string[]
  applicableCategories?: string[]
  isActive: boolean
  startsAt?: string
  expiresAt?: string
  createdAt: string
}

// ─── Notification ──────────────────────────────────────────────────────────────

export type NotificationType =
  | 'order_confirmed'
  | 'order_shipped'
  | 'order_delivered'
  | 'order_cancelled'
  | 'payment_received'
  | 'review_posted'
  | 'price_drop'
  | 'back_in_stock'
  | 'promotion'
  | 'system'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, unknown>
  isRead: boolean
  createdAt: string
}

// ─── Support ───────────────────────────────────────────────────────────────────

export type TicketStatus = 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface SupportTicket {
  id: string
  ticketNumber: string
  userId: string
  user?: User
  subject: string
  description: string
  category: string
  status: TicketStatus
  priority: TicketPriority
  assignedTo?: string
  messages: TicketMessage[]
  attachments?: string[]
  orderId?: string
  createdAt: string
  updatedAt: string
}

export interface TicketMessage {
  id: string
  ticketId: string
  senderId: string
  sender: User
  message: string
  isInternal: boolean
  attachments?: string[]
  createdAt: string
}

// ─── Banner / CMS ──────────────────────────────────────────────────────────────

export interface Banner {
  id: string
  title: string
  subtitle?: string
  image: string
  mobileImage?: string
  link?: string
  position: 'hero' | 'promo' | 'sidebar'
  isActive: boolean
  startsAt?: string
  endsAt?: string
  sortOrder: number
}

// ─── Analytics ─────────────────────────────────────────────────────────────────

export interface SalesMetric {
  date: string
  revenue: number
  orders: number
  averageOrderValue: number
}

export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  revenueGrowth: number
  orderGrowth: number
  customerGrowth: number
  conversionRate: number
}

// ─── Search ────────────────────────────────────────────────────────────────────

export interface SearchFilters {
  query?: string
  categoryId?: string
  brandId?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  inStock?: boolean
  attributes?: Record<string, string[]>
  tags?: string[]
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'bestselling'
  page?: number
  limit?: number
}

export interface SearchSuggestion {
  type: 'product' | 'category' | 'brand' | 'query'
  id?: string
  text: string
  image?: string
  slug?: string
}

// ─── Delivery ──────────────────────────────────────────────────────────────────

export interface DeliveryMethod {
  id: string
  name: string
  description: string
  estimatedDays: string
  price: number
  isFree: boolean
  freeThreshold?: number
  carrier?: string
  logo?: string
}
