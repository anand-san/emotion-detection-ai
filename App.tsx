import React from "react";
import { useGeminiLive } from "./hooks/useGeminiLive";
import EmotionBadge from "./components/EmotionBadge";
import SuggestionsPanel from "./components/SuggestionsPanel";
import EmotionChart from "./components/EmotionChart";
import TranscriptPanel from "./components/TranscriptPanel";
import { EmotionType } from "./types";

export default function App() {
  const {
    connect,
    disconnect,
    status,
    currentAnalysis,
    history,
    mode,
    setMode,
    transcript,
  } = useGeminiLive();

  const isConnected = status === "connected";
  const isConnecting = status === "connecting";

  return (
    <div className="min-h-screen bg-primary text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-slate-800 pb-6 gap-6">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">MoodScout</h1>
              <p className="text-slate-400 text-sm">
                Real-time Call Intelligence
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            {/* Mode Toggle */}
            <div className="flex items-center bg-slate-800 rounded-full p-1 border border-slate-700">
              <button
                onClick={() => setMode("continuous")}
                disabled={isConnected}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  mode === "continuous"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                } ${isConnected ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Continuous
              </button>
              <button
                onClick={() => setMode("single_shot")}
                disabled={isConnected}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  mode === "single_shot"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                } ${isConnected ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Single Shot
              </button>
            </div>

            {status === "error" && (
              <span className="text-red-400 text-sm font-medium">
                Connection Failed
              </span>
            )}

            <button
              onClick={isConnected ? disconnect : connect}
              disabled={isConnecting}
              className={`px-6 py-2.5 rounded-full font-medium transition-all shadow-lg flex items-center gap-2 w-full md:w-auto justify-center ${
                isConnected
                  ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/50"
                  : isConnecting
                  ? "bg-slate-700 text-slate-300 cursor-wait"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20"
              }`}
            >
              {isConnecting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Connecting...
                </>
              ) : isConnected ? (
                <>
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  End Session
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                  {mode === "single_shot" ? "Analyze Once" : "Start Monitoring"}
                </>
              )}
            </button>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[500px]">
          {/* Left Column: Emotion Badge */}
          <div className="md:col-span-1 h-full">
            {currentAnalysis ? (
              <EmotionBadge
                emotion={currentAnalysis.emotion}
                confidence={currentAnalysis.confidence}
              />
            ) : (
              <div className="h-full bg-slate-800/30 rounded-2xl border-2 border-slate-700/50 border-dashed flex items-center justify-center text-slate-500 p-6 text-center">
                <div>
                  <p className="mb-2 text-lg font-medium">Ready to Listen</p>
                  <p className="text-sm">
                    {mode === "single_shot"
                      ? "Will analyze a short segment and then stop."
                      : "Start the session to analyze call audio continuously."}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Suggestions & History */}
          <div className="md:col-span-2 flex flex-col h-full gap-6">
            <div className="flex-1 min-h-0">
              <SuggestionsPanel data={currentAnalysis} />
            </div>
          </div>
        </div>

        {/* Transcript Row */}
        <TranscriptPanel transcript={transcript} />

        {/* Chart Row */}
        {history.length > 0 && <EmotionChart history={history} />}

        {/* Footer info */}
        <div className="mt-8 flex justify-center text-slate-500 text-xs gap-6">
          {isConnected ? (
            <>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Microphone Active
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Model: gemini-2.5-flash-native-audio
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                Observer Mode (
                {mode === "single_shot" ? "Single Shot" : "Continuous"})
              </span>
            </>
          ) : (
            <span className="flex items-center gap-1 opacity-50">
              <span className="w-2 h-2 rounded-full bg-slate-600"></span>
              Standby
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
