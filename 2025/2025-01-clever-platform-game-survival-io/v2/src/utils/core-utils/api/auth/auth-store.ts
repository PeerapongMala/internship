import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
}

interface AuthAction {
  setAccessToken: (token: string) => void;
  clearAuthStorage: () => void;
}

type AuthStore = AuthState & AuthAction;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),
      clearAuthStorage: () => set({ accessToken: null }),
    }),
    {
      name: 'auth-storage',
    },
  ),
);
