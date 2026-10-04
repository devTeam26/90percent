import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, Lock, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { clearCart } from '@/features/cart/store/cartSlice'
import {
  useGetAddressesQuery,
  useAddAddressMutation,
  useGetDeliveryMethodsQuery,
  useCreateOrderMutation,
} from '@/data/useMockUserData'
import { formatPrice } from '@/lib/utils'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { stripePromise } from '@/lib/stripe'
import type { Address, DeliveryMethod } from '@/types'

const STEPS = ['Shipping', 'Delivery', 'Payment', 'Review'] as const
type Step = typeof STEPS[number]

function StepIndicator({ currentStep }: { currentStep: Step }) {
  const currentIdx = STEPS.indexOf(currentStep)
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((step, idx) => (
        <div key={step} className="flex items-center gap-2">
          <div className={`flex size-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all ${
            idx < currentIdx ? 'border-primary bg-primary text-primary-foreground' :
            idx === currentIdx ? 'border-primary text-primary' :
            'border-muted text-muted-foreground'
          }`}>
            {idx < currentIdx ? <Check className="size-4" /> : idx + 1}
          </div>
          <span className={`text-sm font-medium hidden sm:block ${idx === currentIdx ? 'text-foreground' : 'text-muted-foreground'}`}>
            {step}
          </span>
          {idx < STEPS.length - 1 && (
            <div className={`h-px w-8 sm:w-16 transition-all ${idx < currentIdx ? 'bg-primary' : 'bg-border'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

const addressSchema = z.object({
  label: z.string().min(1),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(3),
  country: z.string().min(2),
  phone: z.string().min(7),
})
type AddressFormValues = z.infer<typeof addressSchema>

function ShippingStep({
  onNext,
  selected,
  onSelect,
}: {
  onNext: () => void
  selected: Address | null
  onSelect: (a: Address) => void
}) {
  const { data } = useGetAddressesQuery()
  const addresses = data?.data ?? []
  const [addAddress] = useAddAddressMutation()
  const [showForm, setShowForm] = useState(addresses.length === 0)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: { label: 'Home', country: 'US' },
  })

  const onSave = async (values: AddressFormValues) => {
    await addAddress({ ...values, isDefault: addresses.length === 0 }).unwrap()
    toast.success('Address saved!')
    reset()
    setShowForm(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Shipping Address</h2>
        {addresses.length > 0 && (
          <Button size="sm" variant="outline" onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-1 size-3.5" /> New Address
          </Button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit(onSave)} className="space-y-3 rounded-xl border p-4 bg-muted/30">
              <p className="text-sm font-semibold">Add New Address</p>
              <Input {...register('label')} placeholder="Label (Home, Work…)" error={errors.label?.message} />
              <div className="grid grid-cols-2 gap-3">
                <Input {...register('firstName')} placeholder="First name" error={errors.firstName?.message} />
                <Input {...register('lastName')} placeholder="Last name" error={errors.lastName?.message} />
              </div>
              <Input {...register('addressLine1')} placeholder="Street address" error={errors.addressLine1?.message} />
              <Input {...register('addressLine2')} placeholder="Apt, suite (optional)" />
              <div className="grid grid-cols-3 gap-3">
                <Input {...register('city')} placeholder="City" error={errors.city?.message} />
                <Input {...register('state')} placeholder="State" error={errors.state?.message} />
                <Input {...register('postalCode')} placeholder="ZIP" error={errors.postalCode?.message} />
              </div>
              <Input {...register('phone')} placeholder="Phone" type="tel" error={errors.phone?.message} />
              <div className="flex gap-2">
                <Button type="submit" size="sm">Save Address</Button>
                {addresses.length > 0 && (
                  <Button type="button" size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {addresses.length > 0 && (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <button
              key={addr.id}
              onClick={() => onSelect(addr)}
              className={`w-full text-left rounded-xl border p-4 transition-all ${
                selected?.id === addr.id ? 'border-primary bg-primary/5' : 'hover:border-foreground/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{addr.label}</p>
                  <p className="text-sm text-muted-foreground">{addr.firstName} {addr.lastName}</p>
                  <p className="text-sm text-muted-foreground">
                    {addr.addressLine1}, {addr.city}, {addr.state} {addr.postalCode}
                  </p>
                </div>
                <div className={`size-5 rounded-full border-2 mt-1 transition-all ${
                  selected?.id === addr.id ? 'border-primary bg-primary' : 'border-muted-foreground'
                }`}>
                  {selected?.id === addr.id && <Check className="size-3 text-white m-px" />}
                </div>
              </div>
              {addr.isDefault && <Badge variant="secondary" className="mt-2 text-[11px]">Default</Badge>}
            </button>
          ))}
        </div>
      )}

      <Button className="w-full" size="lg" onClick={onNext} disabled={!selected}>
        Continue to Delivery <ChevronRight className="size-4" />
      </Button>
    </div>
  )
}

function DeliveryStep({
  onNext,
  onBack,
  selected,
  onSelect,
  postalCode,
}: {
  onNext: () => void
  onBack: () => void
  selected: DeliveryMethod | null
  onSelect: (m: DeliveryMethod) => void
  postalCode?: string
}) {
  const { data } = useGetDeliveryMethodsQuery({ postalCode })
  const methods = data?.data ?? []

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Delivery Method</h2>
      <div className="space-y-3">
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => onSelect(method)}
            className={`w-full text-left rounded-xl border p-4 transition-all ${
              selected?.id === method.id ? 'border-primary bg-primary/5' : 'hover:border-foreground/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`size-5 rounded-full border-2 transition-all ${
                  selected?.id === method.id ? 'border-primary bg-primary' : 'border-muted-foreground'
                }`}>
                  {selected?.id === method.id && <Check className="size-3 text-white m-px" />}
                </div>
                <div>
                  <p className="font-semibold">{method.name}</p>
                  <p className="text-sm text-muted-foreground">{method.estimatedDays} · {method.description}</p>
                </div>
              </div>
              <span className="font-bold">
                {method.isFree ? <Badge variant="success">Free</Badge> : formatPrice(method.price)}
              </span>
            </div>
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button className="flex-1" size="lg" onClick={onNext} disabled={!selected}>
          Continue to Payment <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}

function PaymentStep({
  onNext,
  onBack,
  paymentMethod,
  setPaymentMethod,
}: {
  onNext: () => void
  onBack: () => void
  paymentMethod: string
  setPaymentMethod: (m: string) => void
}) {
  const stripe = useStripe()
  const elements = useElements()

  const METHODS = [
    { id: 'stripe', label: 'Credit / Debit Card', icon: '💳' },
    { id: 'paypal', label: 'PayPal', icon: '🅿️' },
    { id: 'wallet', label: 'Wallet Balance', icon: '👛' },
    { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Payment Method</h2>
      <div className="space-y-2">
        {METHODS.map((m) => (
          <button
            key={m.id}
            onClick={() => setPaymentMethod(m.id)}
            className={`w-full flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
              paymentMethod === m.id ? 'border-primary bg-primary/5' : 'hover:border-foreground/30'
            }`}
          >
            <div className={`size-5 rounded-full border-2 transition-all ${
              paymentMethod === m.id ? 'border-primary bg-primary' : 'border-muted-foreground'
            }`}>
              {paymentMethod === m.id && <Check className="size-3 text-white m-px" />}
            </div>
            <span className="text-xl">{m.icon}</span>
            <span className="font-medium">{m.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {paymentMethod === 'stripe' && stripe && elements && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl border p-4 bg-card"
          >
            <p className="text-sm font-medium mb-3">Card Details</p>
            <CardElement
              options={{
                style: {
                  base: { fontSize: '14px', color: 'hsl(var(--foreground))', '::placeholder': { color: 'hsl(var(--muted-foreground))' } },
                },
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Lock className="size-3.5" />
        <span>Your payment info is encrypted and secure</span>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button className="flex-1" size="lg" onClick={onNext} disabled={!paymentMethod}>
          Review Order <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}

function OrderReview({
  address,
  delivery,
  paymentMethod,
  onBack,
  onPlaceOrder,
  isPlacing,
}: {
  address: Address | null
  delivery: DeliveryMethod | null
  paymentMethod: string
  onBack: () => void
  onPlaceOrder: () => void
  isPlacing: boolean
}) {
  const cart = useAppSelector((s) => s.cart.cart)
  const items = cart?.items.filter((i) => !i.savedForLater) ?? []

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Review Your Order</h2>

      <div className="rounded-xl border bg-card p-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 items-center">
            <div className="size-12 shrink-0 rounded-lg overflow-hidden bg-muted">
              {item.product.images[0] && (
                <img src={item.product.images[0].url} alt="" className="size-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.product.name}</p>
              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
            </div>
            <span className="text-sm font-semibold">{formatPrice(item.totalPrice)}</span>
          </div>
        ))}
      </div>

      {[
        { label: 'Ship to', value: address ? `${address.addressLine1}, ${address.city}` : '' },
        { label: 'Delivery', value: delivery?.name ?? '' },
        { label: 'Payment', value: paymentMethod.toUpperCase() },
      ].map(({ label, value }) => (
        <div key={label} className="flex justify-between rounded-xl border bg-card p-3 text-sm">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-medium">{value}</span>
        </div>
      ))}

      {/* Total */}
      <div className="rounded-xl border bg-card p-4 space-y-2">
        {[
          { label: 'Subtotal', value: formatPrice(cart?.subtotal ?? 0) },
          { label: 'Shipping', value: delivery?.isFree ? 'Free' : formatPrice(delivery?.price ?? 0) },
          { label: 'Tax', value: formatPrice(cart?.tax ?? 0) },
          ...(cart?.discount ? [{ label: 'Discount', value: `-${formatPrice(cart.discount)}` }] : []),
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span>{value}</span>
          </div>
        ))}
        <div className="flex justify-between border-t pt-2 font-bold">
          <span>Total</span>
          <span>{formatPrice((cart?.total ?? 0) + (delivery?.isFree ? 0 : delivery?.price ?? 0))}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button className="flex-1 gap-2" size="lg" onClick={onPlaceOrder} loading={isPlacing}>
          <Lock className="size-4" /> Place Order
        </Button>
      </div>
    </div>
  )
}

function CheckoutInner() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('Shipping')
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryMethod | null>(null)
  const [paymentMethod, setPaymentMethod] = useState('stripe')
  const [createOrder, { isLoading }] = useCreateOrderMutation()

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedDelivery) return
    try {
      const result = await createOrder({
        shippingAddressId: selectedAddress.id,
        deliveryMethodId: selectedDelivery.id,
        paymentMethod,
      }).unwrap()
      dispatch(clearCart())
      toast.success('Order placed successfully!')
      navigate(`/checkout/confirmation/${result.data.id}`)
    } catch {
      toast.error('Failed to place order. Please try again.')
    }
  }

  return (
    <div className="container max-w-2xl py-8 animate-fade-in">
      <StepIndicator currentStep={step} />
      <div className="rounded-2xl border bg-card p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === 'Shipping' && (
              <ShippingStep
                onNext={() => setStep('Delivery')}
                selected={selectedAddress}
                onSelect={setSelectedAddress}
              />
            )}
            {step === 'Delivery' && (
              <DeliveryStep
                onNext={() => setStep('Payment')}
                onBack={() => setStep('Shipping')}
                selected={selectedDelivery}
                onSelect={setSelectedDelivery}
                postalCode={selectedAddress?.postalCode}
              />
            )}
            {step === 'Payment' && (
              <PaymentStep
                onNext={() => setStep('Review')}
                onBack={() => setStep('Delivery')}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
            )}
            {step === 'Review' && (
              <OrderReview
                address={selectedAddress}
                delivery={selectedDelivery}
                paymentMethod={paymentMethod}
                onBack={() => setStep('Payment')}
                onPlaceOrder={handlePlaceOrder}
                isPlacing={isLoading}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutInner />
    </Elements>
  )
}
