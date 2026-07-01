'use client'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, RotateCcw } from 'lucide-react'

export default function GrammarError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Grammar page error caught:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl border p-8 space-y-6 shadow-2xl"
        style={{ background: '#1E293B', borderColor: '#334155' }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-100">Grammar load nahi ho paya</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Curriculum load karne mein dikkat aayi hai. Kripya reload karein.
          </p>
        </div>

        <button
          onClick={reset}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-200 active:scale-95 cursor-pointer shadow-md"
        >
          <RotateCcw size={16} />
          Reload Lessons
        </button>
      </motion.div>
    </div>
  )
}
