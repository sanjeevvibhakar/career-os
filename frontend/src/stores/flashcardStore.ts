import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FLASHCARDS_DATA } from '../data/flashcardsData';
import type { Flashcard } from '../data/flashcardsData';

export type FlashcardRating = 'AGAIN' | 'HARD' | 'GOOD' | 'EASY';

export interface CardReviewState {
  cardId: string;
  reviewCount: number;
  streak: number;
  lastRating: FlashcardRating;
  lastReviewedAt: string;
  nextReviewDate: string; // YYYY-MM-DD
}

interface FlashcardStoreState {
  cards: Flashcard[];
  reviewStates: Record<string, CardReviewState>;
  
  recordReview: (cardId: string, rating: FlashcardRating) => void;
  getCardState: (cardId: string) => CardReviewState | undefined;
  getMasteredCount: () => number;
  getDueCardsCount: () => number;
  resetProgress: () => void;
}

export const useFlashcardStore = create<FlashcardStoreState>()(
  persist(
    (set, get) => ({
      cards: FLASHCARDS_DATA,
      reviewStates: {},

      recordReview: (cardId: string, rating: FlashcardRating) => {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const existing = get().reviewStates[cardId] || {
          cardId,
          reviewCount: 0,
          streak: 0,
          lastRating: 'AGAIN',
          lastReviewedAt: todayStr,
          nextReviewDate: todayStr,
        };

        let daysToAdd = 1;
        let nextStreak = existing.streak;

        switch (rating) {
          case 'AGAIN':
            daysToAdd = 0; // due today/immediately
            nextStreak = 0;
            break;
          case 'HARD':
            daysToAdd = 2;
            nextStreak = Math.max(1, existing.streak);
            break;
          case 'GOOD':
            daysToAdd = 5;
            nextStreak = existing.streak + 1;
            break;
          case 'EASY':
            daysToAdd = 14;
            nextStreak = existing.streak + 2;
            break;
        }

        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + daysToAdd);
        const nextReviewDateStr = nextDate.toISOString().split('T')[0];

        const updated: CardReviewState = {
          cardId,
          reviewCount: existing.reviewCount + 1,
          streak: nextStreak,
          lastRating: rating,
          lastReviewedAt: todayStr,
          nextReviewDate: nextReviewDateStr,
        };

        set({
          reviewStates: {
            ...get().reviewStates,
            [cardId]: updated,
          },
        });
      },

      getCardState: (cardId: string) => {
        return get().reviewStates[cardId];
      },

      getMasteredCount: () => {
        const states = Object.values(get().reviewStates);
        return states.filter(s => s.streak >= 2 || s.lastRating === 'EASY').length;
      },

      getDueCardsCount: () => {
        const todayStr = new Date().toISOString().split('T')[0];
        const { cards, reviewStates } = get();
        return cards.filter(c => {
          const s = reviewStates[c.id];
          if (!s) return true; // never reviewed
          return s.nextReviewDate <= todayStr;
        }).length;
      },

      resetProgress: () => {
        set({ reviewStates: {} });
      },
    }),
    {
      name: 'career-os-flashcards',
    }
  )
);
