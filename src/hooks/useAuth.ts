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
      const { data: { user } } = await supabase.auth.getUser()
      const fetchId = user?.id || userId
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', fetchId)
        .maybeSingle()

      if (data) setProfile(data)
    } catch (e) {
      console.error('Error fetching profile:', e)
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
