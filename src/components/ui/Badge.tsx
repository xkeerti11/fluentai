import { cn } from '@/lib/utils/cn'
import { getLevelColor } from '@/lib/utils/levelCalc'
import type { Level } from '@/types/database'

interface BadgeProps {
  label: string
  variant?: 'default' | 'level' | 'success' | 'warning' | 'error' | 'ai'
  size?: 'sm' | 'md'
  className?: string
}

const variants = {
  default: 'bg-slate-700 text-slate-300',
  success: 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50',
  warning: 'bg-amber-900/60 text-amber-300 border border-amber-700/50',
  error: 'bg-red-900/60 text-red-300 border border-red-700/50',
  ai: 'bg-purple-900/60 text-purple-300 border border-purple-700/50',
  level: '', // Handled by getLevelColor
}

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
}

export function Badge({
  label,
  variant = 'default',
  size = 'md',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {label}
    </span>
  )
}

// Level-specific badge (A0, A1, A2, etc.)
interface LevelBadgeProps {
  level: Level
  size?: 'sm' | 'md'
  className?: string
}

export function LevelBadge({ level, size = 'md', className }: LevelBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-bold rounded-full',
        getLevelColor(level),
        sizes[size],
        className
      )}
    >
      {level}
    </span>
  )
}
