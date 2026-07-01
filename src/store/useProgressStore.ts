'use client'
import { create } from 'zustand'

interface ProgressStore {
  // Current session
  sessionStartTime: Date | null
  sessionMinutes: number
  sessionMessageCount: number
  sessionGrammarScores: number[]

  // Overall stats (cached from API)
  totalMinutes: number
  totalWords: number
  currentStreak: number
  avgGrammarScore: number

  // Actions
  startSession: () => void
  endSession: () => void
  addGrammarScore: (score: number) => void
  incrementMessages: () => void
  setStats: (stats: {
    totalMinutes: number
    totalWords: number
    currentStreak: number
    avgGrammarScore: number
  }) => void
  reset: () => void
}

export const useProgressStore = create<ProgressStore>((set, get) => ({
  sessionStartTime: null,
  sessionMinutes: 0,
  sessionMessageCount: 0,
  sessionGrammarScores: [],

  totalMinutes: 0,
  totalWords: 0,
  currentStreak: 0,
  avgGrammarScore: 0,

  startSession: () =>
    set({
      sessionStartTime: new Date(),
      sessionMinutes: 0,
      sessionMessageCount: 0,
      sessionGrammarScores: [],
    }),

  endSession: () => {
    const { sessionStartTime } = get()
    if (!sessionStartTime) return
    const minutes = Math.floor(
      (Date.now() - sessionStartTime.getTime()) / 60_000
    )
    set({ sessionMinutes: minutes, sessionStartTime: null })
  },

  addGrammarScore: (score) =>
    set((state) => ({
      sessionGrammarScores: [...state.sessionGrammarScores, score],
    })),

  incrementMessages: () =>
    set((state) => ({
      sessionMessageCount: state.sessionMessageCount + 1,
    })),

  setStats: (stats) => set(stats),

  reset: () =>
    set({
      sessionStartTime: null,
      sessionMinutes: 0,
      sessionMessageCount: 0,
      sessionGrammarScores: [],
    }),
}))
