export function getNextReviewDate(correct: boolean, correctCount: number): Date {
  const days = correct 
    ? [1, 3, 7, 14, 30, 60][Math.min(correctCount, 5)]
    : 1
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}
