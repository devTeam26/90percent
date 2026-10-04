import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const dotX = useSpring(mouseX, { stiffness: 500, damping: 28 })
  const dotY = useSpring(mouseY, { stiffness: 500, damping: 28 })

  const ringX = useSpring(mouseX, { stiffness: 60, damping: 20 })
  const ringY = useSpring(mouseY, { stiffness: 60, damping: 20 })

  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    document.body.classList.add('cursor-none-custom')

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    const onDown = () => setPressed(true)
    const onUp = () => setPressed(false)

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element
      if (target.closest('a, button, [role="button"]')) {
        setHovered(true)
      }
    }

    const onOut = (e: MouseEvent) => {
      const target = e.target as Element
      if (target.closest('a, button, [role="button"]')) {
        setHovered(false)
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('mouseover', onOver)
    window.addEventListener('mouseout', onOut)

    return () => {
      document.body.classList.remove('cursor-none-custom')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mouseout', onOut)
    }
  }, [mouseX, mouseY])

  const ringSize = hovered ? 36 : 12
  const ringBg = hovered ? 'rgba(139,173,164,0.15)' : 'rgba(0,0,0,0)'
  const scale = pressed ? 0.7 : 1

  return (
    <>
      {/* Dot */}
      <motion.div
        className="fixed pointer-events-none z-[9997]"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{ scale }}
        transition={{ duration: 0.1 }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: '#8BADA4',
          }}
        />
      </motion.div>

      {/* Ring */}
      <motion.div
        className="fixed pointer-events-none z-[9997]"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          borderRadius: '50%',
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          backgroundColor: ringBg,
          scale,
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '1.5px solid rgba(139,173,164,0.4)',
          }}
        />
      </motion.div>
    </>
  )
}
