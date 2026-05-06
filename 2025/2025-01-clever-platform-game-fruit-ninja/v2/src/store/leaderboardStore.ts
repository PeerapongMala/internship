import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Player {
  id: string;
  score: number;
  timestamp: number;
  lastCountdownTime?: number;
}

interface LeaderboardState {
  currentPlayer: Player | null;
  leaderboard: Player[];
  createNewPlayer: () => void;
  updateScore: (score: number) => void;
  updateCountdownTime: (time: number) => void;
  addToLeaderboard: (player: Player) => void;
  clearCurrentPlayer: () => void;
}

export const useLeaderboardStore = create<LeaderboardState>()(
  persist(
    (set) => ({
      currentPlayer: null,
      leaderboard: [],
      createNewPlayer: () =>
        set({
          currentPlayer: {
            id: Date.now().toString(),
            score: 0,
            timestamp: Date.now(),
            lastCountdownTime: 0,
          },
        }),
      updateScore: (score) =>
        set((state) => ({
          currentPlayer: state.currentPlayer ? { ...state.currentPlayer, score } : null,
        })),
      updateCountdownTime: (time) =>
        set((state) => ({
          currentPlayer: state.currentPlayer
            ? { ...state.currentPlayer, lastCountdownTime: time }
            : null,
        })),
      addToLeaderboard: (player) =>
        set((state) => ({
          leaderboard: [...state.leaderboard, player]
            .sort((a, b) => b.score - a.score)
            .slice(0, 10), // Keep top 10 scores
        })),
      clearCurrentPlayer: () => set({ currentPlayer: null }),
    }),
    {
      name: 'game-leaderboard',
    },
  ),
);
