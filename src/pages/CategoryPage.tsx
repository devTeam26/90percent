import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useGetCategoryQuery, useGetProductsQuery } from '@/data/useMockData'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setFilters } from '@/features/search/store/searchSlice'
import Pagination from '@/components/common/Pagination'
import type { Product } from '@/types'
import {
  C, EASE, SplitText, Reveal, ImageReveal, Eyebrow, Btn, TiltCard, VelocityMarquee, Blob, Heading,
} from '@/components/fx/primitives'

// ── Real product images ───────────────────────────────────────────────────────
import pfm_purple  from '@powerbank/PFM10M/1.png'
import pfm_pink    from '@powerbank/PFM10M/3.png'
import pfm_white   from '@powerbank/PFM10M/4.png'
import pfm_blue    from '@powerbank/PFM10M/5.png'
import prx_1       from '@powerbank/PRX10M/1.png'
import prx_6       from '@powerbank/PRX10M/6.png'
import pcn10_1     from '@powerbank/PCN10M/1.png'
import pcn10_3     from '@powerbank/PCN10M/3.png'
import pcn20_1     from '@powerbank/PCN20M/1.png'
import pcn20_4     from '@powerbank/PCN20M/4.png'
import pvs10_1     from '@powerbank/PVS10M/1.png'
import pvs10_4     from '@powerbank/PVS10M/4.png'
import pvs20_1     from '@powerbank/PVS20M/1.png'
import pvs20_2     from '@powerbank/PVS20M/2.png'
import cable_usbc  from '@/assets/accessories/VTAC2B/BO-X288C.png'
import cable_usbc2 from '@/assets/accessories/VTAC2B/BO-X288C-2.png'
import cable_micro from '@/assets/accessories/VTAM2B/BO-X288V.png'
import cable_micro2 from '@/assets/accessories/VTAM2B/BO-X288V-2.png'
import cable_cara  from '@/assets/accessories/VTAL2B/BO-X288L.png'
import cable_cara2 from '@/assets/accessories/VTAL2B/BO-X288L-2.png'
import cable_cc    from '@/assets/accessories/VTCC2B/BO-X288C-C.png'
import cable_lc    from '@/assets/accessories/VTLC2B/BO-X288C-L.png'
import cable_aux   from '@/assets/accessories/AUF90C/BO-AUX074.png'
import cable_aux2  from '@/assets/accessories/AUF90C/BO-AUX074-2.png'
import ws_1        from '@/assets/accessories/WEBSITE/WEBSITE PHOTO SIZE [Recovered]_1.png'
import ws_4        from '@/assets/accessories/WEBSITE/WEBSITE PHOTO SIZE [Recovered]_4.png'
import ws_6        from '@/assets/accessories/WEBSITE/WEBSITE PHOTO SIZE [Recovered]_6.png'
import ws_7        from '@/assets/accessories/WEBSITE/WEBSITE PHOTO SIZE [Recovered]_7.png'
import mount_v     from '@/assets/accessories/DVM101/BO-ZJ101.png'
import mount_f     from '@/assets/accessories/FMG360/BO-ZJ114.png'
import spk_04      from '@speakers/speakers-04.png'
import spk_05      from '@speakers/speakers-05.png'
import spk_06      from '@speakers/speakers-06.png'
import spk_07      from '@speakers/speakers-07.png'
import spk_08      from '@speakers/speakers-08.png'
import spk_09      from '@speakers/speakers-09.png'
import spk_10      from '@speakers/speakers-10.png'
import spk_11      from '@speakers/speakers-11.png'
import spk_12      from '@speakers/speakers-12.png'
import spk_13      from '@speakers/speakers-13.png'
import spk_14      from '@speakers/speakers-14.png'
import spk_15      from '@speakers/speakers-15.png'

// ── Per-category data ─────────────────────────────────────────────────────────
interface CatImg { img: string; label: string; sub: string; slug?: string }
interface CatData { hero: string[]; gallery: CatImg[] }

const CAT_IMAGES: Record<string, CatData> = {
  'power-banks': {
    hero: [pfm_purple, pfm_pink, pfm_blue, pcn10_1],
    gallery: [
      { img: pfm_purple, label: 'PFM Violet',   sub: 'PFM10M · 10 000 mAh',    slug: 'pfm10m-powerbank-violet' },
      { img: pfm_pink,   label: 'PFM Rose',     sub: 'PFM10M · 10 000 mAh',    slug: 'pfm10m-powerbank-rose' },
      { img: pfm_white,  label: 'PFM Cloud',    sub: 'PFM10M · 10 000 mAh',    slug: 'pfm10m-powerbank-cloud' },
      { img: pfm_blue,   label: 'PFM Sky',      sub: 'PFM10M · 10 000 mAh',    slug: 'pfm10m-powerbank-sky' },
      { img: prx_1,      label: 'PRX Midnight', sub: 'PRX10M · Compact',        slug: 'prx10m-powerbank-midnight-black' },
      { img: prx_6,      label: 'PRX Black',    sub: 'PRX10M · Stealth',        slug: 'prx10m-powerbank-midnight-black' },
      { img: pcn10_1,    label: 'PCN10 White',  sub: 'PCN10M · Built-in Cable', slug: 'pcn10m-powerbank-built-in-cable' },
      { img: pcn10_3,    label: 'PCN10 Angle',  sub: 'PCN10M · Built-in Cable', slug: 'pcn10m-powerbank-built-in-cable' },
      { img: pcn20_1,    label: 'PCN20 Front',  sub: 'PCN20M · Dual Cable',     slug: 'pcn20m-powerbank-dual-cable-20k' },
      { img: pcn20_4,    label: 'PCN20 Detail', sub: 'PCN20M · Dual Cable',     slug: 'pcn20m-powerbank-dual-cable-20k' },
      { img: pvs10_1,    label: 'PVS10 Slim',   sub: 'PVS10M · Slim Travel',    slug: 'pvs10m-powerbank-slim-travel' },
      { img: pvs10_4,    label: 'PVS10 Side',   sub: 'PVS10M · Slim Travel',    slug: 'pvs10m-powerbank-slim-travel' },
      { img: pvs20_1,    label: 'PVS20 Front',  sub: 'PVS20M · Travel Max',     slug: 'pvs20m-powerbank-travel-max' },
      { img: pvs20_2,    label: 'PVS20 Side',   sub: 'PVS20M · Travel Max',     slug: 'pvs20m-powerbank-travel-max' },
    ],
  },
  accessories: {
    hero: [cable_cara, ws_1, mount_v, cable_usbc],
    gallery: [
      { img: cable_usbc,   label: 'USB-C Cable',    sub: 'VTAC2B · Braided',     slug: 'vtac2b-usb-a-to-usb-c-braided-cable' },
      { img: cable_usbc2,  label: 'USB-C Pack',     sub: 'VTAC2B · Braided',     slug: 'vtac2b-usb-a-to-usb-c-braided-cable' },
      { img: cable_micro,  label: 'Micro USB',      sub: 'VTAM2B · Braided',     slug: 'vtam2b-usb-a-to-micro-usb-braided-cable' },
      { img: cable_micro2, label: 'Micro Pack',     sub: 'VTAM2B · Braided',     slug: 'vtam2b-usb-a-to-micro-usb-braided-cable' },
      { img: cable_cara,   label: 'Carabiner Blue', sub: 'VTAL2B · Clip Cable',  slug: 'vtal2b-carabiner-multi-cable' },
      { img: cable_cara2,  label: 'Carabiner Pack', sub: 'VTAL2B · Clip Cable',  slug: 'vtal2b-carabiner-multi-cable' },
      { img: cable_cc,     label: 'USB-C to C',     sub: 'VTCC2B · Braided',     slug: 'vtcc2b-usb-c-to-usb-c-braided-cable' },
      { img: cable_lc,     label: 'C to Lightning', sub: 'VTLC2B · Braided',     slug: 'vtlc2b-usb-c-to-lightning-braided-cable' },
      { img: cable_aux,    label: 'AUX Cable',      sub: 'AUF90C · 3.5mm',       slug: 'auf90c-usb-c-to-3-5mm-aux-cable' },
      { img: cable_aux2,   label: 'AUX Pack',       sub: 'AUF90C · 3.5mm',       slug: 'auf90c-usb-c-to-3-5mm-aux-cable' },
      { img: ws_1,         label: 'Ocean Blue',     sub: 'Carabiner · Lifestyle', slug: 'vtal2b-carabiner-multi-cable' },
      { img: ws_4,         label: 'Forest Teal',    sub: 'Carabiner · Lifestyle', slug: 'vtal2b-carabiner-multi-cable' },
      { img: ws_6,         label: 'Midnight',       sub: 'Carabiner · Lifestyle', slug: 'vtal2b-carabiner-multi-cable' },
      { img: ws_7,         label: 'Slate Gray',     sub: 'Carabiner · Lifestyle', slug: 'vtal2b-carabiner-multi-cable' },
      { img: mount_v,      label: 'DashPod Vent',   sub: 'DVM101 · Car Mount',    slug: 'dvm101-magnetic-vent-car-mount' },
      { img: mount_f,      label: 'FlexDash',       sub: 'FMG360 · Dash Mount',   slug: 'fmg360-magnetic-dashboard-car-mount' },
    ],
  },
  speakers: {
    hero: [spk_04, spk_06, spk_08, spk_10],
    gallery: [
      { img: spk_04, label: 'SoundPod Elite',  sub: 'Double USB-C · Black',     slug: 'soundpod-elite-earphones-double-usb-c-black' },
      { img: spk_05, label: 'SoundPod Elite',  sub: 'Double USB-C · White',     slug: 'soundpod-elite-earphones-double-usb-c-white' },
      { img: spk_06, label: 'SoundPod Elite',  sub: 'Single USB-C · Black',     slug: 'soundpod-elite-earphones-single-usb-c-black' },
      { img: spk_07, label: 'SoundPod Elite',  sub: 'Single USB-C · White',     slug: 'soundpod-elite-earphones-single-usb-c-white' },
      { img: spk_08, label: 'SoundPod Elite',  sub: 'Double Lightning · Black',  slug: 'soundpod-elite-earphones-double-lightning-black' },
      { img: spk_09, label: 'SoundPod Elite',  sub: 'Double Lightning · White',  slug: 'soundpod-elite-earphones-double-lightning-white' },
      { img: spk_10, label: 'SoundPod Elite',  sub: 'Single Lightning · Black',  slug: 'soundpod-elite-earphones-single-lightning-black' },
      { img: spk_11, label: 'SoundPod Elite',  sub: 'Single Lightning · White',  slug: 'soundpod-elite-earphones-single-lightning-white' },
      { img: spk_12, label: 'SoundPod Air',    sub: 'True Wireless · Earbuds',   slug: 'soundpod-elite-earphones-double-usb-c-black' },
      { img: spk_13, label: 'SoundPod Air+',   sub: 'ANC Earbuds',               slug: 'soundpod-elite-earphones-double-usb-c-white' },
      { img: spk_14, label: 'SoundPod Elite',  sub: 'Double Lightning · Black',  slug: 'soundpod-elite-earphones-double-lightning-black' },
      { img: spk_15, label: 'SoundPod Elite',  sub: 'Single USB-C · Black',      slug: 'soundpod-elite-earphones-single-usb-c-black' },
    ],
  },
}

const CAT_CONFIG: Record<string, {
  tagline: string
  headline: string[]
  caption: string
  marqueeItems: string[]
  features: { title: string; desc: string }[]
}> = {
  'power-banks': {
    tagline:    'Stay Charged. Always.',
    headline:   ['Power', 'everything.'],
    caption:    'Compact, fast-charging power banks with built-in cables and LED displays — engineered for the way you live.',
    marqueeItems: ['POWER BANKS', '10 000 MAH', 'FAST CHARGE', 'BUILT-IN CABLE', '90PERCENT', 'LED DISPLAY', '22.5W', 'POCKET SIZE'],
    features: [
      { title: 'Premium Materials',    desc: 'High-grade components chosen to outlast and outperform.' },
      { title: 'Precision Engineered', desc: 'Every detail tested to meet the highest performance standards.' },
      { title: '1-Year Warranty',      desc: 'Every 90percent product backed by our quality promise.' },
    ],
  },
  accessories: {
    tagline:    'Every Connection. Covered.',
    headline:   ['Braided', 'cables.'],
    caption:    'Premium braided cables for USB-C, Micro, Lightning, and AUX — plus magnetic car mounts that never let go.',
    marqueeItems: ['USB-C', 'MICRO USB', 'LIGHTNING', 'AUX', '90PERCENT', 'BRAIDED', 'CAR MOUNTS', 'CARABINER'],
    features: [
      { title: '6 Connector Types', desc: 'USB-C, Micro, Lightning, AUX, Carabiner and more.' },
      { title: 'Braided Nylon',     desc: 'Reinforced and tested for 10,000+ bends.' },
      { title: 'Magnetic Mounts',   desc: '360° precision mounts with tool-free install.' },
    ],
  },
  speakers: {
    tagline:    'Sound Elevated.',
    headline:   ['Sound', 'pod.'],
    caption:    'SoundPod wireless speakers and earbuds — hi-fi stereo, active noise cancellation, up to 30 hours playback.',
    marqueeItems: ['SOUNDPOD', 'WIRELESS', 'HI-FI STEREO', 'EARBUDS', '90PERCENT', 'BLUETOOTH', 'ANC', '30H BATTERY'],
    features: [
      { title: 'Hi-Fi Stereo',         desc: 'Crystal-clear audio engineered for every genre.' },
      { title: 'Active Noise Cancel',  desc: 'Block the world out and focus on your sound.' },
      { title: 'Up to 30h Battery',    desc: 'Bluetooth 5.3 with industry-leading battery life.' },
    ],
  },
}

const DEFAULT_CONFIG = CAT_CONFIG['power-banks']

const HERO_PILLS: Record<string, string[]> = {
  'power-banks': ['10,000 mAh', '22.5W', 'LED Display', 'Built-in Cable'],
  accessories:   ['Braided Nylon', 'USB-C', '360° Mount', 'Carabiner'],
  speakers:      ['Hi-Fi Stereo', 'ANC', '30h Battery', 'Bluetooth 5.3'],
}


// ── Hero — a fanned deck of product cards that spreads out on load ───────────
function HeroDeck({ imgs }: { imgs: string[] }) {
  const mx = useMotionValue(0)
  const spread = useSpring(useTransform(mx, [-0.5, 0.5], [0.75, 1.25]), { stiffness: 90, damping: 18 })
  const tilt = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 90, damping: 18 })
  const [hover, setHover] = useState<number | null>(null)
  const n = imgs.length

  return (
    <div className="relative flex h-[420px] items-end justify-center md:h-[580px]"
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width - 0.5) }}
      onMouseLeave={() => { mx.set(0); setHover(null) }}>
      <motion.div className="relative h-[330px] w-[240px] md:h-[460px] md:w-[340px]" style={{ rotate: tilt }}>
        {imgs.map((img, i) => {
          const offset = i - (n - 1) / 2
          return (
            <FanCard key={i} img={img} offset={offset} index={i} spread={spread}
              lifted={hover === i} onHover={() => setHover(i)} />
          )
        })}
      </motion.div>
    </div>
  )
}

function FanCard({ img, offset, index, spread, lifted, onHover }: {
  img: string; offset: number; index: number; spread: MotionValue<number>; lifted: boolean; onHover: () => void
}) {
  const rotate = useTransform(spread, (s) => offset * 14 * s)
  const x = useTransform(spread, (s) => offset * 95 * s)
  return (
    <motion.div className="absolute inset-0 origin-bottom" style={{ rotate, x, zIndex: lifted ? 20 : 10 - Math.abs(Math.round(offset)) }}
      initial={{ opacity: 0, y: 200 }}
      animate={{ opacity: 1, y: lifted ? -50 : 0 }}
      transition={{ duration: lifted ? 0.4 : 1.1, delay: lifted ? 0 : 0.3 + index * 0.1, ease: EASE }}
      onMouseEnter={onHover}>
      <div className="flex size-full items-center justify-center rounded-[2rem] bg-white p-3"
        style={{ border: `1px solid ${C.line}`, boxShadow: lifted ? '0 40px 80px rgba(28,43,40,0.22)' : '0 16px 40px rgba(28,43,40,0.10)', transition: 'box-shadow .4s' }}>
        <img src={img} alt="" draggable={false} className="size-full object-contain" />
      </div>
    </motion.div>
  )
}

// ── Bento gallery tile ────────────────────────────────────────────────────────
function GalleryTile({ item, index, big }: { item: CatImg; index: number; big: boolean }) {
  const inner = (
    <TiltCard max={8} className="group size-full rounded-[1.75rem]">
      <div className="relative size-full overflow-hidden rounded-[1.75rem]" style={{ background: index % 5 === 0 ? C.bg2 : '#fff', border: `1px solid ${C.line}` }}>
        <ImageReveal delay={(index % 4) * 0.08} className="size-full">
          <img src={item.img} alt={item.label} draggable={false} loading="lazy"
            className={`size-full object-contain transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-110 group-hover:-rotate-3 ${big ? 'p-4' : 'p-2'}`}
            style={{ filter: 'drop-shadow(0 12px 24px rgba(28,43,40,0.12))' }} />
        </ImageReveal>
        {/* label slides up on hover */}
        <div className="absolute inset-x-3 bottom-3 translate-y-[140%] rounded-2xl px-4 py-3 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0"
          style={{ background: C.dark }}>
          <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: C.sage }}>{item.sub}</p>
          <p className="text-sm font-bold text-white">{item.label}</p>
        </div>
        <span className="font-display absolute left-4 top-3 text-xs font-bold" style={{ color: C.faint }}>{String(index + 1).padStart(2, '0')}</span>
      </div>
    </TiltCard>
  )
  return (
    <div className={big ? 'col-span-2 row-span-2' : ''}>
      {item.slug ? <Link to={`/products/${item.slug}`} data-cursor="view" className="block size-full">{inner}</Link> : inner}
    </div>
  )
}

// ── Product card — image swaps, arrow chip pops in ───────────────────────────
function CatCard({ product, index = 0, fallback }: { product: Product; index?: number; fallback?: string }) {
  const img = product.images[0]?.url || fallback
  const img2 = product.images[1]?.url

  return (
    <motion.div
      initial={{ opacity: 0, y: 80, rotate: index % 2 ? 4 : -4 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.9, delay: (index % 4) * 0.08, ease: EASE }}
      className="h-full"
    >
      <Link to={`/products/${product.slug}`} data-cursor="view" className="group flex h-full flex-col">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem]" style={{ background: C.bg2 }}>
          {/* sage circle grows from the bottom on hover */}
          <span className="absolute bottom-0 left-1/2 aspect-square w-[160%] -translate-x-1/2 translate-y-full rounded-full transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-[35%]"
            style={{ background: C.sageLt }} />
          {img && (
            <img src={img} alt={product.name} loading="lazy" decoding="async"
              className={`absolute inset-0 size-full object-contain p-2 transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-110 ${img2 ? 'group-hover:opacity-0' : ''}`}
              style={{ filter: 'drop-shadow(0 12px 24px rgba(28,43,40,0.12))' }} />
          )}
          {img2 && (
            <img src={img2} alt="" loading="lazy" decoding="async"
              className="absolute inset-0 size-full scale-90 object-contain p-2 opacity-0 transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105 group-hover:opacity-100" />
          )}
          <span className="absolute right-4 top-4 flex size-10 -rotate-45 scale-0 items-center justify-center rounded-full text-white transition-transform duration-500 group-hover:rotate-0 group-hover:scale-100"
            style={{ background: C.sage }}>
            <ArrowUpRight className="size-4" />
          </span>
        </div>
        <div className="flex flex-1 flex-col px-1 pt-4">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: C.sage }}>{product.category.name}</p>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug" style={{ color: C.dark }}>{product.name}</h3>
        </div>
      </Link>
    </motion.div>
  )
}

// ── Stacking feature cards ────────────────────────────────────────────────────
function FeatureStack({ features }: { features: { title: string; desc: string }[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const palettes = [
    { bg: '#fff',  fg: C.dark, num: C.sage },
    { bg: C.sage,  fg: '#fff', num: C.dark },
    { bg: C.dark,  fg: '#fff', num: C.sage },
  ]
  return (
    <div ref={ref} className="relative">
      {features.map(({ title, desc }, i) => {
        const p = palettes[i % palettes.length]
        return (
          <StackCard key={title} i={i} total={features.length} progress={scrollYProgress}>
            <div className="flex h-full flex-col justify-between rounded-[2.5rem] p-8 md:flex-row md:items-end md:p-14"
              style={{ background: p.bg, border: `1px solid ${C.line}`, boxShadow: '0 -20px 60px rgba(28,43,40,0.08)' }}>
              <span className="font-display text-[90px] font-bold leading-none md:text-[180px]" style={{ color: p.num }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="max-w-md">
                <h3 className="font-display font-bold leading-[.95]" style={{ fontSize: 'clamp(30px, 3.6vw, 56px)', color: p.fg }}>{title}</h3>
                <p className="mt-4 text-sm leading-relaxed md:text-base" style={{ color: p.fg, opacity: 0.7 }}>{desc}</p>
              </div>
            </div>
          </StackCard>
        )
      })}
    </div>
  )
}

function StackCard({ children, i, total, progress }: { children: React.ReactNode; i: number; total: number; progress: MotionValue<number> }) {
  const scale = useTransform(progress, [i / total, 1], [1, 1 - (total - i) * 0.04])
  return (
    <div className="sticky flex h-[70vh] items-start justify-center" style={{ top: `calc(14vh + ${i * 28}px)` }}>
      <motion.div className="h-[56vh] w-full origin-top" style={{ scale }}>{children}</motion.div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const dispatch = useAppDispatch()
  const { data: catData } = useGetCategoryQuery(slug!)
  const cat = catData?.data
  const filters = useAppSelector((s) => s.search.filters)

  useEffect(() => {
    if (cat?.id) dispatch(setFilters({ categoryId: cat.id }))
  }, [cat?.id, dispatch])

  const { data, isLoading } = useGetProductsQuery(filters)
  const products = data?.data ?? []
  const meta = data?.meta

  const cfg = CAT_CONFIG[slug ?? ''] ?? DEFAULT_CONFIG
  const pills = HERO_PILLS[slug ?? ''] ?? HERO_PILLS['power-banks']
  const catImgs = CAT_IMAGES[slug ?? '']
  const heroImgs = catImgs?.hero ?? []
  const galleryPool = catImgs?.gallery.map((g) => g.img) ?? []
  const getFallback = (i: number) => galleryPool.length > 0 ? galleryPool[i % galleryPool.length] : undefined

  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(heroP, [0, 1], [0, 160])
  const heroScale = useTransform(heroP, [0, 1], [1, 0.85])

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>

      {/* ── 1. HERO ───────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative overflow-hidden pt-32" style={{ background: C.bg, minHeight: '100svh' }}>
        <Blob size={600} className="-right-40 -top-40 opacity-50" />

        <motion.div className="container relative z-10 text-center" style={{ y: heroY, scale: heroScale }}>
          <Eyebrow>{cfg.tagline}</Eyebrow>
          <h1 className="font-display mt-6 font-bold leading-[.85] tracking-tighter" style={{ fontSize: 'clamp(64px, 12vw, 190px)' }}>
            {cfg.headline.map((line, i) => (
              <span key={i} className="block" style={{ color: i % 2 ? C.sage : C.dark }}>
                <SplitText text={line} delay={0.2 + i * 0.2} stagger={0.04} />
              </span>
            ))}
          </h1>
          <motion.p className="mx-auto mt-6 max-w-md text-base leading-relaxed" style={{ color: C.muted }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7, ease: EASE }}>
            {cfg.caption}
          </motion.p>
          <motion.div className="mt-8 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.85, ease: EASE }}>
            <Btn href="#collection" onClick={(e) => { e.preventDefault(); document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }) }}>
              Browse Collection
            </Btn>
            <span className="rounded-full border px-4 py-2 text-xs font-bold" style={{ borderColor: C.line, color: C.sageDk }}>
              {meta?.total ?? products.length} products
            </span>
          </motion.div>
        </motion.div>

        {heroImgs.length > 0 && (
          <div className="relative z-10 mt-6">
            <HeroDeck imgs={heroImgs} />
            {pills.map((pill, i) => (
              <motion.span key={pill}
                className="absolute hidden rounded-full bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[.15em] shadow-lg md:block"
                style={{ color: C.sageDk, border: `1px solid ${C.line}`, ...[{ left: '12%', top: '20%' }, { right: '12%', top: '12%' }, { left: '18%', bottom: '18%' }, { right: '16%', bottom: '26%' }][i] }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
                transition={{ opacity: { delay: 1 + i * 0.1 }, scale: { delay: 1 + i * 0.1, type: 'spring' }, y: { duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' } }}>
                {pill}
              </motion.span>
            ))}
          </div>
        )}
      </section>

      {/* ── 2. MARQUEE ─────────────────────────────────────────────────── */}
      <VelocityMarquee items={cfg.marqueeItems} variant="sage" />

      {/* ── 3. BENTO COLLECTION ─────────────────────────────────────────── */}
      {catImgs && (
        <section id="collection" className="py-28" style={{ background: C.bg }}>
          <div className="container">
            <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
              <Heading eyebrow="Collection" title={cat?.name ?? (slug ?? '').replace('-', ' ')} />
              <p className="max-w-xs text-sm" style={{ color: C.muted }}>{catImgs.gallery.length} looks — hover to explore, click to shop.</p>
            </div>
            <div className="grid auto-rows-[220px] grid-cols-2 gap-4 md:auto-rows-[280px] md:grid-cols-3 xl:grid-cols-4">
              {catImgs.gallery.map((item, i) => (
                <GalleryTile key={i} item={item} index={i} big={i % 7 === 0} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 4. FEATURES — stacking cards ────────────────────────────────── */}
      <section className="pb-20" style={{ background: C.bg }}>
        <div className="container">
          <Heading eyebrow="Why 90percent" title="Built different." className="mb-6" />
          <FeatureStack features={cfg.features} />
        </div>
      </section>

      {/* ── 5. PRODUCTS GRID ─────────────────────────────────────────────── */}
      {(isLoading || products.length > 0) && (
        <section id="products" className="py-24" style={{ background: C.bg }}>
          <div className="container">
            <Heading eyebrow="Shop All" title="All Products" className="mb-14" />
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[4/5] animate-pulse rounded-[1.75rem]" style={{ background: C.bg2 }} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 items-stretch gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p, i) => (
                  <CatCard key={p.id} product={p} index={i} fallback={getFallback(i)} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="pb-16" style={{ background: C.bg }}>
          <div className="container">
            <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={(p) => dispatch(setFilters({ page: p }))} />
          </div>
        </div>
      )}

      {/* ── 6. CTA ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-32 text-center" style={{ background: C.dark }}>
        <div className="pointer-events-none absolute inset-0 flex items-center overflow-hidden">
          <span className="font-display animate-marquee whitespace-nowrap text-[18vw] font-bold leading-none" style={{ color: 'rgba(139,173,164,0.08)' }}>
            90PERCENT · 90PERCENT · 90PERCENT · 90PERCENT ·
          </span>
        </div>
        <div className="container relative z-10">
          <Heading light align="center" eyebrow="Premium Tech" title="Explore the" accent="full range." size="clamp(44px, 7vw, 110px)" />
          <Reveal delay={0.2} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Btn to="/">Back to Home</Btn>
            <Btn to="/categories/power-banks" variant="white">All Categories</Btn>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
