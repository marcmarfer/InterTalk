import React from 'react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface MessageProps {
  id: number;
  text: string;
  language: string;
  translation: string;
  isUser: boolean;
  sourceLanguage: string;
  targetLanguage: string;
  languages: Language[];
}

const Message: React.FC<MessageProps> = ({
  text,
  language,
  translation,
  isUser,
  sourceLanguage,
  targetLanguage,
  languages
}) => {
  const isSourceLanguage = language === sourceLanguage;

  return (
    <div className={`p-4 rounded-3xl ${isSourceLanguage ?
        'mr-auto bg-[#ff4599]/90' :
        'ml-auto bg-[#7afff2]/90'
      } max-w-[70%]`}>
      <p className={`text-lg font-medium mb-1 ${isSourceLanguage ?
          'text-white' : 'text-gray-800'
        } break-words whitespace-normal`}>
        {text}
      </p>
      <p className={`text-xs opacity-70 ${isSourceLanguage ?
          'text-white/80' : 'text-gray-700'
        }`}>
        {languages.find(lang => lang.code === language)?.name || language}
      </p>

      <div className="mt-2 pt-2 border-t border-white/20">
        <p className={`text-base ${isSourceLanguage ?
            'text-white/90' : 'text-gray-800'
          } break-words whitespace-normal`}>
          {translation}
        </p>
        <p className={`text-xs opacity-70 ${isSourceLanguage ?
            'text-white/80' : 'text-gray-700'
          }`}>
          {language === sourceLanguage ?
            languages.find(lang => lang.code === targetLanguage)?.name :
            languages.find(lang => lang.code === sourceLanguage)?.name}
        </p>
      </div>
    </div>
  );
};

export default Message; 