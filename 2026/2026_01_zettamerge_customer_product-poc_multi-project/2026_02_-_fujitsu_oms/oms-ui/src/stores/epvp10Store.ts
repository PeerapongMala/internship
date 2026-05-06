import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { VATRefundApplication } from '../types/epvp10';
import { MOCK_APPLICATIONS } from '../mock/epvp10Mock';

interface EPvp10State {
  applications: VATRefundApplication[];
  offlineQueue: VATRefundApplication[];
  isOfflineMode: boolean;
  addApplication: (app: VATRefundApplication) => void;
  updateApplication: (id: string, updates: Partial<VATRefundApplication>) => void;
  addToOfflineQueue: (app: VATRefundApplication) => void;
  syncOffline: () => void;
  setOfflineMode: (offline: boolean) => void;
}

export const useEpvp10Store = create<EPvp10State>()(
  persist(
    (set) => ({
      applications: MOCK_APPLICATIONS,
      offlineQueue: [],
      isOfflineMode: false,

      addApplication: (app) => {
        set((state) => ({ applications: [...state.applications, app] }));
      },

      updateApplication: (id, updates) => {
        set((state) => ({
          applications: state.applications.map((a) =>
            a.id === id ? { ...a, ...updates } : a,
          ),
        }));
      },

      addToOfflineQueue: (app) => {
        set((state) => ({
          offlineQueue: [...state.offlineQueue, { ...app, isOfflineCached: true }],
        }));
      },

      syncOffline: () => {
        set((state) => ({
          applications: [...state.applications, ...state.offlineQueue],
          offlineQueue: [],
        }));
      },

      setOfflineMode: (offline) => set({ isOfflineMode: offline }),
    }),
    { name: 'oms_epvp10' },
  ),
);
