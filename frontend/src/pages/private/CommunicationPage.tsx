import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useDailyStore } from '../../stores/dailyStore';
import { useDashboardStore } from '../../stores/dashboardStore';
import { soundService } from '../../services/soundService';
import { 
  Mic, MicOff, Sparkles, CheckCircle2, RotateCcw, Volume2, 
  Clock, ShieldAlert, Award, ArrowRight, MessageSquare, BookOpen, Flame,
  Play, Pause, Download, Trash2, Headphones, Activity, Gauge, CheckSquare
} from 'lucide-react';

interface PromptTopic {
  id: string;
  category: 'DSA & Complexity' | 'Core Java & OOP' | 'System Architecture' | 'Behavioral';
  title: string;
  question: string;
  targetDurationSec: number;
  keyPoints: string[];
}

const CURATED_PROMPTS: PromptTopic[] = [
  // DSA & Complexity
  {
    id: 'dsa-1',
    category: 'DSA & Complexity',
    title: 'Two Sum & Hash Map Lookup',
    question: 'Explain your approach to Two Sum and why a Hash Map achieves O(N) time instead of brute-force O(N²).',
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
    question: 'Why is Binary Search O(log N)? What prerequisite must the search space satisfy?',
    targetDurationSec: 60,
    keyPoints: [
      'Requires monotonic / sorted order',
      'Explain dividing the search space in half at each step (N -> N/2 -> N/4 -> 1)',
      'Compare log₂(1,000,000) ~ 20 operations vs 1,000,000 linear operations'
    ]
  },

  // Core Java & OOP
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
    title: 'HashMap Internal Architecture',
    question: 'Explain how a HashMap stores and retrieves key-value pairs internally in Java 8+.',
    targetDurationSec: 90,
    keyPoints: [
      'Keys are converted to hash codes via hashCode() and mapped to bucket array indices',
      'Collisions are handled using LinkedLists (and balanced Red-Black trees in Java 8+ if chain length > 8)',
      'Why both hashCode() and equals() contracts must be correctly implemented'
    ]
  },
  {
    id: 'java-3',
    category: 'Core Java & OOP',
    title: 'Virtual Threads vs Platform Threads (Java 21)',
    question: 'What are Virtual Threads (Project Loom) in Java 21 and how do they differ from OS platform threads?',
    targetDurationSec: 90,
    keyPoints: [
      'Platform threads map 1:1 to OS kernel threads, consuming ~1MB stack memory each',
      'Virtual threads are lightweight JVM-managed fibers (few KB), allowing millions of concurrent tasks',
      'Ideal for I/O-bound blocking workloads; unmounts from carrier thread during blocking calls'
    ]
  },
  {
    id: 'java-4',
    category: 'Core Java & OOP',
    title: 'Abstract Class vs Interface in Java',
    question: 'When would you use an Abstract Class versus an Interface in modern Java?',
    targetDurationSec: 75,
    keyPoints: [
      'Interface defines a contract ("can-do") with multiple inheritance capability',
      'Abstract Class defines a base identity ("is-a") with shared state, fields, and constructors',
      'Mention default and private methods introduced in recent Java versions'
    ]
  },
  {
    id: 'java-5',
    category: 'Core Java & OOP',
    title: 'Garbage Collection Fundamentals',
    question: 'Explain how Garbage Collection works in Java and what GC roots are.',
    targetDurationSec: 60,
    keyPoints: [
      'Runs in the background on the JVM heap memory',
      'Identifies objects that have no active references from GC roots (threads, static variables, local stack)',
      'Generational hypothesis: Young generation (Eden/Survivor) vs Old generation'
    ]
  },

  // System Architecture
  {
    id: 'sys-1',
    category: 'System Architecture',
    title: 'Database Indexing Trade-offs',
    question: 'What is a B-Tree Database Index? Why does it accelerate SELECT queries but penalize writes?',
    targetDurationSec: 75,
    keyPoints: [
      'Analogy: Like an index in the back of a textbook avoiding a full table scan',
      'Under the hood: Balanced B-Tree structure allowing O(log N) searches',
      'Trade-off: On every INSERT/UPDATE/DELETE, the index tree must also be updated and rebalanced'
    ]
  },
  {
    id: 'sys-2',
    category: 'System Architecture',
    title: 'Kafka Partitioning & Ordering',
    question: 'How does Apache Kafka guarantee message ordering across partitions?',
    targetDurationSec: 90,
    keyPoints: [
      'Kafka guarantees strict ordering ONLY within a single partition, not globally across the entire topic',
      'Messages with the same record key are hashed and routed to the same partition',
      'Consumer groups read from specific partition assignments for deterministic sequential processing'
    ]
  },
  {
    id: 'sys-3',
    category: 'System Architecture',
    title: 'Redis Caching Patterns (Cache-Aside vs Write-Through)',
    question: 'Explain Cache-Aside pattern in Redis and how to mitigate cache stampede (thundering herd).',
    targetDurationSec: 90,
    keyPoints: [
      'Application checks cache first: on hit returns, on miss queries database and populates cache',
      'Cache Stampede: multiple simultaneous requests query DB when a hot key expires',
      'Mitigations: Mutex/distributed lock, probabilistic early expiration (XFetch), or background refresh'
    ]
  },

  // Behavioral
  {
    id: 'beh-1',
    category: 'Behavioral',
    title: 'Explaining a Challenging Production Bug (STAR)',
    question: 'Tell me about a challenging bug or incident you encountered and how you diagnosed and resolved it.',
    targetDurationSec: 90,
    keyPoints: [
      'Use STAR framework: Situation, Task, Action, Result',
      'Focus on how you diagnosed the root cause using logs, APM traces, or thread dumps',
      'Highlight what preventive measure was implemented (unit test, input validation, alerts)'
    ]
  },
  {
    id: 'beh-2',
    category: 'Behavioral',
    title: 'Resolving a Technical Disagreement',
    question: 'Describe a situation where you had a differing technical opinion from a teammate or lead.',
    targetDurationSec: 90,
    keyPoints: [
      'Situation: Two opposing approaches to architecture or library choice',
      'Action: Built a mini benchmark/proof of concept and evaluated with data instead of ego',
      'Result: Aligned on consensus and committed fully to the final decision'
    ]
  }
];

export const CommunicationPage: React.FC = () => {
  const dailyStore = useDailyStore();
  const dashboardStore = useDashboardStore();

  const [selectedPrompt, setSelectedPrompt] = useState<PromptTopic>(CURATED_PROMPTS[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [speechText, setSpeechText] = useState('');
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [micAudioLevel, setMicAudioLevel] = useState<number>(0);

  // Audio Playback & Blob State
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Self-Review & Rubric State
  const [reviewResult, setReviewResult] = useState<{
    score: number;
    wordCount: number;
    wpm: number;
    fillerCount: number;
    fillers: string[];
    strengths: string[];
    improvements: string[];
  } | null>(null);

  const [selfChecks, setSelfChecks] = useState<{
    clearStructure: boolean;
    confidentTone: boolean;
    hitKeyTerms: boolean;
  }>({
    clearStructure: false,
    confidentTone: false,
    hitKeyTerms: false,
  });

  // Refs
  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Check Web Speech API support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
    }
    return () => {
      cleanupAudio();
    };
  }, []);

  const cleanupAudio = () => {
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  };

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

  // Audio level visualizer loop
  const startVolumeAnalyser = (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.6;
      source.connect(analyser);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setMicAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
        animFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();
    } catch (e) {
      console.warn('Audio analyser could not start:', e);
    }
  };

  const startRecording = async () => {
    setReviewResult(null);
    setAudioUrl(null);
    setAudioBlob(null);
    setPlaybackTime(0);
    setIsPlaying(false);
    audioChunksRef.current = [];
    soundService.playCheckSound();

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      audioStreamRef.current = stream;
    } catch (err: any) {
      console.error('Microphone error:', err);
      alert('Could not access microphone. Please enable microphone permissions in your browser or type your notes.');
      return;
    }

    // Start volume analyzer
    startVolumeAnalyser(stream);

    // Setup MediaRecorder
    try {
      let mimeType = 'audio/webm';
      if (typeof MediaRecorder.isTypeSupported === 'function') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          mimeType = 'audio/ogg';
        }
      }

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      };

      recorder.start(250);
      mediaRecorderRef.current = recorder;
    } catch (e) {
      console.warn('MediaRecorder error:', e);
    }

    // Start Web Speech API Transcription if supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
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
          console.warn('Speech recognition event error:', event.error);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.warn('SpeechRecognition failed to start:', err);
      }
    }

    setIsRecording(true);
    setTimerSeconds(0);
  };

  const stopRecording = () => {
    // Stop MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    // Stop SpeechRecognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    cleanupAudio();
    setIsRecording(false);
    setMicAudioLevel(0);

    // Auto-trigger evaluation if there's text
    setTimeout(() => {
      if (speechText.trim()) {
        evaluateSpeech(speechText);
      }
    }, 400);
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
    setAudioUrl(null);
    setAudioBlob(null);
    setSelfChecks({ clearStructure: false, confidentTone: false, hitKeyTerms: false });
  };

  // Playback handlers
  const togglePlayAudio = () => {
    if (!audioPlayerRef.current) return;
    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setPlaybackTime(time);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.currentTime = time;
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.playbackRate = speed;
    }
  };

  const handleDownloadAudio = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    const topicSlug = selectedPrompt.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    a.download = `interview-articulation-${topicSlug}-${new Date().toISOString().split('T')[0]}.webm`;
    a.click();
  };

  // Rubric evaluation
  const evaluateSpeech = (textToEvaluate: string) => {
    const words = textToEvaluate.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const durationMins = Math.max(timerSeconds / 60, wordCount / 120);
    const wpm = Math.round(wordCount / (durationMins || 0.5));

    // Filler word scan
    const fillerWords = ['um', 'uh', 'like', 'actually', 'basically', 'sort of', 'you know', 'kinda', 'literally', 'so yeah'];
    const detectedFillers: string[] = [];
    words.forEach(w => {
      const clean = w.toLowerCase().replace(/[^a-z]/g, '');
      if (fillerWords.includes(clean)) {
        detectedFillers.push(clean);
      }
    });

    const lowerText = textToEvaluate.toLowerCase();
    const strengths: string[] = [];
    const improvements: string[] = [];
    let score = 5;

    // Check 1: Length and detail
    if (wordCount >= 45) {
      score += 2;
      strengths.push('Comprehensive explanation length with sufficient technical context.');
    } else if (wordCount >= 25) {
      score += 1;
      strengths.push('Concise answer, but consider elaborating on trade-offs or alternatives.');
    } else {
      improvements.push('A bit too brief. Aim for at least 45-60 words to fully explain the architecture.');
    }

    // Check 2: Key concept matching
    const promptKeywords = selectedPrompt.title.toLowerCase().split(' ').filter(k => k.length > 3);
    const matchedKeywords = promptKeywords.filter(k => lowerText.includes(k));
    if (matchedKeywords.length > 0) {
      score += 1.5;
      strengths.push(`Clearly referenced core terminology (${matchedKeywords.join(', ')}).`);
    } else {
      improvements.push('State the primary terminology upfront in your opening sentence.');
    }

    // Check 3: Complexity & engineering depth
    if (
      lowerText.includes('time') || 
      lowerText.includes('space') || 
      lowerText.includes('o(') || 
      lowerText.includes('trade-off') || 
      lowerText.includes('latency') || 
      lowerText.includes('memory') || 
      lowerText.includes('because')
    ) {
      score += 1.5;
      strengths.push('Strong engineering reasoning—grounded arguments in time/space complexity or system trade-offs.');
    } else {
      improvements.push('Mention time/space complexity, memory footprint, or architectural trade-offs.');
    }

    // Check 4: Pace (Optimal: 120 - 165 WPM)
    if (wpm >= 115 && wpm <= 165) {
      strengths.push(`Measured, articulate pace (~${wpm} WPM). Easy for an interviewer to follow.`);
    } else if (wpm > 170) {
      improvements.push(`Pace is fast (~${wpm} WPM). Practice intentional 1-second pauses between points.`);
    }

    // Check 5: Filler word penalty
    if (detectedFillers.length > 4) {
      score = Math.max(4, score - 1);
      improvements.push(`Detected ${detectedFillers.length} filler words (${detectedFillers.slice(0, 3).join(', ')}...). Pause silently instead of using verbal crutches.`);
    } else if (detectedFillers.length === 0 && wordCount > 30) {
      strengths.push('Zero filler words detected—crisp, executive delivery!');
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
    if (!speechText.trim() && !audioBlob) return;
    const duration = Math.max(1, Math.round(timerSeconds / 60)) || 1;
    dailyStore.saveCommunication({
      date: new Date().toISOString().split('T')[0],
      type: 'SPEAKING',
      topic: selectedPrompt.title,
      durationMinutes: duration,
      notes: speechText || `Recorded ${timerSeconds}s audio articulation for: ${selectedPrompt.title}`,
      rating: reviewResult ? Math.min(5, Math.max(1, Math.round(reviewResult.score / 2))) : 4,
      wpm: reviewResult?.wpm,
      audioDurationSec: timerSeconds,
      score: reviewResult?.score,
      fillersCount: reviewResult?.fillerCount,
    });

    dashboardStore.updateStreak('communication');
    soundService.playSuccessChime();
    alert('✓ Audio session & evaluation saved! Communication streak updated.');
  };

  const recentLogs = dailyStore.getRecentCommunications(6);
  const totalMins = recentLogs.reduce((sum, log) => sum + log.durationMinutes, 0);

  const categories = ['All', 'DSA & Complexity', 'Core Java & OOP', 'System Architecture', 'Behavioral'];
  const filteredPrompts = selectedCategory === 'All' 
    ? CURATED_PROMPTS 
    : CURATED_PROMPTS.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-1 sm:px-0">
      {/* Hidden audio player for playback */}
      {audioUrl && (
        <audio
          ref={audioPlayerRef}
          src={audioUrl}
          onTimeUpdate={() => {
            if (audioPlayerRef.current) {
              setPlaybackTime(audioPlayerRef.current.currentTime);
            }
          }}
          onLoadedMetadata={() => {
            if (audioPlayerRef.current) {
              setPlaybackDuration(audioPlayerRef.current.duration || timerSeconds);
            }
          }}
          onEnded={() => {
            setIsPlaying(false);
            setPlaybackTime(0);
          }}
        />
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl glass-panel border border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-1.5 border border-emerald-500/20">
            <Mic size={12} className="text-emerald-400" />
            <span>Interactive Speaking Studio</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white">Daily Communication & Vocal Review</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Record your voice, listen back to self-audit tone & cadence, and eliminate freeze responses in Tier-1 interviews.
          </p>
        </div>

        {/* Quick Stats Strip */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-center min-w-[70px]">
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Sessions</div>
            <div className="text-sm font-bold text-white">{recentLogs.length}</div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-center min-w-[70px]">
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
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors font-medium p-1"
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

              {/* Hints / Key Points to Hit */}
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
              <div className="text-[10px] text-gray-400 uppercase font-semibold">Other Prompts in Category:</div>
              {filteredPrompts.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPrompt(p);
                    setSpeechText('');
                    setReviewResult(null);
                    setAudioUrl(null);
                    setAudioBlob(null);
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

        {/* Right Column: Live Audio Recorder & Playback (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-5 rounded-2xl space-y-4 border border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Volume2 size={16} className="text-emerald-400" />
                <span>Voice Recorder & Speech Analyzer</span>
              </h2>

              {/* Live Timer */}
              <div className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 ${
                isRecording 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' 
                  : 'bg-white/5 text-gray-400 border border-white/5'
              }`}>
                <Clock size={12} />
                <span>{Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}</span>
                <span className="text-[10px] text-gray-500">/ ~{selectedPrompt.targetDurationSec}s</span>
              </div>
            </div>

            {/* Live Audio Visualizer Bar when Recording */}
            {isRecording && (
              <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-red-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span>Microphone Active (Speaking...)</span>
                  </div>
                  <span className="text-[11px] font-mono text-gray-400">Level: {micAudioLevel}%</span>
                </div>
                
                {/* 16-Segment Animated Level Meter */}
                <div className="flex items-center gap-1 h-3.5 px-1 bg-black/40 rounded-lg overflow-hidden">
                  {Array.from({ length: 16 }).map((_, i) => {
                    const threshold = (i / 16) * 100;
                    const isActive = micAudioLevel >= threshold;
                    return (
                      <div
                        key={i}
                        className={`flex-1 h-full rounded-sm transition-all duration-75 ${
                          isActive
                            ? i > 12 
                              ? 'bg-rose-500 shadow-sm shadow-rose-500/50' 
                              : i > 8 
                              ? 'bg-amber-400 shadow-sm shadow-amber-400/50' 
                              : 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                            : 'bg-white/5'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Record / Stop Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
                >
                  <Mic size={18} className="animate-bounce" />
                  <span>Tap to Record Answer (Microphone)</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 transition-all animate-pulse active:scale-[0.98]"
                >
                  <MicOff size={18} />
                  <span>Finish & Stop Recording</span>
                </button>
              )}

              <button
                onClick={() => { 
                  setSpeechText(''); 
                  setReviewResult(null); 
                  setTimerSeconds(0); 
                  setAudioUrl(null); 
                  setAudioBlob(null);
                  setSelfChecks({ clearStructure: false, confidentTone: false, hitKeyTerms: false });
                }}
                className="py-3 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-300 font-medium transition-colors border border-white/5 text-center"
                title="Reset input"
              >
                Reset
              </button>
            </div>

            {/* Audio Playback Deck (When Recording is Complete) */}
            {audioUrl && (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Headphones size={16} className="text-emerald-400" />
                    <span className="text-xs font-bold text-white">Voice Playback & Tone Audit</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {/* Speed Selector */}
                    {[1, 1.25, 1.5].map(spd => (
                      <button
                        key={spd}
                        onClick={() => handleSpeedChange(spd)}
                        className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold transition-colors ${
                          playbackSpeed === spd 
                            ? 'bg-emerald-500 text-black' 
                            : 'bg-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scrubber & Controls */}
                <div className="flex flex-col gap-2 pt-1">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlayAudio}
                      className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center transition-transform active:scale-95 shadow-md shadow-emerald-500/30 shrink-0"
                    >
                      {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                    </button>

                    {/* Timeline Scrubber */}
                    <div className="flex-1 space-y-1">
                      <input
                        type="range"
                        min="0"
                        max={playbackDuration || timerSeconds || 1}
                        step="0.1"
                        value={playbackTime}
                        onChange={handleSeek}
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                      />
                      <div className="flex justify-between text-[10px] font-mono text-gray-400">
                        <span>{Math.floor(playbackTime / 60)}:{(Math.floor(playbackTime) % 60).toString().padStart(2, '0')}</span>
                        <span>{Math.floor((playbackDuration || timerSeconds) / 60)}:{(Math.floor(playbackDuration || timerSeconds) % 60).toString().padStart(2, '0')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Audio Actions Strip */}
                  <div className="flex items-center justify-between pt-1 text-xs border-t border-white/5">
                    <button
                      onClick={handleDownloadAudio}
                      className="text-gray-400 hover:text-white flex items-center gap-1 text-[11px] transition-colors"
                    >
                      <Download size={12} />
                      <span>Download Clip (.webm)</span>
                    </button>

                    <span className="text-[11px] text-emerald-400 font-medium">
                      ✓ Voice captured ({timerSeconds}s)
                    </span>
                  </div>
                </div>

                {/* Self-Listening Reflection Rubric */}
                <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-2">
                  <div className="text-[11px] font-semibold text-gray-300">
                    Self-Listen Checklist (Did you notice while playing back?):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selfChecks.clearStructure}
                        onChange={(e) => setSelfChecks(prev => ({ ...prev, clearStructure: e.target.checked }))}
                        className="rounded border-gray-600 text-emerald-500 focus:ring-0 bg-white/5"
                      />
                      <span>Clear conclusion first</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selfChecks.confidentTone}
                        onChange={(e) => setSelfChecks(prev => ({ ...prev, confidentTone: e.target.checked }))}
                        className="rounded border-gray-600 text-emerald-500 focus:ring-0 bg-white/5"
                      />
                      <span>No trailing uptalk</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selfChecks.hitKeyTerms}
                        onChange={(e) => setSelfChecks(prev => ({ ...prev, hitKeyTerms: e.target.checked }))}
                        className="rounded border-gray-600 text-emerald-500 focus:ring-0 bg-white/5"
                      />
                      <span>Hit key tech terms</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Transcript Text Area */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] text-gray-400 font-medium">
                  {isRecording ? '🎙️ Live Speech Transcription:' : 'Your Articulation Transcript (Live-transcribed or typed):'}
                </label>
                <span className="text-[11px] text-gray-500">
                  {speechText.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                value={speechText}
                onChange={(e) => setSpeechText(e.target.value)}
                placeholder="Tap 'Tap to Record Answer' and articulate out loud... Or type your technical notes here if you're in a quiet room."
                rows={4}
                className="w-full p-3 rounded-xl bg-[#090b10] border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
              />
            </div>

            {/* Action Buttons: Evaluate & Save */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
              <button
                onClick={() => evaluateSpeech(speechText)}
                disabled={!speechText.trim()}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20"
              >
                <Sparkles size={14} className="text-amber-300" />
                <span>Evaluate Cadence & Rubric</span>
              </button>

              <button
                onClick={handleSaveSession}
                disabled={!speechText.trim() && !audioBlob}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-40 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-white/10"
              >
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>Save to Streak</span>
              </button>
            </div>

            {/* Review & Feedback Card */}
            {reviewResult && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/40 to-indigo-950/30 border border-blue-500/30 space-y-3 mt-3 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Award size={18} className="text-amber-400" />
                    <span className="text-xs font-bold text-white">Delivery Rubric Analysis</span>
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
                      <span>Actionable Next Steps:</span>
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
              <p className="text-xs text-gray-500 py-3 text-center">No speaking logs yet. Record your first answer above!</p>
            ) : (
              <div className="space-y-2">
                {recentLogs.map(log => (
                  <div key={log.id} className="p-3 rounded-xl bg-[#090b10] border border-white/5 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-xs font-bold text-white">{log.topic}</span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {log.date} • {log.durationMinutes}m {log.wpm ? `• ~${log.wpm} WPM` : ''}
                      </span>
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
