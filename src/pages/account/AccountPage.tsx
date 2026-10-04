import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Package, MapPin, Heart, Bell, CreditCard, Shield, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAppSelector } from '@/app/hooks'
import { getInitials } from '@/lib/utils'

const MENU_ITEMS = [
  { label: 'My Profile', desc: 'Personal info & preferences', href: '/account/profile', icon: User },
  { label: 'Orders', desc: 'Track & manage orders', href: '/account/orders', icon: Package },
  { label: 'Addresses', desc: 'Saved shipping addresses', href: '/account/addresses', icon: MapPin },
  { label: 'Wishlist', desc: 'Products you love', href: '/account/wishlist', icon: Heart },
  { label: 'Notifications', desc: 'Email, SMS, push settings', href: '/account/notifications', icon: Bell },
  { label: 'Payment Methods', desc: 'Cards & payment options', href: '/account/payment-methods', icon: CreditCard },
  { label: 'Security', desc: 'Password & 2FA settings', href: '/account/security', icon: Shield },
]

export default function AccountPage() {
  const user = useAppSelector((s) => s.auth.user)
  if (!user) return null

  return (
    <div className="container max-w-3xl py-8 animate-fade-in">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center gap-4 rounded-2xl border bg-card p-6"
      >
        {user.avatar ? (
          <img src={user.avatar} alt="" className="size-16 rounded-full object-cover ring-4 ring-primary/20" />
        ) : (
          <div className="flex size-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground ring-4 ring-primary/20">
            {getInitials(user.firstName, user.lastName)}
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold">{user.firstName} {user.lastName}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <div className="mt-1.5 flex items-center gap-2">
            <Badge variant={user.isEmailVerified ? 'success' : 'warning'} className="text-[11px]">
              {user.isEmailVerified ? '✓ Verified' : '⚠ Unverified'}
            </Badge>
            <Badge variant="secondary" className="text-[11px] capitalize">{user.role}</Badge>
          </div>
        </div>
      </motion.div>

      {/* Menu grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {MENU_ITEMS.map(({ label, desc, href, icon: Icon }, i) => (
          <motion.div
            key={href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={href}
              className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="size-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
