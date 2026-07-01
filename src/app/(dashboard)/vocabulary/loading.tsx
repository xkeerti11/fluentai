'use client'

export default function VocabularyLoading() {
  return (
    <div className="space-y-8 animate-pulse p-4 max-w-5xl mx-auto">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-2">
          <div className="h-8 w-56 bg-slate-800 rounded-xl" />
          <div className="h-4 w-72 bg-slate-800/60 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-slate-800 rounded-xl" />
          <div className="h-9 w-24 bg-slate-800 rounded-xl" />
        </div>
      </div>

      {/* Tabs list skeleton */}
      <div className="flex gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start w-72">
        <div className="h-10 w-full bg-slate-800 rounded-lg" />
      </div>

      {/* Large flashcard container skeleton */}
      <div className="h-96 bg-slate-800 rounded-2xl border border-slate-700/40 p-6 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-700 rounded-lg" />
          <div className="h-5 w-48 bg-slate-700/60 rounded-lg" />
        </div>
        <div className="flex justify-center items-center">
          <div className="w-full max-w-sm h-48 bg-slate-900/50 rounded-2xl border border-slate-800" />
        </div>
        <div className="space-y-3 max-w-sm mx-auto w-full">
          <div className="flex gap-3">
            <div className="h-10 w-1/2 bg-slate-700 rounded-xl" />
            <div className="h-10 w-1/2 bg-slate-700 rounded-xl" />
          </div>
          <div className="flex justify-between items-center px-1">
            <div className="h-4 w-20 bg-slate-700/40 rounded-lg" />
            <div className="h-4 w-24 bg-slate-700/40 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
