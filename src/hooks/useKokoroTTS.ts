'use client'
import { useState, useRef, useCallback } from 'react'

const KOKORO_SERVER = process.env.NEXT_PUBLIC_KOKORO_URL || 'http://localhost:8000'

// Returns true only for localhost/127.x origins where CORS is not an issue
const isLocalServer = (url: string) => {
  try {
    const { hostname } = new URL(url)
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
  } catch {
    return false
  }
}

export function useKokoroTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [serverOnline, setServerOnline] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Check if Kokoro server is running.
  // Skip health check for remote URLs — they block cross-origin requests (CORS)
  // and would produce a red error in the browser console even inside a try/catch.
  const checkServer = useCallback(async () => {
    if (!isLocalServer(KOKORO_SERVER)) {
      // Remote server: skip health check to avoid CORS errors.
      // The speak() function will try and fall back to browser TTS automatically.
      setServerOnline(false)
      return
    }
    try {
      const res = await fetch(`${KOKORO_SERVER}/health`, {
        signal: AbortSignal.timeout(3000),
      })
      if (res.ok) setServerOnline(true)
    } catch {
      setServerOnline(false)
    }
  }, [])

  // Web Speech API fallback
  const speakWithBrowser = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return

    window.speechSynthesis.cancel()

    // Small delay to let cancel() take effect in some browsers
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.85
      utterance.pitch = 1.0
      utterance.volume = 1.0

      // Prefer a Google English voice if available
      const voices = window.speechSynthesis.getVoices()
      const preferred = voices.find(
        v => v.lang.startsWith('en') && v.name.toLowerCase().includes('google')
      ) || voices.find(v => v.lang.startsWith('en'))
      if (preferred) utterance.voice = preferred

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      window.speechSynthesis.speak(utterance)
    }, 100)
  }, [])

  const speak = useCallback(async (text: string, voice = 'af_heart') => {
    if (!text) return

    // Stop any current audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }

    // If the server is a remote URL (e.g. HuggingFace Space deployed on Vercel),
    // skip the fetch entirely — browsers block cross-origin requests and log a CORS
    // error in the console even when wrapped in try/catch.
    if (!isLocalServer(KOKORO_SERVER)) {
      speakWithBrowser(text)
      return
    }

    try {
      setIsSpeaking(true)

      // Try Kokoro server first (5 second timeout)
      const response = await fetch(`${KOKORO_SERVER}/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice, speed: 0.9 }),
        signal: AbortSignal.timeout(5000),
      })

      if (!response.ok) throw new Error('Kokoro server error')

      const blob = await response.blob()
      const audioUrl = URL.createObjectURL(blob)
      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onended = () => {
        setIsSpeaking(false)
        URL.revokeObjectURL(audioUrl)
        audioRef.current = null
      }
      audio.onerror = () => {
        setIsSpeaking(false)
        audioRef.current = null
      }

      setServerOnline(true)
      await audio.play()

    } catch {
      // ── Fallback: Web Speech API (browser built-in) ──────────
      console.warn('Kokoro server offline — using browser TTS fallback')
      setServerOnline(false)
      setIsSpeaking(false)
      speakWithBrowser(text)
    }
  }, [speakWithBrowser])

  const stopSpeaking = useCallback(() => {
    // Stop Kokoro audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    // Stop browser TTS
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
  }, [])

  return { speak, stopSpeaking, isSpeaking, serverOnline, checkServer }
}
