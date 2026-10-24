import { describe, it, expect, beforeEach } from 'vitest';
import { useDailyPlannerStore, selectNextTopicForTrack } from './dailyPlannerStore';
import { MASTER_ROADMAP_TOPICS } from '../data/masterRoadmapData';

describe('dailyPlannerStore & Master Roadmap Engine', () => {
  beforeEach(() => {
    useDailyPlannerStore.setState({
      topicProgress: {
        'dsa-01-diagnostic': 'COMPLETED',
        'dsa-02-complexity': 'COMPLETED',
        'dsa-03-arrays-strings': 'COMPLETED',
        'dsa-04-hashing': 'NOT_STARTED',
        'backend-01-java-syntax': 'COMPLETED',
        'backend-02-java-methods-classes': 'COMPLETED',
        'backend-03-java-oop': 'NOT_STARTED',
        'sysdesign-01-internet-dns-http': 'COMPLETED',
        'sysdesign-02-clients-servers': 'NOT_STARTED',
      },
      dailyPlans: {},
    });
  });

  it('generates at most three primary daily tasks (1 DSA, 1 Backend, 1 System Design)', () => {
    const store = useDailyPlannerStore.getState();
    const plan = store.getOrCreatePlanForDate('2026-10-25');

    expect(plan.tasks.length).toBe(3);
    const tracks = plan.tasks.map(t => t.track);
    expect(tracks).toContain('DSA');
    expect(tracks).toContain('BACKEND');
    expect(tracks).toContain('SYSTEM_DESIGN');

    // DSA should be hashing since arrays-strings is completed
    const dsaTask = plan.tasks.find(t => t.track === 'DSA');
    expect(dsaTask?.topicId).toBe('dsa-04-hashing');
    expect(dsaTask?.title).toContain('Hashing');

    // Backend should be Java OOP
    const backendTask = plan.tasks.find(t => t.track === 'BACKEND');
    expect(backendTask?.topicId).toBe('backend-03-java-oop');

    // System Design should be clients-servers
    const sysDesignTask = plan.tasks.find(t => t.track === 'SYSTEM_DESIGN');
    expect(sysDesignTask?.topicId).toBe('sysdesign-02-clients-servers');
  });

  it('respects prerequisites and unlocks topics sequentially', () => {
    // If backend-02 is NOT completed, selecting next backend topic must return backend-02, not backend-03
    const nextSelection = selectNextTopicForTrack('BACKEND', {
      'backend-01-java-syntax': 'COMPLETED',
      'backend-02-java-methods-classes': 'NOT_STARTED',
    });

    expect(nextSelection?.topic.id).toBe('backend-02-java-methods-classes');
  });

  it('prioritizes in-progress topic before picking new topics', () => {
    const nextSelection = selectNextTopicForTrack('DSA', {
      'dsa-01-diagnostic': 'COMPLETED',
      'dsa-02-complexity': 'COMPLETED',
      'dsa-03-arrays-strings': 'IN_PROGRESS',
      'dsa-04-hashing': 'NOT_STARTED',
    });

    expect(nextSelection?.topic.id).toBe('dsa-03-arrays-strings');
    expect(nextSelection?.reason).toContain('Continuing in-progress topic');
  });

  it('toggles task completion and updates completion count and topic progress', () => {
    const store = useDailyPlannerStore.getState();
    const plan = store.getOrCreatePlanForDate('2026-10-25');
    const dsaTaskId = plan.tasks.find(t => t.track === 'DSA')!.id;

    expect(plan.overallCompletedCount).toBe(0);

    // Toggle complete
    store.toggleTaskComplete('2026-10-25', dsaTaskId);

    const summary = store.getCompletionSummary('2026-10-25');
    expect(summary.dsaCompleted).toBe(true);
    expect(summary.completedCount).toBe(1);
    expect(summary.backendCompleted).toBe(false);

    // Topic progress should reflect completed
    expect(store.getTopicStatus('dsa-04-hashing')).toBe('COMPLETED');
  });

  it('handles incomplete tasks by carrying them over to the next day without duplicates', () => {
    const store = useDailyPlannerStore.getState();
    
    // Day 1: October 24
    const day1Plan = store.getOrCreatePlanForDate('2026-10-24');
    const dsaTaskDay1 = day1Plan.tasks.find(t => t.track === 'DSA')!;
    
    // Mark only DSA completed on Day 1; leave Backend and System Design incomplete
    store.toggleTaskComplete('2026-10-24', dsaTaskDay1.id);

    // Day 2: October 25
    const day2Plan = store.getOrCreatePlanForDate('2026-10-25');

    // Day 2 should still have exactly 3 tasks
    expect(day2Plan.tasks.length).toBe(3);

    // Backend task should be carried over from Day 1 because it was incomplete
    const backendDay2 = day2Plan.tasks.find(t => t.track === 'BACKEND')!;
    expect(backendDay2.topicId).toBe('backend-03-java-oop');
    expect(backendDay2.isCarriedOver).toBe(true);
    expect(backendDay2.selectionReason).toContain('Carried over from 2026-10-24');

    // DSA was completed on Day 1, so DSA on Day 2 should advance to the next topic (Two Pointers)
    const dsaDay2 = day2Plan.tasks.find(t => t.track === 'DSA')!;
    expect(dsaDay2.topicId).toBe('dsa-05-two-pointers');
    expect(dsaDay2.isCarriedOver).toBe(false);
  });

  it('allows manual topic override for any track', () => {
    const store = useDailyPlannerStore.getState();
    store.getOrCreatePlanForDate('2026-10-25');

    store.manuallySetTrackTopic('2026-10-25', 'BACKEND', 'backend-21-spring-ecosystem-di');

    const updatedPlan = store.getOrCreatePlanForDate('2026-10-25');
    const backendTask = updatedPlan.tasks.find(t => t.track === 'BACKEND');
    expect(backendTask?.topicId).toBe('backend-21-spring-ecosystem-di');
    expect(backendTask?.title).toContain('Spring Framework Core');
  });

  it('preserves history across dates', () => {
    const store = useDailyPlannerStore.getState();
    store.getOrCreatePlanForDate('2026-10-23');
    store.getOrCreatePlanForDate('2026-10-24');
    store.getOrCreatePlanForDate('2026-10-25');

    const history = store.getPastHistory();
    expect(history.length).toBe(3);
    expect(history[0].date).toBe('2026-10-25');
    expect(history[1].date).toBe('2026-10-24');
    expect(history[2].date).toBe('2026-10-23');
  });
});
