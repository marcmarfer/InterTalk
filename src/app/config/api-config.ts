export const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

export const isGeminiApiConfigured = GEMINI_API_KEY.length > 0;

export const GEMINI_MODEL = "gemini-2.0-flash";

export const DEFAULT_TEMPERATURE = 0.2;
export const MAX_OUTPUT_TOKENS = 1024;

export const SUPPORTED_LANGUAGES = [
  { code: 'es', name: 'Spanish' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
]; 