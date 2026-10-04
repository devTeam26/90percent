import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, ThumbsUp, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/common/Skeleton'
import { useGetProductReviewsQuery, useCreateReviewMutation, useVoteReviewMutation } from '@/features/reviews/services/reviewsApi'
import { useAppSelector } from '@/app/hooks'
import { formatRelativeTime, getInitials } from '@/lib/utils'

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  body: z.string().min(20, 'Review must be at least 20 characters'),
})
type ReviewFormValues = z.infer<typeof reviewSchema>

interface ProductReviewsProps {
  productId: string
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [page, setPage] = useState(1)
  const [ratingFilter, setRatingFilter] = useState<number | undefined>()
  const [showForm, setShowForm] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)
  const { isAuthenticated } = useAppSelector((s) => s.auth)

  const { data, isLoading } = useGetProductReviewsQuery({ productId, page, rating: ratingFilter })
  const [createReview, { isLoading: isSubmitting }] = useCreateReviewMutation()
  const [voteReview] = useVoteReviewMutation()

  const reviews = data?.data ?? []
  const meta = data?.meta

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } =
    useForm<ReviewFormValues>({ resolver: zodResolver(reviewSchema), defaultValues: { rating: 0 } })

  const currentRating = watch('rating')

  const onSubmit = async (values: ReviewFormValues) => {
    try {
      await createReview({ productId, ...values }).unwrap()
      toast.success('Review submitted! It will appear after moderation.')
      reset()
      setShowForm(false)
    } catch {
      toast.error('Failed to submit review')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2 rounded-xl border p-4">
            <div className="flex gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Customer Reviews</h3>
        {isAuthenticated && !showForm && (
          <Button onClick={() => setShowForm(true)} variant="outline" size="sm">
            Write a Review
          </Button>
        )}
      </div>

      {/* Rating filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={ratingFilter === undefined ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => setRatingFilter(undefined)}
        >
          All
        </Button>
        {[5, 4, 3, 2, 1].map((r) => (
          <Button
            key={r}
            variant={ratingFilter === r ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setRatingFilter(ratingFilter === r ? undefined : r)}
          >
            {r} ★
          </Button>
        ))}
      </div>

      {/* Write review form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="rounded-xl border bg-card p-5"
        >
          <h4 className="mb-4 font-semibold">Your Review</h4>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Star rating */}
            <div>
              <label className="mb-2 block text-sm font-medium">Rating</label>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const val = i + 1
                  return (
                    <button
                      key={val}
                      type="button"
                      onMouseEnter={() => setHoverRating(val)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setValue('rating', val)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`size-7 ${
                          val <= (hoverRating || currentRating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                    </button>
                  )
                })}
              </div>
              {errors.rating && <p className="mt-1 text-xs text-destructive">{errors.rating.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Title</label>
              <Input {...register('title')} placeholder="Summarize your experience" error={errors.title?.message} />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Review</label>
              <textarea
                {...register('body')}
                rows={4}
                placeholder="Share your experience with this product…"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
              {errors.body && <p className="mt-1 text-xs text-destructive">{errors.body.message}</p>}
            </div>

            <div className="flex gap-2">
              <Button type="submit" loading={isSubmitting}>Submit Review</Button>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          <Star className="mx-auto size-10 mb-3 opacity-30" />
          <p className="font-medium">No reviews yet</p>
          <p className="text-sm">Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border bg-card p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {review.user.avatar ? (
                      <img src={review.user.avatar} className="size-full rounded-full object-cover" alt="" />
                    ) : (
                      getInitials(review.user.firstName, review.user.lastName)
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">
                        {review.user.firstName} {review.user.lastName}
                      </span>
                      {review.isVerifiedPurchase && (
                        <Badge variant="success" className="text-[10px] px-1.5 py-0 gap-0.5">
                          <CheckCircle className="size-2.5" /> Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`size-3 ${
                              i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="mt-3 font-semibold">{review.title}</h4>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{review.body}</p>

              {review.images && review.images.length > 0 && (
                <div className="mt-3 flex gap-2">
                  {review.images.map((img, i) => (
                    <img key={i} src={img} alt="" className="size-16 rounded-lg object-cover" />
                  ))}
                </div>
              )}

              {review.adminReply && (
                <div className="mt-3 rounded-lg bg-primary/5 border border-primary/20 p-3">
                  <p className="text-xs font-semibold text-primary">Seller Response:</p>
                  <p className="mt-1 text-sm">{review.adminReply}</p>
                </div>
              )}

              <div className="mt-3 flex items-center gap-4">
                <button
                  onClick={() => voteReview({ reviewId: review.id, vote: 'helpful' })}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ThumbsUp className="size-3" /> Helpful ({review.helpfulCount})
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={p === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPage(p)}
            >
              {p}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
