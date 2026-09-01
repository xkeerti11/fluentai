'use client'
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
      className={cn("w-full max-w-lg h-80 md:h-[340px] perspective-1000 cursor-pointer select-none mx-auto", className)}
    >
      <div
        className={cn(
          "w-full h-full duration-500 transform-style-3d relative rounded-2xl border shadow-xl transition-transform",
          isFlipped && "rotate-y-180"
        )}
        style={{
          background: '#0F172A',
          borderColor: isFlipped ? '#8B5CF6' : '#334155'
        }}
      >
        {/* ─── FRONT SIDE (Matches Image 3) ─── */}
        <div className="absolute inset-0 w-full h-full backface-hidden flex flex-col justify-between items-center p-6 text-center">
          {/* Top tag / level */}
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
          <div className="space-y-3 my-auto">
            <h2 className="text-3xl md:text-4xl font-black text-slate-100 tracking-tight">
              {word.word}
            </h2>

            {word.pronunciation && (
              <button
                type="button"
                onClick={(e) => handleSpeak(e, word.word)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-xs font-semibold text-blue-400 border border-blue-500/20 transition mx-auto"
              >
                <Volume2 size={14} />
                <span>{word.pronunciation}</span>
              </button>
            )}
          </div>

          {/* Bottom Hint */}
          <p className="text-[10px] text-slate-500 font-medium tracking-wide">
            Card ko flip karne ke liye click karein
          </p>
        </div>

        {/* ─── BACK SIDE (Matches Image 4 with Verb details) ─── */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 flex flex-col justify-between p-5 text-left overflow-y-auto">
          {/* Meaning */}
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider">
              HINDI MEANING
            </span>
            <p className="text-base font-bold text-slate-100">
              {word.meaning_hindi}
            </p>
          </div>

          {/* 3 Forms (V1 - V2 - V3) */}
          {hasVerbForms && (
            <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-2.5 my-1.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                  THREE FORMS (V1 — V2 — V3)
                </span>
                {word.hindi_pronunciation && (
                  <span className="text-[10px] font-bold text-amber-400">
                    {word.hindi_pronunciation}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-center">
                {/* V1 */}
                <div className="p-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <div className="text-[8px] font-black text-emerald-400">V1 (Present)</div>
                  <div className="text-xs font-extrabold text-slate-200 truncate">{word.v1}</div>
                </div>
                {/* V2 */}
                <div className="p-1.5 rounded-lg bg-blue-500/5 border border-blue-500/20">
                  <div className="text-[8px] font-black text-blue-400">V2 (Past)</div>
                  <div className="text-xs font-extrabold text-slate-200 truncate">{word.v2}</div>
                </div>
                {/* V3 */}
                <div className="p-1.5 rounded-lg bg-purple-500/5 border border-purple-500/20">
                  <div className="text-[8px] font-black text-purple-400">V3 (Participle)</div>
                  <div className="text-xs font-extrabold text-slate-200 truncate">{word.v3}</div>
                </div>
              </div>
            </div>
          )}

          {/* Examples */}
          <div className="space-y-1 border-t border-slate-800/80 pt-1.5">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
              EXAMPLE
            </span>
            {mainExample && (
              <p className="text-xs text-slate-300 font-medium italic leading-snug">
                &ldquo;{mainExample}&rdquo;
              </p>
            )}
            {word.example_hindi && (
              <p className="text-[10px] text-slate-400">{word.example_hindi}</p>
            )}
            {word.verb_sentence_hindi && word.verb_sentence_english && (
              <p className="text-[10px] text-blue-300/90 font-medium pt-0.5">
                Past (V2): &ldquo;{word.verb_sentence_english}&rdquo; ({word.verb_sentence_hindi})
              </p>
            )}
          </div>

          {/* Memory trick */}
          {word.memory_trick && (
            <div className="p-2 rounded-lg border border-amber-900/40 bg-amber-500/5 flex items-start gap-1.5 mt-1">
              <span className="text-[10px]">💡</span>
              <p className="text-[10px] text-amber-300 font-semibold leading-tight">
                {word.memory_trick}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
