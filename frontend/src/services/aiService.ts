// In-App AI Career Coach & Mock Interview Examiner Service
// Supports Google Gemini API, OpenAI-compatible APIs, Chrome Built-in AI, and Offline Heuristic Intelligence.

export interface AiMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export type AiCoachMode = 'DSA' | 'SYSTEM_DESIGN' | 'DAILY_COACH';

export interface AiConfig {
  apiKey: string;
  provider: 'gemini' | 'openai';
  model: string;
}

const DEFAULT_CONFIG: AiConfig = {
  apiKey: '',
  provider: 'gemini',
  model: 'gemini-1.5-flash',
};

export const getAiConfig = (): AiConfig => {
  try {
    const saved = localStorage.getItem('careeros_ai_config');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    // ignore
  }
  return DEFAULT_CONFIG;
};

export const setAiConfig = (config: AiConfig) => {
  localStorage.setItem('careeros_ai_config', JSON.stringify(config));
};

export interface AiReviewContext {
  journalEntries: string[];
  dsaMistakes: string[];
  techHours: number;
  gymSessions: number;
  sleepAvg: number;
}

export const generateWeeklyReviewSummary = async (context: AiReviewContext): Promise<string> => {
  const cfg = getAiConfig();
  if (cfg.apiKey) {
    try {
      const prompt = `Review this week's engineering data for a software engineer targeting Tier-1 Product Companies:
- Tech Study Hours: ${context.techHours}
- Gym Sessions: ${context.gymSessions}
- Sleep Avg: ${context.sleepAvg}
- DSA Mistakes / Blindspots: ${context.dsaMistakes.join(', ')}
- Journal Highlights: ${context.journalEntries.join('; ')}

Provide a concise, sharp 3-bullet point review (Markdown) highlighting blind spots, physical readiness, and next week's focus theme.`;

      const response = await chatWithAi(
        [{ role: 'user', content: prompt }],
        'DAILY_COACH'
      );
      if (response) return response;
    } catch (e) {
      console.warn('AI call failed, using heuristic engine', e);
    }
  }

  // Fallback: Heuristic Engine acting as AI
  const summary: string[] = [];
  if (context.gymSessions < 3) {
    summary.push("📉 **Physical Readiness Drop**: You've logged fewer than 3 gym sessions. Your cognitive endurance in interviews will suffer. Prioritize morning workouts next week.");
  } else {
    summary.push("✅ **Physical Peak**: Great consistency in physical training. High BDNF and stress tolerance will pay off in live 4-round technical loops.");
  }

  if (context.sleepAvg < 7) {
    summary.push("⚠️ **Sleep Deprivation Alert**: Average sleep is below 7 hours. Algorithmic pattern memory consolidation happens in deep REM sleep. Enforce a 10:30 PM wind down.");
  }

  if (context.dsaMistakes.length > 0) {
    const commonMistake = context.dsaMistakes[0];
    summary.push(`🔍 **Pattern Blindspot**: You struggled with "${commonMistake}". Review this specific algorithmic invariant before doing blind problem sets.`);
  }

  if (context.techHours > 10) {
    summary.push("🚀 **Deep Work Momentum**: High technical focus logged. Ensure you are taking 5-minute walks every 90 minutes to prevent Friday burnout.");
  } else {
    summary.push("📊 **Tech Velocity**: Ramp up your dedicated deep-work blocks. Try using the Focus Timer for two 90-minute blocks per day.");
  }

  return summary.join('\n\n');
};

// Main Conversational Agent
export const chatWithAi = async (
  messages: AiMessage[],
  mode: AiCoachMode,
  contextData?: any
): Promise<string> => {
  const config = getAiConfig();

  // 1. Google Gemini API
  if (config.provider === 'gemini' && config.apiKey?.trim()) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model || 'gemini-1.5-flash'}:generateContent?key=${config.apiKey.trim()}`;
      
      const systemInstruction = getSystemPrompt(mode, contextData);
      
      // Convert messages to Gemini format
      const contents = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      // Add system prompt context as first user turn if needed
      contents.unshift({
        role: 'user',
        parts: [{ text: `[SYSTEM INSTRUCTION & CONTEXT]:\n${systemInstruction}` }]
      });
      contents.splice(1, 0, {
        role: 'model',
        parts: [{ text: "Understood. I am MentorAI, your Tier-1 Technical Interviewer & Staff Engineer Coach. Let's begin." }]
      });

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          }
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson?.error?.message || `Gemini API returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (reply) return reply;
    } catch (e: any) {
      console.warn('Gemini API call failed, falling back to offline engine:', e.message);
    }
  }

  // 2. Chrome Built-in AI (Window.ai)
  if ('ai' in window && (window as any).ai) {
    try {
      const session = await (window as any).ai.createTextSession();
      const lastMsg = messages[messages.length - 1]?.content || '';
      const prompt = `${getSystemPrompt(mode, contextData)}\n\nUser: ${lastMsg}\nMentorAI:`;
      const result = await session.prompt(prompt);
      if (result) return result;
    } catch (e) {
      // ignore
    }
  }

  // 3. Offline Heuristic AI Engine (Works anywhere, 0 API keys required)
  return getOfflineHeuristicResponse(messages, mode, contextData);
};

// System Prompts per Mode
function getSystemPrompt(mode: AiCoachMode, ctx?: any): string {
  const base = `You are MentorAI, an elite Staff Software Engineer and Senior Bar-Raiser Interviewer at Google and Amazon.
You are coaching Sanjeev Vibhakar (Software Engineer targeting Tier-1 Product Companies in 2026-2027).
Expertise: Java 21 LTS, Spring Boot 3, Kafka, Distributed Systems, Concurrency, and Systematic DSA Patterns.
Tone: Direct, demanding yet encouraging, rigorous on time/space complexities and failure modes.`;

  if (mode === 'DSA') {
    return `${base}
ROLE: DSA Mock Interviewer.
Problem Focus: ${ctx?.problemName || 'Algorithmic Problem'} (Topic: ${ctx?.topicName || 'DSA'}, Difficulty: ${ctx?.difficulty || 'Medium'}).
INSTRUCTIONS:
- Do NOT immediately dump full code unless explicitly requested.
- First evaluate the candidate's approach, identify time and space complexities.
- Ask probing questions about edge cases (empty input, negatives, duplicates, integer overflow).
- Provide hints progressively: Hint 1 (intuition), Hint 2 (invariant), Hint 3 (structure).`;
  }

  if (mode === 'SYSTEM_DESIGN') {
    return `${base}
ROLE: System Design & HLD Bar-Raiser.
Architecture Topic: ${ctx?.systemTopic || 'Distributed Architecture'}.
INSTRUCTIONS:
- Guide the candidate through: 1. Functional & Non-Functional Requirements, 2. Back-of-the-Envelope estimation (QPS, IOPS, Storage, Bandwidth), 3. High Level Components, 4. Deep-dive into trade-offs (Cache stampede, CAP theorem, Consensus, Saga vs 2PC, Sharding).
- Challenge single points of failure (SPOF) and network partitions.`;
  }

  return `${base}
ROLE: Daily Strategic Accountability Coach.
Current Level: Level ${ctx?.currentLevel || 1} | Readiness Score: ${ctx?.readinessScore || 45}%.
Bottleneck Topic: ${ctx?.bottleneckTopic || 'Dynamic Programming'}.
INSTRUCTIONS:
- Review the engineer's daily discipline and telemetry.
- Provide tactical, high-impact guidance for today's battle.`;
}

// Offline Heuristic Engine for immediate, zero-latency feedback without API key
function getOfflineHeuristicResponse(messages: AiMessage[], mode: AiCoachMode, ctx?: any): string {
  const lastUserText = (messages[messages.length - 1]?.content || '').toLowerCase();

  if (mode === 'DSA') {
    const prob = ctx?.problemName || 'this problem';
    if (lastUserText.includes('hint') || lastUserText.includes('stuck') || lastUserText.includes('how to')) {
      return `💡 **Examiner Hint for ${prob}**:
1. **Identify the Invariant**: What property remains true at each step? (e.g. sorted order, monotonicity, or two-pointer boundary).
2. **Brute Force vs Optimal**: The brute force is likely $O(N^2)$ with nested loops. Can you trade $O(N)$ space (using a Hash Map or Monotonic Stack) to bring time down to $O(N)$?
3. **Edge Case Check**: What happens if the array has only $0$ or $1$ element, or contains negative integers?

What is your proposed time and space complexity with this intuition?`;
    }

    if (lastUserText.includes('o(n)') || lastUserText.includes('hash') || lastUserText.includes('pointer') || lastUserText.includes('approach')) {
      return `🎯 **Examiner Critique**:
Your intuition on using this pattern is solid! Here is what a Tier-1 interviewer (Google/Meta) is evaluating:

- **Time Complexity**: $O(N)$ — single pass over the elements.
- **Space Complexity**: $O(N)$ auxiliary storage (or $O(1)$ if two-pointer in-place).
- **Critical Edge Cases to verbalize before coding**:
  1. Empty array or $N=1$.
  2. Duplicate elements that could cause hash collisions or pointer stalls.
  3. Memory consumption when $N = 10^7$.

**Next Step**: Walk me through how your pointers/data structures initialize in the first iteration.`;
    }

    return `👋 **Examiner Ready**:
We are evaluating **${prob}** (${ctx?.difficulty || 'Medium'} difficulty).

Before writing code:
1. What is the brute-force time complexity?
2. What data structure can eliminate redundant comparisons?
3. What edge cases must we handle?

Explain your approach out loud.`;
  }

  if (mode === 'SYSTEM_DESIGN') {
    const topic = ctx?.systemTopic || 'Distributed Architecture';
    if (lastUserText.includes('estimate') || lastUserText.includes('qps') || lastUserText.includes('dau')) {
      return `🧮 **Back-of-the-Envelope Estimation Blueprint (${topic})**:
Assuming **50M Daily Active Users (DAU)**:
- **Read QPS**: 50M × 20 actions / 86,400s $\\approx$ **11,500 Read QPS** (Peak: **23,000 QPS**).
- **Write QPS**: 50M × 2 actions / 86,400s $\\approx$ **1,150 Write QPS** (Peak: **2,300 QPS**).
- **Daily Storage**: 1,150 writes/s × 86,400s × 500 Bytes $\\approx$ **50 GB / day** ($\\approx$ **18 TB / year**).
- **Bandwidth**: 11,500 reads/s × 1 KB $\\approx$ **11.5 MB/s**.

How will you shard your database to distribute this write throughput?`;
    }

    return `🏛️ **System Design Examiner (${topic})**:
Let's design a high-throughput, fault-tolerant **${topic}**.

Let's break this into the 4 standard Google/Amazon interview phases:
1. **Scope Requirements**: Functional (P99 latency < 20ms, 99.99% availability) vs Non-functional.
2. **Back-of-the-Envelope**: Calculate read/write QPS and annual storage.
3. **High-Level Components**: API Gateway $\\rightarrow$ Stateless App Servers $\\rightarrow$ Redis Cache $\\rightarrow$ Partitioned DB.
4. **Deep Dive Bottlenecks**: What happens during a network partition or cache stampede?

Where would you like to start?`;
  }

  // Daily Strategy Coach
  return `⚡ **Daily Tactical Debrief**:
Here is your live telemetry analysis:
- **Target Goal**: Tier-1 Product Engineer (Target 2027).
- **Current Level**: Level ${ctx?.currentLevel || 1} (${ctx?.playerRank || 'Apprentice'}).
- **Top Bottleneck Topic**: **${ctx?.bottleneckTopic || 'Dynamic Programming'}**.

**Tactical Recommendation for Today**:
1. Do not skip your 1 DSA problem. Focus specifically on **${ctx?.bottleneckTopic || 'Dynamic Programming'}**.
2. Run a 15-minute speech practice session explaining the pattern out loud.
3. Complete your evening Tech Sprint block before 10 PM to protect REM sleep consolidation.

Ready to conquer today's battle?`;
}
