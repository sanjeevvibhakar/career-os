import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Stat } from '../../components/ui/Stat';
import { StreakBadge } from '../../components/shared/StreakBadge';
import { useDsaStore } from '../../stores/dsaStore';
import { useDailyStore } from '../../stores/dailyStore';
import { useSprintStore } from '../../stores/sprintStore';
import { useDashboardStore } from '../../stores/dashboardStore';
import { useAuthStore } from '../../stores/authStore';

export const DashboardPage: React.FC = () => {
  const { userName } = useAuthStore();
  const dsaStore = useDsaStore();
  const sprintStore = useSprintStore();
  const dashboardStore = useDashboardStore();
  const dailyStore = useDailyStore();

  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const dueRevisions = dsaStore.getDueRevisions();
  const topicStats = dsaStore.getTopicStats();
  const bottleneckTopic = topicStats.length > 0 
    ? [...topicStats].sort((a, b) => a.avgConfidence - b.avgConfidence)[0]
    : null;

  const randomUnsolvedProblem = () => {
    if (!bottleneckTopic) return null;
    const problems = dsaStore.getProblemsByTopic(bottleneckTopic.topicId);
    const unsolved = problems.filter(p => p.attemptCount === 0);
    if (unsolved.length === 0) return null;
    return unsolved[Math.floor(Math.random() * unsolved.length)];
  };

  const dsaFocusProblem = randomUnsolvedProblem();
  const activeSprint = sprintStore.getActiveSprint();
  const streaks = dashboardStore.getStreaks();

  const getStreakCount = (type: string) => streaks.find(s => s.type === type)?.currentCount || 0;
  const getBestStreakCount = (type: string) => streaks.find(s => s.type === type)?.bestCount || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            {greeting}, {userName}
          </h1>
          <p className="text-[var(--text-secondary)] mt-1 text-lg">
            Mission: Product Engineer — 2027
          </p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {streaks.map(streak => (
          <StreakBadge 
            key={streak.type} 
            count={streak.currentCount} 
            bestCount={streak.bestCount} 
            label={streak.type.toUpperCase()} 
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 flex flex-col h-full border-l-4 border-l-blue-500">
          <h3 className="font-semibold text-xl mb-4 text-blue-400">DSA Focus</h3>
          {dsaFocusProblem ? (
            <div className="flex-1">
              <p className="text-sm text-[var(--text-secondary)]">Bottleneck Topic: {bottleneckTopic?.name}</p>
              <h4 className="text-lg font-medium mt-2">{dsaFocusProblem.name}</h4>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Pattern: {dsaFocusProblem.pattern}</p>
            </div>
          ) : (
            <div className="flex-1 flex items-center text-sm text-[var(--text-secondary)]">
              No specific problem focus right now.
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-[var(--border)] flex justify-between items-center">
            <span className="text-sm text-[var(--text-secondary)]">Due Revisions</span>
            <span className="font-bold text-lg text-[var(--text-primary)]">{dueRevisions.length}</span>
          </div>
        </Card>

        <Card className="p-5 flex flex-col h-full border-l-4 border-l-purple-500">
          <h3 className="font-semibold text-xl mb-4 text-purple-400">Tech Focus</h3>
          {activeSprint ? (
            <div className="flex-1">
              <p className="text-sm text-[var(--text-secondary)]">{activeSprint.technology} - Week {activeSprint.currentWeek} of {activeSprint.totalWeeks}</p>
              <h4 className="text-lg font-medium mt-2">
                {activeSprint.weeks.find(w => w.weekNumber === activeSprint.currentWeek)?.focus || 'General'}
              </h4>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-sm text-[var(--text-secondary)]">
              <p className="mb-3">No active sprint</p>
              <Button size="sm" onClick={() => window.location.href = '/sprints'}>Create Sprint</Button>
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-[var(--border)] flex justify-between items-center">
            <span className="text-sm text-[var(--text-secondary)]">This week's proof</span>
            <span className="font-bold text-sm text-[var(--text-primary)]">
              {activeSprint ? `${Math.round((activeSprint.weeks.filter(w=>w.completed).length / activeSprint.totalWeeks) * 100)}%` : '0%'}
            </span>
          </div>
        </Card>

        <Card className="p-5 flex flex-col h-full border-l-4 border-l-green-500">
          <h3 className="font-semibold text-xl mb-4 text-green-400">Communication</h3>
          <div className="flex-1 flex items-center justify-center">
            <h4 className="text-lg font-medium text-center">Do a 15 min session</h4>
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--border)] flex justify-center items-center">
             <Button variant="ghost" size="sm" onClick={() => window.location.href = '/communication'}>Log Session</Button>
          </div>
        </Card>
      </div>

    </div>
  );
};
