'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, ArrowRight, Star, ShieldAlert, Sparkles, Check, CheckCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function LandingPage() {
  const { user, loading } = useAuth()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err) {
      console.error(err)
      toast.error('Login mein kuch gadbad hui. Dobara try karo.')
    }
  }

  // Navbar component
  const Navbar = () => (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-md border-b bg-slate-950/80' : 'bg-transparent'
      }`}
      style={{ borderColor: scrolled ? '#334155' : 'transparent' }}
    >
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black text-slate-100 flex items-center gap-1.5 tracking-wider">
            ⚡ FluentAI
          </span>
        </div>
        
        <div>
          {loading ? (
            <div className="h-9 w-20 bg-slate-800 animate-pulse rounded-xl" />
          ) : user ? (
            <Link href="/dashboard">
              <button 
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer shadow-[0_0_15px_rgba(37,99,235,0.3)]"
              >
                Go to Dashboard
              </button>
            </Link>
          ) : (
            <Link href="/login">
              <button 
                className="px-4 py-2 rounded-xl text-xs font-bold border transition-all text-slate-300 hover:text-white border-slate-700 hover:border-slate-500 cursor-pointer"
              >
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  }

  return (
    <main className="min-h-screen text-slate-100 relative overflow-hidden" style={{ background: '#0F172A' }}>
      <Navbar />

      {/* Decorative Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[10%] w-[350px] h-[350px] rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      {/* ── 1. HERO SECTION ───────────────────────────────────── */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 pt-28 pb-16 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase mb-8 border"
          style={{ background: 'rgba(139,92,246,0.1)', borderColor: 'rgba(139,92,246,0.2)', color: '#A78BFA' }}
        >
          <Sparkles size={10} className="text-purple-400 animate-spin-slow" />
          Powered by Ktux
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.15]"
        >
          Apni Awaaz Se <br />
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent filter drop-shadow-sm">
            Seekho English
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-sm sm:text-lg text-slate-400 mt-6 max-w-xl leading-relaxed"
        >
          AI voice tutor jo tere saath baat karta hai, galtiyan naturally sudharta hai, aur roz thoda aage le jaata hai
        </motion.p>

        {/* Hero CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 w-full flex flex-col items-center gap-4"
        >
          {loading ? (
            <div className="h-14 w-52 bg-slate-800 animate-pulse rounded-2xl" />
          ) : user ? (
            <Link href="/dashboard">
              <button 
                className="group flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold text-white transition-all bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-[0_0_30px_rgba(37,99,235,0.4)] active:scale-95 cursor-pointer"
              >
                <Mic size={18} />
                Dashboard Pe Jao
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          ) : (
            <Link href="/login">
              <button 
                className="group flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold text-white transition-all bg-blue-600 hover:bg-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.4)] active:scale-95 cursor-pointer"
              >
                <Mic size={18} />
                Free Mein Shuru Karo
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          )}

          {/* Sub CTA Checklist */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs text-slate-500 font-semibold mt-2">
            <span className="flex items-center gap-1">
              <Check size={12} className="text-emerald-500" /> Bilkul free
            </span>
            <span className="flex items-center gap-1">
              <Check size={12} className="text-emerald-500" /> Google Chrome mein kaam karta hai
            </span>
            <span className="flex items-center gap-1">
              <Check size={12} className="text-emerald-500" /> No download needed
            </span>
          </div>
        </motion.div>

        {/* Decorative Animated Mic Ring visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative inline-flex items-center justify-center mt-16 mb-4 cursor-default select-none group"
        >
          {/* Glowing pulses */}
          <div className="absolute w-36 h-36 rounded-full border border-blue-500/20 animate-ping opacity-30 pointer-events-none" />
          <div className="absolute w-28 h-28 rounded-full border border-purple-500/30 animate-ping opacity-40 pointer-events-none" style={{ animationDelay: '0.4s' }} />
          
          <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center shadow-2xl relative transition-transform duration-300 group-hover:scale-105">
            <div className="absolute inset-0.5 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 blur-sm opacity-50 group-hover:opacity-85 transition-opacity" />
            <div className="w-[72px] h-[72px] rounded-full bg-slate-950 flex items-center justify-center relative">
              <Mic size={30} className="text-blue-400 group-hover:text-purple-400 transition-colors" />
            </div>
          </div>
        </motion.div>
        <span className="text-[10px] text-slate-500 tracking-wider font-semibold uppercase">AI English Speaking Partner</span>
      </section>

      {/* ── 2. FEATURES SECTION ───────────────────────────────── */}
      <section className="py-24 px-6 border-t" style={{ borderColor: '#1E293B' }}>
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100">
              Kya Milega Tumhe?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-semibold max-w-md mx-auto">
              FluentAI ko Hindi bolne walo ke liye design kiya gaya hai taaki zero se fluency tak ka safar aasan ho sake.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {[
              {
                emoji: "🎤",
                title: "AI Dost Ki Tarah Baat Karta Hai",
                desc: "Real-time speech conversation. Jo galti karoge Aria use naturally normal flow me correct karegi bina dawaye."
              },
              {
                emoji: "📝",
                title: "Grammar Bilkul Zero Se",
                desc: "A0 level se lekar advanced C2 level tak ke 46 lessons ka curriculum. Har concept ka Hinglish explanation aur active test."
              },
              {
                emoji: "📖",
                title: "500+ Words Yaad Rehenge",
                desc: "Daily vocab target system powered by Spaced Repetition (SRS). Flashcards aur quick quiz se words pakke ho jayenge."
              },
              {
                emoji: "📊",
                title: "Har Din Progress Dikhega",
                desc: "Streak days, grammar accuracy score, 14 days activity graph, aur 60-day interactive practice commits calendar."
              }
            ].map(feat => (
              <motion.div 
                key={feat.title}
                variants={itemVariants}
                className="p-6 rounded-2xl border transition-all duration-300 hover:border-blue-500/50 hover:bg-slate-800/40 flex items-start gap-4 cursor-default group"
                style={{ background: '#1E293B', borderColor: '#334155' }}
              >
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl flex-shrink-0 group-hover:bg-blue-600/10 group-hover:border-blue-500/25 transition-all">
                  {feat.emoji}
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-100 group-hover:text-blue-400 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 3. HOW IT WORKS ───────────────────────────────────── */}
      <section className="py-24 px-6 border-t" style={{ borderColor: '#1E293B' }}>
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100">
              Kaise Kaam Karta Hai?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-semibold">
              Sirf 3 aasan steps me apni English journey shuru karein:
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
          >
            {/* Step 1 */}
            <motion.div variants={itemVariants} className="flex flex-col items-center text-center space-y-4 relative group">
              <div className="w-16 h-16 rounded-full bg-blue-600/10 border-2 border-blue-500 flex items-center justify-center font-black text-blue-400 text-xl relative">
                🎤
                <span className="absolute -bottom-1 -right-1 text-[10px] font-black bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center">1</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-200">Bolo</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-[240px]">
                Mic dabao, English ya Hindi mein bolo, jo mann mein aaye. Koi judgment nahi.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={itemVariants} className="flex flex-col items-center text-center space-y-4 relative group">
              <div className="w-16 h-16 rounded-full bg-purple-600/10 border-2 border-purple-500 flex items-center justify-center font-black text-purple-400 text-xl relative">
                🤖
                <span className="absolute -bottom-1 -right-1 text-[10px] font-black bg-purple-600 text-white w-5 h-5 rounded-full flex items-center justify-center">2</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-200">AI Sikhata Hai</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-[240px]">
                Aria aapki galtiyan naturally sudharta hai, aur dynamic topics ya conversation scenes ke sath practice karata hai.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={itemVariants} className="flex flex-col items-center text-center space-y-4 relative group">
              <div className="w-16 h-16 rounded-full bg-pink-600/10 border-2 border-pink-500 flex items-center justify-center font-black text-pink-400 text-xl relative">
                📈
                <span className="absolute -bottom-1 -right-1 text-[10px] font-black bg-pink-600 text-white w-5 h-5 rounded-full flex items-center justify-center">3</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-200">Tum Badh Jaate Ho</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-[240px]">
                Roz thoda practice karo, vocabulary aur levels up karo, aur ek din bilkul fluent ban jao!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 4. TESTIMONIAL SECTION ────────────────────────────── */}
      <section className="py-24 px-6 border-t" style={{ borderColor: '#1E293B' }}>
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="absolute top-[-20%] left-[-10%] w-60 h-60 bg-blue-500/5 blur-[80px] pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-3xl border border-slate-700 bg-slate-800/40 relative shadow-2xl space-y-6"
          >
            <span className="text-5xl font-black text-blue-500/20 select-none block leading-none">“</span>
            
            <p className="text-sm md:text-lg text-slate-200 italic font-medium leading-relaxed">
              "Pehle mujhe ek sentence bolne mein 2 minute lagte the. Ab main confidently client call karta hoon."
            </p>
            
            <div className="flex flex-col items-center gap-1 pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-100">Rahul</span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Freelancer</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 5. CTA SECTION ────────────────────────────────────── */}
      <section className="py-24 px-6 border-t relative overflow-hidden" style={{ borderColor: '#1E293B' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-2xl mx-auto text-center space-y-8 relative">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-100 leading-tight">
            Aaj Se Hi Shuru Karo — <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Bilkul Free</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto font-medium">
            Ko bhi payment method ya card nahi chahiye. Google account se click karein aur bolna shuru karein!
          </p>

          <div className="flex flex-col items-center gap-4">
            {loading ? (
              <div className="h-14 w-60 bg-slate-800 animate-pulse rounded-xl" />
            ) : user ? (
              <Link href="/dashboard">
                <button
                  className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 active:scale-95 shadow-xl cursor-pointer"
                >
                  🚀 Dashboard Pe Jao
                </button>
              </Link>
            ) : (
              <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-xl transition-all cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                🚀 Google Se Sign In Karo
              </button>
            )}
            <span className="text-[10px] text-slate-500 font-semibold">Works on Desktop & Android Chrome browsers</span>
          </div>
        </div>
      </section>

      {/* ── 6. FOOTER ─────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xl">⚡</span>
          <span className="text-white font-bold text-lg">FluentAI</span>
        </div>
        <p className="text-slate-400 text-sm mb-1">
          Made for Hindi speakers to conquer English speaking barriers
        </p>
        <p className="text-slate-400 text-sm mb-3">
          Made by: <span className="text-blue-400 font-medium">Ktux</span>
        </p>
        <p className="text-slate-500 text-xs">
          © 2026 FluentAI • All rights reserved.
        </p>
      </footer>
    </main>
  )
}
