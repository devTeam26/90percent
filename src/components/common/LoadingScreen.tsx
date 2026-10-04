import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import logoPng from '../../assets/logo.png'

interface LoadingScreenProps {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let current = 0
    const interval = setInterval(() => {
      const increment = Math.random() * 12 + 3
      current = Math.min(100, current + increment)
      setProgress(Math.floor(current))
      if (current >= 100) {
        clearInterval(interval)
        setTimeout(onComplete, 300)
      }
    }, 60)
    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#F7FAF9]">
      {/* sage fill rises with progress */}
      <motion.div
        className="absolute inset-x-0 bottom-0 bg-[#8BADA4]"
        animate={{ height: `${progress}%` }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      />

      <div className="relative flex h-full flex-col items-center justify-center">
        <motion.img
          src={logoPng} alt="90percent" draggable={false}
          style={{ height: 90, width: 'auto', filter: progress > 52 ? 'brightness(0) invert(1)' : 'none', transition: 'filter .4s' }}
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <div className="font-display absolute bottom-8 right-8 text-[18vw] font-bold leading-none tabular-nums md:text-[12vw]"
        style={{ color: progress > 12 ? '#fff' : '#1C2B28', transition: 'color .3s' }}>
        {progress}%
      </div>
    </div>
  )
}
