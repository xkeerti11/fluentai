'use client'

import { motion } from 'framer-motion'
import { Volume2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis'

export interface VerbCardData {
  word: string
  v1?: string
  v2?: string
  v3?: string
  meaning_hindi: string
  pronunciation?: string
  hindi_pronunciation?: string
  example?: string
  example_sentence?: string
  example_hindi?: string
  verb_sentence_hindi?: string
  verb_sentence_english?: string
  memory_trick?: string
  level?: string
  category?: string
}

interface VerbCardProps {
  word: VerbCardData
  isFlipped: boolean
  onFlip: () => void
  className?: string
}

export default function VerbCard({
  word,
  isFlipped,
  onFlip,
  className
}: VerbCardProps) {
  const { speak } = useSpeechSynthesis()
  const hasVerbForms = word.v1 && word.v2 && word.v3
  const mainExample = word.example || word.example_sentence || ''

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation()
    const clean = text.split('/')[0].trim()
    speak(clean)
  }

  return (
    <div
      onClick={onFlip}
      className={cn(
        "w-full max-w-[360px] sm:max-w-md md:max-w-lg h-[370px] sm:h-[360px] md:h-[350px] perspective-1000 cursor-pointer select-none mx-auto",
        className
      )}
      style={{ perspective: 1000 }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="w-full h-full relative rounded-2xl border shadow-xl transform-style-3d transition-colors"
        style={{
          transformStyle: 'preserve-3d',
          background: '#0F172A',
          borderColor: isFlipped ? '#8B5CF6' : '#334155'
        }}
      >
        {/* ─── FRONT SIDE (Matches Image 3) ─── */}
        <div
          className="absolute inset-0 w-full h-full flex flex-col justify-between items-center p-4 sm:p-6 text-center rounded-2xl"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
            background: '#0F172A'
          }}
        >
          {/* Top category & level */}
          <div className="w-full flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {word.category ? word.category.toUpperCase() : 'VERB'}
            </span>
            {word.level && (
              <span className="text-[10px] font-bold text-slate-500">
                {word.level}
              </span>
            )}
          </div>

          {/* Centered Word & Pronunciation */}
          <div className="space-y-2 sm:space-y-3 my-auto w-full px-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-100 tracking-tight break-words">
              {word.word}
            </h2>

            {word.pronunciation && (
              <button
                type="button"
                onClick={(e) => handleSpeak(e, word.word)}
                className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-xs font-bold text-blue-400 border border-blue-500/20 transition mx-auto active:scale-95"
              >
                <Volume2 size={13} className="flex-shrink-0" />
                <span className="truncate max-w-[200px]">{word.pronunciation}</span>
              </button>
            )}
          </div>

          {/* Bottom Hint */}
          <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium tracking-wide">
            Card ko flip karne ke liye click karein 🔄
          </p>
        </div>

        {/* ─── BACK SIDE (Matches Image 4 with Verb details) ─── */}
        <div
          className="absolute inset-0 w-full h-full flex flex-col justify-between p-3.5 sm:p-5 text-left rounded-2xl overflow-y-auto no-scrollbar"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: '#0F172A'
          }}
        >
          {/* Hindi Meaning */}
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider">
              HINDI MEANING
            </span>
            <p className="text-base sm:text-lg font-black text-slate-100 leading-tight">
              {word.meaning_hindi}
            </p>
          </div>

          {/* 3 Forms (V1 - V2 - V3) */}
          {hasVerbForms && (
            <div className="rounded-xl bg-slate-900/95 border border-slate-800 p-2 sm:p-2.5 my-1 space-y-1 sm:space-y-1.5 shadow-inner">
              <div className="flex items-center justify-between gap-1 flex-wrap">
                <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  THREE FORMS (V1 — V2 — V3)
                </span>
                {word.hindi_pronunciation && (
                  <span className="text-[9px] sm:text-[10px] font-bold text-amber-400 truncate">
                    {word.hindi_pronunciation}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-1 sm:gap-1.5 text-center">
                {/* V1 */}
                <div className="p-1 sm:p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center">
                  <div className="text-[7px] sm:text-[8px] font-black text-emerald-400 uppercase tracking-wider">V1 (Present)</div>
                  <div className="text-[11px] sm:text-xs font-black text-emerald-200 mt-0.5 truncate w-full">{word.v1}</div>
                </div>
                {/* V2 */}
                <div className="p-1 sm:p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 flex flex-col items-center">
                  <div className="text-[7px] sm:text-[8px] font-black text-blue-400 uppercase tracking-wider">V2 (Past)</div>
                  <div className="text-[11px] sm:text-xs font-black text-blue-200 mt-0.5 truncate w-full">{word.v2}</div>
                </div>
                {/* V3 */}
                <div className="p-1 sm:p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 flex flex-col items-center">
                  <div className="text-[7px] sm:text-[8px] font-black text-purple-400 uppercase tracking-wider">V3 (Participle)</div>
                  <div className="text-[11px] sm:text-xs font-black text-purple-200 mt-0.5 truncate w-full">{word.v3}</div>
                </div>
              </div>
            </div>
          )}

          {/* Example Sentence */}
          <div className="space-y-1 border-t border-slate-800/80 pt-1.5">
            <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-wider">
              EXAMPLE
            </span>
            {mainExample && (
              <p className="text-[11px] sm:text-xs text-slate-200 font-medium italic leading-snug">
                &ldquo;{mainExample}&rdquo;
              </p>
            )}
            {word.example_hindi && (
              <p className="text-[10px] sm:text-[11px] text-slate-400 leading-snug">{word.example_hindi}</p>
            )}
            {word.verb_sentence_hindi && word.verb_sentence_english && (
              <p className="text-[9px] sm:text-[10px] text-blue-300/90 font-semibold pt-0.5 leading-snug">
                Past (V2): &ldquo;{word.verb_sentence_english}&rdquo; ({word.verb_sentence_hindi})
              </p>
            )}
          </div>

          {/* Memory trick */}
          {word.memory_trick && (
            <div className="p-1.5 sm:p-2 rounded-lg border border-amber-900/40 bg-amber-500/5 flex items-start gap-1.5 mt-0.5">
              <span className="text-[10px] sm:text-[11px] flex-shrink-0">💡</span>
              <p className="text-[9px] sm:text-[10px] text-amber-300 font-semibold leading-tight">
                {word.memory_trick}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
