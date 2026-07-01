'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Flame, Clock, MessageCircle, BookOpen, Award, CheckSquare, Sparkles, TrendingUp } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'
import { Card } from '@/components/ui/Card'
import { LevelBadge } from '@/components/ui/Badge'
import { getLevelLabel } from '@/lib/utils/levelCalc'
import StreakCalendar from '@/components/progress/StreakCalendar'
import { GRAMMAR_LESSONS } from '@/data/grammar-curriculum'
import { VOCABULARY_WORDS, VOCABULARY_TOPICS } from '@/data/vocabulary-curriculum'
import type { Level } from '@/types/database'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export default function ProgressPage() {
  const { profile, loading: authLoading } = useAuth()
  
  // States
  const [stats, setStats] = useState<any>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([])
  const [learnedWordsList, setLearnedWordsList] = useState<any[]>([])
  const [vocabMapping, setVocabMapping] = useState<Map<string, { category: string; word: string }>>(new Map())
  
  useEffect(() => {
    if (!profile) return

    // 1. Fetch stats API
    fetch('/api/progress/stats')
      .then(r => r.json())
      .then(({ data }) => {
        if (data) setStats(data)
      })
      .catch(err => console.error('Error fetching stats:', err))
      .finally(() => setStatsLoading(false))

    // 2. Fetch grammar progress
    const fetchGrammarProgress = async () => {
      try {
        const { data } = await supabase
          .from('grammar_progress')
          .select('lesson_id, completed')
          .eq('user_id', profile.id)
        
        if (data) {
          setCompletedLessonIds(data.filter((g: any) => g.completed).map((g: any) => g.lesson_id))
        }
      } catch (e) {
        console.error('Error fetching grammar progress:', e)
      }
    }
    fetchGrammarProgress()

    // 3. Fetch learned words & vocabulary categories matching
    const fetchVocabProgress = async () => {
      try {
        // Fetch all vocabulary from DB to match ids
        const { data: dbVocab } = await supabase
          .from('vocabulary')
          .select('id, word, level, topic')
        
        const mapping = new Map<string, { category: string; word: string }>()
        if (dbVocab) {
          dbVocab.forEach((v: any) => {
            mapping.set(v.id, { category: v.topic || 'General', word: v.word })
          })
        }
        setVocabMapping(mapping)

        const { data: userLw } = await supabase
          .from('learned_words')
          .select('word_id, mastered')
          .eq('user_id', profile.id)
        
        if (userLw) {
          setLearnedWordsList(userLw)
        }
      } catch (e) {
        console.error('Error fetching vocab progress:', e)
      }
    }
    fetchVocabProgress()
  }, [profile])

  if (authLoading || statsLoading) {
    return (
      <div className="space-y-6 animate-pulse p-4 pb-20 md:pb-4">
        <div className="h-8 w-64 bg-slate-800 rounded-xl" />
        <div className="h-44 bg-slate-800 rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-28 bg-slate-800 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  // ── Calculation logic for Sections ───────────────────────────
  const levelOrder: Level[] = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']
  const currentLevel = profile?.level ?? 'A0'
  const nextLevel = levelOrder[levelOrder.indexOf(currentLevel) + 1] ?? null

  const levelLessons = GRAMMAR_LESSONS.filter(l => l.level === currentLevel)
  const completedLevelLessonsCount = levelLessons.filter(l => completedLessonIds.includes(l.id)).length
  const progressPct = levelLessons.length > 0 
    ? Math.round((completedLevelLessonsCount / levelLessons.length) * 100)
    : 0

  // Estimated weeks logic
  const minsPerWeek = stats?.weeklyData 
    ? stats.weeklyData.reduce((sum: number, day: any) => sum + day.minutes, 0)
    : 0
  const remainingLessons = levelLessons.length - completedLevelLessonsCount
  const estimatedMinsNeeded = remainingLessons * 15 // avg 15 mins practice per lesson
  const estWeeks = minsPerWeek > 0 
    ? Math.max(1, Math.ceil((estimatedMinsNeeded / minsPerWeek)))
    : 3 // default 3 weeks

  // Recharts Chart Formatter
  const chartData = stats?.weeklyData?.map((d: any) => {
    const dateObj = new Date(d.date)
    return {
      date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      minutes: d.minutes
    }
  }) ?? []

  // Vocab Category Progress Calculations
  const vocabTopicsProgress = Object.keys(VOCABULARY_TOPICS).map(topicName => {
    const totalWords = VOCABULARY_WORDS.filter(w => w.topic === topicName).length
    // Find how many words of this topic are learned in learnedWordsList
    const learnedCount = learnedWordsList.filter((lw: any) => {
      const mapped = vocabMapping.get(lw.word_id)
      if (!mapped) return false
      // Match topic name normalized or direct check
      return mapped.category.toLowerCase() === topicName.toLowerCase() || 
             (topicName === 'Greetings & Introductions' && mapped.category.toLowerCase() === 'general') ||
             (topicName === 'Family & People' && mapped.category.toLowerCase() === 'personality')
    }).length

    return {
      name: topicName,
      emoji: VOCABULARY_TOPICS[topicName].emoji,
      level: VOCABULARY_TOPICS[topicName].level,
      learnedCount,
      totalWords: totalWords || 20 // Fallback if no words match
    }
  })

  // Level milestones list
  const levelMilestones = levelOrder.map((lvl: Level) => {
    const totalLvlLessons = GRAMMAR_LESSONS.filter(l => l.level === lvl)
    const completedLvlLessons = totalLvlLessons.filter(l => completedLessonIds.includes(l.id))
    const isCompleted = totalLvlLessons.length > 0 && completedLvlLessons.length === totalLvlLessons.length
    const inProgress = !isCompleted && completedLvlLessons.length > 0
    return {
      level: lvl,
      isCompleted,
      inProgress,
      lessonsCount: totalLvlLessons.length,
      completedCount: completedLvlLessons.length
    }
  })

  // Achievements evaluation
  const achievements = [
    {
      id: 'first_10',
      title: 'First 10 Minutes',
      desc: 'Complete 10 minutes of speaking practice.',
      icon: '🏆',
      isUnlocked: (stats?.totalMinutes ?? 0) >= 10,
      progressStr: `${Math.min(10, stats?.totalMinutes ?? 0)}/10 mins`
    },
    {
      id: 'streak_7',
      title: '7 Day Streak',
      desc: 'Maintain a 7 day active practice streak.',
      icon: '🔥',
      isUnlocked: (stats?.currentStreak ?? 0) >= 7,
      progressStr: `${stats?.currentStreak ?? 0}/7 days`
    },
    {
      id: 'words_50',
      title: '50 Words Learned',
      desc: 'Learn and review 50 vocabulary words.',
      icon: '📖',
      isUnlocked: (stats?.totalWords ?? 0) >= 50,
      progressStr: `${stats?.totalWords ?? 0}/50 words`
    },
    {
      id: 'convs_100',
      title: '100 Conversations',
      desc: 'Complete 100 speaking coach exchanges.',
      icon: '💬',
      isUnlocked: (stats?.totalSessions ?? 0) >= 100,
      progressStr: `${stats?.totalSessions ?? 0}/100 sessions`
    }
  ]

  return (
    <div className="space-y-8 pb-20 md:pb-12 max-w-5xl mx-auto px-4" style={{ background: '#0F172A' }}>
      
      {/* SECTION 1: Level & Journey */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-slate-700 bg-slate-800/40 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10" />

        {/* Large Glowing Level Badge */}
        <div className="relative flex-shrink-0 flex items-center justify-center w-28 h-28 md:w-36 md:h-36 rounded-full bg-slate-900 border-2 border-purple-500 shadow-[0_0_24px_rgba(139,92,246,0.3)] select-none">
          <span className="text-4xl md:text-5xl font-black text-purple-400">{currentLevel}</span>
          <span className="absolute bottom-2 text-[10px] font-bold text-slate-500 tracking-widest uppercase">Level</span>
        </div>

        {/* Journey Details */}
        <div className="flex-1 space-y-4 text-center md:text-left w-full">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-100 flex items-center justify-center md:justify-start gap-2">
              <span>Your English Journey</span>
              <Sparkles size={18} className="text-purple-400" />
            </h2>
            <p className="text-sm font-semibold text-purple-400">
              {nextLevel ? `${progressPct}% to ${nextLevel}` : 'All Levels Complete! 🎉'}
            </p>
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full"
            />
          </div>

          <p className="text-xs text-slate-400">
            Estimated time to {nextLevel ?? 'fluency'}: <span className="font-bold text-slate-200">{estWeeks} {estWeeks === 1 ? 'week' : 'weeks'}</span> at current pace. Keep practicing!
          </p>
        </div>
      </motion.div>

      {/* SECTION 2: Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Current Streak', value: `${stats?.currentStreak ?? 0} Days`, icon: '🔥', color: 'text-amber-500', bg: 'bg-amber-500/5 border-amber-500/10' },
          { label: 'Total Time', value: `${Math.floor((stats?.totalMinutes ?? 0) / 60)}h ${(stats?.totalMinutes ?? 0) % 60}m`, icon: '⏱️', color: 'text-blue-400', bg: 'bg-blue-500/5 border-blue-500/10' },
          { label: 'Total Conversations', value: `${stats?.totalSessions ?? 0} Sessions`, icon: '💬', color: 'text-purple-400', bg: 'bg-purple-500/5 border-purple-500/10' },
          { label: 'Words Learned', value: `${stats?.totalWords ?? 0} / 500`, icon: '📖', color: 'text-emerald-400', bg: 'bg-emerald-500/5 border-emerald-500/10' },
          { label: 'Grammar Topics Done', value: `${completedLessonIds.length} / 46`, icon: '📝', color: 'text-indigo-400', bg: 'bg-indigo-500/5 border-indigo-500/10' },
          { label: 'Grammar Accuracy', value: `${stats?.avgGrammarScore ?? 0}%`, icon: '🎯', color: 'text-red-400', bg: 'bg-red-500/5 border-red-500/10' }
        ].map((s, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={s.label}
          >
            <Card className={`p-5 flex flex-col justify-between h-28 border ${s.bg}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{s.label}</span>
                <span className="text-2xl select-none">{s.icon}</span>
              </div>
              <span className={`text-xl font-extrabold ${s.color}`}>{s.value}</span>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Grid for Weekly Chart & Streak Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SECTION 3: Weekly Activity Chart */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-400" />
            <h3 className="text-base font-bold text-slate-200">Weekly Practice Duration (Last 14 Days)</h3>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 shadow-xl" style={{ minHeight: 340 }}>
            {chartData.length > 0 ? (
              <div style={{ width: '100%', height: 300, minHeight: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} label={{ value: 'mins', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }}
                      labelStyle={{ color: '#F1F5F9', fontWeight: 'bold' }}
                      itemStyle={{ color: '#3B82F6' }}
                    />
                    <Line type="monotone" dataKey="minutes" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#3B82F6', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-xs text-slate-500">
                No activity data available.
              </div>
            )}
          </div>
        </div>

        {/* SECTION 4: Streak Calendar */}
        <div className="h-full">
          <StreakCalendar dailyStreaks={stats?.dailyStreaks} />
        </div>
      </div>

      {/* Grid for Vocabulary breakdown & Grammar milestones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* SECTION 5: Vocabulary Progress */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-emerald-400" />
            <h3 className="text-base font-bold text-slate-200">Vocabulary Progress</h3>
          </div>

          <Card className="p-5 space-y-4 max-h-[420px] overflow-y-auto" hover>
            {vocabTopicsProgress.map(topic => {
              const completed = topic.learnedCount >= topic.totalWords
              const pct = Math.round((topic.learnedCount / topic.totalWords) * 100)
              
              return (
                <div key={topic.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <span>{topic.emoji}</span>
                      <span>{topic.name}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-900 text-slate-400">
                        {topic.level}
                      </span>
                    </span>
                    <span className="font-medium text-slate-400">
                      {topic.learnedCount}/{topic.totalWords} {completed ? '✅' : `${pct}%`}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-900">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </Card>
        </div>

        {/* SECTION 6: Grammar Journey */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckSquare size={18} className="text-indigo-400" />
            <h3 className="text-base font-bold text-slate-200">Grammar Journey</h3>
          </div>

          <Card className="p-5 space-y-4 max-h-[420px] overflow-y-auto" hover>
            {levelMilestones.map(milestone => {
              const active = milestone.lessonsCount > 0 && milestone.completedCount > 0 && milestone.completedCount < milestone.lessonsCount
              return (
                <div key={milestone.level} className="flex items-start gap-3 border-l-2 border-slate-700 pb-3 pl-4 last:pb-0">
                  <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-[10px] border transition-all ${
                    milestone.isCompleted 
                      ? 'bg-indigo-900/30 text-indigo-400 border-indigo-500' 
                      : active 
                        ? 'bg-blue-900/30 text-blue-400 border-blue-500 animate-pulse'
                        : 'bg-slate-950 text-slate-600 border-slate-800'
                  }`}>
                    {milestone.level}
                  </div>
                  <div className="space-y-0.5 w-full">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-200">Level {milestone.level} Curriculum</h4>
                      {milestone.isCompleted && <span className="text-[10px] text-indigo-400 font-bold">Complete ✅</span>}
                      {active && <span className="text-[10px] text-blue-400 font-bold">In Progress...</span>}
                    </div>
                    <p className="text-[10px] text-slate-400">
                      {milestone.completedCount} of {milestone.lessonsCount} grammar lessons mastered
                    </p>
                    <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden border border-slate-900 mt-1.5">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${Math.round((milestone.completedCount / (milestone.lessonsCount || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </Card>
        </div>
      </div>

      {/* SECTION 7: Achievements */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Award size={18} className="text-amber-500" />
          <h3 className="text-base font-bold text-slate-200">Your Achievements</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map(ach => (
            <Card 
              key={ach.id} 
              className={`p-5 flex flex-col items-center text-center space-y-3 transition-all duration-300 border ${
                ach.isUnlocked 
                  ? 'bg-amber-950/5 border-amber-900/20 text-slate-200' 
                  : 'bg-slate-800/20 border-slate-800/80 opacity-50 text-slate-500'
              }`}
            >
              <span className={`text-4xl select-none filter transition-all duration-300 ${ach.isUnlocked ? 'drop-shadow-[0_0_12px_rgba(245,158,11,0.3)] scale-110' : 'grayscale'}`}>
                {ach.icon}
              </span>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-200">{ach.title}</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed max-w-[160px] mx-auto">
                  {ach.desc}
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-500">
                {ach.isUnlocked ? 'Unlocked ✅' : ach.progressStr}
              </span>
            </Card>
          ))}
        </div>
      </div>

    </div>
  )
}
