import { create } from 'zustand';
import * as THREE from 'three';
interface CharacterState {
  boundingBox: THREE.Box3;
  setBoundingBox: (box: THREE.Box3) => void;
  characterPosition: THREE.Vector3;
  setCharacterPosition: (position: THREE.Vector3) => void;

  currentLerp: number;
  setCurrentLerp: (lerp: number) => void;

  // 🎮 Pre-loaded character model
  preloadedModelUrl: string | null;
  setPreloadedModelUrl: (url: string | null) => void;
  isModelLoading: boolean;
  setIsModelLoading: (loading: boolean) => void;
  modelLoadError: string | null;
  setModelLoadError: (error: string | null) => void;
}

export const useCharacterStore = create<CharacterState>((set) => ({
  boundingBox: new THREE.Box3(),
  setBoundingBox: (box) => set({ boundingBox: box }),
  characterPosition: new THREE.Vector3(),
  setCharacterPosition: (position) => set({ characterPosition: position }),
  currentLerp: 0,
  setCurrentLerp: (lerp) => set({ currentLerp: lerp }),

  // 🎮 Pre-loaded character model
  preloadedModelUrl: null,
  setPreloadedModelUrl: (url) => set({ preloadedModelUrl: url }),
  isModelLoading: false,
  setIsModelLoading: (loading) => set({ isModelLoading: loading }),
  modelLoadError: null,
  setModelLoadError: (error) => set({ modelLoadError: error }),
}));
