'use client';

import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
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
}

const SpeechContext = createContext<SpeechContextType | undefined>(undefined);

export const SpeechProvider = ({ children }: { children: ReactNode }) => {
  const { sourceLanguage, targetLanguage, processTranslation } = useTranslation();
  const [isSourceListening, setIsSourceListening] = useState(false);
  const [isTargetListening, setIsTargetListening] = useState(false);

  const startSourceListening = useCallback(() => {
    setIsSourceListening(true);
    setIsTargetListening(false);
  }, []);

  const stopSourceListening = useCallback(() => {
    setIsSourceListening(false);
  }, []);

  const startTargetListening = useCallback(() => {
    setIsTargetListening(true);
    setIsSourceListening(false);
  }, []);

  const stopTargetListening = useCallback(() => {
    setIsTargetListening(false);
  }, []);

  const handleSourceSpeechResult = useCallback(async (text: string) => {
    if (text.trim()) {
      await processTranslation(text, sourceLanguage, targetLanguage);
    }
    stopSourceListening();
  }, [sourceLanguage, targetLanguage, processTranslation, stopSourceListening]);

  const handleTargetSpeechResult = useCallback(async (text: string) => {
    if (text.trim()) {
      await processTranslation(text, targetLanguage, sourceLanguage);
    }
    stopTargetListening();
  }, [sourceLanguage, targetLanguage, processTranslation, stopTargetListening]);

  const value = {
    isSourceListening,
    isTargetListening,
    startSourceListening,
    stopSourceListening,
    startTargetListening,
    stopTargetListening,
    handleSourceSpeechResult,
    handleTargetSpeechResult
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