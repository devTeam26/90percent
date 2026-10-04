import { useState } from 'react'
import { Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHero from '@/components/fx/PageHero'
import { C, EASE } from '@/components/fx/primitives'

const FAQS = [
  { q: 'How long does shipping take?', a: 'Standard shipping: 5-7 business days. Express: 1-2 business days. Free standard shipping on orders over $50.' },
  { q: 'What is your return policy?', a: 'We offer 30-day hassle-free returns. Items must be in original condition and packaging.' },
  { q: 'How do I track my order?', a: 'Once shipped, you\'ll receive a tracking number via email. You can also track via your account orders page.' },
  { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, Amex, PayPal, Apple Pay, Google Pay, and bank transfers.' },
  { q: 'Can I change or cancel my order?', a: 'Orders can be modified or cancelled within 1 hour of placing. After that, we may not be able to make changes.' },
  { q: 'How do I contact customer support?', a: 'Email us at support@90percent.com, call +1 (800) 123-4567, or use live chat. Available 24/7.' },
]

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div style={{ background: C.bg }}>
      <PageHero eyebrow="Help Center" title="Frequently" accent="Asked." />
      <div className="container max-w-4xl pb-28">
        {FAQS.map((faq, i) => {
          const isOpen = open === i
          return (
            <motion.div key={i} className="border-b" style={{ borderColor: C.line }}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}>
              <button className="group flex w-full items-center justify-between gap-6 py-7 text-left" onClick={() => setOpen(isOpen ? null : i)}>
                <span className="flex items-baseline gap-5">
                  <span className="font-display text-sm font-bold" style={{ color: C.sage }}>0{i + 1}</span>
                  <span className="font-display text-xl font-bold transition-transform duration-500 group-hover:translate-x-2 md:text-3xl" style={{ color: C.dark }}>{faq.q}</span>
                </span>
                <motion.span className="flex size-11 shrink-0 items-center justify-center rounded-full"
                  animate={{ rotate: isOpen ? 135 : 0, background: isOpen ? C.sage : C.bg2 }}
                  transition={{ duration: 0.5, ease: EASE }}>
                  <Plus className="size-5" style={{ color: isOpen ? '#fff' : C.sage }} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }} className="overflow-hidden">
                    <motion.p className="pb-8 pl-10 text-base leading-relaxed md:pl-12" style={{ color: C.muted }}
                      initial={{ y: -10 }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
                      {faq.a}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
