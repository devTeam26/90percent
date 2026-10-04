import { useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { router } from '@/app/router'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import LoadingScreen from '@/components/common/LoadingScreen'
import { AnimatePresence, motion } from 'framer-motion'

export default function App() {
  const [loaded, setLoaded] = useState(false)

  return (
    <ThemeProvider>
      <AnimatePresence>
        {!loaded && (
          <motion.div
            key="loading"
            exit={{ y: '-100%' }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[9999]"
          >
            <LoadingScreen onComplete={() => setLoaded(true)} />
          </motion.div>
        )}
      </AnimatePresence>
      {loaded && (
        <>
          <RouterProvider router={router} />
          <Toaster
            position="top-right"
            richColors
            expand
            closeButton
            toastOptions={{ duration: 4000, classNames: { toast: 'font-sans' } }}
          />
        </>
      )}
    </ThemeProvider>
  )
}
