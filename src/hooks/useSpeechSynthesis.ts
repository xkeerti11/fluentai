'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Check support and load voices
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.speechSynthesis) return

    setIsSupported(true)

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      if (availableVoices.length > 0) {
        setVoices(availableVoices)
      }
    }

    // Chrome loads voices async
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices

    return () => {
      window.speechSynthesis.cancel()
    }
  }, [])

  // Get best English voice
  const getBestVoice = useCallback((voiceList: SpeechSynthesisVoice[]) => {
    // Priority order — best quality first
    const priorities = [
      (v: SpeechSynthesisVoice) => v.name.includes('Google') && v.lang.startsWith('en'),
      (v: SpeechSynthesisVoice) => v.name.includes('Microsoft') && v.lang.startsWith('en'),
      (v: SpeechSynthesisVoice) => v.lang === 'en-US' && !v.localService,
      (v: SpeechSynthesisVoice) => v.lang === 'en-GB' && !v.localService,
      (v: SpeechSynthesisVoice) => v.lang.startsWith('en-'),
      (v: SpeechSynthesisVoice) => v.lang.startsWith('en'),
    ]

    for (const priority of priorities) {
      const found = voiceList.find(priority)
      if (found) return found
    }

    return voiceList[0] || null
  }, [])

  const speak = useCallback((text: string) => {
    if (!text || typeof window === 'undefined') return
    if (!window.speechSynthesis) return

    // Stop any current speech
    window.speechSynthesis.cancel()

    // Small delay for Chrome (needed after cancel)
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text)

      // Voice settings optimized for English learners
      utterance.lang = 'en-US'
      utterance.rate = 0.85   // Slightly slow — good for learners
      utterance.pitch = 1.0
      utterance.volume = 1.0

      // Set best available voice
      const currentVoices = voices.length > 0
        ? voices
        : window.speechSynthesis.getVoices()

      const bestVoice = getBestVoice(currentVoices)
      if (bestVoice) {
        utterance.voice = bestVoice
      }

      // Event handlers
      utterance.onstart = () => setIsSpeaking(true)

      utterance.onend = () => {
        setIsSpeaking(false)
        utteranceRef.current = null
      }

      utterance.onerror = (event) => {
        // Ignore 'interrupted' error (happens when cancelled)
        if (event.error !== 'interrupted') {
          console.warn('TTS error:', event.error)
        }
        setIsSpeaking(false)
        utteranceRef.current = null
      }

      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    }, 50)

  }, [voices, getBestVoice])

  const stopSpeaking = useCallback(() => {
    if (typeof window === 'undefined') return
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    utteranceRef.current = null
  }, [])

  const speakSlower = useCallback((text: string) => {
    if (!text || typeof window === 'undefined') return
    if (!window.speechSynthesis) return

    window.speechSynthesis.cancel()

    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.65  // Very slow for difficult words
      utterance.pitch = 1.0
      utterance.volume = 1.0

      const currentVoices = voices.length > 0
        ? voices
        : window.speechSynthesis.getVoices()

      const bestVoice = getBestVoice(currentVoices)
      if (bestVoice) utterance.voice = bestVoice

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      window.speechSynthesis.speak(utterance)
    }, 50)
  }, [voices, getBestVoice])

  return {
    speak,
    stopSpeaking,
    speakSlower,
    isSpeaking,
    isSupported,
    voices
  }
}
