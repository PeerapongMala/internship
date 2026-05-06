import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GlobalState {
  posStatus: 'online' | 'offline';
  userProfile: { name: string; role: string; branch: string };
  networkOnline: boolean;
  setPosStatus: (status: 'online' | 'offline') => void;
  setNetworkOnline: (online: boolean) => void;
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      posStatus: 'online',
      userProfile: { name: 'Admin', role: 'admin', branch: 'Siam Paragon' },
      networkOnline: true,
      setPosStatus: (status) => set({ posStatus: status }),
      setNetworkOnline: (online) => set({ networkOnline: online }),
    }),
    { name: 'oms_global' },
  ),
);
