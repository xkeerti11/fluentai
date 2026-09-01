'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, BookOpen, CheckCircle2, HelpCircle, RotateCcw, 
  Search, Filter, Award, ArrowRight, ArrowLeft, Volume2, 
  Check, X, Zap, Target, Briefcase, Laptop, Users
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis'
import { cn } from '@/lib/utils/cn'
import VerbCard from '@/components/vocabulary/VerbCard'
import { VERBS, VERB_CATEGORIES, VerbEntry } from '@/data/verb-curriculum'

type VerbTabType = 'learn' | 'all' | 'practice' | 'progress'

interface QuizQuestion {
  id: number
  verb: VerbEntry
  type: 'v2_fill' | 'v3_mcq' | 'form_triplet'
  prompt: string
  sentenceHindi?: string
  correctAnswer: string
  options?: string[]
  explanation: string
}

export default function VerbsPage() {
  const { profile } = useAuth()
  const { speak } = useSpeechSynthesis()

  const [activeTab, setActiveTab] = useState<VerbTabType>('learn')
  const [loading, setLoading] = useState(false)

  // ─── TAB 1: LEARN (1-by-1 Flashcard Mode) ───
  const [learnList, setLearnList] = useState<VerbEntry[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [learnProgress, setLearnProgress] = useState<{ [word: string]: 'known' | 'learning' }>({})
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // ─── TAB 2: ALL VERBS (Search & Reference) ───
  const [searchQuery, setSearchQuery] = useState('')
  const [refLevel, setRefLevel] = useState('all')
  const [refCategory, setRefCategory] = useState('all')
  const [flippedCards, setFlippedCards] = useState<{ [word: string]: boolean }>({})

  // ─── TAB 3: PRACTICE QUIZ ───
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [quizIdx, setQuizIdx] = useState(0)
  const [quizTypedAnswer, setQuizTypedAnswer] = useState('')
  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null)
  const [quizAnswered, setQuizAnswered] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)
  const [wrongAnswers, setWrongAnswers] = useState<QuizQuestion[]>([])

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fluentai_verb_progress')
      if (saved) {
        setLearnProgress(JSON.parse(saved))
      }
    } catch (e) {
      console.error('Error loading verb progress', e)
    }
  }, [])

  // Save progress helper
  const saveProgressState = (word: string, status: 'known' | 'learning') => {
    const updated = { ...learnProgress, [word]: status }
    setLearnProgress(updated)
    try {
      localStorage.setItem('fluentai_verb_progress', JSON.stringify(updated))
    } catch (e) {
      console.error('Error saving verb progress', e)
    }

    // Also sync to review API in background if possible
    fetch('/api/vocabulary/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word, correct: status === 'known' })
    }).catch(() => {})
  }

  // Populate Learn List based on filters
  useEffect(() => {
    let filtered = [...VERBS]
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(v => v.level === selectedLevel)
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(v => v.category === selectedCategory)
    }
    // Prioritize learning or unreviewed
    filtered.sort((a, b) => {
      const statusA: string = learnProgress[a.word] || 'unseen'
      const statusB: string = learnProgress[b.word] || 'unseen'
      if (statusA === statusB) return 0
      if (statusA === 'unseen') return -1
      if (statusB === 'unseen') return 1
      if (statusA === 'learning') return -1
      return 1
    })

    setLearnList(filtered.slice(0, 15))
    setCurrentIdx(0)
    setIsFlipped(false)
  }, [selectedLevel, selectedCategory, learnProgress])

  // Handle Learn Actions
  const handleMarkVerb = (status: 'known' | 'learning') => {
    if (!learnList[currentIdx]) return
    const currentWord = learnList[currentIdx].word
    saveProgressState(currentWord, status)

    toast.success(status === 'known' ? 'Great! Marked as Mastered ⭐' : 'Saved for revision! 📖')

    setTimeout(() => {
      setIsFlipped(false)
      if (currentIdx < learnList.length - 1) {
        setCurrentIdx(prev => prev + 1)
      }
    }, 250)
  }

  // ─── Filtered reference verbs ───
  const filteredRefVerbs = useMemo(() => {
    return VERBS.filter(v => {
      const matchSearch = v.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.meaning_hindi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.v2 && v.v2.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (v.v3 && v.v3.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchLevel = refLevel === 'all' || v.level === refLevel
      const matchCategory = refCategory === 'all' || v.category === refCategory

      return matchSearch && matchLevel && matchCategory
    })
  }, [searchQuery, refLevel, refCategory])

  // ─── Quiz Generator ───
  const startPracticeQuiz = () => {
    // Pick 10 random verbs
    const shuffled = [...VERBS].sort(() => Math.random() - 0.5).slice(0, 10)
    
    const questions: QuizQuestion[] = shuffled.map((verb, i) => {
      const qType = i % 3 === 0 ? 'v2_fill' : (i % 3 === 1 ? 'v3_mcq' : 'form_triplet')

      if (qType === 'v2_fill') {
        const cleanV2 = verb.v2.split('/')[0].trim()
        return {
          id: i + 1,
          verb,
          type: 'v2_fill',
          prompt: `Type the Simple Past (V2) form of "${verb.word.toUpperCase()}":`,
          sentenceHindi: verb.verb_sentence_hindi,
          correctAnswer: cleanV2,
          explanation: `"${verb.word}" ka Past Tense (V2) form "${cleanV2}" hota hai. (${verb.hindi_pronunciation})`
        }
      } else if (qType === 'v3_mcq') {
        const cleanV3 = verb.v3.split('/')[0].trim()
        // Generate believable distractors
        const distractors = [
          verb.v2.split('/')[0].trim(),
          verb.word + 'ed',
          verb.word + 'en',
          verb.v1.split('/')[0].trim()
        ].filter(opt => opt !== cleanV3)

        const options = Array.from(new Set([cleanV3, ...distractors])).slice(0, 4).sort(() => Math.random() - 0.5)

        return {
          id: i + 1,
          verb,
          type: 'v3_mcq',
          prompt: `Complete the sentence with correct V3 (Participle) form:\n"They have ______ (${verb.word}) successfully."`,
          sentenceHindi: verb.example_hindi,
          correctAnswer: cleanV3,
          options,
          explanation: `Have / Has ke saath hamesha V3 "${cleanV3}" lagta hai.`
        }
      } else {
        // Form Triplet
        const correctTriplet = `${verb.v1} → ${verb.v2} → ${verb.v3}`
        const options = [
          correctTriplet,
          `${verb.word} → ${verb.word}ed → ${verb.word}ed`,
          `${verb.word} → ${verb.v2} → ${verb.word}ed`,
          `${verb.word} → ${verb.word}ing → ${verb.v3}`
        ].sort(() => Math.random() - 0.5)

        return {
          id: i + 1,
          verb,
          type: 'form_triplet',
          prompt: `Which triplet represents the correct V1 → V2 → V3 for "${verb.word.toUpperCase()}" (${verb.meaning_hindi})?`,
          sentenceHindi: `Hindi: ${verb.meaning_hindi} (${verb.hindi_pronunciation})`,
          correctAnswer: correctTriplet,
          options,
          explanation: `Sahi forms: ${correctTriplet}`
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
    setActiveTab('practice')
  }

  const handleQuizSubmit = (answer: string) => {
    if (quizAnswered) return
    setQuizAnswered(true)

    const currentQ = quizQuestions[quizIdx]
    let isCorrect = false

    if (currentQ.type === 'v2_fill') {
      const cleanTyped = quizTypedAnswer.trim().toLowerCase()
      const cleanExpected = currentQ.correctAnswer.toLowerCase()
      isCorrect = cleanTyped === cleanExpected
    } else {
      setQuizSelectedOption(answer)
      isCorrect = answer.trim() === currentQ.correctAnswer.trim()
    }

    if (isCorrect) {
      setQuizScore(s => s + 1)
      toast.success('Shabaash! Sahi Jawab 🎉')
      saveProgressState(currentQ.verb.word, 'known')
    } else {
      setWrongAnswers(prev => [...prev, currentQ])
      toast.error('Galat jawab. Explanation check karein.')
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
    }
  }

  // Progress stats calculation
  const totalMastered = Object.values(learnProgress).filter(s => s === 'known').length
  const totalLearning = Object.values(learnProgress).filter(s => s === 'learning').length
  const totalRemaining = VERBS.length - (totalMastered + totalLearning)

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-3 md:p-6 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow-lg">
              <Sparkles size={24} />
            </span>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight">
                Verb Mastery 🔤
              </h1>
              <p className="text-xs md:text-sm text-slate-400 font-medium">
                V1, V2, V3 Forms • Business & Freelance Verbs • Interactive Quiz Practice
              </p>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          <button
            onClick={startPracticeQuiz}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs md:text-sm font-extrabold shadow-lg transition-all"
          >
            <Target size={16} />
            Start Practice Quiz
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 w-fit">
        {[
          { id: 'learn', label: '📅 Seekho (1-by-1)', count: learnList.length },
          { id: 'all', label: '📚 Sabhi Verbs', count: VERBS.length },
          { id: 'practice', label: '🎯 Practice Quiz' },
          { id: 'progress', label: '📊 Progress Stats' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => {
              setActiveTab(t.id as VerbTabType)
              if (t.id === 'practice' && quizQuestions.length === 0) {
                startPracticeQuiz()
              }
            }}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition-all',
              activeTab === t.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            )}
          >
            <span>{t.label}</span>
            {t.count !== undefined && (
              <span className={cn(
                'text-[10px] px-1.5 py-0.5 rounded-full font-black',
                activeTab === t.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
              )}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ─── TAB 1: LEARN (1-by-1 Flashcard Mode) ─── */}
      {activeTab === 'learn' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Filters for learning */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'Sabhi Verbs' },
                { id: 'irregular', label: '🔀 Irregular' },
                { id: 'business', label: '💼 Business' },
                { id: 'freelance', label: '🖥️ Freelance' },
                { id: 'interview', label: '🎯 Interview' },
                { id: 'regular', label: '📝 Regular' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-bold transition-all border',
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:border-slate-600'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Level Filter */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-slate-500 mr-1">Level:</span>
              {['all', 'A0', 'A1', 'A2', 'B1', 'B2'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={cn(
                    'px-2 py-0.5 rounded-md text-[11px] font-bold transition-all border',
                    selectedLevel === lvl
                      ? 'bg-purple-600 text-white border-purple-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  )}
                >
                  {lvl.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Flashcard Area */}
          {learnList.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800 p-6 space-y-3">
              <p className="text-4xl">🎉</p>
              <h3 className="text-lg font-bold text-slate-200">Sabhi selected verbs seekh liye hain!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Filter badal kar doosri categories ya levels ke verbs seekhein, ya Practice Quiz dekar test karein.
              </p>
              <button
                onClick={() => { setSelectedCategory('all'); setSelectedLevel('all'); }}
                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs mt-2"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Header with counter */}
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-black text-blue-400 uppercase tracking-widest">
                  Verb {currentIdx + 1} of {learnList.length}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentIdx === 0}
                    onClick={() => { setIsFlipped(false); setCurrentIdx(prev => Math.max(0, prev - 1)); }}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button
                    disabled={currentIdx >= learnList.length - 1}
                    onClick={() => { setIsFlipped(false); setCurrentIdx(prev => Math.min(learnList.length - 1, prev + 1)); }}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / learnList.length) * 100}%` }}
                />
              </div>

              {/* 3D Verb Card */}
              <div className="flex justify-center py-4">
                <div className="w-full max-w-md">
                  <VerbCard
                    word={learnList[currentIdx]}
                    isFlipped={isFlipped}
                    onFlip={() => setIsFlipped(!isFlipped)}
                    onKnow={() => handleMarkVerb('known')}
                    onLearning={() => handleMarkVerb('learning')}
                  />
                </div>
              </div>

              {/* Quick Bottom Actions */}
              <div className="flex justify-center gap-3 max-w-md mx-auto">
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                >
                  <RotateCcw size={14} />
                  {isFlipped ? 'Show Front' : 'Flip for Tricks'}
                </button>
                <button
                  onClick={() => speak(learnList[currentIdx]?.word || '')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-blue-400 text-xs font-bold transition"
                >
                  <Volume2 size={14} />
                  Pronounce
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ─── TAB 2: ALL VERBS (Search & Reference) ─── */}
      {activeTab === 'all' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          {/* Search bar & filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            {/* Search Input */}
            <div className="relative col-span-1 md:col-span-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search word, Hindi, V2, V3..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3 py-2 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
              />
            </div>

            {/* Category Select */}
            <div>
              <select
                value={refCategory}
                onChange={(e) => setRefCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Categories ({VERBS.length})</option>
                <option value="irregular">🔀 Irregular Verbs</option>
                <option value="business">💼 Business Verbs</option>
                <option value="freelance">🖥️ Freelance Verbs</option>
                <option value="interview">🎯 Interview Verbs</option>
                <option value="regular">📝 Regular Verbs</option>
              </select>
            </div>

            {/* Level Select */}
            <div>
              <select
                value={refLevel}
                onChange={(e) => setRefLevel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All CEFR Levels</option>
                <option value="A0">A0 — Absolute Beginner</option>
                <option value="A1">A1 — Beginner</option>
                <option value="A2">A2 — Elementary</option>
                <option value="B1">B1 — Intermediate</option>
                <option value="B2">B2 — Upper Intermediate</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Showing <strong className="text-slate-200">{filteredRefVerbs.length}</strong> verbs</span>
            <span>Tap card to see Memory Trick & Example</span>
          </div>

          {/* Verb Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRefVerbs.map(verb => (
              <VerbCard
                key={verb.word}
                word={verb}
                isFlipped={flippedCards[verb.word] || false}
                onFlip={() => setFlippedCards(p => ({ ...p, [verb.word]: !p[verb.word] }))}
                onKnow={() => saveProgressState(verb.word, 'known')}
                onLearning={() => saveProgressState(verb.word, 'learning')}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* ─── TAB 3: PRACTICE QUIZ ─── */}
      {activeTab === 'practice' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
          {!quizFinished && quizQuestions.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
              {/* Question progress */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-blue-400 uppercase tracking-widest">
                  Question {quizIdx + 1} of {quizQuestions.length}
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Score: {quizScore}
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
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 space-y-2">
                <p className="text-sm md:text-base font-bold text-slate-100 whitespace-pre-line leading-relaxed">
                  {quizQuestions[quizIdx].prompt}
                </p>
                {quizQuestions[quizIdx].sentenceHindi && (
                  <p className="text-xs text-slate-400 italic">
                    {quizQuestions[quizIdx].sentenceHindi}
                  </p>
                )}
              </div>

              {/* Input Area (Type A: Fill in blank, Type B/C: Options) */}
              {quizQuestions[quizIdx].type === 'v2_fill' ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    disabled={quizAnswered}
                    value={quizTypedAnswer}
                    onChange={(e) => setQuizTypedAnswer(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !quizAnswered && quizTypedAnswer.trim()) handleQuizSubmit(quizTypedAnswer); }}
                    placeholder="Type V2 past form here..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-base font-bold text-slate-100 focus:outline-none focus:border-blue-500"
                    autoFocus
                  />
                  {!quizAnswered && (
                    <button
                      disabled={!quizTypedAnswer.trim()}
                      onClick={() => handleQuizSubmit(quizTypedAnswer)}
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-black uppercase tracking-wider transition"
                    >
                      Check Answer
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2.5">
                  {quizQuestions[quizIdx].options?.map((opt, i) => {
                    const isSelected = quizSelectedOption === opt
                    const isCorrect = opt.trim() === quizQuestions[quizIdx].correctAnswer.trim()
                    
                    let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                    if (quizAnswered) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-500/15 border-rose-500 text-rose-300'
                      }
                    }

                    return (
                      <button
                        key={i}
                        disabled={quizAnswered}
                        onClick={() => handleQuizSubmit(opt)}
                        className={cn(
                          'w-full text-left p-3.5 rounded-xl border text-xs md:text-sm font-semibold transition-all flex items-center justify-between',
                          btnStyle
                        )}
                      >
                        <span>{opt}</span>
                        {quizAnswered && isCorrect && <Check size={16} className="text-emerald-400 flex-shrink-0" />}
                        {quizAnswered && isSelected && !isCorrect && <X size={16} className="text-rose-400 flex-shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Explanation & Next */}
              {quizAnswered && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <p className="font-bold text-amber-400">💡 Explanation:</p>
                    <p className="text-slate-300">{quizQuestions[quizIdx].explanation}</p>
                  </div>

                  <button
                    onClick={handleNextQuiz}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black uppercase tracking-wider shadow-lg transition"
                  >
                    {quizIdx < quizQuestions.length - 1 ? 'Next Question →' : 'View Final Score 🎉'}
                  </button>
                </motion.div>
              )}
            </div>
          )}

          {/* Quiz Complete Screen */}
          {quizFinished && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center mx-auto text-white shadow-xl">
                <Award size={32} />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-100">Quiz Completed!</h2>
                <p className="text-sm text-slate-400">
                  Aapne <strong className="text-emerald-400">{quizQuestions.length}</strong> mein se <strong className="text-blue-400">{quizScore}</strong> sahi answers diye.
                </p>
              </div>

              {/* Score card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 inline-block px-8">
                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  {Math.round((quizScore / quizQuestions.length) * 100)}%
                </span>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Accuracy</p>
              </div>

              {/* Wrong answers review */}
              {wrongAnswers.length > 0 && (
                <div className="text-left space-y-2 pt-2">
                  <p className="text-xs font-bold text-slate-400">Review mistakes:</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {wrongAnswers.map((w, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                        <span className="font-bold text-slate-200">{w.verb.word}</span>: Correct answer was <strong className="text-emerald-400">{w.correctAnswer}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={startPracticeQuiz}
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs transition"
                >
                  Play Again 🔄
                </button>
                <button
                  onClick={() => setActiveTab('learn')}
                  className="flex-1 py-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 font-extrabold text-xs transition"
                >
                  Back to Learning
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ─── TAB 4: PROGRESS STATS ─── */}
      {activeTab === 'progress' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Metric cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-slate-400">Total Verbs</span>
              <p className="text-2xl md:text-3xl font-black text-slate-100">{VERBS.length}</p>
              <span className="text-[10px] text-slate-500">In curriculum</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/20 bg-emerald-500/5 space-y-1">
              <span className="text-xs font-bold text-emerald-400">Mastered ⭐</span>
              <p className="text-2xl md:text-3xl font-black text-emerald-400">{totalMastered}</p>
              <span className="text-[10px] text-emerald-500 font-semibold">Janta hoon</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-blue-500/20 bg-blue-500/5 space-y-1">
              <span className="text-xs font-bold text-blue-400">Learning 📖</span>
              <p className="text-2xl md:text-3xl font-black text-blue-400">{totalLearning}</p>
              <span className="text-[10px] text-blue-500 font-semibold">Seekh raha hoon</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-slate-400">Remaining</span>
              <p className="text-2xl md:text-3xl font-black text-slate-300">{Math.max(0, totalRemaining)}</p>
              <span className="text-[10px] text-slate-500">Pending review</span>
            </div>
          </div>

          {/* Category breakdown */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-100">Category Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(VERB_CATEGORIES).map(([catKey, catMeta]) => {
                const count = VERBS.filter(v => v.category === catKey).length
                const masteredInCat = VERBS.filter(v => v.category === catKey && learnProgress[v.word] === 'known').length
                const pct = count > 0 ? Math.round((masteredInCat / count) * 100) : 0

                return (
                  <div key={catKey} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">
                        {catMeta.emoji} {catMeta.name}
                      </span>
                      <span className="text-xs font-black text-blue-400">{masteredInCat}/{count} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
