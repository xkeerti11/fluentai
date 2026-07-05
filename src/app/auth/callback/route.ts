import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type')

  if (code) {
    const supabase = await createServerSupabase()
    const { data: { session } } = await supabase.auth.exchangeCodeForSession(code)

    if (session) {
      // Check if profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle()

      if (!profile) {
        // New user — create profile
        const userName = session.user.user_metadata?.full_name 
          || session.user.email?.split('@')[0] 
          || 'User'
          
        await supabase.from('profiles').insert({
          id: session.user.id,
          name: userName,
          email: session.user.email!,
          level: 'A0',
          goal: 'general',
          native_language: 'hindi',
          onboarding_completed: false,
          current_day: 1
        })
        return NextResponse.redirect(new URL('/onboarding', requestUrl.origin))
      }

      if (!profile.onboarding_completed) {
        return NextResponse.redirect(new URL('/onboarding', requestUrl.origin))
      }
      
      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
    }
  }

  // Fallback
  return NextResponse.redirect(new URL('/login', requestUrl.origin))
}
