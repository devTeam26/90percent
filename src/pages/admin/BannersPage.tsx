import { Image } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function BannersPage() {
  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold">Banners & Homepage Sections</h1>
      <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
        <Image className="size-12 opacity-30 mb-3" />
        <p className="font-medium">Banner management coming soon</p>
        <p className="text-sm">You will be able to manage hero banners, promotional blocks, and homepage sections here.</p>
      </CardContent></Card>
    </div>
  )
}
