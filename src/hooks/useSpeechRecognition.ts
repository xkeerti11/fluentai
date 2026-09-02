'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<any>(null)
  const finalTextRef = useRef('')
  const isListeningRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const SR = (window as any).SpeechRecognition 
      || (window as any).webkitSpeechRecognition
    if (!SR) { setIsSupported(false); return }
    setIsSupported(true)

    const recognition = new SR()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-IN'
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      finalTextRef.current = ''
      setTranscript('')
      setInterimTranscript('')
      isListeningRef.current = true
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      let finalText = ''
      let interimText = ''

      // KEY FIX: Use event.resultIndex to only process NEW results
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const text = result[0].transcript.trim()
        if (result.isFinal) {
          finalText += (finalText ? ' ' : '') + text
        } else {
          interimText = text
        }
      }

      if (finalText) {
        finalTextRef.current = finalTextRef.current 
          ? finalTextRef.current + ' ' + finalText 
          : finalText
        setTranscript(finalTextRef.current)
        setInterimTranscript('')
      } else if (interimText) {
        setInterimTranscript(interimText)
      }
    }

    recognition.onend = () => {
      isListeningRef.current = false
      setIsListening(false)
      setInterimTranscript('')
      if (finalTextRef.current) {
        setTranscript(finalTextRef.current)
      }
    }

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return
      console.warn('STT error:', event.error)
      isListeningRef.current = false
      setIsListening(false)
    }

    recognitionRef.current = recognition
    return () => { try { recognition.abort() } catch {} }
  }, [])

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListeningRef.current) return
    finalTextRef.current = ''
    setTranscript('')
    setInterimTranscript('')
    try { recognitionRef.current.start() } catch (e) {
      console.warn('Could not start:', e)
    }
  }, [])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListeningRef.current) return
    try { recognitionRef.current.stop() } catch {}
  }, [])

  const resetTranscript = useCallback(() => {
    finalTextRef.current = ''
    setTranscript('')
    setInterimTranscript('')
  }, [])

  return {
    transcript, interimTranscript, isListening,
    isSupported, startListening, stopListening, resetTranscript
  }
}
