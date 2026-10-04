import { motion } from 'framer-motion'
import { Bell, Check, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { markAsRead, markAllAsRead, removeNotification } from '@/features/notifications/store/notificationsSlice'
import { formatRelativeTime } from '@/lib/utils'

export default function NotificationsPage() {
  const dispatch = useAppDispatch()
  const { items } = useAppSelector((s) => s.notifications)

  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {items.some((n) => !n.isRead) && (
          <Button variant="ghost" size="sm" onClick={() => dispatch(markAllAsRead())}>
            <Check className="mr-2 size-4" /> Mark all read
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center text-muted-foreground">
          <Bell className="size-12 mb-3 opacity-30" />
          <p>No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex gap-3 rounded-xl border p-4 transition-all ${!n.isRead ? 'bg-primary/5 border-primary/20' : 'bg-card'}`}
            >
              <div className={`mt-1 size-2 shrink-0 rounded-full ${!n.isRead ? 'bg-primary' : 'bg-transparent'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(n.createdAt)}</p>
              </div>
              <div className="flex gap-1">
                {!n.isRead && (
                  <Button variant="ghost" size="icon-sm" onClick={() => dispatch(markAsRead(n.id))}>
                    <Check className="size-3.5" />
                  </Button>
                )}
                <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive" onClick={() => dispatch(removeNotification(n.id))}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
