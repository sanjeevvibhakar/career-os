import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useDailyStore } from '../../stores/dailyStore';
import { useDashboardStore } from '../../stores/dashboardStore';
import { 
  Mic, MicOff, Sparkles, CheckCircle2, RotateCcw, Volume2, 
  Clock, ShieldAlert, Award, ArrowRight, MessageSquare, BookOpen, Flame
} from 'lucide-react';

interface PromptTopic {
  id: string;
  category: 'DSA & Complexity' | 'Core Java & OOP' | 'Databases & APIs' | 'Behavioral';
  title: string;
  question: string;
  targetDurationSec: number;
  keyPoints: string[];
}

const CURATED_PROMPTS: PromptTopic[] = [
  // DSA
  {
    id: 'dsa-1',
    category: 'DSA & Complexity',
    title: 'Two Sum & Hash Map Lookup',
    question: 'Explain your approach to Two Sum and why a Hash Map is O(N) time instead of brute-force O(N²).',
    targetDurationSec: 60,
    keyPoints: [
      'State the brute-force nested loop limitation (O(N²))',
      'Explain the complement check: target - currentNum',
      'Mention hash map lookup is O(1) average time and O(N) auxiliary space'
    ]
  },
  {
    id: 'dsa-2',
    category: 'DSA & Complexity',
    title: 'Two Pointers on a Sorted Array',
    question: 'Explain how the Two Pointers technique works on a sorted array and when to use it.',
    targetDurationSec: 60,
    keyPoints: [
      'Initialize left at start and right at end',
      'Explain how moving pointers inward narrows down the answer in O(N) time and O(1) space',
      'Contrast with binary search or hashing'
    ]
  },
  {
    id: 'dsa-3',
    category: 'DSA & Complexity',
    title: 'Sliding Window Pattern',
    question: 'Explain the Sliding Window technique. How do fixed and variable windows differ?',
    targetDurationSec: 75,
    keyPoints: [
      'Define a window as a contiguous subsegment of an array or string',
      'Explain expanding right boundary to include elements and shrinking left to maintain constraints',
      'Explain why it avoids re-calculating overlapping subproblems'
    ]
  },
  {
    id: 'dsa-4',
    category: 'DSA & Complexity',
    title: 'BFS vs DFS on a Binary Tree',
    question: 'Explain the core difference between Breadth-First Search (BFS) and Depth-First Search (DFS) on trees.',
    targetDurationSec: 75,
    keyPoints: [
      'BFS visits level-by-level using a Queue (FIFO)',
      'DFS explores paths to leaf nodes using Recursion / Call Stack (LIFO)',
      'Give one practical scenario for each (e.g. shortest path vs tree height)'
    ]
  },
  {
    id: 'dsa-5',
    category: 'DSA & Complexity',
    title: 'Binary Search Intuition',
    question: 'Why is Binary Search O(log N)? What prerequisite must the data satisfy?',
    targetDurationSec: 60,
    keyPoints: [
      'Requires monotonic / sorted order',
      'Explain dividing the search space in half at each step (N -> N/2 -> N/4 -> 1)',
      'Compare log₂(1,000,000) ~ 20 operations vs 1,000,000 linear operations'
    ]
  },

  // Java & OOP
  {
    id: 'java-1',
    category: 'Core Java & OOP',
    title: '== vs .equals() in Java',
    question: 'Explain the difference between the == operator and the .equals() method in Java.',
    targetDurationSec: 60,
    keyPoints: [
      '== checks memory reference (address) equality for objects and value for primitives',
      '.equals() is a method that checks logical content/value equality when overridden',
      'Mention String pool behavior as a common interview trap'
    ]
  },
  {
    id: 'java-2',
    category: 'Core Java & OOP',
    title: 'Method Overloading vs Overriding',
    question: 'Explain Method Overloading versus Method Overriding with a simple real-world example.',
    targetDurationSec: 60,
    keyPoints: [
      'Overloading: same method name, different parameter signature in the same class (compile-time polymorphism)',
      'Overriding: subclass redefines a parent method with exact same signature using @Override (runtime polymorphism)',
      'Give a simple vehicle or math example'
    ]
  },
  {
    id: 'java-3',
    category: 'Core Java & OOP',
    title: 'HashMap Internal Working in Java',
    question: 'Explain how a HashMap stores and retrieves key-value pairs internally.',
    targetDurationSec: 90,
    keyPoints: [
      'Keys are converted to hash codes via hashCode() and mapped to bucket array indices',
      'Collisions are handled using LinkedLists (and balanced Red-Black trees in Java 8+ if chain length > 8)',
      'Why both hashCode() and equals() contracts must be correctly implemented'
    ]
  },
  {
    id: 'java-4',
    category: 'Core Java & OOP',
    title: 'Abstract Class vs Interface in Java',
    question: 'When would you use an Abstract Class versus an Interface in Java?',
    targetDurationSec: 75,
    keyPoints: [
      'Interface defines a contract ("can-do") with multiple inheritance capability',
      'Abstract Class defines a base identity ("is-a") with shared state, fields, and constructors',
      'Mention default methods introduced in Java 8'
    ]
  },
  {
    id: 'java-5',
    category: 'Core Java & OOP',
    title: 'Garbage Collection Fundamentals',
    question: 'Explain how Garbage Collection works in Java in simple terms.',
    targetDurationSec: 60,
    keyPoints: [
      'Runs in the background on the JVM heap memory',
      'Identifies objects that have no active references from GC roots',
      'Automatically frees memory, preventing manual memory leaks common in C++'
    ]
  },

  // Databases & Web
  {
    id: 'db-1',
    category: 'Databases & APIs',
    title: 'Database Indexing Explained',
    question: 'What is a Database Index? Why does it speed up queries but slow down write operations?',
    targetDurationSec: 75,
    keyPoints: [
      'Analogy: Like an index in the back of a textbook avoiding a full table scan',
      'Under the hood: Typically a B-Tree structure allowing O(log N) searches',
      'Trade-off: On every INSERT/UPDATE/DELETE, the index tree must also be updated and rebalanced'
    ]
  },
  {
    id: 'db-2',
    category: 'Databases & APIs',
    title: 'REST HTTP Methods & Idempotency',
    question: 'Explain the difference between GET, POST, PUT, and DELETE. What does idempotent mean?',
    targetDurationSec: 75,
    keyPoints: [
      'GET retrieves data, POST creates new resource, PUT updates/replaces, DELETE removes',
      'Idempotent: Making the same request multiple times produces the exact same result (GET, PUT, DELETE are idempotent; POST is not)',
      'Security: GET parameters appear in the URL query string, POST sends payload in request body'
    ]
  },
  {
    id: 'db-3',
    category: 'Databases & APIs',
    title: 'Primary Key vs Foreign Key',
    question: 'What is the role of a Primary Key and a Foreign Key in relational databases?',
    targetDurationSec: 60,
    keyPoints: [
      'Primary Key: Uniquely identifies each record in a table, cannot be null',
      'Foreign Key: A column that references the primary key of another table',
      'Ensures referential integrity across related entities (e.g. Users and Orders)'
    ]
  },

  // Behavioral
  {
    id: 'beh-1',
    category: 'Behavioral',
    title: 'Explaining a Challenging Bug',
    question: 'Tell me about a challenging bug or error you encountered in your work and how you isolated and resolved it.',
    targetDurationSec: 90,
    keyPoints: [
      'Use STAR framework: Situation, Task, Action, Result',
      'Focus on how you diagnosed the root cause using logs, debugging, or metrics',
      'Highlight what preventive measure was added (tests, validation, alerts)'
    ]
  },
  {
    id: 'beh-2',
    category: 'Behavioral',
    title: 'Learning a New Technology Under Pressure',
    question: 'Describe a situation where you had to quickly learn and adopt a new framework or technology.',
    targetDurationSec: 75,
    keyPoints: [
      'Explain the project necessity that drove the need',
      'How you broke down the learning curve (official docs, building a prototype first)',
      'The outcome: delivered on schedule and shared learnings with the team'
    ]
  }
];

export const CommunicationPage: React.FC = () => {
  const dailyStore = useDailyStore();
  const dashboardStore = useDashboardStore();

  const [selectedPrompt, setSelectedPrompt] = useState<PromptTopic>(CURATED_PROMPTS[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Speech Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [speechText, setSpeechText] = useState('');
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

  // Review & Evaluation State
  const [reviewResult, setReviewResult] = useState<{
    score: number;
    wordCount: number;
    wpm: number;
    fillerCount: number;
    fillers: string[];
    strengths: string[];
    improvements: string[];
  } | null>(null);

  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech API support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
    }
  }, []);

  // Timer effect during recording
  useEffect(() => {
    if (isRecording) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isRecording]);

  const startRecording = () => {
    setReviewResult(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. You can type your explanation directly in the box!');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + ' ';
        }
        setSpeechText(transcript.trim());
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please grant microphone permissions or type your notes.');
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
      setTimerSeconds(0);
    } catch (e) {
      console.error(e);
      alert('Could not start microphone. You can type your explanation in the box below.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handlePickRandomPrompt = () => {
    const pool = selectedCategory === 'All' 
      ? CURATED_PROMPTS 
      : CURATED_PROMPTS.filter(p => p.category === selectedCategory);
    const random = pool[Math.floor(Math.random() * pool.length)];
    setSelectedPrompt(random);
    setSpeechText('');
    setReviewResult(null);
    setTimerSeconds(0);
  };

  // Evaluate speech/text against beginner-friendly rubric
  const handleReview = () => {
    if (!speechText.trim()) {
      alert('Please speak or type your explanation first.');
      return;
    }

    const words = speechText.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const durationMins = Math.max(timerSeconds / 60, wordCount / 120); // estimate if typed
    const wpm = Math.round(wordCount / (durationMins || 0.5));

    // Filler word scan
    const fillerWords = ['um', 'uh', 'like', 'actually', 'basically', 'sort of', 'you know', 'kinda', 'literally'];
    const detectedFillers: string[] = [];
    words.forEach(w => {
      const clean = w.toLowerCase().replace(/[^a-z]/g, '');
      if (fillerWords.includes(clean)) {
        detectedFillers.push(clean);
      }
    });

    // Structure & content checks
    const lowerText = speechText.toLowerCase();
    const strengths: string[] = [];
    const improvements: string[] = [];
    let score = 5;

    // Check 1: Length and substance
    if (wordCount >= 40) {
      score += 2;
      strengths.push('Solid explanation length with sufficient detail provided.');
    } else {
      improvements.push('A bit too brief. Aim for at least 40-60 words to fully explain the concept.');
    }

    // Check 2: Key concept matching
    const promptKeywords = selectedPrompt.title.toLowerCase().split(' ');
    const matchedKeywords = promptKeywords.filter(k => lowerText.includes(k) && k.length > 3);
    if (matchedKeywords.length > 0) {
      score += 1.5;
      strengths.push(`Clearly referenced core topic terminology (${matchedKeywords.join(', ')}).`);
    } else {
      improvements.push('Be sure to explicitly name the core terminology at the beginning.');
    }

    // Check 3: Complexity / Trade-off / Example
    if (lowerText.includes('time') || lowerText.includes('space') || lowerText.includes('o(') || lowerText.includes('example') || lowerText.includes('because')) {
      score += 1.5;
      strengths.push('Good technical reasoning—explained why or referenced time/space complexity.');
    } else {
      improvements.push('Try adding a concrete example or mentioning time/space complexity trade-offs.');
    }

    // Check 4: Filler words impact
    if (detectedFillers.length > 4) {
      score = Math.max(4, score - 1);
      improvements.push(`Noticed ${detectedFillers.length} filler words (${detectedFillers.slice(0, 3).join(', ')}...). Pause silently instead of using filler words.`);
    } else if (detectedFillers.length === 0 && wordCount > 30) {
      strengths.push('Zero filler words detected—crisp, authoritative delivery!');
    }

    const finalScore = Math.min(10, Math.max(5, Math.round(score * 10) / 10));

    setReviewResult({
      score: finalScore,
      wordCount,
      wpm,
      fillerCount: detectedFillers.length,
      fillers: detectedFillers,
      strengths,
      improvements
    });
  };

  const handleSaveSession = () => {
    if (!speechText.trim()) return;
    const duration = Math.max(1, Math.round(timerSeconds / 60)) || 2;
    dailyStore.saveCommunication({
      date: new Date().toISOString().split('T')[0],
      type: 'SPEAKING',
      topic: selectedPrompt.title,
      durationMinutes: duration,
      notes: speechText,
      rating: reviewResult ? Math.round(reviewResult.score / 2) : 4,
    });
    dashboardStore.updateStreak('communication');
    alert('✓ Speaking session saved! Communication streak updated.');
  };

  const recentLogs = dailyStore.getRecentCommunications(6);
  const totalMins = recentLogs.reduce((sum, log) => sum + log.durationMinutes, 0);

  const categories = ['All', 'DSA & Complexity', 'Core Java & OOP', 'Databases & APIs', 'Behavioral'];
  const filteredPrompts = selectedCategory === 'All' 
    ? CURATED_PROMPTS 
    : CURATED_PROMPTS.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl glass-panel border border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-1.5 border border-emerald-500/20">
            <Mic size={12} className="text-emerald-400" />
            <span>Technical Speaking Studio</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white">Daily Communication & Articulation</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Practice articulating code and architectures aloud in English without freezing in interviews.
          </p>
        </div>

        {/* Quick Stats Strip */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-center">
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Sessions</div>
            <div className="text-sm font-bold text-white">{recentLogs.length}</div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-center">
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Spoken Mins</div>
            <div className="text-sm font-bold text-emerald-400">{totalMins}m</div>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Curated Topic Selector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-2xl space-y-4 border border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen size={16} className="text-sky-400" />
                <span>Today's Speaking Topic</span>
              </h2>
              <button 
                onClick={handlePickRandomPrompt}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors font-medium"
              >
                <RotateCcw size={12} />
                <span>Shuffle</span>
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg transition-all font-medium ${
                    selectedCategory === cat 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Active Topic Card */}
            <div className="p-4 rounded-xl bg-[#090b10] border border-blue-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-medium">
                  {selectedPrompt.category}
                </span>
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Clock size={11} />
                  <span>Target: ~{selectedPrompt.targetDurationSec}s</span>
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white leading-snug">{selectedPrompt.title}</h3>
                <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">{selectedPrompt.question}</p>
              </div>

              {/* Hints / Checklist to Cover */}
              <div className="pt-3 border-t border-white/5 space-y-1.5">
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Key Points to Hit:
                </div>
                {selectedPrompt.keyPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Topic Quick Picker List */}
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              <div className="text-[10px] text-gray-400 uppercase font-semibold">Other Topics in this Category:</div>
              {filteredPrompts.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPrompt(p);
                    setSpeechText('');
                    setReviewResult(null);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors border ${
                    selectedPrompt.id === p.id 
                      ? 'bg-blue-600/20 text-blue-300 border-blue-500/30 font-semibold' 
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border-white/5'
                  }`}
                >
                  <div className="truncate">{p.title}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Speech Recorder & Feedback (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-5 rounded-2xl space-y-4 border border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Volume2 size={16} className="text-emerald-400" />
                <span>Speech Recorder & Transcriber</span>
              </h2>

              {/* Live Timer */}
              <div className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 ${
                isRecording 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' 
                  : 'bg-white/5 text-gray-400 border border-white/5'
              }`}>
                <Clock size={12} />
                <span>{Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>

            {/* Big Record Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
                >
                  <Mic size={18} className="animate-bounce" />
                  <span>Tap to Speak (Start Recording)</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 transition-all animate-pulse active:scale-[0.98]"
                >
                  <MicOff size={18} />
                  <span>Stop Recording (Listening...)</span>
                </button>
              )}

              <button
                onClick={() => { setSpeechText(''); setReviewResult(null); setTimerSeconds(0); }}
                className="py-3 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-300 font-medium transition-colors border border-white/5"
                title="Reset input"
              >
                Clear
              </button>
            </div>

            {/* Live Text Area (Can also be typed) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] text-gray-400 font-medium">
                  {isRecording ? '🎙️ Live Speech Transcription:' : 'Your Narration (Speech-to-text or typed):'}
                </label>
                <span className="text-[11px] text-gray-500">
                  {speechText.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                value={speechText}
                onChange={(e) => setSpeechText(e.target.value)}
                placeholder="Click 'Tap to Speak' and explain the topic out loud... Or type what you spoke about here."
                rows={5}
                className="w-full p-3 rounded-xl bg-[#090b10] border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
              />
            </div>

            {/* Action Buttons: Review & Save */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <button
                onClick={handleReview}
                disabled={!speechText.trim()}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20"
              >
                <Sparkles size={14} className="text-amber-300" />
                <span>Review My Explanation</span>
              </button>

              <button
                onClick={handleSaveSession}
                disabled={!speechText.trim()}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-40 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-white/10"
              >
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>Save to Streak</span>
              </button>
            </div>

            {/* Instant Review & Feedback Card */}
            {reviewResult && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/40 to-indigo-950/30 border border-blue-500/30 space-y-3 mt-3 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Award size={18} className="text-amber-400" />
                    <span className="text-xs font-bold text-white">Delivery Review</span>
                  </div>
                  <div className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-extrabold border border-emerald-500/30">
                    Score: {reviewResult.score} / 10
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center py-1">
                  <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                    <div className="text-[10px] text-gray-400">Word Count</div>
                    <div className="text-xs font-bold text-white">{reviewResult.wordCount}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                    <div className="text-[10px] text-gray-400">Pace</div>
                    <div className="text-xs font-bold text-sky-400">~{reviewResult.wpm} wpm</div>
                  </div>
                  <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                    <div className="text-[10px] text-gray-400">Filler Words</div>
                    <div className={`text-xs font-bold ${reviewResult.fillerCount > 3 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {reviewResult.fillerCount}
                    </div>
                  </div>
                </div>

                {/* What went well */}
                {reviewResult.strengths.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      <span>What Worked Well:</span>
                    </div>
                    {reviewResult.strengths.map((str, idx) => (
                      <p key={idx} className="text-xs text-gray-300 pl-4">• {str}</p>
                    ))}
                  </div>
                )}

                {/* Suggestions for improvement */}
                {reviewResult.improvements.length > 0 && (
                  <div className="space-y-1 pt-1 border-t border-white/5">
                    <div className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                      <ShieldAlert size={12} />
                      <span>Next Time Try This:</span>
                    </div>
                    {reviewResult.improvements.map((imp, idx) => (
                      <p key={idx} className="text-xs text-gray-300 pl-4">• {imp}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Past Speaking History */}
          <div className="glass-panel p-5 rounded-2xl space-y-3 border border-white/10">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare size={14} className="text-purple-400" />
              <span>Recent Speaking Sessions</span>
            </h3>

            {recentLogs.length === 0 ? (
              <p className="text-xs text-gray-500 py-3 text-center">No speaking logs yet. Record your first session above!</p>
            ) : (
              <div className="space-y-2">
                {recentLogs.map(log => (
                  <div key={log.id} className="p-3 rounded-xl bg-[#090b10] border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{log.topic}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{log.date} • {log.durationMinutes}m</span>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{log.notes}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
