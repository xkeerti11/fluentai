import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', origin))
  }

  try {
    const supabase = await createServerSupabase()

    // Exchange the OAuth code for a session
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error || !session) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(new URL('/login?error=auth_failed', origin))
    }

    const user = session.user

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, onboarding_completed')
      .eq('id', user.id)
      .maybeSingle()

    if (!existingProfile) {
      // New user — create profile with defaults
      const { error: insertError } = await supabase.from('profiles').insert({
        id: user.id,
        name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'User',
        email: user.email!,
        level: 'A0',
        goal: 'general',
        native_language: 'hindi',
        onboarding_completed: false,
        current_day: 1,
      })

      if (insertError) {
        console.error('Profile insert error:', insertError)
      }

      // Send to onboarding
      return NextResponse.redirect(new URL('/onboarding', origin))
    }

    // Existing user — check onboarding status
    if (!existingProfile.onboarding_completed) {
      return NextResponse.redirect(new URL('/onboarding', origin))
    }

    // All good — go to dashboard
    return NextResponse.redirect(new URL('/dashboard', origin))

  } catch (err) {
    console.error('Callback unexpected error:', err)
    return NextResponse.redirect(new URL('/login?error=unexpected', origin))
  }
}
