import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  motion, AnimatePresence,
  useScroll, useTransform,
  useMotionValue, useSpring, useMotionTemplate, useMotionValueEvent,
} from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import {
  C, EASE, SplitText, Counter, Reveal, Eyebrow, Btn, TiltCard, VelocityMarquee, Blob, Heading,
} from '@/components/fx/primitives'

// PFM10M — compact powerbank (4 colours)
import pfm_purple from '@powerbank/PFM10M/1.png'
import pfm_pink   from '@powerbank/PFM10M/3.png'
import pfm_white  from '@powerbank/PFM10M/4.png'
import pfm_blue   from '@powerbank/PFM10M/5.png'

// PRX10M — black compact
import prx_black from '@powerbank/PRX10M/1.png'

// PCN10M / PCN20M — built-in cable powerbank
import pcn_angle   from '@powerbank/PCN10M/3.png'
import pcn20_front from '@powerbank/PCN20M/1.png'

// PVS — travel powerbank
import pvs20 from '@powerbank/PVS20M/1.png'

// Car mounts
import mount_v from '@/assets/accessories/DVM101/BO-ZJ101.png'
import mount_f from '@/assets/accessories/FMG360/BO-ZJ114.png'

// Speakers / earbuds
import spk_a  from '@speakers/speakers-12.png'
import spk_b  from '@speakers/speakers-13.png'

// ── Hero colour variants ──────────────────────────────────────────────────────
const HUES = [
  { img: pfm_purple, name: 'Violet', dot: '#C4A8D8', accent: 'rgba(196,168,216,0.28)', slug: 'pfm10m-powerbank-violet' },
  { img: pfm_pink,   name: 'Rose',   dot: '#F2A0B8', accent: 'rgba(242,160,184,0.28)', slug: 'pfm10m-powerbank-rose' },
  { img: pfm_white,  name: 'Cloud',  dot: '#AABFBB', accent: 'rgba(139,173,164,0.28)', slug: 'pfm10m-powerbank-cloud' },
  { img: pfm_blue,   name: 'Sky',    dot: '#88B8D8', accent: 'rgba(136,184,216,0.28)', slug: 'pfm10m-powerbank-sky' },
]

const TICKER = [
  '10,000 mAh', 'FAST CHARGE', 'LED DISPLAY', 'BUILT-IN CABLE',
  'POCKET SIZE', 'USB-C & LIGHTNING', 'WRIST STRAP', '22.5W OUTPUT',
  'TYPE-C INPUT', 'DUAL PORTS', 'DIGITAL DISPLAY', 'PREMIUM BRAID',
]

// ══════════════════════════════════════════════════════════════════════════════
// HERO — layered giant type with the product floating through it
// ══════════════════════════════════════════════════════════════════════════════
function Hero() {
  const [hue, setHue] = useState(0)
  const navigate = useNavigate()
  const ref = useRef<HTMLElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 70, damping: 18 })
  const sy = useSpring(my, { stiffness: 70, damping: 18 })
  const imgX = useTransform(sx, [-0.5, 0.5], [-30, 30])
  const imgY = useTransform(sy, [-0.5, 0.5], [-24, 24])
  const rotY = useTransform(sx, [-0.5, 0.5], [-14, 14])
  const rotX = useTransform(sy, [-0.5, 0.5], [10, -10])
  const backX = useTransform(sx, [-0.5, 0.5], [24, -24])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 0.7])
  const imgRot = useTransform(scrollYProgress, [0, 1], [0, -25])
  const textY = useTransform(scrollYProgress, [0, 1], [0, 180])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // auto-cycle colours until the user picks one
  const [auto, setAuto] = useState(true)
  useEffect(() => {
    if (!auto) return
    const id = setInterval(() => setHue((h) => (h + 1) % HUES.length), 3800)
    return () => clearInterval(id)
  }, [auto])

  return (
    <section ref={ref}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
      style={{ background: C.bg }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width - 0.5)
        my.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onMouseLeave={() => { mx.set(0); my.set(0) }}>


      {/* colour wash */}
      <AnimatePresence>
        <motion.div key={hue} className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}
          style={{ background: `radial-gradient(circle at 50% 55%, ${HUES[hue].accent} 0%, transparent 55%)` }} />
      </AnimatePresence>

      {/* Layered giant words */}
      <motion.div className="font-display pointer-events-none absolute inset-0 flex flex-col justify-center px-4 md:px-10"
        style={{ y: textY, opacity: fade }}>
        <motion.div style={{ x: backX }} className="font-bold leading-[.82] tracking-tighter" >
          <div style={{ fontSize: 'clamp(72px, 17vw, 270px)', color: C.dark }}>
            <SplitText text="Pocket" delay={0.4} stagger={0.05} />
          </div>
          <div className="text-right" style={{ fontSize: 'clamp(72px, 17vw, 270px)' }}>
            <SplitText text="Power." delay={0.6} stagger={0.05} className="text-outline-sage" />
          </div>
          <div className="text-center" style={{ fontSize: 'clamp(72px, 17vw, 270px)', color: C.sage }}>
            <SplitText text="Pro." delay={0.8} stagger={0.05} />
          </div>
        </motion.div>
      </motion.div>

      {/* Product */}
      <motion.div className="relative z-10" style={{ scale: imgScale, rotate: imgRot }}>
        <Blob size={620} color={C.sageLt} className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70" />
        <motion.button
          data-cursor="view"
          aria-label={`View ${HUES[hue].name} power bank`}
          onClick={() => navigate(`/products/${HUES[hue].slug}`)}
          className="relative block"
          style={{ x: imgX, y: imgY, rotateX: rotX, rotateY: rotY, transformPerspective: 900 }}
          initial={{ opacity: 0, scale: 0.4, rotate: -40 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.4, delay: 0.5, ease: EASE }}>
          <AnimatePresence mode="popLayout">
            <motion.img key={hue}
              src={HUES[hue].img} alt="PocketPow Pro" draggable={false}
              className="h-[58vh] w-auto max-w-[92vw] object-contain md:h-[82vh]"
              style={{ filter: `drop-shadow(0 40px 60px ${HUES[hue].dot}80)` }}
              initial={{ opacity: 0, x: 160, rotate: 25, scale: 0.7 }}
              animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, x: -160, rotate: -25, scale: 0.7 }}
              transition={{ duration: 0.8, ease: EASE }} />
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* Bottom bar: copy, swatches, CTA */}
      <motion.div className="container absolute inset-x-0 bottom-6 z-20 flex flex-col gap-5 md:bottom-10 md:flex-row md:items-end md:justify-between"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1.2, ease: EASE }}>
        <div className="max-w-xs">
          <Eyebrow>90percent · PowerBank</Eyebrow>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: C.muted }}>
            10,000 mAh in your palm. Fast charge, LED display, premium build — in four stunning colourways.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-white/80 p-1.5 shadow-lg backdrop-blur" style={{ border: `1px solid ${C.line}` }}>
          {HUES.map((h, i) => (
            <button key={i} onClick={() => { setHue(i); setAuto(false) }}
              className="relative flex items-center gap-2 rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-[.18em]"
              style={{ color: i === hue ? '#fff' : C.sageDk }}>
              {i === hue && (
                <motion.span layoutId="hue-pill" className="absolute inset-0 rounded-full" style={{ background: C.dark }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
              )}
              <span className="relative size-3 rounded-full ring-2 ring-white" style={{ background: h.dot }} />
              <span className="relative hidden sm:inline">{h.name}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Btn to="/categories/accessories">Buy Now</Btn>
          <Btn to="/products" variant="outline" arrow={false}>All products</Btn>
        </div>
      </motion.div>

      <motion.div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
        <span className="text-[10px] font-bold uppercase tracking-[.4em] [writing-mode:vertical-rl]" style={{ color: C.sage }}>Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <ArrowDown className="size-4" style={{ color: C.sage }} />
        </motion.div>
      </motion.div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// CABLE — pinned section: words light up and the product spins as you scroll
// ══════════════════════════════════════════════════════════════════════════════
const CABLE_WORDS = ['Never', 'carry', 'another', 'cable.']

function ScrubWord({ word, i, total, progress }: { word: string; i: number; total: number; progress: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  const start = 0.05 + (i / total) * 0.45
  const opacity = useTransform(progress, [start, start + 0.12], [0.12, 1])
  const x = useTransform(progress, [start, start + 0.12], [-40, 0])
  return (
    <motion.span className="block" style={{ opacity, x, color: i === 2 ? C.sage : C.dark, fontStyle: i === 2 ? 'italic' : 'normal' }}>
      {word}
    </motion.span>
  )
}

function CableSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const rot = useTransform(scrollYProgress, [0, 1], [-30, 20])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1.05, 0.9])
  const backRot = useTransform(scrollYProgress, [0, 1], [30, -10])
  const backX = useTransform(scrollYProgress, [0, 1], [200, -40])
  const chipsOpacity = useTransform(scrollYProgress, [0.5, 0.65], [0, 1])
  const chipsY = useTransform(scrollYProgress, [0.5, 0.65], [30, 0])
  const circle = useTransform(scrollYProgress, [0, 0.6], [0, 1])
  const circlePath = useMotionTemplate`circle(${useTransform(circle, [0, 1], [8, 75])}% at 70% 50%)`

  return (
    <section ref={ref} className="relative" style={{ height: '260vh', background: C.bg }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* sage disc expands behind product */}
        <motion.div className="pointer-events-none absolute inset-0" style={{ background: C.bg2, clipPath: circlePath }} />

        <div className="container relative z-10 grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow>Built-in Cable · PCN Series</Eyebrow>
            <h2 className="font-display mt-6 font-bold leading-[.86] tracking-tight" style={{ fontSize: 'clamp(54px, 8vw, 120px)' }}>
              {CABLE_WORDS.map((w, i) => (
                <ScrubWord key={w} word={w} i={i} total={CABLE_WORDS.length} progress={scrollYProgress} />
              ))}
            </h2>
            <motion.div style={{ opacity: chipsOpacity, y: chipsY }}>
              <p className="mt-8 max-w-sm text-sm leading-relaxed" style={{ color: C.muted }}>
                Lightning + USB-C cables built right in. Fold flat, charge instantly.
                22.5W output — one device, all connections.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['22.5W Output', 'Built-in Lightning', 'Built-in USB-C', '10,000 mAh'].map((s) => (
                  <span key={s} className="rounded-full border px-4 py-1.5 text-[10px] font-bold uppercase tracking-[.15em]"
                    style={{ borderColor: C.sage, color: C.sageDk, background: '#fff' }}>{s}</span>
                ))}
              </div>
              <div className="mt-8"><Btn to="/categories/accessories">Shop Now</Btn></div>
            </motion.div>
          </div>

          <div className="relative flex h-[50vh] items-center justify-center lg:h-[70vh]">
            <motion.div className="absolute right-0 top-0" style={{ rotate: backRot, x: backX }}>
              <Link to="/products/pcn20m-powerbank-dual-cable-20k" data-cursor="view" className="block">
                <img src={pcn20_front} alt="PCN20M" draggable={false} className="w-[260px] object-contain opacity-60 md:w-[460px]" />
              </Link>
            </motion.div>
            <motion.div style={{ rotate: rot, scale }} className="relative z-10">
              <Link to="/products/pcn10m-powerbank-built-in-cable" data-cursor="view" className="block">
                <img src={pcn_angle} alt="PCN10M" draggable={false}
                  className="w-[360px] object-contain md:w-[660px]"
                  style={{ filter: 'drop-shadow(0 30px 50px rgba(28,43,40,0.2))' }} />
              </Link>
            </motion.div>
            <motion.div className="absolute bottom-6 left-0 z-20 rounded-3xl bg-white px-5 py-4 shadow-xl"
              style={{ border: `1px solid ${C.line}`, opacity: chipsOpacity }}
              animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
              <p className="font-display text-2xl font-bold" style={{ color: C.dark }}>2-in-1</p>
              <p className="text-[9px] font-bold uppercase tracking-[.15em]" style={{ color: C.sage }}>Cables Built-in</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// COLOURS — 3D rotating carousel; the front colour floods the section
// ══════════════════════════════════════════════════════════════════════════════
function ColourCollection() {
  const [active, setActive] = useState(0)
  const [radius, setRadius] = useState(340)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const onResize = () => setRadius(window.innerWidth < 640 ? 170 : window.innerWidth < 1024 ? 260 : 340)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setActive((a) => a + 1), 3000)
    return () => clearInterval(id)
  }, [paused])

  const front = ((active % HUES.length) + HUES.length) % HUES.length
  const step = 360 / HUES.length

  return (
    <section className="relative overflow-hidden py-28" style={{ background: C.bg }}>
      <motion.div className="pointer-events-none absolute inset-0"
        animate={{ background: `radial-gradient(circle at 50% 60%, ${HUES[front].accent} 0%, transparent 60%)` }}
        transition={{ duration: 1 }} />

      <div className="container relative z-10">
        <Heading eyebrow="Four Colours · One Power" title="Make It" accent="Yours." align="center" />

        <div className="relative mx-auto mt-10 flex h-[460px] items-center justify-center md:h-[640px]"
          style={{ perspective: 1400 }}
          onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <motion.div className="relative h-[320px] w-[230px] md:h-[480px] md:w-[340px]"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateY: -active * step }}
            transition={{ duration: 1.1, ease: EASE }}>
            {HUES.map((h, i) => {
              const isFront = i === front
              return (
                <div key={i} className="absolute inset-0"
                  style={{ transform: `rotateY(${i * step}deg) translateZ(${radius}px)`, backfaceVisibility: 'hidden' }}>
                  <Link to={`/products/${h.slug}`} data-cursor="view"
                    onClick={(e) => { if (!isFront) { e.preventDefault(); setActive(active + ((i - front + HUES.length) % HUES.length)) } }}
                    className="flex size-full flex-col items-center justify-center rounded-[2rem] bg-white transition-shadow duration-500"
                    style={{ border: `1px solid ${C.line}`, boxShadow: isFront ? `0 30px 80px ${h.dot}66` : '0 10px 30px rgba(28,43,40,0.06)' }}>
                    <img src={h.img} alt={h.name} draggable={false} className="h-[85%] w-auto object-contain"
                      style={{ filter: `drop-shadow(0 20px 30px ${h.dot}66)` }} />
                    <div className="mt-2 flex items-center gap-2">
                      <span className="size-2.5 rounded-full" style={{ background: h.dot }} />
                      <span className="text-sm font-bold" style={{ color: C.dark }}>{h.name}</span>
                    </div>
                  </Link>
                </div>
              )
            })}
          </motion.div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-8">
          <div className="flex gap-3">
            {HUES.map((h, i) => (
              <button key={i} aria-label={h.name}
                onClick={() => setActive(active + ((i - front + HUES.length) % HUES.length))}
                className="h-2 rounded-full transition-all duration-500"
                style={{ width: i === front ? 40 : 10, background: i === front ? h.dot : C.sageLt }} />
            ))}
          </div>
          <Btn to="/categories/accessories">Shop All Colours</Btn>
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// SPEAKERS — sage panel grows to full-bleed; live equaliser
// ══════════════════════════════════════════════════════════════════════════════
function SpeakersSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] })
  const inset = useTransform(scrollYProgress, [0, 1], [6, 0])
  const radius = useTransform(scrollYProgress, [0, 1], [48, 0])
  const clip = useMotionTemplate`inset(0 ${inset}% round ${radius}px)`

  return (
    <section ref={ref} style={{ background: C.bg }}>
      <motion.div className="relative overflow-hidden" style={{ background: C.sage, clipPath: clip }}>
        {/* equaliser bars */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-2/3 items-end justify-between gap-1 px-2 opacity-25">
          {Array.from({ length: 48 }).map((_, i) => (
            <span key={i} className="block flex-1 origin-bottom rounded-t-full bg-white"
              style={{ height: `${30 + ((i * 37) % 70)}%`, animation: `eq-bar ${0.8 + (i % 7) * 0.17}s ease-in-out ${(i % 5) * 0.1}s infinite` }} />
          ))}
        </div>

        <div className="container relative z-10 grid items-center gap-10 py-28 lg:grid-cols-2">
          <div>
            <Heading light eyebrow="Speakers · Audio" title="Advanced Sound" accent="Design Technology" size="clamp(38px, 5vw, 76px)" accentColor={C.dark} />
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/85">
                Hi-fi stereo, active noise cancellation, and up to 30 hours of
                wireless playback. Built for every moment.
              </p>
              <div className="mt-8"><Btn to="/categories/speakers" variant="white">Explore Speakers</Btn></div>
            </Reveal>
          </div>

          <div className="relative h-[460px] md:h-[600px]">
            {[
              { img: spk_b, alt: 'SoundPod Air+', slug: 'soundpod-elite-earphones-double-usb-c-white', pos: 'left-0 top-0', rot: -12, w: 'w-[280px] md:w-[400px]', d: 0 },
              { img: spk_a, alt: 'SoundPod Air',  slug: 'soundpod-elite-earphones-double-usb-c-black', pos: 'right-0 bottom-0', rot: 10, w: 'w-[310px] md:w-[440px]', d: 0.2 },
            ].map((s) => (
              <motion.div key={s.alt} className={`absolute ${s.pos}`}
                initial={{ opacity: 0, scale: 0.5, rotate: s.rot * 3 }}
                whileInView={{ opacity: 1, scale: 1, rotate: s.rot }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: s.d, ease: EASE }}>
                <TiltCard className="rounded-[2rem]">
                  <Link to={`/products/${s.slug}`} data-cursor="view" className="block rounded-[2rem] bg-white/95 p-4 shadow-2xl">
                    <motion.img src={s.img} alt={s.alt} draggable={false} className={`${s.w} object-contain`}
                      animate={{ y: [0, -12, 0] }} transition={{ duration: 4 + s.d * 5, repeat: Infinity, ease: 'easeInOut' }} />
                  </Link>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MOUNTS — pinned horizontal scroll track
// ══════════════════════════════════════════════════════════════════════════════
const MOUNT_SPECS = [
  { label: 'Rotation', val: '360°' },
  { label: 'Install',  val: 'Tool-free' },
  { label: 'Magnetic', val: 'Yes' },
  { label: 'Devices',  val: 'All phones' },
]
const MOUNTS = [
  { img: mount_v, name: 'DashPod',  sub: 'Vertical Mount', slug: 'dvm101-magnetic-vent-car-mount' },
  { img: mount_f, name: 'FlexDash', sub: 'Flat Dashboard', slug: 'fmg360-magnetic-dashboard-car-mount' },
]

function MountsSection() {
  const ref = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [dist, setDist] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist])
  const xs = useSpring(x, { stiffness: 120, damping: 28 })
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1])

  useEffect(() => {
    const measure = () => setDist(Math.max(0, (track.current?.scrollWidth ?? 0) - window.innerWidth))
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return (
    <section ref={ref} className="relative" style={{ height: '320vh', background: C.bg }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div ref={track} className="flex w-max items-center gap-6 px-6 md:gap-10 md:px-16" style={{ x: xs }}>
          {/* intro panel */}
          <div className="w-[85vw] shrink-0 md:w-[44vw]">
            <Eyebrow>Car Mounts</Eyebrow>
            <h2 className="font-display mt-6 font-bold leading-[.86] tracking-tight" style={{ fontSize: 'clamp(54px, 8vw, 128px)', color: C.dark }}>
              Your<br />drive.<br /><span style={{ color: C.sage }}>Elevated.</span>
            </h2>
            <p className="mt-7 max-w-sm text-sm leading-relaxed" style={{ color: C.muted }}>
              Magnetic precision mounts designed for every dashboard.
              360° rotation, tool-free install, and a grip that holds through every turn.
            </p>
            <div className="mt-8"><Btn to="/categories/accessories">Shop Mounts</Btn></div>
          </div>

          {/* mount cards */}
          {MOUNTS.map((m, i) => (
            <TiltCard key={m.name} className="shrink-0 rounded-[2.5rem]">
              <Link to={`/products/${m.slug}`} data-cursor="view"
                className="relative flex h-[62vh] w-[78vw] flex-col justify-between overflow-hidden rounded-[2.5rem] p-8 md:w-[34vw]"
                style={{ background: i ? C.sage : '#fff', border: `1px solid ${C.line}` }}>
                <span className="font-display text-[22vh] font-bold leading-none opacity-10" style={{ color: i ? '#fff' : C.sage }}>0{i + 1}</span>
                <img src={m.img} alt={m.name} draggable={false}
                  className="absolute left-1/2 top-1/2 h-[80%] w-auto -translate-x-1/2 -translate-y-1/2 object-contain"
                  style={{ filter: 'drop-shadow(0 24px 40px rgba(28,43,40,0.2))' }} />
                <div className="relative">
                  <p className="font-display text-3xl font-bold" style={{ color: i ? '#fff' : C.dark }}>{m.name}</p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[.25em]" style={{ color: i ? 'rgba(255,255,255,0.8)' : C.sage }}>{m.sub}</p>
                </div>
              </Link>
            </TiltCard>
          ))}

          {/* spec tiles */}
          <div className="grid w-[78vw] shrink-0 grid-cols-2 gap-4 md:w-[36vw]">
            {MOUNT_SPECS.map(({ label, val }, i) => (
              <div key={label} className="flex aspect-square flex-col justify-between rounded-[2rem] p-6"
                style={{ background: i % 3 === 0 ? C.dark : '#fff', border: `1px solid ${C.line}` }}>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: i % 3 === 0 ? C.sage : C.faint }}>{label}</p>
                <p className="font-display text-2xl font-bold md:text-4xl" style={{ color: i % 3 === 0 ? '#fff' : C.dark }}>
                  <Counter value={val} />
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* progress line */}
        <div className="absolute bottom-10 left-6 right-6 h-[2px] rounded-full md:left-16 md:right-16" style={{ background: C.sageLt }}>
          <motion.div className="h-full origin-left rounded-full" style={{ scaleX: bar, background: C.sage }} />
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MIDNIGHT — dark stage; cursor is a spotlight that reveals the product
// ══════════════════════════════════════════════════════════════════════════════
function BlackEdition() {
  const ref = useRef<HTMLElement>(null)
  const sx = useMotionValue(-999)
  const sy = useMotionValue(-999)
  const ssx = useSpring(sx, { stiffness: 140, damping: 20 })
  const ssy = useSpring(sy, { stiffness: 140, damping: 20 })
  const mask = useMotionTemplate`radial-gradient(circle 260px at ${ssx}px ${ssy}px, #000 0%, #000 40%, transparent 100%)`
  const glow = useMotionTemplate`radial-gradient(circle 420px at ${ssx}px ${ssy}px, rgba(139,173,164,0.28), transparent 70%)`

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], [80, -80])
  const [lit, setLit] = useState(false)
  useMotionValueEvent(scrollYProgress, 'change', (v) => { if (v > 0.35 && !lit) setLit(true) })

  return (
    <section ref={ref} className="relative overflow-hidden" style={{ background: C.dark, minHeight: '100vh' }}
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); sx.set(e.clientX - r.left); sy.set(e.clientY - r.top) }}
      onMouseLeave={() => { sx.set(-999); sy.set(-999) }}>
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: glow }} />

      <div className="container relative z-10 grid min-h-screen items-center gap-12 py-24 lg:grid-cols-2">
        <div>
          <Heading light eyebrow="PRX10M · Limited" title="Midnight." accent="Edition." size="clamp(54px, 8vw, 120px)" />
          <Reveal delay={0.2}>
            <p className="mt-7 max-w-xs text-sm leading-relaxed text-white/60">
              Stealth matte finish. Built-in smart cable. LED digital display.
              Everything in one — nothing to carry extra.
            </p>
            <div className="mt-9"><Btn to="/categories/accessories">Explore</Btn></div>
            <p className="mt-6 text-[10px] font-bold uppercase tracking-[.3em] text-white/30">Move your cursor to light it up</p>
          </Reveal>
        </div>

        <motion.div className="relative flex justify-center" style={{ y: imgY }}>
          <Link to="/products/prx10m-powerbank-midnight-black" data-cursor="view" className="relative block">
            {/* dim base layer */}
            <img src={prx_black} alt="PRX10M Black" draggable={false}
              className="w-[380px] object-contain md:w-[700px]"
              style={{ filter: lit ? 'brightness(0.55)' : 'brightness(0.2)', transition: 'filter 1.5s' }} />
          </Link>
        </motion.div>
      </div>

      {/* bright layer revealed by the spotlight (full-section mask) */}
      <motion.div className="pointer-events-none absolute inset-0 z-20 hidden lg:block" style={{ WebkitMaskImage: mask, maskImage: mask }}>
        <div className="container grid min-h-screen items-center gap-12 py-24 lg:grid-cols-2">
          <div />
          <motion.div className="flex justify-center" style={{ y: imgY }}>
            <img src={prx_black} alt="" draggable={false} className="w-[700px] object-contain"
              style={{ filter: 'brightness(1.25) drop-shadow(0 0 60px rgba(139,173,164,0.6))' }} />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// FINAL CTA — scroll-scrubbed 0 → 90% counter
// ══════════════════════════════════════════════════════════════════════════════
function OrderCTA() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const pct = useTransform(scrollYProgress, [0.1, 1], [0, 90])
  const [n, setN] = useState(0)
  useMotionValueEvent(pct, 'change', (v) => setN(Math.max(0, Math.round(v))))
  const fill = useTransform(scrollYProgress, [0.1, 1], ['0%', '90%'])
  const leftX = useTransform(scrollYProgress, [0, 1], [-200, 0])
  const rightX = useTransform(scrollYProgress, [0, 1], [200, 0])
  const sideRot = useTransform(scrollYProgress, [0, 1], [-40, -8])
  const sideRot2 = useTransform(scrollYProgress, [0, 1], [40, 10])

  return (
    <section ref={ref} className="relative flex min-h-screen items-center justify-center overflow-hidden py-24 text-center" style={{ background: C.bg }}>
      <motion.img src={pvs20} alt="" draggable={false} className="pointer-events-none absolute left-[-4%] top-1/2 hidden w-[440px] -translate-y-1/2 opacity-80 lg:block"
        style={{ x: leftX, rotate: sideRot }} />
      <motion.img src={pfm_purple} alt="" draggable={false} className="pointer-events-none absolute right-[-4%] top-1/2 hidden w-[420px] -translate-y-1/2 opacity-80 lg:block"
        style={{ x: rightX, rotate: sideRot2 }} />

      <div className="container relative z-10">
        <Eyebrow>90percent · Premium Tech</Eyebrow>

        <div className="font-display relative mx-auto mt-6 font-bold leading-none tracking-tighter tabular-nums"
          style={{ fontSize: 'clamp(110px, 24vw, 380px)', color: C.sage }}>
          {n}%
        </div>
        {/* battery bar */}
        <div className="mx-auto mt-2 h-4 w-[min(520px,80vw)] rounded-full p-[3px]" style={{ border: `2px solid ${C.dark}` }}>
          <motion.div className="h-full rounded-full" style={{ width: fill, background: C.sage }} />
        </div>

        <h2 className="font-display mt-10 font-bold leading-[.9] tracking-tight" style={{ fontSize: 'clamp(44px, 7vw, 110px)' }}>
          <motion.span className="block" style={{ x: leftX, color: C.dark }}>POWER</motion.span>
          <motion.span className="block" style={{ x: rightX, color: C.sage }}>EVERYTHING.</motion.span>
        </h2>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-8 max-w-md text-[15px] leading-relaxed" style={{ color: C.muted }}>
            Powerbanks, cables, and accessories built for the way you live.
            Premium. Compact. Always ready.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Btn to="/categories/accessories" className="px-12 py-4">Shop Now</Btn>
            <Btn to="/products" variant="outline" className="px-12 py-4">All Products</Btn>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div style={{ background: C.bg }}>
      <Hero />
      <VelocityMarquee items={TICKER} variant="sage" />
      <CableSection />
      <ColourCollection />
      <SpeakersSection />
      <MountsSection />
      <BlackEdition />
      <VelocityMarquee items={TICKER.slice().reverse()} variant="light" baseVelocity={2} />
      <OrderCTA />
    </div>
  )
}
