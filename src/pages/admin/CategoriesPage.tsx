import { useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useGetCategoriesQuery } from '@/data/useMockData'
import { useCreateCategoryMutation, useDeleteCategoryMutation } from '@/features/products/services/categoriesApi'
import { Skeleton } from '@/components/common/Skeleton'

export default function CategoriesPage() {
  const { data, isLoading } = useGetCategoriesQuery()
  const [createCategory] = useCreateCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()
  const [newName, setNewName] = useState('')
  const categories = data?.data ?? []

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold">Categories</h1>
      <Card><CardContent className="p-4 flex gap-2">
        <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Category name" className="max-w-xs" />
        <Button size="sm" onClick={async () => {
          if (!newName.trim()) return
          await createCategory({ name: newName, slug: newName.toLowerCase().replace(/\s+/g, '-'), isActive: true, sortOrder: 0 }).unwrap()
          toast.success('Category created!'); setNewName('')
        }}>
          <Plus className="mr-2 size-4" /> Add
        </Button>
      </CardContent></Card>
      <Card><CardContent className="p-0">
        {isLoading ? <div className="p-4 space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}</div> : (
          <div className="divide-y">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  {cat.image && <img src={cat.image} alt="" className="size-8 rounded-lg object-cover bg-muted" />}
                  <div>
                    <p className="font-medium">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">{cat.productCount ?? 0} products · /{cat.slug}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive" onClick={async () => {
                  if (window.confirm(`Delete "${cat.name}"?`)) { await deleteCategory(cat.id); toast.success('Deleted') }
                }}><Trash2 className="size-4" /></Button>
              </div>
            ))}
            {categories.length === 0 && <div className="py-12 text-center text-muted-foreground">No categories</div>}
          </div>
        )}
      </CardContent></Card>
    </div>
  )
}
