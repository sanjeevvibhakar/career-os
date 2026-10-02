import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Send, Mic, MicOff, Volume2, VolumeX, Key, 
  RotateCcw, Check, Bot, User, Code, Brain, Building2, 
  Target, ChevronRight, Copy, HelpCircle, X
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { 
  chatWithAi, getAiConfig, setAiConfig 
} from '../../services/aiService';
import type { AiCoachMode, AiMessage, AiConfig } from '../../services/aiService';
import { useDsaStore } from '../../stores/dsaStore';
import { soundService } from '../../services/soundService';

interface AiCoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AiCoachMode;
  initialProblem?: any;
}

const SYSTEM_DESIGN_TOPICS = [
  'Distributed Rate Limiter (Token Bucket / Redis)',
  'URL Shortener & Consistent Hashing',
  'Real-Time Chat with WebSockets & Kafka',
  'Payment Gateway Idempotency & Saga Pattern',
  'Uber Geospatial Driver Dispatch (Quadtree / H3)',
  'High-Throughput E-Commerce Flash Sale Architecture',
];

export const AiCoachModal: React.FC<AiCoachModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'DSA',
  initialProblem,
}) => {
  const dsaStore = useDsaStore();
  const [mode, setMode] = useState<AiCoachMode>(initialMode);
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [aiConfig, setLocalAiConfig] = useState<AiConfig>(getAiConfig());
  const [configSaved, setConfigSaved] = useState(false);

  // Selected contexts
  const [selectedProblemId, setSelectedProblemId] = useState<number>(
    initialProblem?.id || dsaStore.problems[0]?.id || 1
  );
  const [selectedSystemTopic, setSelectedSystemTopic] = useState<string>(SYSTEM_DESIGN_TOPICS[0]);
  
  // Voice Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const [speechSynthesisActive, setSpeechSynthesisActive] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedProblem = dsaStore.problems.find(p => p.id === selectedProblemId) || initialProblem;

  // Initialize opening message based on mode
  useEffect(() => {
    if (!isOpen) return;
    initConversation(mode);
  }, [isOpen, mode, selectedProblemId, selectedSystemTopic]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const initConversation = (selectedMode: AiCoachMode) => {
    let greeting = '';
    if (selectedMode === 'DSA') {
      const pName = selectedProblem?.name || 'Two Sum';
      greeting = `👋 Welcome to the **DSA Mock Examination Loop**!

I am **MentorAI**, your Bar-Raiser Interviewer. Today's problem is **${pName}** (${selectedProblem?.difficulty || 'Medium'}).

**Interview Question**:
Can you state your initial thought process, the brute-force baseline, and how we can optimize time complexity? Tell me your approach before writing any code.`;
    } else if (selectedMode === 'SYSTEM_DESIGN') {
      greeting = `🏛️ Welcome to the **Tier-1 System Design Bar-Raiser Round**!

Topic: **${selectedSystemTopic}**.

I am evaluating your scalability, failure-handling, and back-of-the-envelope estimation abilities. Let's start with **Scope & Functional Requirements**. What are the core user flows we must support, and what are our non-functional targets (P99 latency, availability)?`;
    } else {
      greeting = `⚡ **Strategic Accountability Briefing**:

I am your Staff Engineer Career Coach. Let's evaluate your daily momentum, target bottlenecks, and roadmap progression toward a **Tier-1 Product Engineer (2027)** offer.

What topic or challenge are you working on right now? Ask me anything about system design trade-offs, concurrency bugs, or algorithmic intuition.`;
    }

    setMessages([{ role: 'assistant', content: greeting }]);
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const newMessages: AiMessage[] = [...messages, { role: 'user', content: text.trim() }];
    setMessages(newMessages);
    setInputText('');
    setLoading(true);

    try {
      soundService.playCheckSound();
      const reply = await chatWithAi(newMessages, mode, {
        problemName: selectedProblem?.name,
        difficulty: selectedProblem?.difficulty,
        topicName: selectedProblem?.pattern,
        systemTopic: selectedSystemTopic,
      });

      setMessages([...newMessages, { role: 'assistant', content: reply }]);

      // If speech synthesis is desired
      if (speechSynthesisActive && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const cleanText = reply.replace(/[*#`_]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e: any) {
      setMessages([
        ...newMessages, 
        { role: 'assistant', content: `⚠️ Error communicating with coach: ${e.message || 'Request failed'}` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Web Speech API Voice Input
  const handleToggleVoice = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(prev => prev ? `${prev} ${transcript}` : transcript);
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setAiConfig(aiConfig);
    setConfigSaved(true);
    setTimeout(() => {
      setConfigSaved(false);
      setShowConfig(false);
    }, 1500);
  };

  const quickPromptChips: { [key in AiCoachMode]: string[] } = {
    DSA: [
      'Give me Hint 1 (Intuition)',
      'What are the edge cases for this?',
      'Roast my time & space complexity',
      'What is the standard optimal pattern?',
    ],
    SYSTEM_DESIGN: [
      'Calculate Back-of-the-Envelope QPS & Storage for 50M DAU',
      'What if the Redis cache fails?',
      'How to prevent cache stampede?',
      'Compare Saga Pattern vs 2PC for this',
    ],
    DAILY_COACH: [
      'Analyze my current bottlenecks',
      'Give me today\'s tactical mission',
      'How to explain trade-offs in behavioral rounds?',
      'Test my Java Concurrency knowledge',
    ],
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="MentorAI — Tier-1 Career & Interview Examiner">
      <div className="flex flex-col h-[75vh] max-h-[750px] -mx-4 -my-4 sm:-mx-6 sm:-my-6 overflow-hidden bg-[#0d0f18]">
        
        {/* 1. Mode Bar & Config Header */}
        <div className="p-3 sm:p-4 border-b border-white/10 bg-white/[0.02] flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setMode('DSA')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                mode === 'DSA'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Code size={13} />
              <span>DSA Mock</span>
            </button>
            <button
              onClick={() => setMode('SYSTEM_DESIGN')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                mode === 'SYSTEM_DESIGN'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Building2 size={13} />
              <span>System Design</span>
            </button>
            <button
              onClick={() => setMode('DAILY_COACH')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                mode === 'DAILY_COACH'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Target size={13} />
              <span>Daily Coach</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSpeechSynthesisActive(!speechSynthesisActive)}
              className={`p-2 rounded-xl border transition-colors ${
                speechSynthesisActive 
                  ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' 
                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
              }`}
              title={speechSynthesisActive ? 'Audio Response Enabled (Click to Mute)' : 'Click to Enable Spoken Responses'}
            >
              {speechSynthesisActive ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>

            <button
              onClick={() => setShowConfig(!showConfig)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-colors ${
                aiConfig.apiKey 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
              title="Configure Gemini or OpenAI API Key"
            >
              <Key size={13} />
              <span className="hidden sm:inline">{aiConfig.apiKey ? 'Gemini Live' : 'Offline / Setup Key'}</span>
            </button>

            <button
              onClick={() => initConversation(mode)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Restart Conversation"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* 2. Topic / Context Selector Ribbon */}
        {mode === 'DSA' && (
          <div className="px-3 sm:px-4 py-2 border-b border-white/5 bg-blue-950/20 flex items-center justify-between gap-2 text-xs font-mono shrink-0">
            <div className="flex items-center gap-2 truncate">
              <span className="text-blue-400 font-bold">Examining Problem:</span>
              <select
                value={selectedProblemId}
                onChange={(e) => setSelectedProblemId(Number(e.target.value))}
                className="bg-black/60 text-white rounded-lg px-2.5 py-1 border border-white/10 text-xs focus:outline-none focus:border-blue-500 max-w-[220px] sm:max-w-xs"
              >
                {dsaStore.problems.slice(0, 30).map(p => (
                  <option key={p.id} value={p.id}>{p.id}. {p.name} ({p.difficulty})</option>
                ))}
              </select>
            </div>
            <span className="text-gray-400 text-[11px] hidden sm:inline">
              Pattern: <strong className="text-white">{selectedProblem?.pattern}</strong>
            </span>
          </div>
        )}

        {mode === 'SYSTEM_DESIGN' && (
          <div className="px-3 sm:px-4 py-2 border-b border-white/5 bg-purple-950/20 flex items-center justify-between gap-2 text-xs font-mono shrink-0">
            <div className="flex items-center gap-2 truncate">
              <span className="text-purple-400 font-bold">Design Scenario:</span>
              <select
                value={selectedSystemTopic}
                onChange={(e) => setSelectedSystemTopic(e.target.value)}
                className="bg-black/60 text-white rounded-lg px-2.5 py-1 border border-white/10 text-xs focus:outline-none focus:border-purple-500 max-w-[260px] sm:max-w-md"
              >
                {SYSTEM_DESIGN_TOPICS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* 3. API Key Config Popover (Conditional) */}
        {showConfig && (
          <div className="p-4 bg-black/90 border-b border-white/15 animate-fade-in text-xs space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white font-mono flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-400" />
                Connect Google Gemini API (Free Tier)
              </span>
              <button onClick={() => setShowConfig(false)} className="text-gray-400 hover:text-white">
                <X size={15} />
              </button>
            </div>
            <p className="text-gray-400 leading-relaxed text-[11px]">
              MentorAI runs in <strong>Offline Heuristic Mode</strong> by default. To unlock live LLM reasoning, paste your free Google Gemini API key below (Get a free key in 30 seconds at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-400 underline font-semibold">Google AI Studio</a> with no credit card required).
            </p>
            <form onSubmit={handleSaveConfig} className="flex flex-col sm:flex-row gap-2">
              <input
                type="password"
                placeholder="AIzaSy... (Gemini API Key)"
                value={aiConfig.apiKey}
                onChange={(e) => setLocalAiConfig({ ...aiConfig, apiKey: e.target.value })}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-xs flex-1 focus:outline-none focus:border-blue-500"
              />
              <select
                value={aiConfig.model}
                onChange={(e) => setLocalAiConfig({ ...aiConfig, model: e.target.value })}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none"
              >
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fastest / Recommended)</option>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
              </select>
              <Button variant="primary" size="sm" type="submit">
                {configSaved ? '✓ Saved!' : 'Save Key'}
              </Button>
            </form>
          </div>
        )}

        {/* 4. Chat Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 font-sans text-sm hide-scrollbar">
          {messages.map((m, idx) => (
            <div 
              key={idx}
              className={`flex gap-3 max-w-3xl ${m.role === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-600/20 border border-blue-400/30">
                  <Bot size={16} />
                </div>
              )}

              <div className={`p-3.5 sm:p-4 rounded-2xl leading-relaxed text-xs sm:text-sm border ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none border-blue-500 shadow-sm'
                  : 'glass-panel text-gray-200 rounded-tl-none border-white/10'
              }`}>
                <div className="whitespace-pre-wrap font-sans">
                  {m.content}
                </div>
              </div>

              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-gray-300 shrink-0 border border-white/10">
                  <User size={15} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 max-w-xl mr-auto items-center text-xs text-blue-400 font-mono">
              <div className="w-8 h-8 rounded-xl bg-blue-600/30 flex items-center justify-center border border-blue-500/30">
                <Bot size={16} className="animate-pulse" />
              </div>
              <div className="p-3 rounded-2xl glass-panel border border-white/10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                <span>MentorAI is analyzing your approach...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 5. Quick Prompt Chips */}
        <div className="px-3 sm:px-4 py-2 border-t border-white/5 bg-black/40 flex items-center gap-1.5 overflow-x-auto hide-scrollbar shrink-0">
          <span className="text-[10px] text-gray-500 font-mono shrink-0 uppercase tracking-wider">Quick Prompts:</span>
          {quickPromptChips[mode].map((chip) => (
            <button
              key={chip}
              onClick={() => handleSend(chip)}
              disabled={loading}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-[11px] font-mono transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* 6. Message Input & Voice Controls */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-white/[0.02] shrink-0">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`p-2.5 rounded-xl border transition-all ${
                isListening 
                  ? 'bg-rose-600 text-white border-rose-500 animate-pulse' 
                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
              }`}
              title={isListening ? 'Listening... (Click to stop)' : 'Speak your answer (Voice Input)'}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            <input
              type="text"
              placeholder={
                mode === 'DSA' 
                  ? 'Explain your approach, brute force, or time complexity...' 
                  : mode === 'SYSTEM_DESIGN' 
                    ? 'State requirements, QPS calculations, or architecture trade-offs...' 
                    : 'Ask about career strategy, concurrency, or interview roadblocks...'
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />

            <Button 
              variant="primary" 
              size="md" 
              type="submit" 
              disabled={loading || !inputText.trim()}
              className="px-4"
            >
              <Send size={15} />
            </Button>
          </form>
        </div>

      </div>
    </Modal>
  );
};
