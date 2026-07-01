'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, BookOpen } from 'lucide-react'
import type { GrammarNote } from '@/types/chat'

interface GrammarCardProps {
  grammarNote: GrammarNote
}

export function GrammarCard({ grammarNote }: GrammarCardProps) {
  const [expanded, setExpanded] = useState(false)

  if (!grammarNote.has_error) return null

  return (
    <div className="rounded-xl overflow-hidden border"
      style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.2)' }}>

      {/* Header (always visible) */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-3 py-2 text-left"
      >
        <div className="flex items-center gap-2">
          <AlertCircle size={14} style={{ color: '#F87171' }} />
          <span className="text-xs font-semibold" style={{ color: '#F87171' }}>
            Grammar Correction
          </span>
        </div>
        {expanded ? (
          <ChevronUp size={14} style={{ color: '#94A3B8' }} />
        ) : (
          <ChevronDown size={14} style={{ color: '#94A3B8' }} />
        )}
      </button>

      {/* Expandable body */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2 border-t"
              style={{ borderColor: 'rgba(239,68,68,0.15)' }}>

              {/* Wrong → Correct */}
              <div className="mt-2 space-y-1">
                <div className="flex items-start gap-2">
                  <span className="text-sm">❌</span>
                  <span className="text-sm line-through" style={{ color: '#F87171' }}>
                    {grammarNote.original}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#4ADE80' }} />
                  <span className="text-sm font-semibold" style={{ color: '#4ADE80' }}>
                    {grammarNote.corrected}
                  </span>
                </div>
              </div>

              {/* Rule */}
              {grammarNote.rule && (
                <div className="flex items-center gap-2">
                  <BookOpen size={12} style={{ color: '#60A5FA' }} />
                  <span className="text-xs font-medium" style={{ color: '#60A5FA' }}>
                    {grammarNote.rule}
                  </span>
                </div>
              )}

              {/* Hindi explanation */}
              {grammarNote.explanation_hindi && (
                <p className="text-xs rounded-lg px-3 py-2"
                  style={{ background: 'rgba(255,255,255,0.04)', color: '#94A3B8' }}>
                  💬 {grammarNote.explanation_hindi}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
