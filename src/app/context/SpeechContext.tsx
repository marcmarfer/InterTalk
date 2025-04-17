'use client';

import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { useTranslation } from './TranslationContext';

interface SpeechContextType {
  isSourceListening: boolean;
  isTargetListening: boolean;
  startSourceListening: () => void;
  stopSourceListening: () => void;
  startTargetListening: () => void;
  stopTargetListening: () => void;
  handleSourceSpeechResult: (text: string) => Promise<void>;
  handleTargetSpeechResult: (text: string) => Promise<void>;
  isMuted: boolean;
  isIOS: boolean;
  isVoiceInitialized: boolean;
  toggleMute: () => void;
}

const SpeechContext = createContext<SpeechContextType | undefined>(undefined);

export const SpeechProvider = ({ children }: { children: ReactNode }) => {
  const { sourceLanguage, targetLanguage, processTranslation, setSpeakTranslation } = useTranslation();
  const [isSourceListening, setIsSourceListening] = useState(false);
  const [isTargetListening, setIsTargetListening] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isVoiceInitialized, setIsVoiceInitialized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const iosCheck = /iPhone|iPad|iPod/.test(navigator.userAgent);
      setIsIOS(iosCheck);
      
      const iosSavedInit = localStorage.getItem('ios-voice-initialized');
      if (iosSavedInit === 'true') {
        setIsVoiceInitialized(true);
      }
      
      if (iosCheck) {
        setIsMuted(true);
      }
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (isIOS) {
      //Fake speak (utterance) to initialize iOS voice
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('');
        window.speechSynthesis.speak(utterance);
      }
      
      setIsVoiceInitialized(true);
      localStorage.setItem('ios-voice-initialized', 'true');
    }
    
    setIsMuted(prevMuted => !prevMuted);
  }, [isIOS]);

  const startSourceListening = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSourceListening(true);
    setIsTargetListening(false);
  }, []);

  const stopSourceListening = useCallback(() => {
    setIsSourceListening(false);
  }, []);

  const startTargetListening = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsTargetListening(true);
    setIsSourceListening(false);
  }, []);

  const stopTargetListening = useCallback(() => {
    setIsTargetListening(false);
  }, []);

  const handleSourceSpeechResult = useCallback(async (text: string) => {
    if (text.trim()) {
      await processTranslation(text, sourceLanguage, targetLanguage);
      if (!isMuted) {
        setSpeakTranslation(true);
      }
    }
    stopSourceListening();
  }, [sourceLanguage, targetLanguage, processTranslation, stopSourceListening, isMuted, setSpeakTranslation]);

  const handleTargetSpeechResult = useCallback(async (text: string) => {
    if (text.trim()) {
      await processTranslation(text, targetLanguage, sourceLanguage);
      if (!isMuted) {
        setSpeakTranslation(true);
      }
    }
    stopTargetListening();
  }, [sourceLanguage, targetLanguage, processTranslation, stopTargetListening, isMuted, setSpeakTranslation]);

  const value = {
    isSourceListening,
    isTargetListening,
    startSourceListening,
    stopSourceListening,
    startTargetListening,
    stopTargetListening,
    handleSourceSpeechResult,
    handleTargetSpeechResult,
    isMuted,
    isIOS,
    isVoiceInitialized,
    toggleMute
  };

  return (
    <SpeechContext.Provider value={value}>
      {children}
    </SpeechContext.Provider>
  );
};

export const useSpeech = () => {
  const context = useContext(SpeechContext);
  
  if (context === undefined) {
    throw new Error('useSpeech must be used within a SpeechProvider');
  }
  
  return context;
}; 