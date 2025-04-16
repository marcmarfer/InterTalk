import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Message from './Message';
import { useSpeech } from '../context/SpeechContext';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface MessageData {
  id: number;
  text: string;
  language: string;
  translation: string;
  isUser: boolean;
}

interface ConversationHistoryProps {
  messages: MessageData[];
  sourceLanguage: string;
  targetLanguage: string;
  languages: Language[];
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  messages,
  sourceLanguage,
  targetLanguage,
  languages
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isMuted, toggleMute } = useSpeech();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 min-h-[150px] overflow-hidden mb-4 flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-gray-400 text-lg font-medium">Conversation History</h2>
        <button
          onClick={toggleMute}
          className="hover:opacity-80 transition-opacity"
          aria-label={isMuted ? "Activar audio" : "Silenciar audio"}
          title={isMuted ? "Enable audio" : "Silence audio"}
        >
          <Image
            src={isMuted ? '/icons/sound-off.svg' : '/icons/sound-on.svg'}
            alt={isMuted ? "Audio disabled" : "Audio enabled"}
            width={20}
            height={20}
          />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2">
        {messages.length > 0 ? (
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id}>
                <Message
                  {...message}
                  sourceLanguage={sourceLanguage}
                  targetLanguage={targetLanguage}
                  languages={languages}
                />
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-center text-gray-400 text-sm">No messages yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationHistory; 