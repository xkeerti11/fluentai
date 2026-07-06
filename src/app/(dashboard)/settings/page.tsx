'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useUserStore } from '@/store/useUserStore'
import { toast } from 'sonner'
import { Eye, EyeOff, ExternalLink, Key, CheckCircle, Zap, Star, Bot } from 'lucide-react'

type Provider = 'groq' | 'gemini' | 'openai'

interface ProviderConfig {
  id: Provider
  name: string
  icon: React.ReactNode
  badge: string
  badgeColor: string
  borderActive: string
  bgActive: string
  model: string
  prefix: string
  placeholder: string
  getLink: string
  getLinkText: string
  steps: string[]
  keyField: 'groq_api_key' | 'openai_api_key' | 'gemini_api_key'
}

const PROVIDERS: ProviderConfig[] = [
  {
    id: 'groq',
    name: 'Groq',
    icon: <Zap className="w-5 h-5" />,
    badge: 'Free',
    badgeColor: 'text-green-400',
    borderActive: '#3B82F6',
    bgActive: 'rgba(37,99,235,0.15)',
    model: 'Llama 3.3 70B',
    prefix: 'gsk_',
    placeholder: 'gsk_xxxxxxxxxxxxxxxxxxxx',
    getLink: 'https://console.groq.com',
    getLinkText: 'console.groq.com',
    steps: [
      'console.groq.com pe jao',
      'Google se sign up karo (free)',
      'API Keys → Create API Key',
      'Key copy karo (gsk_ se shuru hogi) → yahan paste karo',
    ],
    keyField: 'groq_api_key',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    icon: <Star className="w-5 h-5" />,
    badge: 'Free',
    badgeColor: 'text-green-400',
    borderActive: '#8B5CF6',
    bgActive: 'rgba(139,92,246,0.15)',
    model: 'Gemini 2.0 Flash',
    prefix: 'AIza',
    placeholder: 'AIzaSy...',
    getLink: 'https://aistudio.google.com',
    getLinkText: 'aistudio.google.com',
    steps: [
      'aistudio.google.com pe jao',
      'Get API Key click karo',
      'Key copy karo (AIza se shuru hogi) → yahan paste karo',
    ],
    keyField: 'gemini_api_key',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    icon: <Bot className="w-5 h-5" />,
    badge: 'Paid',
    badgeColor: 'text-yellow-400',
    borderActive: '#10B981',
    bgActive: 'rgba(16,185,129,0.15)',
    model: 'GPT-4o mini',
    prefix: 'sk-',
    placeholder: 'sk-...',
    getLink: 'https://platform.openai.com',
    getLinkText: 'platform.openai.com',
    steps: [
      'platform.openai.com pe jao',
      'API Keys → Create new secret key',
      'Key copy karo (sk- se shuru hogi) → yahan paste karo',
    ],
    keyField: 'openai_api_key',
  },
]

export default function SettingsPage() {
  const { profile } = useAuth()
  const { setProfile } = useUserStore()

  const [activeProvider, setActiveProvider] = useState<Provider>('groq')
  const [keys, setKeys] = useState<Record<Provider, string>>({
    groq: '',
    gemini: '',
    openai: '',
  })
  const [showKey, setShowKey] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (profile) {
      setActiveProvider((profile.ai_provider as Provider) || 'groq')
      setKeys({
        groq: profile.groq_api_key || '',
        gemini: profile.gemini_api_key || '',
        openai: profile.openai_api_key || '',
      })
    }
  }, [profile])

  const currentProviderConfig = PROVIDERS.find(p => p.id === activeProvider)!
  const currentKey = keys[activeProvider]

  const handleSaveKey = async () => {
    if (!profile?.id) {
      toast.error('Pehle login karo')
      return
    }
    const key = currentKey.trim()
    if (!key) {
      toast.error('API key enter karo pehle')
      return
    }
    if (!key.startsWith(currentProviderConfig.prefix)) {
      toast.error(`Valid ${currentProviderConfig.name} key hona chahiye (${currentProviderConfig.prefix} se shuru hoti hai)`)
      return
    }

    setSaving(true)
    try {
      const updatePayload: Record<string, string | null> = {
        ai_provider: activeProvider,
        groq_api_key: keys.groq || null,
        gemini_api_key: keys.gemini || null,
        openai_api_key: keys.openai || null,
      }
      // Override the currently active provider's key with the trimmed value
      updatePayload[currentProviderConfig.keyField] = key

      const { error } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', profile?.id)

      if (error) throw error

      if (profile) {
        setProfile({
          ...profile,
          ai_provider: activeProvider,
          groq_api_key: updatePayload.groq_api_key,
          gemini_api_key: updatePayload.gemini_api_key,
          openai_api_key: updatePayload.openai_api_key,
        })
      }

      setSaved(true)
      toast.success(`${currentProviderConfig.name} key save ho gayi! Ab unlimited practice karo 🚀`)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      toast.error('Save nahi hua. Dobara try karo.')
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveKey = async () => {
    if (!profile?.id) return
    try {
      const updatePayload: Record<string, string | null> = {
        [currentProviderConfig.keyField]: null,
      }

      // If the active provider is the one being removed, clear ai_provider too
      if (profile?.ai_provider === activeProvider) {
        updatePayload.ai_provider = 'groq'
      }

      const { error } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', profile?.id)

      if (!error) {
        if (profile) {
          setProfile({
            ...profile,
            ...updatePayload,
            groq_api_key: activeProvider === 'groq' ? null : profile.groq_api_key,
            gemini_api_key: activeProvider === 'gemini' ? null : profile.gemini_api_key,
            openai_api_key: activeProvider === 'openai' ? null : profile.openai_api_key,
          })
        }
        setKeys(k => ({ ...k, [activeProvider]: '' }))
        toast.success(`${currentProviderConfig.name} key remove ho gayi`)
      } else {
        toast.error('Remove nahi ho paya. Dobara try karo.')
      }
    } catch {
      toast.error('Remove nahi ho paya.')
    }
  }

  const getKeyStatus = (p: ProviderConfig) => {
    const key = keys[p.id]
    const isActive = profile?.ai_provider === p.id
    if (key) return isActive ? '✓ Active' : 'Saved (inactive)'
    return 'No key'
  }

  const getKeyStatusColor = (p: ProviderConfig) => {
    const key = keys[p.id]
    const isActive = profile?.ai_provider === p.id
    if (key && isActive) return '#4ADE80'
    if (key) return '#94A3B8'
    return '#F59E0B'
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <h1 className="text-2xl font-bold text-white mb-2">Settings ⚙️</h1>
      <p className="text-slate-400 mb-8">Apni preferences aur AI API settings manage karo</p>

      {/* ── AI Provider & API Key Section ── */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
            <Key className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold">AI Provider &amp; API Key</h2>
            <p className="text-slate-400 text-sm">Apna preferred AI choose karo aur key add karo</p>
          </div>
        </div>

        {/* Provider selector tabs */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {PROVIDERS.map(p => {
            const isSelected = activeProvider === p.id
            const hasKey = !!keys[p.id]
            const isCurrentActive = profile?.ai_provider === p.id

            return (
              <button
                key={p.id}
                onClick={() => { setActiveProvider(p.id); setShowKey(false) }}
                className="relative p-3 rounded-xl border text-center transition-all duration-200"
                style={{
                  borderColor: isSelected ? p.borderActive : '#475569',
                  background: isSelected ? p.bgActive : 'transparent',
                  color: isSelected ? '#F1F5F9' : '#94A3B8',
                }}
              >
                {/* Active badge */}
                {isCurrentActive && (
                  <span className="absolute -top-1.5 -right-1.5 bg-green-500 rounded-full w-3 h-3 border-2 border-slate-800" />
                )}
                <div className="flex justify-center mb-1.5" style={{ color: isSelected ? p.borderActive : '#94A3B8' }}>
                  {p.icon}
                </div>
                <div className="text-xs font-semibold mb-0.5">{p.name}</div>
                <div className={`text-xs ${p.badgeColor}`}>{p.badge}</div>
                {hasKey && (
                  <div className="mt-1">
                    <CheckCircle className="w-3 h-3 mx-auto text-green-400" />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Selected provider info */}
        <div className="bg-blue-900/20 border border-blue-800/40 rounded-xl p-4 mb-5">
          <p className="text-blue-300 text-sm font-medium mb-2">
            {currentProviderConfig.name} — {currentProviderConfig.model}
          </p>
          <p className="text-slate-300 text-sm leading-relaxed mb-3">
            🔑 Free API key kaise le:
          </p>
          <ol className="space-y-1.5 text-sm text-slate-400">
            {currentProviderConfig.steps.map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-400 font-bold min-w-[20px]">{i + 1}.</span>
                {i === 0 ? (
                  <span>
                    <a
                      href={currentProviderConfig.getLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline hover:text-blue-300 inline-flex items-center gap-1"
                    >
                      {currentProviderConfig.getLinkText}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    {' '}pe jao
                  </span>
                ) : (
                  <span>{s}</span>
                )}
              </li>
            ))}
          </ol>
        </div>

        {/* Key input — wrapped in form to satisfy browser accessibility rules */}
        <form onSubmit={e => { e.preventDefault(); handleSaveKey() }} className="relative mb-4">
          <input
            type={showKey ? 'text' : 'password'}
            value={currentKey}
            onChange={e => setKeys(k => ({ ...k, [activeProvider]: e.target.value }))}
            placeholder={currentProviderConfig.placeholder}
            autoComplete="current-password"
            className="w-full bg-slate-900 border border-slate-600
              focus:border-blue-500 rounded-xl px-4 py-3 pr-12
              text-white placeholder-slate-500 text-sm
              outline-none transition-colors font-mono"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2
              text-slate-400 hover:text-white transition-colors"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          {/* Hidden submit so Enter key triggers save */}
          <button type="submit" className="sr-only">Save</button>
        </form>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSaveKey}
            disabled={saving || !currentKey}
            className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50
              disabled:cursor-not-allowed text-white py-3 rounded-xl
              font-medium transition-colors flex items-center justify-center gap-2"
          >
            {saved ? (
              <><CheckCircle className="w-4 h-4" /> Saved!</>
            ) : saving ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white
                rounded-full animate-spin" /> Saving...</>
            ) : (
              'Key Save Karo'
            )}
          </button>
          {currentKey && (
            <button
              onClick={handleRemoveKey}
              className="px-4 py-3 border border-slate-600 hover:border-red-500
                text-slate-400 hover:text-red-400 rounded-xl transition-colors text-sm"
            >
              Remove
            </button>
          )}
        </div>

        <p className="text-slate-500 text-xs mt-3 text-center">
          🔒 Tumhari key encrypted database mein store hoti hai. Kisi ke saath share nahi hoti.
        </p>
      </div>

      {/* ── Plan / Status Info ── */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-4">Plan Info</h2>
        <div className="flex items-center justify-between py-3 border-b border-slate-700">
          <span className="text-slate-400">Current Plan</span>
          <span className="text-green-400 font-medium">Free Forever ✓</span>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-slate-700">
          <span className="text-slate-400">Active Provider</span>
          <span className="text-white capitalize">
            {PROVIDERS.find(p => p.id === (profile?.ai_provider || 'groq'))?.name || 'Groq'}
          </span>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-slate-700">
          <span className="text-slate-400">AI Model</span>
          <span className="text-white">
            {PROVIDERS.find(p => p.id === (profile?.ai_provider || 'groq'))?.model || 'Llama 3.3 70B'}
          </span>
        </div>

        {/* Per-provider key status */}
        {PROVIDERS.map(p => (
          <div key={p.id} className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0">
            <span className="text-slate-400">{p.name} Key</span>
            <span className="text-sm font-medium" style={{ color: getKeyStatusColor(p) }}>
              {getKeyStatus(p)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
