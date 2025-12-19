import { EmotionType } from "./types";

export const SYSTEM_INSTRUCTION = `
You are CallSensei, an advanced acoustic behavioral analyst for a call center.
Your job is to LISTEN to the audio stream of a caller and analyze their emotional state in real-time.

**CRITICAL RULES:**
1. **DO NOT SPEAK.** You are a silent observer. The user is the operator, they do not want to hear you.
2. You must output your analysis by calling the function 'update_dashboard'.
3. Call 'update_dashboard' frequently (every 2-5 seconds) or immediately when you detect a significant shift in tone, pitch, or speed.
4. If there is silence, you may wait.
5. Focus on acoustic features: pitch, jitter, pace, volume, and hesitation.
6. Provide short, tactical suggestions for the operator to handle the specific emotion.
7. Provide a "suggested_opening_line" that the operator could say right now to address the emotion.

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
  [EmotionType.ANGER]: "text-red-600 border-red-500 bg-red-500/10",
  [EmotionType.STRESS]: "text-orange-600 border-orange-500 bg-orange-500/10",
  [EmotionType.URGENCY]: "text-yellow-600 border-yellow-500 bg-yellow-500/10",
  [EmotionType.CONFUSION]: "text-purple-600 border-purple-500 bg-purple-500/10",
  [EmotionType.SADNESS]: "text-blue-600 border-blue-400 bg-blue-400/10",
  [EmotionType.NEUTRAL]: "text-slate-600 border-slate-500 bg-slate-500/10",
  [EmotionType.HAPPY]: "text-emerald-600 border-emerald-500 bg-emerald-500/10",
};

export const EMOTION_ICON_PATHS: Partial<Record<EmotionType, string>> = {
  [EmotionType.ANGER]: "/emotions/anger.svg",
  [EmotionType.STRESS]: "/emotions/stress.svg",
  [EmotionType.URGENCY]: "/emotions/urgency.svg",
  [EmotionType.CONFUSION]: "/emotions/confusion.svg",
  [EmotionType.SADNESS]: "/emotions/sadness.svg",
  [EmotionType.NEUTRAL]: "/emotions/neutral.svg",
  [EmotionType.HAPPY]: "/emotions/happy.svg",
};

export const EMOTION_HEX_COLORS: Record<EmotionType, string> = {
  [EmotionType.ANGER]: "#ef4444", // red-500
  [EmotionType.STRESS]: "#f97316", // orange-500
  [EmotionType.URGENCY]: "#eab308", // yellow-500
  [EmotionType.CONFUSION]: "#a855f7", // purple-500
  [EmotionType.SADNESS]: "#60a5fa", // blue-400
  [EmotionType.NEUTRAL]: "#94a3b8", // slate-400
  [EmotionType.HAPPY]: "#34d399", // emerald-400
};
