import React, { useCallback } from 'react';
import SpeechButton from './SpeechButton';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface VoiceControlsProps {
  sourceLanguage: string;
  targetLanguage: string;
  isSourceListening: boolean;
  isTargetListening: boolean;
  isTranslating: boolean;
  onStartSourceListening: () => void;
  onStopSourceListening: () => void;
  onStartTargetListening: () => void;
  onStopTargetListening: () => void;
  languages: Language[];
}

const VoiceControls: React.FC<VoiceControlsProps> = ({
  sourceLanguage,
  targetLanguage,
  isSourceListening,
  isTargetListening,
  isTranslating,
  onStartSourceListening,
  onStopSourceListening,
  onStartTargetListening,
  onStopTargetListening,
  languages
}) => {
  const sourceLanguageName = languages.find(lang => lang.code === sourceLanguage)?.name || sourceLanguage;
  const targetLanguageName = languages.find(lang => lang.code === targetLanguage)?.name || targetLanguage;

  const handleSourceButtonClick = useCallback(() => {
    if (isSourceListening) {
      onStopSourceListening();
    } else {
      onStartSourceListening();
    }
  }, [isSourceListening, onStartSourceListening, onStopSourceListening]);

  const handleTargetButtonClick = useCallback(() => {
    if (isTargetListening) {
      onStopTargetListening();
    } else {
      onStartTargetListening();
    }
  }, [isTargetListening, onStartTargetListening, onStopTargetListening]);

  return (
    <div className="grid grid-cols-2 gap-4 min-h-26">
      <SpeechButton
        isListening={isSourceListening}
        onClick={handleSourceButtonClick}
        disabled={isTranslating || isTargetListening}
        language={sourceLanguage}
        languageName={sourceLanguageName}
        type="source"
      />

      <SpeechButton
        isListening={isTargetListening}
        onClick={handleTargetButtonClick}
        disabled={isTranslating || isSourceListening}
        language={targetLanguage}
        languageName={targetLanguageName}
        type="target"
      />
    </div>
  );
};

export default VoiceControls; 