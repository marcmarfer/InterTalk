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
    <form onSubmit={handleTextSubmit} className="flex flex-col bg-[#393251]/50 backdrop-blur-sm rounded-2xl border border-[#615472]/50 p-4 shadow-lg">
      <div className="flex mb-3">
        <div className="flex-1 mr-2">
          <button
            type="button"
            onClick={() => setCurrentInputLanguage(sourceLanguage)}
            className={`w-full py-2 px-3 rounded-xl cursor-pointer ${currentInputLanguage === sourceLanguage
                ? 'bg-[#ff4599]/90 text-white'
                : 'bg-[#4b4363]/70 text-gray-300'
              } transition-colors`}
          >
            {languages.find(lang => lang.code === sourceLanguage)?.name || sourceLanguage}
          </button>
        </div>
        <div className="flex-1">
          <button
            type="button"
            onClick={() => setCurrentInputLanguage(targetLanguage)}
            className={`w-full py-2 px-3 rounded-xl cursor-pointer ${currentInputLanguage === targetLanguage
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
          placeholder={`Write a message in ${languages.find(lang => lang.code === currentInputLanguage)?.name || ''}...`}
          className={`flex-1 p-3 bg-[#32294a]/50 border border-[#615472]/50 rounded-xl mr-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${currentInputLanguage === sourceLanguage
              ? 'focus:ring-[#ff4599]/50'
              : 'focus:ring-[#7afff2]/50'
            } transition-all`}
          disabled={isTranslating}
        />
        <button
          type="submit"
          className={`px-5 py-3 cursor-pointer ${currentInputLanguage === sourceLanguage
              ? 'bg-gradient-to-r from-[#ff4599]/90 to-[#ff4599]/70'
              : 'bg-gradient-to-r from-[#3d8bff] to-[#7afff2]'
            } ${currentInputLanguage === sourceLanguage
              ? 'text-white'
              : 'text-gray-800'
            } font-medium rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center`}
          disabled={!currentMessage.trim() || isTranslating}
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
    </form>
  );
};

export default TextInputForm; 