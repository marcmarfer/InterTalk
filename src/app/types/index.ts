export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface Message {
  id: number;
  text: string;
  language: string;
  translation: string;
  isUser: boolean;
}

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
}

export type SpeechInputType = 'source' | 'target'; 