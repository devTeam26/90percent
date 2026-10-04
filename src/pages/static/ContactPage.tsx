import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Mail, Phone, MapPin } from 'lucide-react'
import PageHero from '@/components/fx/PageHero'
import { C, EASE, Btn, Reveal } from '@/components/fx/primitives'

const INFO = [
  { icon: Mail,   label: 'Email',   val: 'support@90percent.com' },
  { icon: Phone,  label: 'Phone',   val: '+1 (800) 123-4567' },
  { icon: MapPin, label: 'Address', val: '123 Commerce St, NY 10001' },
]

// Input with a floating label and a line that draws in on focus
function Field({ label, type = 'text', textarea }: { label: string; type?: string; textarea?: boolean }) {
  const [focus, setFocus] = useState(false)
  const [val, setVal] = useState('')
  const up = focus || val.length > 0
  const common = {
    value: val, required: true,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setVal(e.target.value),
    onFocus: () => setFocus(true), onBlur: () => setFocus(false),
    className: 'w-full resize-none bg-transparent pb-3 pt-6 text-base outline-none',
    style: { color: C.dark },
  }
  return (
    <label className="relative block">
      <motion.span className="pointer-events-none absolute left-0 origin-left font-medium"
        animate={{ y: up ? 0 : 24, scale: up ? 0.75 : 1, color: focus ? C.sage : C.faint }}
        transition={{ duration: 0.3, ease: EASE }}>{label}</motion.span>
      {textarea ? <textarea rows={4} {...common} /> : <input type={type} {...common} />}
      <span className="absolute bottom-0 left-0 h-px w-full" style={{ background: C.line }} />
      <motion.span className="absolute bottom-0 left-0 h-[2px] w-full origin-left" style={{ background: C.sage }}
        animate={{ scaleX: focus ? 1 : 0 }} transition={{ duration: 0.5, ease: EASE }} />
    </label>
  )
}

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  return (
    <div style={{ background: C.bg }}>
      <PageHero eyebrow="Get in touch" title="Contact" accent="Us." />

      <div className="container grid gap-12 pb-28 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-3">
          {INFO.map(({ icon: Icon, label, val }, i) => (
            <Reveal key={label} delay={i * 0.1}>
              <div className="group flex items-center gap-4 rounded-[1.75rem] bg-white p-5 transition-colors duration-500 hover:bg-[#8BADA4]"
                style={{ border: `1px solid ${C.line}` }}>
                <div className="flex size-12 items-center justify-center rounded-full transition-all duration-500 group-hover:rotate-12 group-hover:bg-white"
                  style={{ background: C.bg2 }}>
                  <Icon className="size-5" style={{ color: C.sage }} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest transition-colors group-hover:text-white/75" style={{ color: C.faint }}>{label}</p>
                  <p className="font-semibold transition-colors group-hover:text-white" style={{ color: C.dark }}>{val}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <form className="space-y-6 rounded-[2.5rem] bg-white p-8 md:p-10" style={{ border: `1px solid ${C.line}` }}
            onSubmit={async (e) => { e.preventDefault(); setLoading(true); await new Promise(r => setTimeout(r, 1000)); setLoading(false); toast.success('Message sent!') }}>
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Your name" />
              <Field label="Your email" type="email" />
            </div>
            <Field label="Subject" />
            <Field label="Your message…" textarea />
            <Btn type="submit" disabled={loading} className="w-full">{loading ? 'Sending…' : 'Send Message'}</Btn>
          </form>
        </Reveal>
      </div>
    </div>
  )
}
