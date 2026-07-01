'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center text-center px-4"
      style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative space-y-6 max-w-md w-full"
      >
        {/* Emoji */}
        <motion.div
          initial={{ scale: 0.5, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="text-7xl select-none"
        >
          🤔
        </motion.div>

        {/* 404 heading */}
        <div className="space-y-2">
          <h1 className="text-6xl font-black" style={{ color: '#F1F5F9' }}>
            404
          </h1>
          <h2 className="text-xl font-bold" style={{ color: '#94A3B8' }}>
            Page nahi mili!
          </h2>
          <p className="text-sm" style={{ color: '#475569' }}>
            Ye page exist nahi karta. Shayad tum galat jagah aa gaye!
          </p>
        </div>

        {/* Divider */}
        <div className="w-16 h-0.5 mx-auto rounded-full" style={{ background: '#334155' }} />

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard">
            <button
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all active:scale-95 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #2563EB, #8B5CF6)' }}
            >
              <Home size={16} />
              Dashboard Pe Jao
            </button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all active:scale-95 cursor-pointer border"
            style={{ color: '#94A3B8', borderColor: '#334155', background: 'transparent' }}
          >
            <ArrowLeft size={16} />
            Wapas Jao
          </button>
        </div>

        {/* Brand */}
        <p className="text-xs font-bold tracking-wider" style={{ color: '#334155' }}>
          ⚡ FluentAI
        </p>
      </motion.div>
    </main>
  )
}
