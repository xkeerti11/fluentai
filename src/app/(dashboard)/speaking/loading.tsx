'use client'

export default function SpeakingLoading() {
  return (
    <div className="flex flex-col h-[calc(100vh-112px)] lg:h-[calc(100vh-48px)] animate-pulse max-w-5xl mx-auto p-4 space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between py-2 border-b border-slate-800">
        <div className="h-6 w-16 bg-slate-800 rounded-lg" />
        <div className="h-6 w-32 bg-slate-800 rounded-lg" />
        <div className="h-8 w-28 bg-slate-800 rounded-xl" />
      </div>

      {/* Focus bar skeleton */}
      <div className="h-20 bg-slate-800 rounded-2xl border border-slate-700/40" />

      {/* Messages area skeleton */}
      <div className="flex-1 space-y-4 py-4 overflow-y-auto">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800" />
          <div className="space-y-1.5 w-2/3">
            <div className="h-10 bg-slate-800 rounded-2xl rounded-tl-none" />
            <div className="h-4 w-24 bg-slate-800/40 rounded-lg" />
          </div>
        </div>

        <div className="flex justify-end items-start gap-3">
          <div className="space-y-1.5 w-1/2">
            <div className="h-12 bg-slate-800 rounded-2xl rounded-tr-none" />
            <div className="h-4 w-20 bg-slate-800/40 rounded-lg right-0" />
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800" />
          <div className="space-y-1.5 w-1/3">
            <div className="h-8 bg-slate-800 rounded-2xl rounded-tl-none" />
          </div>
        </div>
      </div>

      {/* Microphone footer skeleton */}
      <div className="py-6 flex flex-col items-center border-t border-slate-800 gap-3">
        <div className="w-20 h-20 bg-slate-800 rounded-full" />
        <div className="h-4 w-32 bg-slate-800/60 rounded-lg" />
      </div>
    </div>
  )
}
