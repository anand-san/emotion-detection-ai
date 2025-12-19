import React from "react";
import { useVapi } from "./hooks/useVapi";
import EmotionBadge from "./components/EmotionBadge";
import SuggestionsPanel from "./components/SuggestionsPanel";
import EmotionChart from "./components/EmotionChart";
import TranscriptPanel from "./components/TranscriptPanel";

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
  } = useVapi();

  const isConnected = status === "connected";
  const isConnecting = status === "connecting";

  return (
    <div className="min-h-screen bg-white text-slate-900 p-2 md:p-2">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-4 pb-4 gap-6 border-b border-gray-200">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-black p-2 rounded-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
                <path d="M9 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">CallSensei</h1>
              <p className="text-slate-500 text-sm">
                Real-time Call Intelligence
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            {/* Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-full p-1 border border-gray-200">
              <button
                onClick={() => setMode("continuous")}
                disabled={isConnected}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  mode === "continuous"
                    ? "bg-black text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                } ${isConnected ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Continuous
              </button>
              <button
                onClick={() => setMode("single_shot")}
                disabled={isConnected}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  mode === "single_shot"
                    ? "bg-black text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                } ${isConnected ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Single Shot
              </button>
            </div>

            {status === "error" && (
              <span className="text-red-600 text-sm font-medium">
                Connection Failed
              </span>
            )}

            <button
              onClick={isConnected ? disconnect : connect}
              disabled={isConnecting}
              className={`px-6 py-2.5 rounded-full font-medium transition-all shadow-sm flex items-center gap-2 w-full md:w-auto justify-center ${
                isConnected
                  ? "bg-white text-black border-2 border-black hover:bg-gray-50"
                  : isConnecting
                  ? "bg-gray-200 text-gray-500 cursor-wait"
                  : "bg-black hover:bg-gray-800 text-white"
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
                  Start Analyzing
                </>
              )}
            </button>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[520px]">
          {/* Left Column: Emotion Badge & Timeline */}
          <div className="flex flex-col gap-6 h-full min-h-0">
            <div className="flex-1 min-h-0">
              {currentAnalysis ? (
                <EmotionBadge
                  emotion={currentAnalysis.emotion}
                  confidence={currentAnalysis.confidence}
                />
              ) : (
                <div className="h-full bg-gray-50 rounded-2xl border-2 border-gray-200 border-dashed flex items-center justify-center text-slate-500 p-6 text-center">
                  <div>
                    <p className="mb-2 text-lg font-medium text-slate-700">Ready to Listen</p>
                    <p className="text-sm text-slate-500">
                      {mode === "single_shot"
                        ? "Will analyze a short segment and then stop."
                        : "Start the session to analyze call audio continuously."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 min-h-0">
              <EmotionChart history={history} />
            </div>
          </div>

          {/* Right Column: Suggestions & History */}
          <div className="flex flex-col h-full gap-6 min-h-0">
            <div className="flex-1 min-h-0">
              <SuggestionsPanel data={currentAnalysis} />
            </div>
          </div>
        </div>

        {/* Transcript Row */}
        <TranscriptPanel transcript={transcript} />

        {/* Footer info */}
        <div className="mt-8 flex justify-center text-slate-500 text-xs gap-6">
          {isConnected ? (
            <>
              {currentAnalysis && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  Confidence: {(currentAnalysis.confidence * 100).toFixed(0)}%
                </span>
              )}
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Microphone Active
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Provider: VAPI (gpt-4-turbo)
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
