'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Volume2, VolumeX, RotateCcw, Square, Sparkles, MessageCircle, ChevronDown, Mic } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils/cn'
import { useChatStore } from '@/store/useChatStore'
import { useUserStore } from '@/store/useUserStore'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis'
import { MicButton } from '@/components/speaking/MicButton'
import { ChatBubble } from '@/components/speaking/ChatBubble'
import { TranscriptDisplay } from '@/components/speaking/TranscriptDisplay'
import { supabase } from '@/lib/supabase/client'
import { GRAMMAR_LESSONS } from '@/data/grammar-curriculum'
import { VOCABULARY_WORDS } from '@/data/vocabulary-curriculum'

type PracticeMode = 'free_talk' | 'lesson' | 'roleplay'


export default function SpeakingPage() {
  const router = useRouter()
  const { profile } = useUserStore()
  const { messages, isLoading, sessionId, addMessage, setLoading, clearChat, voiceEnabled, toggleVoice } = useChatStore()

  const [mode, setMode] = useState<PracticeMode | null>(null)
  const [micState, setMicState] = useState<'idle' | 'listening' | 'processing'>('idle')
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null)
  const [showSummary, setShowSummary] = useState(false)
  const [isLessonExpanded, setIsLessonExpanded] = useState(false)
  const [stats, setStats] = useState<{
    messageCount: number
    correctionsCount: number
    wordsCount: number
    duration: number
  } | null>(null)

  const [activeGrammarLesson, setActiveGrammarLesson] = useState<any>(null)
  const [vocabFocus, setVocabFocus] = useState<string[]>([])
  const [usedVocabWords, setUsedVocabWords] = useState<string[]>([])

  // Roleplay States
  const [selectedRoleplayScene, setSelectedRoleplayScene] = useState<string | null>(null)
  const [roleplayStep, setRoleplayStep] = useState<'select_scene' | 'confirm_scene' | 'chat'>('select_scene')
  const [roleplayFeedbackState, setRoleplayFeedbackState] = useState<any>(null)
  const [isNotChrome, setIsNotChrome] = useState(false)
  const [slowMode, setSlowMode] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
      setIsNotChrome(!isChrome)
    }
  }, [])

  const chatBottomRef = useRef<HTMLDivElement>(null)

  const {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition()

  const { speak, stopSpeaking, speakSlower, isSpeaking, isSupported: ttsSupported } = useSpeechSynthesis()



  // Speak the first welcome message on delay to allow Chrome speech engines to initialize
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'assistant' && voiceEnabled) {
      const timer = setTimeout(() => {
        speak(messages[0].content)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [messages, voiceEnabled, speak])

  // Load focus grammar lesson and vocabulary words from database/curriculum
  useEffect(() => {
    if (!profile) return
    const loadFocus = async () => {
      try {
        // 1. Resolve Grammar Lesson
        const { data: gpData } = await supabase
          .from('grammar_progress')
          .select('lesson_id, completed')
          .eq('user_id', profile.id)
        
        const completedLessonIds = gpData ? gpData.filter((gp: any) => gp.completed).map((gp: any) => gp.lesson_id) : []
        let targetLesson = GRAMMAR_LESSONS.find(lesson => !completedLessonIds.includes(lesson.id))
        
        if (!targetLesson) {
          targetLesson = GRAMMAR_LESSONS[0]
        }
        setActiveGrammarLesson(targetLesson)

        // 2. Resolve focus vocabulary words (5 for lesson mode, 3 otherwise)
        const targetWordsCount = mode === 'lesson' ? 5 : 3
        const levelWords = VOCABULARY_WORDS.filter(w => w.level === profile.level)
        const wordStringsForLevel = levelWords.map(w => w.word)

        const { data: vocabRows } = await supabase
          .from('vocabulary')
          .select('id, word')
          .in('word', wordStringsForLevel)

        const vocabMap = new Map<string, string>()
        if (vocabRows) {
          vocabRows.forEach((row: any) => {
            vocabMap.set(row.word, row.id)
          })
        }

        const vocabIds = vocabRows ? vocabRows.map((row: any) => row.id) : []
        let targetWords: string[] = []

        if (vocabIds.length > 0) {
          const { data: lwData } = await supabase
            .from('learned_words')
            .select('word_id, mastered, next_review_date')
            .eq('user_id', profile.id)
            .in('word_id', vocabIds)
          
          if (lwData && lwData.length > 0) {
            const nowStr = new Date().toISOString()
            const dueLw = lwData.filter((lw: any) => !lw.mastered && lw.next_review_date && lw.next_review_date <= nowStr)
            
            const idToWordMap = new Map<string, string>()
            vocabMap.forEach((id, word) => {
              idToWordMap.set(id, word)
            })

            dueLw.forEach((lw: any) => {
              const wordStr = idToWordMap.get(lw.word_id)
              if (wordStr) targetWords.push(wordStr)
            })
          }
        }

        if (targetWords.length < targetWordsCount) {
          const remainingLevelWords = levelWords.filter(w => !targetWords.includes(w.word))
          for (const w of remainingLevelWords) {
            if (targetWords.length >= targetWordsCount) break
            targetWords.push(w.word)
          }
        }

        if (targetWords.length < targetWordsCount) {
          const fallbackList = ['hello', 'good', 'morning', 'nice', 'meet', 'help', 'please', 'sorry']
          for (const w of fallbackList) {
            if (targetWords.length >= targetWordsCount) break
            if (!targetWords.includes(w)) targetWords.push(w)
          }
        }

        const finalWords = targetWords.slice(0, targetWordsCount)
        setVocabFocus(finalWords)
      } catch (err) {
        console.error('Error loading active grammar lesson and vocab focus:', err)
        setActiveGrammarLesson(GRAMMAR_LESSONS[0])
        setVocabFocus(['hello', 'please', 'thank you'])
      }
    }
    loadFocus()
  }, [profile, mode])


  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Warn if browser is not Chrome
  useEffect(() => {
    if (typeof window === 'undefined') return
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
    if (!isChrome) {
      toast.warning('Aria voice features are best supported on Google Chrome.')
    }
  }, [])



  // Sync mic state when recognition stops automatically
  useEffect(() => {
    if (!isListening && micState === 'listening') {
      if (transcript.trim()) {
        sendMessage(transcript.trim())
      } else {
        setMicState('idle')
      }
    }
  }, [isListening]) // eslint-disable-line react-hooks/exhaustive-deps

  const ROLEPLAY_SCENES = [
    { id: 'client_call', title: '📞 Client Discovery Call', desc: 'Aap ek agency owner hain. Rahul Sharma (client) ne call schedule ki hai. AI client ka role play karega. Service, timeline aur pricing discuss karein.', icon: '📞' },
    { id: 'job_interview', title: '💼 Job Interview', desc: 'Aap ek job applicant hain. AI HR manager ka role play karega. Apne skills aur past projects ke baare mein batayein.', icon: '💼' },
    { id: 'shopping', title: '🛒 Shopping Scene', desc: 'Aap ek customer hain. AI shop assistant ka role play karega. Outfit purchases, size preferences aur billing discuss karein.', icon: '🛒' },
    { id: 'airport', title: '✈️ Airport Check-in', desc: 'Aap JFK Airport par check-in kar rahe hain. AI airline agent ka role play karega. Passport and baggage details verify karein.', icon: '✈️' },
    { id: 'restaurant', title: '🍽️ Restaurant Order Food', desc: 'Aap ek customer hain. AI waiter ka role play karega. Today\'s specials, menu, and bill queries address karein.', icon: '🍽️' }
  ]

  // Start chat session
  const startSession = (selectedMode: PracticeMode) => {
    setMode(selectedMode)
    setSessionStartTime(Date.now())
    clearChat()
    setUsedVocabWords([])
    setRoleplayFeedbackState(null)
    
    // Add welcome message
    let welcome = ''
    if (selectedMode === 'free_talk') {
      welcome = `Hello${profile?.name ? ` ${profile.name.split(' ')[0]}` : ''}! I'm Aria, your English coach. Let's practice speaking. How was your day today?`
    } else if (selectedMode === 'lesson') {
      welcome = `Welcome to today's lesson! Let's start by introducing today's grammar topic: "${activeGrammarLesson?.title ?? 'Basic Grammar'}". I will check your understanding first. Are you ready?`
    } else if (selectedMode === 'roleplay') {
      if (selectedRoleplayScene === 'client_call') {
        welcome = `*Ring ring* Hello, is this FluentAI Web Services? I'm Rahul Sharma. We scheduled a call to talk about my fashion startup's website. Thanks for taking the call!`
      } else if (selectedRoleplayScene === 'job_interview') {
        welcome = `Hello! Welcome to our office. I am the HR Manager. Thanks for coming in today for the software developer interview. Let's start. Can you tell me a little bit about yourself?`
      } else if (selectedRoleplayScene === 'shopping') {
        welcome = `Hello! Welcome to our store. How can I help you today? Are you looking for something specific?`
      } else if (selectedRoleplayScene === 'airport') {
        welcome = `Good day! Welcome to JFK airport. Can I please have your passport and booking reference?`
      } else if (selectedRoleplayScene === 'restaurant') {
        welcome = `Good evening! Welcome to our restaurant. I will be your server tonight. Would you like to start with some drinks or check today's specials?`
      } else {
        welcome = `Hello! Let's start our roleplay scenario.`
      }
    }

    addMessage({
      role: 'assistant',
      content: welcome,
    })

    if (voiceEnabled) {
      slowMode ? speakSlower(welcome) : speak(welcome)
    }
  }

  // Handle mic click toggle
  const handleMicToggle = () => {
    if (!isSupported) {
      toast.error('Speech recognition is not supported on this browser. Please use Chrome.')
      return
    }

    if (micState === 'listening') {
      stopListening()
    } else if (micState === 'idle') {
      if (isSpeaking) stopSpeaking()
      resetTranscript()
      startListening()
      setMicState('listening')
    }
  }

  // Send speech transcript to Gemini
  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    setMicState('processing')
    setLoading(true)

    // Scan for focus vocabulary words in user text
    const lowerText = text.toLowerCase()
    vocabFocus.forEach(word => {
      const escapedWord = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
      const regex = new RegExp(`\\b${escapedWord}\\b`, 'i')
      if (regex.test(lowerText) && !usedVocabWords.includes(word)) {
        setUsedVocabWords(prev => [...prev, word])
      }
    })

    // Add user bubble
    addMessage({ role: 'user', content: text })

    // Add temporary loading indicator
    addMessage({ role: 'assistant', content: '', isLoading: true })

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-20).map(m => ({ role: m.role, content: m.content })),
          userLevel: profile?.level ?? 'A1',
          userName: profile?.name ?? 'User',
          userGoal: profile?.goal ?? 'general',
          grammarTopic: activeGrammarLesson ? `Day ${activeGrammarLesson.day}: ${activeGrammarLesson.title} - ${activeGrammarLesson.concept_hindi} - Formula: ${activeGrammarLesson.formula}` : 'General Conversation',
          vocabWords: vocabFocus.join(', '),
          sessionId,
          mode,
          roleplayScene: selectedRoleplayScene
        }),
      })

      if (!response.ok) {
        throw new Error('Could not get response from Aria.')
      }

      const { data } = await response.json()

      // Replace loading bubble with real message
      const { updateLastMessage } = useChatStore.getState()
      updateLastMessage({
        content: data.reply,
        correction: data.correction,
        new_word: data.new_word,
        isLoading: false,
      })

      // Speak response aloud
      if (voiceEnabled && data.reply) {
        slowMode ? speakSlower(data.reply) : speak(data.reply)
      }
    } catch (e: any) {
      toast.error(e.message ?? 'Aria seems busy. Try again.')
      const { updateLastMessage } = useChatStore.getState()
      updateLastMessage({
        content: '⚠️ Connection lost. Try saying that again.',
        isLoading: false,
      })
    } finally {
      setLoading(false)
      setMicState('idle')
      resetTranscript()
    }
  }

  // Save session details to Supabase and show modal
  const handleEndSession = async () => {
    stopSpeaking()
    setLoading(true)

    const endTime = Date.now()
    const duration = sessionStartTime ? Math.floor((endTime - sessionStartTime) / 1000) : 0
    const msgsCount = messages.filter(m => !m.isLoading).length
    const correctionsCount = messages.filter(m => m.role === 'assistant' && m.correction?.made).length
    const wordsCount = messages.filter(m => m.role === 'assistant' && m.new_word?.word).length

    // Mapped grammar score
    const grammarScore = msgsCount > 1 
      ? Math.max(10, Math.min(100, Math.round(100 - (correctionsCount / Math.max(1, msgsCount / 2)) * 100)))
      : 100

    try {
      const response = await fetch('/api/progress/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          durationSeconds: duration,
          messageCount: msgsCount,
          grammarScore,
          fluencyScore: 85, // estimated
          wordsPracticed: wordsCount,
          mode,
          grammarTopicPracticed: activeGrammarLesson?.title ?? null,
          vocabularyWordsUsed: usedVocabWords,
          lessonId: activeGrammarLesson?.id ?? null,
          sessionId
        })
      })

      if (response.ok) {
        const { data } = await response.json()
        if (data?.roleplayFeedback) {
          setRoleplayFeedbackState(data.roleplayFeedback)
        }
        toast.success("Great session! 🎉 Keep it up!")
        if (data?.currentStreak) {
          toast.success(`🔥 ${data.currentStreak} din ka streak! Amazing!`)
        }
      }
    } catch (e) {
      console.error('Session save error:', e)
    }

    setStats({
      messageCount: msgsCount,
      correctionsCount,
      wordsCount,
      duration
    })
    setLoading(false)
    setShowSummary(true)
  }

  // Re-start practice
  const handleContinue = () => {
    setShowSummary(false)
    setStats(null)
    setRoleplayFeedbackState(null)
    if (mode === 'roleplay') {
      setRoleplayStep('select_scene')
      setSelectedRoleplayScene(null)
      setMode(null)
    } else {
      startSession('free_talk')
    }
  }

  // ── Mode Selection Screen ───────────────────────────────────
  if (mode === null) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: '#F1F5F9' }}>
              Choose a Practice Mode 🎤
            </h1>
            <p className="text-sm" style={{ color: '#94A3B8' }}>
              Select how you want to learn English with Aria today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {/* Free Talk */}
            <div
              onClick={() => startSession('free_talk')}
              className="rounded-2xl border p-6 cursor-pointer bg-slate-800 border-slate-700 hover:border-blue-500/50 hover:scale-[1.02] transition-all flex flex-col justify-between h-56"
            >
              <div>
                <span className="text-3xl mb-3 block">💬</span>
                <h3 className="font-bold text-slate-100 mb-1">Free Talk</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Talk about anything you want with Aria. She will gently guide your conversation.
                </p>
              </div>
              <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5 mt-4">
                Start Practicing →
              </span>
            </div>

            {/* Daily Lesson */}
            <div
              onClick={() => startSession('lesson')}
              className="rounded-2xl border p-6 cursor-pointer bg-slate-800 border-slate-700 hover:border-blue-500/50 hover:scale-[1.02] transition-all flex flex-col justify-between h-56"
            >
              <div>
                <span className="text-3xl mb-3 block">📚</span>
                <h3 className="font-bold text-slate-100 mb-1">Daily Lesson</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Practice today's grammar topic and vocabulary words in a structured talk.
                </p>
              </div>
              <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5 mt-4">
                Start Today's Lesson →
              </span>
            </div>

            {/* Roleplay */}
            <div
              onClick={() => {
                setMode('roleplay')
                setRoleplayStep('select_scene')
              }}
              className="rounded-2xl border p-6 cursor-pointer bg-slate-800 border-slate-700 hover:border-purple-500/50 hover:scale-[1.02] transition-all flex flex-col justify-between h-56"
            >
              <div>
                <span className="text-3xl mb-3 block">🎭</span>
                <h3 className="font-bold text-slate-100 mb-1">Roleplay</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Immerse yourself in real-world scenarios like job interviews or client talks.
                </p>
              </div>
              <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5 mt-4">
                Choose Scenario →
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Roleplay Scene Selector Screen ─────────────────────────
  if (mode === 'roleplay' && roleplayStep === 'select_scene') {
    return (
      <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-3xl w-full text-center space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: '#F1F5F9' }}>
              Select a Roleplay Scene 🎭
            </h1>
            <p className="text-sm" style={{ color: '#94A3B8' }}>
              Pick a real-world scenario to practice speaking English.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {ROLEPLAY_SCENES.map(scene => (
              <div
                key={scene.id}
                onClick={() => {
                  setSelectedRoleplayScene(scene.id)
                  setRoleplayStep('confirm_scene')
                }}
                className="rounded-2xl border p-6 cursor-pointer bg-slate-800 border-slate-700 hover:border-purple-500/50 hover:scale-[1.02] transition-all flex flex-col justify-between h-56"
              >
                <div>
                  <span className="text-3xl mb-3 block">{scene.icon}</span>
                  <h3 className="font-bold text-slate-100 mb-1">{scene.title.split(' ').slice(1).join(' ')}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {scene.desc.replace(/^[^-]+—\s*/, '')}
                  </p>
                </div>
                <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5 mt-4">
                  Select Scene →
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button
              onClick={() => setMode(null)}
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-300 border border-slate-700 hover:border-slate-500 hover:text-white transition-all bg-transparent"
            >
              ← Back to Modes
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Roleplay Confirmation Screen ─────────────────────────
  if (mode === 'roleplay' && roleplayStep === 'confirm_scene') {
    const scene = ROLEPLAY_SCENES.find(s => s.id === selectedRoleplayScene)
    return (
      <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-md w-full p-6 rounded-2xl border text-center space-y-6 bg-slate-800 border-slate-700 shadow-2xl">
          <div className="space-y-2">
            <span className="text-5xl block">🎬</span>
            <h3 className="text-xl font-bold text-slate-100">
              {scene?.title}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {scene?.desc}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setSelectedRoleplayScene(null)
                setRoleplayStep('select_scene')
              }}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-slate-300 border border-slate-700 hover:border-slate-500 transition-all bg-transparent"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setRoleplayStep('chat')
                startSession('roleplay')
              }}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all bg-purple-600 hover:bg-purple-500"
            >
              🎬 Scene Shuru Karo
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-slate-900 relative overflow-hidden" style={{ background: '#0F172A' }}>


      {/* Chrome Detection warning banner */}
      {isNotChrome && (
        <div className="flex-shrink-0 bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between text-xs text-amber-400 font-medium z-10 animate-fadeIn">
          <div className="flex items-center gap-1.5">
            <span>⚠️</span>
            <span>Voice ke liye Chrome use karo (Speech recognition works best in Google Chrome).</span>
          </div>
          <button 
            onClick={() => setIsNotChrome(false)}
            className="hover:text-amber-300 font-bold transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}
      
      {/* HEADER - fixed */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900">
        <button
          onClick={() => {
            stopSpeaking()
            router.back()
          }}
          className="flex items-center gap-1 md:gap-2 text-sm transition-colors text-slate-400 hover:text-slate-100"
        >
          <ArrowLeft size={18} />
          <span className="md:inline hidden">Back</span>
        </button>

        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-blue-400" />
          <span className="text-sm md:text-base font-bold text-slate-100">Aria English Coach</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Slow speed toggle */}
          <button
            onClick={() => setSlowMode(!slowMode)}
            title={slowMode ? 'Normal speed pe switch karo' : 'Slow speed pe switch karo'}
            className={`p-2 rounded-lg transition-colors text-xs font-medium ${
              slowMode
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {slowMode ? '0.65x' : '0.85x'}
          </button>

          <button
            onClick={() => {
              if (voiceEnabled) stopSpeaking()
              toggleVoice()
            }}
            className="p-2 rounded-lg transition-all"
            style={{ color: voiceEnabled ? '#2563EB' : '#475569' }}
          >
            {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          <button
            onClick={handleEndSession}
            disabled={isLoading}
            className="flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 text-xs font-bold rounded-xl transition-all bg-red-950/40 text-red-400 border border-red-900/40 hover:bg-red-900/30"
          >
            <Square size={12} fill="currentColor" />
            <span className="md:inline hidden">End Session</span>
          </button>
        </div>
      </div>

      {/* ── Mode-Specific Header Banners ───────────────────────── */}
      {/* 1. Free Talk suggestions */}
      {mode === 'free_talk' && messages.length <= 1 && (
        <div className="flex-shrink-0 px-4 py-3.5 flex flex-col gap-2 bg-slate-900/30 border-b border-slate-800">
          <p className="text-xs text-slate-400 font-semibold">💡 Aaj kisi bhi topic pe baat karo:</p>
          <div className="flex gap-2 flex-wrap">
            {(() => {
              const goal = profile?.goal ?? 'general'
              let chips = ['My Day & Routines', 'My Long-term Goals', 'My Hobbies & Interests']
              if (goal === 'agency_owner') {
                chips = ['My Business Plans', 'Handling Client Calls', 'Tech stack for my Agency']
              } else if (goal === 'job_interview') {
                chips = ['Interview Prep Tips', 'My Technical Strengths', 'Answering Interview Questions']
              } else if (goal === 'ielts') {
                chips = ['IELTS Topic Practice', 'Studying Abroad Dreams', 'Global Environmental Issues']
              } else if (goal === 'freelancer') {
                chips = ['Freelance Client Proposals', 'My Design/Code Portfolio', 'Setting Project Rates']
              }
              return chips.map(topic => (
                <button
                  key={topic}
                  onClick={() => sendMessage(topic)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-blue-600 border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  {topic}
                </button>
              ))
            })()}
          </div>
        </div>
      )}

      {/* PROGRESS BAR - fixed */}
      {mode === 'lesson' && activeGrammarLesson && (
        <div className="flex-shrink-0 px-4 py-2 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Day {profile?.current_day ?? 1} of 180 Progress</span>
            <span className="font-bold text-slate-200">
              {Math.round((Math.min(180, profile?.current_day ?? 1) / 180) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800 mt-1">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.round((Math.min(180, profile?.current_day ?? 1) / 180) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* TODAY'S LESSON CARD - fixed, compact */}
      {mode === 'lesson' && activeGrammarLesson && (
        <div className="flex-shrink-0 mx-3 mt-2 mb-1">
          <div className={cn(
            "relative p-3 rounded-xl bg-slate-800 border border-slate-700 space-y-2 transition-all duration-300 md:max-h-none",
            isLessonExpanded ? "max-h-[500px]" : "max-h-28 overflow-hidden"
          )}>
            <div>
              <span className="text-[10px] font-bold text-blue-400 tracking-wider uppercase">Today's Lesson Target</span>
              <h4 className="text-sm font-bold text-slate-100 mt-0.5">
                📝 {activeGrammarLesson.title} ({activeGrammarLesson.title_hindi})
              </h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {activeGrammarLesson.concept_hindi}
              </p>
            </div>
            
            {/* 5 Vocabulary focus words */}
            <div className="pt-2 border-t border-slate-700/50 flex flex-wrap gap-1 mt-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase mr-1 self-center">Vocab:</span>
              {vocabFocus.slice(0, 5).map(word => {
                const isSpoken = usedVocabWords.includes(word)
                return (
                  <span
                    key={word}
                    className="text-xs px-2 py-0.5 bg-slate-700 rounded-full text-slate-300 font-semibold border transition-all duration-300"
                    style={{
                      background: isSpoken ? 'rgba(34, 197, 94, 0.15)' : undefined,
                      borderColor: isSpoken ? '#22C55E' : '#334155',
                      color: isSpoken ? '#22C55E' : undefined,
                    }}
                  >
                    {word} {isSpoken && '✓'}
                  </span>
                )
              })}
            </div>

            {/* Gradient fade when collapsed */}
            {!isLessonExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-slate-800 to-transparent pointer-events-none md:hidden" />
            )}

            {/* Toggle button */}
            <button
              onClick={() => setIsLessonExpanded(!isLessonExpanded)}
              className="md:hidden absolute bottom-1 right-2 z-10 px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-700 text-[10px] font-bold text-slate-300 flex items-center gap-1 shadow-md hover:bg-slate-800 transition-all"
            >
              <span>{isLessonExpanded ? 'Show Less' : 'Show More'}</span>
              <ChevronDown size={10} className={cn("transition-transform duration-300", isLessonExpanded && "rotate-180")} />
            </button>
          </div>
        </div>
      )}

      {/* 3. Roleplay Active Banner */}
      {mode === 'roleplay' && selectedRoleplayScene && (
        <div className="flex-shrink-0 px-4 py-2 flex items-center justify-between bg-red-950/60 border-b border-red-900/40 text-red-400 font-bold text-[10px] uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <span>🎭</span>
            <span>Roleplay Mode — {ROLEPLAY_SCENES.find(s => s.id === selectedRoleplayScene)?.title}</span>
          </div>
          <span className="animate-pulse flex h-2 w-2 rounded-full bg-red-500" />
        </div>
      )}

      {/* CHAT MESSAGES - takes all remaining space, scrollable */}
      <div className="flex-1 overflow-y-auto px-3 md:px-6 py-3 pb-36 md:pb-4 space-y-3 min-h-0">
        {messages.map(msg => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        <div ref={chatBottomRef} />
      </div>

      {/* WhatsApp-style Voice Bar */}
      <div className="fixed bottom-16 left-0 right-0 z-40 flex items-center gap-2 px-3 py-2 border-t border-slate-800 bg-slate-900 md:relative md:bottom-auto md:left-auto md:right-auto md:z-auto">
        
        {/* Text input field (like WhatsApp message box) */}
        <div className="flex-1 bg-slate-800 rounded-full px-4 py-2.5 flex items-center min-h-[44px]">
          {isListening ? (
            <span className="text-sm">
              {transcript && (
                <span className="text-white">{transcript} </span>
              )}
              {interimTranscript && (
                <span className="text-slate-400 italic">{interimTranscript}</span>
              )}
              {!transcript && !interimTranscript && (
                <span className="text-red-400 animate-pulse text-xs">
                  ● Sun raha hoon...
                </span>
              )}
            </span>
          ) : transcript ? (
            <span className="text-slate-200 text-sm">{transcript}</span>
          ) : (
            <span className="text-slate-500 text-sm">
              Yahan bolne ke liye mic dabao...
            </span>
          )}
        </div>

        {/* WhatsApp-style mic button - right side circle */}
        <button
          onClick={handleMicToggle}
          disabled={isLoading && micState !== 'listening'}
          className={`
            relative w-11 h-11 rounded-full flex-shrink-0
            flex items-center justify-center
            transition-all duration-200 active:scale-90
            ${micState === 'listening' 
              ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)]' 
              : 'bg-blue-600 hover:bg-blue-500'
            }
          `}
        >
          {/* Ping animation when listening */}
          {micState === 'listening' && (
            <span className="absolute inset-0 rounded-full bg-red-400 opacity-40 animate-ping" />
          )}
          <Mic className="w-5 h-5 text-white relative z-10" />
        </button>

      </div>

      {/* Session End Summary Modal */}
      <AnimatePresence>
        {showSummary && stats && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl border p-6 space-y-6 shadow-2xl"
              style={{ background: '#1E293B', borderColor: '#334155' }}
            >
              <div className="text-center space-y-2">
                <span className="text-4xl">{mode === 'roleplay' ? '🎭' : '🎉'}</span>
                <h3 className="text-xl font-bold text-slate-100">
                  {mode === 'roleplay' ? 'Roleplay Session Complete!' : 'Session Complete!'}
                </h3>
                <p className="text-xs text-slate-400">
                  {mode === 'roleplay' ? 'Aria ne aapke conversation ko evaluate kiya hai.' : 'Sabash! Aaj tumne achhi practice ki.'}
                </p>
              </div>

              {/* Conditional Content based on Roleplay vs Normal Mode */}
              {mode === 'roleplay' && roleplayFeedbackState ? (
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/50 border border-slate-700/50">
                    <span className="text-slate-400 text-sm">Professional Tone:</span>
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      {Array.from({ length: Number(roleplayFeedbackState.toneRating ?? 4) }).map((_, i) => '⭐').join('')}
                      <span className="text-slate-500 text-xs font-normal">({roleplayFeedbackState.toneRating ?? 4}/5)</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/50 border border-slate-700/50">
                    <span className="text-slate-400 text-sm">Grammar Accuracy:</span>
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      {Array.from({ length: Number(roleplayFeedbackState.grammarRating ?? 3) }).map((_, i) => '⭐').join('')}
                      <span className="text-slate-500 text-xs font-normal">({roleplayFeedbackState.grammarRating ?? 3}/5)</span>
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-700/50 space-y-1">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Vocabulary Used:</span>
                    <p className="text-sm text-slate-200 font-semibold">
                      {roleplayFeedbackState.vocabUsed && roleplayFeedbackState.vocabUsed.length > 0
                        ? roleplayFeedbackState.vocabUsed.join(', ')
                        : 'None identified'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-700/50 space-y-1">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Best Moment:</span>
                    <p className="text-xs text-emerald-400 font-medium italic">
                      "{roleplayFeedbackState.bestMoment || 'Great conversational effort!'}"
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-900/30 space-y-1">
                    <span className="text-purple-400 text-[10px] font-bold uppercase tracking-wider block">Improvement Tip:</span>
                    <p className="text-xs text-purple-200">
                      {roleplayFeedbackState.improvementTip || 'Keep practicing formal exchanges to polish your professional flow!'}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-center">
                      <span className="text-xl block mb-1">💬</span>
                      <span className="text-base font-black text-slate-200">{stats.messageCount}</span>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Messages</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-center">
                      <span className="text-xl block mb-1">💡</span>
                      <span className="text-base font-black text-emerald-400">{stats.correctionsCount}</span>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Tips</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-center">
                      <span className="text-xl block mb-1">📖</span>
                      <span className="text-base font-black text-purple-400">{stats.wordsCount}</span>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Words</p>
                    </div>
                  </div>

                  {/* Duration Row */}
                  <div className="p-3.5 rounded-xl bg-slate-900/30 border border-slate-700/30 flex items-center justify-between text-sm">
                    <span className="text-slate-400 font-medium">Practice Duration:</span>
                    <span className="font-bold text-slate-200">
                      {Math.floor(stats.duration / 60)}m {stats.duration % 60}s
                    </span>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleContinue}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-slate-300 border border-slate-700 hover:border-slate-500 hover:text-white transition-all bg-transparent"
                >
                  {mode === 'roleplay' ? 'Choose Scene' : 'Practice Again'}
                </button>
                <button
                  onClick={() => {
                    clearChat()
                    router.push('/dashboard')
                  }}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all bg-blue-600 hover:bg-blue-500"
                >
                  Go to Dashboard
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
