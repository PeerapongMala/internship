import * as THREE from 'three';

export class ParticleSystem {
  particles: THREE.Sprite[];
  scene: THREE.Scene;
  texture: THREE.Texture | null;
  particleCount: number;
  clock: THREE.Clock;
  emitterPosition: THREE.Vector3;
  active: boolean;
  spriteSheetWidth: number;
  spriteSheetHeight: number;
  currentFrame: number;
  totalFrames: number;
  animationSpeed: number;
  lastFrameUpdate: number;

  constructor(
    scene: THREE.Scene,
    texturePath: string | string[],
    particleCount?: number,
    spriteSheetWidth?: number,
    spriteSheetHeight?: number,
  );

  updateTextureFrame(frameIndex: number): void;
  setPosition(x: number, y: number, z: number): void;
  create(): void;
  showFrame(frameIndex: number): void;
  createThreeJSParticles(): void;
  update(): void;
  dispose(): void;
}
