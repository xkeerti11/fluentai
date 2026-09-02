'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Mic, LayoutDashboard, BookOpen, CheckSquare, BarChart2, Settings, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/speaking', label: 'Speak', icon: Mic },
  { href: '/grammar', label: 'Grammar', icon: CheckSquare },
  { href: '/vocabulary', label: 'Words', icon: BookOpen },
  { href: '/verbs', label: 'Verbs', icon: Sparkles },
  { href: '/progress', label: 'Progress', icon: BarChart2 },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around h-16 px-1 lg:hidden">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href + '/'))
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 py-1.5 transition-colors",
              active ? "text-blue-400 font-bold" : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Icon size={18} className={cn(active && "text-blue-400 scale-110 transition-transform")} />
            <span className="text-[10px] font-semibold tracking-tight">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
