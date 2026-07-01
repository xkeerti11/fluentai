'use client'
import React, { useEffect, useState } from 'react'

interface DailyStreakInfo {
  date: string
  minutes: number
}

interface StreakCalendarProps {
  dailyStreaks?: DailyStreakInfo[]
}

export default function StreakCalendar({ dailyStreaks = [] }: StreakCalendarProps) {
  const [daysToShow, setDaysToShow] = useState(60)

  // Reduce to 30 days on mobile so grid doesn't overflow
  useEffect(() => {
    const update = () => setDaysToShow(window.innerWidth < 768 ? 30 : 60)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Generate the last N days
  const days = Array.from({ length: daysToShow }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (daysToShow - 1 - i))
    return d
  })

  const formatDateLocal = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const formatTooltipDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Get cell color based on practice time
  const getCellColor = (minutes: number) => {
    if (minutes <= 0) return '#334155' // dark gray
    if (minutes < 10) return '#93C5FD' // light blue
    if (minutes < 20) return '#3B82F6' // medium blue
    return '#1D4ED8' // dark blue
  }

  return (
    <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700 space-y-4">
      <div>
        <h4 className="text-sm font-bold text-slate-200">
          Practice Consistency (Last {daysToShow} Days)
        </h4>
        <p className="text-xs text-slate-400">Shades of blue indicate practice duration.</p>
      </div>

      {/* overflow-x-auto wrapper prevents calendar from pushing the entire page wide */}
      <div className="overflow-x-auto -mx-1 px-1">
        <div className="flex flex-wrap gap-1 md:gap-1.5 justify-center md:justify-start" style={{ minWidth: 0 }}>
          {days.map((day, idx) => {
            const dateStr = formatDateLocal(day)
            const matchedStreak = dailyStreaks.find(s => s.date === dateStr)
            const minutes = matchedStreak?.minutes ?? 0

            return (
              <div
                key={idx}
                className="w-3 h-3 md:w-4 md:h-4 rounded-sm transition-all duration-300 relative group cursor-pointer flex-shrink-0"
                style={{
                  background: getCellColor(minutes),
                  boxShadow: minutes > 0 ? `0 0 4px ${getCellColor(minutes)}` : 'none'
                }}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-10 bg-slate-950 text-slate-100 text-[10px] font-bold py-1 px-2 rounded whitespace-nowrap shadow-lg border border-slate-800">
                  {formatTooltipDate(day)}: {minutes > 0 ? `${minutes} minutes practiced` : 'No practice'}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] text-slate-400 border-t border-slate-700/50 pt-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-slate-700" />
          <span>No Practice</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-[#93C5FD]" />
          <span>&lt; 10 mins</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-[#3B82F6]" />
          <span>10 - 20 mins</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-[#1D4ED8]" />
          <span>20+ mins</span>
        </div>
      </div>
    </div>
  )
}
