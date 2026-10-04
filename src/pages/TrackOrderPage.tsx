import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, Truck, CheckCircle, MapPin } from 'lucide-react'
import PageHero from '@/components/fx/PageHero'
import { C, EASE, Btn, Reveal } from '@/components/fx/primitives'

const STAGES = [
  { icon: Package,     label: 'Ordered' },
  { icon: Truck,       label: 'Shipped' },
  { icon: MapPin,      label: 'Out for delivery' },
  { icon: CheckCircle, label: 'Delivered' },
]

export default function TrackOrderPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>()
  const [input, setInput] = useState(orderNumber ?? '')
  const [focus, setFocus] = useState(false)

  return (
    <div style={{ background: C.bg }}>
      <PageHero eyebrow="Order Status" title="Track Your" accent="Order." />

      <div className="container max-w-3xl pb-28">
        <Reveal>
          <form className="flex flex-col gap-3 rounded-full bg-white p-2 sm:flex-row sm:items-center"
            style={{ border: `1.5px solid ${focus ? C.sage : C.line}`, boxShadow: focus ? '0 0 0 6px rgba(139,173,164,0.15)' : 'none', transition: 'all .3s' }}
            onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-1 items-center gap-3 px-4">
              <Package className="size-5 shrink-0" style={{ color: C.sage }} />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
                placeholder="Enter order number or tracking ID"
                className="h-12 w-full bg-transparent text-base outline-none placeholder:text-[#1C2B28]/30"
                style={{ color: C.dark }}
              />
            </div>
            <Btn type="submit">Track</Btn>
          </form>
        </Reveal>

        {/* Journey preview — a truck drives along the route */}
        <Reveal delay={0.15} className="mt-10">
          <div className="rounded-[2.5rem] bg-white p-8 md:p-12" style={{ border: `1px solid ${C.line}` }}>
            <div className="relative">
              <div className="absolute left-[12%] right-[12%] top-6 h-[3px] rounded-full" style={{ background: C.bg2 }} />
              <motion.div className="absolute left-[12%] top-6 h-[3px] rounded-full" style={{ background: C.sage }}
                animate={{ width: ['0%', '76%', '76%', '0%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', times: [0, 0.6, 0.9, 1] }} />
              <div className="relative grid grid-cols-4">
                {STAGES.map(({ icon: Icon, label }, i) => (
                  <div key={label} className="flex flex-col items-center gap-3 text-center">
                    <motion.div className="flex size-12 items-center justify-center rounded-full"
                      animate={{ background: [C.bg2, C.sage, C.sage, C.bg2], scale: [1, 1.15, 1, 1] }}
                      transition={{ duration: 6, repeat: Infinity, times: [i * 0.15, i * 0.15 + 0.05, 0.9, 1], ease: EASE }}>
                      <Icon className="size-5" style={{ color: C.dark }} />
                    </motion.div>
                    <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.muted }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-10 text-center text-sm" style={{ color: C.muted }}>
              Enter your order number above to track your shipment.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
