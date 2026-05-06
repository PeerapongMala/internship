import * as THREE from 'three';

export interface CharacterData {
  DisplayModel: THREE.Object3D | null;
  mixer: THREE.AnimationMixer | null;
  animations: THREE.AnimationClip[];
}

export interface gameStore {
  currentExp: number;
  currentLevel: number;
  currentCharacter?: CharacterData;
  isGamePaused: boolean;
  isSkillLearnable: boolean;
  gameCurrentWave: number;
  gameCurrentTimeCount: number;
  gameCurrentTimeMax: number;

  gameCurrentWaveSet: (i: number) => void;
  gameCurrentTimeCountSet: (i: number) => void;
  gameCurrentTimeMaxSet: (i: number) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  closeSkillPanel: () => void;
  setExp: (exp: number) => void;
}

export type waveConfig = {
  waveList: waveList[];
};

export type gameConfig = {};

export type waveList = {
  name: string;
  waveDuration: number;
  spawnList: spawnList[];
};

export type spawnList = {
  timeAt: number;
  objectList: objectList[];
};

export type objectList = {
  type: string;
  amount: number;
  statMultiplier?: number;
  scoreMultiplier?: number;
};
