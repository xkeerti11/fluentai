'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Mic, LayoutDashboard, BookOpen, CheckSquare, BarChart2, LogOut, Settings } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { LevelBadge } from '@/components/ui/Badge'
import { useAuth } from '@/hooks/useAuth'
import type { Level } from '@/types/database'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/speaking', label: 'Speaking', icon: Mic },
  { href: '/grammar', label: 'Grammar', icon: CheckSquare },
  { href: '/vocabulary', label: 'Vocabulary', icon: BookOpen },
  { href: '/progress', label: 'Progress', icon: BarChart2 },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { profile, signOut } = useAuth()

  const initials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'FL'

  return (
    <aside className="hidden lg:flex flex-col w-[240px] h-screen sticky top-0 border-r"
      style={{ background: '#0F172A', borderColor: '#334155' }}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b" style={{ borderColor: '#334155' }}>
        <span className="text-xl font-bold flex items-center gap-2" style={{ color: '#F1F5F9' }}>
          ⚡ FluentAI
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-500 rounded-none'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl mx-3'
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="px-4 py-4 border-t space-y-3" style={{ borderColor: '#334155' }}>
        {/* User info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #2563EB, #8B5CF6)' }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: '#F1F5F9' }}>
              {profile?.name ?? 'User'}
            </p>
            <LevelBadge level={(profile?.level ?? 'A0') as Level} size="sm" />
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={signOut}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150"
          style={{ color: '#94A3B8' }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#EF4444'
            e.currentTarget.style.background = 'rgba(239,68,68,0.1)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#94A3B8'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
