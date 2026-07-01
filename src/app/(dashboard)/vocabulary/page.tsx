'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, Calendar, RefreshCw, HelpCircle, Volume2, 
  Check, X, Award, ChevronDown, ChevronUp, AlertCircle, 
  ArrowRight, CheckCircle2, BookOpenCheck 
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { useKokoroTTS } from '@/hooks/useKokoroTTS'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'
import { VOCABULARY_WORDS, VOCABULARY_TOPICS, VocabularyWord } from '@/data/vocabulary-curriculum'

type TabType = 'today' | 'topics' | 'revision' | 'quiz'

interface LearnedWordJoin {
  word_id: string
  mastered: boolean
  correct_count: number
  incorrect_count: number
  next_review_date: string
  seen_count: number
  vocabulary: {
    word: string
  }
}

export default function VocabularyPage() {
  const { profile } = useAuth()
  const { speak } = useKokoroTTS()
  
  const [activeTab, setActiveTab] = useState<TabType>('today')
  const [loading, setLoading] = useState(true)
  
  // Data lists
  const [todayWords, setTodayWords] = useState<VocabularyWord[]>([])
  const [learnedWords, setLearnedWords] = useState<LearnedWordJoin[]>([])
  const [revisionWords, setRevisionWords] = useState<VocabularyWord[]>([])
  
  // Tab 1: Today's Words States
  const [todayIdx, setTodayIdx] = useState(0)
  const [isFlippedToday, setIsFlippedToday] = useState(false)
  const [todayReviewed, setTodayReviewed] = useState<{ [key: string]: 'known' | 'learning' }>({})
  const [loggingReview, setLoggingReview] = useState(false)
  
  // Tab 2: Topics States
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null)
  
  // Tab 3: Revision States
  const [revisionIdx, setRevisionIdx] = useState(0)
  const [isFlippedRevision, setIsFlippedRevision] = useState(false)
  const [revisionReviewed, setRevisionReviewed] = useState<Set<string>>(new Set())

  // Tab 4: Quiz States
  const [quizQuestions, setQuizQuestions] = useState<any[]>([])
  const [currentQIdx, setCurrentQIdx] = useState(0)
  const [quizSelected, setQuizSelected] = useState<any>(null)
  const [quizTypedAnswer, setQuizTypedAnswer] = useState('')
  const [quizAnswered, setQuizAnswered] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)
  const [wrongAnswersList, setWrongAnswersList] = useState<VocabularyWord[]>([])
  const [savingWordState, setSavingWordState] = useState<{[key: string]: boolean}>({})

  const handleSaveWord = async (wordStr: string) => {
    setSavingWordState(prev => ({ ...prev, [wordStr]: true }))
    try {
      const res = await fetch('/api/vocabulary/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: wordStr })
      })
      const json = await res.json()
      if (json.success) {
        toast.success('Word saved! ⭐')
        await loadVocabularyData()
      } else {
        toast.error('Word save nahi ho paya.')
      }
    } catch (e) {
      console.error(e)
      toast.error('Word save nahi ho paya.')
    } finally {
      setSavingWordState(prev => ({ ...prev, [wordStr]: false }))
    }
  }

  // Sync tab from URL query params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const tab = params.get('tab')
      if (tab === 'revision' || tab === 'topics' || tab === 'quiz' || tab === 'today') {
        setActiveTab(tab as TabType)
      }
    }
  }, [])

  // On mount and profile change
  useEffect(() => {
    if (!profile) return
    loadVocabularyData()
  }, [profile]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadVocabularyData = async () => {
    if (!profile?.id) return
    setLoading(true)
    try {
      // 1. Load today's 5 words from API
      const res = await fetch(`/api/vocabulary?level=${profile?.level ?? 'A1'}`)
      const json = await res.json()
      if (json.success && json.data?.words) {
        setTodayWords(json.data.words)
      } else {
        // Local fallback
        const levelMatched = VOCABULARY_WORDS.filter(w => w.level === (profile?.level ?? 'A1'))
        setTodayWords(levelMatched.slice(0, 5))
      }

      // 2. Load learned words from Supabase
      const { data: learnedList, error } = await supabase
        .from('learned_words')
        .select('word_id, mastered, correct_count, incorrect_count, next_review_date, seen_count, vocabulary(word)')
        .eq('user_id', profile.id)

      const parsedLearned = (learnedList || []) as unknown as LearnedWordJoin[]
      setLearnedWords(parsedLearned)

      // 3. Compute revision words
      const seenWordNames = new Set(parsedLearned.map(l => l.vocabulary?.word?.toLowerCase()))
      const dueWords = parsedLearned.filter(l => {
        if (!l.next_review_date || l.mastered) return false
        const dueDate = new Date(l.next_review_date)
        return dueDate <= new Date()
      })

      const revisionList: VocabularyWord[] = []
      dueWords.forEach(dw => {
        const found = VOCABULARY_WORDS.find(w => w.word.toLowerCase() === dw.vocabulary?.word?.toLowerCase())
        if (found) revisionList.push(found)
      })
      setRevisionWords(revisionList)

    } catch (e) {
      console.error(e)
      toast.error('Data load karne mein dikkat aayi.')
    } finally {
      setLoading(false)
    }
  }

  // Handle flashcard study clicks
  const handleReviewWord = async (word: VocabularyWord, type: 'known' | 'learning') => {
    if (loggingReview) return
    setLoggingReview(true)
    
    const isCorrect = type === 'known'
    try {
      const res = await fetch('/api/vocabulary/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: word.word, correct: isCorrect })
      })
      const json = await res.json()
      if (json.success) {
        toast.success('Word saved! ⭐')
        if (activeTab === 'today') {
          setTodayReviewed(prev => ({ ...prev, [word.word]: type }))
          setTimeout(() => {
            setIsFlippedToday(false)
            if (todayIdx < todayWords.length - 1) {
              setTodayIdx(prev => prev + 1)
            }
          }, 300)
        } else if (activeTab === 'revision') {
          setRevisionReviewed(prev => {
            const next = new Set(prev)
            next.add(word.word)
            return next
          })
          setTimeout(() => {
            setIsFlippedRevision(false)
            if (revisionIdx < revisionWords.length - 1) {
              setRevisionIdx(prev => prev + 1)
            }
          }, 300)
        }
      } else {
        toast.error('Progress sync nahi ho paya.')
      }
    } catch (e) {
      console.error(e)
      toast.error('Progress save nahi ho saki.')
    } finally {
      setLoggingReview(false)
    }
  }

  // Setup 10-Question Quiz
  const startQuiz = () => {
    // Collect candidate words: mix of today's + revision + level matched
    const candidates = Array.from(new Set([
      ...todayWords,
      ...revisionWords,
      ...VOCABULARY_WORDS.filter(w => w.level === (profile?.level ?? 'A1'))
    ])).slice(0, 30) // Cap to avoid massive arrays

    // Shuffle and pick 10
    const shuffled = [...candidates].sort(() => Math.random() - 0.5).slice(0, 10)
    
    // Generate questions
    const questions = shuffled.map((vocab, index) => {
      const type = index % 3 === 0 ? 'A' : (index % 3 === 1 ? 'B' : 'C') // Type A, B, C
      
      let options: string[] = []
      let correctAns = ''

      if (type === 'A') {
        // Pick Hindi meanings
        correctAns = vocab.meaning_hindi
        const others = VOCABULARY_WORDS
          .filter(w => w.word !== vocab.word)
          .map(w => w.meaning_hindi)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
        options = [correctAns, ...others].sort(() => Math.random() - 0.5)
      }

      return {
        wordObj: vocab,
        type,
        options,
        correctAns
      }
    })

    setQuizQuestions(questions)
    setCurrentQIdx(0)
    setQuizSelected(null)
    setQuizTypedAnswer('')
    setQuizAnswered(false)
    setQuizScore(0)
    setQuizFinished(false)
    setWrongAnswersList([])
    setActiveTab('quiz')
  }

  // Quiz submission handler
  const handleQuizAnswer = async (ans: string) => {
    if (quizAnswered) return
    setQuizAnswered(true)

    const q = quizQuestions[currentQIdx]
    let isCorrect = false

    if (q.type === 'A') {
      setQuizSelected(ans)
      isCorrect = ans === q.correctAns
    } else if (q.type === 'B') {
      const cleanInput = quizTypedAnswer.trim().toLowerCase()
      const cleanTarget = q.wordObj.word.trim().toLowerCase()
      isCorrect = cleanInput === cleanTarget
    } else if (q.type === 'C') {
      const cleanInput = quizTypedAnswer.trim().toLowerCase()
      const cleanTarget = q.wordObj.word.trim().toLowerCase()
      isCorrect = cleanInput === cleanTarget
    }

    if (isCorrect) {
      setQuizScore(s => s + 1)
      toast.success('Sahi jawab! 🌟')
    } else {
      setWrongAnswersList(prev => [...prev, q.wordObj])
      toast.error('Galat jawab. Rule/Word samjhein.')
    }

    // Sync score update to Supabase Review API in the background
    fetch('/api/vocabulary/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word: q.wordObj.word, correct: isCorrect })
    }).catch(e => console.error('Background review sync error:', e))
  }

  const handleNextQuizQ = () => {
    setQuizSelected(null)
    setQuizTypedAnswer('')
    setQuizAnswered(false)
    if (currentQIdx < quizQuestions.length - 1) {
      setCurrentQIdx(prev => prev + 1)
    } else {
      setQuizFinished(true)
      // Reload overall learned counts
      loadVocabularyData()
    }
  }

  // Helper stats
  const masteredCount = learnedWords.filter(w => w.mastered).length
  const totalTopicWords = (topicName: string) => VOCABULARY_WORDS.filter(w => w.topic === topicName).length
  const learnedTopicWords = (topicName: string) => {
    const topicWordsSet = new Set(VOCABULARY_WORDS.filter(w => w.topic === topicName).map(w => w.word.toLowerCase()))
    return learnedWords.filter(lw => topicWordsSet.has(lw.vocabulary?.word?.toLowerCase())).length
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      
      {/* 3D Flip Card CSS Injection */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4" style={{ borderColor: '#334155' }}>
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2" style={{ color: '#F1F5F9' }}>
            Vocabulary Builder 📖
          </h1>
          <p className="text-xs text-slate-400 mt-1">Spaced repetition aur active quizzes ke sath English vocabulary seekhein.</p>
        </div>

        {/* Level & Mastery Count */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300">
            Level: <span className="font-extrabold text-blue-400">{profile?.level ?? 'A1'}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300">
            Mastered: <span className="font-extrabold text-emerald-400">{masteredCount} words</span>
          </div>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="flex flex-wrap gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start">
        {[
          { id: 'today', label: '📅 Aaj ke Words', count: todayWords.length - Object.keys(todayReviewed).length },
          { id: 'topics', label: '📚 Sab Topics' },
          { id: 'revision', label: '🔄 Revision', count: revisionWords.length - revisionReviewed.size },
          { id: 'quiz', label: '❓ Quiz' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => {
              setActiveTab(t.id as TabType)
              if (t.id === 'quiz' && quizQuestions.length === 0) {
                startQuiz()
              }
            }}
            className={cn(
              'px-4 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all flex items-center gap-1.5',
              activeTab === t.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 bg-transparent'
            )}
          >
            <span>{t.label}</span>
            {t.count !== undefined && t.count > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-red-500 text-white animate-pulse">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main Tab View Area */}
      <div className="rounded-2xl border p-6 min-h-[460px] flex flex-col justify-between"
        style={{ background: '#1E293B', borderColor: '#334155' }}>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="loading-spinner text-blue-500 animate-spin w-8 h-8 rounded-full border-4 border-t-transparent border-blue-500" />
            <p className="text-xs text-slate-400 font-semibold">Vocabulary data load ho raha hai...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            
            {/* TAB 1: TODAY'S WORDS */}
            {activeTab === 'today' && (
              <motion.div key="today" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 flex-1 flex flex-col justify-between">
                
                {todayIdx < todayWords.length ? (
                  <div className="space-y-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Today's Word {todayIdx + 1} of {todayWords.length}</span>
                      <h3 className="text-sm font-bold text-slate-400 mt-0.5">Naya word seekhein aur click karke check karein</h3>
                    </div>

                    {/* Flipping card */}
                    <div className="flex justify-center py-6">
                      <div 
                        onClick={() => setIsFlippedToday(!isFlippedToday)}
                        className="w-full max-w-sm h-64 perspective-1000 cursor-pointer"
                      >
                        <div className={cn(
                          "w-full h-full duration-500 transform-style-3d relative rounded-2xl border p-6 flex items-center justify-center text-center shadow-lg transition-transform",
                          isFlippedToday && "rotate-y-180"
                        )}
                        style={{ background: '#0F172A', borderColor: isFlippedToday ? '#8B5CF6' : '#334155' }}>
                          
                          {/* Front Side */}
                          <div className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center p-6 space-y-4">
                            <h2 className="text-3xl font-black text-slate-100">{todayWords[todayIdx].word}</h2>
                            <span className="text-xs font-semibold text-blue-400 flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10">
                              🔊 {todayWords[todayIdx].pronunciation}
                            </span>
                            <p className="text-[10px] text-slate-500 font-medium">Card ko flip karne ke liye click karein</p>
                          </div>

                          {/* Back Side */}
                          <div className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col justify-between p-6">
                            <div className="space-y-2 text-left">
                              <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider">Hindi Meaning</span>
                              <p className="text-base font-bold text-slate-200">{todayWords[todayIdx].meaning_hindi}</p>
                            </div>

                            <div className="space-y-1.5 text-left border-t border-slate-800/80 pt-2">
                              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Example</span>
                              <p className="text-xs text-slate-300 font-medium italic">"{todayWords[todayIdx].example}"</p>
                              <p className="text-[10px] text-slate-400">{todayWords[todayIdx].example_hindi}</p>
                            </div>

                            <div className="p-2.5 rounded-lg border border-amber-900/30 bg-amber-500/5 text-left mt-2 flex items-start gap-1.5">
                              <span className="text-[10px]">💡</span>
                              <p className="text-[10px] text-amber-300 font-semibold leading-relaxed">{todayWords[todayIdx].memory_trick}</p>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>

                    {/* Study Controls */}
                    <div className="space-y-4 max-w-sm mx-auto w-full">
                      <div className="flex gap-3">
                        <button
                          disabled={loggingReview}
                          onClick={() => handleReviewWord(todayWords[todayIdx], 'learning')}
                          className="flex-1 py-3 rounded-xl border border-slate-700 bg-slate-900/40 text-slate-300 hover:border-slate-500 text-xs font-extrabold transition-all"
                        >
                          📖 Seekh raha hoon
                        </button>
                        <button
                          disabled={loggingReview}
                          onClick={() => handleReviewWord(todayWords[todayIdx], 'known')}
                          className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <Check size={14} /> Janta hoon
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold px-1">
                        <button 
                          disabled={todayIdx === 0} 
                          onClick={() => { setTodayIdx(prev => prev - 1); setIsFlippedToday(false) }}
                          className="hover:text-slate-300 disabled:opacity-30"
                        >
                          ← Pichla Word
                        </button>
                        <button 
                          onClick={() => speak(todayWords[todayIdx].word)}
                          className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        >
                          <Volume2 size={12} /> Pronounce
                        </button>
                        <button 
                          onClick={() => { setTodayIdx(prev => prev + 1); setIsFlippedToday(false) }}
                          className="hover:text-slate-300"
                        >
                          Agla Word →
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Completed Study panel */
                  <div className="text-center space-y-6 py-12 flex-1 flex flex-col justify-center items-center">
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <BookOpenCheck size={32} className="text-blue-500" />
                    </div>
                    <div className="space-y-2 max-w-sm">
                      <h3 className="text-xl font-bold text-slate-200">Aaj ke Words Complete! 🎉</h3>
                      <p className="text-xs text-slate-400">Aapne aaj ke sabhi naye words review kar liye hain. Ab unhe pakka karne ke liye quiz dijiye!</p>
                    </div>

                    <div className="flex gap-3 w-full max-w-xs">
                      <button
                        onClick={() => { setTodayIdx(0); setTodayReviewed({}) }}
                        className="flex-1 py-3 rounded-xl border border-slate-700 bg-transparent text-slate-300 text-xs font-extrabold hover:border-slate-500 transition-all"
                      >
                        Reset Study
                      </button>
                      <button
                        onClick={startQuiz}
                        className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold transition-all shadow-md"
                      >
                        🎯 Quiz Lo
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 2: ALL TOPICS */}
            {activeTab === 'topics' && (
              <motion.div key="topics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 flex-1">
                <div>
                  <h2 className="text-lg font-bold text-slate-200">Sab Vocabulary Topics</h2>
                  <p className="text-xs text-slate-400">Har topic ke andar kitne words aapne seekhe hain uska tracking.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.keys(VOCABULARY_TOPICS).map(topicName => {
                    const top = VOCABULARY_TOPICS[topicName]
                    const learned = learnedTopicWords(topicName)
                    const total = totalTopicWords(topicName)
                    const percent = total > 0 ? Math.round((learned / total) * 100) : 0
                    const isExpanded = expandedTopic === topicName

                    return (
                      <div key={topicName} className="col-span-1 md:col-span-3 rounded-xl border p-4 space-y-4 transition-all"
                        style={{ background: '#0F172A', borderColor: isExpanded ? '#2563EB' : '#334155' }}>
                        
                        <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedTopic(isExpanded ? null : topicName)}>
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{top.emoji}</span>
                            <div>
                              <h4 className="text-sm font-bold text-slate-200">{top.name}</h4>
                              <span className="text-[10px] font-semibold text-slate-500">Level: {top.level}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-right">
                            <div className="space-y-1">
                              <span className="text-xs font-bold text-slate-300">{learned} / {total} words</span>
                              <div className="w-24 bg-slate-800 rounded-full h-1.5">
                                <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${percent}%` }} />
                              </div>
                            </div>
                            {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                          </div>
                        </div>

                        {/* Expanded Word List */}
                        {isExpanded && (
                          <div className="border-t border-slate-800/80 pt-4 space-y-2 max-h-72 overflow-y-auto pr-1">
                            {VOCABULARY_WORDS.filter(w => w.topic === topicName).map(w => {
                              const lw = learnedWords.find(l => l.vocabulary?.word?.toLowerCase() === w.word.toLowerCase())
                              const isLearned = !!lw
                              const isMastered = lw?.mastered

                              return (
                                <div key={w.word} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/30 border border-slate-800/40 text-xs">
                                  <div className="flex items-center gap-3">
                                    <button onClick={() => speak(w.word)} className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors">
                                      <Volume2 size={13} />
                                    </button>
                                    <div>
                                      <span className="font-extrabold text-slate-200">{w.word}</span>
                                      <span className="text-[9px] text-slate-500 italic ml-1 px-1.5 py-0.5 rounded bg-slate-800">
                                        {w.pronunciation}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4">
                                    <span className="text-slate-400 font-semibold">{w.meaning_hindi}</span>
                                    <span>
                                      {isMastered ? (
                                        <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                          Mastered ✓
                                        </span>
                                      ) : isLearned ? (
                                        <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                                          Learning •
                                        </span>
                                      ) : (
                                        <button
                                          onClick={() => handleSaveWord(w.word)}
                                          disabled={savingWordState[w.word]}
                                          className="text-[10px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded-full border border-slate-700 transition-all flex items-center gap-1 active:scale-95 disabled:opacity-50 cursor-pointer"
                                        >
                                          {savingWordState[w.word] ? 'Saving...' : 'Save word ⭐'}
                                        </button>
                                      )}
                                    </span>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}

                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* TAB 3: REVISION DECK */}
            {activeTab === 'revision' && (
              <motion.div key="revision" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 flex-1 flex flex-col justify-between">
                
                {revisionWords.length > 0 && revisionIdx < revisionWords.length ? (
                  <div className="space-y-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Revision Word {revisionIdx + 1} of {revisionWords.length}</span>
                      <h3 className="text-sm font-bold text-slate-400 mt-0.5">Spaced repetition revision task</h3>
                    </div>

                    {/* Flipping revision card */}
                    <div className="flex justify-center py-6">
                      <div 
                        onClick={() => setIsFlippedRevision(!isFlippedRevision)}
                        className="w-full max-w-sm h-64 perspective-1000 cursor-pointer"
                      >
                        <div className={cn(
                          "w-full h-full duration-500 transform-style-3d relative rounded-2xl border p-6 flex items-center justify-center text-center shadow-lg transition-transform",
                          isFlippedRevision && "rotate-y-180"
                        )}
                        style={{ background: '#0F172A', borderColor: isFlippedRevision ? '#8B5CF6' : '#334155' }}>
                          
                          {/* Front */}
                          <div className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center p-6 space-y-4">
                            <h2 className="text-3xl font-black text-slate-100">{revisionWords[revisionIdx].word}</h2>
                            <span className="text-xs font-semibold text-purple-400 flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10">
                              🔊 {revisionWords[revisionIdx].pronunciation}
                            </span>
                            <p className="text-[10px] text-slate-500 font-medium">Click to flip and review meaning</p>
                          </div>

                          {/* Back */}
                          <div className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col justify-between p-6">
                            <div className="space-y-2 text-left">
                              <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider">Hindi Meaning</span>
                              <p className="text-base font-bold text-slate-200">{revisionWords[revisionIdx].meaning_hindi}</p>
                            </div>

                            <div className="space-y-1.5 text-left border-t border-slate-800/80 pt-2">
                              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Example</span>
                              <p className="text-xs text-slate-300 font-medium italic">"{revisionWords[revisionIdx].example}"</p>
                              <p className="text-[10px] text-slate-400">{revisionWords[revisionIdx].example_hindi}</p>
                            </div>

                            <div className="p-2.5 rounded-lg border border-amber-900/30 bg-amber-500/5 text-left mt-2 flex items-start gap-1.5">
                              <span className="text-[10px]">💡</span>
                              <p className="text-[10px] text-amber-300 font-semibold leading-relaxed">{revisionWords[revisionIdx].memory_trick}</p>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="space-y-4 max-w-sm mx-auto w-full">
                      <div className="flex gap-3">
                        <button
                          disabled={loggingReview}
                          onClick={() => handleReviewWord(revisionWords[revisionIdx], 'learning')}
                          className="flex-1 py-3 rounded-xl border border-slate-700 bg-slate-900/40 text-red-400 hover:border-slate-500 text-xs font-extrabold transition-all flex items-center justify-center gap-1.5"
                        >
                          <X size={14} /> Bhool gaya
                        </button>
                        <button
                          disabled={loggingReview}
                          onClick={() => handleReviewWord(revisionWords[revisionIdx], 'known')}
                          className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <Check size={14} /> Yaad hai
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold px-1">
                        <button 
                          disabled={revisionIdx === 0} 
                          onClick={() => { setRevisionIdx(prev => prev - 1); setIsFlippedRevision(false) }}
                          className="hover:text-slate-300 disabled:opacity-30"
                        >
                          ← Previous
                        </button>
                        <button 
                          onClick={() => speak(revisionWords[revisionIdx].word)}
                          className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
                        >
                          <Volume2 size={12} /> Pronounce
                        </button>
                        <button 
                          onClick={() => { setRevisionIdx(prev => prev + 1); setIsFlippedRevision(false) }}
                          className="hover:text-slate-300"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* No due revision */
                  <div className="text-center space-y-6 py-16 flex-1 flex flex-col justify-center items-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 size={32} className="text-emerald-500" />
                    </div>
                    <div className="space-y-2 max-w-xs">
                      <h3 className="text-xl font-bold text-slate-200">Sari Revision Complete! 🎉</h3>
                      <p className="text-xs text-slate-400">Aaj koi revision baaki nahi hai. Aapki vocabulary memory fully active hai!</p>
                    </div>
                    <button
                      onClick={() => { setRevisionIdx(0); setRevisionReviewed(new Set()); loadVocabularyData() }}
                      className="px-6 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 text-xs font-extrabold transition-all"
                    >
                      Check Again
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 4: QUIZ MODULE */}
            {activeTab === 'quiz' && (
              <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 flex-1 flex flex-col justify-between">
                
                {!quizFinished ? (
                  quizQuestions.length > 0 && quizQuestions[currentQIdx] && (
                    <div className="space-y-6">
                      
                      {/* Progress Bar */}
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-400 border-b border-slate-800 pb-2">
                        <span>Question {currentQIdx + 1} of 10</span>
                        <span>Score: {quizScore} / 10</span>
                      </div>

                      {/* QUESTION PANEL */}
                      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-wider">
                          {quizQuestions[currentQIdx].type === 'A' ? 'Hindi Translation' : (quizQuestions[currentQIdx].type === 'B' ? 'Type the English Word' : 'Fill in the blank')}
                        </span>
                        
                        {quizQuestions[currentQIdx].type === 'A' && (
                          <h3 className="text-2xl font-black text-slate-100">{quizQuestions[currentQIdx].wordObj.word}</h3>
                        )}
                        
                        {quizQuestions[currentQIdx].type === 'B' && (
                          <div className="space-y-2">
                            <h3 className="text-lg font-medium text-slate-300">Is meaning ka English word kya hai?</h3>
                            <h2 className="text-2xl font-black text-slate-100">"{quizQuestions[currentQIdx].wordObj.meaning_hindi}"</h2>
                            <p className="text-[10px] text-slate-500 italic">Example tip: {quizQuestions[currentQIdx].wordObj.example_hindi}</p>
                          </div>
                        )}

                        {quizQuestions[currentQIdx].type === 'C' && (
                          <div className="space-y-2">
                            <h3 className="text-lg font-medium text-slate-400">Complete the sentence:</h3>
                            <h2 className="text-xl font-bold text-slate-100 italic leading-relaxed">
                              "{quizQuestions[currentQIdx].wordObj.example.replace(
                                new RegExp(quizQuestions[currentQIdx].wordObj.word, 'gi'), 
                                '_______'
                              )}"
                            </h2>
                            <p className="text-[10px] text-slate-500 font-semibold italic">Hindi: "{quizQuestions[currentQIdx].wordObj.example_hindi}"</p>
                          </div>
                        )}
                      </div>

                      {/* ANSWERS PORT */}
                      
                      {/* TYPE A: MCQ OPTIONS */}
                      {quizQuestions[currentQIdx].type === 'A' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {quizQuestions[currentQIdx].options.map((opt: string, idx: number) => {
                            const isCorrect = opt === quizQuestions[currentQIdx].correctAns
                            const isSelected = opt === quizSelected
                            const borderStyle = quizAnswered
                              ? isCorrect
                                ? 'border-emerald-500 bg-emerald-500/5 text-emerald-400'
                                : isSelected
                                ? 'border-red-500 bg-red-500/5 text-red-400'
                                : 'border-slate-800 text-slate-600'
                              : 'border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800/40'

                            return (
                              <button
                                key={idx}
                                disabled={quizAnswered}
                                onClick={() => handleQuizAnswer(opt)}
                                className={cn(
                                  'px-4 py-3.5 rounded-xl border text-sm font-semibold transition-all text-left flex justify-between items-center',
                                  borderStyle
                                )}
                              >
                                <span>{opt}</span>
                                {quizAnswered && (
                                  isCorrect ? <Check size={16} className="text-emerald-500" /> : isSelected ? <span>❌</span> : null
                                )}
                              </button>
                            )
                          })}
                        </div>
                      )}

                      {/* TYPE B & C: INPUT FORM */}
                      {(quizQuestions[currentQIdx].type === 'B' || quizQuestions[currentQIdx].type === 'C') && (
                        <div className="space-y-4">
                          <input
                            type="text"
                            disabled={quizAnswered}
                            placeholder="Type English word here..."
                            value={quizTypedAnswer}
                            onChange={(e) => setQuizTypedAnswer(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && quizTypedAnswer.trim() && !quizAnswered) {
                                handleQuizAnswer(quizTypedAnswer)
                              }
                            }}
                            className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-100 text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-60"
                          />
                          
                          {!quizAnswered && (
                            <button
                              disabled={!quizTypedAnswer.trim()}
                              onClick={() => handleQuizAnswer(quizTypedAnswer)}
                              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-extrabold text-xs transition-all active:scale-95 shadow-md"
                            >
                              Check Answer
                            </button>
                          )}
                        </div>
                      )}

                      {/* Explanations and Correction Details */}
                      {quizAnswered && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2"
                        >
                          <div className="flex items-start gap-3">
                            <AlertCircle size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                            <div className="space-y-1">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Pronunciation & Meaning</span>
                              <p className="text-xs text-slate-300 font-bold">
                                {quizQuestions[currentQIdx].wordObj.word} — "{quizQuestions[currentQIdx].wordObj.meaning_hindi}"
                              </p>
                              <p className="text-[11px] text-slate-400 mt-1">
                                Pronunciation: <span className="text-blue-400 font-bold">{quizQuestions[currentQIdx].wordObj.pronunciation}</span>
                              </p>
                            </div>
                          </div>

                          <div className="p-3 rounded-lg border border-amber-900/20 bg-amber-500/5 flex items-start gap-2">
                            <span className="text-xs">💡</span>
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest">Memory Trick</span>
                              <p className="text-[11px] text-amber-300 font-medium leading-relaxed">{quizQuestions[currentQIdx].wordObj.memory_trick}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Next Question trigger */}
                      {quizAnswered && (
                        <button
                          onClick={handleNextQuizQ}
                          className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md"
                        >
                          <span>{currentQIdx < 9 ? 'Agla Question' : 'Quiz Finish Karo'}</span>
                          <ArrowRight size={14} />
                        </button>
                      )}

                    </div>
                  )
                ) : (
                  /* Quiz Scorecard */
                  <div className="text-center space-y-6 py-8 max-w-sm mx-auto">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-md">
                      <Award size={32} className="text-emerald-500" />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-slate-100">Quiz Completed!</h3>
                      <p className="text-xs text-slate-400">Aapka vocabulary score updates</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3 text-left">
                      <div className="flex justify-between items-center text-sm font-semibold border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Total Score:</span>
                        <span className="text-emerald-400 font-black text-base">{quizScore} / 10 Sahi</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-400">Performance status:</span>
                        <span className={cn('font-bold', quizScore >= 8 ? 'text-emerald-400' : (quizScore >= 5 ? 'text-amber-400' : 'text-red-400'))}>
                          {quizScore >= 8 ? '🎉 Bahut achha!' : (quizScore >= 5 ? '👍 Achha kiya' : '💪 Practice karein')}
                        </span>
                      </div>
                    </div>

                    {/* Wrong Words to Review list */}
                    {wrongAnswersList.length > 0 && (
                      <div className="text-left space-y-2 border-t border-slate-800/80 pt-4">
                        <span className="text-[10px] font-black text-red-400 uppercase tracking-widest block">In Words Ko Review Karein:</span>
                        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                          {wrongAnswersList.map((w, idx) => (
                            <div key={idx} className="p-2 rounded-lg bg-red-500/5 border border-red-950/20 flex justify-between items-center text-xs">
                              <span className="font-extrabold text-slate-200">{w.word}</span>
                              <span className="text-slate-400">{w.meaning_hindi}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={startQuiz}
                        className="flex-1 py-3 rounded-xl border border-slate-700 bg-transparent text-slate-300 text-xs font-extrabold hover:border-slate-500 transition-all"
                      >
                        Retry Quiz
                      </button>
                      <button
                        onClick={() => { setQuizQuestions([]); setQuizFinished(false); setActiveTab('today') }}
                        className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold transition-all shadow-md"
                      >
                        Main Dashboard
                      </button>
                    </div>

                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        )}
      </div>

    </div>
  )
}
