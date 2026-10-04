import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { SmoothScrollProvider, useLenis } from '@/components/providers/SmoothScrollProvider'
import SearchModal from '@/features/search/components/SearchModal'
import { Cursor, CurtainTransition, ScrollBar, PageEnter } from '@/components/fx/effects'

function ScrollToTop() {
  const { pathname } = useLocation()
  const { scrollToTop } = useLenis()

  useEffect(() => {
    scrollToTop()
  }, [pathname])

  return null
}

export default function RootLayout() {
  return (
    <SmoothScrollProvider>
      <ScrollToTop />
      <ScrollBar />
      <CurtainTransition />
      <SearchModal />
      <Cursor />
      <div className="flex min-h-screen flex-col bg-[#F7FAF9]">
        <Navbar />
        <main className="flex-1">
          <ErrorBoundary>
            <PageEnter>
              <Outlet />
            </PageEnter>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </SmoothScrollProvider>
  )
}
