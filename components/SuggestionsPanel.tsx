import React from 'react';
import { AnalysisData } from '../types';

interface SuggestionsPanelProps {
  data: AnalysisData | null;
}

const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 h-full flex items-center justify-center text-slate-500">
        <p>Waiting for analysis...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 h-full flex flex-col shadow-lg">
      <div className="mb-4">
        <h3 className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Live Guidance</h3>
        <p className="text-lg font-medium text-slate-200">{data.summary}</p>
      </div>

      <div className="flex-1 space-y-3">
        {data.suggestions.map((suggestion, idx) => (
          <div key={idx} className="flex items-start gap-3 bg-slate-700/50 p-3 rounded-lg border-l-4 border-indigo-500">
             <svg className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
             <span className="text-slate-200 text-sm leading-relaxed">{suggestion}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionsPanel;
