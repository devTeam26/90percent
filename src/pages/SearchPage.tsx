import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import ProductGrid from '@/features/products/components/ProductGrid'
import ProductFilters from '@/features/products/components/ProductFilters'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setFilters, addToHistory } from '@/features/search/store/searchSlice'
import { useGetProductsQuery } from '@/data/useMockData'
import Pagination from '@/components/common/Pagination'

export default function SearchPage() {
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const filters = useAppSelector((s) => s.search.filters)

  useEffect(() => {
    if (q) {
      dispatch(setFilters({ query: q }))
      dispatch(addToHistory(q))
    }
  }, [q, dispatch])

  const { data, isLoading } = useGetProductsQuery({ ...filters, query: q || filters.query })
  const products = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="container py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Search className="size-6 text-muted-foreground" />
          {q ? <>Results for "<span className="text-primary">{q}</span>"</> : 'Search Products'}
        </h1>
        {meta && <p className="mt-1 text-sm text-muted-foreground">{meta.total} results found</p>}
      </div>

      <div className="flex gap-6">
        <aside className="hidden lg:block w-60 xl:w-72 shrink-0">
          <div className="sticky top-20 rounded-xl border bg-card p-4">
            <ProductFilters />
          </div>
        </aside>
        <div className="flex-1 min-w-0">
          <ProductGrid products={products} isLoading={isLoading} columns={3} />
          {meta && meta.totalPages > 1 && (
            <div className="mt-8">
              <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={(p) => dispatch(setFilters({ page: p }))} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
