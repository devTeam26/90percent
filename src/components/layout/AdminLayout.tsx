import { Outlet, Link, useLocation } from 'react-router-dom'
import { Logo, LogoMark } from '@/components/common/Logo'
import { useState } from 'react'
import {
  LayoutDashboard, Package, Tag, ShoppingCart, Users, Star,
  Ticket, BarChart3, Settings, Image, MessageSquare, ChevronLeft,
  Menu, Bell, Search
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/app/hooks'
import { getInitials } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: Tag },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Reviews', href: '/admin/reviews', icon: Star },
  { label: 'Coupons', href: '/admin/coupons', icon: Ticket },
  { label: 'Banners', href: '/admin/banners', icon: Image },
  { label: 'Support', href: '/admin/support', icon: MessageSquare },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileSidebar, setMobileSidebar] = useState(false)
  const location = useLocation()
  const user = useAppSelector((s) => s.auth.user)

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={cn('flex h-16 items-center border-b', collapsed ? 'justify-center px-1' : 'justify-between px-4')}>
        {collapsed ? (
          <Link to="/admin" aria-label="90percent admin">
            <LogoMark size={52} />
          </Link>
        ) : (
          <Link to="/admin" aria-label="90percent admin">
            <Logo size="sm" />
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex"
        >
          <ChevronLeft className={cn('size-4 transition-transform', collapsed && 'rotate-180')} />
        </Button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-2">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = location.pathname === href || (href !== '/admin' && location.pathname.startsWith(href))
          return (
            <Link
              key={href}
              to={href}
              onClick={() => setMobileSidebar(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 mb-0.5',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? label : undefined}
            >
              <Icon className={cn('shrink-0', active ? 'size-5' : 'size-4')} />
              {!collapsed && <span>{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      {user && (
        <div className={cn('border-t p-3', collapsed && 'flex justify-center')}>
          {collapsed ? (
            <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {getInitials(user.firstName, user.lastName)}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {getInitials(user.firstName, user.lastName)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{user.firstName} {user.lastName}</p>
                <Badge variant="secondary" className="text-[10px]">{user.role}</Badge>
              </div>
              <Link to="/" className="ml-auto text-xs text-muted-foreground hover:text-foreground">
                ← Store
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col border-r bg-card transition-all duration-300',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileSidebar && (
        <div
          className="fixed inset-0 z-40 bg-[#1C2B28]/50 lg:hidden"
          onClick={() => setMobileSidebar(false)}
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-60 flex-col border-r bg-card transition-transform duration-300 lg:hidden',
          mobileSidebar ? 'flex translate-x-0' : 'hidden -translate-x-full'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            onClick={() => setMobileSidebar(true)}
          >
            <Menu className="size-5" />
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" size="icon-sm">
            <Search className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" className="relative">
            <Bell className="size-4" />
          </Button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
