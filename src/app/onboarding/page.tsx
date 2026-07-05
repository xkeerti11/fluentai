'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react'
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

type Provider = 'groq' | 'gemini' | 'openai'

const PROVIDERS = [
  {
    id: 'groq' as Provider,
    emoji: '⚡',
    name: 'Groq',
    badge: 'Free',
    badgeColor: 'text-green-400',
    prefix: 'gsk_',
    placeholder: 'gsk_...',
    instructionTitle: '✅ Groq — Sabse Best (Free + Fast)',
    titleColor: 'text-green-400',
    steps: [
      { href: 'https://console.groq.com', linkText: 'console.groq.com', after: ' pe jao' },
      { text: 'Google se sign up karo' },
      { text: 'API Keys → Create API Key' },
      { text: 'Key copy karo (gsk_ se shuru hogi)' },
    ],
  },
  {
    id: 'gemini' as Provider,
    emoji: '🌟',
    name: 'Gemini',
    badge: 'Free',
    badgeColor: 'text-green-400',
    prefix: 'AIza',
    placeholder: 'AIzaSy...',
    instructionTitle: '✅ Gemini — Google Ka Free AI',
    titleColor: 'text-green-400',
    steps: [
      { href: 'https://aistudio.google.com', linkText: 'aistudio.google.com', after: ' pe jao' },
      { text: 'Get API Key click karo' },
      { text: 'Key copy karo (AIza se shuru hogi)' },
    ],
  },
  {
    id: 'openai' as Provider,
    emoji: '🤖',
    name: 'OpenAI',
    badge: 'Paid',
    badgeColor: 'text-yellow-400',
    prefix: 'sk-',
    placeholder: 'sk-...',
    instructionTitle: '⚠️ OpenAI — Paid (Credit card chahiye)',
    titleColor: 'text-yellow-400',
    steps: [
      { href: 'https://platform.openai.com', linkText: 'platform.openai.com', after: ' pe jao' },
      { text: 'API Keys → Create new secret key' },
      { text: 'Key copy karo (sk- se shuru hogi)' },
    ],
  },
]

// ─── Main Component ───────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter()
  const { setProfile } = useUserStore()

  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [provider, setProvider] = useState<Provider>('groq')
  const [apiKey, setApiKey] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    level: '' as Level,
    goal: '' as Goal,
  })

  const canProceed = () => {
    if (step === 1) return formData.name.trim().length >= 2
    if (step === 2) return !!formData.level
    if (step === 3) return !!formData.goal
    if (step === 4) return apiKey.trim().length > 8
    return false
  }

  const handleNext = () => {
    if (step < 4) setStep(s => s + 1)
    else handleFinishOnboarding()
  }

  const handleFinishOnboarding = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not logged in')

      // Build the key update based on selected provider
      const keyUpdate: Record<string, string | null> = {
        groq_api_key: null,
        openai_api_key: null,
        gemini_api_key: null,
      }
      if (provider === 'groq') keyUpdate.groq_api_key = apiKey.trim()
      if (provider === 'gemini') keyUpdate.gemini_api_key = apiKey.trim()
      if (provider === 'openai') keyUpdate.openai_api_key = apiKey.trim()

      const { data, error } = await supabase
        .from('profiles')
        .update({
          name: formData.name.trim(),
          level: formData.level,
          goal: formData.goal,
          ai_provider: provider,
          ...keyUpdate,
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

  const handleSkipApiKey = async () => {
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

      toast.warning('Settings mein API key add karna mat bhoolna! ⚙️')
      router.push('/dashboard')
    } catch {
      toast.error('Kuch gadbad hui. Dobara try karo.')
      setSaving(false)
    }
  }

  const activeProvider = PROVIDERS.find(p => p.id === provider)!

  return (
    <main className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#0F172A' }}>

      <div className="w-full max-w-lg">
        {/* Progress dots — now 4 steps */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map(i => (
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
                  <p className="text-sm mb-1" style={{ color: '#94A3B8' }}>Step 1 of 4</p>
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
                  <p className="text-sm mb-1" style={{ color: '#94A3B8' }}>Step 2 of 4</p>
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
                  <p className="text-sm mb-1" style={{ color: '#94A3B8' }}>Step 3 of 4</p>
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

              {/* ── Step 4: API Key ── */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-3">🔑</div>
                    <p className="text-sm mb-1" style={{ color: '#94A3B8' }}>Step 4 of 4</p>
                    <h2 className="text-xl font-bold mb-2" style={{ color: '#F1F5F9' }}>
                      Apni AI Key Daalo
                    </h2>
                    <p className="text-sm" style={{ color: '#94A3B8' }}>
                      FluentAI ke liye ek free AI API key chahiye.
                      Neeche se koi bhi ek choose karo.
                    </p>
                  </div>

                  {/* Provider selector */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {PROVIDERS.map(p => (
                      <button
                        key={p.id}
                        onClick={() => { setProvider(p.id); setApiKey('') }}
                        className="p-3 rounded-xl border text-center transition-all"
                        style={{
                          borderColor: provider === p.id ? '#3B82F6' : '#475569',
                          background: provider === p.id ? 'rgba(37,99,235,0.2)' : 'transparent',
                          color: provider === p.id ? '#F1F5F9' : '#94A3B8',
                        }}
                      >
                        <div className="text-lg mb-1">{p.emoji}</div>
                        <div className="text-xs font-medium">{p.name}</div>
                        <div className={`text-xs ${p.badgeColor}`}>{p.badge}</div>
                      </button>
                    ))}
                  </div>

                  {/* Provider-specific instructions */}
                  <div className="rounded-xl p-4 text-sm space-y-2 mb-4"
                    style={{ background: '#0F172A' }}>
                    <p className={`font-medium ${activeProvider.titleColor}`}>
                      {activeProvider.instructionTitle}
                    </p>
                    <ol className="space-y-1 list-decimal list-inside" style={{ color: '#CBD5E1' }}>
                      {activeProvider.steps.map((s, i) => (
                        <li key={i}>
                          {'href' in s ? (
                            <>
                              <a href={s.href} target="_blank" rel="noopener noreferrer"
                                className="text-blue-400 underline">{s.linkText}</a>
                              {s.after}
                            </>
                          ) : s.text}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Key input */}
                  <div className="relative">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={e => setApiKey(e.target.value)}
                      placeholder={activeProvider.placeholder}
                      className="w-full rounded-xl px-4 py-3 pr-12 outline-none transition-colors font-mono text-sm"
                      style={{
                        background: '#0F172A',
                        border: '1px solid #475569',
                        color: '#F1F5F9',
                      }}
                      onFocus={e => (e.target.style.borderColor = '#3B82F6')}
                      onBlur={e => (e.target.style.borderColor = '#475569')}
                    />
                    <button
                      onClick={() => setShowKey(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: '#94A3B8' }}
                    >
                      {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Skip option */}
                  <button
                    onClick={handleSkipApiKey}
                    disabled={saving}
                    className="w-full py-2 text-xs transition-colors disabled:opacity-50"
                    style={{ color: '#64748B' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#CBD5E1')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}
                  >
                    Abhi nahi, baad mein settings mein add karunga →
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons (hidden for Step 4 skip — handled inline) */}
          {step < 4 || (step === 4 && apiKey.trim().length > 8) ? (
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
                ) : step === 4 ? (
                  <>Shuru Karo! 🚀</>
                ) : (
                  <>Aage <ChevronRight size={18} /></>
                )}
              </button>
            </div>
          ) : step === 4 ? (
            // On step 4, if no key entered yet, only show Back + skip (skip handled above inline)
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all"
                style={{ border: '1px solid #334155', color: '#94A3B8', background: 'transparent' }}
              >
                <ChevronLeft size={18} />
                Wapas
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  )
}
