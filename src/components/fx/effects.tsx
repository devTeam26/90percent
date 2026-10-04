import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { C, EASE } from './primitives'
import logoPng from '../../assets/logo.png'

const coarse = () => window.matchMedia('(pointer: coarse)').matches

// ════════════════════════════════════════════════════════════════════════════
// Cursor — sage dot + lagging ring; grows into a "View" bubble over links
// ════════════════════════════════════════════════════════════════════════════
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [enabled] = useState(() => !coarse())
  const [mode, setMode] = useState<'idle' | 'link' | 'view'>('idle')

  useEffect(() => {
    if (!enabled) return
    document.body.classList.add('cursor-none-custom')
    const pos = { x: -100, y: -100 }, lag = { x: -100, y: -100 }
    let raf = 0, down = false

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX; pos.y = e.clientY
      const t = e.target as Element
      if (t.closest?.('[data-cursor="view"]')) setMode('view')
      else if (t.closest?.('a, button, [role="button"], input, textarea')) setMode('link')
      else setMode('idle')
    }
    const onDown = () => { down = true }
    const onUp = () => { down = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    const loop = () => {
      lag.x += (pos.x - lag.x) * 0.15
      lag.y += (pos.y - lag.y) * 0.15
      const s = down ? 0.75 : 1
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px,${pos.y}px,0) translate(-50%,-50%) scale(${s})`
      if (ring.current) ring.current.style.transform = `translate3d(${lag.x}px,${lag.y}px,0) translate(-50%,-50%) scale(${s})`
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => {
      cancelAnimationFrame(raf)
      document.body.classList.remove('cursor-none-custom')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [enabled])

  if (!enabled) return null
  const size = mode === 'view' ? 84 : mode === 'link' ? 48 : 30
  return (
    <>
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[9999] size-1.5 rounded-full"
        style={{ background: C.dark, opacity: mode === 'view' ? 0 : 1 }} />
      <div ref={ring} className="pointer-events-none fixed left-0 top-0 z-[9998] flex items-center justify-center rounded-full"
        style={{
          width: size, height: size,
          border: `1.5px solid ${C.sage}`,
          background: mode === 'view' ? C.sage : mode === 'link' ? 'rgba(139,173,164,0.18)' : 'transparent',
          transition: 'width .35s cubic-bezier(.16,1,.3,1), height .35s cubic-bezier(.16,1,.3,1), background .3s',
        }}>
        <span className="text-[10px] font-bold uppercase tracking-[.2em] text-white transition-opacity duration-200"
          style={{ opacity: mode === 'view' ? 1 : 0 }}>View</span>
      </div>
    </>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Curtain transition — staggered sage panels sweep across on route change
// ════════════════════════════════════════════════════════════════════════════
const PANELS = 5
export function CurtainTransition() {
  const { pathname } = useLocation()
  const [key, setKey] = useState<string | null>(null)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) { first.current = false; return }
    setKey(pathname)
    const t = setTimeout(() => setKey(null), 1300)
    return () => clearTimeout(t)
  }, [pathname])

  return (
    <AnimatePresence>
      {key && (
        <motion.div key={key} className="pointer-events-none fixed inset-0 z-[9990] flex" exit={{ opacity: 0 }}>
          {Array.from({ length: PANELS }).map((_, i) => (
            <motion.div
              key={i}
              className="h-full flex-1"
              style={{ background: i % 2 ? C.sage : C.sageDk, transformOrigin: 'top' }}
              initial={{ scaleY: 1 }}
              animate={{ scaleY: 0 }}
              transition={{ duration: 0.8, delay: 0.25 + i * 0.06, ease: [0.76, 0, 0.24, 1] }}
            />
          ))}
          <motion.img
            src={logoPng} alt="" draggable={false}
            className="absolute left-1/2 top-1/2 w-64 -translate-x-1/2 -translate-y-1/2"
            style={{ filter: 'brightness(0) invert(1)' }}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.45, delay: 0.15, ease: EASE }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Scroll progress bar
// ════════════════════════════════════════════════════════════════════════════
export function ScrollBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  return (
    <motion.div className="fixed left-0 right-0 top-0 z-[60] h-[3px] origin-left"
      style={{ scaleX, background: C.sage }} />
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Page enter — content rises in after the curtain
// ════════════════════════════════════════════════════════════════════════════
export function PageEnter({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.45, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
