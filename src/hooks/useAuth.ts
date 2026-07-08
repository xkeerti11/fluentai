'use client'
import { useEffect, useState, useCallback } from 'react'
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { useUserStore } from '@/store/useUserStore'
import type { Profile } from '@/types/database'

interface UseAuthReturn {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { profile, setProfile, clearProfile } = useUserStore()

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Profile fetch error:', error)
        setProfile(null)
        setLoading(false)
        return
      }

      if (!data) {
        // Profile doesn't exist yet — can happen with email signup
        // Auto-create profile so the app stays functional
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const userName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split('@')[0] ||
            'User'

          const { data: newProfile, error: insertError } = await supabase
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
            .select()
            .single()

          if (insertError && insertError.code !== '23505') {
            console.error('Profile auto-create error:', insertError)
            setProfile(null)
          } else if (newProfile) {
            setProfile(newProfile)
          } else {
            // 23505 duplicate — profile was just created by another path, re-fetch
            const { data: refetched } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .maybeSingle()
            setProfile(refetched)
          }
        } else {
          setProfile(null)
        }
        setLoading(false)
        return
      }

      setProfile(data)
    } catch (e) {
      console.error('Error fetching profile:', e)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }, [setProfile])

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          clearProfile()
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [fetchProfile, clearProfile])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    clearProfile()
  }, [clearProfile])

  return { user, profile, loading, signOut }
}
