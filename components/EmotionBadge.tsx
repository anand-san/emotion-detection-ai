import React from 'react';
import { EmotionType } from '../types';
import { EMOTION_COLORS } from '../constants';

interface EmotionBadgeProps {
  emotion: EmotionType;
  confidence: number;
}

const EmotionBadge: React.FC<EmotionBadgeProps> = ({ emotion, confidence }) => {
  const colorClass = EMOTION_COLORS[emotion] || EMOTION_COLORS[EmotionType.NEUTRAL];
  
  return (
    <div className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 ${colorClass}`}>
      <span className="text-sm uppercase tracking-widest font-bold opacity-80 mb-1">Detected Emotion</span>
      <h2 className="text-4xl font-extrabold mb-2">{emotion}</h2>
      <div className="w-full bg-black/20 rounded-full h-2 mt-2 max-w-[120px]">
        <div 
          className="bg-current h-2 rounded-full transition-all duration-500" 
          style={{ width: `${confidence * 100}%` }}
        ></div>
      </div>
      <span className="text-xs mt-1 font-mono opacity-70">{(confidence * 100).toFixed(0)}% Confidence</span>
    </div>
  );
};

export default EmotionBadge;
