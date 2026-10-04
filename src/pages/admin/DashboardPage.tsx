import { motion } from 'framer-motion'
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart,
  Users, Package, ArrowRight, Activity
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from 'recharts'
import { useGetDashboardStatsQuery, useGetSalesMetricsQuery, useGetTopProductsQuery } from '@/features/admin/services/analyticsApi'
import { formatPrice } from '@/lib/utils'
import { Skeleton } from '@/components/common/Skeleton'

const MOCK_SALES = [
  { date: 'Mon', revenue: 4200, orders: 32 },
  { date: 'Tue', revenue: 3800, orders: 28 },
  { date: 'Wed', revenue: 5100, orders: 41 },
  { date: 'Thu', revenue: 4700, orders: 36 },
  { date: 'Fri', revenue: 6200, orders: 52 },
  { date: 'Sat', revenue: 7400, orders: 63 },
  { date: 'Sun', revenue: 5900, orders: 47 },
]

function StatCard({
  title,
  value,
  growth,
  icon: Icon,
  color,
  prefix = '',
}: {
  title: string
  value: string | number
  growth: number
  icon: React.ElementType
  color: string
  prefix?: string
}) {
  const isPositive = growth >= 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="mt-1 text-2xl font-bold">
                {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
              </p>
              <div className={`mt-1.5 flex items-center gap-1 text-xs ${isPositive ? 'text-emerald-600' : 'text-destructive'}`}>
                {isPositive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                <span>{Math.abs(growth)}% vs last period</span>
              </div>
            </div>
            <div className={`flex size-12 items-center justify-center rounded-2xl ${color}`}>
              <Icon className="size-6 text-white" />
            </div>
          </div>
        </CardContent>
        <div className={`absolute bottom-0 left-0 h-0.5 w-full ${color.replace('bg-', 'bg-')}`} />
      </Card>
    </motion.div>
  )
}

export default function DashboardPage() {
  const { data: statsData, isLoading: statsLoading } = useGetDashboardStatsQuery()
  const { data: topProductsData } = useGetTopProductsQuery({ limit: 5 })
  const stats = statsData?.data
  const topProducts = topProductsData?.data ?? []

  const STAT_CARDS = [
    {
      title: 'Total Revenue',
      value: stats ? formatPrice(stats.totalRevenue) : '—',
      growth: stats?.revenueGrowth ?? 0,
      icon: DollarSign,
      color: 'bg-violet-500',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders ?? 0,
      growth: stats?.orderGrowth ?? 0,
      icon: ShoppingCart,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers ?? 0,
      growth: stats?.customerGrowth ?? 0,
      icon: Users,
      color: 'bg-emerald-500',
    },
    {
      title: 'Conversion Rate',
      value: `${stats?.conversionRate ?? 0}%`,
      growth: 0.5,
      icon: Activity,
      color: 'bg-amber-500',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>
        <Button variant="outline" size="sm">
          <Activity className="mr-2 size-4" /> View Reports
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
          : STAT_CARDS.map((s) => <StatCard key={s.title} {...s} />)
        }
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Revenue Overview</CardTitle>
            <div className="flex gap-1">
              {['7D', '30D', '90D'].map((p) => (
                <Button key={p} variant="ghost" size="sm" className="h-7 px-2 text-xs">
                  {p}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={MOCK_SALES}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(v: number) => [formatPrice(v), 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Orders per Day</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={MOCK_SALES}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top products + recent orders */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Top Products</CardTitle>
            <Button variant="ghost" size="sm" className="gap-1 text-xs" asChild>
              <Link to="/admin/products">View all <ArrowRight className="size-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {topProducts.length === 0 ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-lg" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-2 w-1/2" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              topProducts.map((p, i) => (
                <div key={p.productId} className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.sales} sales</p>
                  </div>
                  <span className="text-sm font-semibold">{formatPrice(p.revenue)}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Add Product', href: '/admin/products/new', icon: Package, color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
                { label: 'View Orders', href: '/admin/orders', icon: ShoppingCart, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
                { label: 'Manage Users', href: '/admin/users', icon: Users, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
                { label: 'Analytics', href: '/admin/analytics', icon: Activity, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
              ].map(({ label, href, icon: Icon, color }) => (
                <Link
                  key={href}
                  to={href}
                  className={`flex flex-col items-center gap-2 rounded-xl p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-sm ${color}`}
                >
                  <Icon className="size-6" />
                  <span className="text-xs font-semibold">{label}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
