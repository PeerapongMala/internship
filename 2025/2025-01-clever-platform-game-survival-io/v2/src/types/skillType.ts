import * as THREE from 'three';

export interface CharacterData {
  DisplayModel: THREE.Object3D | null;
  mixer: THREE.AnimationMixer | null;
  animations: THREE.AnimationClip[];
}

export enum SkillName {
  ICEBALL = 'ICEBALL',
  RPG = 'RPG',
  FIREBALL = 'FIREBALL',
  DRONE = 'DRONE',
  MOLOTOV = 'MOLOTOV',
  LASER = 'LASER',
}
