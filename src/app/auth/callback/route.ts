import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createServerSupabase()

    try {
      // Exchange code for session (handles both Google OAuth & email confirmation links)
      const { data: { session }, error: sessionError } =
        await supabase.auth.exchangeCodeForSession(code)

      if (sessionError || !session) {
        console.error('Session error:', sessionError)
        return NextResponse.redirect(
          new URL('/login?error=auth_error', requestUrl.origin)
        )
      }

      const user = session.user

      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, onboarding_completed')
        .eq('id', user.id)
        .maybeSingle()

      // If profile doesn't exist, create it
      if (!existingProfile) {
        const userName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split('@')[0] ||
          'User'

        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            name: userName,
            email: user.email!,
            level: 'A0',
            goal: 'general',
            native_language: 'hindi',
            onboarding_completed: false,
            current_day: 1,
            ai_provider: 'groq'
          })

        if (insertError) {
          console.error('Profile insert error:', insertError)
        }

        // New user → onboarding
        return NextResponse.redirect(
          new URL('/onboarding', requestUrl.origin)
        )
      }

      // Profile exists but onboarding not done
      if (!existingProfile.onboarding_completed) {
        return NextResponse.redirect(
          new URL('/onboarding', requestUrl.origin)
        )
      }

      // Everything good → dashboard
      return NextResponse.redirect(
        new URL('/dashboard', requestUrl.origin)
      )
    } catch (error) {
      console.error('Callback error:', error)
      return NextResponse.redirect(
        new URL('/login?error=unknown', requestUrl.origin)
      )
    }
  }

  // No code → redirect to login
  return NextResponse.redirect(
    new URL('/login', requestUrl.origin)
  )
}
