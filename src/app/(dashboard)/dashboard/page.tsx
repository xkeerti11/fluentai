'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mic, BookOpen, CheckSquare, BarChart2, Flame, Clock, Award, History, ArrowRight, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'
import { StatCard, Card } from '@/components/ui/Card'
import { LevelBadge } from '@/components/ui/Badge'
import { getLevelLabel } from '@/lib/utils/levelCalc'
import type { Level, SpeakingSession, VocabularyWord } from '@/types/database'
import { GRAMMAR_LESSONS } from '@/data/grammar-curriculum'

interface Stats {
  totalMinutes: number
  currentStreak: number
  totalWords: number
  avgGrammarScore: number
  weeklyData: { date: string; minutes: number }[]
}

const GRAMMAR_TOPICS = [
  { topic: 'Basic Greetings & "To Be" Verbs', desc: 'Is, Am, Are ka sahi prayog seekhein aur simple sentence structure banayein.' },
  { topic: 'Simple Present Tense', desc: 'Daily routine aur habits ke baare mein English mein baat karna seekhein.' },
  { topic: 'Present Continuous Tense', desc: 'Jo kaam abhi chal raha hai, use continuous rules ke sath express karein.' },
  { topic: 'Simple Past Tense', desc: 'Apne beete kal (past events) ko confidently describe karna seekhein.' },
  { topic: 'Past Continuous Tense', desc: 'Past mein jo kaam chal raha tha, uske baare mein batana seekhein.' },
  { topic: 'Simple Future Tense', desc: 'Aane wale kal ke plans, promises aur predictions ko discuss karein.' },
  { topic: 'Present Perfect Tense', desc: 'Jo actions past mein huye hain par jinka impact abhi hai, unhe bolein.' },
  { topic: 'Modal Verbs of Ability', desc: 'Can aur Could ka sahi prayog ability aur polite requests ke liye seekhein.' },
  { topic: 'Modal Verbs of Obligation', desc: 'Should, Must aur Have to ka use duty aur rules batane ke liye karein.' },
  { topic: 'Passive Voice Introduction', desc: 'Conversations ko professional aur formal banane ke liye object focus seekhein.' }
]

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - d.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (d.toDateString() === today.toDateString()) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08 } }),
}

export default function DashboardPage() {
  const { profile, loading: authLoading, signOut } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [recentSessions, setRecentSessions] = useState<SpeakingSession[]>([])
  const [sessionsLoading, setSessionsLoading] = useState(true)
  const [vocabWords, setVocabWords] = useState<VocabularyWord[]>([])
  const [vocabLoading, setVocabLoading] = useState(true)
  const [dueCount, setDueCount] = useState(0)

  // Journey States
  const [completedGrammarLessonsCount, setCompletedGrammarLessonsCount] = useState(0)
  const [currentGrammarLesson, setCurrentGrammarLesson] = useState<any>(null)
  const [totalLearnedWordsCount, setTotalLearnedWordsCount] = useState(0)
  const [totalSessionsCount, setTotalSessionsCount] = useState(0)
  const [levelProgressPercentage, setLevelProgressPercentage] = useState(0)

  // Fetch due vocabulary words count
  const fetchDueCount = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('learned_words')
        .select('id, next_review_date')
        .eq('user_id', userId)
        .eq('mastered', false)
        .lte('next_review_date', new Date().toISOString())
      if (error) throw error
      setDueCount(data?.length ?? 0)
    } catch (e) {
      console.error('Error fetching due vocab count:', e)
    }
  }

  // Fetch recent speaking sessions
  const fetchRecentSessions = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('speaking_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(3)
      if (error) throw error
      setRecentSessions(data || [])
    } catch (e) {
      console.error('Error fetching recent sessions:', e)
    } finally {
      setSessionsLoading(false)
    }
  }

  // Fetch vocabulary preview
  const fetchVocabWords = async (level: Level) => {
    try {
      const { data, error } = await supabase
        .from('vocabulary')
        .select('*')
        .eq('level', level)
        .limit(5)
      
      if (error) throw error

      if (!data || data.length < 5) {
        const { data: fallbackData } = await supabase
          .from('vocabulary')
          .select('*')
          .limit(5)
        setVocabWords(fallbackData || [])
      } else {
        setVocabWords(data)
      }
    } catch (e) {
      console.error('Error fetching vocabulary:', e)
    } finally {
      setVocabLoading(false)
    }
  }

  // Fetch journey stats
  const fetchJourneyStats = async (userId: string, userLevel: Level) => {
    try {
      // 1. Grammar progress completed count and active lesson
      const { data: gpData } = await supabase
        .from('grammar_progress')
        .select('lesson_id, completed')
        .eq('user_id', userId)
      
      const completedLessonIds = gpData ? gpData.filter((gp: any) => gp.completed).map((gp: any) => gp.lesson_id) : []
      setCompletedGrammarLessonsCount(completedLessonIds.length)

      let activeLesson = GRAMMAR_LESSONS.find(lesson => !completedLessonIds.includes(lesson.id))
      if (!activeLesson) activeLesson = GRAMMAR_LESSONS[0]
      setCurrentGrammarLesson(activeLesson)

      // Calculate level progress based on current level grammar lessons completion
      const levelLessons = GRAMMAR_LESSONS.filter(l => l.level === userLevel)
      const completedLevelLessons = levelLessons.filter(l => completedLessonIds.includes(l.id))
      const progressPct = levelLessons.length > 0 
        ? Math.round((completedLevelLessons.length / levelLessons.length) * 100) 
        : 0
      setLevelProgressPercentage(progressPct)

      // 2. Vocabulary words count (learned_words table count)
      const { count: lwCount } = await supabase
        .from('learned_words')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
      setTotalLearnedWordsCount(lwCount ?? 0)

      // 3. Speaking sessions count
      const { count: sCount } = await supabase
        .from('speaking_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
      setTotalSessionsCount(sCount ?? 0)

    } catch (e) {
      console.error('Error fetching journey stats:', e)
    }
  }

  useEffect(() => {
    if (!profile) return

    // 1. Fetch stats
    fetch('/api/progress/stats')
      .then(r => r.json())
      .then(({ data }) => {
        if (data) setStats(data)
      })
      .catch(err => console.error(err))
      .finally(() => setStatsLoading(false))

    // 2. Fetch recent sessions
    fetchRecentSessions(profile.id)

    // 3. Fetch vocabulary preview
    fetchVocabWords(profile.level)

    // 4. Fetch due count
    fetchDueCount(profile.id)

    // 5. Fetch journey stats
    fetchJourneyStats(profile.id, profile.level)
  }, [profile])

  const greeting = `${getGreeting()}, ${profile?.name?.split(' ')[0] ?? 'there'}! 👋`

  const currentDay = profile?.created_at
    ? Math.max(1, Math.min(180, Math.ceil((new Date().getTime() - new Date(profile.created_at).getTime()) / 86400000)))
    : 1

  const currentTopic = GRAMMAR_TOPICS[(currentDay - 1) % GRAMMAR_TOPICS.length]

  const minutesToday = stats?.weeklyData && stats.weeklyData.length > 0
    ? stats.weeklyData[stats.weeklyData.length - 1]?.minutes ?? 0
    : 0

  // Skeleton Loading Layout
  if (authLoading || statsLoading || sessionsLoading || vocabLoading) {
    return (
      <div className="space-y-6 pb-20 md:pb-0">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-800 rounded-xl skeleton" />
          <div className="h-4 w-96 bg-slate-800 rounded-lg skeleton" />
        </div>
        
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-slate-800 rounded-2xl skeleton" />
          ))}
        </div>

        {/* Two Column Layout Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-48 bg-slate-800 rounded-2xl skeleton" />
            <div className="h-[420px] bg-slate-800 rounded-2xl skeleton" />
          </div>
          <div className="h-[520px] bg-slate-800 rounded-2xl skeleton" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">

      {/* Greeting Header */}
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp}>
        <div className="flex items-start justify-between">
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: '#F1F5F9' }}>
            {greeting}
          </h1>
          {/* Mobile-only Sign Out button */}
          <button
            onClick={signOut}
            className="md:hidden flex items-center gap-1 text-xs text-slate-400 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-slate-800 flex-shrink-0 mt-1"
          >
            <LogOut className="w-3 h-3" />
            Sign Out
          </button>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <p className="text-sm font-medium" style={{ color: '#94A3B8' }}>
            Current Level:
          </p>
          {profile?.level && <LevelBadge level={profile.level} size="sm" />}
          <span className="text-xs text-slate-500">•</span>
          <span className="text-xs font-semibold text-slate-400">
            {getLevelLabel(profile?.level ?? 'A0')}
          </span>
        </div>
      </motion.div>

      {/* 4 Stat Cards Row */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        initial="hidden" animate="visible"
      >
        {[
          { icon: '🔥', label: 'Day Streak', value: stats?.currentStreak ?? 0, sublabel: 'days active', custom: 1 },
          { icon: '⏱️', label: 'min Today', value: minutesToday, sublabel: 'minutes practiced', custom: 2 },
          { icon: '📖', label: 'Words Learned', value: stats?.totalWords ?? 0, sublabel: 'vocabulary built', custom: 3 },
          { icon: '📊', label: 'Grammar', value: stats?.avgGrammarScore ? `${stats.avgGrammarScore}%` : '0%', sublabel: 'avg score', custom: 4 },
        ].map(s => (
          <motion.div key={s.label} variants={fadeUp} custom={s.custom}>
            <StatCard icon={s.icon} label={s.label} value={s.value} sublabel={s.sublabel} />
          </motion.div>
        ))}
      </motion.div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Hero Card + Today's Plan */}
        <div className="lg:col-span-2 space-y-6">

          {/* Revision Pending Reminder Card */}
          {dueCount > 0 && (
            <motion.div initial="hidden" animate="visible" custom={4.5} variants={fadeUp}>
              <Link href="/vocabulary?tab=revision">
                <div className="relative overflow-hidden rounded-2xl p-5 cursor-pointer group shadow-lg border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-all duration-300">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl animate-bounce">🔄</span>
                      <div>
                        <h4 className="text-sm font-bold text-amber-300">Aaj Revise Karo!</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Aapke <span className="font-extrabold text-amber-300">{dueCount} words</span> revision ke liye pending hain.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                      <span>Revise Now</span>
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Hero Start Speaking Card */}
          <motion.div initial="hidden" animate="visible" custom={5} variants={fadeUp}>
            <Link href="/speaking">
              <div className="relative overflow-hidden rounded-2xl p-6 cursor-pointer group shadow-2xl transition-all duration-300 hover:shadow-blue-500/10 hover:scale-[1.01]"
                style={{ background: 'linear-gradient(135deg, #2563EB 0%, #8B5CF6 100%)' }}>
                <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-20 blur-2xl bg-white" />

                <div className="relative flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-200">AI Voice Tutor</p>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                      <span>🎙️ Aaj Ki Practice Shuru Karo</span>
                    </h2>
                    <p className="text-sm font-semibold text-blue-100/90">
                      Day {currentDay} of 180 — {currentTopic.topic}
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <Mic size={26} color="white" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Today's Plan Card */}
          <motion.div initial="hidden" animate="visible" custom={6} variants={fadeUp}>
            <Card className="space-y-6" hover>
              <div>
                <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2 mb-1">
                  🎯 Today's Plan
                </h3>
                <p className="text-xs text-slate-400">Aaj ka targeted learning plan aur vocabulary review.</p>
              </div>

              {/* Grammar Section */}
              <div className="p-4 rounded-xl border border-slate-700/50 bg-slate-900/40 space-y-1">
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-purple-500/15 text-purple-400">
                  GRAMMAR TOPIC
                </span>
                <h4 className="text-base font-bold text-slate-200 mt-2">{currentTopic.topic}</h4>
                <p className="text-sm text-slate-400">{currentTopic.desc}</p>
              </div>

              {/* Vocab Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Vocabulary Preview
                  </span>
                  <span className="text-xs font-semibold text-blue-400">5 Words</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                  {vocabWords.slice(0, 5).map((w, idx) => (
                    <div key={w.word || idx} className="p-2.5 rounded-xl border border-slate-700 bg-slate-900/30 flex flex-col justify-between">
                      <span className="text-sm font-bold text-slate-100 truncate">{w.word}</span>
                      <span className="text-xs text-slate-400 truncate mt-1">{w.meaning_hindi}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* View Full Lesson Button */}
              <Link href="/grammar">
                <button className="w-full mt-2 py-3 rounded-xl font-bold text-sm text-slate-200 border border-slate-700 hover:border-blue-500 hover:text-white transition-all flex items-center justify-center gap-2 bg-slate-900/20">
                  <span>View Full Lesson</span>
                  <ArrowRight size={14} />
                </button>
              </Link>
            </Card>
          </motion.div>

          {/* Tumhari Learning Journey Card */}
          <motion.div initial="hidden" animate="visible" custom={6.5} variants={fadeUp}>
            <Card className="space-y-6" hover>
              <div>
                <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2 mb-1">
                  🗺️ Tumhari Learning Journey
                </h3>
                <p className="text-xs text-slate-400">Aapka total roadmap aur dynamic level progress tracker.</p>
              </div>

              {/* Level Progress Tracker */}
              <div className="p-4 rounded-xl border border-slate-700/50 bg-slate-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Current Level Progress
                  </span>
                  <span className="text-xs font-bold text-purple-400">
                    {profile?.level && (() => {
                      const levelOrder: Level[] = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']
                      const currentIndex = levelOrder.indexOf(profile.level)
                      const nextLevel = currentIndex < levelOrder.length - 1 ? levelOrder[currentIndex + 1] : null
                      return nextLevel 
                        ? `You are: ${profile.level} → ${nextLevel} (${levelProgressPercentage}% progress)`
                        : `You are: ${profile.level} (Mastery)`
                    })()}
                  </span>
                </div>
                {/* Visual Progress Bar */}
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${levelProgressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Grid with Grammar, Vocabulary and Speaking progress */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Grammar Progress */}
                <div className="p-4 rounded-xl border border-slate-700/30 bg-slate-900/20 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Grammar Module</span>
                    <h4 className="text-sm font-bold text-slate-200">
                      Day {completedGrammarLessonsCount}/46 Completed
                    </h4>
                  </div>
                  <div className="space-y-1.5">
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${Math.round((completedGrammarLessonsCount / 46) * 100)}%` }}
                      />
                    </div>
                    {currentGrammarLesson && (
                      <p className="text-[10px] text-slate-500 truncate">
                        Next: {currentGrammarLesson.title}
                      </p>
                    )}
                  </div>
                </div>

                {/* Vocabulary Progress */}
                <div className="p-4 rounded-xl border border-slate-700/30 bg-slate-900/20 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Vocabulary</span>
                    <h4 className="text-sm font-bold text-slate-200">
                      {totalLearnedWordsCount}/500 Words
                    </h4>
                  </div>
                  <div className="space-y-1.5">
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.round((Math.min(500, totalLearnedWordsCount) / 500) * 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-500">
                      {Math.round((Math.min(500, totalLearnedWordsCount) / 500) * 100)}% of level vocab
                    </p>
                  </div>
                </div>

                {/* Speaking Progress */}
                <div className="p-4 rounded-xl border border-slate-700/30 bg-slate-900/20 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Speaking Coach</span>
                    <h4 className="text-sm font-bold text-slate-200">
                      {totalSessionsCount} Sessions
                    </h4>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1">
                      <span className="text-xs">🎤</span>
                      <span className="text-[10px] text-slate-400">
                        Keep practicing daily!
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </Card>
          </motion.div>

        </div>

        {/* Right Side: Recent Activity */}
        <motion.div initial="hidden" animate="visible" custom={7} variants={fadeUp}>
          <Card className="h-full flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2 mb-1">
                  <History size={20} className="text-slate-400" />
                  Recent Activity
                </h3>
                <p className="text-xs text-slate-400">Tumhari pichli speaking practice sessions.</p>
              </div>

              {/* Activity List */}
              {recentSessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-16 px-4 border border-dashed border-slate-700 rounded-2xl bg-slate-900/20">
                  <span className="text-3xl mb-3">🎤</span>
                  <p className="text-sm font-semibold text-slate-300">Koi activity nahi mili</p>
                  <p className="text-xs text-slate-500 mt-1 mb-5">Aaj pehla speaking practice shuru karein!</p>
                  <Link href="/speaking">
                    <button className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all">
                      Start Speaking
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentSessions.map((session, idx) => (
                    <div
                      key={session.id || idx}
                      className="p-4 rounded-xl border border-slate-700 bg-slate-900/40 flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          {session.mode || 'Speaking'} Practice
                        </span>
                        <p className="text-xs text-slate-500">
                          {formatDate(session.created_at)} • {formatDuration(session.duration_seconds)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-black text-blue-400">
                          {session.grammar_score != null ? `${session.grammar_score}%` : 'N/A'}
                        </span>
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Grammar</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Streak Motivator Footer */}
            {stats && stats.currentStreak > 0 && (
              <div className="p-4 rounded-xl border border-amber-900/20 bg-amber-500/5 flex items-center gap-3.5 mt-auto">
                <span className="text-2xl flex-shrink-0">🔥</span>
                <div>
                  <h4 className="text-sm font-bold text-amber-300">
                    {stats.currentStreak} Day Streak!
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Practice maintain rakho aur kal bhi continue karo.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

      </div>
    </div>
  )
}
