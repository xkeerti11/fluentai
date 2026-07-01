'use client'
import { motion } from 'framer-motion'
import { Mic, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

type MicState = 'idle' | 'listening' | 'processing'

interface MicButtonProps {
  state: MicState
  onClick: () => void
  disabled?: boolean
  className?: string
}

export function MicButton({ state, onClick, disabled, className }: MicButtonProps) {
  const isListening = state === 'listening'
  const isProcessing = state === 'processing'

  return (
    <div className={cn('relative flex flex-col items-center justify-center', className)}>
      
      {/* Container for absolute sonar rings */}
      <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
        {/* Framer Motion Sonar rings (3 concentric rings scaling out and fading when listening) */}
        {isListening && [0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              inset: 0,
              background: 'rgba(239, 68, 68, 0.4)',
              zIndex: 0
            }}
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut"
            }}
          />
        ))}

        {/* Main button */}
        <motion.button
          onClick={onClick}
          disabled={disabled || isProcessing}
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          className="relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center z-10 transition-colors duration-200 disabled:cursor-not-allowed shadow-xl"
          style={{
            background: isListening
              ? '#EF4444'
              : isProcessing
              ? '#3b82f6' // Processing blue
              : '#475569', // Idle gray
          }}
          aria-label={
            isListening ? 'Stop listening' :
            isProcessing ? 'Processing...' :
            'Start speaking'
          }
        >
          {isProcessing ? (
            <Loader2 className="w-6 h-6 md:w-7 md:h-7 animate-spin text-white" />
          ) : (
            <Mic className="w-6 h-6 md:w-7 md:h-7 text-white" />
          )}
        </motion.button>
      </div>

      {/* State label */}
      <p className="mt-2 md:mt-4 text-sm md:text-xs font-semibold tracking-wide whitespace-nowrap text-slate-400"
        style={{ color: isListening ? '#EF4444' : undefined }}>
        {isListening ? 'Bol raha hoon...' :
         isProcessing ? 'Processing...' :
         'Tap to Speak'}
      </p>
    </div>
  )
}
