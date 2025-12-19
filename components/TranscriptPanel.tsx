import React, { useEffect, useRef } from "react";

interface TranscriptPanelProps {
  transcript: string;
}

const TranscriptPanel: React.FC<TranscriptPanelProps> = ({ transcript }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [transcript]);

  return (
    <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4 mt-6">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-xs text-slate-400 uppercase font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          Live Transcript
        </h4>
      </div>
      <div
        ref={containerRef}
        className="h-[100px] overflow-y-auto text-slate-300 text-sm font-mono leading-relaxed p-2 bg-slate-900/50 rounded-lg border border-slate-800/50 scrollbar-hide"
      >
        {transcript ? (
          <p>{transcript}</p>
        ) : (
          <p className="text-slate-600 italic">Waiting for speech...</p>
        )}
      </div>
    </div>
  );
};

export default TranscriptPanel;
