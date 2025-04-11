import React from 'react';

interface SpeechButtonProps {
  isListening: boolean;
  onClick: () => void;
  disabled: boolean;
  language: string;
  languageName: string;
  type: 'source' | 'target';
}

const SpeechButton: React.FC<SpeechButtonProps> = ({
  isListening,
  onClick,
  disabled,
  language,
  languageName,
  type
}) => {
  const getButtonStyle = () => {
    if (type === 'source') {
      return 'bg-[#ff4599]/90 text-white';
    } else {
      return 'bg-[#7afff2]/90 text-gray-800';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-6 rounded-xl flex flex-col items-center justify-center cursor-pointer ${getButtonStyle()} disabled:opacity-30 disabled:grayscale shadow-lg hover:shadow-xl transition-all`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-3">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
      </svg>
      <span className="text-xl font-medium">{languageName}</span>
    </button>
  );
};

export default SpeechButton; 