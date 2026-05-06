import {
  LoadCharacter,
  loadGLTFAnimation,
} from '@component/code/atom/cc-a-model-loader/BlobModelLoader_hide_weapon';
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

/**
 * Get GLTF Idle animation path for Share Profile page
 * ใช้ Idle-set1-5.gltf สำหรับหน้า Share
 */
function getIdleGLTFAnimationPath(modelKey: string): string {
  if (modelKey.includes('set1')) return '/assets/animation/Idle-set1.gltf';
  if (modelKey.includes('set2')) return '/assets/animation/Idle-set2.gltf';
  if (modelKey.includes('set3')) return '/assets/animation/Idle-set3.gltf';
  if (modelKey.includes('set4')) return '/assets/animation/Idle-set4.gltf';
  if (modelKey.includes('set5')) return '/assets/animation/Idle-set5.gltf';
  // fallback
  return '/assets/animation/Idle-set1.gltf';
}

/**
 * Config สำหรับหน้า Share Profile (แยกจาก Main Menu)
 * ปรับค่าที่นี่เพื่อเปลี่ยน position/scale/rotation ของตัวละครในหน้า Share
 */
function getShareProfileCharacterConfig(modelKey: string): {
  x: number;
  y: number;
  z: number;
  scale: number;
  rotateX: number;
  rotateY: number;
} {
  // Set 1
  if (modelKey.includes('set1_character1'))
    return { x: 1, y: -6, z: -5, scale: 0.05, rotateX: -0.4, rotateY: 0 };
  if (modelKey.includes('set1_character2'))
    return { x: 1, y: -6, z: -5, scale: 0.05, rotateX: -0.4, rotateY: 0 };
  if (modelKey.includes('set1_character3'))
    return { x: 1, y: -6, z: -5, scale: 0.05, rotateX: -0.4, rotateY: 0 };
  if (modelKey.includes('set1_character4'))
    return { x: 1, y: -6, z: -5, scale: 0.05, rotateX: -0.4, rotateY: 0 };

  // Set 2
  if (modelKey.includes('set2_character1'))
    return { x: 0.5, y: -7.5, z: -7, scale: 0.04, rotateX: -0.4, rotateY: 0 };
  if (modelKey.includes('set2_character2'))
    return { x: 0.5, y: -7.5, z: -7, scale: 0.04, rotateX: -0.4, rotateY: 0 };
  if (modelKey.includes('set2_character3'))
    return { x: 0.5, y: -7.5, z: -7, scale: 0.04, rotateX: -0.4, rotateY: 0 };
  if (modelKey.includes('set2_character4'))
    return { x: 0.5, y: -7.5, z: -7, scale: 0.04, rotateX: -0.4, rotateY: 0 };

  // Set 3 character 1, 2
  if (modelKey.includes('set3_character1'))
    return { x: 0, y: -3.5, z: 0, scale: 0.02, rotateX: -0.4, rotateY: 0.3 };
  if (modelKey.includes('set3_character2'))
    return { x: 0, y: -3.5, z: 0, scale: 0.02, rotateX: -0.4, rotateY: 0.3 };
  // Set 3 character 3, 4
  if (modelKey.includes('set3_character3'))
    return { x: 0, y: -3.5, z: 0, scale: 0.02, rotateX: -0.4, rotateY: 0 };
  if (modelKey.includes('set3_character4'))
    return { x: 0, y: -3.5, z: 0, scale: 0.02, rotateX: -0.4, rotateY: 0 };

  // Set 4
  if (modelKey.includes('set4_character1'))
    return { x: 0.4, y: -3.5, z: 0, scale: 0.02, rotateX: -0.4, rotateY: 0 };
  if (modelKey.includes('set4_character2'))
    return { x: 1, y: -3.5, z: 0, scale: 0.02, rotateX: -0.4, rotateY: 0 };
  if (modelKey.includes('set4_character3'))
    return { x: 0, y: -3.5, z: 0, scale: 0.02, rotateX: -0.4, rotateY: 0 };
  if (modelKey.includes('set4_character4'))
    return { x: 0, y: -3.5, z: 0, scale: 0.02, rotateX: -0.4, rotateY: 0 };

  // Set 5
  if (modelKey.includes('set5_character1'))
    return { x: 0.5, y: -2.8, z: 0, scale: 0.0002, rotateX: -0.2, rotateY: 0 };
  if (modelKey.includes('set5_character2'))
    return { x: 0.5, y: -2.8, z: 0, scale: 0.0002, rotateX: -0.2, rotateY: 0 };
  if (modelKey.includes('set5_character3'))
    return { x: 0.5, y: -2.8, z: 0, scale: 0.0002, rotateX: -0.2, rotateY: 0 };
  if (modelKey.includes('set5_character4'))
    return { x: 0.5, y: -2.8, z: 0, scale: 0.0002, rotateX: -0.2, rotateY: 0 };

  return { x: 0.2, y: -3, z: 0, scale: 0.015, rotateX: -0.2, rotateY: 0 }; // Default
}

// Function to determine which animation to use based on modelSrc and whether the answer is correct
function getAnimationPath(
  modelSrc: string | undefined,
  answerIsCorrect: boolean,
): string {
  // Default animations if no specific ones are found
  const defaultCorrectAnimation = 'set2_casting_final.fbx';
  const defaultIncorrectAnimation = 'set2_casting_fail.fbx';

  // If no modelSrc, return default
  if (!modelSrc) {
    return answerIsCorrect ? defaultCorrectAnimation : defaultIncorrectAnimation;
  }

  // Extract set number from modelSrc
  const setMatch = modelSrc.match(/set(\d+)/i);
  if (!setMatch) {
    return answerIsCorrect ? defaultCorrectAnimation : defaultIncorrectAnimation;
  }

  const setNumber = setMatch[1];

  // Extract character number for special handling
  const characterMatch = modelSrc.match(/character(\d+)/i);
  const characterNumber = characterMatch ? characterMatch[1] : '';

  // Set-specific animations
  switch (setNumber) {
    case '1':
      return answerIsCorrect ? 'MainMenu-Idle/Set1.fbx' : 'MainMenu-Idle/Set1.fbx';

    case '2':
      return answerIsCorrect ? '/MainMenu-Idle/Set2,4.fbx' : '/MainMenu-Idle/Set2,4.fbx';

    case '3':
      // Special handling for set 3 based on character number
      if (characterNumber === '1' || characterNumber === '2') {
        return answerIsCorrect
          ? 'MainMenu-Idle/Set3Char12.fbx'
          : 'MainMenu-Idle/Set3Char12.fbx';
      } else if (characterNumber === '3' || characterNumber === '4') {
        return answerIsCorrect
          ? '/MainMenu-Idle/Set3Char34.fbx'
          : '/MainMenu-Idle/Set3Char34.fbx';
      }
      // Fallback for set 3 if character number not matched
      return answerIsCorrect ? 'set3_casting_success.fbx' : 'set3_casting_fail.fbx';

    case '4':
      return answerIsCorrect ? '/MainMenu-Idle/Set2,4.fbx' : '/MainMenu-Idle/Set2,4.fbx';

    case '5':
      return answerIsCorrect
        ? '/assets/animation/MainMenu-Idle/set5-main-menu-animation/Set5Char1MenuIdle.fbx'
        : '/assets/animation/MainMenu-Idle/set5-main-menu-animation/Set5Char1MenuIdle.fbx';

    default:
      // Return default animations if no specific set handling
      return answerIsCorrect ? defaultCorrectAnimation : defaultIncorrectAnimation;
  }
}

export class GCAThreeModel {
  model: THREE.Group | THREE.Mesh | undefined;
  loader: THREE.Loader = new FBXLoader();
  mixer: THREE.AnimationMixer | undefined;
  wingMixer: THREE.AnimationMixer | undefined; // For wing animation from character GLTF
  shouldRotating: boolean = false;
  private currentScene: THREE.Scene | undefined; // Store scene reference for cleanup
  private expectedModelSrc: string | undefined; // Track expected model to prevent stale loads

  // Cleanup old model before loading new one
  private cleanup = () => {
    if (this.mixer) {
      this.mixer.stopAllAction();
      this.mixer = undefined;
    }
    if (this.wingMixer) {
      this.wingMixer.stopAllAction();
      this.wingMixer = undefined;
    }
    if (this.model && this.currentScene) {
      this.currentScene.remove(this.model);
      // Dispose of geometries and materials
      this.model.traverse((child: any) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((m: any) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
      this.model = undefined;
      console.log('Old model cleaned up');
    }
  };

  // Cancel pending loads and clear scene - call this on unmount
  cancelAndClear = (scene?: THREE.Scene) => {
    console.log('cancelAndClear called');
    // Invalidate expected model to reject any pending loads
    this.expectedModelSrc = undefined;

    // Clean up current model
    this.cleanup();

    // Clear all children from scene (in case of orphaned models)
    const targetScene = scene || this.currentScene;
    if (targetScene) {
      // Remove all mesh/group children (but keep lights and camera)
      const objectsToRemove: THREE.Object3D[] = [];
      targetScene.traverse((child) => {
        if (child instanceof THREE.Group || child instanceof THREE.Mesh) {
          objectsToRemove.push(child);
        }
      });
      objectsToRemove.forEach((obj) => {
        targetScene.remove(obj);
        // Dispose resources
        if (obj instanceof THREE.Mesh) {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose());
            } else {
              obj.material.dispose();
            }
          }
        }
      });
      console.log(`Cleared ${objectsToRemove.length} objects from scene`);
    }
  };

  Start = ({
    modelSrc,
    scene, // Make scene required
    renderer,
    shouldRotating = true,
    answerIsCorrect = true,
    onLoaded, // Add the onLoaded callback parameter
    onError, // Add the onError callback parameter
  }: {
    modelSrc?: string;
    scene: THREE.Scene; // Make scene required
    shouldRotating?: boolean;
    renderer: THREE.WebGLRenderer;
    answerIsCorrect?: boolean;
    onLoaded?: () => void; // Add the type definition
    onError?: (message: string) => void; // Add onError type
  }): void => {
    console.log('Model src in character: ' + modelSrc);

    // Cleanup old model before loading new one
    this.cleanup();
    this.currentScene = scene;
    this.expectedModelSrc = modelSrc; // Track which model we expect

    if (modelSrc) {
      LoadCharacter(
        modelSrc,
        scene, // Pass the scene to LoadCharacter
        (character: THREE.Group, actualModelUsed: string, gltfAnimations?: THREE.AnimationClip[]) => {
          // Check if this is still the expected model (prevent stale loads)
          if (this.expectedModelSrc !== modelSrc) {
            console.log(
              `Stale load detected: expected ${this.expectedModelSrc}, got ${modelSrc}. Skipping.`,
            );
            // Remove stale character from scene (LoadCharacter adds it before callback)
            if (scene) {
              scene.remove(character);
              console.log('Removed stale character from scene');
            }
            // Dispose this stale character
            character.traverse((child: any) => {
              if (child.geometry) child.geometry.dispose();
              if (child.material) {
                if (Array.isArray(child.material)) {
                  child.material.forEach((m: any) => m.dispose());
                } else {
                  child.material.dispose();
                }
              }
            });
            return; // Don't continue with stale model
          }

          // Use actualModelUsed instead of modelSrc for all positioning and accessory logic
          console.log(
            `Original modelSrc: ${modelSrc}, Actually loaded: ${actualModelUsed}`,
          );
          console.log(`[Wing] Character GLTF animations: ${gltfAnimations?.length || 0}`);

          let mixer: THREE.AnimationMixer | null = null;

          // Play wing animation if exists in character GLTF
          // Wing bones in GLTF are named: RigHub, RigLArm1, RigLArmPalm, RigRArm1, RigRArmPalm
          if (gltfAnimations && gltfAnimations.length > 0) {
            gltfAnimations.forEach((clip, i) => {
              console.log(`[Wing] Animation ${i}: ${clip.name}, tracks: ${clip.tracks.length}`);
              // Check if this animation has wing tracks (Rig* bones)
              const hasWingTracks = clip.tracks.some((track) => {
                const trackName = track.name.toLowerCase();
                return trackName.includes('rig') || trackName.includes('wing');
              });
              if (hasWingTracks) {
                console.log(`[Wing] Found wing animation: ${clip.name}`);
                const wingMixer = new THREE.AnimationMixer(character);
                const action = wingMixer.clipAction(clip);
                action.setLoop(THREE.LoopRepeat, Infinity);
                action.play();
                this.wingMixer = wingMixer;
              }
            });
          }

          // Use Share Profile config (separate from Main Menu)
          const config = getShareProfileCharacterConfig(actualModelUsed);
          character.scale.set(config.scale, config.scale, config.scale);
          character.position.x = config.x;
          character.position.y = config.y;
          character.position.z = config.z;
          if (config.rotateX !== 0) character.rotateX(config.rotateX);
          if (config.rotateY !== 0) character.rotateY(config.rotateY);

          this.model = character;
          character.visible = false; // Initially hide the model

          // Apply texture settings
          character.traverse((child: any) => {
            if (child instanceof THREE.Mesh) {
              if (child.material.map) {
                child.material.map.minFilter = THREE.LinearFilter;
                child.material.map.generateMipmaps = true;
                child.material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
              }
              if (child.material.materials) {
                child.material.materials.forEach((material: any) => {
                  if (material.map) {
                    material.map.minFilter = THREE.LinearFilter;
                    material.map.generateMipmaps = true;
                    material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
                  }
                });
              }
            }
          });

          const newCharacter = character;

          // Helper function to find bones by name
          const findBone = (name: string): THREE.Object3D | null => {
            let bone: THREE.Object3D | null = null;
            newCharacter.traverse((object: THREE.Object3D) => {
              if (object.name === name) {
                bone = object;
              }
            });
            return bone;
          };

          // Get the appropriate animation file based on actualModelUsed and answerIsCorrect
          const animationFile = getAnimationPath(actualModelUsed, answerIsCorrect);
          console.log(
            `Using animation file: ${animationFile} for model ${actualModelUsed} (answerIsCorrect: ${answerIsCorrect})`,
          );

          // Char 3 Hair - rename bone to prevent animation conflicts
          if (actualModelUsed.includes('set1_character3')) {
            const boneTarget = findBone('Hair_Root');
            if (boneTarget) {
              boneTarget.name = 'Hair_Anchored';
            }
          }

          // === Use GLTF Idle animation for Share Profile page ===
          const gltfIdleAnimationPath = getIdleGLTFAnimationPath(actualModelUsed);
          console.log(
            `Using GLTF Idle animation path for ${actualModelUsed}: ${gltfIdleAnimationPath}`,
          );

          loadGLTFAnimation(
            gltfIdleAnimationPath,
            character,
            (loadedMixer: THREE.AnimationMixer, clip: THREE.AnimationClip) => {
              mixer = loadedMixer;
              console.log(`GLTF Idle Animation applied: ${clip.name}`);

              const action = mixer.clipAction(clip);
              action.setLoop(THREE.LoopRepeat, Infinity);
              action.clampWhenFinished = false;
              action.play();

              this.mixer = mixer;

              // Call onLoaded callback when animation is loaded
              console.log('Character model with GLTF Idle animation loaded');
              scene.add(character);
              character.visible = true;
              onLoaded?.();
            },
            (error: any) => {
              console.error('Error loading GLTF Idle animation:', error);
              // Call onLoaded even on error to avoid blocking the UI
              console.log('Character loaded but GLTF animation failed');
              scene.add(character);
              character.visible = true;
              onLoaded?.();
            },
          );
          // === END GLTF Idle animation ===
        },
      );
    } else {
      console.error(
        'Error: scene must be a THREE.Scene when modelSrc is provided for LoadCharacter.',
      );
      // Call onLoaded even on error to avoid blocking the UI
      if (onLoaded) {
        console.log(
          'Character model loading failed (invalid scene), still calling onLoaded',
        );
        onLoaded?.(); // Use optional chaining here
      }
      return;
    }
    this.shouldRotating = shouldRotating;
  };

  Update = ({ deltaTime }: { deltaTime: number }) => {
    if (this.model && this.shouldRotating) {
      //this.model.rotation.y += 0.001 * deltaTime;
    }
    if (this.mixer) {
      this.mixer.update(deltaTime / 1000);
    }
    if (this.wingMixer) {
      this.wingMixer.update(deltaTime / 1000);
    }
  };

  getWeaponPosition(): THREE.Vector3 {
    // Simple implementation that returns a position relative to the model
    if (!this.model) {
      return new THREE.Vector3(0, 0, 0);
    }

    const position = new THREE.Vector3();
    if (this.model.position) {
      position.copy(this.model.position);
    }

    // Add offset for weapon tip - adjust these values as needed
    position.y += 1.5;
    position.x += 0.5;

    return position;
  }

  ComponentAdd = (_parentObj: any) => {
    const parentObj = _parentObj as THREE.Object3D;
    if (!this.model) {
      return;
    }
    parentObj.add(this.model);
    console.log('Model added to parent object');
  };

  ComponentRemove = (_parentObj: any) => {
    const parentObj = _parentObj as THREE.Object3D;
    if (!this.model) {
      return;
    }
    parentObj.remove(this.model);
    console.log('Model removed from parent object');
  };

  // Dispose method to free GPU memory
  dispose = () => {
    console.log('Disposing GCAThreeModel resources (share-profile controller)...');

    // Stop and dispose mixers
    if (this.mixer) {
      this.mixer.stopAllAction();
      this.mixer.uncacheRoot(this.mixer.getRoot());
      this.mixer = undefined;
    }
    if (this.wingMixer) {
      this.wingMixer.stopAllAction();
      this.wingMixer.uncacheRoot(this.wingMixer.getRoot());
      this.wingMixer = undefined;
    }

    // Dispose model resources
    if (this.model) {
      this.model.traverse((child: any) => {
        if (child.geometry) {
          child.geometry.dispose();
        }
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat: any) => {
              Object.keys(mat).forEach((key) => {
                if (mat[key] && mat[key].isTexture) mat[key].dispose();
              });
              mat.dispose();
            });
          } else {
            Object.keys(child.material).forEach((key) => {
              if (child.material[key] && child.material[key].isTexture) {
                child.material[key].dispose();
              }
            });
            child.material.dispose();
          }
        }
      });
      this.model = undefined;
    }

    // Clear THREE.Cache to release cached textures/models
    THREE.Cache.clear();

    console.log('GCAThreeModel resources disposed (share-profile controller)');
  };
}
