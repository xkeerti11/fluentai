'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface GrammarTipProps {
  originalMistake?: string | null
  subtleCorrection?: string | null
}

export function GrammarTip({ originalMistake, subtleCorrection }: GrammarTipProps) {
  const [expanded, setExpanded] = useState(false)

  if (!subtleCorrection) return null

  return (
    <div className="rounded-xl overflow-hidden border transition-all duration-200"
      style={{
        background: 'rgba(34,197,94,0.05)',
        borderColor: expanded ? 'rgba(34,197,94,0.3)' : 'rgba(34,197,94,0.15)'
      }}>

      {/* Header (always visible) */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-3 py-2 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold flex items-center gap-1.5" style={{ color: '#4ADE80' }}>
            <span>💡</span> Grammar tip (tap to see)
          </span>
        </div>
        {expanded ? (
          <ChevronUp size={14} style={{ color: '#4ADE80' }} />
        ) : (
          <ChevronDown size={14} style={{ color: '#4ADE80' }} />
        )}
      </button>

      {/* Expandable body */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2 border-t" style={{ borderColor: 'rgba(34,197,94,0.1)' }}>
              <div className="mt-2 space-y-1.5">
                {originalMistake && (
                  <div className="flex items-start gap-2">
                    <span className="text-xs mt-0.5">❌</span>
                    <span className="text-xs line-through text-red-400">
                      {originalMistake}
                    </span>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <span className="text-xs mt-0.5">✅</span>
                  <span className="text-xs font-semibold text-emerald-400">
                    {subtleCorrection}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
