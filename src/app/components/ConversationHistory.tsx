import React, { useEffect, useRef } from 'react';
import Message from './Message';

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 min-h-[150px] overflow-hidden mb-4 flex flex-col">
      <h2 className="text-gray-400 text-lg font-medium mb-3">Conversation History</h2>
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