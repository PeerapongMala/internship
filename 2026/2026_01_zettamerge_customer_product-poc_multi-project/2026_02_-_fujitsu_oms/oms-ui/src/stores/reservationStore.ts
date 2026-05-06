import { create } from 'zustand';
import type { ReservationMode } from '../types';

interface ReservationState {
  mode: ReservationMode;
  setMode: (mode: ReservationMode) => void;
}

export const useReservationStore = create<ReservationState>()((set) => ({
  mode: 'offline',
  setMode: (mode) => set({ mode }),
}));
