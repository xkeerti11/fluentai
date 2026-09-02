'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const voicesRef = useRef<SpeechSynthesisVoice[]>([])
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const retryCountRef = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.speechSynthesis) return
    setIsSupported(true)

    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices()
      if (v.length > 0) voicesRef.current = v
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices

    // Chrome bug fix: speechSynthesis pauses in background
    // Keep it alive with periodic resume
    const keepAlive = setInterval(() => {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume()
      }
    }, 5000)

    return () => {
      clearInterval(keepAlive)
      window.speechSynthesis.cancel()
    }
  }, [])

  const getBestVoice = useCallback(() => {
    const voices = voicesRef.current.length > 0
      ? voicesRef.current
      : (typeof window !== 'undefined' 
          ? window.speechSynthesis.getVoices() 
          : [])

    // Priority: Google voices first, then any English
    const priorities = [
      (v: SpeechSynthesisVoice) => 
        v.name.includes('Google') && v.lang === 'en-US',
      (v: SpeechSynthesisVoice) => 
        v.name.includes('Google') && v.lang.startsWith('en'),
      (v: SpeechSynthesisVoice) => 
        v.name.includes('Microsoft') && v.lang.startsWith('en'),
      (v: SpeechSynthesisVoice) => 
        v.lang === 'en-US',
      (v: SpeechSynthesisVoice) => 
        v.lang.startsWith('en'),
    ]

    for (const p of priorities) {
      const found = voices.find(p)
      if (found) return found
    }
    return voices[0] || null
  }, [])

  const speakWithRetry = useCallback((
    text: string, 
    rate: number = 0.85,
    attempt: number = 0
  ) => {
    if (!text || typeof window === 'undefined') return
    if (!window.speechSynthesis) return

    window.speechSynthesis.cancel()

    const delay = attempt === 0 ? 100 : 300
    
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = rate
      utterance.pitch = 1.0
      utterance.volume = 1.0

      const voice = getBestVoice()
      if (voice) utterance.voice = voice

      utterance.onstart = () => {
        setIsSpeaking(true)
        retryCountRef.current = 0
      }

      utterance.onend = () => {
        setIsSpeaking(false)
        utteranceRef.current = null
      }

      utterance.onerror = (e) => {
        if (e.error === 'interrupted' || e.error === 'canceled') {
          setIsSpeaking(false)
          return
        }
        // Retry on error (max 2 times)
        if (attempt < 2) {
          console.warn(`TTS error (attempt ${attempt + 1}):`, e.error)
          setIsSpeaking(false)
          speakWithRetry(text, rate, attempt + 1)
        } else {
          setIsSpeaking(false)
        }
      }

      utteranceRef.current = utterance
      
      // Extra safety: if speechSynthesis is paused, resume first
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume()
      }
      
      window.speechSynthesis.speak(utterance)

      // Chrome bug: sometimes speak() silently fails
      // Check after 1s if it actually started
      setTimeout(() => {
        if (utteranceRef.current === utterance && !window.speechSynthesis.speaking) {
          if (attempt < 2) {
            speakWithRetry(text, rate, attempt + 1)
          }
        }
      }, 1000)

    }, delay)
  }, [getBestVoice])

  const speak = useCallback((text: string) => {
    speakWithRetry(text, 0.85, 0)
  }, [speakWithRetry])

  const speakSlower = useCallback((text: string) => {
    speakWithRetry(text, 0.65, 0)
  }, [speakWithRetry])

  const stopSpeaking = useCallback(() => {
    if (typeof window === 'undefined') return
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    utteranceRef.current = null
  }, [])

  return { speak, speakSlower, stopSpeaking, isSpeaking, isSupported }
}
