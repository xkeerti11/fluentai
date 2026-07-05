'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Eye, EyeOff, Mail, Lock, User, Zap } from 'lucide-react'

type Mode = 'login' | 'signup' | 'forgot'

export default function LoginPage() {
  const router = useRouter()
  
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Google Login
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  // Email Sign Up
  const handleSignUp = async () => {
    if (!name.trim()) { toast.error('Naam daalo'); return }
    if (!email.trim()) { toast.error('Email daalo'); return }
    if (password.length < 6) { toast.error('Password kam se kam 6 characters ka hona chahiye'); return }
    
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: name.trim() },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) throw error
      
      if (data.user && !data.session) {
        // Email confirmation required
        toast.success('Verification email bheja gaya! Email check karo aur link pe click karo.')
        setMode('login')
      } else if (data.session) {
        // Auto confirmed (if email confirmation disabled in Supabase)
        router.push('/onboarding')
      }
    } catch (err: any) {
      if (err.message?.includes('already registered')) {
        toast.error('Ye email pehle se registered hai. Login karo.')
        setMode('login')
      } else {
        toast.error(err.message || 'Sign up nahi hua. Dobara try karo.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Email Login
  const handleEmailLogin = async () => {
    if (!email.trim()) { toast.error('Email daalo'); return }
    if (!password.trim()) { toast.error('Password daalo'); return }
    
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      })
      
      if (error) throw error
      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      if (err.message?.includes('Invalid login')) {
        toast.error('Email ya password galat hai.')
      } else if (err.message?.includes('Email not confirmed')) {
        toast.error('Email verify nahi hui. Inbox check karo.')
      } else {
        toast.error(err.message || 'Login nahi hua.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Forgot Password
  const handleForgotPassword = async () => {
    if (!email.trim()) { toast.error('Email daalo'); return }
    
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })
      if (error) throw error
      toast.success('Password reset link email pe bhej diya!')
      setMode('login')
    } catch (err: any) {
      toast.error('Email send nahi hua. Dobara try karo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="w-8 h-8 text-blue-400" />
            <span className="text-3xl font-bold text-white">FluentAI</span>
          </div>
          <p className="text-slate-400">Apni Awaaz Se Seekho English</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
          
          {/* Tab switcher (Login / Sign Up) */}
          {mode !== 'forgot' && (
            <div className="flex bg-slate-900 rounded-xl p-1 mb-6">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'login'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'signup'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Forgot Password heading */}
          {mode === 'forgot' && (
            <div className="mb-6">
              <h2 className="text-white font-semibold text-lg">Password Reset</h2>
              <p className="text-slate-400 text-sm mt-1">
                Apni email daalo — reset link bhej denge
              </p>
            </div>
          )}

          {/* Name field (signup only) */}
          {mode === 'signup' && (
            <div className="mb-4">
              <label className="text-slate-300 text-sm font-medium mb-2 block">
                Tumhara Naam
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jaise: Keerti Singh"
                  className="w-full bg-slate-900 border border-slate-600 
                    focus:border-blue-500 rounded-xl px-4 py-3 pl-10
                    text-white placeholder-slate-500 text-sm outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* Email field */}
          <div className="mb-4">
            <label className="text-slate-300 text-sm font-medium mb-2 block">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tumhari@email.com"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    mode === 'login' ? handleEmailLogin() :
                    mode === 'signup' ? handleSignUp() :
                    handleForgotPassword()
                  }
                }}
                className="w-full bg-slate-900 border border-slate-600 
                  focus:border-blue-500 rounded-xl px-4 py-3 pl-10
                  text-white placeholder-slate-500 text-sm outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password field (not shown for forgot) */}
          {mode !== 'forgot' && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-slate-300 text-sm font-medium">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    onClick={() => setMode('forgot')}
                    className="text-blue-400 text-xs hover:text-blue-300"
                  >
                    Bhool gaye?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Kam se kam 6 characters' : 'Tumhara password'}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      mode === 'login' ? handleEmailLogin() : handleSignUp()
                    }
                  }}
                  className="w-full bg-slate-900 border border-slate-600 
                    focus:border-blue-500 rounded-xl px-4 py-3 pl-10 pr-12
                    text-white placeholder-slate-500 text-sm outline-none transition-colors"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 
                    text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword 
                    ? <Eye className="w-4 h-4" /> 
                    : <EyeOff className="w-4 h-4" />
                  }
                </button>
              </div>
              {mode === 'signup' && (
                <p className="text-slate-500 text-xs mt-1">
                  Strong password banao — letters + numbers mix karo
                </p>
              )}
            </div>
          )}

          {/* Main Action Button */}
          <button
            onClick={
              mode === 'login' ? handleEmailLogin :
              mode === 'signup' ? handleSignUp :
              handleForgotPassword
            }
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50
              disabled:cursor-not-allowed text-white py-3 rounded-xl 
              font-semibold transition-colors flex items-center justify-center gap-2 mb-4"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white 
                rounded-full animate-spin" />
            ) : (
              mode === 'login' ? 'Login Karo' :
              mode === 'signup' ? 'Account Banao' :
              'Reset Link Bhejo'
            )}
          </button>

          {/* Back from forgot */}
          {mode === 'forgot' && (
            <button
              onClick={() => setMode('login')}
              className="w-full text-slate-400 hover:text-white text-sm 
                transition-colors py-2 mb-4"
            >
              ← Wapas Login Pe
            </button>
          )}

          {/* Divider */}
          {mode !== 'forgot' && (
            <>
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-slate-700" />
                <span className="text-slate-500 text-xs">YA</span>
                <div className="flex-1 h-px bg-slate-700" />
              </div>

              {/* Google Login */}
              <button
                onClick={handleGoogleLogin}
                className="w-full border border-slate-600 hover:border-slate-500
                  bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl
                  font-medium transition-all flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google Se Continue Karo
              </button>
            </>
          )}
        </div>

        {/* Bottom text */}
        <p className="text-center text-slate-500 text-xs mt-6">
          {mode === 'signup' 
            ? 'Account banake tum agree karte ho hamari terms se'
            : 'Free hai, hamesha rahega ⚡'
          }
        </p>
      </div>
    </div>
  )
}
