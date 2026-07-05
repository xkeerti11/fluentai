// ─────────────────────────────────────────
// CEFR Levels & Goals
// ─────────────────────────────────────────
export type Level = 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
export type Goal = 'general' | 'job_interview' | 'agency_owner' | 'freelancer' | 'ielts'

// ─────────────────────────────────────────
// Database Table Types
// ─────────────────────────────────────────

export interface Profile {
  id: string
  name: string
  email: string
  level: Level
  goal: Goal
  native_language: string
  onboarding_completed: boolean
  current_day: number        // Day 1–180 of the learning journey
  created_at: string
  updated_at: string
  // BYOK — user-supplied AI keys
  ai_provider?: string        // 'groq' | 'gemini' | 'openai'
  groq_api_key?: string | null
  openai_api_key?: string | null
  gemini_api_key?: string | null
}

export interface Conversation {
  id: string
  user_id: string
  user_message: string
  ai_response: string
  grammar_corrected?: string
  grammar_rule?: string
  grammar_explanation_hindi?: string
  grammar_score?: number
  session_id: string
  created_at: string
}

export interface VocabularyWord {
  id: string
  word: string
  meaning_hindi: string
  example_sentence: string
  level: Level
  category: string
  created_at: string
}

export interface LearnedWord {
  id: string
  user_id: string
  word_id: string
  mastered: boolean
  seen_count: number
  correct_count?: number
  incorrect_count?: number
  next_review_date?: string
  last_seen_at: string
  created_at: string
  // Joined vocabulary data
  vocabulary?: VocabularyWord
}

export interface SpeakingSession {
  id: string
  user_id: string
  duration_seconds: number
  message_count: number
  grammar_score?: number
  fluency_score?: number
  words_practiced: number
  mode: 'general' | 'grammar' | 'vocabulary' | 'roleplay' | 'challenge'
  grammar_topic_practiced?: string
  vocabulary_words_used?: string[]
  session_summary?: string
  roleplay_feedback?: any
  created_at: string
}

export interface DailyStreak {
  id: string
  user_id: string
  date: string
  minutes_practiced: number
}

export interface GrammarProgress {
  user_id: string
  lesson_id: number
  completed: boolean
  completed_at: string
  practice_minutes?: number
}

// ─────────────────────────────────────────
// Supabase Database Shape (for typed client)
// ─────────────────────────────────────────
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
        Relationships: []
      }
      conversations: {
        Row: Conversation
        Insert: Omit<Conversation, 'id' | 'created_at'>
        Update: Partial<Omit<Conversation, 'id' | 'created_at'>>
        Relationships: []
      }
      vocabulary: {
        Row: VocabularyWord
        Insert: Omit<VocabularyWord, 'id' | 'created_at'>
        Update: Partial<Omit<VocabularyWord, 'id' | 'created_at'>>
        Relationships: []
      }
      learned_words: {
        Row: LearnedWord
        Insert: Omit<LearnedWord, 'id' | 'created_at' | 'vocabulary'>
        Update: Partial<Omit<LearnedWord, 'id' | 'created_at'>>
        Relationships: []
      }
      speaking_sessions: {
        Row: SpeakingSession
        Insert: Omit<SpeakingSession, 'id' | 'created_at'>
        Update: Partial<Omit<SpeakingSession, 'id' | 'created_at'>>
        Relationships: []
      }
      daily_streaks: {
        Row: DailyStreak
        Insert: Omit<DailyStreak, 'id'>
        Update: Partial<Omit<DailyStreak, 'id'>>
        Relationships: []
      }
      grammar_progress: {
        Row: GrammarProgress
        Insert: Omit<GrammarProgress, 'completed_at'>
        Update: Partial<Omit<GrammarProgress, 'user_id' | 'lesson_id'>>
        Relationships: []
      }
    }
  }
}
