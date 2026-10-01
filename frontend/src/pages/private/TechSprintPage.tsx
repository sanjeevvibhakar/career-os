import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Modal } from '../../components/ui/Modal';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { ConfidenceStars } from '../../components/shared/ConfidenceStars';
import { EmptyState } from '../../components/shared/EmptyState';
import { useSprintStore } from '../../stores/sprintStore';
import { useDashboardStore } from '../../stores/dashboardStore';

export const TechSprintPage: React.FC = () => {
  const sprintStore = useSprintStore();
  const dashboardStore = useDashboardStore();
  
  const activeSprint = sprintStore.getActiveSprint();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  
  const [sprintForm, setSprintForm] = useState({
    technology: '',
    description: '',
    totalWeeks: 4,
  });

  const [logForm, setLogForm] = useState({
    topic: '',
    plannedMinutes: 60,
    actualMinutes: 60,
    understanding: 3,
    notes: '',
    resourcesUsed: '',
  });

  const handleCreateSprint = () => {
    const weeks = Array.from({ length: sprintForm.totalWeeks }, (_, i) => ({
      weekNumber: i + 1,
      focus: `Week ${i + 1} Focus`,
      goals: '',
      completed: false
    }));
    
    sprintStore.createSprint({
      ...sprintForm,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + sprintForm.totalWeeks * 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      currentWeek: 1,
      weeks
    });
    setCreateModalOpen(false);
  };

  const handleLogLearning = () => {
    if (!activeSprint) return;
    sprintStore.createLog({
      ...logForm,
      sprintId: activeSprint.id,
      date: new Date().toISOString().split('T')[0],
    });
    dashboardStore.updateStreak('learning');
    setLogForm({ ...logForm, topic: '', notes: '', resourcesUsed: '', understanding: 3 });
  };

  if (!activeSprint) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Tech Sprints</h1>
        <EmptyState 
          icon="🚀" 
          title="No Active Sprint" 
          description="Sprints are 4-8 week focused deep dives into a specific technology or concept."
          actionLabel="Create Your First Sprint"
          onAction={() => setCreateModalOpen(true)}
        />
        <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New Sprint">
          <div className="space-y-4">
            <Input label="Technology (e.g. React Native, Go, System Design)" value={sprintForm.technology} onChange={e => setSprintForm({...sprintForm, technology: e.target.value})} />
            <Textarea label="Description / Why?" value={sprintForm.description} onChange={e => setSprintForm({...sprintForm, description: e.target.value})} rows={2} />
            <Input type="number" label="Total Weeks" value={sprintForm.totalWeeks} onChange={e => setSprintForm({...sprintForm, totalWeeks: parseInt(e.target.value) || 4})} />
            <Button className="w-full mt-4" onClick={handleCreateSprint}>Start Sprint</Button>
          </div>
        </Modal>
      </div>
    );
  }

  const completedWeeks = activeSprint.weeks.filter(w => w.completed).length;
  const progressPercent = (completedWeeks / activeSprint.totalWeeks) * 100;
  const recentLogs = sprintStore.getRecentLogs(5);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Tech Sprint: {activeSprint.technology}</h1>
          <p className="text-[var(--text-secondary)] mt-1">{activeSprint.description}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-500">Week {activeSprint.currentWeek}</div>
          <div className="text-sm text-[var(--text-secondary)]">of {activeSprint.totalWeeks}</div>
        </div>
      </div>

      <Card className="p-6 border-blue-500 border">
        <div className="mb-2 flex justify-between text-sm font-medium">
          <span>Sprint Progress</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <ProgressBar value={progressPercent} color="bg-blue-500" />
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-lg mb-4">Log Daily Learning</h3>
            <div className="space-y-3">
              <Input label="Topic Covered" value={logForm.topic} onChange={e => setLogForm({...logForm, topic: e.target.value})} />
              <div className="flex gap-2">
                <Input type="number" label="Planned (min)" value={logForm.plannedMinutes} onChange={e => setLogForm({...logForm, plannedMinutes: parseInt(e.target.value) || 0})} />
                <Input type="number" label="Actual (min)" value={logForm.actualMinutes} onChange={e => setLogForm({...logForm, actualMinutes: parseInt(e.target.value) || 0})} />
              </div>
              <Textarea label="Notes & Takeaways" value={logForm.notes} onChange={e => setLogForm({...logForm, notes: e.target.value})} rows={2} />
              <Input label="Resources (Links)" value={logForm.resourcesUsed} onChange={e => setLogForm({...logForm, resourcesUsed: e.target.value})} />
              <div>
                <label className="block text-sm mb-1 text-[var(--text-secondary)]">Understanding</label>
                <ConfidenceStars value={logForm.understanding} onChange={v => setLogForm({...logForm, understanding: v})} />
              </div>
              <Button className="w-full mt-2" onClick={handleLogLearning}>Save Log</Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Recent Logs</h3>
            <div className="space-y-3">
              {recentLogs.length === 0 ? <p className="text-[var(--text-secondary)] text-sm">No logs yet.</p> : recentLogs.map(log => (
                <div key={log.id} className="p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]">
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">{log.topic}</span>
                    <span className="text-xs text-[var(--text-secondary)]">{log.date}</span>
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] mt-1">{log.actualMinutes} mins</div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-[var(--border)]">
              <Button variant="ghost" className="w-full text-blue-400" onClick={() => sprintStore.completeWeek(activeSprint.id, activeSprint.currentWeek)}>
                Complete Week {activeSprint.currentWeek}
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      <div>
         <h2 className="text-xl font-semibold mb-4">Sprint Plan</h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
           {activeSprint.weeks.map(week => (
             <Card key={week.weekNumber} className={`p-4 ${week.completed ? 'opacity-60 border-green-500/50' : week.weekNumber === activeSprint.currentWeek ? 'border-blue-500' : ''}`}>
               <h4 className="font-bold flex justify-between">
                 Week {week.weekNumber}
                 {week.completed && <span className="text-green-500 text-xs">✓ Done</span>}
               </h4>
               <p className="text-sm mt-2">{week.focus}</p>
             </Card>
           ))}
         </div>
      </div>
    </div>
  );
};
