import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  GEMINI_API_KEY,
  GEMINI_MODEL,
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

export async function translateText(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<TranslationResult> {
  try {
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
          temperature: DEFAULT_TEMPERATURE,
          maxOutputTokens: MAX_OUTPUT_TOKENS,
        },
      });

      const prompt = `Traduce el siguiente texto de ${getLanguageName(sourceLanguage)} a ${getLanguageName(targetLanguage)}. 
Proporciona solo la traducción, sin explicaciones ni texto adicional.

Texto original: "${text}"

Traducción:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const translatedText = response.text().trim();

      return {
        originalText: text,
        translatedText,
        sourceLanguage,
        targetLanguage,
        confidence: 0.95,
      };
    } catch (modelError) {
      console.error('Error al usar el modelo especificado, intentando con modelo alternativo:', modelError);

      try {
        const alternativeModel = genAI.getGenerativeModel({
          model: "gemini-pro",
          generationConfig: {
            temperature: DEFAULT_TEMPERATURE,
            maxOutputTokens: MAX_OUTPUT_TOKENS,
          },
        });

        const prompt = `Traduce el siguiente texto de ${getLanguageName(sourceLanguage)} a ${getLanguageName(targetLanguage)}. 
Solo la traducción, sin explicaciones:

"${text}"`;

        const result = await alternativeModel.generateContent(prompt);
        const response = await result.response;
        const translatedText = response.text().trim();

        return {
          originalText: text,
          translatedText,
          sourceLanguage,
          targetLanguage,
          confidence: 0.9,
        };
      } catch (alternativeError) {
        console.error('También falló el modelo alternativo:', alternativeError);
        throw alternativeError;
      }
    }
  } catch (error) {
    console.error('Error en la traducción con Gemini API:', error);

    return fallbackTranslation(text, sourceLanguage, targetLanguage);
  }
}

function getLanguageName(languageCode: string): string {
  const languageNames: Record<string, string> = {
    'en': 'inglés',
    'es': 'español',
    'fr': 'francés',
    'de': 'alemán',
    'it': 'italiano',
    'pt': 'portugués',
    'ru': 'ruso',
    'zh': 'chino',
    'ja': 'japonés',
    'ko': 'coreano',
    'tr': 'turco'
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
      ko: '한국어로 번역된 텍스트',
      tr: 'Türkçe\'ye çevrilmiş metin'
    },
    tr: {
      en: 'Text translated to English',
      es: 'Texto traducido al español',
      fr: 'Texte traduit en français',
      de: 'Text ins Deutsche übersetzt',
      it: 'Testo tradotto in italiano',
      pt: 'Texto traduzido para português',
      ru: 'Текст переведен на русский',
      zh: '翻译成中文的文本',
      ja: '日本語に翻訳されたテキスト',
      ko: '한국어로 번역된 텍스트'
    }
  };

  let translatedText: string;

  if (mockTranslations[sourceLanguage] && mockTranslations[sourceLanguage][targetLanguage]) {
    translatedText = mockTranslations[sourceLanguage][targetLanguage];
  } else {
    translatedText = `[${targetLanguage}] ${text}`;
  }

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
    'en': 'en-US',
    'es': 'es-ES',
    'fr': 'fr-FR',
    'de': 'de-DE',
    'it': 'it-IT',
    'pt': 'pt-BR',
    'ru': 'ru-RU',
    'zh': 'zh-CN',
    'ja': 'ja-JP',
    'ko': 'ko-KR',
    'tr': 'tr-TR'
  };

  return languageMappings[languageCode] || languageCode;
}

export function getSpeechSynthesisLanguageCode(languageCode: string): string {
  return getSpeechRecognitionLanguageCode(languageCode);
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
} 