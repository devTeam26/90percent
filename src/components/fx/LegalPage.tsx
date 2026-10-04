import { useState } from 'react'
import { motion } from 'framer-motion'
import PageHero from './PageHero'
import { C, EASE } from './primitives'

/** Legal/document layout: sticky table of contents that tracks the section in view. */
export default function LegalPage({ title, accent, updated, sections }: {
  title: string; accent: string; updated: string; sections: { h: string; p: string }[]
}) {
  const [active, setActive] = useState(0)
  return (
    <div style={{ background: C.bg }}>
      <PageHero eyebrow={`Last updated: ${updated}`} title={title} accent={accent} />
      <div className="container grid gap-12 pb-28 lg:grid-cols-[260px_1fr]">
        <nav className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
          {sections.map((s, i) => (
            <a key={s.h} href={`#s${i}`}
              onClick={(e) => { e.preventDefault(); document.getElementById(`s${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }}
              className="relative block py-2 pl-5 text-sm font-medium transition-colors"
              style={{ color: active === i ? C.dark : C.faint }}>
              {active === i && (
                <motion.span layoutId="legal-bar" className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full" style={{ background: C.sage }} />
              )}
              {s.h.replace(/^\d+\.\s*/, '')}
            </a>
          ))}
        </nav>

        <div className="space-y-4">
          {sections.map((s, i) => (
            <motion.section key={s.h} id={`s${i}`}
              className="rounded-[2rem] bg-white p-8 md:p-10"
              style={{ border: `1px solid ${active === i ? C.sage : C.line}`, transition: 'border-color .4s' }}
              initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              onViewportEnter={() => setActive(i)}
              transition={{ duration: 0.8, ease: EASE }}>
              <h2 className="font-display mb-3 text-2xl font-bold md:text-3xl" style={{ color: C.dark }}>
                <span style={{ color: C.sage }}>{s.h.match(/^\d+/)?.[0]}.</span> {s.h.replace(/^\d+\.\s*/, '')}
              </h2>
              <p className="leading-relaxed" style={{ color: C.muted }}>{s.p}</p>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  )
}
