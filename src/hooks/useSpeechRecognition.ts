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
}

export function useSpeechRecognition(): SpeechRecognitionHook {
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<any>(null)
  const finalTranscriptRef = useRef('')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setIsSupported(false)
      return
    }

    setIsSupported(true)

    const recognition = new SpeechRecognition()
    
    // KEY SETTINGS to prevent duplicates:
    recognition.continuous = true        // Keep listening
    recognition.interimResults = true    // Show words as spoken
    recognition.lang = 'en-IN'
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
      finalTranscriptRef.current = ''   // Reset on each start
      setTranscript('')
      setInterimTranscript('')
    }

    recognition.onresult = (event: any) => {
      let finalText = ''
      let interimText = ''

      // CORRECT WAY: iterate only NEW results
      // event.resultIndex tells us where new results start
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const text = result[0].transcript

        if (result.isFinal) {
          finalText += text + ' '
        } else {
          interimText += text
        }
      }

      // Accumulate FINAL results properly
      if (finalText) {
        finalTranscriptRef.current += finalText
        setTranscript(finalTranscriptRef.current.trim())
        setInterimTranscript('')
      } else {
        // Show interim (what user is currently saying)
        setInterimTranscript(interimText)
      }
    }

    recognition.onend = () => {
      setIsListening(false)
      setInterimTranscript('')
      // Set final transcript from ref
      if (finalTranscriptRef.current.trim()) {
        setTranscript(finalTranscriptRef.current.trim())
      }
    }

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        // User didn't speak — just stop quietly
        setIsListening(false)
        return
      }
      if (event.error === 'aborted') {
        // Manually stopped — ignore
        return
      }
      console.warn('Speech recognition error:', event.error)
      setIsListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      try {
        recognition.stop()
      } catch {}
    }
  }, [])

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return

    // Reset everything before starting
    finalTranscriptRef.current = ''
    setTranscript('')
    setInterimTranscript('')

    try {
      recognitionRef.current.start()
    } catch (err) {
      console.warn('Could not start recognition:', err)
    }
  }, [isListening])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return
    try {
      recognitionRef.current.stop()
    } catch {}
    setIsListening(false)
  }, [isListening])

  const resetTranscript = useCallback(() => {
    finalTranscriptRef.current = ''
    setTranscript('')
    setInterimTranscript('')
  }, [])

  return {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  }
}
