// pet-blob-loader.ts

import { StoreModelFileMethods } from '@global/store/global/avatar-models/index';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import {
  LoadCharacter,
  getAnimationName,
} from '../../code/atom/cc-a-model-loader/petBlobAssetLoader';

// Interface for cached model results
interface ModelResult {
  blob?: Blob;
  size?: number;
  type?: string;
  lastModified?: number;
  [key: string]: any;
}

export class CAThreeModel {
  // Initialize properties with default values
  model!: THREE.Group | THREE.Mesh;
  loader: THREE.Loader = new FBXLoader();
  mixer!: THREE.AnimationMixer;
  shouldRotating: boolean = false;

  /**
   * Start loading a 3D model with support for blob loading from IndexedDB
   */
  start = async (
    modelSrc: string,
    scene: THREE.Scene,
    shouldRotating = true,
    renderer?: THREE.WebGLRenderer,
    onLoaded?: (model: THREE.Group | THREE.Mesh) => void,
  ) => {
    this.shouldRotating = shouldRotating;

    try {
      // Load the model from IndexedDB using petBlobAssetLoader
      await LoadCharacter(
        modelSrc,
        scene,
        (object) => {
          this.model = object;

          // Create animation mixer
          this.mixer = new THREE.AnimationMixer(object);

          // Try to load animation if available (modelSrc + "_Anim")
          this.loadAnimation(modelSrc + '_Anim', scene);

          if (onLoaded) onLoaded(object);
        },
        (error) => {
          console.error('Error loading pet model:', error);
        },
      );
    } catch (error) {
      console.error('Failed to load pet model:', error);
    }
  };

  /**
   * Load animation for the pet model
   */
  loadAnimation = async (animationId: string, scene: THREE.Scene) => {
    try {
      // Check if animation exists in IndexedDB
      const animationExists = await StoreModelFileMethods.getItem(animationId);

      if (!animationExists) {
        console.warn(`Animation ${animationId} not found in IndexedDB`);
        return;
      }

      // Load animation model
      await LoadCharacter(
        animationId,
        scene,
        (animObject) => {
          if (!this.model || !this.mixer) {
            console.warn('Cannot apply animation: model or mixer not initialized');
            return;
          }

          // Get animation clips
          if (animObject.animations && animObject.animations.length > 0) {
            // Get the correct animation name based on model ID
            const animName = getAnimationName(animationId.replace('_Anim', ''));

            // Find the animation by name or use the first one
            const clip =
              animObject.animations.find((a) => a.name === animName) ||
              animObject.animations[0];

            if (clip) {
              // Play the animation
              const action = this.mixer.clipAction(clip);
              action.play();
              console.log(`Playing animation: ${clip.name}`);
            }
          } else {
            console.warn('No animations found in the loaded animation model');
          }

          // Remove animation object from scene as we only need its animations
          scene.remove(animObject);
        },
        (error) => {
          console.error('Error loading pet animation:', error);
        },
      );
    } catch (error) {
      console.error('Failed to load pet animation:', error);
    }
  };

  /**
   * Update animation mixer
   */
  update = (delta: number) => {
    if (this.mixer) {
      this.mixer.update(delta);
    }

    // Handle rotation if needed
    if (this.shouldRotating && this.model) {
      this.model.rotation.y += 0.01;
    }
  };

  /**
   * Dispose resources
   */
  dispose = () => {
    if (this.model) {
      // Clean up model resources
      this.model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });
    }

    if (this.mixer) {
      // Stop all animations
      this.mixer.stopAllAction();
    }
  };
}
