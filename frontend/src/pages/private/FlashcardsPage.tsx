import React, { useState, useMemo } from 'react';
import { 
  Sparkles, CheckCircle, RotateCw, ChevronLeft, ChevronRight, 
  Brain, Layers, BookOpen, Zap, Award, Flame, Filter, Eye, RefreshCw
} from 'lucide-react';
import { useFlashcardStore } from '../../stores/flashcardStore';
import type { FlashcardRating } from '../../stores/flashcardStore';
import { soundService } from '../../services/soundService';

export const FlashcardsPage: React.FC = () => {
  const { cards, reviewStates, recordReview, getMasteredCount, getDueCardsCount, resetProgress } = useFlashcardStore();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [onlyDue, setOnlyDue] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  // Filtered Cards
  const filteredCards = useMemo(() => {
    let result = cards;
    if (selectedCategory !== 'ALL') {
      result = result.filter(c => c.category === selectedCategory);
    }
    if (onlyDue) {
      result = result.filter(c => {
        const s = reviewStates[c.id];
        if (!s) return true;
        return s.nextReviewDate <= todayStr;
      });
    }
    return result;
  }, [cards, selectedCategory, onlyDue, reviewStates, todayStr]);

  const currentCard = filteredCards[currentIndex] || filteredCards[0];
  const totalInFilter = filteredCards.length;

  const currentCardState = currentCard ? reviewStates[currentCard.id] : undefined;
  const masteredCount = getMasteredCount();
  const dueCount = getDueCardsCount();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    soundService.playCheckSound();
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % Math.max(1, totalInFilter));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + totalInFilter) % Math.max(1, totalInFilter));
  };

  const handleRate = (rating: FlashcardRating) => {
    if (!currentCard) return;
    recordReview(currentCard.id, rating);
    soundService.playCheckSound();

    // Advance to next card smoothly
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % Math.max(1, totalInFilter));
    }, 200);
  };

  const categories = [
    { id: 'ALL', label: 'All Cards' },
    { id: 'JAVA_CONCURRENCY', label: 'Java 21 Concurrency' },
    { id: 'DISTRIBUTED_SYSTEMS', label: 'Distributed Systems' },
    { id: 'DATABASE_INTERNALS', label: 'DB Internals' },
    { id: 'SPRING_BOOT', label: 'Spring Boot 3' },
    { id: 'DSA_PATTERNS', label: 'DSA Patterns' },
  ];

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-12 animate-fade-in font-sans">
      
      {/* 1. Header Bar */}
      <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <Brain size={18} />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Pocket Flashcards & Active Recall
            </h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)] font-mono mt-1">
            Fast 3-minute spaced repetition drills for your commute or phone (Moto G 35)
          </p>
        </div>

        {/* Telemetry Stats */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="p-2 px-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
            <div className="text-xs font-bold text-purple-300 font-mono">{masteredCount}</div>
            <div className="text-[10px] text-gray-400 font-mono">Mastered</div>
          </div>
          <div className="p-2 px-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
            <div className="text-xs font-bold text-amber-300 font-mono">{dueCount}</div>
            <div className="text-[10px] text-gray-400 font-mono">Due Today</div>
          </div>
        </div>
      </div>

      {/* 2. Category Filter Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCategory(cat.id); setCurrentIndex(0); setIsFlipped(false); }}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
              selectedCategory === cat.id
                ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}

        <button
          onClick={() => { setOnlyDue(!onlyDue); setCurrentIndex(0); setIsFlipped(false); }}
          className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ml-auto ${
            onlyDue
              ? 'bg-amber-600 text-white border-amber-500'
              : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
          }`}
        >
          {onlyDue ? '✓ Showing Due Only' : 'Due Today Filter'}
        </button>
      </div>

      {/* 3. Main Flashcard Interactive Area */}
      {totalInFilter === 0 ? (
        <div className="p-12 text-center glass-panel rounded-2xl border border-white/10 space-y-3">
          <CheckCircle size={32} className="text-emerald-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">All caught up!</h3>
          <p className="text-xs text-gray-400">No cards due for review in this category right now.</p>
          <button
            onClick={() => { setOnlyDue(false); setSelectedCategory('ALL'); }}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
          >
            Review All Cards
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Card Navigation & Counter */}
          <div className="flex items-center justify-between text-xs font-mono text-gray-400 px-1">
            <span className="flex items-center gap-1.5">
              <span>Card</span>
              <strong className="text-white">{currentIndex + 1}</strong>
              <span>of</span>
              <strong className="text-white">{totalInFilter}</strong>
              {currentCardState && (
                <span className="ml-2 px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[10px]">
                  Streak: {currentCardState.streak}🔥
                </span>
              )}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors"
                title="Previous Card"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors"
                title="Next Card"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Flashcard Body */}
          <div 
            onClick={handleFlip}
            className={`min-h-[320px] sm:min-h-[360px] p-6 sm:p-8 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden backdrop-blur-xl shadow-2xl select-none ${
              isFlipped
                ? 'bg-gradient-to-br from-[#121629] via-[#10121d] to-[#0a0d18] border-purple-500/40 shadow-purple-500/10'
                : 'glass-panel border-white/15 hover:border-blue-500/40 hover:shadow-blue-500/5'
            }`}
          >
            {/* Ambient Top Glow */}
            <div className={`absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent ${
              isFlipped ? 'via-purple-400' : 'via-blue-400'
            } to-transparent opacity-80`} />

            {/* Top Category Badge & Flip Indicator */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-sky-400">
                {currentCard.categoryLabel}
              </span>
              <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1">
                <RotateCw size={12} className={isFlipped ? 'rotate-180 transition-transform' : ''} />
                <span>{isFlipped ? 'Answer' : 'Tap to Flip'}</span>
              </span>
            </div>

            {/* Content: Question (Front) or Answer (Back) */}
            <div className="py-6 flex-1 flex flex-col justify-center">
              {!isFlipped ? (
                <div className="space-y-4">
                  <h2 className="text-lg sm:text-2xl font-black text-white leading-snug tracking-tight">
                    {currentCard.question}
                  </h2>
                  <p className="text-xs text-gray-400 font-mono">
                    💡 Test active recall: Can you explain the architectural mechanism out loud?
                  </p>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in text-left">
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-normal">
                    {currentCard.answer}
                  </p>

                  {/* Key Takeaway Box */}
                  <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200 font-mono leading-relaxed">
                    <strong className="text-purple-300 block mb-0.5">⚡ Key Interview Takeaway:</strong>
                    {currentCard.keyTakeaway}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Status / Hint */}
            <div className="text-[11px] text-gray-500 font-mono flex items-center justify-between border-t border-white/5 pt-3">
              <span>{isFlipped ? 'Rate retention below to space repetition' : 'Click anywhere on card to reveal answer'}</span>
              <span>ID: {currentCard.id}</span>
            </div>
          </div>

          {/* 4. Spaced Repetition Rating Toolbar */}
          {isFlipped && (
            <div className="p-3 rounded-2xl glass-panel border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 animate-fade-in">
              <button
                onClick={(e) => { e.stopPropagation(); handleRate('AGAIN'); }}
                className="p-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-bold text-xs flex flex-col items-center transition-all active:scale-95"
              >
                <span>Again</span>
                <span className="text-[10px] text-rose-400 font-mono font-normal">Today (+0d)</span>
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); handleRate('HARD'); }}
                className="p-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-bold text-xs flex flex-col items-center transition-all active:scale-95"
              >
                <span>Hard</span>
                <span className="text-[10px] text-amber-400 font-mono font-normal">2 Days</span>
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); handleRate('GOOD'); }}
                className="p-3 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 font-bold text-xs flex flex-col items-center transition-all active:scale-95"
              >
                <span>Good</span>
                <span className="text-[10px] text-blue-400 font-mono font-normal">5 Days</span>
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); handleRate('EASY'); }}
                className="p-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-bold text-xs flex flex-col items-center transition-all active:scale-95"
              >
                <span>Easy</span>
                <span className="text-[10px] text-emerald-400 font-mono font-normal">14 Days</span>
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
