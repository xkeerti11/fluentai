'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useUserStore } from '@/store/useUserStore'
import { toast } from 'sonner'
import { Eye, EyeOff, ExternalLink, Key, CheckCircle } from 'lucide-react'

export default function SettingsPage() {
  const { profile } = useAuth()
  const { setProfile } = useUserStore()
  const [groqKey, setGroqKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (profile?.groq_api_key) {
      setGroqKey(profile.groq_api_key)
    }
  }, [profile])

  const handleSaveKey = async () => {
    if (!groqKey.trim()) {
      toast.error('API key enter karo pehle')
      return
    }
    if (!groqKey.startsWith('gsk_')) {
      toast.error('Valid Groq key hona chahiye (gsk_ se shuru hoti hai)')
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ groq_api_key: groqKey.trim() })
        .eq('id', profile?.id)

      if (error) throw error
      
      if (profile) {
        setProfile({ ...profile, groq_api_key: groqKey.trim() })
      }
      setSaved(true)
      toast.success('API key save ho gayi! Ab unlimited practice karo 🚀')
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      toast.error('Save nahi hua. Dobara try karo.')
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveKey = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({ groq_api_key: null })
      .eq('id', profile?.id)
    
    if (!error) {
      if (profile) {
        setProfile({ ...profile, groq_api_key: null })
      }
      setGroqKey('')
      toast.success('API key remove ho gayi')
    } else {
      toast.error('Remove nahi ho paya. Dobara try karo.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <h1 className="text-2xl font-bold text-white mb-2">Settings ⚙️</h1>
      <p className="text-slate-400 mb-8">Apni preferences aur API settings manage karo</p>

      {/* GROQ API KEY SECTION */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
            <Key className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold">Apni Groq API Key</h2>
            <p className="text-slate-400 text-sm">Unlimited AI conversations ke liye</p>
          </div>
        </div>

        {/* Why section */}
        <div className="bg-blue-900/20 border border-blue-800/50 rounded-xl p-4 mb-5">
          <p className="text-blue-300 text-sm font-medium mb-2">
            🤔 Ye kyun zaroori hai?
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">
            Free version mein shared API key use hoti hai jisme 
            <span className="text-yellow-400 font-medium"> rate limits</span> hain. 
            Apni key add karne se tum
            <span className="text-green-400 font-medium"> unlimited conversations</span> 
            {' '}kar sakte ho bina kisi interruption ke.
          </p>
          <p className="text-slate-400 text-xs mt-2">
            Groq free tier mein bhi 14,400 requests/day milte hain — 
            ek user ke liye plenty hai!
          </p>
        </div>

        {/* Steps to get key */}
        <div className="mb-5">
          <p className="text-slate-300 text-sm font-medium mb-3">
            🔑 Free API key kaise le:
          </p>
          <ol className="space-y-2 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold min-w-[20px]">1.</span>
              <span>
                <a href="https://console.groq.com" target="_blank" 
                   className="text-blue-400 underline hover:text-blue-300 inline-flex items-center gap-1">
                  console.groq.com <ExternalLink className="w-3 h-3" />
                </a>
                {' '}pe jao
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold min-w-[20px]">2.</span>
              <span>Google se sign up karo (free)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold min-w-[20px]">3.</span>
              <span>API Keys → Create API Key</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold min-w-[20px]">4.</span>
              <span>Key copy karo (gsk_ se shuru hogi) → yahan paste karo</span>
            </li>
          </ol>
        </div>

        {/* Input field */}
        <div className="relative mb-4">
          <input
            type={showKey ? 'text' : 'password'}
            value={groqKey}
            onChange={(e) => setGroqKey(e.target.value)}
            placeholder="gsk_xxxxxxxxxxxxxxxxxxxx"
            className="w-full bg-slate-900 border border-slate-600 
              focus:border-blue-500 rounded-xl px-4 py-3 pr-12
              text-white placeholder-slate-500 text-sm
              outline-none transition-colors font-mono"
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 
              text-slate-400 hover:text-white transition-colors"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSaveKey}
            disabled={saving || !groqKey}
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
          <button
            onClick={handleRemoveKey}
            className="px-4 py-3 border border-slate-600 hover:border-red-500
              text-slate-400 hover:text-red-400 rounded-xl transition-colors text-sm"
          >
            Remove
          </button>
        </div>

        {/* Security note */}
        <p className="text-slate-500 text-xs mt-3 text-center">
          🔒 Tumhari key encrypted database mein store hoti hai. 
          Kisi ke saath share nahi hoti.
        </p>
      </div>

      {/* Current plan info */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-4">Plan Info</h2>
        <div className="flex items-center justify-between py-3 border-b border-slate-700">
          <span className="text-slate-400">Current Plan</span>
          <span className="text-green-400 font-medium">Free Forever ✓</span>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-slate-700">
          <span className="text-slate-400">AI Model</span>
          <span className="text-white">Groq Llama 3.3 70B</span>
        </div>
        <div className="flex items-center justify-between py-3">
          <span className="text-slate-400">API Key Status</span>
          <span className={profile?.groq_api_key ? 'text-green-400' : 'text-yellow-400'}>
            {profile?.groq_api_key ? '✓ Custom key active' : '⚡ Shared key (limited)'}
          </span>
        </div>
      </div>
    </div>
  )
}
