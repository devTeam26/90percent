import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGetProductsByCategoryQuery } from '@/data/useMockData'
import type { Product } from '@/types'

// ── Section config ────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    key: 'camera',
    title: 'Security Cameras',
    filter: (p: Product) => p.tags.includes('camera'),
  },
]

// ── FadeUp helper ─────────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = '' }: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ── Product card ──────────────────────────────────────────────────────────────
function SmartHomeCard({ product, index = 0 }: { product: Product; index?: number }) {
  const img = product.images[0]?.url

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Link
        to={`/products/${product.slug}`}
        className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-[#D4E0DD] hover:shadow-lg transition-shadow duration-300"
      >
        <div className="relative aspect-square overflow-hidden bg-[#EEF3F2]">
          {img && (
            <img
              src={img}
              alt={product.name}
              className="size-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.06]"
              loading="lazy"
              decoding="async"
            />
          )}
          {product.compareAtPrice && (
            <div className="absolute top-3 left-3 rounded-full bg-[#8BADA4] px-2.5 py-0.5 text-[10px] font-bold text-white">
              SALE
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-sm font-semibold text-[#1C2B28] line-clamp-2 leading-snug">
            {product.name}
          </h3>
          <div className="mt-auto pt-3">
            <span className="text-xs text-amber-500">
              ★ {product.averageRating.toFixed(1)}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SmartHomePage() {
  const { data, isLoading } = useGetProductsByCategoryQuery('smart-home')
  const products = data?.data ?? []

  return (
    <div className="min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <div className="relative min-h-[50vh] flex items-center overflow-hidden bg-[#12171f] pt-24">
        {/* Dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle,#8BADA4 1px,transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Diagonal texture */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'repeating-linear-gradient(135deg,transparent,transparent 80px,rgba(139,173,164,0.02) 80px,rgba(139,173,164,0.02) 82px)',
          }}
        />
        {/* Glow */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/3 -translate-y-1/2 w-[700px] h-[700px]"
          style={{
            background: 'radial-gradient(circle,rgba(139,173,164,0.13) 0%,transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        {/* Corner marks */}
        {[
          'top-8 left-8 border-l-2 border-t-2',
          'top-8 right-8 border-r-2 border-t-2',
          'bottom-8 left-8 border-l-2 border-b-2',
          'bottom-8 right-8 border-r-2 border-b-2',
        ].map((cls, i) => (
          <div
            key={i}
            className={`pointer-events-none absolute w-10 h-10 border-[#8BADA4]/25 ${cls}`}
          />
        ))}

        <div className="container relative z-10 py-16">
          <motion.p
            className="text-[11px] font-bold tracking-[.45em] text-[#8BADA4] uppercase mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            90percent Connected Living
          </motion.p>
          <motion.h1
            className="text-[clamp(46px,8vw,110px)] font-black text-white leading-[.88] tracking-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            SMART HOME
          </motion.h1>
          <motion.p
            className="mt-6 text-sm text-white/40 max-w-md leading-relaxed"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Security cameras and smart devices that protect and monitor your world, anywhere, anytime.
          </motion.p>
        </div>
      </div>

      {/* ── MARQUEE ──────────────────────────────────────────────────── */}
      <div className="overflow-hidden bg-[#1C2B28] py-3.5">
        <div className="flex whitespace-nowrap gap-10 animate-marquee">
          {['CAMERAS', 'SMART HOME', 'SECURITY', '90PERCENT', 'EVA CAM', 'AI DETECT', '2K QHD', 'WIFI'].concat(
            ['CAMERAS', 'SMART HOME', 'SECURITY', '90PERCENT', 'EVA CAM', 'AI DETECT', '2K QHD', 'WIFI']
          ).map((t, i) => (
            <span
              key={i}
              className="flex items-center gap-10 text-xs font-bold uppercase tracking-[.25em] text-white/35"
            >
              {t} <span className="text-[#8BADA4]">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── SECTIONS ─────────────────────────────────────────────────── */}
      <div className="bg-[#F2F6F5] pb-24">
        {isLoading ? (
          <div className="container pt-20">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white border border-[#D4E0DD] aspect-[3/4] animate-pulse"
                />
              ))}
            </div>
          </div>
        ) : (
          SECTIONS.map((section) => {
            const sectionProducts = products.filter(section.filter)
            if (sectionProducts.length === 0) return null
            return (
              <section key={section.key} className="container pt-20">
                <FadeUp className="mb-8">
                  <p className="text-xs font-bold tracking-[.35em] text-[#8BADA4] uppercase mb-3">
                    — Smart Home —
                  </p>
                  <h2 className="text-2xl font-black text-[#1C2B28]">{section.title}</h2>
                </FadeUp>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
                  {sectionProducts.map((p, i) => (
                    <SmartHomeCard key={p.id} product={p} index={i} />
                  ))}
                </div>
              </section>
            )
          })
        )}
      </div>

      {/* ── CTA BANNER ───────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1C2B28 0%, #243430 60%, #1A3835 100%)' }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle, #8BADA4 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <span className="text-[18vw] font-black text-white/[0.04] uppercase leading-none tracking-tighter whitespace-nowrap">
            SMART
          </span>
        </div>
        <div className="container relative z-10 text-center">
          <motion.h2
            className="text-[clamp(40px,6vw,80px)] font-black text-white leading-[.88] tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            ALWAYS<br /><span className="text-gradient-sage">CONNECTED.</span>
          </motion.h2>
          <motion.div
            className="mt-8 flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              to="/"
              className="rounded-full bg-[#8BADA4] px-9 py-4 text-sm font-bold text-white hover:bg-[#5C8880] transition-colors duration-300"
            >
              Back to Home
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
