import React, { useRef, useEffect } from "react";
import { AnalysisData } from "../types";
import { EMOTION_HEX_COLORS } from "../constants";

interface EmotionChartProps {
  history: AnalysisData[];
}

const EmotionChart: React.FC<EmotionChartProps> = ({ history }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div className="h-full w-full bg-slate-800/30 rounded-xl border border-slate-700/50 p-5 flex flex-col min-h-0">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-xs text-slate-400 uppercase font-bold flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            Emotional Timeline
          </h4>
          <p className="text-[10px] text-slate-500 mt-1">
            Real-time status updates
          </p>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 w-full min-h-0 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
      >
        {history.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-600 text-xs italic">
            No emotional shifts detected yet...
          </div>
        ) : (
          history.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 text-sm group">
              <div className="min-w-[60px] text-[10px] text-slate-500 font-mono text-right">
                {new Date(item.timestamp).toLocaleTimeString([], {
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </div>
              
              <div className="relative flex flex-col items-center">
                <div 
                  className="w-2 h-2 rounded-full z-10"
                  style={{ backgroundColor: EMOTION_HEX_COLORS[item.emotion] || "#94a3b8" }}
                ></div>
                {idx !== history.length - 1 && (
                  <div className="absolute top-2 w-[1px] h-[calc(100%+12px)] bg-slate-800 group-last:hidden"></div>
                )}
              </div>

              <div className="flex-1 bg-slate-800/40 rounded px-3 py-2 border border-slate-700/30 flex justify-between items-center">
                <span className="font-medium text-slate-200">{item.emotion}</span>
                <span className="text-[10px] text-slate-500 bg-slate-900/50 px-1.5 py-0.5 rounded">
                  {(item.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmotionChart;