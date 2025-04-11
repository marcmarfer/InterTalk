'use client';

import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

interface SpeechSynthesisProps {
  text: string;
  language: string;
  onEnd: () => void;
  speak: boolean;
}

export default function SpeechSynthesisComponent({
  text,
  language,
  onEnd,
  speak
}: SpeechSynthesisProps) {
  useSpeechSynthesis({
    text,
    language,
    onEnd,
    speak
  });

  return null;
}

if (typeof window !== 'undefined') {
  if (window.speechSynthesis) {
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => {
        speechSynthesis.getVoices();
      };
    }
  }
} 