'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils/cn'
import type { ChatMessage } from '@/types/chat'
import { GrammarTip } from './GrammarTip'

interface ChatBubbleProps {
  message: ChatMessage
}

function SaveWordButton({ word }: { word: string }) {
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (saved || loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/vocabulary/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word })
      })
      const json = await res.json()
      if (json.success) {
        setSaved(true)
        toast.success('Word saved! ⭐')
      } else {
        toast.error('Word save nahi ho paya.')
      }
    } catch (e) {
      console.error(e)
      toast.error('Word save nahi ho paya.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleSave}
      disabled={loading || saved}
      className={cn(
        "flex items-center gap-1 text-[10px] px-2 py-1 rounded-full border transition-all active:scale-95 disabled:opacity-75 disabled:active:scale-100",
        saved 
          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 font-semibold" 
          : "bg-slate-800 hover:bg-slate-700 border-slate-700 hover:border-slate-500 text-slate-300"
      )}
    >
      {loading ? (
        <Loader2 size={10} className="animate-spin text-slate-400" />
      ) : (
        <Star size={10} className={cn(saved && "fill-emerald-400 text-emerald-400")} />
      )}
      {saved ? 'Saved ✓' : 'Save word'}
    </button>
  )
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={cn('flex gap-3 mb-4', isUser ? 'justify-end' : 'items-start')}
      >
        {/* AI Avatar */}
        {!isUser && (
          <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-md"
            style={{ background: 'linear-gradient(135deg, #2563EB, #8B5CF6)' }}>
            A
          </div>
        )}

        <div className="max-w-[80%] space-y-2">
          {/* Message bubble */}
          <div className={cn(
            'px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm',
            isUser
              ? 'bg-blue-600 text-white rounded-tr-sm'
              : 'bg-slate-700 text-slate-100 rounded-tl-sm'
          )}>
            {message.isLoading ? (
              /* Typing indicator */
              <div className="flex gap-1 items-center py-1">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            ) : (
              message.content
            )}
          </div>

          {/* New word Vocab Pill */}
          {!isUser && !message.isLoading && message.new_word && message.new_word.word && (
            <div className="flex flex-wrap gap-2 items-center">
              <span
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{
                  background: 'rgba(139,92,246,0.15)',
                  color: '#C4B5FD',
                  border: '1px solid rgba(139,92,246,0.3)'
                }}
              >
                📖 New word: <strong className="text-white">{message.new_word.word}</strong>
              </span>
              <SaveWordButton word={message.new_word.word} />
            </div>
          )}

          {/* Grammar correction tip card */}
          {!isUser && !message.isLoading && message.correction?.made && (
            <GrammarTip
              originalMistake={message.correction.original_mistake}
              subtleCorrection={message.correction.subtle_correction_used}
            />
          )}

          {/* Timestamp */}
          <p className="text-[10px]" style={{ color: '#475569' }}>
            {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
