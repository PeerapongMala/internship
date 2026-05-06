import { create } from 'zustand';

interface TimerState {
  elapsedTime: number; // เวลาที่ผ่านไป (นับขึ้น)
  isRunning: boolean;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  updateTime: (delta: number) => void;
}

export const useTimerStore = create<TimerState>((set) => ({
  elapsedTime: 0, // เริ่มจาก 0 วินาที
  isRunning: false,
  startTimer: () => set({ isRunning: true }),
  stopTimer: () => set({ isRunning: false }),
  resetTimer: () => set({ elapsedTime: 0, isRunning: false }),
  updateTime: (delta) =>
    set((state) => ({
      elapsedTime: state.elapsedTime + delta, // นับเวลาขึ้น
    })),
}));
