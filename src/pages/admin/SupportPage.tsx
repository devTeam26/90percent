import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAdminGetTicketsQuery, useAssignTicketMutation } from '@/features/support/services/supportApi'
import { formatRelativeTime } from '@/lib/utils'
import { Skeleton } from '@/components/common/Skeleton'
import Pagination from '@/components/common/Pagination'
import type { TicketStatus, TicketPriority } from '@/types'

const PRIORITY_COLORS: Record<TicketPriority, string> = { low: 'secondary', medium: 'info', high: 'warning', urgent: 'destructive' }

export default function AdminSupportPage() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const { data, isLoading } = useAdminGetTicketsQuery({ page, status: status || undefined })
  const tickets = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold">Support Tickets</h1>
      <div className="flex gap-2 flex-wrap">
        {['', 'open', 'in_progress', 'waiting_customer', 'resolved', 'closed'].map((s) => (
          <Button key={s} variant={status === s ? 'default' : 'outline'} size="sm" onClick={() => { setStatus(s); setPage(1) }}>
            {s ? s.replace(/_/g, ' ') : 'All'}
          </Button>
        ))}
      </div>
      <Card><CardContent className="p-0">
        {isLoading ? <div className="p-4 space-y-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}</div> : (
          <div className="divide-y">
            {tickets.map((t) => (
              <div key={t.id} className="p-4 flex gap-4 items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-semibold">{t.ticketNumber}</span>
                    <Badge variant={(PRIORITY_COLORS[t.priority] || 'secondary') as 'secondary' | 'info' | 'warning' | 'destructive'}>{t.priority}</Badge>
                    <Badge variant="outline">{t.status.replace(/_/g, ' ')}</Badge>
                    <span className="text-xs text-muted-foreground">{formatRelativeTime(t.createdAt)}</span>
                  </div>
                  <p className="mt-1 font-medium truncate">{t.subject}</p>
                  {t.user && <p className="text-xs text-muted-foreground">{t.user.firstName} {t.user.lastName} · {t.user.email}</p>}
                </div>
              </div>
            ))}
            {tickets.length === 0 && <div className="py-12 text-center text-muted-foreground">No tickets found</div>}
          </div>
        )}
      </CardContent></Card>
      {meta && meta.totalPages > 1 && <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />}
    </div>
  )
}
