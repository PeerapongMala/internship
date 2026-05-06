import { create } from 'zustand';
import { SceneName } from '@/types/game';

export interface GameStore {
  currentScene: string;
  score: number;
  characterChoice: number;
  leaderboard: any[];
  isInitialized: boolean;
  isPlaying: boolean;
  burstCount: number;
  burstSpeed: number;
  projectileRange: number;
  projectileSpeed: number;
  setScene: (scene: string) => void;
  setScore: (score: number) => void;
  setCharacterChoice: (choice: number) => void;
  setBurstCount: (count: number) => void;
  setBurstSpeed: (speed: number) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  setInitialized: (initialized: boolean) => void;
  setPlaying: (playing: boolean) => void;
  setCurrentScene: (scene: string) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  currentScene: SceneName.MENU,
  score: 0,
  characterChoice: 1,
  leaderboard: [],
  isInitialized: false,
  isPlaying: false,
  burstCount: 1,
  burstSpeed: 0,
  projectileRange: 250,
  projectileSpeed: 1,
  setProjectileSpeed: (Speed: number) => set({ projectileSpeed: Speed }),
  setprojectileRange: (Range: number) => set({ projectileRange: Range }),
  setScene: (scene) => {
    set({ currentScene: scene });
    if (scene === SceneName.GAME) {
      set({ isInitialized: true, isPlaying: true });
    }
  },
  setScore: (score) => set({ score }),
  setCharacterChoice: (choice) => set({ characterChoice: choice }),
  setBurstCount: (count) => set({ burstCount: count }),
  setBurstSpeed: (speed) => set({ burstSpeed: speed }),
  startGame: () => {
    set({
      // currentScene: "game",
      isInitialized: true,
      isPlaying: true,
      score: 0,
      burstCount: 1,
      burstSpeed: 0,
      projectileRange: 250,
      projectileSpeed: 1,
    });
  },
  pauseGame: () => set({ isPlaying: false }),
  resumeGame: () => set({ isPlaying: true }),
  resetGame: () =>
    set({
      // currentScene: "menu",
      isInitialized: false,
      isPlaying: false,
      score: 0,
      burstCount: 1,
      burstSpeed: 0,
      projectileRange: 250,
      projectileSpeed: 1,
    }),
  setInitialized: (initialized: boolean) => set({ isInitialized: initialized }),
  setPlaying: (playing: boolean) => set({ isPlaying: playing }),
  setCurrentScene: (scene: string) => set({ currentScene: scene }),
}));
