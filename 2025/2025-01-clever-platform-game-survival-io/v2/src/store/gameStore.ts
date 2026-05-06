import { create } from 'zustand';
import { SceneName } from '../types/game';
import { useSceneGameplayStore } from '../scenes/scene-gameplay/sceneGameplayStore';

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

  closeSkillPanel: () => void;

  // gameCurrentWave: number;
  // gameCurrentTimeCount: number;
  // gameCurrentTimeMax: number;
  gameCurrentScore: number;
  gameTotalTimeUsed: number;
  gameCurrentWaveSet: (i: number) => void;
  gameCurrentTimeCountSet: (i: number) => void;
  gameCurrentTimeMaxSet: (i: number) => void;
  gameCurrentScoreSet: (i: number) => void;
  gameTotalTimeUsedSet: (i: number) => void;

  currentExp: number;
  currentLevel: number;
  isGamePaused: boolean;
  gameCurrentWave: number;
  gameCurrentTimeCount: number;
  gameCurrentTimeMax: number;
  isSkillLearnable: boolean;
}

export const useGameStore = create<GameStore>((set, get) => ({
  currentScene: SceneName.MENU,
  score: 0,
  characterChoice: 1,
  leaderboard: [],
  isInitialized: false,
  isPlaying: false,
  burstCount: 1,
  burstSpeed: 0,
  projectileRange: 250,
  projectileSpeed: 2,
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
      projectileSpeed: 2,
    });
  },
  // pauseGame: () => set({ isPlaying: false }),
  // resumeGame: () => set({ isPlaying: true }),
  resetGame: () =>
    set({
      // currentScene: "menu",
      isInitialized: false,
      isPlaying: false,
      score: 0,
      burstCount: 1,
      burstSpeed: 0,
      projectileRange: 250,
      projectileSpeed: 2,
    }),
  setInitialized: (initialized: boolean) => set({ isInitialized: initialized }),
  setPlaying: (playing: boolean) => set({ isPlaying: playing }),
  setCurrentScene: (scene: string) => set({ currentScene: scene }),

  // gameCurrentWave: 0,
  // gameCurrentTimeCount: 0,
  // gameCurrentTimeMax: 0,
  gameCurrentScore: 0,
  gameTotalTimeUsed: 0,
  gameTotalTimeUsedSet: (i: number) => set({ gameTotalTimeUsed: i }),
  gameCurrentScoreSet: (i: number) => set({ gameCurrentScore: i }),
  // gameCurrentWaveSet: (i: number) => set({ gameCurrentWave: i }),
  // gameCurrentTimeCountSet: (i: number) => set({ gameCurrentTimeCount: i }),
  // gameCurrentTimeMaxSet: (i: number) => set({ gameCurrentTimeMax: i }),

  currentExp: 0,
  currentLevel: 1,
  isGamePaused: false,
  gameCurrentWave: 0,
  gameCurrentTimeCount: 0,
  gameCurrentTimeMax: 0,
  isSkillLearnable: false,
  gameCurrentWaveSet: (i: number) => set({ gameCurrentWave: i }),
  gameCurrentTimeCountSet: (i: number) => set({ gameCurrentTimeCount: i }),
  gameCurrentTimeMaxSet: (i: number) => set({ gameCurrentTimeMax: i }),
  setExp: (exp: number) => {
    const newExp = get().currentExp + exp;
    set({ currentExp: newExp });

    // Sync to sceneGameplayStore for HUD display
    const sceneStore = useSceneGameplayStore.getState();

    if (newExp >= get().currentLevel * 50) {
      console.log('Level Up');
      const newLevel = get().currentLevel + 1;
      set({ currentExp: 0, currentLevel: newLevel });

      // Sync level up to sceneGameplayStore
      sceneStore.setProps({ exp: 0, level: newLevel });

      console.log('Setting game pause');
      set({ isGamePaused: true, isSkillLearnable: true });
    } else {
      // Sync current exp to sceneGameplayStore
      sceneStore.setProps({ exp: newExp });
    }
  },
  pauseGame: () => {
    set({ isGamePaused: true });
  },

  resumeGame: () => {
    set({ isGamePaused: false });
  },
  closeSkillPanel: () => {
    set({ isSkillLearnable: false, isGamePaused: false }); // Close skill panel when game resumes
  },
}));
