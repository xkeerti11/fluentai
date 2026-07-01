'use client'
import { create } from 'zustand'
import type { ChatMessage } from '@/types/chat'

interface ChatStore {
  messages: ChatMessage[]
  isLoading: boolean
  isListening: boolean
  voiceEnabled: boolean
  sessionId: string

  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  updateLastMessage: (updates: Partial<ChatMessage>) => void
  setLoading: (loading: boolean) => void
  setListening: (listening: boolean) => void
  toggleVoice: () => void
  clearChat: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isLoading: false,
  isListening: false,
  voiceEnabled: true,
  sessionId: crypto.randomUUID(),

  addMessage: (msg) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...msg,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        },
      ],
    })),

  updateLastMessage: (updates) =>
    set((state) => {
      const msgs = [...state.messages]
      if (msgs.length === 0) return {}
      msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], ...updates }
      return { messages: msgs }
    }),

  setLoading: (isLoading) => set({ isLoading }),
  setListening: (isListening) => set({ isListening }),
  toggleVoice: () => set((state) => ({ voiceEnabled: !state.voiceEnabled })),

  clearChat: () =>
    set({
      messages: [],
      sessionId: crypto.randomUUID(),
      isLoading: false,
      isListening: false,
    }),
}))
