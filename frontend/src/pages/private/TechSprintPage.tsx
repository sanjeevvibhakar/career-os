import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Modal } from '../../components/ui/Modal';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { EmptyState } from '../../components/shared/EmptyState';
import { ConfidenceStars } from '../../components/shared/ConfidenceStars';
import { useSprintStore } from '../../stores/sprintStore';
import { useDashboardStore } from '../../stores/dashboardStore';
import { Code, CheckCircle2, Calendar, Clock, BookOpen, PlusCircle } from 'lucide-react';

export const TechSprintPage: React.FC = () => {
  const sprintStore = useSprintStore();
  const dashboardStore = useDashboardStore();
  
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [sprintForm, setSprintForm] = useState({
    technology: '',
    description: '',
    totalWeeks: 4,
  });

  const [logForm, setLogForm] = useState({
    topic: '',
    plannedMinutes: 45,
    actualMinutes: 45,
    notes: '',
    resourcesUsed: '',
    understanding: 4,
  });

  const activeSprint = sprintStore.getActiveSprint();

  const handleCreateSprint = () => {
    if (!sprintForm.technology) return;
    const weeks = Array.from({ length: sprintForm.totalWeeks }, (_, i) => ({
      weekNumber: i + 1,
      focus: `Week ${i + 1} Deep Dive`,
      goals: 'Implement core modules & read architecture specifications',
      completed: false,
    }));

    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + sprintForm.totalWeeks * 7);

    sprintStore.createSprint({
      technology: sprintForm.technology,
      description: sprintForm.description,
      startDate: today.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      status: 'ACTIVE',
      totalWeeks: sprintForm.totalWeeks,
      currentWeek: 1,
      weeks,
    });

    setCreateModalOpen(false);
  };

  const handleLogLearning = () => {
    if (!logForm.topic) return;
    sprintStore.createLog({
      sprintId: activeSprint ? activeSprint.id : null,
      date: new Date().toISOString().split('T')[0],
      topic: logForm.topic,
      plannedMinutes: logForm.plannedMinutes,
      actualMinutes: logForm.actualMinutes,
      notes: logForm.notes,
      resourcesUsed: logForm.resourcesUsed,
      understanding: logForm.understanding,
    });
    dashboardStore.updateStreak('learning');
    setLogForm({ ...logForm, topic: '', notes: '', resourcesUsed: '', understanding: 4 });
  };

  if (!activeSprint) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">Technology Sprints</h1>
        </div>
        <EmptyState 
          icon="🚀" 
          title="No Active Sprint" 
          description="Sprints are 4-8 week focused deep dives into backend systems, databases, or cloud architecture."
          actionLabel="Create Your First Sprint"
          onAction={() => setCreateModalOpen(true)}
        />
        <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New Technology Sprint">
          <div className="space-y-4">
            <Input label="Technology (e.g. Java 21 & Concurrency, Kafka, Redis, Distributed Systems)" value={sprintForm.technology} onChange={e => setSprintForm({...sprintForm, technology: e.target.value})} />
            <Textarea label="Why learn this? (At work & for interviews)" value={sprintForm.description} onChange={e => setSprintForm({...sprintForm, description: e.target.value})} rows={2} />
            <Input type="number" label="Total Weeks" value={sprintForm.totalWeeks} onChange={e => setSprintForm({...sprintForm, totalWeeks: parseInt(e.target.value) || 4})} />
            <Button className="w-full mt-2" onClick={handleCreateSprint}>Launch Sprint</Button>
          </div>
        </Modal>
      </div>
    );
  }

  const completedWeeks = activeSprint.weeks.filter(w => w.completed).length;
  const progressPercent = (completedWeeks / activeSprint.totalWeeks) * 100;
  const recentLogs = sprintStore.getRecentLogs(5);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl glass-panel border border-white/10">
        <div>
          <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Code size={13} /> ACTIVE BACKEND SPRINT
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5 tracking-tight">
            {activeSprint.technology}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{activeSprint.description}</p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="text-right font-mono">
            <div className="text-xs font-bold text-blue-400">Week {activeSprint.currentWeek} of {activeSprint.totalWeeks}</div>
            <div className="text-[11px] text-gray-400">{Math.round(progressPercent)}% Complete</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Stacked cleanly on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Log Daily Learning Form */}
        <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-white/10 space-y-3.5">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-blue-400" />
            <h3 className="font-extrabold text-sm sm:text-base text-white">Log Daily Session</h3>
          </div>

          <div className="space-y-3">
            <Input 
              label="Topic Studied / Built" 
              placeholder="e.g. Virtual Threads, CompletableFuture, Kafka Consumer Group" 
              value={logForm.topic} 
              onChange={e => setLogForm({...logForm, topic: e.target.value})} 
            />

            <div className="grid grid-cols-2 gap-2">
              <Input 
                type="number" 
                label="Planned (min)" 
                value={logForm.plannedMinutes} 
                onChange={e => setLogForm({...logForm, plannedMinutes: parseInt(e.target.value) || 0})} 
              />
              <Input 
                type="number" 
                label="Actual (min)" 
                value={logForm.actualMinutes} 
                onChange={e => setLogForm({...logForm, actualMinutes: parseInt(e.target.value) || 0})} 
              />
            </div>

            <Textarea 
              label="Key Insights & Notes" 
              placeholder="Trade-offs, performance gains, syntax quirks..." 
              value={logForm.notes} 
              onChange={e => setLogForm({...logForm, notes: e.target.value})} 
              rows={2} 
            />

            <Input 
              label="Resource Link (Optional)" 
              placeholder="Docs, GitHub repo, RFC..." 
              value={logForm.resourcesUsed} 
              onChange={e => setLogForm({...logForm, resourcesUsed: e.target.value})} 
            />

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Depth of Understanding</label>
              <ConfidenceStars value={logForm.understanding} onChange={v => setLogForm({...logForm, understanding: v})} />
            </div>

            <Button className="w-full mt-1" onClick={handleLogLearning}>Save Learning Log</Button>
          </div>
        </div>

        {/* Right Column: Recent Logs & Action */}
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                <Clock size={16} className="text-purple-400" />
                <span>Recent Learning Logs</span>
              </h3>
              <span className="text-xs font-mono text-gray-500">{recentLogs.length} entries</span>
            </div>

            <div className="space-y-2">
              {recentLogs.length === 0 ? (
                <p className="text-gray-500 text-xs py-4 text-center">No logs recorded yet this week.</p>
              ) : (
                recentLogs.map(log => (
                  <div key={log.id} className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white truncate mr-2">{log.topic}</span>
                      <span className="text-[10px] font-mono text-gray-400 flex-shrink-0">{log.date}</span>
                    </div>
                    {log.notes && (
                      <p className="text-xs text-gray-300 line-clamp-2">{log.notes}</p>
                    )}
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono pt-1">
                      <span>{log.actualMinutes} mins invested</span>
                      <span className="text-amber-400">★ {log.understanding}/5</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-white/10">
              <Button 
                variant="ghost" 
                className="w-full text-blue-400 border border-blue-500/20 hover:bg-blue-500/10" 
                onClick={() => sprintStore.completeWeek(activeSprint.id, activeSprint.currentWeek)}
              >
                Mark Week {activeSprint.currentWeek} Completed ✓
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sprint Plan: Mobile-Friendly Responsive Cards */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-extrabold text-white">Sprint Roadmap ({activeSprint.totalWeeks} Weeks)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {activeSprint.weeks.map(week => {
            const isCurrent = week.weekNumber === activeSprint.currentWeek;
            return (
              <div 
                key={week.weekNumber} 
                className={`p-3.5 rounded-xl border transition-all ${
                  week.completed 
                    ? 'bg-emerald-950/20 border-emerald-500/30 opacity-75' 
                    : isCurrent 
                    ? 'bg-blue-950/30 border-blue-500/40 shadow-md' 
                    : 'bg-black/30 border-white/5'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className={isCurrent ? 'text-blue-400' : 'text-gray-400'}>Week {week.weekNumber}</span>
                  {week.completed && <span className="text-emerald-400">✓ Done</span>}
                  {isCurrent && !week.completed && <span className="text-blue-400 animate-pulse">● Active</span>}
                </div>
                <p className="text-xs font-bold text-white mt-1.5 line-clamp-2">{week.focus}</p>
                <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{week.goals}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
