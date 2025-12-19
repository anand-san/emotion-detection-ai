export enum EmotionType {
  ANGER = 'Anger',
  STRESS = 'Stress',
  CONFUSION = 'Confusion',
  NEUTRAL = 'Neutral',
  HAPPY = 'Happy',
  URGENCY = 'Urgency',
  SADNESS = 'Sadness'
}

export interface AnalysisData {
  emotion: EmotionType;
  confidence: number;
  suggestions: string[];
  summary: string;
  timestamp: number;
}

export interface ToolCallResponse {
  functionResponses: {
    name: string;
    response: object;
    id: string;
  }
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export type AnalysisMode = 'continuous' | 'single_shot';
