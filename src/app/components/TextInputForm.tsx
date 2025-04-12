import React, { useState } from 'react';
import Image from 'next/image';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface TextInputFormProps {
  onSubmit: (message: string, fromLanguage: string, toLanguage: string) => Promise<void>;
  sourceLanguage: string;
  targetLanguage: string;
  isTranslating: boolean;
  languages: Language[];
}

const TextInputForm: React.FC<TextInputFormProps> = ({
  onSubmit,
  sourceLanguage,
  targetLanguage,
  isTranslating,
  languages
}) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentInputLanguage, setCurrentInputLanguage] = useState(sourceLanguage);

  const handleTextSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentMessage.trim()) {
      let fromLanguage, toLanguage;

      if (currentInputLanguage === sourceLanguage) {
        fromLanguage = sourceLanguage;
        toLanguage = targetLanguage;
      } else {
        fromLanguage = targetLanguage;
        toLanguage = sourceLanguage;
      }

      await onSubmit(currentMessage, fromLanguage, toLanguage);

      setCurrentInputLanguage(toLanguage);
      setCurrentMessage('');
    }
  };

  return (
    <form onSubmit={handleTextSubmit} className="flex flex-col bg-[#393251]/50 backdrop-blur-sm rounded-xl border border-[#615472]/50 p-3 shadow-lg">
      <div className="flex mb-2">
        <div className="flex-1 mr-1">
          <button
            type="button"
            onClick={() => setCurrentInputLanguage(sourceLanguage)}
            className={`w-full py-1.5 px-2 rounded-lg cursor-pointer text-xs ${currentInputLanguage === sourceLanguage
              ? 'bg-[#ff4599]/90 text-white'
              : 'bg-[#4b4363]/70 text-gray-300'
              } transition-colors`}
          >
            {languages.find(lang => lang.code === sourceLanguage)?.name || sourceLanguage}
          </button>
        </div>
        <div className="flex-1 ml-1">
          <button
            type="button"
            onClick={() => setCurrentInputLanguage(targetLanguage)}
            className={`w-full py-1.5 px-2 rounded-lg cursor-pointer text-xs ${currentInputLanguage === targetLanguage
              ? 'bg-[#7afff2]/90 text-gray-800'
              : 'bg-[#4b4363]/70 text-gray-300'
              } transition-colors`}
          >
            {languages.find(lang => lang.code === targetLanguage)?.name || targetLanguage}
          </button>
        </div>
      </div>
      <div className="flex">
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder={`Write in ${languages.find(lang => lang.code === currentInputLanguage)?.name || ''}...`}
          className={`flex-1 p-2 bg-[#32294a]/50 border border-[#615472]/50 rounded-lg mr-2 text-white text-xs placeholder-gray-400 focus:outline-none focus:ring-1 ${currentInputLanguage === sourceLanguage
            ? 'focus:ring-[#ff4599]/50'
            : 'focus:ring-[#7afff2]/50'
            } transition-all`}
          disabled={isTranslating}
        />
        <button
          type="submit"
          className={`px-4 py-2 cursor-pointer text-xs ${currentInputLanguage === sourceLanguage
            ? 'bg-gradient-to-r from-[#ff4599]/90 to-[#ff4599]/70'
            : 'bg-gradient-to-r from-[#3d8bff] to-[#7afff2]'
            } ${currentInputLanguage === sourceLanguage
              ? 'text-white'
              : 'text-gray-800'
            } font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center`}
          disabled={!currentMessage.trim() || isTranslating}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1.5"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          Send
        </button>
      </div>
    </form>
  );
};

export default TextInputForm; 