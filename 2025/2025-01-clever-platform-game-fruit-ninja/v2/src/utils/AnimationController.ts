import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

interface AnimationOptions {
  loop?: boolean;
  timeScale?: number;
  blendDuration?: number;
  weight?: number;
}

const DEFAULT_ANIMATION_OPTIONS: Required<AnimationOptions> = {
  loop: true,
  timeScale: 1.0,
  blendDuration: 0.5,
  weight: 1.0,
};

export class AnimationController {
  private mixer: THREE.AnimationMixer;
  private currentAction: THREE.AnimationAction | null;
  private animations: Map<string, THREE.AnimationClip>;

  constructor(model: THREE.Object3D) {
    this.mixer = new THREE.AnimationMixer(model);
    this.currentAction = null;
    this.animations = new Map();
  }

  public update(deltaTime: number): void {
    if (this.mixer) {
      this.mixer.update(deltaTime);
    }
  }

  public async loadAnimation(
    name: string,
    url: string,
    _options: AnimationOptions = DEFAULT_ANIMATION_OPTIONS,
  ): Promise<void> {
    try {
      const loader = new FBXLoader();
      const animationData = await new Promise<THREE.Object3D>((resolve, reject) => {
        loader.load(url, resolve, undefined, reject);
      });

      if (animationData.animations.length === 0) {
        throw new Error(`No animations found in file: ${url}`);
      }

      const clip = animationData.animations[0];
      clip.name = name;
      this.animations.set(name, clip);
    } catch (error) {
      console.error(`Error loading animation ${name}:`, error);
      throw error;
    }
  }

  public play(name: string, options: AnimationOptions = DEFAULT_ANIMATION_OPTIONS): void {
    const clip = this.animations.get(name);
    if (!clip) {
      console.error(`Animation not found: ${name}`);
      return;
    }

    const nextAction = this.mixer.clipAction(clip);
    const mergedOptions = { ...DEFAULT_ANIMATION_OPTIONS, ...options };

    nextAction.setLoop(mergedOptions.loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
    nextAction.timeScale = mergedOptions.timeScale;
    nextAction.weight = mergedOptions.weight;

    if (this.currentAction) {
      nextAction.reset().fadeIn(mergedOptions.blendDuration);
      this.currentAction.fadeOut(mergedOptions.blendDuration);
    } else {
      nextAction.reset().play();
    }

    this.currentAction = nextAction;
  }

  public stop(name?: string): void {
    if (name) {
      const clip = this.animations.get(name);
      if (clip) {
        const action = this.mixer.clipAction(clip);
        action.stop();
      }
    } else if (this.currentAction) {
      this.currentAction.stop();
      this.currentAction = null;
    }
  }

  public setTimeScale(timeScale: number): void {
    if (this.currentAction) {
      this.currentAction.timeScale = timeScale;
    }
  }

  public getAnimationNames(): string[] {
    return Array.from(this.animations.keys());
  }

  public hasAnimation(name: string): boolean {
    return this.animations.has(name);
  }

  public dispose(): void {
    this.mixer.stopAllAction();
    this.animations.clear();
    this.currentAction = null;
  }
}
