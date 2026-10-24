import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  MASTER_ROADMAP_TOPICS, 
  type MasterRoadmapTopic, 
  type RoadmapTrack, 
  type TopicStatus 
} from '../data/masterRoadmapData';
import { useDsaStore } from './dsaStore';

export interface DailyTaskItem {
  id: string;
  track: RoadmapTrack;
  trackLabel: string;
  topicId: string;
  title: string;
  subtitle: string;
  duration: string;
  estimatedDurationMin: number;
  whatToLearn: string;
  whyItMatters: string;
  resourceOrExercise: string;
  completionCriteria: string;
  status: TopicStatus;
  note?: string;
  actionRoute: string;
  selectionReason: string;
  isCarriedOver?: boolean;
}

export interface DailyPlanRecord {
  date: string; // YYYY-MM-DD
  tasks: DailyTaskItem[];
  overallCompletedCount: number;
  totalCount: number;
  isComplete: boolean;
  generatedAt: string;
  notes?: string;
}

export interface DailyPlannerState {
  topicProgress: Record<string, TopicStatus>;
  dailyPlans: Record<string, DailyPlanRecord>;
  
  // Actions
  getOrCreatePlanForDate: (dateStr?: string) => DailyPlanRecord;
  toggleTaskComplete: (dateStr: string, taskId: string) => void;
  updateTaskStatus: (dateStr: string, taskId: string, status: TopicStatus, note?: string) => void;
  manuallySetTrackTopic: (dateStr: string, track: RoadmapTrack, topicId: string) => void;
  getCompletionSummary: (dateStr?: string) => {
    hasDsaTask: boolean;
    hasBackendTask: boolean;
    hasSystemDesignTask: boolean;
    dsaCompleted: boolean;
    backendCompleted: boolean;
    systemDesignCompleted: boolean;
    completedCount: number;
    totalCount: number;
    tasks: DailyTaskItem[];
  };
  getPastHistory: (limit?: number) => DailyPlanRecord[];
  resetPlanForDate: (dateStr: string) => DailyPlanRecord;
  markTopicMastered: (topicId: string, mastered: boolean) => void;
  getTopicStatus: (topicId: string) => TopicStatus;
}

// Helper to get track route
export function getRouteForTrack(track: RoadmapTrack): string {
  switch (track) {
    case 'DSA':
      return '/dsa';
    case 'BACKEND':
      return '/backend';
    case 'SYSTEM_DESIGN':
      return '/system-design';
  }
}

// Helper to get friendly track name
export function getLabelForTrack(track: RoadmapTrack): string {
  switch (track) {
    case 'DSA':
      return 'DSA';
    case 'BACKEND':
      return 'Backend Engineering';
    case 'SYSTEM_DESIGN':
      return 'System Design';
  }
}

// Helper to get previous date string (UTC safe to prevent timezone skew)
export function getPreviousDateStr(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().split('T')[0];
}

// Helper to determine next candidate topic for a track respecting prerequisites
export function selectNextTopicForTrack(
  track: RoadmapTrack,
  topicProgress: Record<string, TopicStatus>
): { topic: MasterRoadmapTopic; reason: string } | null {
  const trackTopics = MASTER_ROADMAP_TOPICS
    .filter(t => t.track === track)
    .sort((a, b) => a.order - b.order);

  // 1. Check if there is an IN_PROGRESS topic
  const inProgress = trackTopics.find(t => topicProgress[t.id] === 'IN_PROGRESS');
  if (inProgress) {
    return {
      topic: inProgress,
      reason: `Continuing in-progress topic in ${inProgress.stage}: ${inProgress.title}`,
    };
  }

  // 2. Find the first topic not completed whose prerequisites are satisfied
  for (const topic of trackTopics) {
    const status = topicProgress[topic.id] || 'NOT_STARTED';
    if (status === 'COMPLETED') {
      continue;
    }

    // Check prerequisites
    const unmetPrereqs = topic.prerequisites.filter(pId => topicProgress[pId] !== 'COMPLETED');
    if (unmetPrereqs.length === 0) {
      return {
        topic,
        reason: `Next scheduled curriculum milestone in ${topic.stage} (${topic.phaseName})`,
      };
    } else {
      // Find the first unmet prerequisite topic if it belongs to this track
      const firstUnmet = trackTopics.find(t => t.id === unmetPrereqs[0]);
      if (firstUnmet && topicProgress[firstUnmet.id] !== 'COMPLETED') {
        const unmetOfFirst = firstUnmet.prerequisites.filter(pId => topicProgress[pId] !== 'COMPLETED');
        if (unmetOfFirst.length === 0) {
          return {
            topic: firstUnmet,
            reason: `Required prerequisite before '${topic.title}' can be unlocked`,
          };
        }
      }
      // If unmet prerequisites are outside track or not yet unlocked, do not skip ahead
      return null;
    }
  }

  // If all completed, return the last topic for revision
  if (trackTopics.length > 0) {
    const last = trackTopics[trackTopics.length - 1];
    return {
      topic: last,
      reason: `All topics completed in this track. Advanced revision on ${last.title}`,
    };
  }

  return null;
}

export const useDailyPlannerStore = create<DailyPlannerState>()(
  persist(
    (set, get) => ({
      topicProgress: {
        // Initial defaults reflecting previous experience
        'dsa-01-diagnostic': 'COMPLETED',
        'dsa-02-complexity': 'COMPLETED',
        'dsa-03-arrays-strings': 'COMPLETED',
        'dsa-04-hashing': 'IN_PROGRESS',
        'backend-01-java-syntax': 'COMPLETED',
        'backend-02-java-methods-classes': 'COMPLETED',
        'backend-03-java-oop': 'IN_PROGRESS',
        'sysdesign-01-internet-dns-http': 'COMPLETED',
        'sysdesign-02-clients-servers': 'IN_PROGRESS',
      },
      dailyPlans: {},

      getTopicStatus: (topicId: string) => {
        return get().topicProgress[topicId] || 'NOT_STARTED';
      },

      markTopicMastered: (topicId: string, mastered: boolean) => {
        set(state => ({
          topicProgress: {
            ...state.topicProgress,
            [topicId]: mastered ? 'COMPLETED' : 'NOT_STARTED',
          },
        }));
      },

      getOrCreatePlanForDate: (dateStr?: string) => {
        const targetDate = dateStr || new Date().toISOString().split('T')[0];
        const existing = get().dailyPlans[targetDate];
        if (existing) {
          return existing;
        }

        const state = get();
        // Look up the most recent recorded plan strictly prior to targetDate to handle missed days
        const pastDates = Object.keys(state.dailyPlans)
          .filter(d => d < targetDate)
          .sort((a, b) => b.localeCompare(a));
        const latestPastPlan = pastDates.length > 0 ? state.dailyPlans[pastDates[0]] : undefined;

        const tracks: RoadmapTrack[] = ['DSA', 'BACKEND', 'SYSTEM_DESIGN'];
        const tasks: DailyTaskItem[] = [];

        // For DSA, check if there's a due revision in dsaStore
        let dsaRevisionDue: { problemName: string; pattern: string; difficulty: string } | null = null;
        try {
          const dsaStore = useDsaStore.getState();
          const revisions = dsaStore.getDueRevisions();
          if (revisions && revisions.length > 0) {
            dsaRevisionDue = {
              problemName: revisions[0].problemName,
              pattern: revisions[0].pattern,
              difficulty: revisions[0].difficulty,
            };
          }
        } catch {
          // ignore if store not yet ready
        }

        for (const track of tracks) {
          // Rule 1: Check if the most recent active plan had an incomplete task for this track that should be carried over
          let carriedOverTask: DailyTaskItem | undefined;
          if (latestPastPlan) {
            const prevTrackTask = latestPastPlan.tasks.find(t => t.track === track);
            if (prevTrackTask && prevTrackTask.status !== 'COMPLETED') {
              carriedOverTask = {
                ...prevTrackTask,
                id: `task-${track.toLowerCase()}-${targetDate}`,
                isCarriedOver: true,
                selectionReason: `Carried over from ${latestPastPlan.date} (${prevTrackTask.status.toLowerCase()}): Continue work without losing progress`,
              };
            }
          }

          if (carriedOverTask) {
            tasks.push(carriedOverTask);
            continue;
          }

          // Rule 2: Select next deterministic roadmap topic
          const nextSelection = selectNextTopicForTrack(track, state.topicProgress);
          if (nextSelection) {
            const { topic, reason } = nextSelection;
            const primaryResource = topic.resources[0]?.title || 'Core Syllabus Lesson';
            const primaryExercise = topic.practiceExercises[0]?.title 
              ? `${topic.practiceExercises[0].title}: ${topic.practiceExercises[0].description}`
              : 'Implement practical code example and verify test coverage.';

            let taskTitle = topic.title;
            let selectionReason = reason;

            // Pair DSA with spaced repetition revision if due
            if (track === 'DSA' && dsaRevisionDue) {
              taskTitle = `${topic.title} & Due Revision: ${dsaRevisionDue.problemName}`;
              selectionReason = `Spaced Repetition: 1 problem due for review (${dsaRevisionDue.problemName} • ${dsaRevisionDue.pattern}) + active topic`;
            }

            tasks.push({
              id: `task-${track.toLowerCase()}-${targetDate}`,
              track,
              trackLabel: getLabelForTrack(track),
              topicId: topic.id,
              title: taskTitle,
              subtitle: `${topic.stage} • ${topic.phaseName}`,
              duration: topic.estimatedEffort,
              estimatedDurationMin: topic.estimatedMinutes,
              whatToLearn: topic.shortExplanation,
              whyItMatters: topic.whyItMatters,
              resourceOrExercise: `${primaryResource} • Practice: ${primaryExercise}`,
              completionCriteria: topic.completionCriteria.join('; '),
              status: state.topicProgress[topic.id] === 'IN_PROGRESS' ? 'IN_PROGRESS' : 'NOT_STARTED',
              actionRoute: getRouteForTrack(track),
              selectionReason,
              isCarriedOver: false,
            });
          }
        }

        const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;
        const newPlan: DailyPlanRecord = {
          date: targetDate,
          tasks,
          overallCompletedCount: completedCount,
          totalCount: tasks.length,
          isComplete: tasks.length > 0 && completedCount === tasks.length,
          generatedAt: new Date().toISOString(),
        };

        set(s => ({
          dailyPlans: {
            ...s.dailyPlans,
            [targetDate]: newPlan,
          },
        }));

        return newPlan;
      },

      toggleTaskComplete: (dateStr: string, taskId: string) => {
        set(state => {
          const plan = state.dailyPlans[dateStr];
          if (!plan) return state;

          const updatedTasks = plan.tasks.map(task => {
            if (task.id === taskId) {
              const nextStatus: TopicStatus = task.status === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED';
              return { ...task, status: nextStatus };
            }
            return task;
          });

          const completedCount = updatedTasks.filter(t => t.status === 'COMPLETED').length;
          const targetTask = plan.tasks.find(t => t.id === taskId);
          const nextTopicProgress = { ...state.topicProgress };

          if (targetTask) {
            const nextStatus = targetTask.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
            nextTopicProgress[targetTask.topicId] = nextStatus;
          }

          const updatedPlan: DailyPlanRecord = {
            ...plan,
            tasks: updatedTasks,
            overallCompletedCount: completedCount,
            isComplete: updatedTasks.length > 0 && completedCount === updatedTasks.length,
          };

          return {
            dailyPlans: {
              ...state.dailyPlans,
              [dateStr]: updatedPlan,
            },
            topicProgress: nextTopicProgress,
          };
        });
      },

      updateTaskStatus: (dateStr: string, taskId: string, status: TopicStatus, note?: string) => {
        set(state => {
          const plan = state.dailyPlans[dateStr];
          if (!plan) return state;

          const updatedTasks = plan.tasks.map(task => {
            if (task.id === taskId) {
              return { ...task, status, note: note !== undefined ? note : task.note };
            }
            return task;
          });

          const completedCount = updatedTasks.filter(t => t.status === 'COMPLETED').length;
          const targetTask = plan.tasks.find(t => t.id === taskId);
          const nextTopicProgress = { ...state.topicProgress };

          if (targetTask) {
            nextTopicProgress[targetTask.topicId] = status;
          }

          const updatedPlan: DailyPlanRecord = {
            ...plan,
            tasks: updatedTasks,
            overallCompletedCount: completedCount,
            isComplete: updatedTasks.length > 0 && completedCount === updatedTasks.length,
          };

          return {
            dailyPlans: {
              ...state.dailyPlans,
              [dateStr]: updatedPlan,
            },
            topicProgress: nextTopicProgress,
          };
        });
      },

      manuallySetTrackTopic: (dateStr: string, track: RoadmapTrack, topicId: string) => {
        const topic = MASTER_ROADMAP_TOPICS.find(t => t.id === topicId);
        if (!topic) return;

        set(state => {
          const plan = state.dailyPlans[dateStr] || get().getOrCreatePlanForDate(dateStr);
          const primaryResource = topic.resources[0]?.title || 'Core Syllabus Lesson';
          const primaryExercise = topic.practiceExercises[0]?.title 
            ? `${topic.practiceExercises[0].title}: ${topic.practiceExercises[0].description}`
            : 'Implement practical code example and verify test coverage.';

          const updatedTasks = plan.tasks.filter(t => t.track !== track);
          updatedTasks.push({
            id: `task-${track.toLowerCase()}-${dateStr}`,
            track,
            trackLabel: getLabelForTrack(track),
            topicId: topic.id,
            title: topic.title,
            subtitle: `${topic.stage} • ${topic.phaseName}`,
            duration: topic.estimatedEffort,
            estimatedDurationMin: topic.estimatedMinutes,
            whatToLearn: topic.shortExplanation,
            whyItMatters: topic.whyItMatters,
            resourceOrExercise: `${primaryResource} • Practice: ${primaryExercise}`,
            completionCriteria: topic.completionCriteria.join('; '),
            status: state.topicProgress[topic.id] || 'NOT_STARTED',
            actionRoute: getRouteForTrack(track),
            selectionReason: `Manually selected: ${topic.title}`,
            isCarriedOver: false,
          });

          // Sort by track order
          const trackOrder: Record<RoadmapTrack, number> = { DSA: 1, BACKEND: 2, SYSTEM_DESIGN: 3 };
          updatedTasks.sort((a, b) => trackOrder[a.track] - trackOrder[b.track]);

          const completedCount = updatedTasks.filter(t => t.status === 'COMPLETED').length;
          const updatedPlan: DailyPlanRecord = {
            ...plan,
            tasks: updatedTasks,
            overallCompletedCount: completedCount,
            isComplete: updatedTasks.length > 0 && completedCount === updatedTasks.length,
          };

          return {
            dailyPlans: {
              ...state.dailyPlans,
              [dateStr]: updatedPlan,
            },
          };
        });
      },

      getCompletionSummary: (dateStr?: string) => {
        const targetDate = dateStr || new Date().toISOString().split('T')[0];
        const plan = get().getOrCreatePlanForDate(targetDate);
        const dsaTask = plan.tasks.find(t => t.track === 'DSA');
        const backendTask = plan.tasks.find(t => t.track === 'BACKEND');
        const systemDesignTask = plan.tasks.find(t => t.track === 'SYSTEM_DESIGN');

        return {
          hasDsaTask: !!dsaTask,
          hasBackendTask: !!backendTask,
          hasSystemDesignTask: !!systemDesignTask,
          dsaCompleted: dsaTask?.status === 'COMPLETED',
          backendCompleted: backendTask?.status === 'COMPLETED',
          systemDesignCompleted: systemDesignTask?.status === 'COMPLETED',
          completedCount: plan.overallCompletedCount,
          totalCount: plan.totalCount,
          tasks: plan.tasks,
        };
      },

      getPastHistory: (limit = 14) => {
        const plans = Object.values(get().dailyPlans);
        plans.sort((a, b) => b.date.localeCompare(a.date));
        return plans.slice(0, limit);
      },

      resetPlanForDate: (dateStr: string) => {
        set(state => {
          const nextPlans = { ...state.dailyPlans };
          delete nextPlans[dateStr];
          return { dailyPlans: nextPlans };
        });
        return get().getOrCreatePlanForDate(dateStr);
      },
    }),
    {
      name: 'career-os-daily-execution',
    }
  )
);
