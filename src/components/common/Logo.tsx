import { cn } from '@/lib/utils'
import logoPng from '../../assets/logo.png'

const SIZES = {
  sm : 32,
  md : 40,
  lg : 48,
  xl : 60,
} as const

interface LogoProps {
  size?     : keyof typeof SIZES
  className?: string
}

/** Full logo — light backgrounds: sage green on white */
export function Logo({ size = 'md', className }: LogoProps) {
  const h = SIZES[size]
  return (
    <img
      src={logoPng}
      alt="90percent"
      draggable={false}
      className={cn('shrink-0 block', className)}
      style={{ height: h, width: 'auto' }}
    />
  )
}

/** Logo for dark / gradient backgrounds — inverted to full white */
export function LogoWhite({ size = 'md', className }: LogoProps) {
  const h = SIZES[size]
  return (
    <img
      src={logoPng}
      alt="90percent"
      draggable={false}
      className={cn('shrink-0 block', className)}
      style={{ height: h, width: 'auto', filter: 'brightness(0) invert(1)' }}
    />
  )
}

/** Square icon mark — for collapsed admin sidebar only */
export function LogoMark({
  size      = 36,
  className,
}: {
  size?     : number
  className?: string
}) {
  return (
    <div
      className={cn('shrink-0 flex items-center justify-center select-none', className)}
      aria-label="90percent"
      style={{
        width        : size,
        height       : size,
        borderRadius : size * 0.26,
        background   : '#8BADA4',
        color        : '#fff',
        fontWeight   : 900,
        fontSize     : size * 0.42,
        fontFamily   : 'system-ui, -apple-system, sans-serif',
        letterSpacing: '-0.04em',
        lineHeight   : 1,
        flexShrink   : 0,
      }}
    >
      90
    </div>
  )
}
