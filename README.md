# InterTalk - Real-Time Translation App

InterTalk is a web application built with Next.js that provides real-time voice and text translation between multiple languages. It allows users to communicate using either voice input (speech-to-text) or text input, receiving translations instantly.

## Features

*   **AI-Powered Translation:** Real-time translations powered by Google's Gemini 2.0 Flash model.
*   **Voice Input:** Speak naturally and have your words transcribed and translated.
*   **Text Input:** Type messages for translation when voice input is not preferred.
*   **Voice Output (Text-to-Speech):** Hear the translations spoken aloud (using browser/OS voices, see notes below).
*   **Multiple Languages:** Supports translation between various languages (e.g., English, Spanish, French, Turkish, etc.).
*   **Language Swapping:** Easily swap source and target languages.
*   **Conversation History:** View the history of your conversation and translations.
*   **Mode Toggle:** Switch between Voice Mode and Text Mode interfaces.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

*   [Node.js](https://nodejs.org/) (Latest LTS version recommended)
*   [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), [pnpm](https://pnpm.io/), or [bun](https://bun.sh/) package manager

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/marcmarfer/intertalk.git
    cd intertalk
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

3.  **Configuration (Required for Translation):**
    *   This project uses the Gemini API for translations. You need an API key from Google Cloud / Google AI Studio for this feature to work.
    *   Create a `.env.local` file in the root of the project.
    *   Add your Gemini API key to the `.env.local` file. **Make sure the variable name starts with `NEXT_PUBLIC_`** so it's available to the browser:
        ```
        NEXT_PUBLIC_GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
        ```
    *   *(Optional: Refer to `.env.example` if it exists for the required variable format.)*
    *   **Note:** Without the API key, the application will use a fallback mock translation service with limited, predefined translations.

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

5.  **Open the application:**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Voice Quality (Text-to-Speech Limitations)

The application uses your browser's built-in Text-to-Speech engine (`window.speechSynthesis`) to read translations aloud.

**Important:** For now, because this application uses the browser's built-in `window.speechSynthesis` engine, the quality, accent, and availability of voices depend entirely on the specific voices installed on **your operating system** (iOS, Android, Windows, macOS, Linux) and browser. The application cannot provide voices that are not already present on your system. This means that sometimes, especially on certain devices or for specific languages, the voice may not have the correct native accent or may sound robotic.

**Improving Voice Quality (Especially iOS/macOS):**

You may be able to improve the quality by downloading enhanced voices provided by your OS vendor:

*   **iOS:** Go to `Settings` > `Accessibility` > `Spoken Content` > `Voices`. Select your language and download the "Enhanced" or "Premium" option if available.
*   **macOS:** Go to `System Settings` > `Accessibility` > `Spoken Content`. Use the `System Voice` dropdown, select `Manage Voices...`, and download higher-quality voices for your desired languages.
*   **Windows/Android:** Check your system's accessibility or language settings for options to install additional TTS voices or engines.

Using higher-quality system voices, where available, will significantly improve the speech output of this application. For guaranteed high-quality and consistent voices across all platforms, future development could involve integrating a cloud-based Text-to-Speech service.

## License

This project is licensed under the terms of the GNU General Public License v3.0 (GPLv3). 
See the [LICENSE](LICENSE) file for the full license text.
