import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, ArrowLeft, Package, Truck, Shield, ArrowUpRight } from 'lucide-react'
import { useGetProductQuery, useGetRelatedProductsQuery } from '@/data/useMockData'
import { Skeleton } from '@/components/common/Skeleton'
import { C, EASE, SplitText, Reveal, Eyebrow, Btn, TiltCard, Blob, Heading } from '@/components/fx/primitives'

// ── Zoom lens stage ───────────────────────────────────────────────────────────
function ZoomStage({ src, alt, dir }: { src?: string; alt: string; dir: number }) {
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null)
  return (
    <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-white"
      style={{ border: `1px solid ${C.line}` }}
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setLens({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }) }}
      onMouseLeave={() => setLens(null)}>
      <Blob size={560} className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60" />
      {src ? (
        <AnimatePresence mode="popLayout" custom={dir}>
          <motion.img
            key={src}
            src={src} alt={alt}
            className="relative size-full object-contain p-4"
            style={{ filter: 'drop-shadow(0 24px 40px rgba(28,43,40,0.16))' }}
            custom={dir}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 200, rotate: d * 15, scale: 0.8 }),
              center: { opacity: 1, x: 0, rotate: 0, scale: 1 },
              exit: (d: number) => ({ opacity: 0, x: d * -200, rotate: d * -15, scale: 0.8 }),
            }}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.7, ease: EASE }}
            draggable={false}
          />
        </AnimatePresence>
      ) : (
        <div className="flex size-full items-center justify-center" style={{ color: C.sageLt }}>
          <Package className="size-16" />
        </div>
      )}

      {/* magnifier */}
      <AnimatePresence>
        {lens && src && (
          <motion.div
            className="pointer-events-none absolute z-20 hidden size-44 rounded-full md:block"
            style={{
              left: `calc(${lens.x * 100}% - 88px)`, top: `calc(${lens.y * 100}% - 88px)`,
              backgroundImage: `url("${src}")`, backgroundRepeat: 'no-repeat', backgroundColor: '#fff',
              backgroundSize: '260%', backgroundPosition: `${lens.x * 100}% ${lens.y * 100}%`,
              border: `3px solid ${C.sage}`, boxShadow: '0 20px 50px rgba(28,43,40,0.25)',
            }}
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Key spec tile — turns sage with white text on hover ───────────────────────
function SpecCard({ label, value, i }: { label: string; value: string; i: number }) {
  const [hover, setHover] = useState(false)
  return (
    <motion.div
      className="rounded-2xl p-4 transition-colors duration-300"
      style={{ background: hover ? C.sage : '#fff', border: `1px solid ${hover ? C.sage : C.line}` }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.7 + i * 0.07, ease: EASE }}>
      <p className="text-[10px] font-bold uppercase tracking-widest transition-colors duration-300" style={{ color: hover ? '#fff' : C.sage }}>{label}</p>
      <p className="mt-1 text-sm font-bold transition-colors duration-300" style={{ color: hover ? '#fff' : C.dark }}>{value}</p>
    </motion.div>
  )
}

// ── Description: words light up as you scroll ─────────────────────────────────
function ScrubParagraph({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className="font-display flex flex-wrap font-semibold leading-[1.25]" style={{ fontSize: 'clamp(22px, 2.6vw, 38px)' }}>
      {words.map((w, i) => <ScrubWord key={i} word={w} i={i} n={words.length} p={scrollYProgress} />)}
    </p>
  )
}
function ScrubWord({ word, i, n, p }: { word: string; i: number; n: number; p: MotionValue<number> }) {
  const opacity = useTransform(p, [i / n, (i + 1) / n], [0.15, 1])
  return <motion.span className="mr-[0.28em]" style={{ opacity, color: C.dark }}>{word}</motion.span>
}

// ── Draggable related carousel ────────────────────────────────────────────────
function RelatedRail({ items }: { items: NonNullable<ReturnType<typeof useGetRelatedProductsQuery>['data']>['data'] }) {
  const wrap = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [limit, setLimit] = useState(0)
  useEffect(() => {
    const m = () => setLimit(Math.max(0, (track.current?.scrollWidth ?? 0) - (wrap.current?.clientWidth ?? 0)))
    m()
    window.addEventListener('resize', m)
    return () => window.removeEventListener('resize', m)
  }, [items.length])

  return (
    <div ref={wrap} className="overflow-hidden">
      <motion.div ref={track} className="flex w-max cursor-grab gap-5 active:cursor-grabbing"
        drag="x" dragConstraints={{ left: -limit, right: 0 }} dragElastic={0.12}>
        {items.slice(0, 8).map((p, i) => (
          <motion.div key={p.id} className="w-[300px] shrink-0 md:w-[380px]"
            initial={{ opacity: 0, x: 120 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: i * 0.07, ease: EASE }}>
            <TiltCard max={10} className="rounded-[2rem]">
              <Link to={`/products/${p.slug}`} data-cursor="view" draggable={false}
                className="group block overflow-hidden rounded-[2rem] bg-white" style={{ border: `1px solid ${C.line}` }}>
                <div className="relative aspect-square overflow-hidden" style={{ background: C.bg2 }}>
                  {p.images[0]?.url ? (
                    <img src={p.images[0].url} alt={p.name} loading="lazy" draggable={false}
                      className="size-full object-contain p-2 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-rotate-6 group-hover:scale-110" />
                  ) : (
                    <div className="flex size-full items-center justify-center"><Package className="size-10" style={{ color: C.sageLt }} /></div>
                  )}
                </div>
                <div className="p-5">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: C.sage }}>{p.category.name}</p>
                  <h3 className="line-clamp-2 text-sm font-semibold leading-snug" style={{ color: C.dark }}>{p.name}</h3>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[11px] font-bold" style={{ color: C.muted }}>
                      <Star className="size-3" style={{ fill: '#F59E0B', color: '#F59E0B' }} /> {p.averageRating.toFixed(1)}
                    </span>
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" style={{ color: C.sage }} />
                  </div>
                </div>
              </Link>
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data, isLoading } = useGetProductQuery(slug!)
  const product = data?.data

  const [selectedImageIdx,   setSelectedImageIdx]   = useState(0)
  const [dir, setDir] = useState(1)
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({})

  const { data: relatedData } = useGetRelatedProductsQuery(product?.id ?? '', { skip: !product?.id })
  const related = relatedData?.data ?? []

  useEffect(() => { setSelectedImageIdx(0) }, [slug])

  const handleAttributeSelect = (attrName: string, value: string) => {
    setSelectedAttributes((prev) => ({ ...prev, [attrName]: value }))
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div style={{ background: C.bg }} className="min-h-screen pb-16 pt-28">
        <div className="container">
          <div className="grid gap-14 lg:grid-cols-2">
            <Skeleton className="aspect-square rounded-[2.5rem]" />
            <div className="space-y-5 pt-4">
              <Skeleton className="h-4 w-24 rounded-full" />
              <Skeleton className="h-10 w-3/4 rounded-xl" />
              <Skeleton className="h-6 w-1/3 rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) return (
    <div style={{ background: C.bg }} className="flex min-h-screen items-center justify-center pb-16 pt-28">
      <div className="text-center">
        <motion.p className="font-display mb-4 text-[120px] font-bold leading-none" style={{ color: C.sageLt }}
          animate={{ rotate: [0, -4, 4, 0] }} transition={{ duration: 2, repeat: Infinity }}>404</motion.p>
        <h1 className="mb-2 text-xl font-bold" style={{ color: C.dark }}>Product not found</h1>
        <p className="mb-8 text-sm" style={{ color: C.muted }}>This product may have been removed or the link is incorrect.</p>
        <Btn to="/" arrow={false}><ArrowLeft className="size-4" /> Back to Home</Btn>
      </div>
    </div>
  )

  const images = product.images.filter((img) => img.url)
  const go = (i: number) => { setDir(i > selectedImageIdx ? 1 : -1); setSelectedImageIdx((i + images.length) % images.length) }

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="pt-28" style={{ background: C.bg }}>
        <div className="container">

          {/* Breadcrumb */}
          <motion.nav className="mb-10 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.15em]" style={{ color: C.faint }}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: EASE }}>
            <Link to="/" className="transition-colors hover:text-[#8BADA4]">Home</Link>
            <span>/</span>
            {product.category && (
              <>
                <Link to={`/categories/${product.category.slug}`} className="capitalize transition-colors hover:text-[#8BADA4]">
                  {product.category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="max-w-[200px] truncate" style={{ color: C.dark }}>{product.name}</span>
          </motion.nav>

          <div className="grid gap-12 pb-24 lg:grid-cols-[1.1fr_1fr] lg:gap-16">

            {/* ── LEFT: stage + thumbnail rail ─────────────────────────── */}
            <motion.div className="flex flex-col-reverse gap-4 md:flex-row lg:sticky lg:top-24 lg:self-start"
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.1, ease: EASE }}>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
                  {images.map((img, i) => (
                    <motion.button key={img.id} onClick={() => go(i)}
                      className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-white"
                      style={{ border: `2px solid ${i === selectedImageIdx ? C.sage : C.line}` }}
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.06, ease: EASE }}
                      whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
                      <img src={img.url} alt={img.alt || product.name} className="size-full object-contain p-1.5" />
                      {i === selectedImageIdx && (
                        <motion.span layoutId="thumb-ring" className="absolute inset-0 rounded-2xl" style={{ boxShadow: `inset 0 0 0 3px ${C.sage}` }} />
                      )}
                    </motion.button>
                  ))}
                </div>
              )}

              <div className="relative flex-1">
                <ZoomStage src={images[selectedImageIdx]?.url} alt={images[selectedImageIdx]?.alt || product.name} dir={dir} />
                {images.length > 1 && (
                  <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full bg-white/90 p-1.5 shadow-lg backdrop-blur"
                    style={{ border: `1px solid ${C.line}` }}>
                    <button className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-[#8BADA4] hover:text-white" style={{ color: C.dark }}
                      onClick={() => go(selectedImageIdx - 1)} aria-label="Previous image"><ChevronLeft className="size-4" /></button>
                    <span className="font-display min-w-[3ch] text-center text-xs font-bold tabular-nums" style={{ color: C.dark }}>
                      {selectedImageIdx + 1}/{images.length}
                    </span>
                    <button className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-[#8BADA4] hover:text-white" style={{ color: C.dark }}
                      onClick={() => go(selectedImageIdx + 1)} aria-label="Next image"><ChevronRight className="size-4" /></button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* ── RIGHT: info ──────────────────────────────────────────── */}
            <div className="space-y-7">
              <motion.div className="flex items-center justify-between"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, ease: EASE }}>
                <Eyebrow>90percent · {product.category.name}</Eyebrow>
                <span className="rounded-full px-3 py-1 font-mono text-[10px]" style={{ background: C.bg2, color: C.sageDk }}>{product.sku}</span>
              </motion.div>

              <h1 className="font-display font-bold leading-[.95] tracking-tight" style={{ fontSize: 'clamp(32px, 4.2vw, 60px)', color: C.dark }}>
                <SplitText text={product.name} delay={0.3} stagger={0.015} />
              </h1>

              {/* Rating — stars pop in one by one */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.span key={i} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.7 + i * 0.08, type: 'spring', stiffness: 400, damping: 12 }}>
                      <Star className="size-4" style={{
                        fill: i < Math.floor(product.averageRating) ? '#F59E0B' : C.sageLt,
                        color: i < Math.floor(product.averageRating) ? '#F59E0B' : C.sageLt,
                      }} />
                    </motion.span>
                  ))}
                </div>
                <span className="text-sm font-bold" style={{ color: C.dark }}>{product.averageRating.toFixed(1)}</span>
                <span className="text-sm" style={{ color: C.muted }}>· {product.reviewCount.toLocaleString()} reviews</span>
              </div>

              {product.shortDescription && (
                <Reveal delay={0.5} y={20}>
                  <p className="text-[15px] leading-relaxed" style={{ color: C.muted }}>{product.shortDescription}</p>
                </Reveal>
              )}

              <motion.div className="h-px origin-left" style={{ background: C.line }}
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.6, ease: EASE }} />

              {/* Key specs */}
              {product.specifications.length > 0 && (
                <div>
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[.35em]" style={{ color: C.faint }}>Key Specs</p>
                  <div className="grid grid-cols-2 gap-2">
                    {product.specifications.slice(0, 4).map((spec, i) => (
                      <SpecCard key={spec.label} label={spec.label} value={spec.value} i={i} />
                    ))}
                  </div>
                </div>
              )}

              {/* Variants */}
              {product.attributes.map((attr) => (
                <div key={attr.id}>
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[.35em]" style={{ color: C.faint }}>
                    {attr.name}
                    <AnimatePresence mode="wait">
                      {selectedAttributes[attr.name] && (
                        <motion.span key={selectedAttributes[attr.name]} className="ml-2 inline-block normal-case" style={{ color: C.sage }}
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                          — {selectedAttributes[attr.name]}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {attr.values.map((val) => {
                      const selected = selectedAttributes[attr.name] === val
                      return (
                        <motion.button key={val} onClick={() => handleAttributeSelect(attr.name, val)}
                          className="relative isolate rounded-full px-5 py-2.5 text-sm font-semibold"
                          style={{ color: selected ? '#fff' : C.dark, border: `1.5px solid ${selected ? C.sage : C.line}`, background: '#fff' }}
                          whileTap={{ scale: 0.92 }}>
                          {selected && (
                            <motion.span layoutId={`attr-${attr.id}`} className="absolute inset-0 -z-10 rounded-full" style={{ background: C.sage }}
                              transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                          )}
                          {val}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Stock with live pulse */}
              {(() => {
                const color = product.stock === 0 ? '#EF4444' : product.stock <= 10 ? '#F59E0B' : C.sage
                return (
                  <p className="flex items-center gap-2.5 text-[12px] font-semibold" style={{ color }}>
                    <span className="relative flex size-2.5">
                      <span className="absolute inline-flex size-full animate-ping rounded-full opacity-60" style={{ background: color }} />
                      <span className="relative inline-flex size-2.5 rounded-full" style={{ background: color }} />
                    </span>
                    {product.stock === 0 ? 'Out of stock'
                      : product.stock <= 10 ? `Only ${product.stock} left in stock`
                      : 'In stock — ships within 1–2 business days'}
                  </p>
                )
              })()}

              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {product.tags.map((tag, i) => (
                    <motion.span key={tag}
                      className="rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wide"
                      style={{ borderColor: C.line, color: C.sageDk }}
                      initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 + i * 0.04, type: 'spring' }}>
                      #{tag}
                    </motion.span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ─────────────────────────────────────────────────── */}
      <section style={{ background: C.sage }}>
        <div className="container grid grid-cols-1 divide-y divide-white/20 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            { icon: Truck,   title: 'Free Shipping',   sub: 'On orders over £30' },
            { icon: Shield,  title: '1-Year Warranty', sub: 'Every 90percent product' },
            { icon: Package, title: 'Easy Returns',    sub: '30-day hassle-free returns' },
          ].map(({ icon: Icon, title, sub }, i) => (
            <Reveal key={title} delay={i * 0.1} className="group flex items-center gap-4 px-4 py-8 lg:px-10">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white transition-transform duration-700 group-hover:rotate-[360deg]">
                <Icon className="size-5" style={{ color: C.sage }} />
              </div>
              <div>
                <p className="font-display text-base font-bold text-white">{title}</p>
                <p className="text-[12px] text-white/75">{sub}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FULL SPECIFICATIONS — table rows draw in ───────────────────────── */}
      {product.specifications.length > 0 && (
        <section className="py-24" style={{ background: C.bg }}>
          <div className="container grid gap-12 lg:grid-cols-[1fr_2fr]">
            <Heading eyebrow="Specifications" title="Full" accent="Details." className="lg:sticky lg:top-28 lg:self-start" />
            <div>
              {product.specifications.map((spec, i) => (
                <motion.div key={spec.label}
                  className="group relative flex items-center justify-between gap-6 overflow-hidden py-5"
                  initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.7, delay: i * 0.04, ease: EASE }}>
                  <span className="absolute inset-0 origin-left scale-x-0 rounded-2xl transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100" style={{ background: C.bg2 }} />
                  <span className="relative pl-3 text-[11px] font-bold uppercase tracking-widest" style={{ color: C.sage }}>{spec.label}</span>
                  <span className="relative pr-3 text-right text-sm font-semibold md:text-base" style={{ color: C.dark }}>{spec.value}</span>
                  <motion.span className="absolute bottom-0 left-0 h-px w-full origin-left" style={{ background: C.line }}
                    initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.1 + i * 0.04, ease: EASE }} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── DESCRIPTION — scroll-lit text ─────────────────────────────────── */}
      {product.description && (
        <section className="py-24" style={{ background: C.bg2 }}>
          <div className="container max-w-4xl">
            <Eyebrow className="mb-8">About this product</Eyebrow>
            <ScrubParagraph text={product.description} />
          </div>
        </section>
      )}

      {/* ── RELATED — drag to explore ─────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="overflow-hidden py-24" style={{ background: C.bg }}>
          <div className="container">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <Heading eyebrow="You might also like" title="Related" accent="Products." />
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold uppercase tracking-[.3em]" style={{ color: C.faint }}>← Drag →</span>
                <Btn to={`/categories/${product.category.slug}`} variant="outline">View all</Btn>
              </div>
            </div>
            <RelatedRail items={related} />
          </div>
        </section>
      )}
    </div>
  )
}
