import { motion } from 'framer-motion'
import { Shield, Cpu, Smartphone, Users } from 'lucide-react'
import PageHero from '@/components/fx/PageHero'
import { C, EASE, Counter, TiltCard, Heading, VelocityMarquee } from '@/components/fx/primitives'

const STATS = [
  { label: 'Satisfied Customers', value: '1M+',  icon: Users      },
  { label: 'Devices Sold',        value: '5M+',  icon: Smartphone },
  { label: 'Countries Shipped',   value: '40+',  icon: Shield     },
  { label: 'Years of Innovation', value: '10+',  icon: Cpu        },
]

const VALUES = [
  {
    title: 'Innovation First',
    body:  'We design every product from the ground up — pushing the boundaries of what technology can do for everyday life.',
  },
  {
    title: 'Built to Last',
    body:  'Premium materials, rigorous quality control, and a two-year warranty on every device we make.',
  },
  {
    title: 'Global Service',
    body:  'Official service centers in 40+ countries, with same-day support for all 90percent products.',
  },
]

export default function AboutPage() {
  return (
    <div style={{ background: C.bg }}>
      <PageHero
        eyebrow="Our Story"
        title="About"
        accent="90percent."
        sub="We are a technology company that designs, engineers, and manufactures premium devices — from smartphones and laptops to audio gear and wearables."
      />

      {/* Stats */}
      <section className="container py-16">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map(({ label, value, icon: Icon }, i) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 60, rotate: i % 2 ? 5 : -5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.1, ease: EASE }}>
              <TiltCard className="rounded-[2rem]">
                <div className="group flex aspect-square flex-col justify-between rounded-[2rem] p-6"
                  style={{ background: i === 1 ? C.sage : i === 2 ? C.dark : '#fff', border: `1px solid ${C.line}` }}>
                  <div className="flex size-12 items-center justify-center rounded-full transition-transform duration-700 group-hover:rotate-[360deg]"
                    style={{ background: i === 1 || i === 2 ? 'rgba(255,255,255,0.15)' : C.bg2 }}>
                    <Icon className="size-5" style={{ color: i === 1 || i === 2 ? '#fff' : C.sage }} />
                  </div>
                  <div>
                    <p className="font-display text-5xl font-bold md:text-6xl" style={{ color: i === 1 || i === 2 ? '#fff' : C.dark }}>
                      <Counter value={value} />
                    </p>
                    <p className="mt-1 text-sm" style={{ color: i === 1 || i === 2 ? 'rgba(255,255,255,0.75)' : C.muted }}>{label}</p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      <VelocityMarquee items={VALUES.map((v) => v.title)} variant="sage" />

      {/* Values */}
      <section className="container py-24">
        <Heading eyebrow="Values" title="What drives us" className="mb-12" />
        <div className="border-t" style={{ borderColor: C.line }}>
          {VALUES.map(({ title, body }, i) => (
            <motion.div key={title}
              className="group relative grid gap-4 overflow-hidden border-b py-10 md:grid-cols-[120px_1fr_1.4fr] md:items-center"
              style={{ borderColor: C.line }}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}>
              <span className="absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-y-100" style={{ background: C.sage }} />
              <span className="font-display relative px-4 text-sm font-bold transition-colors group-hover:text-white" style={{ color: C.sage }}>0{i + 1}</span>
              <h3 className="font-display relative px-4 text-3xl font-bold transition-all duration-500 group-hover:translate-x-3 group-hover:text-white md:text-4xl" style={{ color: C.dark }}>{title}</h3>
              <p className="relative px-4 text-sm leading-relaxed transition-colors group-hover:text-white/85" style={{ color: C.muted }}>{body}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
