'use client'

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse p-4 max-w-5xl mx-auto">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-800 rounded-xl" />
          <div className="h-4 w-64 bg-slate-800/60 rounded-lg" />
        </div>
        <div className="h-10 w-24 bg-slate-800 rounded-xl" />
      </div>

      {/* Main card skeleton */}
      <div className="h-48 bg-slate-800 rounded-3xl border border-slate-700/50" />

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-44 bg-slate-800 rounded-2xl border border-slate-700/50 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-6 w-24 bg-slate-700 rounded-lg" />
              <div className="h-8 w-8 bg-slate-700 rounded-full" />
            </div>
            <div className="h-4 w-full bg-slate-700/50 rounded-lg" />
            <div className="h-4 w-2/3 bg-slate-700/30 rounded-lg" />
            <div className="h-10 w-full bg-slate-700/70 rounded-xl mt-2" />
          </div>
        ))}
      </div>
    </div>
  )
}
