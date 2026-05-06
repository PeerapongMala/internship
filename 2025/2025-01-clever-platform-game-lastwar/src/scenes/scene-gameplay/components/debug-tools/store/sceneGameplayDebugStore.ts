import { create } from 'zustand';
import * as THREE from 'three';

interface DebugStateValue {
  cameraZoomEnable: boolean;
  cameraRotateEnable: boolean;
  cameraPosition: THREE.Vector3;

  wireframeEnable: boolean;

  roadEnable: boolean;
}

interface DebugState extends DebugStateValue {
  set: <K extends keyof DebugStateValue>(key: K, value: DebugStateValue[K]) => void;
}

export const useDebugStore = create<DebugState>((set) => ({
  cameraPosition: new THREE.Vector3(0, 0, 0),
  cameraZoomEnable: false,
  cameraRotateEnable: false,
  wireframeEnable: true,
  roadEnable: true,
  set: (key, value) => set({ [key]: value }),
}));
