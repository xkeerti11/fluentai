'use client'

export default function ProgressLoading() {
  return (
    <div className="space-y-8 animate-pulse p-4 max-w-5xl mx-auto">
      {/* Level Journey Banner skeleton */}
      <div className="h-44 bg-slate-800 rounded-3xl border border-slate-700/40 p-6 flex items-center gap-6" />

      {/* Grid widgets skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-28 bg-slate-800 rounded-2xl border border-slate-700/40" />
        ))}
      </div>

      {/* Analytics grids skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-72 bg-slate-800 rounded-2xl border border-slate-700/40 p-4" />
        <div className="h-72 bg-slate-800 rounded-2xl border border-slate-700/40 p-4" />
      </div>

      {/* Lists grids skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 bg-slate-800 rounded-2xl border border-slate-700/40 p-4" />
        <div className="h-64 bg-slate-800 rounded-2xl border border-slate-700/40 p-4" />
      </div>

      {/* Achievements grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-40 bg-slate-800 rounded-2xl border border-slate-700/40" />
        ))}
      </div>
    </div>
  )
}
