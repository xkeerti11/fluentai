import type { Level } from './database'

// ─────────────────────────────────────────
// Chat Message Types
// ─────────────────────────────────────────

export interface GrammarNote {
  has_error: boolean
  original?: string | null
  corrected?: string | null
  rule?: string | null
  explanation_hindi?: string | null
}

export interface VocabularyHint {
  word: string
  meaning_hindi: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  grammarNote?: GrammarNote
  vocabulary?: VocabularyHint[]
  levelAssessment?: Level
  correction?: {
    made: boolean
    original_mistake?: string
    subtle_correction_used?: string
  }
  new_word?: {
    word: string
    used_in_sentence: string
  }
  timestamp: Date
  isLoading?: boolean
}

// ─────────────────────────────────────────
// API Response from /api/chat
// ─────────────────────────────────────────

export interface ChatAPIResponse {
  reply: string
  grammar_note: GrammarNote
  vocabulary: VocabularyHint[]
  level_assessment?: Level
}

// ─────────────────────────────────────────
// Grammar API Response from /api/grammar
// ─────────────────────────────────────────

export interface GrammarError {
  wrong: string
  right: string
  rule: string
  explanation_hindi: string
  example: string
}

export interface GrammarAPIResponse {
  original: string
  corrected: string
  is_correct: boolean
  errors: GrammarError[]
}

// ─────────────────────────────────────────
// Vocabulary API Response
// ─────────────────────────────────────────

export interface GeneratedWord {
  word: string
  meaning_hindi: string
  example: string
  tip?: string
}

export interface VocabularyAPIResponse {
  words: GeneratedWord[]
}

// ─────────────────────────────────────────
// Speaking Challenge
// ─────────────────────────────────────────

export interface SpeakingChallenge {
  title: string
  instruction: string
  topic: string
  example_response: string
  time_limit_seconds: number
  tips: string[]
}
