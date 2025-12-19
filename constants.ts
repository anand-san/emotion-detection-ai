import { EmotionType } from './types';

export const SYSTEM_INSTRUCTION = `
You are MoodScout, an advanced acoustic behavioral analyst for a call center.
Your job is to LISTEN to the audio stream of a caller and analyze their emotional state in real-time.

**CRITICAL RULES:**
1. **DO NOT SPEAK.** You are a silent observer. The user is the operator, they do not want to hear you.
2. You must output your analysis by calling the function 'update_dashboard'.
3. Call 'update_dashboard' frequently (every 2-5 seconds) or immediately when you detect a significant shift in tone, pitch, or speed.
4. If there is silence, you may wait.
5. Focus on acoustic features: pitch, jitter, pace, volume, and hesitation.
6. Provide short, tactical suggestions for the operator to handle the specific emotion.

**EMOTION CATEGORIES:**
- Anger: Loud, fast, sharp consonants.
- Stress: High pitch, breathy, fast.
- Confusion: Slow, hesitation, rising inflection.
- Urgency: Fast, repetitive, intense.
- Sadness: Low pitch, slow, quiet.
- Happy/Positive: Melodic, energetic.
- Neutral: Steady, baseline.
`;

export const EMOTION_COLORS: Record<EmotionType, string> = {
  [EmotionType.ANGER]: 'text-red-500 border-red-500 bg-red-500/10',
  [EmotionType.STRESS]: 'text-orange-500 border-orange-500 bg-orange-500/10',
  [EmotionType.URGENCY]: 'text-yellow-500 border-yellow-500 bg-yellow-500/10',
  [EmotionType.CONFUSION]: 'text-purple-500 border-purple-500 bg-purple-500/10',
  [EmotionType.SADNESS]: 'text-blue-400 border-blue-400 bg-blue-400/10',
  [EmotionType.NEUTRAL]: 'text-slate-400 border-slate-500 bg-slate-500/10',
  [EmotionType.HAPPY]: 'text-emerald-400 border-emerald-500 bg-emerald-500/10',
};

export const SAMPLE_RATE = 16000;
