'use client';

import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { SpeechInputType } from '../types';
import Image from 'next/image';

interface SpeechRecognitionProps {
  language: string;
  onResult: (text: string) => void;
  onEnd: () => void;
  isListening: boolean;
  activeInputType: SpeechInputType;
}

export default function SpeechRecognitionComponent({
  language,
  onResult,
  onEnd,
  isListening,
  activeInputType
}: SpeechRecognitionProps) {
  const { transcript, handleFinishSpeaking } = useSpeechRecognition({
    language,
    onResult,
    onEnd,
    isListening
  });

  const sendButtonGradient = activeInputType === 'target'
    ? 'bg-gradient-to-r from-[#3d8bff] to-[#7afff2]'
    : 'bg-gradient-to-r from-[#ff4599]/90 to-[#ff4599]/70';

  const dotsColor = activeInputType === 'target'
    ? 'bg-[#3d8bff]'
    : 'bg-[#ff4599]';

  return (
    <div className="w-full mt-4 z-20">
      {isListening && (
        <div className="flex bg-[#393251]/50 backdrop-blur-sm rounded-2xl border border-[#615472]/50 p-4 shadow-lg">
          <div className="flex-1 bg-[#32294a]/50 border border-[#615472]/50 rounded-xl p-3 mr-2 text-white min-h-[48px] flex items-center relative overflow-hidden">
            {transcript ? (
              <div className="w-full overflow-x-hidden overflow-y-auto max-h-24">{transcript}</div>
            ) : (
              <span className="text-gray-400">{activeInputType === 'source' ? 'Hablando...' : 'Speaking...'}</span>
            )}
            <div className="absolute right-2 bottom-2 flex space-x-1">
              <div className={`w-1.5 h-1.5 rounded-full ${dotsColor} animate-pulse`}></div>
              <div className={`w-1.5 h-1.5 rounded-full ${dotsColor} animate-pulse delay-150`}></div>
              <div className={`w-1.5 h-1.5 rounded-full ${dotsColor} animate-pulse delay-300`}></div>
            </div>
          </div>
          <button
            onClick={handleFinishSpeaking}
            className={`px-5 py-3 cursor-pointer ${sendButtonGradient} text-white font-medium rounded-xl hover:opacity-90 transition-all flex items-center whitespace-nowrap`}
          >
            <Image
              src="/icons/send.svg"
              alt="Send Icon"
              width={20}
              height={20}
              className="mr-2"
            />
            Send
          </button>
        </div>
      )}
    </div>
  );
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
} 