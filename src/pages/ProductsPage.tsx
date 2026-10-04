import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, LayoutGrid, List } from 'lucide-react'
import { useState } from 'react'
import ProductGrid from '@/features/products/components/ProductGrid'
import ProductFilters from '@/features/products/components/ProductFilters'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setFilters, resetFilters } from '@/features/search/store/searchSlice'
import { useGetProductsQuery } from '@/data/useMockData'
import Pagination from '@/components/common/Pagination'

export default function ProductsPage() {
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const filters = useAppSelector((s) => s.search.filters)

  useEffect(() => {
    dispatch(resetFilters())
    const patch: Record<string, unknown> = {}
    if (searchParams.get('sort'))     patch.sortBy     = searchParams.get('sort')
    if (searchParams.get('category')) patch.categoryId = searchParams.get('category')
    if (searchParams.get('brand'))    patch.brandId    = searchParams.get('brand')
    if (searchParams.get('q'))        patch.query      = searchParams.get('q')
    if (Object.keys(patch).length > 0) dispatch(setFilters(patch))
  }, [searchParams, dispatch])

  const { data, isLoading, isFetching } = useGetProductsQuery(filters)
  const products = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="container py-8 animate-fade-in">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">All Products</h1>
          {meta && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              Showing {products.length} of {meta.total} results
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 lg:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="size-4" />
            Filters
          </Button>
          <div className="flex rounded-lg border p-0.5">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon-sm"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="size-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon-sm"
              onClick={() => setViewMode('list')}
            >
              <List className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <aside
          className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-60 xl:w-72 shrink-0`}
        >
          <div className="sticky top-20 rounded-xl border bg-card p-4">
            <ProductFilters />
          </div>
        </aside>

        <div className={`flex-1 min-w-0 ${isFetching ? 'opacity-70 transition-opacity' : ''}`}>
          <ProductGrid products={products} isLoading={isLoading} columns={viewMode === 'grid' ? 3 : 2} />
          {meta && meta.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={meta.page}
                totalPages={meta.totalPages}
                onPageChange={(p) => dispatch(setFilters({ page: p }))}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
