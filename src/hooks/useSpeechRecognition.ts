'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

interface SpeechRecognitionHook {
  transcript: string
  interimTranscript: string
  isListening: boolean
  isSupported: boolean
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
  error: string | null
}

export function useSpeechRecognition(): SpeechRecognitionHook {
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) return

    setIsSupported(true)
    const recognition = new SpeechRecognition()
    recognition.continuous = true // Bolte waqt short pause hone par stop na ho
    recognition.interimResults = true
    recognition.lang = 'en-US' // Standard browser English engine support

    recognition.onresult = (event: any) => {
      let interim = ''
      let final = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          final += result[0].transcript
        } else {
          interim += result[0].transcript
        }
      }

      if (final) setTranscript(prev => prev + ' ' + final)
      setInterimTranscript(interim)
    }

    recognition.onend = () => {
      setIsListening(false)
      setInterimTranscript('')
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      if (event.error === 'not-allowed') {
        setError('permission_denied')
      } else {
        setError(event.error)
      }
      setIsListening(false)
      setInterimTranscript('')
    }

    recognitionRef.current = recognition

    return () => {
      recognition.abort()
    }
  }, [])

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return
    
    // Safety check: Abort existing instance first to prevent InvalidStateError
    try {
      recognitionRef.current.abort()
    } catch (err) {
      console.warn('Could not abort active recognition:', err)
    }

    setTranscript('')
    setInterimTranscript('')
    setError(null)
    
    try {
      recognitionRef.current.start()
      setIsListening(true)
    } catch (e) {
      console.error('Could not start recognition:', e)
    }
  }, [])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return
    recognitionRef.current.stop()
    setIsListening(false)
  }, [isListening])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
    setError(null)
  }, [])

  return {
    transcript: transcript.trim(),
    interimTranscript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    error,
  }
}
