import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Instagram, Twitter, Youtube, ArrowUp } from 'lucide-react'
import { C, EASE, Btn, Magnetic } from '@/components/fx/primitives'
import { useLenis } from '@/components/providers/SmoothScrollProvider'
import logoPng from '../../assets/logo.png'

const LINKS = {
  Products: [
    { label: 'Power Banks', href: '/categories/power-banks' },
    { label: 'Accessories', href: '/categories/accessories' },
    { label: 'Speakers',    href: '/categories/speakers'    },
  ],
  Company: [
    { label: 'About Us',       href: '/about'   },
    { label: 'Contact',        href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms',          href: '/terms'   },
  ],
  Support: [
    { label: 'FAQ',         href: '/faq'        },
    { label: 'Track Order', href: '/track-order' },
    { label: 'Returns',     href: '/support'    },
    { label: 'Warranty',    href: '/faq#warranty' },
  ],
}

const WORD = '90PERCENT'

// Link whose text rolls up to a duplicate on hover
function RollLink({ to, children }: { to: string; children: string }) {
  return (
    <Link to={to} className="group relative block h-[1.4em] overflow-hidden text-[15px] font-medium leading-[1.4em] text-white/80">
      <span className="block transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-full">{children}</span>
      <span className="absolute left-0 top-full block text-white transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-full">{children}</span>
    </Link>
  )
}

export default function Footer() {
  const ref = useRef<HTMLElement>(null)
  const { scrollToTop } = useLenis()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const radius = useTransform(scrollYProgress, [0, 0.6], [120, 0])

  return (
    <footer ref={ref} className="relative" style={{ background: C.bg }}>
      <motion.div className="relative overflow-hidden" style={{ background: C.sage, borderTopLeftRadius: radius, borderTopRightRadius: radius }}>

        {/* CTA row */}
        <div className="container flex flex-col items-start justify-between gap-8 border-b border-white/20 py-16 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[.42em] text-white/70">90percent Store</p>
            <h3 className="font-display max-w-xl font-bold leading-[.95] tracking-tight text-white" style={{ fontSize: 'clamp(34px, 4.5vw, 64px)' }}>
              Premium tech accessories for every lifestyle.
            </h3>
          </div>
          <Btn to="/categories/power-banks" variant="white">Shop Now</Btn>
        </div>

        {/* main grid */}
        <div className="container grid grid-cols-2 gap-10 pb-10 pt-14 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="mb-5 inline-block">
              <img src={logoPng} alt="90percent" draggable={false}
                style={{ height: 72, width: 'auto', filter: 'brightness(0) invert(1)' }} />
            </Link>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-white/75">
              Compact powerbanks, premium cables, and wireless speakers built for the way you live.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Youtube].map((Icon, i) => (
                <Magnetic key={i} strength={0.5}>
                  <a href="#"
                    className="flex size-11 items-center justify-center rounded-full border border-white/40 text-white transition-all duration-300 hover:rotate-[360deg] hover:bg-white hover:text-[#8BADA4]">
                    <Icon className="size-4" />
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>

          {Object.entries(LINKS).map(([title, links], ci) => (
            <motion.div key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: ci * 0.1, ease: EASE }}>
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[.4em]" style={{ color: C.dark }}>{title}</p>
              <ul className="space-y-3">
                {links.map((l) => <li key={l.href}><RollLink to={l.href}>{l.label}</RollLink></li>)}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Giant wordmark — letters rise one by one */}
        <div className="container overflow-hidden">
          <div className="font-display flex justify-between font-bold leading-[.8] tracking-tighter text-white" style={{ fontSize: 'clamp(56px, 15.5vw, 240px)' }}>
            {WORD.split('').map((ch, i) => (
              <motion.span key={i} className="inline-block"
                initial={{ y: '100%' }}
                whileInView={{ y: '0%' }}
                viewport={{ once: true }}
                whileHover={{ y: '-12%', color: C.dark }}
                transition={{ duration: 0.9, delay: i * 0.05, ease: EASE }}>
                {ch}
              </motion.span>
            ))}
          </div>
        </div>

        <div className="container flex flex-col items-center justify-between gap-3 border-t border-white/20 py-6 sm:flex-row">
          <p className="text-xs text-white/70">© {new Date().getFullYear()} 90percent. All rights reserved.</p>
          <button onClick={scrollToTop}
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-[.25em] text-white">
            Back to top
            <span className="flex size-9 items-center justify-center rounded-full bg-white transition-transform duration-500 group-hover:-translate-y-1">
              <ArrowUp className="size-4" style={{ color: C.sage }} />
            </span>
          </button>
        </div>
      </motion.div>
    </footer>
  )
}
