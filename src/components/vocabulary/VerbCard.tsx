'use client'
import { cn } from '@/lib/utils/cn'
import type { VocabularyWord } from '@/data/vocabulary-curriculum'

interface VerbCardProps {
  word: VocabularyWord
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
  const hasVerbForms = word.v1 && word.v2 && word.v3

  return (
    <div
      onClick={onFlip}
      className="w-full perspective-1000 cursor-pointer"
    >
      <div
        className={cn(
          'w-full duration-500 transform-style-3d relative rounded-2xl border shadow-xl transition-transform',
          isFlipped && 'rotate-y-180'
        )}
        style={{
          minHeight: 340,
          background: '#0F172A',
          borderColor: isFlipped ? '#8B5CF6' : '#334155',
        }}
      >
        {/* ─── FRONT ─── */}
        <div className="absolute inset-0 backface-hidden flex flex-col p-6 rounded-2xl overflow-hidden">
          {/* Word type badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              🔤 Irregular Verb
            </span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
              {word.level}
            </span>
          </div>

          {/* Hindi meaning */}
          <p className="text-xs font-semibold text-slate-400 text-center mb-1">
            {word.meaning_hindi}
          </p>

          {/* Word */}
          <h2 className="text-3xl font-black text-slate-100 text-center mb-1">
            {word.word.charAt(0).toUpperCase() + word.word.slice(1)}
          </h2>

          {/* Pronunciation */}
          {word.pronunciation && (
            <p className="text-xs font-semibold text-blue-400 text-center mb-4">
              🔊 {word.pronunciation}
            </p>
          )}

          {/* V1 — V2 — V3 Block */}
          {hasVerbForms && (
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 mb-3">
              {/* Hindi pronunciation of forms */}
              {word.hindi_pronunciation && (
                <p className="text-yellow-400 text-xs font-bold text-center mb-3 tracking-wide">
                  {word.hindi_pronunciation}
                </p>
              )}

              {/* Form display */}
              <div className="flex items-stretch justify-center gap-1">
                <div className="flex-1 flex flex-col items-center gap-1 bg-emerald-500/5 border border-emerald-500/20 rounded-lg py-2 px-1">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">V1</span>
                  <span className="text-base font-black text-emerald-400 text-center leading-tight">{word.v1}</span>
                  <span className="text-[8px] text-slate-600">Present</span>
                </div>
                <div className="flex items-center text-slate-700 text-lg font-bold">—</div>
                <div className="flex-1 flex flex-col items-center gap-1 bg-blue-500/5 border border-blue-500/20 rounded-lg py-2 px-1">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">V2</span>
                  <span className="text-base font-black text-blue-400 text-center leading-tight">{word.v2}</span>
                  <span className="text-[8px] text-slate-600">Simple Past</span>
                </div>
                <div className="flex items-center text-slate-700 text-lg font-bold">—</div>
                <div className="flex-1 flex flex-col items-center gap-1 bg-purple-500/5 border border-purple-500/20 rounded-lg py-2 px-1">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">V3</span>
                  <span className="text-base font-black text-purple-400 text-center leading-tight">{word.v3}</span>
                  <span className="text-[8px] text-slate-600">Participle</span>
                </div>
              </div>
            </div>
          )}

          {/* Hindi example sentence */}
          {word.verb_sentence_hindi && (
            <div className="text-center mt-auto space-y-0.5">
              <p className="text-sm font-semibold text-slate-200">
                &ldquo;{word.verb_sentence_hindi}&rdquo;
              </p>
              {word.verb_sentence_english && (
                <p className="text-[10px] text-slate-500 italic">
                  ({word.verb_sentence_english})
                </p>
              )}
            </div>
          )}

          <p className="text-center text-slate-600 text-[9px] mt-3 font-medium">
            Tap to flip ↩
          </p>
        </div>

        {/* ─── BACK ─── */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col p-6 rounded-2xl overflow-hidden">
          <h3 className="text-xl font-black text-slate-100 text-center mb-4">
            {word.word.charAt(0).toUpperCase() + word.word.slice(1)}
          </h3>

          {/* Memory trick */}
          {word.memory_trick && (
            <div className="rounded-xl border border-amber-700/40 bg-amber-500/5 p-3.5 mb-3 flex items-start gap-2">
              <span className="text-sm flex-shrink-0">💡</span>
              <div>
                <p className="text-[9px] font-black text-amber-500 uppercase tracking-wider mb-1">Memory Trick</p>
                <p className="text-xs text-amber-200 font-medium leading-relaxed">{word.memory_trick}</p>
              </div>
            </div>
          )}

          {/* Full example (English + Hindi) */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 mb-4 flex-1">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Example</p>
            <p className="text-sm text-slate-200 font-medium italic leading-relaxed">
              &ldquo;{word.example}&rdquo;
            </p>
            {word.example_hindi && (
              <p className="text-[10px] text-slate-400 mt-1">{word.example_hindi}</p>
            )}
          </div>

          {/* Janta Hoon / Seekh Raha Hoon buttons */}
          <div className="flex gap-3 mt-auto" onClick={(e) => e.stopPropagation()}>
            <button
              disabled={isLogging}
              onClick={onLearning}
              className="flex-1 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500 text-xs font-extrabold transition-all disabled:opacity-50"
            >
              📖 Seekh Raha Hoon
            </button>
            <button
              disabled={isLogging}
              onClick={onKnow}
              className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition-all shadow-md disabled:opacity-50"
            >
              ✅ Janta Hoon
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
