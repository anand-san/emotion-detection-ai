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
    <div className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 ${colorClass} h-full`}>
      <span className="text-sm uppercase tracking-widest font-bold opacity-80 mb-2">Detected Emotion</span>
      <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">{emotion}</h2>
    </div>
  );
};

export default EmotionBadge;
