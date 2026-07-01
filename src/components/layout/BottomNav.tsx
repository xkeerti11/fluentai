'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Mic, LayoutDashboard, BookOpen, CheckSquare, BarChart2, Settings } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/speaking', label: 'Speak', icon: Mic },
  { href: '/grammar', label: 'Grammar', icon: CheckSquare },
  { href: '/vocabulary', label: 'Words', icon: BookOpen },
  { href: '/progress', label: 'Progress', icon: BarChart2 },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 flex items-center justify-around h-16 px-2 md:hidden">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 py-2 hover:text-white active:text-blue-400 transition-colors",
              active ? "text-blue-400" : "text-slate-400"
            )}
          >
            <Icon size={20} />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
