import { Outlet, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogoWhite, Logo } from '@/components/common/Logo'

const FEATURES = [
  { icon: '🚀', text: 'Free shipping on orders over $50' },
  { icon: '🔒', text: 'Secure & encrypted payments'      },
  { icon: '↩️', text: '30-day hassle-free returns'       },
  { icon: '⭐', text: 'Over 1M+ satisfied customers'     },
]

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8"
      style={{ background: 'linear-gradient(135deg, #1C2B28 0%, #0e1f1d 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex min-h-[640px]"
        style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}
      >

        {/* ── Left — dark navy brand panel ── */}
        <div
          className="hidden md:flex md:w-5/12 relative overflow-hidden flex-col justify-between p-10 text-white"
          style={{ background: 'linear-gradient(160deg, #1C2B28 0%, #152521 60%, #0e1f1d 100%)' }}
        >
          {/* Decorative orange glow blobs */}
          <div className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(139,173,164,0.25) 0%, transparent 70%)' }} />
          <div className="pointer-events-none absolute bottom-0 right-0 size-64 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(139,173,164,0.15) 0%, transparent 70%)' }} />

          {/* Floating animated circles */}
          <motion.div
            className="absolute top-1/3 -right-10 size-40 rounded-full pointer-events-none"
            style={{ border: '1px solid rgba(139,173,164,0.2)', background: 'rgba(139,173,164,0.04)' }}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-24 left-6 size-20 rounded-full pointer-events-none"
            style={{ border: '1px solid rgba(139,173,164,0.15)' }}
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />

          {/* Top — logo */}
          <div className="relative z-10">
            <Link to="/" aria-label="90percent home">
              <LogoWhite size="lg" />
            </Link>
          </div>

          {/* Middle — headline */}
          <div className="relative z-10">
            <h2 className="text-4xl font-bold leading-snug text-white">
              Shop smarter.<br />
              <span style={{ color: '#8BADA4' }}>Live better.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Discover thousands of premium products with fast delivery and exceptional service.
            </p>
          </div>

          {/* Bottom — features */}
          <div className="relative z-10 space-y-3">
            {FEATURES.map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm"
                style={{ color: 'rgba(255,255,255,0.8)' }}>
                <span className="flex size-7 items-center justify-center rounded-lg text-base shrink-0"
                  style={{ background: 'rgba(139,173,164,0.15)', border: '1px solid rgba(139,173,164,0.2)' }}>
                  {icon}
                </span>
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Bottom sage accent bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, #8BADA4, #5C8880, #3D6862)' }} />
        </div>

        {/* ── Right — form panel ── */}
        <div
          className="flex flex-1 flex-col justify-center px-8 py-10 sm:px-14"
          style={{ background: '#ffffff' }}
        >
          {/* Mobile logo */}
          <div className="mb-6 md:hidden flex justify-center">
            <Link to="/" aria-label="90percent home">
              <Logo size="md" />
            </Link>
          </div>

          <Outlet />
        </div>
      </motion.div>
    </div>
  )
}
