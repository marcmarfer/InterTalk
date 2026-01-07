import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  GEMINI_API_KEY,
  DEFAULT_TEMPERATURE,
  MAX_OUTPUT_TOKENS
} from '../config/api-config';

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const GEMINI_MODEL = 'gemini-2.5-flash';

export async function translateText(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<TranslationResult> {
  if (!text || !text.trim()) {
    throw new Error('No se proporcionó texto para traducir');
  }

  if (!GEMINI_API_KEY) {
    console.log('API key no configurada, usando traducción de respaldo');
    return fallbackTranslation(text, sourceLanguage, targetLanguage);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: {
        temperature: DEFAULT_TEMPERATURE ?? 0.3,
        maxOutputTokens: MAX_OUTPUT_TOKENS ?? 512,
      },
    });

    const prompt = `
You are a professional translator.

Translate the following text from ${getLanguageName(sourceLanguage)}
to ${getLanguageName(targetLanguage)}.

Preserve meaning, tone, cultural context and idiomatic expressions.
Avoid literal translations.
Return only the translated text.

Text:
"${text}"
`;

    const result = await model.generateContent(prompt);
    const translatedText = result.response.text().trim();

    return {
      originalText: text,
      translatedText,
      sourceLanguage,
      targetLanguage,
      confidence: 0.95,
    };
  } catch (error) {
    console.error('Error en Gemini, usando fallback:', error);
    return fallbackTranslation(text, sourceLanguage, targetLanguage);
  }
}

function getLanguageName(languageCode: string): string {
  const languageNames: Record<string, string> = {
    en: 'inglés',
    es: 'español',
    fr: 'francés',
    de: 'alemán',
    it: 'italiano',
    pt: 'portugués',
    ru: 'ruso',
    zh: 'chino',
    ja: 'japonés',
    ko: 'coreano',
    tr: 'turco'
  };

  return languageNames[languageCode] || languageCode;
}

function fallbackTranslation(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): TranslationResult {
  console.log('Usando traducción de respaldo');

  const mockTranslations: Record<string, Record<string, string>> = {
    en: {
      es: 'Texto traducido al español',
      fr: 'Texte traduit en français',
      de: 'Text ins Deutsche übersetzt',
      it: 'Testo tradotto in italiano',
      pt: 'Texto traduzido para português',
      ru: 'Текст переведен на русский',
      zh: '翻译成中文的文本',
      ja: '日本語に翻訳されたテキスト',
      ko: '한국어로 번역된 텍스트',
      tr: 'Türkçe\'ye çevrilmiş metin'
    },
    es: {
      en: 'Text translated to English',
      fr: 'Texte traduit en français',
      de: 'Text ins Deutsche übersetzt',
      it: 'Testo tradotto in italiano',
      pt: 'Texto traduzido para português',
      ru: 'Текст переведен на русский',
      zh: '翻译成中文的文本',
      ja: '日本語に翻訳されたテキスト',
      ko: '한국어로 번译된 텍스트',
      tr: 'Türkçe\'ye çevrilmiş metin'
    }
  };

  const translatedText =
    mockTranslations[sourceLanguage]?.[targetLanguage] ??
    `[${targetLanguage}] ${text}`;

  return {
    originalText: text,
    translatedText,
    sourceLanguage,
    targetLanguage,
    confidence: 0.5,
  };
}

export function getSpeechRecognitionLanguageCode(languageCode: string): string {
  const languageMappings: Record<string, string> = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    it: 'it-IT',
    pt: 'pt-BR',
    ru: 'ru-RU',
    zh: 'zh-CN',
    ja: 'ja-JP',
    ko: 'ko-KR',
    tr: 'tr-TR'
  };

  return languageMappings[languageCode] || languageCode;
}

export function getSpeechSynthesisLanguageCode(languageCode: string): string {
  return getSpeechRecognitionLanguageCode(languageCode);
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}
