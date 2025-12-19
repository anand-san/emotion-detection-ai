import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AnalysisData } from '../types';

interface EmotionChartProps {
  history: AnalysisData[];
}

const EmotionChart: React.FC<EmotionChartProps> = ({ history }) => {
  // Normalize data for chart
  const data = history.map((h, i) => ({
    time: i,
    confidence: h.confidence * 100,
    emotion: h.emotion
  }));

  return (
    <div className="h-[200px] w-full bg-slate-800/30 rounded-xl border border-slate-700/50 p-4 mt-6">
      <div className="flex justify-between items-center mb-2">
         <h4 className="text-xs text-slate-400 uppercase font-bold">Emotional Volatility Trend</h4>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="time" hide />
          <YAxis domain={[0, 100]} hide />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
            itemStyle={{ color: '#818cf8' }}
            labelStyle={{ display: 'none' }}
            formatter={(value: number) => [`${value.toFixed(0)}%`, 'Intensity']}
          />
          <Line 
            type="monotone" 
            dataKey="confidence" 
            stroke="#818cf8" 
            strokeWidth={3}
            dot={{ fill: '#818cf8', strokeWidth: 0, r: 2 }}
            activeDot={{ r: 6, fill: '#6366f1' }}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmotionChart;
