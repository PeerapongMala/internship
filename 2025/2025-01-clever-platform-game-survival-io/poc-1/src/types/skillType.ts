import * as THREE from "three";

export interface CharacterData {
  DisplayModel: THREE.Object3D | null;
  mixer: THREE.AnimationMixer | null;
  animations: THREE.AnimationClip[];
}

export interface skillStore {
    currentFireballLevel: number,
    currentIceBallLevel: number,
    currentRPGLevel: number,
    currentMolotovLevel: number,
    currentDroneLevel: number
    currentLaserLevel: number
    resetSkill: () => void

    setLaserLevel: (level: number) => void
    setRPGLevel: (level: number) => void
    setFireballLevel: (level: number) => void
    setIceBallLevel: (level: number) => void
    setMolotovLevel: (level: number) => void
    setDroneLevel: (level: number) => void
}
