import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';

const today = () => format(new Date(), 'yyyy-MM-dd');

export const useStore = create(
  persist(
    (set, get) => ({
      // === HABITS ===
      habits: [],
      habitLogs: {}, // { habitId: { 'yyyy-MM-dd': true } }

      addHabit: (habit) =>
        set((s) => ({
          habits: [
            ...s.habits,
            { id: crypto.randomUUID(), createdAt: today(), streak: 0, ...habit },
          ],
        })),

      deleteHabit: (id) =>
        set((s) => ({
          habits: s.habits.filter((h) => h.id !== id),
        })),

      toggleHabit: (id) => {
        const date = today();
        set((s) => {
          const logs = s.habitLogs[id] || {};
          const done = !logs[date];
          return {
            habitLogs: { ...s.habitLogs, [id]: { ...logs, [date]: done } },
          };
        });
      },

      isHabitDoneToday: (id) => {
        const logs = get().habitLogs[id] || {};
        return !!logs[today()];
      },

      getHabitStreak: (id) => {
        const logs = get().habitLogs[id] || {};
        let streak = 0;
        let d = new Date();
        while (true) {
          const key = format(d, 'yyyy-MM-dd');
          if (logs[key]) {
            streak++;
            d.setDate(d.getDate() - 1);
          } else break;
        }
        return streak;
      },

      // === GOALS ===
      goals: [],

      addGoal: (goal) =>
        set((s) => ({
          goals: [
            ...s.goals,
            {
              id: crypto.randomUUID(),
              createdAt: today(),
              progress: 0,
              completed: false,
              ...goal,
            },
          ],
        })),

      updateGoalProgress: (id, progress) =>
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === id
              ? { ...g, progress, completed: progress >= 100 }
              : g
          ),
        })),

      deleteGoal: (id) =>
        set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),

      // === JOURNAL ===
      journals: [],

      addJournalEntry: (entry) =>
        set((s) => ({
          journals: [
            { id: crypto.randomUUID(), date: today(), ...entry },
            ...s.journals,
          ],
        })),

      deleteJournalEntry: (id) =>
        set((s) => ({ journals: s.journals.filter((j) => j.id !== id) })),
    }),
    { name: 'god-tracker-storage' }
  )
);
