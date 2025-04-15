'use client';

import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { 
  translateText as translateTextService,
  isSpeechSynthesisSupported
} from '../services/translationService';
import { SUPPORTED_LANGUAGES } from '../config/api-config';
import { Language, Message, TranslationResult, SpeechInputType } from '../types';

interface TranslationContextType {
  sourceLanguage: string;
  targetLanguage: string;
  setSourceLanguage: (lang: string) => void;
  setTargetLanguage: (lang: string) => void;
  currentMessage: string;
  translatedMessage: string;
  isTranslating: boolean;
  isVoiceMode: boolean;
  toggleVoiceMode: () => void;
  speakTranslation: boolean;
  setSpeakTranslation: (speak: boolean) => void;
  currentSpeechLanguage: string;
  messages: Message[];
  processTranslation: (text: string, fromLanguage: string, toLanguage: string) => Promise<void>;
  swapLanguages: () => void;
  handleSpeechEnd: () => void;
  languages: Language[];
  synthSupported: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [sourceLanguage, setSourceLanguage] = useState('es');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [currentMessage, setCurrentMessage] = useState('');
  const [translatedMessage, setTranslatedMessage] = useState('');
  const [speakTranslation, setSpeakTranslation] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [synthSupported] = useState(isSpeechSynthesisSupported());
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [currentSpeechLanguage, setCurrentSpeechLanguage] = useState(targetLanguage);

  const languages = SUPPORTED_LANGUAGES.map(lang => {
    const getFlagPath = (code: string) => {
      const flagMap: { [key: string]: string } = {
        'en': '/flags/us-flag.svg',
        'es': '/flags/spain-flag.svg',
        'fr': '/flags/france-flag.svg',
        'de': '/flags/germany-flag.svg',
        'it': '/flags/italy-flag.svg',
        'pt': '/flags/portugal-flag.svg',
        'ja': '/flags/japan-flag.svg',
        'zh': '/flags/china-flag.svg',
        'ru': '/flags/russia-flag.svg',
        'ko': '/flags/korea-flag.svg',
        'tr': '/flags/turkey-flag-icon.svg'
      };
      return flagMap[code] || `/unknown-flag.svg`;
    };

    return {
      ...lang,
      flag: getFlagPath(lang.code)
    };
  });

  const addMessageToConversation = (result: TranslationResult) => {
    const isUserMessage = result.sourceLanguage === sourceLanguage;

    const newMessage: Message = {
      id: Date.now(),
      text: result.originalText,
      language: result.sourceLanguage,
      translation: result.translatedText,
      isUser: isUserMessage
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  const processTranslation = async (
    text: string,
    fromLanguage: string,
    toLanguage: string
  ) => {
    setIsTranslating(true);

    try {
      const result = await translateTextService(
        text,
        fromLanguage,
        toLanguage
      );

      setCurrentMessage(result.originalText);
      setTranslatedMessage(result.translatedText);
      setCurrentSpeechLanguage(toLanguage);
      setSpeakTranslation(isVoiceMode);

      addMessageToConversation(result);
    } catch (error) {
      console.error('Error in the translation:', error);
      setTranslatedMessage('Translation error. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSpeechEnd = useCallback(() => {
    setSpeakTranslation(false);
  }, []);

  const swapLanguages = useCallback(() => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
  }, [sourceLanguage, targetLanguage]);

  const toggleVoiceMode = useCallback(() => {
    setIsVoiceMode(prev => !prev);
  }, []);

  const value = {
    sourceLanguage,
    targetLanguage,
    setSourceLanguage,
    setTargetLanguage,
    currentMessage,
    translatedMessage,
    isTranslating,
    isVoiceMode,
    toggleVoiceMode,
    speakTranslation,
    setSpeakTranslation,
    currentSpeechLanguage,
    messages,
    processTranslation,
    swapLanguages,
    handleSpeechEnd,
    languages,
    synthSupported
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  
  return context;
}; 