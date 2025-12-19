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
      <div className="mb-6">
        <h3 className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Live Guidance</h3>
        <p className="text-lg font-medium text-slate-200">{data.summary}</p>
      </div>

      {data.suggestedOpeningLine && (
        <div className="mb-6 bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
          <h4 className="text-indigo-400 text-xs uppercase font-bold mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Suggested Opening Line
          </h4>
          <p className="text-indigo-100 italic text-sm font-medium">"{data.suggestedOpeningLine}"</p>
        </div>
      )}

      <div className="flex-1 space-y-3 overflow-y-auto">
        <h3 className="text-slate-500 text-[10px] uppercase tracking-wider font-bold mb-2">Tactical Responses</h3>
        {data.suggestions.map((suggestion, idx) => (
          <div key={idx} className="flex items-start gap-3 bg-slate-700/50 p-3 rounded-lg border-l-4 border-slate-600 hover:border-indigo-500 transition-colors">
             <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
             </svg>
             <span className="text-slate-300 text-sm leading-relaxed">{suggestion}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionsPanel;
