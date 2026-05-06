import { create } from 'zustand';

export interface WaveConfig {
  duration: number;
  obstacleSpeed: number;
  spawnInterval: number;
  multiplier: number;
}

interface WaveState {
  currentWave: number;
  currentConfig: WaveConfig;
  setWave: (wave: number) => void;
  updateConfig: (config: WaveConfig) => void;
}

const DEFAULT_CONFIG: WaveConfig = {
  duration: 30,
  obstacleSpeed: 0.2,
  spawnInterval: 6000,
  multiplier: 1,
};

export const useWaveStore = create<WaveState>((set) => ({
  currentWave: 0,
  currentConfig: DEFAULT_CONFIG,
  setWave: (wave) => set({ currentWave: wave }),
  updateConfig: (config) => set({ currentConfig: config }),
}));
