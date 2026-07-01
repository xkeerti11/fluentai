'use client'
import { motion } from 'framer-motion'
import { Mic } from 'lucide-react'

export default function RootLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#0F172A' }}>
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-20 h-20 rounded-full bg-blue-600/10 border border-blue-500/20 blur-xl"
        />
        <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-blue-600 to-purple-600 shadow-[0_0_30px_rgba(37,99,235,0.3)]">
          <Mic size={28} className="text-white animate-pulse" />
        </div>
      </div>
      <p className="text-sm font-semibold text-slate-400 mt-2">FluentAI load ho raha hai...</p>
    </div>
  )
}
