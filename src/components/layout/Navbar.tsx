import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { Search, X, ArrowUpRight } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setMobileMenu } from '@/features/ui/store/uiSlice'
import { mockProducts } from '@/data/mockProducts'
import { C, EASE } from '@/components/fx/primitives'
import logoPng from '../../assets/logo.png'

const NAV = [
  { label: 'Power Banks', href: '/categories/power-banks' },
  { label: 'Accessories', href: '/categories/accessories' },
  { label: 'Speakers',    href: '/categories/speakers' },
]

export default function Navbar() {
  const dispatch   = useAppDispatch()
  const location   = useLocation()
  const navigate   = useNavigate()
  const mobileOpen = useAppSelector((s) => s.ui.mobileMenuOpen)
  const [scrolled, setScrolled] = useState(false)
  const [hidden,   setHidden]   = useState(false)
  const [hovered,  setHovered]  = useState<string | null>(null)
  const [query,    setQuery]    = useState('')
  const [focused,  setFocused]  = useState(false)
  const searchRef  = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLInputElement>(null)

  // Hide on scroll down, reveal on scroll up
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)
    setHidden(y > prev && y > 260)
  })

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setFocused(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Clear search + close menu on route change
  useEffect(() => {
    setQuery('')
    setFocused(false)
    dispatch(setMobileMenu(false))
  }, [location.pathname, dispatch])

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase().trim()
    return mockProducts.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 6)
  }, [query])

  const showDropdown = focused && query.trim().length > 0

  const handleSelect = (slug: string) => {
    setQuery('')
    setFocused(false)
    navigate(`/products/${slug}`)
  }

  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + '/')

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden && !mobileOpen && !focused ? -120 : 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <motion.div
          className="mx-3 mt-3 rounded-full md:mx-auto md:max-w-5xl"
          initial={{ y: -90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: EASE }}
          style={{
            background: scrolled ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(18px) saturate(160%)',
            WebkitBackdropFilter: 'blur(18px) saturate(160%)',
            border: `1px solid ${C.line}`,
            boxShadow: scrolled ? '0 12px 40px rgba(28,43,40,0.10)' : 'none',
            transition: 'background .4s, box-shadow .4s',
          }}
        >
          <div className="flex h-[62px] items-center justify-between gap-4 pl-4 pr-2">

            {/* Logo */}
            <Link to="/" className="flex shrink-0 items-center" aria-label="90percent home">
              <motion.img
                src={logoPng} alt="90percent" draggable={false}
                style={{ height: 90, width: 120, display: 'block' }}
                whileHover={{ scale: 1.06 }}
                transition={{ type: 'spring', stiffness: 300, damping: 14 }}
              />
            </Link>

            {/* Center nav — pill follows the hovered link */}
            <nav className="hidden items-center gap-1 md:flex" onMouseLeave={() => setHovered(null)}>
              {NAV.map((item) => {
                const lit = hovered ? hovered === item.href : isActive(item.href)
                return (
                  <Link key={item.href} to={item.href}
                    onMouseEnter={() => setHovered(item.href)}
                    className="relative isolate overflow-hidden rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[.2em] transition-colors duration-300"
                    style={{ color: lit ? '#fff' : C.sageDk }}
                  >
                    {lit && (
                      <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full"
                        style={{ background: C.sage }}
                        transition={{ type: 'spring', stiffness: 420, damping: 32 }} />
                    )}
                    {/* text rolls up on hover */}
                    <span className="relative block h-[1.2em] overflow-hidden leading-[1.2em]">
                      <motion.span className="block" animate={{ y: hovered === item.href ? '-50%' : '0%' }} transition={{ duration: 0.35, ease: EASE }}>
                        <span className="block">{item.label}</span>
                        <span className="block">{item.label}</span>
                      </motion.span>
                    </span>
                  </Link>
                )
              })}
            </nav>

            {/* Right — search + mobile toggle */}
            <div className="flex items-center gap-2">
              <div ref={searchRef} className="relative hidden sm:block">
                <motion.div
                  className="flex h-10 items-center gap-2 rounded-full px-4"
                  animate={{ width: focused ? 250 : 170 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                  style={{
                    background: focused ? '#fff' : 'rgba(139,173,164,0.12)',
                    border: `1.5px solid ${focused ? C.sage : 'transparent'}`,
                    boxShadow: focused ? '0 0 0 5px rgba(139,173,164,0.15)' : 'none',
                    transition: 'background .3s, border-color .3s, box-shadow .3s',
                  }}
                >
                  <motion.span animate={{ rotate: focused ? 90 : 0 }} transition={{ duration: 0.4, ease: EASE }}>
                    <Search className="size-3.5 shrink-0" style={{ color: C.sageDk }} />
                  </motion.span>
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setFocused(true)}
                    placeholder="Search products..."
                    className="min-w-0 flex-1 bg-transparent text-[12px] outline-none placeholder:text-[#5C8880]/60"
                    style={{ color: C.dark, caretColor: C.sage }}
                  />
                  {query && (
                    <button onClick={() => { setQuery(''); inputRef.current?.focus() }}>
                      <X className="size-3" style={{ color: C.sageDk }} />
                    </button>
                  )}
                </motion.div>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, clipPath: 'inset(0 0 100% 0 round 24px)' }}
                      animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0 round 24px)' }}
                      exit={{ opacity: 0, y: -6, clipPath: 'inset(0 0 100% 0 round 24px)' }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className="absolute right-0 top-full z-[100] mt-3 w-80 overflow-hidden rounded-3xl bg-white"
                      style={{ border: `1px solid ${C.line}`, boxShadow: '0 24px 60px rgba(28,43,40,0.16)' }}
                    >
                      {results.length > 0 ? (
                        <div className="p-2">
                          {results.map((p, i) => (
                            <motion.button
                              key={p.id}
                              onMouseDown={() => handleSelect(p.slug)}
                              className="group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-[#EDF3F1]"
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 + i * 0.04, ease: EASE }}
                            >
                              {p.images[0]?.url && (
                                <img src={p.images[0].url} alt={p.name}
                                  className="size-11 shrink-0 rounded-xl bg-[#EDF3F1] object-contain p-1 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110" />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: C.sage }}>{p.category.name}</p>
                                <p className="truncate text-sm font-medium" style={{ color: C.dark }}>{p.name}</p>
                              </div>
                              <ArrowUpRight className="size-4 transition-all duration-300 group-hover:rotate-45" style={{ color: C.sage }} />
                            </motion.button>
                          ))}
                        </div>
                      ) : (
                        <div className="py-8 text-center">
                          <p className="text-sm" style={{ color: C.muted }}>
                            No products found for "<strong style={{ color: C.dark }}>{query}</strong>"
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile toggle — two lines morph into an X */}
              <button
                className="relative z-[70] flex size-11 flex-col items-center justify-center gap-1.5 rounded-full md:hidden"
                style={{ background: C.sage }}
                onClick={() => dispatch(setMobileMenu(!mobileOpen))}
                aria-label="Menu"
              >
                <motion.span className="block h-[2px] w-5 rounded bg-white" animate={mobileOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }} />
                <motion.span className="block h-[2px] w-5 rounded bg-white" animate={mobileOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.header>

      {/* Mobile menu — sage sheet drops down, links rise in */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col px-6 pb-10 pt-28"
            style={{ background: C.sage }}
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="mb-6 flex h-12 items-center gap-2 rounded-full bg-white/20 px-4">
              <Search className="size-4 shrink-0 text-white/80" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-white/60"
              />
              {query && <button onClick={() => setQuery('')}><X className="size-4 text-white/80" /></button>}
            </div>

            {query.trim() && (
              <div className="mb-6 space-y-1">
                {results.length > 0 ? results.map((p) => (
                  <Link key={p.id} to={`/products/${p.slug}`}
                    onClick={() => { dispatch(setMobileMenu(false)); setQuery('') }}
                    className="flex items-center gap-3 rounded-2xl bg-white/15 px-3 py-2.5">
                    {p.images[0]?.url && <img src={p.images[0].url} alt={p.name} className="size-9 shrink-0 rounded-lg bg-white object-contain p-0.5" />}
                    <p className="truncate text-sm font-medium text-white">{p.name}</p>
                  </Link>
                )) : <p className="py-3 text-center text-xs text-white/70">No products found</p>}
              </div>
            )}

            <nav className="flex flex-col">
              {NAV.map((item, i) => (
                <div key={item.href} className="overflow-hidden border-b border-white/25">
                  <motion.div
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ delay: 0.35 + i * 0.08, duration: 0.8, ease: EASE }}
                  >
                    <Link to={item.href} onClick={() => dispatch(setMobileMenu(false))}
                      className="font-display flex items-center justify-between py-4 text-4xl font-bold tracking-tight text-white">
                      <span>{item.label}</span>
                      <span className="flex size-10 items-center justify-center rounded-full"
                        style={{ background: isActive(item.href) ? C.dark : 'rgba(255,255,255,0.2)' }}>
                        <ArrowUpRight className="size-5" />
                      </span>
                    </Link>
                  </motion.div>
                </div>
              ))}
            </nav>

            <motion.img
              src={logoPng} alt="" draggable={false}
              className="mt-auto w-40 self-start"
              style={{ filter: 'brightness(0) invert(1)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.7 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
