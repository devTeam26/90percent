/**
 * Mock user-data hooks — same shape as RTK Query so pages need
 * only a one-line import swap when the real API is ready.
 */
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '@/features/users/store/addressesSlice'
import { placeOrder } from '@/features/orders/store/ordersSlice'
import type { Address, DeliveryMethod, Order, CartItem } from '@/types'

interface UnwrappablePromise<T> extends Promise<T> {
  unwrap: () => Promise<T>
}

function withUnwrap<T>(p: Promise<T>): UnwrappablePromise<T> {
  const enhanced = p as UnwrappablePromise<T>
  enhanced.unwrap = () => p
  return enhanced
}

type MockMutation<TArg, TResult = void> = [
  (arg: TArg) => UnwrappablePromise<TResult>,
  { isLoading: boolean }
]

// ─── Delivery Methods (static mock) ─────────────────────────────────────────

const MOCK_DELIVERY_METHODS: DeliveryMethod[] = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: 'Delivered in 5–7 business days',
    estimatedDays: '5–7 business days',
    price: 0,
    isFree: true,
  },
  {
    id: 'express',
    name: 'Express Shipping',
    description: 'Delivered in 2–3 business days',
    estimatedDays: '2–3 business days',
    price: 9.99,
    isFree: false,
    carrier: 'FedEx',
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    description: 'Next business day delivery',
    estimatedDays: '1 business day',
    price: 24.99,
    isFree: false,
    carrier: 'UPS',
  },
]

export function useGetDeliveryMethodsQuery(_args?: { postalCode?: string }) {
  return { data: { data: MOCK_DELIVERY_METHODS }, isLoading: false }
}

// ─── Addresses ───────────────────────────────────────────────────────────────

export function useGetAddressesQuery() {
  const items = useAppSelector((s) => s.addresses.items)
  return { data: { data: items }, isLoading: false }
}

export function useAddAddressMutation(): MockMutation<Omit<Address, 'id' | 'userId' | 'createdAt'>> {
  const dispatch = useAppDispatch()
  const fn = (body: Omit<Address, 'id' | 'userId' | 'createdAt'>) =>
    withUnwrap(Promise.resolve(dispatch(addAddress(body))).then(() => undefined))
  return [fn, { isLoading: false }]
}

export function useUpdateAddressMutation(): MockMutation<{ id: string; body: Partial<Address> }> {
  const dispatch = useAppDispatch()
  const fn = (arg: { id: string; body: Partial<Address> }) =>
    withUnwrap(Promise.resolve(dispatch(updateAddress(arg))).then(() => undefined))
  return [fn, { isLoading: false }]
}

export function useDeleteAddressMutation(): MockMutation<string> {
  const dispatch = useAppDispatch()
  const fn = (id: string) =>
    withUnwrap(Promise.resolve(dispatch(deleteAddress(id))).then(() => undefined))
  return [fn, { isLoading: false }]
}

export function useSetDefaultAddressMutation(): MockMutation<string> {
  const dispatch = useAppDispatch()
  const fn = (id: string) =>
    withUnwrap(Promise.resolve(dispatch(setDefaultAddress(id))).then(() => undefined))
  return [fn, { isLoading: false }]
}

// ─── Orders ──────────────────────────────────────────────────────────────────

interface CreateOrderArg {
  shippingAddressId: string
  deliveryMethodId: string
  paymentMethod: string
}

export function useCreateOrderMutation(): MockMutation<CreateOrderArg, { data: Order }> {
  const dispatch = useAppDispatch()
  const cart = useAppSelector((s) => s.cart.cart)
  const addresses = useAppSelector((s) => s.addresses.items)
  const user = useAppSelector((s) => s.auth.user)

  const fn = (arg: CreateOrderArg) => {
    const address = addresses.find((a) => a.id === arg.shippingAddressId)!
    const delivery = MOCK_DELIVERY_METHODS.find((m) => m.id === arg.deliveryMethodId)!
    const shippingCost = delivery.isFree ? 0 : delivery.price
    const items = (cart?.items ?? []).filter((i: CartItem) => !i.savedForLater)

    const order: Order = {
      id: `order_${Date.now()}`,
      orderNumber: `LZ-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: user?.id ?? 'guest',
      items: items.map((i: CartItem) => ({
        id: `oi_${i.id}`,
        productId: i.productId,
        product: i.product,
        variantId: i.variantId,
        variant: i.variant,
        quantity: i.quantity,
        unitPrice: i.price,
        totalPrice: i.totalPrice,
        discount: 0,
      })),
      shippingAddress: address,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: arg.paymentMethod,
      subtotal: cart?.subtotal ?? 0,
      discount: cart?.discount ?? 0,
      tax: cart?.tax ?? 0,
      shipping: shippingCost,
      total: (cart?.subtotal ?? 0) - (cart?.discount ?? 0) + (cart?.tax ?? 0) + shippingCost,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    dispatch(placeOrder(order))
    return withUnwrap(Promise.resolve({ data: order }))
  }

  return [fn, { isLoading: false }]
}

export function useGetOrderQuery(orderId: string) {
  const order = useAppSelector((s) =>
    s.orders.items.find((o) => o.id === orderId)
  )
  return { data: order ? { data: order } : undefined, isLoading: false }
}

export function useGetOrdersQuery() {
  const items = useAppSelector((s) => s.orders.items)
  return { data: { data: items }, isLoading: false }
}
