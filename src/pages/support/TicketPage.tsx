import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Send } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useGetTicketQuery, useReplyToTicketMutation, useCloseTicketMutation } from '@/features/support/services/supportApi'
import { formatDate, getInitials } from '@/lib/utils'
import { Skeleton } from '@/components/common/Skeleton'

export default function TicketPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useGetTicketQuery(id!)
  const [reply, { isLoading: isReplying }] = useReplyToTicketMutation()
  const [closeTicket] = useCloseTicketMutation()
  const [message, setMessage] = useState('')
  const ticket = data?.data

  if (isLoading) return <div className="container py-8"><Skeleton className="h-96 rounded-xl" /></div>
  if (!ticket) return <div className="container py-8 text-center">Ticket not found</div>

  return (
    <div className="container max-w-2xl py-8 space-y-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" asChild><Link to="/support"><ArrowLeft className="size-4" /></Link></Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold">{ticket.subject}</h1>
            <Badge variant="outline">{ticket.status.replace(/_/g, ' ')}</Badge>
          </div>
          <p className="text-sm text-muted-foreground font-mono">{ticket.ticketNumber}</p>
        </div>
      </div>

      <div className="space-y-3">
        {ticket.messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.sender.role !== 'customer' ? 'flex-row-reverse' : ''}`}>
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {getInitials(msg.sender.firstName, msg.sender.lastName)}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${msg.sender.role !== 'customer' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted rounded-tl-sm'}`}>
              <p>{msg.message}</p>
              <p className={`mt-1 text-[11px] opacity-70`}>{formatDate(msg.createdAt, { dateStyle: 'medium', timeStyle: 'short' })}</p>
            </div>
          </div>
        ))}
      </div>

      {ticket.status !== 'closed' && (
        <div className="flex gap-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your reply…"
            rows={3}
            className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <div className="flex flex-col gap-2">
            <Button size="icon" loading={isReplying} disabled={!message.trim()} onClick={async () => {
              await reply({ id: ticket.id, message }).unwrap()
              toast.success('Reply sent')
              setMessage('')
            }}>
              <Send className="size-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={async () => {
              await closeTicket(ticket.id).unwrap()
              toast.success('Ticket closed')
            }}>Close</Button>
          </div>
        </div>
      )}
    </div>
  )
}
