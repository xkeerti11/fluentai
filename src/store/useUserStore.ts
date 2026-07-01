'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Profile, Level } from '@/types/database'

interface UserStore {
  profile: Profile | null
  setProfile: (profile: Profile | null) => void
  updateLevel: (level: Level) => void
  updateGoal: (goal: string) => void
  clearProfile: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      profile: null,

      setProfile: (profile) => set({ profile }),

      updateLevel: (level) =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, level }
            : null,
        })),

      updateGoal: (goal) =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, goal: goal as Profile['goal'] }
            : null,
        })),

      clearProfile: () => set({ profile: null }),
    }),
    {
      name: 'fluentai-user',
      // Only persist non-sensitive fields
      partialize: (state) => ({ profile: state.profile }),
    }
  )
)
