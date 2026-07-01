'use client'

export default function GrammarLoading() {
  return (
    <div className="space-y-8 animate-pulse p-4 max-w-5xl mx-auto">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-2">
          <div className="h-8 w-60 bg-slate-800 rounded-xl" />
          <div className="h-4 w-80 bg-slate-800/60 rounded-lg" />
        </div>
        <div className="h-10 w-36 bg-slate-800 rounded-xl" />
      </div>

      {/* Level Filters Skeleton */}
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map(i => (
          <div key={i} className="h-9 w-16 bg-slate-800 rounded-xl" />
        ))}
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-32 bg-slate-800 rounded-2xl border border-slate-700/40 p-5 space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-1.5 w-2/3">
                <div className="h-5 w-40 bg-slate-700 rounded-lg" />
                <div className="h-4 w-28 bg-slate-700/60 rounded-lg" />
              </div>
              <div className="h-6 w-12 bg-slate-700 rounded-full" />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div className="h-4 w-24 bg-slate-700/40 rounded-lg" />
              <div className="h-7 w-20 bg-slate-700 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
