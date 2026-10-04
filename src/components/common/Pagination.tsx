import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2
  )

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="size-4" />
      </Button>

      {visiblePages.map((page, idx) => {
        const prevPage = visiblePages[idx - 1]
        const showEllipsis = prevPage && page - prevPage > 1
        return (
          <span key={page} className="flex items-center gap-1">
            {showEllipsis && (
              <span className="px-1 text-sm text-muted-foreground">…</span>
            )}
            <Button
              variant={page === currentPage ? 'default' : 'outline'}
              size="icon-sm"
              onClick={() => onPageChange(page)}
              className={cn(page === currentPage && 'pointer-events-none')}
            >
              {page}
            </Button>
          </span>
        )
      })}

      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  )
}
