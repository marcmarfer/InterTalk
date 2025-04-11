import React from 'react';
import SelectLanguageInput from './SelectLanguageInput';
import Image from 'next/image';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageSelectorProps {
  sourceLanguage: string;
  targetLanguage: string;
  onSourceLanguageChange: (e: React.ChangeEvent<HTMLSelectElement> | { target: { value: string } }) => void;
  onTargetLanguageChange: (e: React.ChangeEvent<HTMLSelectElement> | { target: { value: string } }) => void;
  onSwapLanguages: () => void;
  languages: Language[];
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  sourceLanguage,
  targetLanguage,
  onSourceLanguageChange,
  onTargetLanguageChange,
  onSwapLanguages,
  languages
}) => {
  return (
    <div className="flex items-center justify-between mb-4 gap-2">
      <div className="flex-1">
        <SelectLanguageInput
          value={sourceLanguage}
          onChange={onSourceLanguageChange}
          languages={languages}
        />
      </div>

      <div className="flex-shrink-0 flex items-center justify-center">
        <button
          onClick={onSwapLanguages}
          className="p-3 cursor-pointer"
          aria-label="Swap languages"
        >
          <Image
            src="/icons/swap-arrows.svg"
            alt="Swap Languages Icon"
            width={24}
            height={24}
            className="text-white"
          />
        </button>
      </div>

      <div className="flex-1">
        <SelectLanguageInput
          value={targetLanguage}
          onChange={onTargetLanguageChange}
          languages={languages}
        />
      </div>
    </div>
  );
};

export default LanguageSelector; 