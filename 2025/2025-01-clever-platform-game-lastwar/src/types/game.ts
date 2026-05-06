import * as THREE from 'three';

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface CharacterData {
  DisplayModel: THREE.Object3D | null;
  mixer: THREE.AnimationMixer | null;
  animations: THREE.AnimationClip[];
}

export enum SceneName {
  WORKSPACE = 'WORKSPACE',
  MENU = 'MENU',
  GAME = 'GAME',
  SCORE = 'SCORE',
  LOGIN = 'LOGIN',
}

export interface GameState {
  currentScene: SceneName;
  score: number;
  characterChoice: number;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
}
