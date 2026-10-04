import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetDashboardStatsQuery, useGetSalesMetricsQuery, useGetTopProductsQuery, useGetCustomerMetricsQuery } from '@/features/admin/services/analyticsApi'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { formatPrice } from '@/lib/utils'
import { Skeleton } from '@/components/common/Skeleton'

const COLORS = ['hsl(var(--primary))', 'hsl(217, 91%, 60%)', 'hsl(142, 71%, 45%)', 'hsl(38, 92%, 50%)']

export default function AnalyticsPage() {
  const { data: statsData } = useGetDashboardStatsQuery()
  const { data: salesData, isLoading: salesLoading } = useGetSalesMetricsQuery({ period: 'month' })
  const { data: topData } = useGetTopProductsQuery({ limit: 5 })
  const { data: custData } = useGetCustomerMetricsQuery({ period: 'month' })

  const stats = statsData?.data
  const salesMetrics = salesData?.data ?? []
  const topProducts = topData?.data ?? []

  const pieData = [
    { name: 'New', value: custData?.data?.newCustomers ?? 40 },
    { name: 'Returning', value: custData?.data?.returningCustomers ?? 60 },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Total Revenue', value: stats ? formatPrice(stats.totalRevenue) : '—' },
          { title: 'Total Orders', value: stats?.totalOrders ?? '—' },
          { title: 'Total Customers', value: stats?.totalCustomers ?? '—' },
          { title: 'Conversion Rate', value: stats ? `${stats.conversionRate}%` : '—' },
        ].map(({ title, value }) => (
          <Card key={title}>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="mt-1 text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Revenue (30 Days)</CardTitle></CardHeader>
          <CardContent>
            {salesLoading ? <Skeleton className="h-48" /> : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={salesMetrics}>
                  <defs><linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => [formatPrice(v), 'Revenue']} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#grad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Customer Split</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={12}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Top Products by Revenue</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topProducts} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} />
              <Tooltip formatter={(v: number) => [formatPrice(v), 'Revenue']} />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
