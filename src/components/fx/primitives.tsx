import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  motion, useInView, useMotionValue, useSpring, useTransform, useMotionTemplate,
  useScroll, useVelocity, useAnimationFrame,
} from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export const EASE = [0.16, 1, 0.3, 1] as const

// ── Brand palette (logo sage on white) ──────────────────────────────────────
export const C = {
  bg:     '#F7FAF9',
  bg2:    '#EDF3F1',
  white:  '#FFFFFF',
  sage:   '#8BADA4',
  sageLt: '#CFE0DB',
  sageDk: '#5C8880',
  forest: '#3D6862',
  dark:   '#1C2B28',
  muted:  'rgba(28,43,40,0.55)',
  faint:  'rgba(28,43,40,0.3)',
  line:   'rgba(139,173,164,0.25)',
}

// ── SplitText: each letter slides up from behind a mask ─────────────────────
export function SplitText({
  text, className, charClassName, style, delay = 0, stagger = 0.03, inView = false,
}: {
  text: string; className?: string; charClassName?: string; style?: React.CSSProperties
  delay?: number; stagger?: number; inView?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const seen = useInView(ref, { once: true, margin: '-60px' })
  const go = inView ? seen : true
  let idx = 0
  return (
    <span ref={ref} className={cn('inline-block', className)} style={style} aria-label={text}>
      {text.split(' ').map((word, wi, words) => (
        <span key={wi} className="inline-flex overflow-hidden whitespace-nowrap pb-[0.08em] align-bottom" aria-hidden>
          {word.split('').map((ch, ci) => {
            const i = idx++
            return (
              <motion.span
                key={ci}
                className={cn('inline-block', charClassName)}
                initial={{ y: '110%', rotate: 8 }}
                animate={go ? { y: '0%', rotate: 0 } : undefined}
                transition={{ duration: 0.9, delay: delay + i * stagger, ease: EASE }}
              >
                {ch}
              </motion.span>
            )
          })}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  )
}

// ── Counter: animates numbers inside a string (e.g. "10,000 mAh") ───────────
export function Counter({ value, className, style, duration = 1.6 }: {
  value: string; className?: string; style?: React.CSSProperties; duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const seen = useInView(ref, { once: true })
  const match = value.match(/[\d,.]+/)
  const target = match ? parseFloat(match[0].replace(/,/g, '')) : 0
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!seen || !match) return
    let raf = 0
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / (duration * 1000))
      setN(target * (1 - Math.pow(1 - p, 4)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!match) return <span ref={ref} className={className} style={style}>{value}</span>
  const hasComma = match[0].includes(',')
  const shown = hasComma ? Math.round(n).toLocaleString('en-US') : String(Math.round(n))
  return <span ref={ref} className={className} style={style}>{value.replace(match[0], shown)}</span>
}

// ── Reveal: lifts in with a clip-path wipe ──────────────────────────────────
export function Reveal({ children, delay = 0, y = 50, className, style }: {
  children: React.ReactNode; delay?: number; y?: number; className?: string; style?: React.CSSProperties
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y, clipPath: 'inset(0 0 100% 0)' }}
      whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

// ── ImageReveal: a sage panel slides off to uncover the content ─────────────
export function ImageReveal({ children, delay = 0, className, from = 'left' }: {
  children: React.ReactNode; delay?: number; className?: string; from?: 'left' | 'bottom'
}) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <motion.div
        initial={{ scale: 1.25 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 1.4, delay, ease: EASE }}
        className="size-full"
      >
        {children}
      </motion.div>
      <motion.div
        className="absolute inset-0 z-10"
        style={{ background: C.sage, transformOrigin: from === 'left' ? 'right' : 'top' }}
        initial={{ [from === 'left' ? 'scaleX' : 'scaleY']: 1 }}
        whileInView={{ [from === 'left' ? 'scaleX' : 'scaleY']: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 1.1, delay, ease: [0.76, 0, 0.24, 1] }}
      />
    </div>
  )
}

// ── Eyebrow: small label with a drawing line ────────────────────────────────
export function Eyebrow({ children, className, color = C.sage, light = false }: {
  children: React.ReactNode; className?: string; color?: string; light?: boolean
}) {
  return (
    <p className={cn('inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[.42em]', className)}
      style={{ color: light ? 'rgba(255,255,255,0.75)' : color }}>
      <motion.span
        className="block h-[2px] w-8 origin-left rounded-full"
        style={{ background: light ? '#fff' : color }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE }}
      />
      {children}
    </p>
  )
}

// ── Magnetic: element leans toward the cursor ───────────────────────────────
export function Magnetic({ children, strength = 0.3, className }: {
  children: React.ReactNode; strength?: number; className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useSpring(0, { stiffness: 200, damping: 14, mass: 0.4 })
  const y = useSpring(0, { stiffness: 200, damping: 14, mass: 0.4 })
  return (
    <motion.div
      ref={ref}
      className={cn('inline-block', className)}
      style={{ x, y }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
    >
      {children}
    </motion.div>
  )
}

// ── Btn: magnetic pill with a fill that floods in from the cursor ───────────
type BtnProps = {
  children: React.ReactNode
  variant?: 'solid' | 'outline' | 'dark' | 'white'
  className?: string
  to?: string
  href?: string
  onClick?: (e: React.MouseEvent) => void
  type?: 'button' | 'submit'
  disabled?: boolean
  arrow?: boolean
}
const BTN_STYLES = {
  solid:   { base: { background: C.sage, color: '#fff' },                                wipe: C.dark,  hover: '#fff' },
  dark:    { base: { background: C.dark, color: '#fff' },                                wipe: C.sage,  hover: '#fff' },
  outline: { base: { background: 'transparent', color: C.dark, border: `1.5px solid ${C.sage}` }, wipe: C.sage, hover: '#fff' },
  white:   { base: { background: '#fff', color: C.dark },                                wipe: C.sage,  hover: '#fff' },
}
export function Btn({ children, variant = 'solid', className, to, href, onClick, type = 'button', disabled, arrow = true }: BtnProps) {
  const s = BTN_STYLES[variant]
  const [hover, setHover] = useState(false)
  const setOrigin = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--wx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--wy', `${e.clientY - r.top}px`)
  }
  const props = {
    className: cn(
      'wipe-btn inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold tracking-wide transition-colors duration-300 active:scale-95',
      disabled && 'opacity-50 pointer-events-none', className,
    ),
    style: { ...s.base, color: hover ? s.hover : s.base.color, borderColor: hover ? s.wipe : undefined },
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => { setOrigin(e); setHover(true) },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => { setOrigin(e); setHover(false) },
    onClick,
  }
  const inner = (
    <>
      <span className="wipe" style={{ background: s.wipe }} />
      {children}
      {arrow && <ArrowUpRight className="arrow size-4" />}
    </>
  )
  return (
    <Magnetic>
      {to ? <Link to={to} {...props}>{inner}</Link>
        : href ? <a href={href} {...props}>{inner}</a>
        : <button type={type} disabled={disabled} {...props}>{inner}</button>}
    </Magnetic>
  )
}

// ── TiltCard: 3D tilt with a soft light glare ───────────────────────────────
export function TiltCard({ children, className, style, max = 12, glare = true }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties; max?: number; glare?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 160, damping: 16 })
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 160, damping: 16 })
  const gx = useTransform(px, (v) => `${v * 100}%`)
  const gy = useTransform(py, (v) => `${v * 100}%`)
  const shine = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.55), transparent 50%)`
  const [hover, setHover] = useState(false)

  return (
    <motion.div
      ref={ref}
      className={cn('relative', className)}
      style={{ ...style, rotateX: rx, rotateY: ry, transformPerspective: 1000, transformStyle: 'preserve-3d' }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect()
        px.set((e.clientX - r.left) / r.width)
        py.set((e.clientY - r.top) / r.height)
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); px.set(0.5); py.set(0.5) }}
    >
      {children}
      {glare && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: shine }}
          animate={{ opacity: hover ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  )
}

// ── VelocityMarquee: speeds up and skews with scroll velocity ───────────────
export function VelocityMarquee({ items, baseVelocity = -2, className, variant = 'light' }: {
  items: string[]; baseVelocity?: number; className?: string; variant?: 'light' | 'sage' | 'dark'
}) {
  const { scrollY } = useScroll()
  const vel = useVelocity(scrollY)
  const smooth = useSpring(vel, { damping: 50, stiffness: 400 })
  const factor = useTransform(smooth, [-1500, 0, 1500], [-4, 0, 4], { clamp: false })
  const skew = useTransform(smooth, [-2000, 0, 2000], [-8, 0, 8])
  const base = useMotionValue(0)
  const dir = useRef(1)

  useAnimationFrame((_, delta) => {
    let move = dir.current * baseVelocity * (delta / 1000)
    const f = factor.get()
    if (f < 0) dir.current = -1
    else if (f > 0) dir.current = 1
    move += dir.current * move * f
    // keep within (-50%, 0] — the row is rendered twice so this loops seamlessly
    base.set((((base.get() + move) % 50) - 50) % 50)
  })
  const x = useTransform(base, (v) => `${v}%`)

  const pal = {
    light: { bg: C.bg2,  text: C.dark, dot: C.sage },
    sage:  { bg: C.sage, text: '#fff', dot: C.dark },
    dark:  { bg: C.dark, text: '#fff', dot: C.sage },
  }[variant]

  return (
    <div className={cn('overflow-hidden py-5', className)} style={{ background: pal.bg }}>
      <motion.div className="flex w-max whitespace-nowrap" style={{ x, skewX: skew }}>
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center gap-10 pr-10">
            {items.map((t, i) => (
              <span key={i} className="font-display flex items-center gap-10 text-2xl font-bold uppercase tracking-tight md:text-4xl"
                style={{ color: pal.text }}>
                <span className={i % 2 ? 'opacity-40' : ''}>{t}</span>
                <svg viewBox="0 0 24 24" className="size-5 md:size-6" style={{ color: pal.dot }}>
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" />
                  <circle cx="12" cy="12" r="4" fill="currentColor" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// ── Blob: slowly morphing sage shape used behind products ───────────────────
export function Blob({ size = 520, color = C.sageLt, className, style }: {
  size?: number; color?: string; className?: string; style?: React.CSSProperties
}) {
  return (
    <div className={cn('animate-morph pointer-events-none absolute', className)}
      style={{ width: size, height: size, background: color, ...style }} />
  )
}

// ── Section heading used across pages ───────────────────────────────────────
export function Heading({ eyebrow, title, accent, className, align = 'left', light = false, size = 'clamp(38px, 5.5vw, 80px)', accentColor = C.sage }: {
  eyebrow: string; title: string; accent?: string; className?: string; align?: 'left' | 'center'; light?: boolean; size?: string; accentColor?: string
}) {
  return (
    <div className={cn(align === 'center' && 'text-center', className)}>
      <Eyebrow light={light}>{eyebrow}</Eyebrow>
      <h2 className="font-display mt-5 font-bold leading-[.92] tracking-tight"
        style={{ fontSize: size, color: light ? '#fff' : C.dark }}>
        <SplitText text={title} inView />
        {accent && <><br /><SplitText text={accent} inView delay={0.15} style={{ color: accentColor }} /></>}
      </h2>
    </div>
  )
}
