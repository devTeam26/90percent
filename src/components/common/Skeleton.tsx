import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-3">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-5 w-1/3" />
      </div>
    </div>
  )
}

export function OrderCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-3 w-48" />
      <div className="flex gap-2">
        <Skeleton className="size-14 rounded-lg" />
        <Skeleton className="size-14 rounded-lg" />
      </div>
    </div>
  )
}
