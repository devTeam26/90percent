import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import { useGetProductsQuery } from '@/data/useMockData'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setFilters } from '@/features/search/store/searchSlice'
import Pagination from '@/components/common/Pagination'
import type { Product } from '@/types'
import { ctrl1_1 } from '@/data/localImages'

gsap.registerPlugin(ScrollTrigger)

const CFG = {
  tagline:      'Level Up Your Setup',
  headline:     ['GAME', 'BOLD.'],
  caption:      '90percent G7 Pro wireless RGB controllers — engineered for PlayStation 4, PC, and mobile with 8-hour battery and 16.8M colors.',
  marqueeItems: ['GAMING', 'CONTROLLERS', 'RGB LED', 'WIRELESS', 'PS4', 'PC', 'G7 PRO', '90PERCENT'],
  features:     ['Bluetooth 5.1', 'RGB 16.8M Colors', '8h Battery', 'Multi-Platform'],
  midHeadline:  ['BUILT TO', 'WIN.'],
  midCaption:   'Precision dual-analog sticks, haptic triggers, and RGB that sets the mood — made for players who demand more.',
}

const SCATTERED_HERO = [
  { top: '4%',  left: '8%',  rotate: '-6deg', w: 270 },
  { top: '28%', left: '38%', rotate: '4deg',  w: 240 },
  { top: '52%', left: '14%', rotate: '-2deg', w: 220 },
]

const SCATTERED_BANNER = [
  { top: '0%',  left: '24%', rotate: '-5deg', w: 260 },
  { top: '18%', left: '0%',  rotate: '3deg',  w: 215 },
  { top: '48%', left: '32%', rotate: '-3deg', w: 235 },
  { top: '62%', left: '4%',  rotate: '6deg',  w: 195 },
]

// ── FadeUp — section headings only, not repeated per-card ─────────────────────
function FadeUp({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  return (
    <motion.div className={className}
      initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >{children}</motion.div>
  )
}

// ── Product card — CSS animations, no per-card JS observers ──────────────────
function GamingCard({ product, index = 0 }: { product: Product; index?: number }) {

  const img = product.images[0]?.url

  return (
    <div
      className="gaming-card group h-full flex flex-col bg-white rounded-2xl overflow-hidden border border-[#D4E0DD]"
      style={{
        animationDelay: `${index * 60}ms`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.05)',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      <Link to={`/products/${product.slug}`} className="flex flex-col h-full">
        <div className="relative aspect-square overflow-hidden bg-[#EEF3F2]">
          {img && (
            <img
              src={img}
              alt={product.name}
              className="size-full object-contain transition-transform duration-500 group-hover:scale-[1.06]"
              loading="lazy"
              decoding="async"
            />
          )}
          {product.compareAtPrice && (
            <div className="absolute top-3 left-3 rounded-full bg-[#8BADA4] px-2.5 py-0.5 text-[10px] font-bold text-white">SALE</div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1">
          <p className="text-[10px] text-[#8BADA4] font-semibold uppercase tracking-widest mb-1">
            {product.category.name}
          </p>
          <h3 className="text-sm font-semibold text-[#1C2B28] line-clamp-2 leading-snug">{product.name}</h3>
          <div className="mt-auto pt-3">
            <span className="text-xs text-amber-500">★ {product.averageRating.toFixed(1)}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function GamingPage() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((s) => s.search.filters)
  const [heroLoaded, setHeroLoaded] = useState(false)

  useEffect(() => {
    dispatch(setFilters({ categoryId: 'cat-gaming' }))
  }, [dispatch])

  const { data, isLoading } = useGetProductsQuery(filters)
  const products = data?.data ?? []
  const meta = data?.meta

  const bannerRef   = useRef<HTMLDivElement>(null)
  const heroImgRefs = useRef<(HTMLDivElement | null)[]>([])

  // GSAP: hero float-in only (no infinite loop)
  useEffect(() => {
    if (products.length === 0) return
    const ctx = gsap.context(() => {
      heroImgRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.fromTo(el,
          { y: 50, opacity: 0, scale: 0.88 },
          { y: 0, opacity: 1, scale: 1, duration: 1.0, ease: 'power3.out', delay: 0.4 + i * 0.15 }
        )
      })
    })
    setHeroLoaded(true)
    return () => ctx.revert()
  }, [products.length])

  // GSAP: banner scatter (fires once on scroll)
  useEffect(() => {
    if (!bannerRef.current || products.length === 0) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.gaming-banner-img',
        { opacity: 0, scale: 0.78, y: 56, rotate: -8 },
        {
          opacity: 1, scale: 1, y: 0, rotate: 0,
          duration: 0.85, ease: 'back.out(1.4)',
          stagger: 0.12,
          scrollTrigger: { trigger: bannerRef.current, start: 'top 72%' },
        }
      )
    }, bannerRef)
    return () => ctx.revert()
  }, [products.length])

  const firstGroup = products.slice(0, 8)
  const restGroup  = products.slice(8)
  const bannerImgs = products.slice(0, 4).map(p => p.images[0]?.url).filter(Boolean) as string[]
  const heroImgs   = products.slice(0, 3).map(p => p.images[0]?.url).filter(Boolean) as string[]

  const scrollToProducts = (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById('gaming-products')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen">

      {/* ── 1. HERO ─────────────────────────────────────────────────── */}
      <div className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#0d1117] pt-20">

        <div className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'radial-gradient(circle,#8BADA4 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'repeating-linear-gradient(135deg,transparent,transparent 80px,rgba(139,173,164,0.03) 80px,rgba(139,173,164,0.03) 82px)' }} />
        {/* Glow — willChange isolates it to compositor, no repaint on scroll */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/3 -translate-y-1/2 w-[800px] h-[800px]"
          style={{
            background: 'radial-gradient(circle,rgba(139,173,164,0.14) 0%,transparent 70%)',
            filter: 'blur(80px)',
            willChange: 'transform',
          }}
        />
        {[
          'top-8 left-8 border-l-2 border-t-2',
          'top-8 right-8 border-r-2 border-t-2',
          'bottom-8 left-8 border-l-2 border-b-2',
          'bottom-8 right-8 border-r-2 border-b-2',
        ].map((cls, i) => (
          <div key={i} className={`pointer-events-none absolute w-10 h-10 border-[#8BADA4]/30 ${cls}`} />
        ))}

        <div className="container relative z-10 flex flex-col lg:flex-row items-center gap-16 py-16">

          <div className="flex-1 shrink-0">
            <motion.p className="text-[11px] font-bold tracking-[.45em] text-[#8BADA4] uppercase mb-6"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >{CFG.tagline}</motion.p>

            <div className="overflow-hidden">
              {CFG.headline.map((line, i) => (
                <motion.h1 key={i}
                  className={`block text-[clamp(68px,10vw,130px)] font-black leading-[.84] tracking-tight ${
                    i === 1 ? 'text-gradient-orange' : 'text-white'
                  }`}
                  initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.25 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >{line}</motion.h1>
              ))}
            </div>

            <motion.p className="mt-8 text-sm text-white/38 max-w-sm leading-relaxed"
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >{CFG.caption}</motion.p>

            <motion.div className="mt-8 flex items-center gap-5"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
            >
              <a href="#gaming-products" onClick={scrollToProducts}
                className="rounded-full bg-[#8BADA4] px-9 py-3.5 text-sm font-bold text-white hover:bg-white hover:text-[#1C2B28] transition-colors duration-300"
              >Shop Controllers</a>
              <span className="text-xs text-white/20 font-semibold uppercase tracking-widest">
                {meta?.total ?? products.length} products
              </span>
            </motion.div>

            <motion.div className="mt-10 flex flex-wrap gap-2"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.85 }}
            >
              {CFG.features.map((f) => (
                <span key={f} className="text-[10px] font-bold uppercase tracking-[.2em] text-white/25 border border-white/[0.09] rounded-full px-3.5 py-1.5">{f}</span>
              ))}
            </motion.div>
          </div>

          {/* Scattered images — GSAP float-in, no infinite loop */}
          <div className="flex-1 relative hidden lg:flex" style={{ height: 560 }}>
            {heroImgs.map((src, i) => {
              const s = SCATTERED_HERO[i]
              if (!s) return null
              return (
                <div key={i} ref={el => { heroImgRefs.current[i] = el }}
                  className="absolute rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_32px_80px_rgba(0,0,0,0.7)]"
                  style={{ top: s.top, left: s.left, width: s.w, transform: `rotate(${s.rotate})`, zIndex: 3 - i, opacity: 0 }}
                >
                  <img src={src} alt="" className="w-full aspect-square object-cover" loading="eager" decoding="async" />
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)' }} />
                </div>
              )
            })}
          </div>
        </div>

        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
        >
          <span className="text-[9px] tracking-[.5em] text-white/18 uppercase">Scroll</span>
          <motion.div className="w-px h-10 bg-gradient-to-b from-[#8BADA4]/50 to-transparent"
            animate={{ scaleY: [1, 0.3, 1] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>

      {/* ── 2. MARQUEE ──────────────────────────────────────────────── */}
      <div className="overflow-hidden bg-[#1C2B28] py-3.5">
        <div className="flex whitespace-nowrap gap-10 animate-marquee">
          {[...CFG.marqueeItems, ...CFG.marqueeItems].map((t, i) => (
            <span key={i} className="flex items-center gap-10 text-xs font-bold uppercase tracking-[.25em] text-white/35">
              {t} <span className="text-[#8BADA4]">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── 3. EDITORIAL SPLIT BANNER ───────────────────────────────── */}
      <section className="overflow-hidden bg-[#EEF3F2]">
        <div className="flex flex-col lg:flex-row min-h-[580px]">

          <motion.div className="flex-1 relative overflow-hidden min-h-[340px] lg:min-h-0"
            initial={{ opacity: 0, x: -80 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <img src={ctrl1_1} alt="G7 Pro Controller" className="absolute inset-0 size-full object-cover" loading="lazy" decoding="async" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 60%, #EEF3F2)' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #EEF3F2 0%, transparent 40%)' }} />
            <motion.div className="absolute top-8 left-8 bg-[#8BADA4] text-white text-[10px] font-bold uppercase tracking-[.25em] px-4 py-2 rounded-full"
              initial={{ opacity: 0, y: -16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.5 }}
            >G7 Pro Series</motion.div>
            {meta && (
              <motion.div className="absolute bottom-8 left-8 bg-[#1C2B28]/80 backdrop-blur-sm text-white text-[11px] font-bold px-4 py-2 rounded-full flex items-center gap-2"
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.6 }}
              >
                <span className="size-1.5 rounded-full bg-[#8BADA4] inline-block" />
                {meta.total} controllers available
              </motion.div>
            )}
          </motion.div>

          <div className="flex-1 flex items-center p-10 lg:p-16 xl:p-20">
            <div className="max-w-md">
              <FadeUp delay={0.15}>
                <p className="text-[10px] font-bold tracking-[.4em] text-[#8BADA4] uppercase mb-5">90percent · Gaming</p>
                <h2 className="text-[clamp(44px,5.5vw,76px)] font-black text-[#1C2B28] leading-[.86] tracking-tight">
                  DESIGNED<br />TO <span className="text-gradient-orange">WIN.</span>
                </h2>
                <p className="mt-6 text-sm text-[#888] leading-relaxed">{CFG.caption}</p>
                <ul className="mt-8 space-y-3">
                  {CFG.features.map((f, i) => (
                    <motion.li key={f} className="flex items-center gap-3 text-sm text-[#1C2B28] font-medium"
                      initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                    >
                      <span className="size-1.5 rounded-full bg-[#8BADA4] shrink-0" />{f}
                    </motion.li>
                  ))}
                </ul>
                <motion.a href="#gaming-products" onClick={scrollToProducts}
                  className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-[#1C2B28] hover:text-[#8BADA4] transition-colors group"
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }}
                >
                  Browse Controllers <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-200" />
                </motion.a>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. FEATURE TRIO ─────────────────────────────────────────── */}
      <section className="bg-white border-b border-[#D4E0DD]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#D4E0DD]">
            {[
              { num: '01', title: 'Bluetooth\n5.1',      desc: 'Ultra-low latency wireless for lag-free gaming on PS4, PC, Android, and iOS.' },
              { num: '02', title: 'RGB\n16.8M Colors',   desc: 'Full-body LED arc lighting with 16.8 million customizable color combinations.' },
              { num: '03', title: '8-Hour\nBattery',     desc: 'USB-C fast charge powers you through your longest sessions, fully charged in 2 hours.' },
            ].map(({ num, title, desc }, i) => (
              <motion.div key={num}
                className="flex flex-col p-10 lg:p-12 relative overflow-hidden group cursor-default"
                initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="absolute inset-0 bg-[#EEF3F2] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <span className="text-[11px] font-black text-[#8BADA4]/70 tracking-[.35em]">{num}</span>
                  <h3 className="mt-4 text-[clamp(28px,3vw,40px)] font-black text-[#1C2B28] leading-[.88]">
                    {title.split('\n').map((l, j) => <span key={j} className="block">{l}</span>)}
                  </h3>
                  <p className="mt-4 text-sm text-[#999] leading-relaxed">{desc}</p>
                  <motion.div className="mt-8 h-[2px] bg-[#8BADA4] origin-left"
                    initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.35 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. TOP PICKS STRIP ──────────────────────────────────────── */}
      {!isLoading && products.length >= 3 && (
        <section className="bg-[#1C2B28] py-16 overflow-hidden">
          <div className="container mb-10">
            <FadeUp className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-[.4em] text-[#8BADA4] uppercase mb-2">Hand-Picked</p>
                <h2 className="text-3xl font-black text-white leading-none">TOP PICKS.</h2>
              </div>
              <a href="#gaming-products" onClick={scrollToProducts}
                className="text-xs font-bold text-white/30 hover:text-[#8BADA4] transition-colors flex items-center gap-1"
              >See all <ArrowRight className="size-3" /></a>
            </FadeUp>
          </div>

          <div className="flex gap-4 overflow-visible pl-[max(2rem,calc((100vw-1280px)/2+2rem))] pr-8">
            {products.slice(0, Math.min(products.length, 5)).map((p, i) => (
              <motion.div key={p.id}
                className="shrink-0 w-[260px] relative group rounded-2xl overflow-hidden border border-white/[0.07] cursor-pointer"
                initial={{ opacity: 0, y: 48, rotate: i % 2 === 0 ? -2 : 2 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.75, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link to={`/products/${p.slug}`}>
                  <div className="aspect-square overflow-hidden bg-[#1e2530]">
                    {p.images[0]?.url && (
                      <img src={p.images[0].url} alt={p.name}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy" decoding="async"
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 inset-x-0 p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-[9px] font-bold uppercase tracking-[.3em] text-[#8BADA4] mb-1">{p.category.name}</p>
                    <h3 className="text-[13px] font-bold text-white line-clamp-1 leading-snug">{p.name}</h3>
                  </div>
                  {p.compareAtPrice && (
                    <div className="absolute top-3 right-3 rounded-full bg-[#8BADA4] px-2 py-0.5 text-[9px] font-bold text-white">SALE</div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── 6. PRODUCT GRID ─────────────────────────────────────────── */}
      <div id="gaming-products" className="bg-[#F2F6F5] pt-20 pb-16">
        <div className="container">
          <FadeUp className="mb-12">
            <p className="text-xs font-bold tracking-[.35em] text-[#8BADA4] uppercase mb-3">— Collection —</p>
            <h2 className="text-[clamp(36px,5vw,64px)] font-black tracking-tight text-[#1C2B28] leading-[.88]">GAMING</h2>
          </FadeUp>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-white border border-[#D4E0DD] aspect-[3/4] animate-pulse" />
              ))}
            </div>
          ) : firstGroup.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="text-6xl mb-6 opacity-20">⬡</div>
              <h3 className="text-xl font-bold text-[#555]">No products found</h3>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
              {firstGroup.map((p, i) => <GamingCard key={p.id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </div>

      {/* ── 7. MID DARK BANNER ──────────────────────────────────────── */}
      {!isLoading && bannerImgs.length > 0 && (
        <section ref={bannerRef} className="relative bg-[#0d1117] py-28 overflow-hidden">
          <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden">
            <span className="text-[16vw] font-black text-white/[0.025] uppercase leading-none tracking-tighter whitespace-nowrap">90PERCENT</span>
          </div>
          <div className="pointer-events-none absolute inset-0"
            style={{ background: 'repeating-linear-gradient(135deg,transparent,transparent 80px,rgba(139,173,164,0.015) 80px,rgba(139,173,164,0.015) 82px)' }} />

          <div className="container relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1">
                <FadeUp>
                  <p className="text-[11px] font-bold tracking-[.45em] text-[#8BADA4] uppercase mb-5">90percent G7 Pro</p>
                  <h2 className="text-[clamp(52px,7vw,96px)] font-black leading-[.84] tracking-tight">
                    {CFG.midHeadline.map((line, i) => (
                      <span key={i} className={`block ${i === 0 ? 'text-white' : ''}`}
                        style={i === 1 ? { WebkitTextStroke: '2px rgba(255,255,255,0.18)', color: 'transparent' } : undefined}
                      >{line}</span>
                    ))}
                  </h2>
                  <p className="mt-7 text-sm text-white/35 max-w-sm leading-relaxed">{CFG.midCaption}</p>
                  <a href="#gaming-products" onClick={scrollToProducts}
                    className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#8BADA4] hover:text-white transition-colors duration-200"
                  >Browse All <ArrowRight className="size-4" /></a>
                </FadeUp>
                <FadeUp delay={0.1} className="mt-12 flex gap-10 flex-wrap">
                  {[
                    { val: `${meta?.total ?? products.length}`, label: 'Models' },
                    { val: '4.7★', label: 'Avg Rating' },
                    { val: '1500+', label: 'Sold' },
                  ].map(({ val, label }) => (
                    <div key={label}>
                      <div className="text-3xl font-black text-white tabular-nums">{val}</div>
                      <p className="text-xs text-white/28 mt-1 uppercase tracking-widest">{label}</p>
                    </div>
                  ))}
                </FadeUp>
              </div>

              <div className="flex-1 relative hidden lg:block" style={{ minHeight: 500 }}>
                {bannerImgs.map((src, i) => {
                  const s = SCATTERED_BANNER[i]
                  if (!s) return null
                  return (
                    <div key={i} className="gaming-banner-img absolute rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
                      style={{ top: s.top, left: s.left, width: s.w, transform: `rotate(${s.rotate})`, zIndex: 4 - i }}
                    >
                      <img src={src} alt="" className="w-full aspect-square object-cover" draggable={false} loading="lazy" decoding="async" />
                      <div className="absolute inset-0 pointer-events-none"
                        style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.07) 0%,transparent 55%)' }} />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 8. REVERSE MARQUEE ──────────────────────────────────────── */}
      {!isLoading && (
        <div className="overflow-hidden bg-[#1C2B28] py-3.5">
          <div className="flex whitespace-nowrap gap-10 animate-marquee-rev">
            {[...CFG.marqueeItems, ...CFG.marqueeItems].map((t, i) => (
              <span key={i} className="flex items-center gap-10 text-xs font-bold uppercase tracking-[.25em] text-white/35">
                {t} <span className="text-[#8BADA4]">·</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── 9. REMAINING PRODUCTS ───────────────────────────────────── */}
      {restGroup.length > 0 && (
        <div className="bg-[#F2F6F5] py-16">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
              {restGroup.map((p, i) => <GamingCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="bg-[#F2F6F5] pb-20">
          <div className="container">
            <Pagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
              onPageChange={(p) => dispatch(setFilters({ page: p }))}
            />
          </div>
        </div>
      )}

      {/* ── 10. CTA BANNER ──────────────────────────────────────────── */}
      <section className="relative py-28 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1C2B28 0%, #243430 60%, #1A3835 100%)' }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle, #8BADA4 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <span className="text-[18vw] font-black text-white/[0.04] uppercase leading-none tracking-tighter whitespace-nowrap">GAMING</span>
        </div>
        <div className="container relative z-10 text-center">
          <motion.p className="text-[11px] font-bold tracking-[.45em] text-[#8BADA4] uppercase mb-5"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >90percent G7 Pro Series</motion.p>
          <motion.h2 className="text-[clamp(44px,7vw,90px)] font-black text-white leading-[.88] tracking-tight"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >PLAY<br /><span className="text-gradient-sage">BOLD.</span></motion.h2>
          <motion.div className="mt-8 flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <a href="#gaming-products" onClick={scrollToProducts}
              className="rounded-full bg-[#8BADA4] px-9 py-4 text-sm font-bold text-white hover:bg-[#5C8880] transition-colors duration-300"
            >Shop Controllers</a>
            <Link to="/"
              className="rounded-full border-2 border-white/30 px-9 py-4 text-sm font-bold text-white hover:bg-white/10 transition-colors duration-300"
            >Back to Home</Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
