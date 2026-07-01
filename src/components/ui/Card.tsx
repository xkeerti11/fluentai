import { cn } from '@/lib/utils/cn'
import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  glow?: boolean
  padding?: 'sm' | 'md' | 'lg' | 'none'
}

const paddings = {
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
  none: '',
}

export function Card({
  hover = false,
  glow = false,
  padding = 'lg',
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border transition-all duration-200',
        'bg-slate-800 border-slate-700',
        hover && 'hover:border-blue-500/50 hover:-translate-y-0.5 cursor-pointer',
        glow && 'hover:shadow-[0_0_30px_rgba(37,99,235,0.15)]',
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Convenience: stat card with icon + label + value
interface StatCardProps {
  icon: string
  label: string
  value: string | number
  sublabel?: string
  className?: string
}

export function StatCard({ icon, label, value, sublabel, className }: StatCardProps) {
  return (
    <Card className={cn('flex flex-col gap-1', className)} padding="md">
      <span className="text-2xl">{icon}</span>
      <span className="text-2xl font-bold" style={{ color: '#F1F5F9' }}>{value}</span>
      <span className="text-xs font-medium" style={{ color: '#94A3B8' }}>{label}</span>
      {sublabel && (
        <span className="text-xs" style={{ color: '#475569' }}>{sublabel}</span>
      )}
    </Card>
  )
}
