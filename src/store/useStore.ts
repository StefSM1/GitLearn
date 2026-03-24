import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressTracker {
  repoId: string;
  completedSections: number;
  totalSections: number;
}

interface AppState {
  learningProgress: Record<string, ProgressTracker>;
  updateProgress: (repoId: string, completed: number, total: number) => void;
  // We can expand this with quiz scores and practice completions
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      learningProgress: {},
      updateProgress: (repoId, completed, total) =>
        set((state) => ({
          learningProgress: {
            ...state.learningProgress,
            [repoId]: { repoId, completedSections: completed, totalSections: total },
          },
        })),
    }),
    {
      name: 'github-learning-storage',
    }
  )
);
