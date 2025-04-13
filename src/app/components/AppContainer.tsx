'use client';

import React from 'react';
import SpeechRecognitionComponent from './SpeechRecognition';
import SpeechSynthesisComponent from './SpeechSynthesis';
import LanguageSelector from './LanguageSelector';
import ConversationHistory from './ConversationHistory';
import TextInputForm from './TextInputForm';
import VoiceControls from './VoiceControls';
import ModeToggle from './ModeToggle';
import Header from './Header';
import { useTranslation } from '../context/TranslationContext';
import { useSpeech } from '../context/SpeechContext';
import { getSpeechRecognitionLanguageCode, getSpeechSynthesisLanguageCode } from '../services/translationService';

export default function AppContainer() {
  const {
    sourceLanguage,
    targetLanguage,
    currentMessage,
    translatedMessage,
    isTranslating,
    isVoiceMode,
    toggleVoiceMode,
    speakTranslation,
    currentSpeechLanguage,
    messages,
    processTranslation,
    swapLanguages,
    handleSpeechEnd,
    languages,
    synthSupported,
    setSourceLanguage,
    setTargetLanguage
  } = useTranslation();

  const {
    isSourceListening,
    isTargetListening,
    startSourceListening,
    stopSourceListening,
    startTargetListening,
    stopTargetListening,
    handleSourceSpeechResult,
    handleTargetSpeechResult
  } = useSpeech();

  const handleSourceLanguageChange = (e: React.ChangeEvent<HTMLSelectElement> | { target: { value: string } }) => {
    setSourceLanguage(e.target.value);
  };

  const handleTargetLanguageChange = (e: React.ChangeEvent<HTMLSelectElement> | { target: { value: string } }) => {
    setTargetLanguage(e.target.value);
  };

  const handleTextSubmit = async (message: string, fromLanguage: string, toLanguage: string) => {
    if (message.trim()) {
      await processTranslation(message, fromLanguage, toLanguage);
    }
  };

  return (
<div className="flex flex-col items-center justify-start h-[100svh] w-full bg-[#262240] relative overflow-hidden">
      <div className="absolute z-50 top-0 left-0 w-[90%] h-[500px] bg-[#ff4599]/20 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

        <Header />

        <main className="flex flex-col p-6 max-w-3xl mx-auto w-full flex-1 relative z-10 overflow-hidden">
          <LanguageSelector
            sourceLanguage={sourceLanguage}
            targetLanguage={targetLanguage}
            onSourceLanguageChange={handleSourceLanguageChange}
            onTargetLanguageChange={handleTargetLanguageChange}
            onSwapLanguages={swapLanguages}
            languages={languages}
          />

          <ModeToggle
            isVoiceMode={isVoiceMode}
            onToggle={toggleVoiceMode}
          />

          <ConversationHistory
            messages={messages}
            sourceLanguage={sourceLanguage}
            targetLanguage={targetLanguage}
            languages={languages}
          />

          <div className="mt-auto pb-4">
            {isVoiceMode ? (
              <>
                <VoiceControls
                  sourceLanguage={sourceLanguage}
                  targetLanguage={targetLanguage}
                  isSourceListening={isSourceListening}
                  isTargetListening={isTargetListening}
                  isTranslating={isTranslating}
                  onStartSourceListening={startSourceListening}
                  onStopSourceListening={stopSourceListening}
                  onStartTargetListening={startTargetListening}
                  onStopTargetListening={stopTargetListening}
                  languages={languages}
                />

                {isSourceListening && (
                  <SpeechRecognitionComponent
                    language={getSpeechRecognitionLanguageCode(sourceLanguage)}
                    onResult={handleSourceSpeechResult}
                    onEnd={stopSourceListening}
                    isListening={isSourceListening}
                    activeInputType="source"
                  />
                )}

                {isTargetListening && (
                  <SpeechRecognitionComponent
                    language={getSpeechRecognitionLanguageCode(targetLanguage)}
                    onResult={handleTargetSpeechResult}
                    onEnd={stopTargetListening}
                    isListening={isTargetListening}
                    activeInputType="target"
                  />
                )}
              </>
            ) : (
              <TextInputForm
                onSubmit={handleTextSubmit}
                sourceLanguage={sourceLanguage}
                targetLanguage={targetLanguage}
                isTranslating={isTranslating}
                languages={languages}
              />
            )}
          </div>
        </main>

      {synthSupported && translatedMessage && (
        <SpeechSynthesisComponent
          text={translatedMessage}
          language={getSpeechSynthesisLanguageCode(currentSpeechLanguage)}
          onEnd={handleSpeechEnd}
          speak={speakTranslation}
        />
      )}
    </div>
  );
} 