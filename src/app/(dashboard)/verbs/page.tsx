'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, CheckCircle2, RotateCcw, 
  Search, Award, ArrowRight, ArrowLeft, Volume2,
  Check, X, Target, Calendar, AlertTriangle
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis'
import { cn } from '@/lib/utils/cn'
import VerbCard from '@/components/vocabulary/VerbCard'
import { ALL_500_VERBS, getVerbsByDay, TOTAL_VERB_DAYS, VerbEntry } from '@/data/verb-curriculum'

type VerbTabType = 'today' | 'quiz' | 'all'

interface QuizQuestion {
  id: number
  verb: VerbEntry
  type: 'v2_fill' | 'v3_mcq'
  prompt: string
  sentenceHindi?: string
  correctAnswer: string
  options?: string[]
  explanation: string
}

export default function VerbsPage() {
  const { profile } = useAuth()
  const { speak } = useSpeechSynthesis()

  const [activeTab, setActiveTab] = useState<VerbTabType>('today')
  const [selectedDay, setSelectedDay] = useState<number>(1)
  const [unlockedDay, setUnlockedDay] = useState<number>(1)
  
  // Progress tracking in LocalStorage
  const [verbProgress, setVerbProgress] = useState<{ [word: string]: 'known' | 'learning' }>({})
  
  // ─── TAB 1: 15 VERBS FLASHCARD STATE ───
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [dayReviewed, setDayReviewed] = useState<{ [word: string]: 'known' | 'learning' }>({})
  const [customReviewVerbs, setCustomReviewVerbs] = useState<VerbEntry[] | null>(null)

  // ─── TAB 2: QUIZ STATE ───
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [quizIdx, setQuizIdx] = useState(0)
  const [quizTypedAnswer, setQuizTypedAnswer] = useState('')
  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null)
  const [quizAnswered, setQuizAnswered] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)
  const [wrongAnswers, setWrongAnswers] = useState<{ question: QuizQuestion; userAnswer: string }[]>([])

  // ─── TAB 3: ALL VERBS (Search & filter) ───
  const [searchQuery, setSearchQuery] = useState('')
  const [refCategory, setRefCategory] = useState('all')
  const [refLevel, setRefLevel] = useState('all')
  const [refDay, setRefDay] = useState<string>('all')
  const [flippedCards, setFlippedCards] = useState<{ [word: string]: boolean }>({})

  // Load progress and unlocked day from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fluentai_verb_progress')
      if (saved) {
        setVerbProgress(JSON.parse(saved))
      }
      const savedDay = localStorage.getItem('fluentai_verb_active_day')
      if (savedDay) {
        setSelectedDay(parseInt(savedDay, 10) || 1)
      }
      const savedUnlocked = localStorage.getItem('fluentai_unlocked_verb_day')
      if (savedUnlocked) {
        setUnlockedDay(parseInt(savedUnlocked, 10) || 1)
      }
    } catch (e) {
      console.error('Error loading verb progress', e)
    }
  }, [])

  // Save progress helper
  const saveProgressState = (word: string, status: 'known' | 'learning') => {
    const updated = { ...verbProgress, [word]: status }
    setVerbProgress(updated)
    setDayReviewed(prev => ({ ...prev, [word]: status }))
    try {
      localStorage.setItem('fluentai_verb_progress', JSON.stringify(updated))
    } catch (e) {
      console.error('Error saving verb progress', e)
    }

    // Sync to Supabase review endpoint in background
    fetch('/api/vocabulary/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word, correct: status === 'known' })
    }).catch(() => {})
  }

  // Active verbs for learning (either custom missed verbs review or day's 15 verbs)
  const activeLearningVerbs = useMemo(() => {
    if (customReviewVerbs && customReviewVerbs.length > 0) {
      return customReviewVerbs
    }
    return getVerbsByDay(selectedDay)
  }, [selectedDay, customReviewVerbs])

  // Reset card index when day or review list changes
  useEffect(() => {
    setCurrentIdx(0)
    setIsFlipped(false)
    try {
      localStorage.setItem('fluentai_verb_active_day', selectedDay.toString())
    } catch (e) {}
  }, [selectedDay, customReviewVerbs])

  // ─── Quiz Generator for Current 15 Verbs ───
  const startQuizForDay = (dayNum = selectedDay, specificVerbs?: VerbEntry[]) => {
    const targetVerbs = specificVerbs && specificVerbs.length > 0 ? specificVerbs : getVerbsByDay(dayNum)
    const shuffled = [...targetVerbs].sort(() => Math.random() - 0.5)

    const questions: QuizQuestion[] = shuffled.map((verb, i) => {
      const qType = i % 2 === 0 ? 'v2_fill' : 'v3_mcq'
      if (qType === 'v2_fill') {
        const cleanV2 = verb.v2.split('/')[0].trim()
        return {
          id: i + 1,
          verb,
          type: 'v2_fill',
          prompt: `Type the Simple Past (V2) form of "${verb.word.toUpperCase()}" (${verb.meaning_hindi}):`,
          sentenceHindi: verb.verb_sentence_hindi,
          correctAnswer: cleanV2,
          explanation: `"${verb.word}" ka Past Tense (V2) "${cleanV2}" hota hai. (${verb.hindi_pronunciation})`
        }
      } else {
        const cleanV3 = verb.v3.split('/')[0].trim()
        const distractors = [
          verb.v2.split('/')[0].trim(),
          verb.word + 'ed',
          verb.word + 'ing',
          verb.v1.split('/')[0].trim()
        ].filter(opt => opt.toLowerCase() !== cleanV3.toLowerCase())

        const options = Array.from(new Set([cleanV3, ...distractors])).slice(0, 4).sort(() => Math.random() - 0.5)

        return {
          id: i + 1,
          verb,
          type: 'v3_mcq',
          prompt: `Choose the correct V3 (Participle) form:\n"They have ______ (${verb.word}) successfully."`,
          sentenceHindi: verb.example_hindi,
          correctAnswer: cleanV3,
          options,
          explanation: `Have / Has ke saath hamesha V3 form "${cleanV3}" lagta hai.`
        }
      }
    })

    setQuizQuestions(questions)
    setQuizIdx(0)
    setQuizTypedAnswer('')
    setQuizSelectedOption(null)
    setQuizAnswered(false)
    setQuizScore(0)
    setQuizFinished(false)
    setWrongAnswers([])
    setActiveTab('quiz')
  }

  const handleQuizSubmit = (answer: string) => {
    if (quizAnswered) return
    setQuizAnswered(true)

    const currentQ = quizQuestions[quizIdx]
    let isCorrect = false
    let givenAnswer = answer

    if (currentQ.type === 'v2_fill') {
      givenAnswer = quizTypedAnswer.trim()
      const cleanTyped = givenAnswer.toLowerCase()
      const cleanExpected = currentQ.correctAnswer.toLowerCase()
      isCorrect = cleanTyped === cleanExpected
    } else {
      setQuizSelectedOption(answer)
      givenAnswer = answer.trim()
      isCorrect = givenAnswer === currentQ.correctAnswer.trim()
    }

    if (isCorrect) {
      setQuizScore(s => s + 1)
      toast.success('Shabaash! Sahi Jawab 🎉')
      saveProgressState(currentQ.verb.word, 'known')
    } else {
      setWrongAnswers(prev => [...prev, { question: currentQ, userAnswer: givenAnswer }])
      toast.error(`Galat jawab! Sahi form "${currentQ.correctAnswer}" hai.`)
      saveProgressState(currentQ.verb.word, 'learning')
    }
  }

  const handleNextQuiz = () => {
    setQuizAnswered(false)
    setQuizTypedAnswer('')
    setQuizSelectedOption(null)
    if (quizIdx < quizQuestions.length - 1) {
      setQuizIdx(prev => prev + 1)
    } else {
      setQuizFinished(true)
      
      // Calculate if passed (80% or more)
      const passed = quizScore >= Math.ceil(quizQuestions.length * 0.8)
      if (passed && selectedDay >= unlockedDay && selectedDay < TOTAL_VERB_DAYS) {
        const nextDay = selectedDay + 1
        setUnlockedDay(nextDay)
        try {
          localStorage.setItem('fluentai_unlocked_verb_day', nextDay.toString())
        } catch (e) {}
      }
    }
  }

  // Handle Flashcard Study Action
  const handleReviewVerb = (status: 'known' | 'learning') => {
    if (!activeLearningVerbs[currentIdx]) return
    const cur = activeLearningVerbs[currentIdx]
    saveProgressState(cur.word, status)
    toast.success(status === 'known' ? 'Marked as Mastered! ⭐' : 'Saved for practice! 📖')

    setTimeout(() => {
      setIsFlipped(false)
      if (currentIdx < activeLearningVerbs.length - 1) {
        setCurrentIdx(prev => prev + 1)
      }
    }, 250)
  }

  // Handle Re-practice of Missed Verbs
  const handleRepracticeMissedVerbs = () => {
    const missed = wrongAnswers.map(w => w.question.verb)
    if (missed.length > 0) {
      setCustomReviewVerbs(missed)
    } else {
      setCustomReviewVerbs(null)
    }
    setCurrentIdx(0)
    setIsFlipped(false)
    setActiveTab('today')
    toast.info('In verbs ko achhi tarah yaad karein, fir dubara quiz dein! 🎯')
  }

  // Advance to Next 15 Verbs (Day X + 1)
  const handleAdvanceToNextDay = () => {
    const next = Math.min(TOTAL_VERB_DAYS, selectedDay + 1)
    setSelectedDay(next)
    setCustomReviewVerbs(null)
    setCurrentIdx(0)
    setIsFlipped(false)
    setActiveTab('today')
    toast.success(`Day ${next} ke 15 Verbs shuru ho gaye! 🎉`)
  }

  // Filtered reference verbs for Tab 3 (Sabhi 500 Verbs)
  const filteredAllVerbs = useMemo(() => {
    return ALL_500_VERBS.filter(v => {
      const matchSearch = v.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.meaning_hindi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.v2 && v.v2.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (v.v3 && v.v3.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchCategory = refCategory === 'all' || v.category === refCategory
      const matchLevel = refLevel === 'all' || v.level === refLevel
      const matchDay = refDay === 'all' || v.day.toString() === refDay

      return matchSearch && matchCategory && matchLevel && matchDay
    })
  }, [searchQuery, refCategory, refLevel, refDay])

  const totalMastered = Object.values(verbProgress).filter(s => s === 'known').length
  const isQuizPassed = quizFinished && (quizScore >= Math.ceil(quizQuestions.length * 0.8))

  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto px-2.5 sm:px-4 md:px-6 pb-28 pt-2">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-800/90 pb-4 sm:pb-5">
        <div className="flex items-center gap-2.5">
          <span className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg flex-shrink-0">
            <Sparkles size={22} className="sm:w-6 sm:h-6" />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-100 tracking-tight">
              Verb Mastery 🔤
            </h1>
            <p className="text-[11px] sm:text-xs md:text-sm text-slate-400 font-medium">
              15 Verbs Yaad Karo $\rightarrow$ Quiz Pass Karo $\rightarrow$ Agle 15 Verbs Unlock Karo!
            </p>
          </div>
        </div>

        {/* Day Selector & Mastered Badge */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          {/* Day Selector */}
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300">
            <Calendar size={13} className="text-blue-400 flex-shrink-0" />
            <span className="text-[11px] sm:text-xs">Day:</span>
            <select
              value={selectedDay}
              onChange={(e) => {
                const d = parseInt(e.target.value, 10)
                setSelectedDay(d)
                setCustomReviewVerbs(null)
              }}
              className="bg-slate-900 text-blue-400 font-black rounded-lg px-1.5 py-0.5 border border-slate-700 focus:outline-none text-[11px] sm:text-xs"
            >
              {Array.from({ length: TOTAL_VERB_DAYS }, (_, i) => i + 1).map(d => (
                <option key={d} value={d}>
                  Day {d} {d <= unlockedDay ? '🔓' : '🔒'} (15 verbs)
                </option>
              ))}
            </select>
          </div>

          {/* Mastered Badge */}
          <div className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-[11px] sm:text-xs font-semibold text-slate-300">
            Mastered: <span className="font-extrabold text-emerald-400">{totalMastered} verbs</span>
          </div>
        </div>
      </div>

      {/* Clean 3 Tabs */}
      <div className="w-full overflow-x-auto no-scrollbar py-0.5">
        <div className="flex gap-1.5 sm:gap-2 p-1 rounded-2xl bg-slate-900/90 border border-slate-800 w-max min-w-full sm:min-w-0">
          {[
            { 
              id: 'today', 
              label: customReviewVerbs 
                ? `🔄 Missed Verbs Practice (${customReviewVerbs.length})` 
                : `📅 Aaj ke 15 Verbs (Day ${selectedDay})`, 
              count: activeLearningVerbs.length - Object.keys(dayReviewed).length 
            },
            { id: 'quiz', label: `❓ Verb Quiz (Day ${selectedDay})` },
            { id: 'all', label: '📚 Sabhi 500 Verbs', count: ALL_500_VERBS.length }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id as VerbTabType)
                if (t.id === 'quiz' && quizQuestions.length === 0) {
                  startQuizForDay(selectedDay, customReviewVerbs || undefined)
                }
              }}
              className={cn(
                'flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex-shrink-0 whitespace-nowrap active:scale-95',
                activeTab === t.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 bg-transparent'
              )}
            >
              <span>{t.label}</span>
              {t.count !== undefined && t.count > 0 && (
                <span className={cn(
                  'px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black',
                  activeTab === t.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                )}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ─── TAB 1: 15 VERBS (1-by-1 Interactive Flashcards) ─── */}
      {activeTab === 'today' && (
        <div className="rounded-2xl border p-4 sm:p-6 min-h-[440px] sm:min-h-[480px] flex flex-col justify-between"
          style={{ background: '#1E293B', borderColor: '#334155' }}>
          
          {/* Custom Missed Verbs Alert Banner */}
          {customReviewVerbs && (
            <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-amber-300 font-bold">
                <AlertTriangle size={16} className="text-amber-400 flex-shrink-0" />
                <span>Quiz mein jo verbs galat huye the, unhe pehle yahan dhyan se yaad karein!</span>
              </div>
              <button
                onClick={() => setCustomReviewVerbs(null)}
                className="text-[11px] text-slate-400 hover:text-white underline font-semibold"
              >
                Reset to Day {selectedDay}
              </button>
            </div>
          )}

          {activeLearningVerbs.length === 0 ? (
            <div className="text-center py-20 text-slate-400">Loading Day {selectedDay} verbs...</div>
          ) : currentIdx < activeLearningVerbs.length ? (
            <div className="space-y-4 sm:space-y-6 flex-1 flex flex-col justify-between">
              {/* Header inside card container */}
              <div>
                <span className="text-[9px] sm:text-[10px] font-black text-blue-400 uppercase tracking-widest">
                  {customReviewVerbs ? 'MISSED VERB' : `DAY ${selectedDay} VERB`} {currentIdx + 1} OF {activeLearningVerbs.length}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-400 mt-0.5">
                  Card par click karke V1, V2, V3 aur Hindi sentence dekhein
                </h3>
              </div>

              {/* Centered Flip Card */}
              <div className="flex justify-center py-2 sm:py-4">
                <VerbCard
                  word={activeLearningVerbs[currentIdx]}
                  isFlipped={isFlipped}
                  onFlip={() => setIsFlipped(!isFlipped)}
                />
              </div>

              {/* Study Controls (Below Card) */}
              <div className="space-y-3.5 max-w-md mx-auto w-full">
                <div className="flex gap-2.5 sm:gap-3">
                  <button
                    onClick={() => handleReviewVerb('learning')}
                    className="flex-1 py-3 sm:py-3.5 rounded-xl border border-slate-700 bg-slate-900/40 text-slate-300 hover:border-slate-500 text-xs sm:text-sm font-extrabold transition-all active:scale-[0.98]"
                  >
                    📖 Seekh raha hoon
                  </button>
                  <button
                    onClick={() => handleReviewVerb('known')}
                    className="flex-1 py-3 sm:py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98]"
                  >
                    <Check size={15} /> Janta hoon
                  </button>
                </div>

                {/* Navigation Row */}
                <div className="flex justify-between items-center text-slate-400 text-xs px-1">
                  <button
                    disabled={currentIdx === 0}
                    onClick={() => { setIsFlipped(false); setCurrentIdx(p => Math.max(0, p - 1)); }}
                    className="hover:text-white transition flex items-center gap-1 disabled:opacity-30 disabled:pointer-events-none p-1"
                  >
                    ← Pichla
                  </button>

                  <button
                    onClick={() => speak(activeLearningVerbs[currentIdx].word)}
                    className="hover:text-blue-400 transition flex items-center gap-1 text-slate-300 font-bold p-1"
                  >
                    <Volume2 size={15} /> Pronounce
                  </button>

                  <button
                    disabled={currentIdx >= activeLearningVerbs.length - 1}
                    onClick={() => { setIsFlipped(false); setCurrentIdx(p => Math.min(activeLearningVerbs.length - 1, p + 1)); }}
                    className="hover:text-white transition flex items-center gap-1 disabled:opacity-30 disabled:pointer-events-none p-1"
                  >
                    Agla →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // All 15 verbs reviewed in flashcards
            <div className="text-center py-10 sm:py-12 space-y-5 sm:space-y-6 flex-1 flex flex-col justify-center items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 size={32} className="sm:w-9 sm:h-9" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-black text-slate-100">
                  {customReviewVerbs ? 'Missed Verbs Review Complete!' : `Day ${selectedDay} ke saare 15 Verbs yaad ho gaye! 🎉`}
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto px-2">
                  Ab Quiz dekar test karein. Agar aapka score sahi raha to agle 15 verbs unlock ho jayenge!
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 sm:gap-3 justify-center pt-2">
                <button
                  onClick={() => startQuizForDay(selectedDay, customReviewVerbs || undefined)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-extrabold shadow-lg transition flex items-center gap-2 active:scale-95"
                >
                  <Target size={16} /> Abhi Verb Quiz Shuru Karein →
                </button>
                <button
                  onClick={() => { setCurrentIdx(0); setIsFlipped(false); }}
                  className="px-5 py-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-extrabold hover:bg-slate-700 transition"
                >
                  Ek baar fir Flashcards dekhein 🔄
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: VERB QUIZ & MASTERY PROGRESSION ─── */}
      {activeTab === 'quiz' && (
        <div className="rounded-2xl border p-4 sm:p-6 min-h-[440px]"
          style={{ background: '#1E293B', borderColor: '#334155' }}>
          
          {!quizFinished && quizQuestions.length > 0 && (
            <div className="max-w-xl mx-auto space-y-4 sm:space-y-6">
              {/* Question progress */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-black text-blue-400 uppercase tracking-widest">
                  Question {quizIdx + 1} of {quizQuestions.length} (Day {selectedDay})
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-emerald-500/20">
                  Score: {quizScore} / {quizQuestions.length}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                  style={{ width: `${((quizIdx + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>

              {/* Prompt Card */}
              <div className="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-2">
                <p className="text-xs sm:text-base font-bold text-slate-100 whitespace-pre-line leading-relaxed">
                  {quizQuestions[quizIdx].prompt}
                </p>
                {quizQuestions[quizIdx].sentenceHindi && (
                  <p className="text-[11px] sm:text-xs text-slate-400 italic">
                    {quizQuestions[quizIdx].sentenceHindi}
                  </p>
                )}
              </div>

              {/* Input Area (Fill in blank / Multiple choice) */}
              {quizQuestions[quizIdx].type === 'v2_fill' ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    disabled={quizAnswered}
                    value={quizTypedAnswer}
                    onChange={(e) => setQuizTypedAnswer(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !quizAnswered && quizTypedAnswer.trim()) handleQuizSubmit(quizTypedAnswer); }}
                    placeholder="Type Past (V2) form here..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base font-bold text-slate-100 focus:outline-none focus:border-blue-500"
                    autoFocus
                  />
                  {!quizAnswered && (
                    <button
                      disabled={!quizTypedAnswer.trim()}
                      onClick={() => handleQuizSubmit(quizTypedAnswer)}
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-black uppercase tracking-wider transition active:scale-[0.98]"
                    >
                      Check Answer
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2 sm:gap-2.5">
                  {quizQuestions[quizIdx].options?.map((opt, i) => {
                    const isSelected = quizSelectedOption === opt
                    const isCorrect = opt.trim() === quizQuestions[quizIdx].correctAnswer.trim()
                    
                    let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                    if (quizAnswered) {
                      if (isCorrect) btnStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                      else if (isSelected) btnStyle = 'bg-rose-500/15 border-rose-500 text-rose-300'
                    }

                    return (
                      <button
                        key={i}
                        disabled={quizAnswered}
                        onClick={() => handleQuizSubmit(opt)}
                        className={cn(
                          'w-full text-left p-3 sm:p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-between active:scale-[0.98]',
                          btnStyle
                        )}
                      >
                        <span className="truncate mr-2">{opt}</span>
                        {quizAnswered && isCorrect && <Check size={16} className="text-emerald-400 flex-shrink-0" />}
                        {quizAnswered && isSelected && !isCorrect && <X size={16} className="text-rose-400 flex-shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Explanation & Next Button */}
              {quizAnswered && (
                <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
                  <div className="p-3 sm:p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <p className="font-bold text-amber-400 text-[11px] sm:text-xs">💡 Explanation:</p>
                    <p className="text-slate-300 text-[11px] sm:text-xs leading-relaxed">{quizQuestions[quizIdx].explanation}</p>
                  </div>

                  <button
                    onClick={handleNextQuiz}
                    className="w-full py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black uppercase tracking-wider shadow-lg transition active:scale-[0.98]"
                  >
                    {quizIdx < quizQuestions.length - 1 ? 'Next Question →' : 'View Final Score 🎉'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* QUIZ FINISHED RESULTS SCREEN */}
          {quizFinished && (
            <div className="max-w-md mx-auto text-center space-y-5 sm:space-y-6 py-4 sm:py-6">
              <div className={cn(
                "w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto text-white shadow-xl",
                isQuizPassed ? "bg-gradient-to-tr from-emerald-600 to-blue-600" : "bg-gradient-to-tr from-amber-600 to-rose-600"
              )}>
                {isQuizPassed ? <Award size={36} /> : <AlertTriangle size={36} />}
              </div>

              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-black text-slate-100">
                  {isQuizPassed ? '🎉 Shabaash! Day Complete!' : '⚠️ Practice Needed!'}
                </h2>
                <p className="text-xs text-slate-400">
                  {isQuizPassed 
                    ? `Aapne ${quizQuestions.length} mein se ${quizScore} sahi answers diye!` 
                    : `Aapne ${wrongAnswers.length} verbs mein galti ki. Inhe dobara practice karein!`
                  }
                </p>
              </div>

              {/* Accuracy Badge */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800 inline-block px-6 sm:px-8">
                <span className={cn(
                  "text-2xl sm:text-3xl font-black text-transparent bg-clip-text",
                  isQuizPassed 
                    ? "bg-gradient-to-r from-emerald-400 to-blue-400" 
                    : "bg-gradient-to-r from-amber-400 to-rose-400"
                )}>
                  {Math.round((quizScore / quizQuestions.length) * 100)}%
                </span>
                <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase mt-1">Accuracy</p>
              </div>

              {/* Missed Verbs List if any */}
              {wrongAnswers.length > 0 && (
                <div className="text-left space-y-2 pt-1 sm:pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                    <span>⚠️ Jo verbs aap bhool gaye:</span>
                    <span className="text-[11px] text-slate-400">{wrongAnswers.length} verbs</span>
                  </div>
                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    {wrongAnswers.map((w, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] sm:text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-100">{w.question.verb.word} ({w.question.verb.meaning_hindi})</span>
                          <span className="text-emerald-400 font-bold text-[10px]">Sahi: {w.question.correctAnswer}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Forms: V1: {w.question.verb.v1} | V2: {w.question.verb.v2} | V3: {w.question.verb.v3}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons for Progression */}
              <div className="space-y-2.5 pt-2">
                {/* If Passed: Button to Advance to Next 15 Verbs */}
                {isQuizPassed && selectedDay < TOTAL_VERB_DAYS && (
                  <button
                    onClick={handleAdvanceToNextDay}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-extrabold text-sm shadow-xl transition flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <span>🎉 Agle 15 Verbs (Day {selectedDay + 1}) Shuru Karein</span>
                    <ArrowRight size={16} />
                  </button>
                )}

                {/* If Missed Any: Button to Re-practice Missed Verbs */}
                {wrongAnswers.length > 0 && (
                  <button
                    onClick={handleRepracticeMissedVerbs}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-extrabold text-sm shadow-xl transition flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <RotateCcw size={16} />
                    <span>🔄 In Verbs Ko Dobara Yaad & Practice Karein</span>
                  </button>
                )}

                {/* Retake Quiz Option */}
                <div className="flex gap-2.5 pt-1">
                  <button
                    onClick={() => startQuizForDay(selectedDay, customReviewVerbs || undefined)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 font-extrabold text-xs hover:bg-slate-700 transition active:scale-[0.98]"
                  >
                    Dubara Quiz Dein 🔄
                  </button>
                  <button
                    onClick={() => setActiveTab('today')}
                    className="flex-1 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 font-extrabold text-xs hover:bg-slate-700 transition active:scale-[0.98]"
                  >
                    Flashcards Dekhein 📖
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 3: ALL 500 VERBS (Dictionary) ─── */}
      {activeTab === 'all' && (
        <div className="space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 bg-slate-900/60 p-3 sm:p-4 rounded-2xl border border-slate-800">
            {/* Search Input */}
            <div className="relative col-span-1 sm:col-span-2 md:col-span-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search word, Hindi, V2, V3..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Category Select */}
            <div>
              <select
                value={refCategory}
                onChange={(e) => setRefCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="irregular">🔀 Irregular Verbs</option>
                <option value="regular">📝 Daily & Regular</option>
                <option value="business">💼 Business & Office</option>
                <option value="freelance">🖥️ Freelance & Tech</option>
                <option value="interview">🎯 Interview & Power</option>
              </select>
            </div>

            {/* Level Select */}
            <div>
              <select
                value={refLevel}
                onChange={(e) => setRefLevel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All CEFR Levels</option>
                <option value="A0">A0 — Absolute Beginner</option>
                <option value="A1">A1 — Beginner</option>
                <option value="A2">A2 — Elementary</option>
                <option value="B1">B1 — Intermediate</option>
                <option value="B2">B2 — Upper Intermediate</option>
              </select>
            </div>

            {/* Day Filter */}
            <div>
              <select
                value={refDay}
                onChange={(e) => setRefDay(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All 34 Days (500 verbs)</option>
                {Array.from({ length: TOTAL_VERB_DAYS }, (_, i) => i + 1).map(d => (
                  <option key={d} value={d.toString()}>Day {d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400 px-1">
            <span>Showing <strong className="text-slate-200">{filteredAllVerbs.length}</strong> verbs</span>
            <span className="hidden sm:inline">Tap card to view V1, V2, V3 and examples</span>
          </div>

          {/* Grid of Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredAllVerbs.map(verb => (
              <VerbCard
                key={verb.word}
                word={verb}
                isFlipped={flippedCards[verb.word] || false}
                onFlip={() => setFlippedCards(p => ({ ...p, [verb.word]: !p[verb.word] }))}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
