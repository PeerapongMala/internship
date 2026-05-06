import { create } from 'zustand';
import * as THREE from 'three';
interface CharacterState {
  currentLane: 'left' | 'right';
  targetLane: 'left' | 'right';
  setCurrentLane: (lane: 'left' | 'right') => void;
  setTargetLane: (lane: 'left' | 'right') => void;
  boundingBox: THREE.Box3;
  setBoundingBox: (box: THREE.Box3) => void;
  characterPosition: THREE.Vector3;
  setCharacterPosition: (position: THREE.Vector3) => void;

  currentLerp: number;
  setCurrentLerp: (lerp: number) => void;
}

export const useCharacterStore = create<CharacterState>((set) => ({
  currentLane: 'left',
  targetLane: 'left',
  setCurrentLane: (lane) => set({ currentLane: lane }),
  setTargetLane: (lane) => set({ targetLane: lane }),
  boundingBox: new THREE.Box3(),
  setBoundingBox: (box) => set({ boundingBox: box }),
  characterPosition: new THREE.Vector3(),
  setCharacterPosition: (position) => set({ characterPosition: position }),
  currentLerp: 0,
  setCurrentLerp: (lerp) => set({ currentLerp: lerp }),
}));
