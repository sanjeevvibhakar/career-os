import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, Flame, Calendar, CheckCircle2, Play, Check, 
  Plus, Trash2, Eye, BarChart2, Award, Clock, ArrowRight,
  TrendingUp, Activity, Sparkles, ChevronRight, X
} from 'lucide-react';
import { WORKOUT_ROUTINES, getRoutineForToday, type WorkoutRoutine, type ExerciseDefinition } from '../../data/gymData';
import { useDailyStore, type GymSession, type CompletedExercise, type CompletedSet } from '../../stores/dailyStore';
import { useDashboardStore } from '../../stores/dashboardStore';
import { ExerciseDemoModal } from '../../components/gym/ExerciseDemoModal';

export const GymPage: React.FC = () => {
  const dailyStore = useDailyStore();
  const dashboardStore = useDashboardStore();

  const today = new Date().toISOString().split('T')[0];
  const currentYearMonth = today.substring(0, 7); // e.g. '2026-10'

  // Tab State
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');

  // Daily Workout State
  const todayDefaultRoutine = getRoutineForToday();
  const [selectedRoutineId, setSelectedRoutineId] = useState<string>(todayDefaultRoutine.id);
  const activeRoutine = WORKOUT_ROUTINES.find(r => r.id === selectedRoutineId) || todayDefaultRoutine;

  // Active exercises set tracking state
  const [exerciseLogs, setExerciseLogs] = useState<Record<string, { completed: boolean; sets: CompletedSet[] }>>({});
  const [durationMinutes, setDurationMinutes] = useState<number>(activeRoutine.estimatedMinutes);
  const [notes, setNotes] = useState<string>('');
  const [demoExercise, setDemoExercise] = useState<ExerciseDefinition | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [selectedHistorySession, setSelectedHistorySession] = useState<GymSession | null>(null);

  // Month Sessions & Streak
  const monthSessions = dailyStore.getGymByMonth(currentYearMonth);
  const streak = dashboardStore.getStreaks().find(s => s.type === 'gym');
  const todaySavedSession = monthSessions.find(s => s.date === today);

  // Initialize or rehydrate workout state when routine changes or on load
  useEffect(() => {
    if (todaySavedSession && todaySavedSession.exercises && todaySavedSession.exercises.length > 0) {
      // Rehydrate existing saved session
      const map: Record<string, { completed: boolean; sets: CompletedSet[] }> = {};
      todaySavedSession.exercises.forEach(ex => {
        map[ex.exerciseId] = {
          completed: ex.completed,
          sets: ex.sets || []
        };
      });
      setExerciseLogs(map);
      setDurationMinutes(todaySavedSession.durationMinutes || activeRoutine.estimatedMinutes);
      setNotes(todaySavedSession.notes || '');
    } else {
      // Initialize fresh sets from active routine definition
      const initialLogs: Record<string, { completed: boolean; sets: CompletedSet[] }> = {};
      activeRoutine.exercises.forEach(ex => {
        const initialSets: CompletedSet[] = Array.from({ length: ex.defaultSets }, (_, i) => ({
          setNumber: i + 1,
          weightKg: ex.category === 'CORE' || ex.category === 'CARDIO' ? 0 : 20,
          reps: parseInt(ex.defaultReps) || 10,
          completed: false
        }));
        initialLogs[ex.id] = {
          completed: false,
          sets: initialSets
        };
      });
      setExerciseLogs(initialLogs);
      setDurationMinutes(activeRoutine.estimatedMinutes);
    }
  }, [selectedRoutineId, todaySavedSession?.id]);

  // Handler: Toggle single set completion
  const handleToggleSet = (exerciseId: string, setIndex: number) => {
    setExerciseLogs(prev => {
      const current = prev[exerciseId] || { completed: false, sets: [] };
      const newSets = current.sets.map((s, idx) => 
        idx === setIndex ? { ...s, completed: !s.completed } : s
      );
      const allSetsDone = newSets.every(s => s.completed);
      return {
        ...prev,
        [exerciseId]: {
          completed: allSetsDone,
          sets: newSets
        }
      };
    });
  };

  // Handler: Update set weight or reps
  const handleUpdateSet = (exerciseId: string, setIndex: number, field: 'weightKg' | 'reps', value: number) => {
    setExerciseLogs(prev => {
      const current = prev[exerciseId] || { completed: false, sets: [] };
      const newSets = current.sets.map((s, idx) => 
        idx === setIndex ? { ...s, [field]: value } : s
      );
      return {
        ...prev,
        [exerciseId]: {
          ...current,
          sets: newSets
        }
      };
    });
  };

  // Handler: Add set to exercise
  const handleAddSet = (exerciseId: string) => {
    setExerciseLogs(prev => {
      const current = prev[exerciseId] || { completed: false, sets: [] };
      const lastSet = current.sets[current.sets.length - 1];
      const newSet: CompletedSet = {
        setNumber: current.sets.length + 1,
        weightKg: lastSet ? lastSet.weightKg : 20,
        reps: lastSet ? lastSet.reps : 10,
        completed: false
      };
      return {
        ...prev,
        [exerciseId]: {
          ...current,
          sets: [...current.sets, newSet]
        }
      };
    });
  };

  // Handler: Toggle entire exercise done
  const handleToggleAllExerciseSets = (exerciseId: string) => {
    setExerciseLogs(prev => {
      const current = prev[exerciseId];
      if (!current) return prev;
      const targetState = !current.completed;
      const newSets = current.sets.map(s => ({ ...s, completed: targetState }));
      return {
        ...prev,
        [exerciseId]: {
          completed: targetState,
          sets: newSets
        }
      };
    });
  };

  // Calculate workout completion statistics
  const totalExercises = activeRoutine.exercises.length;
  const completedExercisesCount = activeRoutine.exercises.filter(ex => exerciseLogs[ex.id]?.completed).length;
  const progressPercent = totalExercises > 0 ? Math.round((completedExercisesCount / totalExercises) * 100) : 0;

  // Calculate total volume lifted
  const totalVolumeKg = Object.values(exerciseLogs).reduce((acc, ex) => {
    return acc + ex.sets.reduce((sAcc, s) => s.completed ? sAcc + (s.weightKg * s.reps) : sAcc, 0);
  }, 0);

  // Handler: Save workout
  const handleSaveWorkout = () => {
    const formattedExercises: CompletedExercise[] = activeRoutine.exercises.map(ex => {
      const logged = exerciseLogs[ex.id] || { completed: false, sets: [] };
      return {
        exerciseId: ex.id,
        exerciseName: ex.name,
        targetMuscle: ex.targetMuscle,
        completed: logged.completed,
        sets: logged.sets
      };
    });

    const newSession: Omit<GymSession, 'id'> = {
      date: today,
      type: activeRoutine.splitType,
      completed: true,
      durationMinutes,
      notes: notes.trim(),
      exercises: formattedExercises,
      totalVolumeKg
    };

    dailyStore.saveGymSession(newSession);
    dashboardStore.updateStreak('gym');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  // Monthly Analysis Calculations
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const currentMonthDate = new Date();
  const monthName = currentMonthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  // Total workouts this month
  const totalWorkoutsThisMonth = monthSessions.filter(s => s.completed && s.type !== 'REST').length;
  const targetWorkouts = Math.min(22, daysInMonth - 8); // ~4-5 workouts per week
  const consistencyRate = Math.min(100, Math.round((totalWorkoutsThisMonth / targetWorkouts) * 100));
  const totalMinutesTrained = monthSessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);

  // Split distribution counts
  const splitCounts = monthSessions.reduce((acc, s) => {
    const t = s.type || 'OTHER';
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Exercise Demo Modal */}
      <ExerciseDemoModal
        exercise={demoExercise}
        isOpen={!!demoExercise}
        onClose={() => setDemoExercise(null)}
      />

      {/* Detail Inspector Modal for Past Workout Session */}
      {selectedHistorySession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#0c101a] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white">Workout Log: {selectedHistorySession.date}</h3>
                <span className="text-xs text-orange-400 font-mono font-semibold">{selectedHistorySession.type} Routine</span>
              </div>
              <button onClick={() => setSelectedHistorySession(null)} className="p-1 text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center justify-between text-xs font-mono bg-white/5 p-3 rounded-xl">
                <span>Duration: <strong className="text-white">{selectedHistorySession.durationMinutes}m</strong></span>
                {selectedHistorySession.totalVolumeKg ? (
                  <span>Volume: <strong className="text-emerald-400">{selectedHistorySession.totalVolumeKg} kg</strong></span>
                ) : null}
              </div>
              {selectedHistorySession.notes && (
                <div className="p-3 rounded-xl bg-white/5 text-xs text-gray-300">
                  <span className="text-gray-400 block text-[10px] uppercase font-mono mb-1">Session Notes</span>
                  {selectedHistorySession.notes}
                </div>
              )}
              {selectedHistorySession.exercises && selectedHistorySession.exercises.length > 0 ? (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Exercises Logged</span>
                  {selectedHistorySession.exercises.map((ex, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 text-xs">
                      <div className="font-semibold text-white flex items-center justify-between">
                        <span>{ex.exerciseName}</span>
                        {ex.completed && <CheckCircle2 size={13} className="text-emerald-400" />}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-1 flex flex-wrap gap-2">
                        {ex.sets.map((s, sIdx) => (
                          <span key={sIdx} className="px-1.5 py-0.5 rounded bg-black/40 font-mono">
                            Set {s.setNumber}: {s.weightKg}kg × {s.reps}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">Standard session recorded without set breakdown.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top Header & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-6 rounded-2xl glass-panel border border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Dumbbell size={24} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Gym & Physical Engine
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Disciplined hypertrophy & conditioning to fuel peak cognitive performance.
            </p>
          </div>
        </div>

        {/* Tab Switcher & Streak Badge */}
        <div className="flex items-center gap-2.5">
          <div className="flex p-1 rounded-xl bg-black/40 border border-white/10">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'daily' 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Activity size={14} />
              <span>Daily Workout</span>
            </button>
            <button
              onClick={() => setActiveTab('monthly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'monthly' 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <BarChart2 size={14} />
              <span>Monthly Analysis</span>
            </button>
          </div>

          {streak && (
            <div className="px-3 py-1.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold text-xs flex items-center gap-1 font-mono">
              <Flame size={14} className="text-orange-400 fill-orange-400" />
              <span>{streak.currentCount}d</span>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DAILY WORKOUT ROUTINE & SETS TRACKER */}
      {/* ========================================================================= */}
      {activeTab === 'daily' && (
        <div className="space-y-6">
          {/* Workout Split Selector & Today's Overview Bar */}
          <div className="p-4 md:p-5 rounded-2xl glass-panel border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/20 font-mono">
                  {activeRoutine.splitType} SPLIT
                </span>
                <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                  <Clock size={12} /> ~{activeRoutine.estimatedMinutes} mins
                </span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-400">{activeRoutine.exercises.length} Exercises</span>
              </div>
              <h2 className="text-lg md:text-xl font-extrabold text-white">
                {activeRoutine.title}
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5 max-w-xl">
                {activeRoutine.description}
              </p>
            </div>

            {/* Split Switcher Dropdown */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-xs text-gray-400 font-mono">Routine:</span>
              <select
                value={selectedRoutineId}
                onChange={(e) => setSelectedRoutineId(e.target.value)}
                className="bg-[#0c101a] text-white border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-orange-500/50 cursor-pointer"
              >
                {WORKOUT_ROUTINES.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.dayOfWeek}: {r.splitType} ({r.exercises.length} ex)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Workout Progress Strip */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>Workout Completion:</span>
                <span className="text-emerald-400 font-mono">{completedExercisesCount} / {totalExercises} Done</span>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-1 max-w-xs">
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-emerald-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-mono text-gray-300 font-bold">{progressPercent}%</span>
            </div>
          </div>

          {/* Exercises Checklist Cards */}
          <div className="space-y-4">
            {activeRoutine.exercises.map((exercise, index) => {
              const logged = exerciseLogs[exercise.id] || { completed: false, sets: [] };

              return (
                <div 
                  key={exercise.id}
                  className={`p-4 md:p-5 rounded-2xl glass-panel border transition-all ${
                    logged.completed 
                      ? 'border-emerald-500/30 bg-emerald-500/[0.02]' 
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Exercise Title Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-white/5 text-gray-400 border border-white/10 flex items-center justify-center text-xs font-mono font-bold">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                          <span>{exercise.name}</span>
                          {logged.completed && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                              COMPLETE
                            </span>
                          )}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                          <span className="text-orange-400 font-medium">{exercise.targetMuscle}</span>
                          <span>•</span>
                          <span className="font-mono text-gray-400">{exercise.defaultSets} Sets × {exercise.defaultReps}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons: View Demo & Mark All */}
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        onClick={() => setDemoExercise(exercise)}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 flex items-center gap-1 transition-colors"
                        title="View animated visual guide, form tips & mistakes"
                      >
                        <Eye size={13} />
                        <span>View Demo</span>
                      </button>

                      <button
                        onClick={() => handleToggleAllExerciseSets(exercise.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 transition-colors ${
                          logged.completed 
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                            : 'bg-white/5 text-gray-300 border-white/10 hover:border-emerald-500/30'
                        }`}
                      >
                        <Check size={13} />
                        <span>{logged.completed ? 'Reset' : 'Check All'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Interactive Sets Table */}
                  <div className="overflow-x-auto mt-3">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="text-gray-400 text-[10px] uppercase border-b border-white/5 pb-1">
                          <th className="py-1 px-2 w-12">Set</th>
                          <th className="py-1 px-2 w-28">Weight (kg)</th>
                          <th className="py-1 px-2 w-28">Reps</th>
                          <th className="py-1 px-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {logged.sets.map((set, sIdx) => (
                          <tr key={sIdx} className="hover:bg-white/[0.02]">
                            <td className="py-2 px-2 text-gray-400 font-bold">
                              #{set.setNumber}
                            </td>
                            <td className="py-2 px-2">
                              <input 
                                type="number" 
                                min={0}
                                step={2.5}
                                value={set.weightKg} 
                                onChange={(e) => handleUpdateSet(exercise.id, sIdx, 'weightKg', parseFloat(e.target.value) || 0)}
                                className="w-20 px-2 py-1 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-orange-500"
                              />
                            </td>
                            <td className="py-2 px-2">
                              <input 
                                type="number" 
                                min={1}
                                value={set.reps} 
                                onChange={(e) => handleUpdateSet(exercise.id, sIdx, 'reps', parseInt(e.target.value) || 0)}
                                className="w-20 px-2 py-1 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-orange-500"
                              />
                            </td>
                            <td className="py-2 px-2 text-right">
                              <button
                                onClick={() => handleToggleSet(exercise.id, sIdx)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1 ${
                                  set.completed 
                                    ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20' 
                                    : 'bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-white/20'
                                }`}
                              >
                                {set.completed ? <Check size={12} /> : null}
                                <span>{set.completed ? 'Done' : 'Pending'}</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Extra Set */}
                  <div className="mt-2.5 pt-2 border-t border-white/5 flex justify-end">
                    <button
                      onClick={() => handleAddSet(exercise.id)}
                      className="text-[11px] font-mono text-gray-400 hover:text-orange-400 flex items-center gap-1 transition-colors"
                    >
                      <Plus size={12} />
                      <span>Add Set</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Finish & Save Workout Panel */}
          <div className="p-5 md:p-6 rounded-2xl glass-panel border border-orange-500/30 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award size={18} className="text-orange-400" />
              <span>Complete & Log Workout Session</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1 font-mono">Actual Duration (Minutes)</label>
                <input 
                  type="number"
                  min={10}
                  max={180}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 45)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1 font-mono">Total Volume Calculated</label>
                <div className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-emerald-400 font-mono text-xs font-bold">
                  {totalVolumeKg > 0 ? `${totalVolumeKg.toLocaleString()} kg lifted` : 'Cardio / Bodyweight focus'}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1 font-mono">Session Notes (RPE, Weights, Pump)</label>
              <textarea 
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Felt strong on bench press, progressive overload achieved..."
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-orange-500 resize-none"
              />
            </div>

            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 size={16} />
                <span>Workout successfully recorded and streak updated! Syncing to Supabase Cloud...</span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveWorkout}
                className="px-7 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-all shadow-lg shadow-orange-500/25 flex items-center gap-2"
              >
                <Dumbbell size={16} />
                <span>Finish & Save Workout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MONTHLY ANALYSIS & CALENDAR HEATMAP */}
      {/* ========================================================================= */}
      {activeTab === 'monthly' && (
        <div className="space-y-6">
          {/* Key Monthly Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="glass-panel p-4 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                <span className="text-orange-400 font-bold uppercase tracking-wider text-[11px]">Monthly Sessions</span>
                <Dumbbell size={15} className="text-orange-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {totalWorkoutsThisMonth} <span className="text-xs text-gray-400 font-normal">/ {targetWorkouts} Goal</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1 font-mono">
                {monthName}
              </p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">Consistency</span>
                <TrendingUp size={15} className="text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {consistencyRate}%
              </div>
              <p className="text-[11px] text-gray-400 mt-1 font-mono">
                {consistencyRate >= 80 ? '🔥 On Track for Winter Arc' : 'Target: 80%+'}
              </p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                <span className="text-sky-400 font-bold uppercase tracking-wider text-[11px]">Total Training</span>
                <Clock size={15} className="text-sky-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {Math.round(totalMinutesTrained / 60)}h <span className="text-xs text-gray-400 font-normal">{totalMinutesTrained % 60}m</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1 font-mono">
                {monthSessions.length > 0 ? `${Math.round(totalMinutesTrained / monthSessions.length)}m avg / session` : '0m'}
              </p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px]">Active Streak</span>
                <Flame size={15} className="text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {streak?.currentCount || 0} <span className="text-xs text-gray-400 font-normal">Days</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1 font-mono">
                Best: {streak?.bestCount || 0} Days
              </p>
            </div>
          </div>

          {/* Interactive Calendar Heatmap */}
          <div className="p-4 md:p-6 rounded-2xl glass-panel border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar size={18} className="text-orange-400" />
                <span>Monthly Activity Matrix ({monthName})</span>
              </h3>
              <span className="text-xs text-gray-400 font-mono">Tap any active day to inspect</span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-xs font-bold text-gray-400 py-1 font-mono">
                  {d}
                </div>
              ))}

              {/* Start padding for month */}
              {Array.from({ length: new Date(`${currentYearMonth}-01`).getDay() }).map((_, i) => (
                <div key={`pad-${i}`} className="aspect-square opacity-0" />
              ))}

              {/* Days of Month */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const dayNum = i + 1;
                const dateStr = `${currentYearMonth}-${String(dayNum).padStart(2, '0')}`;
                const session = monthSessions.find(s => s.date === dateStr);
                const isToday = dateStr === today;

                return (
                  <button
                    key={dateStr}
                    onClick={() => session && setSelectedHistorySession(session)}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center p-1 border transition-all text-left relative ${
                      isToday ? 'ring-2 ring-orange-500' : ''
                    } ${
                      session 
                        ? 'bg-orange-500/15 border-orange-500/30 hover:border-orange-400 cursor-pointer' 
                        : 'bg-black/30 border-white/5 text-gray-500'
                    }`}
                  >
                    <span className="text-[11px] font-mono font-semibold text-gray-300">{dayNum}</span>
                    {session && (
                      <span className="text-[9px] font-mono font-bold text-orange-400 mt-0.5 truncate max-w-full">
                        {session.type.substring(0, 4)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Muscle Split Distribution */}
          <div className="p-4 md:p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity size={18} className="text-sky-400" />
              <span>Workout Split Distribution</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['PUSH', 'PULL', 'LEGS', 'UPPER', 'LOWER', 'CARDIO'].map(split => {
                const count = splitCounts[split] || 0;
                const percent = totalWorkoutsThisMonth > 0 ? Math.round((count / totalWorkoutsThisMonth) * 100) : 0;

                return (
                  <div key={split} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="text-gray-300 font-bold">{split}</span>
                      <span className="text-orange-400 font-bold">{count} sess</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-orange-500 h-1.5 rounded-full" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono mt-1 block">{percent}% of workouts</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chronological Workout History */}
          <div className="p-4 md:p-6 rounded-2xl glass-panel border border-white/10 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock size={18} className="text-emerald-400" />
              <span>Workout Logs History ({monthSessions.length} Sessions)</span>
            </h3>

            {monthSessions.length === 0 ? (
              <p className="text-xs text-gray-400 font-mono py-4">No workout sessions logged yet for this month.</p>
            ) : (
              <div className="space-y-2">
                {monthSessions.map(session => (
                  <div 
                    key={session.id}
                    onClick={() => setSelectedHistorySession(session)}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-orange-500/30 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{session.date}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 font-semibold border border-orange-500/20">
                          {session.type}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">{session.durationMinutes} mins</span>
                      </div>
                      {session.notes && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                          {session.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-orange-400 font-mono">
                      <span>View Log</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
