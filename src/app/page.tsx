'use client';

import { TranslationProvider } from './context/TranslationContext';
import { SpeechProvider } from './context/SpeechContext';
import AppContainer from './components/AppContainer';

export default function Home() {
  return (
    <TranslationProvider>
      <SpeechProvider>
        <AppContainer />
      </SpeechProvider>
    </TranslationProvider>
  );
}
