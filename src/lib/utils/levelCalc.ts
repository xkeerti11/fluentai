import type { Level } from '@/types/database'

/**
 * Converts an average grammar score (0–100) to a CEFR level.
 * Used to auto-calibrate user level based on conversation history.
 */
export function calculateLevel(grammarScores: number[]): Level {
  if (grammarScores.length === 0) return 'A1'

  const avg = grammarScores.reduce((a, b) => a + b, 0) / grammarScores.length

  if (avg < 20) return 'A0'
  if (avg < 40) return 'A1'
  if (avg < 55) return 'A2'
  if (avg < 70) return 'B1'
  if (avg < 85) return 'B2'
  if (avg < 95) return 'C1'
  return 'C2'
}

/**
 * Returns a human-readable label for a CEFR level.
 */
export function getLevelLabel(level: Level): string {
  const labels: Record<Level, string> = {
    A0: 'Bilkul Beginner',
    A1: 'Elementary',
    A2: 'Pre-Intermediate',
    B1: 'Intermediate',
    B2: 'Upper Intermediate',
    C1: 'Advanced',
    C2: 'Mastery',
  }
  return labels[level]
}

/**
 * Returns a color class for a given level (for badges).
 */
export function getLevelColor(level: Level): string {
  const colors: Record<Level, string> = {
    A0: 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
    A1: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    A2: 'bg-green-500/20 text-green-400 border border-green-500/30',
    B1: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    B2: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    C1: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    C2: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  }
  return colors[level]
}


/**
 * Returns progress percentage toward next level (0–100).
 */
export function getLevelProgress(grammarScores: number[]): number {
  if (grammarScores.length === 0) return 0
  const avg = grammarScores.reduce((a, b) => a + b, 0) / grammarScores.length

  const ranges = [
    { min: 0,  max: 20 },  // A0
    { min: 20, max: 40 },  // A1
    { min: 40, max: 55 },  // A2
    { min: 55, max: 70 },  // B1
    { min: 70, max: 85 },  // B2
    { min: 85, max: 95 },  // C1
    { min: 95, max: 100 }, // C2
  ]

  const range = ranges.find(r => avg >= r.min && avg < r.max) ?? ranges[ranges.length - 1]
  return Math.round(((avg - range.min) / (range.max - range.min)) * 100)
}
