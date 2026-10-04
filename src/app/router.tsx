import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import RootLayout from '@/components/layout/RootLayout'
import PageLoader from '@/components/common/PageLoader'

function Lazy(factory: () => Promise<{ default: React.ComponentType }>) {
  const Component = lazy(factory)
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true,                   element: Lazy(() => import('@/pages/HomePage')) },
      { path: 'products/:slug',        element: Lazy(() => import('@/pages/ProductDetailPage')) },
      { path: 'categories/:slug',        element: Lazy(() => import('@/pages/CategoryPage')) },
      { path: 'about',                 element: Lazy(() => import('@/pages/static/AboutPage')) },
      { path: 'contact',               element: Lazy(() => import('@/pages/static/ContactPage')) },
      { path: 'privacy',               element: Lazy(() => import('@/pages/static/PrivacyPage')) },
      { path: 'terms',                 element: Lazy(() => import('@/pages/static/TermsPage')) },
      { path: 'faq',                   element: Lazy(() => import('@/pages/static/FaqPage')) },
      { path: 'track-order',           element: Lazy(() => import('@/pages/TrackOrderPage')) },
      { path: 'track/:orderNumber',    element: Lazy(() => import('@/pages/TrackOrderPage')) },
      { path: 'support',               element: Lazy(() => import('@/pages/static/ContactPage')) },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
