import { motion } from 'framer-motion'
import { C, EASE, SplitText, Eyebrow, Blob } from './primitives'

/** Shared header for simple content pages — big split title over a morphing blob. */
export default function PageHero({ eyebrow, title, accent, sub }: {
  eyebrow: string; title: string; accent?: string; sub?: string
}) {
  return (
    <section className="relative overflow-hidden pb-16 pt-36" style={{ background: C.bg }}>
      <Blob size={460} className="-right-32 -top-24 opacity-60" />
      <div className="container relative z-10">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="font-display mt-6 font-bold leading-[.88] tracking-tighter" style={{ fontSize: 'clamp(52px, 9vw, 140px)', color: C.dark }}>
          <SplitText text={title} delay={0.2} />
          {accent && <><br /><SplitText text={accent} delay={0.4} style={{ color: C.sage }} /></>}
        </h1>
        {sub && (
          <motion.p className="mt-6 max-w-xl text-base leading-relaxed md:text-lg" style={{ color: C.muted }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7, ease: EASE }}>
            {sub}
          </motion.p>
        )}
      </div>
    </section>
  )
}
