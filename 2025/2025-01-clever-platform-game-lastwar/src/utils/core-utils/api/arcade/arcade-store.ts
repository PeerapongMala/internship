import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ArcadeState {
  id: string | null;
  playToken: string | null;
}

interface ArcadeAction {
  setId: (id: string | null) => void;
  setPlayToken: (token: string | null) => void;
  clearArcadeStorage: () => void;
}

type ArcadeStore = ArcadeState & ArcadeAction;

export const useArcadeStore = create<ArcadeStore>()(
  persist(
    (set) => ({
      id: null,
      playToken: null,
      setId: (id) => set({ id }),
      setPlayToken: (playToken) => set({ playToken }),
      clearArcadeStorage: () => set({ id: null, playToken: null }),
    }),
    {
      name: 'arcade-storage',
    },
  ),
);
