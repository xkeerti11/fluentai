'use client'
import { motion, AnimatePresence } from 'framer-motion'

interface TranscriptDisplayProps {
  transcript: string
  interimTranscript: string
  isListening: boolean
}

export function TranscriptDisplay({ transcript, interimTranscript, isListening }: TranscriptDisplayProps) {
  const displayText = interimTranscript || transcript
  const hasText = displayText.trim().length > 0

  return (
    <AnimatePresence>
      {(isListening || hasText) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="mx-4 mb-4 px-4 py-3 rounded-xl border"
            style={{
              background: 'rgba(37,99,235,0.08)',
              borderColor: 'rgba(37,99,235,0.3)',
            }}>
            <p className="text-xs font-medium mb-1" style={{ color: '#60A5FA' }}>
              🎤 Tumhari awaaz...
            </p>
            {hasText ? (
              <p className="text-sm" style={{ color: interimTranscript ? '#94A3B8' : '#F1F5F9' }}>
                {displayText}
                {interimTranscript && <span className="animate-pulse">|</span>}
              </p>
            ) : (
              <div className="flex gap-1 items-center">
                <span className="typing-dot" style={{ background: '#2563EB' }} />
                <span className="typing-dot" style={{ background: '#2563EB' }} />
                <span className="typing-dot" style={{ background: '#2563EB' }} />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
