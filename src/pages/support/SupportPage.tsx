import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, Plus, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useGetTicketsQuery, useCreateTicketMutation } from '@/features/support/services/supportApi'
import { formatRelativeTime } from '@/lib/utils'
import { Skeleton } from '@/components/common/Skeleton'

export default function SupportPage() {
  const [showForm, setShowForm] = useState(false)
  const { data, isLoading } = useGetTicketsQuery({})
  const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation()
  const tickets = data?.data ?? []

  return (
    <div className="container max-w-3xl py-8 animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Support</h1>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 size-4" /> New Ticket
        </Button>
      </div>

      {showForm && (
        <Card className="mb-4">
          <CardContent className="pt-4">
            <form className="space-y-3" onSubmit={async (e) => {
              e.preventDefault()
              const fd = new FormData(e.currentTarget)
              await createTicket({ subject: fd.get('subject') as string, description: fd.get('desc') as string, category: fd.get('cat') as string }).unwrap()
              toast.success('Ticket created!')
              setShowForm(false)
            }}>
              <Input name="subject" placeholder="Subject" required />
              <select name="cat" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="order">Order Issue</option>
                <option value="payment">Payment Issue</option>
                <option value="product">Product Issue</option>
                <option value="other">Other</option>
              </select>
              <textarea name="desc" rows={4} placeholder="Describe your issue…" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none" required />
              <div className="flex gap-2">
                <Button type="submit" loading={isCreating}>Submit</Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      ) : tickets.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center text-muted-foreground">
          <MessageSquare className="size-12 mb-3 opacity-30" />
          <p>No support tickets yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <Link key={t.id} to={`/support/tickets/${t.id}`} className="flex items-start gap-3 rounded-xl border bg-card p-4 hover:border-primary/30 hover:shadow-md transition-all">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-sm font-semibold">{t.ticketNumber}</span>
                  <Badge variant="outline">{t.status.replace(/_/g, ' ')}</Badge>
                  <span className="text-xs text-muted-foreground">{formatRelativeTime(t.createdAt)}</span>
                </div>
                <p className="mt-1 font-medium">{t.subject}</p>
              </div>
              <ArrowRight className="size-4 text-muted-foreground mt-1" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
