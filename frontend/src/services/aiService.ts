export interface AiReviewContext {
  journalEntries: string[];
  dsaMistakes: string[];
  techHours: number;
  gymSessions: number;
  sleepAvg: number;
}

export const generateWeeklyReviewSummary = async (context: AiReviewContext): Promise<string> => {
  // If Chrome's built-in experimental AI is available (Gemini Nano)
  if ('ai' in window && (window as any).ai) {
    try {
      const model = await (window as any).ai.createTextSession();
      const prompt = `You are a strict, highly analytical career coach. Review this week's data for a software engineer:
      - Tech Hours: ${context.techHours}
      - Gym Sessions: ${context.gymSessions}
      - Sleep Avg: ${context.sleepAvg}
      - DSA Mistakes: ${context.dsaMistakes.join(', ')}
      - Journal Notes: ${context.journalEntries.join('; ')}
      
      Provide a highly concise, 3-bullet-point review (Markdown format) pointing out their blind spots and what they should focus on next week.`;
      
      const result = await model.prompt(prompt);
      return result;
    } catch (e) {
      console.warn('Local AI failed, falling back to heuristic engine.');
    }
  }

  // Fallback: Heuristic Engine acting as AI
  const summary: string[] = [];
  
  if (context.gymSessions < 3) {
    summary.push("📉 **Physical Readiness Drop**: You've logged fewer than 3 gym sessions. Your cognitive endurance in interviews will suffer. Prioritize cardio next week.");
  } else {
    summary.push("✅ **Physical Peak**: Great job maintaining gym consistency. This directly translates to stress tolerance in System Design interviews.");
  }

  if (context.sleepAvg < 7) {
    summary.push("⚠️ **Sleep Deprivation Alert**: Your average sleep is below 7 hours. Memory consolidation for algorithms occurs during REM sleep. Hard stop at 10 PM next week.");
  }

  if (context.dsaMistakes.length > 0) {
    const commonMistake = context.dsaMistakes[0]; // simplistic check
    summary.push(`🔍 **Pattern Blindspot**: You struggled with "${commonMistake}". Review this specific pattern concept deeply before doing more blind problems.`);
  }

  if (context.techHours > 10) {
    summary.push("🚀 **Deep Work Momentum**: High technical focus logged. Ensure you are taking 5-minute walks every 90 minutes to prevent Friday burnout.");
  } else {
    summary.push("📊 **Tech Velocity**: Ramp up your dedicated deep-work blocks. Try using the Focus Timer for two 90-minute blocks per day.");
  }

  return summary.join('\n\n');
};
