import React, { useState, useMemo } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { useDashboardStore } from '../../stores/dashboardStore';
import { useDsaStore } from '../../stores/dsaStore';
import { useSyllabusStore } from '../../stores/syllabusStore';
import { useDailyStore } from '../../stores/dailyStore';
import { soundService } from '../../services/soundService';
import { generateWeeklyReviewSummary } from '../../services/aiService';
import { 
  Sparkles, CheckCircle2, ChevronLeft, ChevronRight, Trophy, Flame, 
  Brain, Dumbbell, BookOpen, Mic, Calendar, TrendingUp, History, 
  Award, ArrowRight, Wand2
} from 'lucide-react';

export const WeeklyReviewPage: React.FC = () => {
  const dashboardStore = useDashboardStore();
  const dsaStore = useDsaStore();
  const syllabusStore = useSyllabusStore();
  const dailyStore = useDailyStore();

  // Week calculation helpers (Monday to Sunday)
  const getMonday = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const mon = new Date(date.setDate(diff));
    return mon.toISOString().split('T')[0];
  };

  const getSunday = (mondayStr: string) => {
    const d = new Date(mondayStr);
    d.setDate(d.getDate() + 6);
    return d.toISOString().split('T')[0];
  };

  const currentMonday = getMonday(new Date());
  const [selectedWeekStart, setSelectedWeekStart] = useState<string>(currentMonday);
  const selectedWeekEnd = getSunday(selectedWeekStart);

  const isCurrentWeek = selectedWeekStart === currentMonday;

  // Previous & Next Week navigation
  const handlePrevWeek = () => {
    const d = new Date(selectedWeekStart);
    d.setDate(d.getDate() - 7);
    setSelectedWeekStart(getMonday(d));
  };

  const handleNextWeek = () => {
    const d = new Date(selectedWeekStart);
    d.setDate(d.getDate() + 7);
    setSelectedWeekStart(getMonday(d));
  };

  const existingReview = dashboardStore.getReviewByWeek(selectedWeekStart);

  // 1. Quantitative Computations for Selected Week Window
  const weeklyMetrics = useMemo(() => {
    // DSA Attempts
    const attempts = dsaStore.attempts.filter(a => {
      const d = a.attemptedAt.split('T')[0];
      return d >= selectedWeekStart && d <= selectedWeekEnd;
    });
    const uniqueProblemIds = new Set(attempts.map(a => a.problemId));
    const dsaSolved = uniqueProblemIds.size;
    const avgConfidence = attempts.length > 0 
      ? Math.round((attempts.reduce((sum, a) => sum + a.confidence, 0) / attempts.length) * 20) 
      : 85;

    // Tech Syllabus subtopics completed
    const syllabusDates = syllabusStore.completionDates;
    const completedItems = Object.entries(syllabusDates).filter(([_, date]) => {
      return date >= selectedWeekStart && date <= selectedWeekEnd;
    }).map(([id]) => syllabusStore.getItemById(id)).filter(Boolean);
    const techTopicsCount = completedItems.length;

    // Gym Sessions
    const gymSessions = dailyStore.gymSessions.filter(s => {
      return s.date >= selectedWeekStart && s.date <= selectedWeekEnd && s.completed;
    });

    // Communication Sessions
    const commSessions = dailyStore.communications.filter(c => {
      return c.date >= selectedWeekStart && c.date <= selectedWeekEnd;
    });

    // Journal Entries
    const journals = dailyStore.journals.filter(j => {
      return j.date >= selectedWeekStart && j.date <= selectedWeekEnd;
    });

    // Composite Discipline Score (Target baselines: 5 DSA, 5 Tech, 4 Gym, 4 Comm, 5 Journal)
    const dsaScore = Math.min(1, dsaSolved / 5) * 25;
    const techScore = Math.min(1, techTopicsCount / 5) * 25;
    const gymScore = Math.min(1, gymSessions.length / 4) * 20;
    const commScore = Math.min(1, commSessions.length / 4) * 15;
    const journalScore = Math.min(1, journals.length / 5) * 15;
    const adherenceScore = Math.round(dsaScore + techScore + gymScore + commScore + journalScore);

    return {
      dsaSolved,
      avgConfidence,
      attempts,
      techTopicsCount,
      completedItems,
      gymCount: gymSessions.length,
      commCount: commSessions.length,
      journalCount: journals.length,
      journals,
      adherenceScore,
    };
  }, [selectedWeekStart, selectedWeekEnd, dsaStore.attempts, syllabusStore.completionDates, dailyStore.gymSessions, dailyStore.communications, dailyStore.journals]);

  // Form State
  const [formData, setFormData] = useState({
    weekStartDate: selectedWeekStart,
    dsaProblemsSolved: existingReview?.dsaProblemsSolved ?? weeklyMetrics.dsaSolved,
    dsaAccuracy: existingReview?.dsaAccuracy ?? weeklyMetrics.avgConfidence,
    techHours: existingReview?.techHours ?? weeklyMetrics.techTopicsCount * 1.5,
    projectHours: existingReview?.projectHours ?? 0,
    gymSessions: existingReview?.gymSessions ?? weeklyMetrics.gymCount,
    sleepAvg: existingReview?.sleepAvg ?? 7.5,
    biggestWin: existingReview?.biggestWin ?? '',
    biggestStruggle: existingReview?.biggestStruggle ?? '',
    nextWeekFocus: existingReview?.nextWeekFocus ?? '',
    nextWeekDsaTheme: existingReview?.nextWeekDsaTheme ?? '',
    nextWeekTechTheme: existingReview?.nextWeekTechTheme ?? '',
    notes: existingReview?.notes ?? '',
  });

  // Keep form in sync when changing weeks
  React.useEffect(() => {
    const rev = dashboardStore.getReviewByWeek(selectedWeekStart);
    setFormData({
      weekStartDate: selectedWeekStart,
      dsaProblemsSolved: rev?.dsaProblemsSolved ?? weeklyMetrics.dsaSolved,
      dsaAccuracy: rev?.dsaAccuracy ?? weeklyMetrics.avgConfidence,
      techHours: rev?.techHours ?? weeklyMetrics.techTopicsCount * 1.5,
      projectHours: rev?.projectHours ?? 0,
      gymSessions: rev?.gymSessions ?? weeklyMetrics.gymCount,
      sleepAvg: rev?.sleepAvg ?? 7.5,
      biggestWin: rev?.biggestWin ?? '',
      biggestStruggle: rev?.biggestStruggle ?? '',
      nextWeekFocus: rev?.nextWeekFocus ?? '',
      nextWeekDsaTheme: rev?.nextWeekDsaTheme ?? '',
      nextWeekTechTheme: rev?.nextWeekTechTheme ?? '',
      notes: rev?.notes ?? '',
    });
    setAiSummary('');
  }, [selectedWeekStart, weeklyMetrics, dashboardStore]);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState('');

  // 1-Click Autofill Reflection from Real Logs
  const handleAutofillFromLogs = () => {
    soundService.playCheckSound();
    
    // Suggest wins from syllabus & DSA
    const wins: string[] = [];
    if (weeklyMetrics.dsaSolved > 0) {
      wins.push(`Solved ${weeklyMetrics.dsaSolved} DSA problems with ~${weeklyMetrics.avgConfidence}% confidence.`);
    }
    if (weeklyMetrics.techTopicsCount > 0) {
      const topItems = weeklyMetrics.completedItems.slice(0, 2).map(i => i?.subtopic || i?.topic).join(', ');
      wins.push(`Completed ${weeklyMetrics.techTopicsCount} curriculum modules (${topItems}).`);
    }
    if (weeklyMetrics.gymCount >= 4) {
      wins.push(`Hit physical target with ${weeklyMetrics.gymCount} completed workouts.`);
    }
    if (weeklyMetrics.commCount >= 3) {
      wins.push(`Maintained speaking practice with ${weeklyMetrics.commCount} vocal sessions.`);
    }

    // Weakest topic suggestion for DSA next week
    const stats = dsaStore.getTopicStats();
    const weakestTopic = stats.length > 0 
      ? [...stats].sort((a, b) => a.avgConfidence - b.avgConfidence)[0] 
      : null;

    // Next syllabus item
    const nextItem = syllabusStore.getNextPendingItem();

    setFormData(prev => ({
      ...prev,
      dsaProblemsSolved: weeklyMetrics.dsaSolved,
      dsaAccuracy: weeklyMetrics.avgConfidence,
      techHours: Math.round(weeklyMetrics.techTopicsCount * 1.5),
      gymSessions: weeklyMetrics.gymCount,
      biggestWin: wins.length > 0 ? wins.join(' ') : 'Maintained steady consistency across daily study blocks.',
      biggestStruggle: weeklyMetrics.attempts.some(a => a.mistake) 
        ? `Clarified key edge cases in ${weeklyMetrics.attempts.find(a => a.mistake)?.mistake?.slice(0, 80)}...`
        : 'Balancing full-time workday fatigue with deep focus blocks.',
      nextWeekFocus: nextItem ? `Master ${nextItem.subtopic} and expand algorithm pattern recall` : 'Continue 1-problem daily momentum',
      nextWeekDsaTheme: weakestTopic ? weakestTopic.name : 'Binary Search / Sliding Window',
      nextWeekTechTheme: nextItem ? `Week ${nextItem.weekNumber}: ${nextItem.topic}` : 'Spring Boot & System Architecture',
    }));
  };

  // Quick Chips
  const addWinChip = (text: string) => {
    soundService.playCheckSound();
    setFormData(prev => ({
      ...prev,
      biggestWin: prev.biggestWin ? `${prev.biggestWin} • ${text}` : text
    }));
  };

  const addStruggleChip = (text: string) => {
    soundService.playCheckSound();
    setFormData(prev => ({
      ...prev,
      biggestStruggle: prev.biggestStruggle ? `${prev.biggestStruggle} • ${text}` : text
    }));
  };

  const handleSave = () => {
    dashboardStore.saveReview({
      ...formData,
      syllabusTopicsCount: weeklyMetrics.techTopicsCount,
      commSessionsCount: weeklyMetrics.commCount,
      journalDaysCount: weeklyMetrics.journalCount,
      adherenceScore: weeklyMetrics.adherenceScore,
    });
    soundService.playSuccessChime();
    alert('✓ Weekly review saved! Your discipline score has been archived.');
  };

  const handleGenerateAiSummary = async () => {
    setAiLoading(true);
    try {
      const context = {
        journalEntries: weeklyMetrics.journals.map((j: any) => j.whatLearned).filter(Boolean),
        dsaMistakes: weeklyMetrics.attempts.map((a: any) => a.mistake).filter(Boolean),
        techHours: formData.techHours,
        gymSessions: formData.gymSessions,
        sleepAvg: formData.sleepAvg
      };
      const result = await generateWeeklyReviewSummary(context);
      setAiSummary(result);
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const reviews = dashboardStore.reviews;

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-1 sm:px-0">
      {/* 1. Header & Week Navigator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold mb-1.5 border border-purple-500/20">
            <Trophy size={12} className="text-purple-400" />
            <span>Retrospective & Weekly Audit</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white">Weekly Executive Review</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Automated quantitative scorecard and reflection to compound your career momentum.
          </p>
        </div>

        {/* Week Date Picker & Navigator */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-black/40 p-1.5 rounded-xl border border-white/10">
          <button
            onClick={handlePrevWeek}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Previous Week"
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="px-2 text-center">
            <div className="text-[10px] text-gray-400 font-mono uppercase">Week Window</div>
            <div className="text-xs font-bold text-white font-mono">
              {selectedWeekStart.slice(5)} to {selectedWeekEnd.slice(5)}
            </div>
          </div>

          <button
            onClick={handleNextWeek}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Next Week"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* 2. Overall Weekly Discipline Score Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/30 via-[#0d1017] to-blue-950/30 border border-purple-500/30 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex flex-col items-center justify-center shrink-0">
              <span className="text-2xl font-black text-purple-300 font-mono">{weeklyMetrics.adherenceScore}%</span>
              <span className="text-[9px] uppercase tracking-wider text-purple-400/80 font-bold">Discipline</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">
                  {weeklyMetrics.adherenceScore >= 80 ? '🔥 High Momentum Week' : weeklyMetrics.adherenceScore >= 50 ? '⚡ Steady Progress Week' : '⚠️ Recovery & Focus Needed'}
                </h2>
                {isCurrentWeek && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                    Live This Week
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-300 mt-1 max-w-xl leading-relaxed">
                {weeklyMetrics.adherenceScore >= 80 
                  ? 'Outstanding execution across DSA, Tech syllabus, gym, and speech. You are on track for Tier-1 engineering readiness.'
                  : 'Solid groundwork laid. Review your bottlenecks below and set 2 realistic targets for next week.'}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button 
              variant="secondary" 
              onClick={handleGenerateAiSummary} 
              loading={aiLoading}
              className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 flex-1 sm:flex-none text-xs"
            >
              <Sparkles size={14} className="mr-1.5 text-purple-400" />
              Ask AI Coach
            </Button>
            <Button
              variant="primary"
              onClick={handleAutofillFromLogs}
              className="bg-purple-600 hover:bg-purple-500 flex-1 sm:flex-none text-xs"
            >
              <Wand2 size={14} className="mr-1.5" />
              Autofill from Logs
            </Button>
          </div>
        </div>
      </div>

      {/* AI Coach Card (If Generated) */}
      {aiSummary && (
        <Card className="p-5 border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.15)] bg-purple-500/5 animate-in fade-in">
          <h2 className="text-base font-bold mb-2 flex items-center text-purple-400">
            <Sparkles size={18} className="mr-2" />
            AI Coach Tactical Feedback
          </h2>
          <div className="prose prose-invert max-w-none text-xs sm:text-sm text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
            {aiSummary}
          </div>
        </Card>
      )}

      {/* 3. 5-Pillar Telemetry Grid (100% Auto-Calculated) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {/* Metric 1: DSA Solved */}
        <div className="glass-panel p-3.5 rounded-xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-blue-400 font-bold font-mono">
            <span className="flex items-center gap-1"><Brain size={12} /> DSA</span>
            <span>Target: 5</span>
          </div>
          <div className="text-xl font-black text-white font-mono">
            {weeklyMetrics.dsaSolved} <span className="text-xs text-gray-400 font-normal">/ 5 solved</span>
          </div>
          <div className="text-[10px] text-gray-400 font-mono">
            ~{weeklyMetrics.avgConfidence}% confidence
          </div>
        </div>

        {/* Metric 2: Tech Syllabus */}
        <div className="glass-panel p-3.5 rounded-xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold font-mono">
            <span className="flex items-center gap-1"><CheckCircle2 size={12} /> SYLLABUS</span>
            <span>Target: 5</span>
          </div>
          <div className="text-xl font-black text-white font-mono">
            {weeklyMetrics.techTopicsCount} <span className="text-xs text-gray-400 font-normal">/ 5 topics</span>
          </div>
          <div className="text-[10px] text-emerald-400/80 font-mono">
            {syllabusStore.getPaceAnalysis().statusLabel}
          </div>
        </div>

        {/* Metric 3: Gym Workouts */}
        <div className="glass-panel p-3.5 rounded-xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-orange-400 font-bold font-mono">
            <span className="flex items-center gap-1"><Dumbbell size={12} /> GYM</span>
            <span>Target: 4</span>
          </div>
          <div className="text-xl font-black text-white font-mono">
            {weeklyMetrics.gymCount} <span className="text-xs text-gray-400 font-normal">/ 4 sessions</span>
          </div>
          <div className="text-[10px] text-gray-400 font-mono">
            Physical resilience
          </div>
        </div>

        {/* Metric 4: Speaking Practice */}
        <div className="glass-panel p-3.5 rounded-xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-teal-400 font-bold font-mono">
            <span className="flex items-center gap-1"><Mic size={12} /> SPEECH</span>
            <span>Target: 4</span>
          </div>
          <div className="text-xl font-black text-white font-mono">
            {weeklyMetrics.commCount} <span className="text-xs text-gray-400 font-normal">/ 4 talks</span>
          </div>
          <div className="text-[10px] text-gray-400 font-mono">
            Vocal articulation
          </div>
        </div>

        {/* Metric 5: Daily Journal */}
        <div className="glass-panel p-3.5 rounded-xl border border-white/10 space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[11px] text-sky-400 font-bold font-mono">
            <span className="flex items-center gap-1"><BookOpen size={12} /> JOURNAL</span>
            <span>Target: 5</span>
          </div>
          <div className="text-xl font-black text-white font-mono">
            {weeklyMetrics.journalCount} <span className="text-xs text-gray-400 font-normal">/ 5 days</span>
          </div>
          <div className="text-[10px] text-gray-400 font-mono">
            Reflective synthesis
          </div>
        </div>
      </div>

      {/* 4. Qualitative Reflection Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Card: Wins & Struggles */}
        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Trophy size={16} className="text-amber-400" />
                <span>Biggest Wins This Week</span>
              </h2>
              <span className="text-[11px] text-gray-400">1-Tap Chips:</span>
            </div>

            {/* Quick Win Chips */}
            <div className="flex flex-wrap gap-1.5">
              {[
                '+ Solved 5 DSA Problems',
                '+ 4/4 Consistent Gym Split',
                '+ Mastered Java 21 / JMM',
                '+ Zero Missing Journal Days',
                '+ Clear Verbal Articulation',
              ].map(chip => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => addWinChip(chip.replace('+', '').trim())}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>

            <Textarea 
              label="Reflection on Wins" 
              value={formData.biggestWin} 
              onChange={e => setFormData({...formData, biggestWin: e.target.value})} 
              placeholder="What went exceptionally well? What breakthrough did you make?"
              rows={3} 
            />
          </Card>

          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame size={16} className="text-rose-400" />
                <span>Biggest Obstacle / Struggle</span>
              </h2>
              <span className="text-[11px] text-gray-400">1-Tap Chips:</span>
            </div>

            {/* Quick Struggle Chips */}
            <div className="flex flex-wrap gap-1.5">
              {[
                '− Underestimated DP complexity',
                '− Evening fatigue after work',
                '− Midweek procrastination dip',
                '− Need faster verbal structuring',
              ].map(chip => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => addStruggleChip(chip.replace('−', '').trim())}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>

            <Textarea 
              label="Diagnosis & Bottleneck" 
              value={formData.biggestStruggle} 
              onChange={e => setFormData({...formData, biggestStruggle: e.target.value})} 
              placeholder="Where did you get stuck or experience friction? What will you do differently?"
              rows={3} 
            />
          </Card>
        </div>

        {/* Right Card: Next Week Strategy & Save */}
        <div className="space-y-4">
          <Card className="p-5 space-y-4 border-l-4 border-purple-500">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-purple-400" />
              <span>Next Week Focus & Commitments</span>
            </h2>

            <div className="space-y-3">
              <Input 
                label="Primary Mission Goal" 
                value={formData.nextWeekFocus} 
                onChange={e => setFormData({...formData, nextWeekFocus: e.target.value})} 
                placeholder="e.g. Master Kafka partitioning and finish Sliding Window sheet"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input 
                  label="DSA Theme Target" 
                  value={formData.nextWeekDsaTheme} 
                  onChange={e => setFormData({...formData, nextWeekDsaTheme: e.target.value})} 
                  placeholder="e.g. Graphs / BFS & DFS" 
                />
                <Input 
                  label="Tech Curriculum Focus" 
                  value={formData.nextWeekTechTheme} 
                  onChange={e => setFormData({...formData, nextWeekTechTheme: e.target.value})} 
                  placeholder="e.g. Redis Caching & Locks" 
                />
              </div>

              <Textarea 
                label="Personal Notes & Strategy" 
                value={formData.notes} 
                onChange={e => setFormData({...formData, notes: e.target.value})} 
                placeholder="Any special schedule adjustments, rest days, or interview dates..."
                rows={2} 
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-white/10">
              <div className="text-[11px] text-gray-400 font-mono">
                {existingReview ? '✓ Previously Saved' : 'Drafting Review'}
              </div>
              <Button 
                onClick={handleSave}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 w-full sm:w-auto"
              >
                Save Weekly Review
              </Button>
            </div>
          </Card>

          {/* Historical Reviews List */}
          <div className="glass-panel p-5 rounded-2xl space-y-3 border border-white/10">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <History size={14} className="text-purple-400" />
              <span>Saved Weekly Retrospectives ({reviews.length})</span>
            </h3>

            {reviews.length === 0 ? (
              <p className="text-xs text-gray-500 py-3 text-center">No past reviews saved yet. Click "Save Weekly Review" above to archive this week!</p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {reviews.map(rev => (
                  <div 
                    key={rev.id} 
                    onClick={() => setSelectedWeekStart(rev.weekStartDate)}
                    className={`p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                      selectedWeekStart === rev.weekStartDate 
                        ? 'bg-purple-600/20 border-purple-500/40 text-white' 
                        : 'bg-[#090b10] border-white/5 hover:border-white/15 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>Week of {rev.weekStartDate}</span>
                      <span className="text-[10px] font-mono text-purple-400">
                        {rev.adherenceScore ? `${rev.adherenceScore}% Score` : 'Saved'}
                      </span>
                    </div>
                    {rev.biggestWin && (
                      <p className="text-[11px] text-gray-400 truncate mt-1">
                        🏆 {rev.biggestWin}
                      </p>
                    )}
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
