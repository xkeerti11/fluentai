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
  level: string
  category?: string
  word_type?: string
}

interface VerbCardProps {
  word: VerbCardData
  isFlipped: boolean
  onFlip: () => void
  onKnow: () => void
  onLearning: () => void
  isLogging?: boolean
}

export default function VerbCard({
  word,
  isFlipped,
  onFlip,
  onKnow,
  onLearning,
  isLogging = false,
}: VerbCardProps) {
  const { speak } = useSpeechSynthesis()
  const hasVerbForms = word.v1 && word.v2 && word.v3
  const exampleText = word.example || word.example_sentence || ''

  const getCategoryLabel = () => {
    switch (word.category) {
      case 'business':
        return '💼 Business Verb'
      case 'freelance':
        return '🖥️ Freelance Verb'
      case 'interview':
        return '🎯 Interview Verb'
      case 'regular':
        return '📝 Regular Verb'
      default:
        return '🔤 Irregular Verb'
    }
  }

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation()
    // If text is like "go/goes" or "am/is/are", speak first one
    const cleanWord = text.split('/')[0].trim()
    speak(cleanWord)
  }

  return (
    <div
      onClick={onFlip}
      className="w-full perspective-1000 cursor-pointer select-none"
    >
      <div
        className={cn(
          'w-full duration-500 transform-style-3d relative rounded-2xl border shadow-xl transition-transform min-h-[380px]',
          isFlipped && 'rotate-y-180'
        )}
        style={{
          background: '#0F172A',
          borderColor: isFlipped ? '#8B5CF6' : '#334155',
        }}
      >
        {/* ─── FRONT ─── */}
        <div className="absolute inset-0 backface-hidden flex flex-col p-6 rounded-2xl overflow-hidden justify-between">
          <div>
            {/* Word type badge & Level */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {getCategoryLabel()}
              </span>
              <span className="text-xs font-extrabold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                {word.level}
              </span>
            </div>

            {/* Hindi meaning */}
            <p className="text-sm font-semibold text-slate-400 text-center mb-1">
              {word.meaning_hindi}
            </p>

            {/* Main Word + Audio */}
            <div className="flex items-center justify-center gap-2 mb-1">
              <h2 className="text-3xl font-black text-slate-100 text-center">
                {word.word.charAt(0).toUpperCase() + word.word.slice(1)}
              </h2>
              <button
                type="button"
                onClick={(e) => handleSpeak(e, word.word)}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-blue-400 transition"
                title="Pronounce"
              >
                <Volume2 size={18} />
              </button>
            </div>

            {/* Pronunciation */}
            {word.pronunciation && (
              <p className="text-xs font-medium text-blue-400/90 text-center mb-4">
                🔊 {word.pronunciation}
              </p>
            )}

            {/* V1 — V2 — V3 Block */}
            {hasVerbForms && (
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4 mb-3">
                {/* Hindi pronunciation of forms */}
                {word.hindi_pronunciation && (
                  <p className="text-amber-400 text-xs font-bold text-center mb-3 tracking-wide">
                    {word.hindi_pronunciation}
                  </p>
                )}

                {/* Form display */}
                <div className="flex items-stretch justify-center gap-1.5">
                  {/* V1 */}
                  <div className="flex-1 flex flex-col items-center gap-1 bg-emerald-500/5 border border-emerald-500/20 rounded-lg py-2 px-1 relative group">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">V1</span>
                      <button
                        type="button"
                        onClick={(e) => handleSpeak(e, word.v1!)}
                        className="text-slate-500 hover:text-emerald-400 transition"
                      >
                        <Volume2 size={12} />
                      </button>
                    </div>
                    <span className="text-sm md:text-base font-black text-emerald-400 text-center leading-tight">
                      {word.v1}
                    </span>
                    <span className="text-[9px] text-slate-500 font-medium">Present</span>
                  </div>

                  <div className="flex items-center text-slate-600 text-lg font-bold">—</div>

                  {/* V2 */}
                  <div className="flex-1 flex flex-col items-center gap-1 bg-blue-500/5 border border-blue-500/20 rounded-lg py-2 px-1 relative group">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">V2</span>
                      <button
                        type="button"
                        onClick={(e) => handleSpeak(e, word.v2!)}
                        className="text-slate-500 hover:text-blue-400 transition"
                      >
                        <Volume2 size={12} />
                      </button>
                    </div>
                    <span className="text-sm md:text-base font-black text-blue-400 text-center leading-tight">
                      {word.v2}
                    </span>
                    <span className="text-[9px] text-slate-500 font-medium">Past</span>
                  </div>

                  <div className="flex items-center text-slate-600 text-lg font-bold">—</div>

                  {/* V3 */}
                  <div className="flex-1 flex flex-col items-center gap-1 bg-purple-500/5 border border-purple-500/20 rounded-lg py-2 px-1 relative group">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest">V3</span>
                      <button
                        type="button"
                        onClick={(e) => handleSpeak(e, word.v3!)}
                        className="text-slate-500 hover:text-purple-400 transition"
                      >
                        <Volume2 size={12} />
                      </button>
                    </div>
                    <span className="text-sm md:text-base font-black text-purple-400 text-center leading-tight">
                      {word.v3}
                    </span>
                    <span className="text-[9px] text-slate-500 font-medium">Participle</span>
                  </div>
                </div>
              </div>
            )}

            {/* Hindi example sentence */}
            {word.verb_sentence_hindi && (
              <div className="text-center space-y-1 bg-slate-900/40 rounded-xl p-2.5 border border-slate-800/60">
                <p className="text-xs md:text-sm font-semibold text-slate-200">
                  &ldquo;{word.verb_sentence_hindi}&rdquo;
                </p>
                {word.verb_sentence_english && (
                  <p className="text-[11px] text-slate-400 italic">
                    ({word.verb_sentence_english})
                  </p>
                )}
              </div>
            )}
          </div>

          <p className="text-center text-slate-500 text-[11px] mt-3 font-medium">
            Tap to flip for memory trick & examples ↩
          </p>
        </div>

        {/* ─── BACK ─── */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col p-6 rounded-2xl overflow-hidden justify-between">
          <div>
            <div className="flex items-center justify-center gap-2 mb-3">
              <h3 className="text-2xl font-black text-slate-100 text-center">
                {word.word.charAt(0).toUpperCase() + word.word.slice(1)}
              </h3>
              <button
                type="button"
                onClick={(e) => handleSpeak(e, word.word)}
                className="p-1 rounded-full bg-slate-800 text-blue-400 hover:bg-slate-700 transition"
              >
                <Volume2 size={16} />
              </button>
            </div>

            {/* Memory trick */}
            {word.memory_trick && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 mb-3 flex items-start gap-2.5">
                <span className="text-base flex-shrink-0">💡</span>
                <div>
                  <p className="text-[10px] font-black text-amber-400 uppercase tracking-wider mb-1">
                    Memory Trick
                  </p>
                  <p className="text-xs text-amber-200 font-medium leading-relaxed">
                    {word.memory_trick}
                  </p>
                </div>
              </div>
            )}

            {/* Full example (English + Hindi) */}
            {exampleText && (
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-3.5 mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Example in Context
                  </p>
                  <button
                    type="button"
                    onClick={(e) => handleSpeak(e, exampleText)}
                    className="text-slate-400 hover:text-blue-400 transition"
                  >
                    <Volume2 size={14} />
                  </button>
                </div>
                <p className="text-xs md:text-sm text-slate-200 font-medium italic leading-relaxed">
                  &ldquo;{exampleText}&rdquo;
                </p>
                {word.example_hindi && (
                  <p className="text-[11px] text-slate-400 mt-1">
                    {word.example_hindi}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-auto pt-2" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              disabled={isLogging}
              onClick={onLearning}
              className="flex-1 py-3 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-300 hover:border-slate-500 hover:text-white text-xs font-extrabold transition-all disabled:opacity-50"
            >
              📖 Seekh Raha Hoon
            </button>
            <button
              type="button"
              disabled={isLogging}
              onClick={onKnow}
              className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition-all shadow-lg disabled:opacity-50"
            >
              ✅ Janta Hoon
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
