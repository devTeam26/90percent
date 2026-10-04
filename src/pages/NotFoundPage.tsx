import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-8xl font-black text-gradient mb-4">404</div>
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-muted-foreground max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/"><Home className="size-4 mr-2" /> Go Home</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/products"><Search className="size-4 mr-2" /> Browse Products</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
