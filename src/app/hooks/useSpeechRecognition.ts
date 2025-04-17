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
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  const requestMicrophonePermission = useCallback(async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setPermissionGranted(true);
        return true;
      }
    } catch (error) {
      console.error('Error requesting microphone permissions:', error);
      return false;
    }
    return false;
  }, []);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition. Please use a compatible browser.');
      return;
    }

    requestMicrophonePermission();

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
      if (event.error !== 'aborted') {
        console.error('Speech recognition error:', event.error);
      }
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
      setTranscript('');
      
      if (!permissionGranted) {
        requestMicrophonePermission().then(granted => {
          if (granted) {
            try {
              recognition.start();
            } catch (error) {
              if (!(error instanceof DOMException && error.name === 'InvalidStateError')) {
                 console.error('Error starting recognition after microphone permission grant:', error);
              }
            }
          } else {
            onEnd();
          }
        });
      } else {
        try {
          recognition.start();
        } catch (error) {
           if (!(error instanceof DOMException && error.name === 'InvalidStateError')) {
              console.error('Error starting recognition (already permitted microphone):', error);
           }
        }
      }
    } else {
      try {
        recognition.stop();
      } catch (error) {
        if (error instanceof Error && !error.message.includes('not started')) {
          console.error('Error stopping recognition:', error);
        }
      }
    }
  }, [isListening, recognition, permissionGranted, requestMicrophonePermission, onEnd]);

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