# CallSensei - Real-Time AI Emotion Analysis

![CallSensei Screenshot](public/app_screenshot.png)

> **Winner of "Best Tool Calling with Vapi" at AI Hackathon SFxHamburg (CodeRabbit x Windsurf Christmas Edition)** 🏆

CallSensei is a real-time call intelligence dashboard that acts as a silent "whisperer" for call center operators. By analyzing the audio stream in real-time, it detects acoustic emotional cues—such as anger, stress, or hesitation—and provides instant, tactical suggestions to help operators navigate difficult conversations with empathy and precision.

## Features

### 🧠 **Acoustic Emotion Detection**

Utilizes advanced acoustic behavioral analysis to detect emotions beyond just text.

- **Anger**: Detects loud, fast, and sharp consonant patterns.
- **Stress**: Identifies high pitch, breathy tones, and rapid speech.
- **Confusion**: Notices slow pacing, hesitation, and rising inflection.
- **Urgency**: Picks up on fast, repetitive, and intense speech.
- **Sadness**: Recognizes low pitch, slow tempo, and quiet volume.

### ⚡ **Real-Time capabilities**

- **Live Transcription**: Instant speech-to-text display.
- **Emotion Timeline**: Interactive chart tracking the emotional trajectory of the call.
- **Smart Suggestions**: Context-aware bullet points and "opening lines" suggested in real-time.
- **Confidence Scoring**: Visual indicators of the model's certainty.

### 🛠 **Operation Modes**

- **Continuous Mode**: constantly monitors the stream for uninterrupted analysis.
- **Single Shot**: targeted analysis of specific call segments for spot-checking.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Voice AI**: [Vapi](https://vapi.ai/) (Voice API)
- **Intelligence**: OpenAI (via Vapi tool calling)
- **Visualization**: Recharts
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js (v18 or higher)
- A Vapi Account and Public Key

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd CallSensei
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory:
   ```env
   VAPI_PUBLIC_KEY=your_vapi_public_key_here
   ```

## Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or as indicated in your terminal).

## Project Structure

```
CallSensei/
├── components/        # Dashboard UI components
│   ├── Chart.tsx      # Emotion timeline visualization
│   ├── EmotionBadge.tsx
│   └── Transcript.tsx
├── hooks/             # Custom React hooks
│   └── useVapi.ts     # Vapi integration logic
├── utils/             # Helper functions
├── App.tsx            # Main application logic
├── constants.ts       # AI system instructions & customized prompts
├── types.ts           # TypeScript definitions
├── vite.config.ts     # Vite configuration
└── package.json
```

## How It Works

1. **Audio Streaming**: The app connects to Vapi's real-time voice API.
2. **Acoustic Analysis**: Vapi processes the audio stream for acoustic features (pitch, jitter, pace).
3. **Tool Calling**: When significant emotional shifts are detected, the AI model calls configured tools for analysis.
4. **Visual Feedback**: The frontend updates instantly to show the detected emotion, confidence score, and tactical advice.
