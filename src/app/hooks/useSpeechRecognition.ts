'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseSpeechRecognitionProps {
  language: string;
  onResult: (text: string) => void;
  onEnd: () => void;
  isListening: boolean;
}

interface UseSpeechRecognitionReturn {
  transcript: string;
  handleFinishSpeaking: () => void;
}

export const useSpeechRecognition = ({
  language,
  onResult,
  onEnd,
  isListening
}: UseSpeechRecognitionProps): UseSpeechRecognitionReturn => {
  const [recognition, setRecognition] = useState<any>(null);
  const [transcript, setTranscript] = useState<string>('');

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition. Please use a compatible browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();

    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;

    recognitionInstance.onresult = (event: any) => {
      const currentTranscript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');

      setTranscript(currentTranscript);
    };

    recognitionInstance.onend = () => {
      onEnd();
    };

    recognitionInstance.onerror = (event: any) => {
      console.error('Error en el reconocimiento de voz:', event.error);
      onEnd();
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.abort();
      }
    };
  }, [onResult, onEnd]);

  useEffect(() => {
    if (recognition) {
      recognition.lang = language;
    }
  }, [language, recognition]);

  useEffect(() => {
    if (!recognition) return;

    if (isListening) {
      try {
        setTranscript('');
        recognition.start();
      } catch (error) {
        console.error('Error al iniciar el reconocimiento:', error);
      }
    } else {
      try {
        recognition.stop();
      } catch (error) {
        console.error('Error al detener el reconocimiento:', error);
      }
    }
  }, [isListening, recognition]);

  const handleFinishSpeaking = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      onResult(transcript);
    }
  }, [recognition, isListening, transcript, onResult]);

  return {
    transcript,
    handleFinishSpeaking
  };
};

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
} 