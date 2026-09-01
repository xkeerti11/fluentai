'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, BookOpen, CheckCircle2, HelpCircle, RotateCcw, 
  Search, Filter, Award, ArrowRight, ArrowLeft, Volume2, VolumeX,
  Check, X, Zap, Target, Briefcase, Laptop, Users, Bot, Send, User, 
  ChevronLeft, ChevronRight, Calendar, Mic, MicOff, Square, Sparkle
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis'
import { cn } from '@/lib/utils/cn'
import VerbCard from '@/components/vocabulary/VerbCard'
import { ALL_500_VERBS, getVerbsByDay, TOTAL_VERB_DAYS, VERB_CATEGORIES, VerbEntry } from '@/data/verb-curriculum'

type VerbTabType = 'today' | 'ai_practice' | 'quiz' | 'all'

interface ChatMessage {
  id: string
  sender: 'ai' | 'user'
  text: string
  time: string
  feedback?: string
}

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
  
  // Speech Hooks
  const { speak, stopSpeaking, speakSlower, isSpeaking } = useSpeechSynthesis()
  const {
    transcript,
    interimTranscript,
    isListening,
    isSupported: micSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition()

  const [activeTab, setActiveTab] = useState<VerbTabType>('today')
  const [selectedDay, setSelectedDay] = useState<number>(1)
  
  // Progress tracking in LocalStorage
  const [verbProgress, setVerbProgress] = useState<{ [word: string]: 'known' | 'learning' }>({})
  
  // ─── TAB 1: TODAY'S 15 VERBS (Flashcard state) ───
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [dayReviewed, setDayReviewed] = useState<{ [word: string]: 'known' | 'learning' }>({})

  // ─── TAB 2: AI VERB PRACTICE (Voice Coach state) ───
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [slowMode, setSlowMode] = useState(false)
  const chatBottomRef = useRef<HTMLDivElement>(null)

  // ─── TAB 3: QUIZ STATE ───
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [quizIdx, setQuizIdx] = useState(0)
  const [quizTypedAnswer, setQuizTypedAnswer] = useState('')
  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null)
  const [quizAnswered, setQuizAnswered] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)
  const [wrongAnswers, setWrongAnswers] = useState<QuizQuestion[]>([])

  // ─── TAB 4: ALL VERBS (Search & filter) ───
  const [searchQuery, setSearchQuery] = useState('')
  const [refCategory, setRefCategory] = useState('all')
  const [refLevel, setRefLevel] = useState('all')
  const [refDay, setRefDay] = useState<string>('all')
  const [flippedCards, setFlippedCards] = useState<{ [word: string]: boolean }>({})

  // Helper for current time format (e.g. 09:45 pm)
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase()
  }

  // Load progress from localStorage on mount
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

  // Today's 15 verbs for selected day
  const todayVerbs = useMemo(() => {
    return getVerbsByDay(selectedDay)
  }, [selectedDay])

  // Reset card index when day changes
  useEffect(() => {
    setCurrentIdx(0)
    setIsFlipped(false)
    try {
      localStorage.setItem('fluentai_verb_active_day', selectedDay.toString())
    } catch (e) {}
  }, [selectedDay])

  // Sync mic transcript into chatInput
  useEffect(() => {
    if (transcript) {
      setChatInput(transcript)
    }
  }, [transcript])

  // Scroll AI chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, aiLoading, interimTranscript])

  // Speech player helper
  const playAiVoice = (text: string) => {
    if (!voiceEnabled) return
    // Clean markdown/emojis for speech synthesis
    const cleanText = text
      .replace(/[*#_`~]/g, '')
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .trim()
    
    if (slowMode) {
      speakSlower(cleanText)
    } else {
      speak(cleanText)
    }
  }

  // Initialize AI Practice message
  const initAiPractice = () => {
    const v1 = todayVerbs[0]?.word || 'go'
    const v2 = todayVerbs[1]?.word || 'eat'
    const welcomeText = `Hello ${profile?.name || 'there'}! I'm Aria, your AI Verb Coach. Let's practice Day ${selectedDay} verbs together!\n\nToday we have verbs like "${v1}" and "${v2}". Try making a Past Tense (V2) or Present Perfect (V3) sentence using any of today's verbs. You can speak using the mic or type!`
    
    setChatMessages([
      {
        id: '1',
        sender: 'ai',
        text: welcomeText,
        time: getCurrentTime()
      }
    ])

    setTimeout(() => {
      playAiVoice(welcomeText)
    }, 600)
  }

  // Send message to AI Verb Coach
  const handleSendAiMessage = async (customText?: string) => {
    const textToSend = (customText || chatInput || transcript).trim()
    if (!textToSend || aiLoading) return

    if (isListening) {
      stopListening()
    }
    resetTranscript()
    setChatInput('')

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      time: getCurrentTime()
    }
    setChatMessages(prev => [...prev, userMsg])
    setAiLoading(true)

    try {
      const promptContext = `You are Aria, a friendly, supportive English Coach specializing in Verb Mastery.
The student is practicing Day ${selectedDay} verbs: ${todayVerbs.map(v => `${v.word} (V1:${v.v1}, V2:${v.v2}, V3:${v.v3}, Hindi:${v.meaning_hindi})`).join(', ')}.
Student said: "${textToSend}".

Your Task:
1. Praise their effort warmly.
2. Check if they used V1 (Present), V2 (Past), or V3 (Participle with have/has) correctly.
3. If there is a mistake in verb form or grammar, politely explain the correction in simple, clear Hinglish.
4. Challenge them with the next verb from Day ${selectedDay} to make another sentence.
Keep your response conversational, concise (2-4 sentences max), friendly, and easy to understand aloud.`

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: promptContext }],
          mode: 'lesson'
        })
      })

      const json = await res.json()
      const aiReply = json.data?.reply || json.reply || `Great sentence! You used the verb accurately. Now let's try making a sentence with another Day ${selectedDay} verb!`

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReply,
        time: getCurrentTime()
      }

      setChatMessages(prev => [...prev, aiMsg])
      playAiVoice(aiReply)
    } catch (err) {
      const fallbackReply = 'Good effort! Make sure to check the V2 and V3 forms. Try another sentence!'
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: fallbackReply,
        time: getCurrentTime()
      }])
      playAiVoice(fallbackReply)
    } finally {
      setAiLoading(false)
    }
  }

  // Toggle mic listening
  const handleMicToggle = () => {
    if (isListening) {
      stopListening()
      if (transcript.trim()) {
        handleSendAiMessage(transcript)
      }
    } else {
      if (isSpeaking) {
        stopSpeaking()
      }
      resetTranscript()
      setChatInput('')
      startListening()
    }
  }

  // ─── Quiz Generator ───
  const startQuiz = () => {
    const candidates = [...todayVerbs, ...ALL_500_VERBS.filter(v => v.day < selectedDay)].slice(0, 30)
    const shuffled = [...candidates].sort(() => Math.random() - 0.5).slice(0, 10)

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
        ].filter(opt => opt !== cleanV3)

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

  // Handle Flashcard Study Action
  const handleReviewVerb = (status: 'known' | 'learning') => {
    if (!todayVerbs[currentIdx]) return
    const cur = todayVerbs[currentIdx]
    saveProgressState(cur.word, status)
    toast.success(status === 'known' ? 'Marked as Mastered! ⭐' : 'Saved for practice! 📖')

    setTimeout(() => {
      setIsFlipped(false)
      if (currentIdx < todayVerbs.length - 1) {
        setCurrentIdx(prev => prev + 1)
      }
    }, 250)
  }

  // Filtered reference verbs for Tab 4
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

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-3 md:p-6 pb-24">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg">
              <Sparkles size={24} />
            </span>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight">
                Verb Mastery 🔤
              </h1>
              <p className="text-xs md:text-sm text-slate-400 font-medium">
                Roz 15 Verbs • 500+ Curated Verbs (V1-V2-V3) • AI Voice Coach & Quizzes
              </p>
            </div>
          </div>
        </div>

        {/* Day Selector & Mastered Badge */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Day Selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300">
            <Calendar size={14} className="text-blue-400" />
            <span>Day:</span>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(parseInt(e.target.value, 10))}
              className="bg-slate-900 text-blue-400 font-extrabold rounded-lg px-2 py-0.5 border border-slate-700 focus:outline-none"
            >
              {Array.from({ length: TOTAL_VERB_DAYS }, (_, i) => i + 1).map(d => (
                <option key={d} value={d}>
                  Day {d} ({15} verbs)
                </option>
              ))}
            </select>
          </div>

          {/* Mastered Badge */}
          <div className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300">
            Mastered: <span className="font-extrabold text-emerald-400">{totalMastered} verbs</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 w-fit">
        {[
          { id: 'today', label: `📅 Aaj ke 15 Verbs (Day ${selectedDay})`, count: todayVerbs.length - Object.keys(dayReviewed).length },
          { id: 'ai_practice', label: '🤖 AI Voice Coach' },
          { id: 'quiz', label: '❓ Verb Quiz' },
          { id: 'all', label: '📚 Sabhi 500 Verbs', count: ALL_500_VERBS.length }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => {
              setActiveTab(t.id as VerbTabType)
              if (t.id === 'ai_practice' && chatMessages.length === 0) {
                initAiPractice()
              }
              if (t.id === 'quiz' && quizQuestions.length === 0) {
                startQuiz()
              }
            }}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-extrabold transition-all',
              activeTab === t.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 bg-transparent'
            )}
          >
            <span>{t.label}</span>
            {t.count !== undefined && t.count > 0 && (
              <span className={cn(
                'px-1.5 py-0.5 rounded-full text-[10px] font-black',
                activeTab === t.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
              )}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ─── TAB 1: TODAY'S 15 VERBS (1-by-1 Flashcard UI Matching Images 3 & 4) ─── */}
      {activeTab === 'today' && (
        <div className="rounded-2xl border p-6 min-h-[460px] flex flex-col justify-between"
          style={{ background: '#1E293B', borderColor: '#334155' }}>
          
          {todayVerbs.length === 0 ? (
            <div className="text-center py-20 text-slate-400">Loading Day {selectedDay} verbs...</div>
          ) : currentIdx < todayVerbs.length ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              {/* Header inside card container */}
              <div>
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                  TODAY'S VERB {currentIdx + 1} OF {todayVerbs.length} (DAY {selectedDay})
                </span>
                <h3 className="text-sm font-bold text-slate-400 mt-0.5">
                  Naya verb seekhein aur click karke check karein
                </h3>
              </div>

              {/* Centered Flip Card */}
              <div className="flex justify-center py-4">
                <VerbCard
                  word={todayVerbs[currentIdx]}
                  isFlipped={isFlipped}
                  onFlip={() => setIsFlipped(!isFlipped)}
                />
              </div>

              {/* Study Controls (Below Card, Matching Image 3 & 4) */}
              <div className="space-y-4 max-w-md mx-auto w-full">
                <div className="flex gap-3">
                  <button
                    onClick={() => handleReviewVerb('learning')}
                    className="flex-1 py-3 rounded-xl border border-slate-700 bg-slate-900/40 text-slate-300 hover:border-slate-500 text-xs font-extrabold transition-all"
                  >
                    📖 Seekh raha hoon
                  </button>
                  <button
                    onClick={() => handleReviewVerb('known')}
                    className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Check size={14} /> Janta hoon
                  </button>
                </div>

                {/* Navigation Row */}
                <div className="flex justify-between items-center text-slate-400 text-xs px-1">
                  <button
                    disabled={currentIdx === 0}
                    onClick={() => { setIsFlipped(false); setCurrentIdx(p => Math.max(0, p - 1)); }}
                    className="hover:text-white transition flex items-center gap-1 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    ← Pichla Verb
                  </button>

                  <button
                    onClick={() => speak(todayVerbs[currentIdx].word)}
                    className="hover:text-blue-400 transition flex items-center gap-1 text-slate-300 font-bold"
                  >
                    <Volume2 size={15} /> Pronounce
                  </button>

                  <button
                    disabled={currentIdx >= todayVerbs.length - 1}
                    onClick={() => { setIsFlipped(false); setCurrentIdx(p => Math.min(todayVerbs.length - 1, p + 1)); }}
                    className="hover:text-white transition flex items-center gap-1 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Agla Verb →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // All 15 verbs completed for the day
            <div className="text-center py-12 space-y-6 flex-1 flex flex-col justify-center items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 size={36} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-100">
                  Day {selectedDay} ke saare 15 Verbs complete! 🎉
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Shabaash! Ab in verbs ko bolkar practice karne ke liye AI Voice Coach se baat karein ya Quiz dein.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 justify-center pt-2">
                <button
                  onClick={() => { setActiveTab('ai_practice'); initAiPractice(); }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold shadow-lg transition flex items-center gap-2"
                >
                  <Bot size={16} /> Start AI Voice Coach
                </button>
                <button
                  onClick={startQuiz}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-lg transition flex items-center gap-2"
                >
                  <Target size={16} /> Start Verb Quiz
                </button>
                {selectedDay < TOTAL_VERB_DAYS && (
                  <button
                    onClick={() => setSelectedDay(d => d + 1)}
                    className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 text-xs font-extrabold hover:bg-slate-700 transition"
                  >
                    Day {selectedDay + 1} Shuru Karein →
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: AI VOICE COACH (Full Voice Assistant like /speaking) ─── */}
      {activeTab === 'ai_practice' && (
        <div className="rounded-2xl border flex flex-col h-[580px] overflow-hidden"
          style={{ background: '#1E293B', borderColor: '#334155' }}>
          
          {/* Coach Header with Speed & Audio Controls */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/90 bg-slate-900/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                A
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-slate-100">Aria Verb Coach</span>
                  <Sparkle size={12} className="text-blue-400 fill-blue-400" />
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Day {selectedDay} Verbs Voice Practice</p>
              </div>
            </div>

            {/* Audio controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSlowMode(!slowMode)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-extrabold border transition",
                  slowMode
                    ? "bg-purple-600/20 text-purple-300 border-purple-500/40"
                    : "bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200"
                )}
                title="Toggle Speech Speed"
              >
                {slowMode ? '0.65x' : '0.85x'}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (voiceEnabled) stopSpeaking()
                  setVoiceEnabled(!voiceEnabled)
                }}
                className={cn(
                  "p-1.5 rounded-lg border transition",
                  voiceEnabled
                    ? "bg-blue-600/20 text-blue-400 border-blue-500/30"
                    : "bg-slate-800 text-slate-500 border-slate-700"
                )}
                title={voiceEnabled ? 'Mute AI Voice' : 'Unmute AI Voice'}
              >
                {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              <button
                type="button"
                onClick={initAiPractice}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 transition"
                title="Reset Conversation"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>

          {/* Quick Verb Suggestion Chips */}
          <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800/60 overflow-x-auto flex items-center gap-2 no-scrollbar">
            <span className="text-[11px] font-bold text-slate-500 flex-shrink-0">💡 Quick Practice:</span>
            {[
              `Practice "${todayVerbs[0]?.word || 'go'}" in Past (V2)`,
              `Use "${todayVerbs[1]?.word || 'have'}" with have/has (V3)`,
              `Make a sentence with "${todayVerbs[2]?.word || 'see'}"`,
              `Ask me a question using Day ${selectedDay} verbs`
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendAiMessage(chip)}
                className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-blue-600 hover:text-white text-[11px] font-semibold text-slate-300 border border-slate-700 hover:border-blue-500 transition flex-shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
            {chatMessages.map(msg => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3 max-w-[85%]",
                  msg.sender === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                {/* Avatar */}
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5",
                  msg.sender === 'user' ? "bg-purple-600 text-white" : "bg-blue-600 text-white"
                )}>
                  {msg.sender === 'user' ? 'U' : 'A'}
                </div>

                <div className="space-y-1">
                  <div className={cn(
                    "p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed whitespace-pre-line shadow-md",
                    msg.sender === 'user'
                      ? "bg-blue-600 text-white rounded-tr-none font-medium"
                      : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none font-normal"
                  )}>
                    {msg.text}
                  </div>

                  {/* Message Bottom (Time + Replay audio button) */}
                  <div className={cn(
                    "flex items-center gap-2 text-[10px] text-slate-500 px-1",
                    msg.sender === 'user' ? "justify-end" : "justify-start"
                  )}>
                    <span>{msg.time}</span>
                    {msg.sender === 'ai' && (
                      <button
                        onClick={() => playAiVoice(msg.text)}
                        className="hover:text-blue-400 text-slate-400 transition"
                        title="Replay Voice"
                      >
                        <Volume2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Interim live speech transcript while recording */}
            {isListening && interimTranscript && (
              <div className="flex gap-3 max-w-[85%] ml-auto flex-row-reverse">
                <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  U
                </div>
                <div className="p-3 rounded-2xl bg-purple-600/30 border border-purple-500/40 text-purple-200 text-xs italic">
                  &ldquo;{interimTranscript}...&rdquo;
                </div>
              </div>
            )}

            {aiLoading && (
              <div className="flex gap-3 mr-auto max-w-[85%] items-center text-xs text-slate-400 p-2">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  A
                </div>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
                  <span className="animate-spin w-3.5 h-3.5 rounded-full border-2 border-t-transparent border-blue-500" />
                  <span>Aria is listening and preparing feedback...</span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Bottom Voice & Text Input Bar */}
          <div className="p-3 md:p-4 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2">
            {/* Pulsing Mic Button */}
            <button
              type="button"
              onClick={handleMicToggle}
              className={cn(
                "p-3 rounded-full transition shadow-lg flex-shrink-0 relative",
                isListening
                  ? "bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/30"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              )}
              title={isListening ? "Stop Recording (Send)" : "Start Speaking with Voice"}
            >
              {isListening ? <Square size={18} className="fill-white" /> : <Mic size={18} />}
            </button>

            {/* Text Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSendAiMessage(); }}
                placeholder={isListening ? "Listening... Speak now!" : "Yahan bolne ke liye mic dabao ya type karo..."}
                className={cn(
                  "w-full bg-slate-950 border rounded-xl pl-4 pr-10 py-2.5 text-xs md:text-sm text-slate-100 focus:outline-none transition",
                  isListening
                    ? "border-rose-500 ring-2 ring-rose-500/20 placeholder:text-rose-400"
                    : "border-slate-700 focus:border-blue-500 placeholder:text-slate-500"
                )}
              />
              <button
                disabled={!chatInput.trim() || aiLoading}
                onClick={() => handleSendAiMessage()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-blue-400 disabled:opacity-30 transition"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: QUIZ ─── */}
      {activeTab === 'quiz' && (
        <div className="rounded-2xl border p-6 min-h-[460px]"
          style={{ background: '#1E293B', borderColor: '#334155' }}>
          
          {!quizFinished && quizQuestions.length > 0 && (
            <div className="max-w-xl mx-auto space-y-6">
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
              <div className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800 space-y-2">
                <p className="text-sm md:text-base font-bold text-slate-100 whitespace-pre-line leading-relaxed">
                  {quizQuestions[quizIdx].prompt}
                </p>
                {quizQuestions[quizIdx].sentenceHindi && (
                  <p className="text-xs text-slate-400 italic">
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
                      if (isCorrect) btnStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                      else if (isSelected) btnStyle = 'bg-rose-500/15 border-rose-500 text-rose-300'
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
                <div className="space-y-4 pt-2">
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
                </div>
              )}
            </div>
          )}

          {quizFinished && (
            <div className="max-w-md mx-auto text-center space-y-6 py-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center mx-auto text-white shadow-xl">
                <Award size={32} />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-100">Quiz Completed!</h2>
                <p className="text-xs text-slate-400">
                  {quizQuestions.length} mein se {quizScore} sahi answers.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 inline-block px-8">
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  {Math.round((quizScore / quizQuestions.length) * 100)}%
                </span>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Accuracy</p>
              </div>

              {wrongAnswers.length > 0 && (
                <div className="text-left space-y-2 pt-2">
                  <p className="text-xs font-bold text-slate-400">Review mistakes:</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {wrongAnswers.map((w, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                        <span className="font-bold text-slate-200">{w.verb.word}</span>: Correct was <strong className="text-emerald-400">{w.correctAnswer}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={startQuiz}
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs transition"
                >
                  Play Again 🔄
                </button>
                <button
                  onClick={() => setActiveTab('today')}
                  className="flex-1 py-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 font-extrabold text-xs transition"
                >
                  Back to Learning
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 4: ALL 500 VERBS (Dictionary) ─── */}
      {activeTab === 'all' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            {/* Search Input */}
            <div className="relative col-span-1 md:col-span-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search word, Hindi, V2, V3..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Category Select */}
            <div>
              <select
                value={refCategory}
                onChange={(e) => setRefCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
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
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
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
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All 34 Days (500 verbs)</option>
                {Array.from({ length: TOTAL_VERB_DAYS }, (_, i) => i + 1).map(d => (
                  <option key={d} value={d.toString()}>Day {d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Showing <strong className="text-slate-200">{filteredAllVerbs.length}</strong> verbs</span>
            <span>Tap card to view V1, V2, V3 and examples</span>
          </div>

          {/* Grid of Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
