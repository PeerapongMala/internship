import { create } from 'zustand';

interface TimerState {
  timeRemaining: number;
  isRunning: boolean;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  updateTime: (delta: number) => void;
}

const GAME_DURATION = 120; // 2 minutes in seconds

export const useTimerStore = create<TimerState>((set) => ({
  timeRemaining: GAME_DURATION,
  isRunning: false,
  startTimer: () => set({ isRunning: true }),
  stopTimer: () => set({ isRunning: false }),
  resetTimer: () => set({ timeRemaining: GAME_DURATION, isRunning: false }),
  updateTime: (delta) =>
    set((state) => ({
      timeRemaining: Math.max(0, state.timeRemaining - delta),
      isRunning: state.timeRemaining > 0 && state.isRunning,
    })),
}));
