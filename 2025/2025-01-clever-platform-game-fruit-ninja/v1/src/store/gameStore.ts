import { create } from "zustand";
import * as THREE from "three";
interface GameState {
  gameCurrentWave: number;
  gameCurrentTimeCount: number;
  gameCurrentTimeMax: number;
  gameCurrentScore: number;
  gameTotalTimeUsed: number;
  gameCurrentWaveSet: (i: number) => void;
  gameCurrentTimeCountSet: (i: number) => void;
  gameCurrentTimeMaxSet: (i: number) => void;
  gameCurrentScoreSet: (i:number) => void;
  gameTotalTimeUsedSet: (i: number) => void,

}

export const useGameStore = create<GameState>((set, get) => ({
  gameCurrentWave: 0,
  gameCurrentTimeCount: 0,
  gameCurrentTimeMax: 0,
  gameCurrentScore: 0,
  gameTotalTimeUsed: 0,
  gameTotalTimeUsedSet: (i: number) => set({gameTotalTimeUsed: i}),
  gameCurrentScoreSet: (i: number) => set({gameCurrentScore: i}),
  gameCurrentWaveSet: (i: number) => set({ gameCurrentWave: i }),
  gameCurrentTimeCountSet: (i: number) => set({ gameCurrentTimeCount: i }),
  gameCurrentTimeMaxSet: (i: number) => set({ gameCurrentTimeMax: i }),
}));
