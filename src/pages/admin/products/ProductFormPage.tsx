import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Save, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetProductQuery, useGetCategoriesQuery } from '@/data/useMockData'
import { useCreateProductMutation, useUpdateProductMutation } from '@/features/products/services/productsApi'

const schema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  sku: z.string().min(2),
  price: z.coerce.number().positive(),
  compareAtPrice: z.coerce.number().optional(),
  stock: z.coerce.number().int().min(0),
  lowStockThreshold: z.coerce.number().int().min(0).default(5),
  categoryId: z.string().min(1),
  status: z.enum(['active', 'draft', 'archived']).default('draft'),
  tags: z.string().optional(),
})
type FormValues = z.infer<typeof schema>

export default function ProductFormPage() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const { data: existingData } = useGetProductQuery(id!, { skip: !id })
  const existing = existingData?.data
  const { data: catData } = useGetCategoriesQuery()
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation()
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation()
  const isLoading = isCreating || isUpdating

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: existing ? {
      name: existing.name,
      description: existing.description,
      sku: existing.sku,
      price: existing.price,
      compareAtPrice: existing.compareAtPrice,
      stock: existing.stock,
      lowStockThreshold: existing.lowStockThreshold,
      categoryId: existing.categoryId,
      status: existing.status,
      tags: existing.tags.join(', '),
    } : { status: 'draft', lowStockThreshold: 5 },
  })

  const onSubmit = async (values: FormValues) => {
    const payload = {
      ...values,
      tags: values.tags?.split(',').map((t) => t.trim()).filter(Boolean) ?? [],
    }
    try {
      if (isEdit && id) {
        await updateProduct({ id, body: payload }).unwrap()
        toast.success('Product updated!')
      } else {
        await createProduct(payload).unwrap()
        toast.success('Product created!')
        navigate('/admin/products')
      }
    } catch { toast.error('Failed to save product') }
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" asChild><Link to="/admin/products"><ArrowLeft className="size-4" /></Link></Button>
          <h1 className="text-xl font-bold">{isEdit ? 'Edit Product' : 'New Product'}</h1>
        </div>
        <Button form="product-form" type="submit" loading={isLoading}>
          <Save className="mr-2 size-4" /> {isEdit ? 'Save Changes' : 'Create Product'}
        </Button>
      </div>

      <form id="product-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Basic Info</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Product Name</label>
                  <Input {...register('name')} error={errors.name?.message} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Description</label>
                  <textarea
                    {...register('description')}
                    rows={5}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">SKU</label>
                    <Input {...register('sku')} error={errors.sku?.message} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Tags (comma-separated)</label>
                    <Input {...register('tags')} placeholder="tag1, tag2, tag3" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Pricing & Inventory</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Price ($)</label>
                    <Input {...register('price')} type="number" step="0.01" error={errors.price?.message} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Compare at Price ($)</label>
                    <Input {...register('compareAtPrice')} type="number" step="0.01" placeholder="Original price" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Stock Quantity</label>
                    <Input {...register('stock')} type="number" error={errors.stock?.message} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Low Stock Threshold</label>
                    <Input {...register('lowStockThreshold')} type="number" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Organization</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Status</label>
                  <select {...register('status')} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Category</label>
                  <select {...register('categoryId')} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Select category</option>
                    {catData?.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
