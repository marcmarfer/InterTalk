'use client';

import { useEffect, useState } from 'react';
import { useSpeech } from '../context/SpeechContext';

interface UseSpeechSynthesisProps {
  text: string;
  language: string;
  onEnd: () => void;
  speak: boolean;
}

export const useSpeechSynthesis = ({
  text,
  language,
  onEnd,
  speak
}: UseSpeechSynthesisProps) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const { isMuted } = useSpeech();

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    if (!isSupported || !speak || !text || isMuted) return;

    const utterance = new SpeechSynthesisUtterance(text);
    
    const languageVoices = voices.filter(voice => 
      voice.lang.toLowerCase().includes(language.toLowerCase())
    );
    
    if (languageVoices.length > 0) {
      utterance.voice = languageVoices[0];
    }
    
    utterance.lang = language;
    utterance.rate = 1;
    utterance.pitch = 1;
    
    utterance.onend = () => {
      onEnd();
    };
    
    utterance.onerror = (event) => {
      console.error('Error de síntesis de voz:', event);
      onEnd();
    };

    // Cancel any ongoing speech synthesis
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [text, language, speak, voices, onEnd, isSupported, isMuted]);

  return { isSupported };
}; 