'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Lock, BookOpen, Mic, RotateCcw, Volume2, VolumeX, Award, AlertCircle, Check, Play, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis'
import { GRAMMAR_LESSONS, GrammarLesson } from '@/data/grammar-curriculum'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'

type TabType = 'learn' | 'practice' | 'quiz'

export default function GrammarModulePage() {
  const { profile } = useAuth()
  const [selectedLesson, setSelectedLesson] = useState<GrammarLesson>(GRAMMAR_LESSONS[0])
  const [completedLessons, setCompletedLessons] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState<TabType>('learn')

  // Quiz States
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)

  // Practice Voice Chat States
  const [practiceMessages, setPracticeMessages] = useState<{ role: 'user' | 'assistant'; content: string; isLoading?: boolean; correction?: any }[]>([])
  const [micState, setMicState] = useState<'idle' | 'listening' | 'processing'>('idle')
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [practiceSessionId, setPracticeSessionId] = useState(crypto.randomUUID())

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

  const { speak, stopSpeaking, isSpeaking } = useSpeechSynthesis()

  // Load completed lessons progress
  useEffect(() => {
    // 1. LocalStorage load
    const saved = localStorage.getItem('fluentai-completed-lessons')
    if (saved) {
      try {
        setCompletedLessons(JSON.parse(saved))
      } catch (e) {
        console.error(e)
      }
    }

    // 2. Supabase load (if table exists, fail gracefully)
    if (profile?.id) {
      const fetchProgress = async () => {
        try {
          const { data, error } = await supabase
            .from('grammar_progress')
            .select('lesson_id')
            .eq('user_id', profile.id)
          if (error) throw error
          if (data && data.length > 0) {
            const ids = data.map((d: { lesson_id: number }) => d.lesson_id)
            setCompletedLessons(prev => {
              const combined = Array.from(new Set([...prev, ...ids]))
              localStorage.setItem('fluentai-completed-lessons', JSON.stringify(combined))
              return combined
            })
          }
        } catch (e) {
          console.warn('grammar_progress table not found, falling back to localStorage only')
        }
      }
      fetchProgress()
    }
  }, [profile])

  // Sync mic state when recognition finishes
  useEffect(() => {
    if (!isListening && micState === 'listening') {
      if (transcript.trim()) {
        sendPracticeMessage(transcript.trim())
      } else {
        setMicState('idle')
      }
    }
  }, [isListening]) // eslint-disable-line react-hooks/exhaustive-deps



  // Scroll chat bottom
  useEffect(() => {
    if (activeTab === 'practice') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [practiceMessages, activeTab])

  // Progress stats
  const progressPercent = Math.round((completedLessons.length / GRAMMAR_LESSONS.length) * 100)

  // Start Grammar Practice session
  const startPracticeSession = () => {
    stopSpeaking()
    setPracticeSessionId(crypto.randomUUID())
    const welcome = `Hello! I'm Aria, your coach. Today, let's practice the topic: "${selectedLesson.title}". The formula is: "${selectedLesson.formula}". Can you try making a sentence using this?`
    setPracticeMessages([
      { role: 'assistant', content: welcome }
    ])
    if (voiceEnabled) {
      speak(welcome)
    }
  }

  // Handle tab switch
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    if (tab === 'practice') {
      startPracticeSession()
    } else {
      stopSpeaking()
    }
  }

  // Embedded practice message sender
  const sendPracticeMessage = async (text: string) => {
    if (!text.trim()) return
    setMicState('processing')
    setPracticeMessages(prev => [...prev, { role: 'user', content: text }])
    setPracticeMessages(prev => [...prev, { role: 'assistant', content: '', isLoading: true }])

    try {
      const response = await fetch('/api/grammar-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonTopic: selectedLesson.title,
          lessonFormula: selectedLesson.formula,
          userLevel: profile?.level ?? 'A1',
          message: text,
          history: practiceMessages.map(m => ({ role: m.role, content: m.content })),
          sessionId: practiceSessionId,
        })
      })

      if (!response.ok) throw new Error('Aria connection failed.')
      const { data } = await response.json()

      setPracticeMessages(prev => {
        const copy = [...prev]
        copy[copy.length - 1] = {
          role: 'assistant',
          content: data.reply,
          correction: data.correction
        }
        return copy
      })

      if (voiceEnabled && data.reply) {
        speak(data.reply)
      }
    } catch (e) {
      toast.error('Practice session error. Try again.')
      setPracticeMessages(prev => {
        const copy = [...prev]
        copy[copy.length - 1] = { role: 'assistant', content: '⚠️ Aria was unable to connect. Let\'s try again.' }
        return copy
      })
    } finally {
      setMicState('idle')
      resetTranscript()
    }
  }

  // Voice toggler inside practice
  const togglePracticeVoice = () => {
    if (voiceEnabled) stopSpeaking()
    setVoiceEnabled(!voiceEnabled)
  }

  // Handle quiz option click
  const handleOptionClick = (idx: number) => {
    if (selectedOption !== null) return
    setSelectedOption(idx)
    setShowExplanation(true)
    const isCorrect = idx === selectedLesson.questions[currentQuestionIdx].answer
    if (isCorrect) {
      setScore(s => s + 1)
      toast.success('Sahi jawab! 🎉')
    } else {
      toast.error('Galat jawab. Rule ko samajhein.')
    }
  }

  // Move quiz to next question or finish
  // BUG-07 fix: use dynamic question count instead of hardcoded 4
  const handleNextQuestion = () => {
    setSelectedOption(null)
    setShowExplanation(false)
    const totalQuestions = selectedLesson?.questions?.length ?? 5
    if (currentQuestionIdx < totalQuestions - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1)
    } else {
      setQuizFinished(true)
      // BUG-19 fix: compute finalScore synchronously (React state is async)
      const isLastCorrect = selectedOption === selectedLesson.questions[currentQuestionIdx].answer
      const finalScore = score + (isLastCorrect ? 1 : 0)
      saveLessonCompletion(finalScore)
    }
  }

  // Save progress — BUG-19 fix: accept finalScore as param instead of reading stale state
  const saveLessonCompletion = async (finalScore: number) => {
    const totalQuestions = selectedLesson?.questions?.length ?? 5
    const passMark = Math.ceil(totalQuestions * 0.8) // 80% pass threshold
    const passed = finalScore >= passMark
    if (!passed) return

    const updated = Array.from(new Set([...completedLessons, selectedLesson.id]))
    setCompletedLessons(updated)
    localStorage.setItem('fluentai-completed-lessons', JSON.stringify(updated))

    if (profile?.id) {
      // Gracefully save to Supabase grammar_progress table
      try {
        await supabase.from('grammar_progress').upsert({
          user_id: profile.id,
          lesson_id: selectedLesson.id,
          completed: true,
          completed_at: new Date().toISOString()
        })
        toast.success('Lesson complete! 🎉 Next lesson unlocked!')
      } catch (e) {
        console.error('Gracefully caught grammar_progress upsert error:', e)
      }
    }
  }

  // Reset quiz
  const retryQuiz = () => {
    setCurrentQuestionIdx(0)
    setSelectedOption(null)
    setShowExplanation(false)
    setScore(0)
    setQuizFinished(false)
  }

  // Move to next lesson
  const handleNextLesson = () => {
    const nextIdx = GRAMMAR_LESSONS.findIndex(l => l.id === selectedLesson.id) + 1
    if (nextIdx < GRAMMAR_LESSONS.length) {
      setSelectedLesson(GRAMMAR_LESSONS[nextIdx])
      setActiveTab('learn')
      retryQuiz()
    } else {
      toast.success('Congratulations! Sab lessons complete kar liye! 🏆')
    }
  }

  const levels = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4" style={{ borderColor: '#334155' }}>
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2" style={{ color: '#F1F5F9' }}>
            Grammar Sikhiye 📝
          </h1>
          <p className="text-xs text-slate-400 mt-1">Zero se advanced level tak ki complete English grammar, Hindi me.</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full md:w-64 space-y-1">
          <div className="flex justify-between text-xs font-bold" style={{ color: '#94A3B8' }}>
            <span>Progress</span>
            <span>{progressPercent}% Complete</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar + Tabs Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Sidebar: Lesson List */}
        <div className="lg:col-span-1 rounded-2xl border p-4 space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto"
          style={{ background: '#1E293B', borderColor: '#334155' }}>
          
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">Lessons</h3>
          
          <div className="space-y-4">
            {levels.map(lvl => {
              const lvlLessons = GRAMMAR_LESSONS.filter(l => l.level === lvl)
              if (lvlLessons.length === 0) return null

              return (
                <div key={lvl} className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 block">{lvl} Levels</span>
                  <div className="space-y-0.5">
                    {lvlLessons.map(lesson => {
                      const isCompleted = completedLessons.includes(lesson.id)
                      const isLocked = lesson.id > 1 && !completedLessons.includes(lesson.id - 1)
                      const isSelected = selectedLesson.id === lesson.id

                      return (
                        <button
                          key={lesson.id}
                          disabled={isLocked}
                          onClick={() => {
                            setSelectedLesson(lesson)
                            setActiveTab('learn')
                            retryQuiz()
                          }}
                          className={cn(
                            'w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all text-xs font-medium border border-transparent disabled:opacity-50 disabled:cursor-not-allowed',
                            isSelected
                              ? 'bg-blue-600/15 border-blue-500 text-blue-400 font-bold'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                          )}
                        >
                          <span className="truncate pr-2">Day {lesson.day}: {lesson.title}</span>
                          
                          <span className="flex-shrink-0">
                            {isCompleted ? (
                              <CheckCircle size={14} className="text-emerald-500" />
                            ) : isLocked ? (
                              <Lock size={12} className="text-slate-600" />
                            ) : (
                              <div className="w-2.5 h-2.5 rounded-full border border-slate-600" />
                            )}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Area: Tabs and Lesson Contents */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Tab buttons */}
          <div className="flex gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start">
            {[
              { id: 'learn', label: '📖 Learn', activeColor: 'bg-blue-600 text-white' },
              { id: 'practice', label: '🎤 Practice', activeColor: 'bg-purple-600 text-white' },
              { id: 'quiz', label: '❓ Quiz', activeColor: 'bg-emerald-600 text-white' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => handleTabChange(t.id as TabType)}
                className={cn(
                  'px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all',
                  activeTab === t.id
                    ? t.activeColor
                    : 'text-slate-400 hover:text-slate-200 bg-transparent'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab Workspaces */}
          <div className="rounded-2xl border p-6 min-h-[460px] flex flex-col justify-between"
            style={{ background: '#1E293B', borderColor: '#334155' }}>
            
            <AnimatePresence mode="wait">
              
              {/* LEARN TAB */}
              {activeTab === 'learn' && (
                <motion.div
                  key="learn"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-6"
                >
                  {/* Lesson Heading */}
                  <div>
                    <h2 className="text-xl font-bold text-slate-100">{selectedLesson.title}</h2>
                    <p className="text-sm text-blue-400 font-semibold">{selectedLesson.title_hindi}</p>
                  </div>

                  {/* Hindi Concept explanation */}
                  <div className="p-4 rounded-xl border border-blue-900/30 bg-blue-500/5 space-y-1.5">
                    <span className="text-[10px] font-bold tracking-wider text-blue-400 uppercase">Grammar Concept</span>
                    <p className="text-sm text-slate-300 font-medium leading-relaxed">
                      {selectedLesson.concept_hindi}
                    </p>
                  </div>

                  {/* Formula Container */}
                  <div className="p-4 rounded-xl border border-slate-700 bg-slate-900/60 space-y-2">
                    <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Formula Structure</span>
                    <div className="font-mono text-sm text-emerald-400 font-bold tracking-wide">
                      {selectedLesson.formula}
                    </div>
                    <div className="text-xs text-slate-400 italic">
                      Example: <span className="font-mono">{selectedLesson.formula_example}</span>
                    </div>
                  </div>

                  {/* Sentence Examples comparison */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Correct vs Incorrect Examples</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {selectedLesson.examples.map((ex, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/30 space-y-2">
                          <p className="text-xs line-through text-red-400 flex items-start gap-1.5">
                            <span>❌</span> {ex.wrong}
                          </p>
                          <p className="text-xs font-bold text-emerald-400 flex items-start gap-1.5">
                            <span>✅</span> {ex.right}
                          </p>
                          <p className="text-[10px] text-slate-500 italic flex items-start gap-1.5 pt-1 border-t border-slate-800/40">
                            <span>💬</span> {ex.hindi}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tips Section */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Hinglish Tips</span>
                    <ul className="space-y-1">
                      {selectedLesson.tips.map((tip, idx) => (
                        <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                          <span className="text-blue-500">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action button */}
                  <button
                    onClick={() => handleTabChange('practice')}
                    className="w-full mt-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <Mic size={14} />
                    Practice This With AI →
                  </button>
                </motion.div>
              )}

              {/* PRACTICE TAB (Embedded Mini Voice Tutor) */}
              {activeTab === 'practice' && (
                <motion.div
                  key="practice"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex flex-col justify-between h-[420px]"
                >
                  <div className="space-y-2 mb-4 border-b border-slate-800 pb-3 flex items-center justify-between flex-shrink-0">
                    <div>
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Target Practice</span>
                      <h4 className="text-sm font-black text-slate-200">{selectedLesson.title}</h4>
                    </div>
                    
                    <div className="flex gap-2">
                      <button onClick={togglePracticeVoice} className="p-1.5 text-slate-400 hover:text-slate-200 transition-all">
                        {voiceEnabled ? <Volume2 size={16} className="text-purple-400" /> : <VolumeX size={16} />}
                      </button>
                      <button onClick={startPracticeSession} className="p-1.5 text-slate-400 hover:text-slate-200 transition-all" title="Restart chat">
                        <RotateCcw size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Chat scrolling viewport */}
                  <div className="flex-1 overflow-y-auto space-y-3 px-1 mb-4">
                    {practiceMessages.map((m, idx) => {
                      const isUser = m.role === 'user'
                      return (
                        <div key={idx} className={cn('flex gap-2', isUser ? 'justify-end' : 'justify-start')}>
                          {!isUser && (
                            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 shadow-md">
                              A
                            </div>
                          )}
                          <div className="space-y-1.5 max-w-[85%]">
                            <div className={cn(
                              'px-3 py-2 text-xs rounded-xl shadow-sm',
                              isUser ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-slate-700 text-slate-100 rounded-tl-sm'
                            )}>
                              {m.isLoading ? (
                                <div className="flex gap-0.5 items-center py-1">
                                  <span className="typing-dot w-1 h-1" />
                                  <span className="typing-dot w-1 h-1" />
                                  <span className="typing-dot w-1 h-1" />
                                </div>
                              ) : (
                                m.content
                              )}
                            </div>
                            
                            {/* Embedded Grammar Correction inside practice tab */}
                            {!isUser && m.correction?.made && (
                              <div className="p-2.5 rounded-lg border border-emerald-900/30 bg-emerald-500/5 text-[10px] space-y-1">
                                {m.correction.original_mistake && (
                                  <p className="line-through text-red-400">❌ {m.correction.original_mistake}</p>
                                )}
                                <p className="font-bold text-emerald-400">✅ {m.correction.subtle_correction_used}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                    <div ref={chatBottomRef} />
                  </div>

                  {/* Bottom live transcript info */}
                  {isListening ? (
                    <div className="text-[10px] bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800 mb-2 flex-shrink-0">
                      🎤 {transcript && <span className="text-white">{transcript} </span>}
                      {interimTranscript && <span className="text-slate-400 italic">{interimTranscript}</span>}
                      {!transcript && !interimTranscript && <span className="text-red-400 animate-pulse text-xs">● Sun raha hoon...</span>}
                    </div>
                  ) : transcript ? (
                    <div className="text-[10px] text-slate-200 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800 mb-2 flex-shrink-0">
                      🎤 {transcript}
                    </div>
                  ) : null}

                  {/* Simple record controls */}
                  <div className="flex justify-center items-center py-2 flex-shrink-0 border-t border-slate-800/50">
                    <button
                      onClick={() => {
                        if (!isSupported) {
                          toast.error('Speech recognition not supported on this browser.')
                          return
                        }
                        if (micState === 'listening') {
                          stopListening()
                        } else {
                          if (isSpeaking) stopSpeaking()
                          resetTranscript()
                          startListening()
                          setMicState('listening')
                        }
                      }}
                      className={cn(
                        'w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md',
                        micState === 'listening' ? 'bg-red-500 text-white animate-pulse' : 'bg-purple-600 text-white hover:bg-purple-500'
                      )}
                    >
                      <Mic size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* QUIZ TAB */}
              {activeTab === 'quiz' && (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-6 flex-1 flex flex-col justify-between"
                >
                  {!quizFinished ? (
                    <div className="space-y-6">
                      {/* Quiz Header */}
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-400 border-b border-slate-800 pb-2">
                        <span>Question {currentQuestionIdx + 1} of 5</span>
                        <span>Score: {score}/5</span>
                      </div>

                      {/* Question Container */}
                      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                        <p className="text-base font-bold text-slate-200">
                          {selectedLesson.questions[currentQuestionIdx].question}
                        </p>
                      </div>

                      {/* Options List */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedLesson.questions[currentQuestionIdx].options.map((opt, idx) => {
                          const isCorrect = idx === selectedLesson.questions[currentQuestionIdx].answer
                          const isSelected = idx === selectedOption
                          const borderStyle = selectedOption !== null
                            ? isCorrect
                              ? 'border-emerald-500 bg-emerald-500/5 text-emerald-400'
                              : isSelected
                              ? 'border-red-500 bg-red-500/5 text-red-400'
                              : 'border-slate-800 text-slate-500'
                            : 'border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800/40'

                          return (
                            <button
                              key={idx}
                              disabled={selectedOption !== null}
                              onClick={() => handleOptionClick(idx)}
                              className={cn(
                                'px-4 py-3.5 rounded-xl border text-sm font-semibold transition-all text-left flex justify-between items-center',
                                borderStyle
                              )}
                            >
                              <span>{opt}</span>
                              {selectedOption !== null && (
                                isCorrect ? <Check size={16} className="text-emerald-500" /> : isSelected ? <span className="text-xs">❌</span> : null
                              )}
                            </button>
                          )
                        })}
                      </div>

                      {/* Explanations shown only on select */}
                      {showExplanation && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 flex items-start gap-3"
                        >
                          <AlertCircle size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hindi Explanation</span>
                            <p className="text-xs text-slate-300 font-medium leading-relaxed">
                              {selectedLesson.questions[currentQuestionIdx].explanation_hindi}
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {/* Next button */}
                      {selectedOption !== null && (
                        <button
                          onClick={handleNextQuestion}
                          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                        >
                          <span>{currentQuestionIdx < 4 ? 'Next Question' : 'Finish Quiz'}</span>
                          <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
                  ) : (
                    /* Scorecard View */
                    <div className="text-center space-y-6 py-8">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                        <Award size={32} className="text-emerald-500" />
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-100">Quiz Completed!</h3>
                        <p className="text-xs text-slate-400">Scorecard details and rewards</p>
                      </div>

                      {/* Scores display */}
                      <div className="max-w-xs mx-auto p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-1.5">
                        <div className="flex justify-between items-center text-sm font-semibold">
                          <span className="text-slate-400">Correct Answers:</span>
                          <span className="text-emerald-400 font-bold">{score} / 5</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-semibold">
                          <span className="text-slate-400">Status:</span>
                          <span className={cn('font-bold', score >= 4 ? 'text-emerald-400' : 'text-red-400')}>
                            {score >= 4 ? 'Passed (Unlocked next!) 🎉' : 'Retry (Need 4/5)'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-center gap-3 max-w-sm mx-auto">
                        <button
                          onClick={retryQuiz}
                          className="flex-1 py-3 rounded-xl text-xs font-bold text-slate-300 border border-slate-700 hover:border-slate-500 bg-transparent transition-all"
                        >
                          Retry Quiz
                        </button>
                        {score >= 4 && (
                          <button
                            onClick={handleNextLesson}
                            className="flex-1 py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all"
                          >
                            Next Lesson
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                </motion.div>
              )}

            </AnimatePresence>

          </div>
        </div>

      </div>

    </div>
  )
}
