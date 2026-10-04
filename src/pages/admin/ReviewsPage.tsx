import { useState } from 'react'
import { Star, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useAdminGetReviewsQuery, useAdminUpdateReviewMutation, useDeleteReviewMutation } from '@/features/reviews/services/reviewsApi'
import { Skeleton } from '@/components/common/Skeleton'
import Pagination from '@/components/common/Pagination'
import { formatRelativeTime } from '@/lib/utils'
import { toast } from 'sonner'

export default function ReviewsPage() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const { data, isLoading } = useAdminGetReviewsQuery({ page, status: status || undefined })
  const [updateReview] = useAdminUpdateReviewMutation()
  const [deleteReview] = useDeleteReviewMutation()
  const reviews = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold">Reviews</h1>
      <div className="flex gap-2">
        {['', 'pending', 'approved', 'rejected'].map((s) => (
          <Button key={s} variant={status === s ? 'default' : 'outline'} size="sm" onClick={() => { setStatus(s); setPage(1) }}>
            {s || 'All'}
          </Button>
        ))}
      </div>
      <Card><CardContent className="p-0">
        {isLoading ? (
          <div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}</div>
        ) : (
          <div className="divide-y">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 flex gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{review.user.firstName} {review.user.lastName}</span>
                    <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`size-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />)}</div>
                    <Badge variant={review.status === 'approved' ? 'success' : review.status === 'rejected' ? 'destructive' : 'warning'}>{review.status}</Badge>
                    <span className="text-xs text-muted-foreground">{formatRelativeTime(review.createdAt)}</span>
                  </div>
                  <p className="mt-1 font-semibold text-sm">{review.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{review.body}</p>
                </div>
                {review.status === 'pending' && (
                  <div className="flex flex-col gap-1 shrink-0">
                    <Button size="sm" variant="outline" className="text-emerald-600 gap-1" onClick={async () => { await updateReview({ id: review.id, status: 'approved' }).unwrap(); toast.success('Review approved') }}>
                      <CheckCircle className="size-3.5" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive gap-1" onClick={async () => { await updateReview({ id: review.id, status: 'rejected' }).unwrap(); toast.success('Review rejected') }}>
                      <XCircle className="size-3.5" /> Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
            {reviews.length === 0 && <div className="py-12 text-center text-muted-foreground">No reviews found</div>}
          </div>
        )}
      </CardContent></Card>
      {meta && meta.totalPages > 1 && <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />}
    </div>
  )
}
