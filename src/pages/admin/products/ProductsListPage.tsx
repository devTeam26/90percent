import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Search, Edit, Trash2, Eye, Archive } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useGetProductsQuery } from '@/data/useMockData'
import { useDeleteProductMutation } from '@/features/products/services/productsApi'
import { formatPrice } from '@/lib/utils'
import { Skeleton } from '@/components/common/Skeleton'
import Pagination from '@/components/common/Pagination'
import type { ProductStatus } from '@/types'

const STATUS_BADGE: Record<ProductStatus, string> = {
  active: 'success',
  draft: 'secondary',
  archived: 'outline',
}

export default function ProductsListPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useGetProductsQuery({ page, limit: 20, query: search })
  const [deleteProduct] = useDeleteProductMutation()
  const products = data?.data ?? []
  const meta = data?.meta

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await deleteProduct(id).unwrap()
      toast.success('Product deleted')
    } catch {
      toast.error('Failed to delete product')
    }
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button asChild>
          <Link to="/admin/products/new">
            <Plus className="mr-2 size-4" /> Add Product
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <Input
            placeholder="Search products…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            startIcon={<Search className="size-4" />}
            className="max-w-sm"
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {product.images[0] && (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="size-10 rounded-lg object-cover bg-muted"
                            />
                          )}
                          <div>
                            <p className="text-sm font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">{product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{product.category?.name}</td>
                      <td className="p-4">
                        <div className="text-sm font-semibold">{formatPrice(product.price)}</div>
                        {product.compareAtPrice && (
                          <div className="text-xs text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`text-sm font-medium ${product.stock === 0 ? 'text-destructive' : product.stock <= product.lowStockThreshold ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge variant={(STATUS_BADGE[product.status] as 'success' | 'secondary' | 'outline') || 'secondary'}>
                          {product.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon-sm" asChild>
                            <Link to={`/products/${product.slug}`} target="_blank">
                              <Eye className="size-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon-sm" asChild>
                            <Link to={`/admin/products/${product.id}/edit`}>
                              <Edit className="size-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(product.id, product.name)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  No products found
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {meta && meta.totalPages > 1 && (
        <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />
      )}
    </div>
  )
}
