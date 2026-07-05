'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Lock, Eye, EyeOff, Zap } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleReset = async () => {
    if (password.length < 6) {
      toast.error('Password kam se kam 6 characters ka hona chahiye')
      return
    }
    if (password !== confirm) {
      toast.error('Dono passwords match nahi kar rahe')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      toast.success('Password change ho gaya! Ab login karo.')
      router.push('/login')
    } catch (err: any) {
      toast.error('Password reset nahi hua. Link expire ho gaya hoga.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="w-8 h-8 text-blue-400" />
            <span className="text-3xl font-bold text-white">FluentAI</span>
          </div>
          <p className="text-slate-400">Naya password set karo</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
          <h2 className="text-white font-semibold text-lg mb-6">
            Naya Password
          </h2>

          <div className="mb-4">
            <label className="text-slate-300 text-sm font-medium mb-2 block">
              Naya Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kam se kam 6 characters"
                className="w-full bg-slate-900 border border-slate-600 
                  focus:border-blue-500 rounded-xl px-4 py-3 pl-10 pr-12
                  text-white placeholder-slate-500 text-sm outline-none transition-colors"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 
                  text-slate-400 hover:text-white"
              >
                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="text-slate-300 text-sm font-medium mb-2 block">
              Password Confirm Karo
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Wahi password dobara likho"
                onKeyDown={(e) => e.key === 'Enter' && handleReset()}
                className="w-full bg-slate-900 border border-slate-600 
                  focus:border-blue-500 rounded-xl px-4 py-3 pl-10
                  text-white placeholder-slate-500 text-sm outline-none transition-colors"
              />
            </div>
          </div>

          <button
            onClick={handleReset}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50
              text-white py-3 rounded-xl font-semibold transition-colors
              flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white 
                rounded-full animate-spin" />
            ) : 'Password Update Karo'}
          </button>
        </div>
      </div>
    </div>
  )
}
