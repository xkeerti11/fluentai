'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Loader2, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useUserStore } from '@/store/useUserStore'
import { toast } from 'sonner'
import type { Level, Goal } from '@/types/database'

const LEVEL_OPTIONS = [
  { value: 'A0', label: 'Bilkul zero, Hindi me baat karta hoon', emoji: '🌱' },
  { value: 'A1', label: 'Thoda thoda samajh aata hai', emoji: '🌿' },
  { value: 'A2', label: 'Basic sentences bol sakta hoon', emoji: '🌳' },
  { value: 'B1', label: 'Conversation kar sakta hoon', emoji: '🏔️' },
  { value: 'B2', label: 'Comfortable hoon English me', emoji: '🦅' },
  { value: 'C1', label: 'Confidently fluent hoon, polish chahiye', emoji: '🎓' },
]

const GOAL_OPTIONS = [
  { value: 'agency_owner', label: 'Agency owner / Freelancer banna chahta hoon', emoji: '🏢' },
  { value: 'job_interview', label: 'Job interview clear karna hai', emoji: '👔' },
  { value: 'freelancer', label: 'Daily life mein English bolna hai', emoji: '🗣️' },
  { value: 'ielts', label: 'IELTS exam dena hai', emoji: '📝' },
  { value: 'general', label: 'Bas fluent banna chahta hoon', emoji: '✨' },
]


// ─── Main Component ───────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter()
  const { setProfile } = useUserStore()

  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    level: '' as Level,
    goal: '' as Goal,
  })

  const canProceed = () => {
    if (step === 1) return formData.name.trim().length >= 2
    if (step === 2) return !!formData.level
    if (step === 3) return !!formData.goal
    return false
  }

  const handleNext = () => {
    if (step < 3) setStep(s => s + 1)
    else handleFinish()
  }

  const handleFinish = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not logged in')

      const { data, error } = await supabase
        .from('profiles')
        .update({
          name: formData.name.trim(),
          level: formData.level,
          goal: formData.goal,
          onboarding_completed: true,
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      if (data) setProfile(data)

      toast.success('Profile set! Chaliye shuru karte hain 🎉')
      router.push('/dashboard')
    } catch {
      toast.error('Kuch gadbad hui. Dobara try karo.')
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#0F172A' }}>

      <div className="w-full max-w-lg">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: step === i ? '32px' : '8px',
                background: step >= i ? '#2563EB' : '#334155',
              }}
            />
          ))}
        </div>

        {/* Step Card */}
        <div className="rounded-2xl border p-8"
          style={{ background: '#1E293B', borderColor: '#334155' }}>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {/* ── Step 1: Name ── */}
              {step === 1 && (
                <div>
                  <p className="text-sm mb-1" style={{ color: '#94A3B8' }}>Step 1 of 3</p>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: '#F1F5F9' }}>
                    Tumhara naam kya hai? 👋
                  </h2>
                  <p className="text-sm mb-6" style={{ color: '#94A3B8' }}>
                    What is your name?
                  </p>
                  <input
                    type="text"
                    placeholder="Apna naam likho..."
                    value={formData.name}
                    onChange={e => setFormData(d => ({ ...d, name: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && canProceed() && handleNext()}
                    autoFocus
                    className="w-full px-4 py-3 rounded-xl text-lg font-medium outline-none transition-all"
                    style={{
                      background: '#0F172A',
                      border: '1px solid #334155',
                      color: '#F1F5F9',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#2563EB')}
                    onBlur={e => (e.target.style.borderColor = '#334155')}
                  />
                </div>
              )}

              {/* ── Step 2: Level ── */}
              {step === 2 && (
                <div>
                  <p className="text-sm mb-1" style={{ color: '#94A3B8' }}>Step 2 of 3</p>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: '#F1F5F9' }}>
                    Tumhari English abhi kaisi hai? 📚
                  </h2>
                  <p className="text-sm mb-6" style={{ color: '#94A3B8' }}>
                    What is your current English level?
                  </p>
                  <div className="space-y-2">
                    {LEVEL_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setFormData(d => ({ ...d, level: opt.value as Level }))}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-150"
                        style={{
                          background: formData.level === opt.value ? 'rgba(37,99,235,0.15)' : 'transparent',
                          border: `1px solid ${formData.level === opt.value ? '#2563EB' : '#334155'}`,
                          color: '#F1F5F9',
                        }}
                      >
                        <span className="text-xl">{opt.emoji}</span>
                        <div>
                          <span className="font-semibold text-sm" style={{ color: '#2563EB' }}>{opt.value}</span>
                          <span className="text-sm ml-2" style={{ color: '#94A3B8' }}>{opt.label}</span>
                        </div>
                        {formData.level === opt.value && (
                          <CheckCircle size={16} className="ml-auto" style={{ color: '#2563EB' }} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 3: Goal ── */}
              {step === 3 && (
                <div>
                  <p className="text-sm mb-1" style={{ color: '#94A3B8' }}>Step 3 of 3</p>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: '#F1F5F9' }}>
                    Tumhara main goal kya hai? 🎯
                  </h2>
                  <p className="text-sm mb-6" style={{ color: '#94A3B8' }}>
                    Why do you want to learn English?
                  </p>
                  <div className="space-y-2">
                    {GOAL_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setFormData(d => ({ ...d, goal: opt.value as Goal }))}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-150"
                        style={{
                          background: formData.goal === opt.value ? 'rgba(37,99,235,0.15)' : 'transparent',
                          border: `1px solid ${formData.goal === opt.value ? '#2563EB' : '#334155'}`,
                          color: '#F1F5F9',
                        }}
                      >
                        <span className="text-xl">{opt.emoji}</span>
                        <span className="text-sm" style={{ color: '#94A3B8' }}>{opt.label}</span>
                        {formData.goal === opt.value && (
                          <CheckCircle size={16} className="ml-auto" style={{ color: '#2563EB' }} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all"
                style={{ border: '1px solid #334155', color: '#94A3B8', background: 'transparent' }}
              >
                <ChevronLeft size={18} />
                Wapas
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed() || saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: '#2563EB' }}
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : step === 3 ? (
                <>Shuru Karo! 🚀</>
              ) : (
                <>Aage <ChevronRight size={18} /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
