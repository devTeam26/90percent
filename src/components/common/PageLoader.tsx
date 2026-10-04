import { motion } from 'framer-motion'

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F7FAF9]">
      <div className="flex items-end gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            className="block w-2 rounded-full bg-[#8BADA4]"
            animate={{ height: [10, 40, 10] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </div>
  )
}
