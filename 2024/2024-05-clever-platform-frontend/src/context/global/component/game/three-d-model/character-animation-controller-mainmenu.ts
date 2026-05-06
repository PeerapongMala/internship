import {
  getGLTFAnimationPath,
  LoadCharacter,
  loadGLTFAnimation,
} from '@component/code/atom/cc-a-model-loader/BlobModelLoader_hide_weapon';
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

/**
 * Get position, scale, and rotation for each character type in Main Menu
 * ปรับค่านี้เพื่อขยับ/ขยาย/หมุนตัวละครในหน้า Main Menu
 *
 * x (ซ้าย/ขวา): ค่าลบ = ซ้าย, ค่าบวก = ขวา
 * y (ขึ้น/ลง): ค่าลบ = ลง, ค่าบวก = ขึ้น
 * z (หน้า/หลัง): ค่าลบ = เข้าใกล้, ค่าบวก = ออกห่าง
 * scale: ค่ามาก = ตัวใหญ่, ค่าน้อย = ตัวเล็ก
 * rotateX, rotateY: มุมหมุน (radian)
 */
export function getGLTFCharacterConfig(modelKey: string): {
  x: number;
  y: number;
  z: number;
  scale: number;
  rotateX: number;
  rotateY: number;
} {
  // Set 1
  if (modelKey.includes('set1_character1'))
    return { x: -1, y: -6.5, z: -5, scale: 0.03, rotateX: -0.4, rotateY: 0 };
  if (modelKey.includes('set1_character2'))
    return { x: -1, y: -6.5, z: -5, scale: 0.03, rotateX: -0.4, rotateY: 0 };
  if (modelKey.includes('set1_character3'))
    return { x: -1, y: -6.5, z: -5, scale: 0.03, rotateX: -0.4, rotateY: 0 };
  if (modelKey.includes('set1_character4'))
    return { x: -1, y: -6.5, z: -5, scale: 0.03, rotateX: -0.4, rotateY: 0 };

  // Set 2
  if (modelKey.includes('set2_character1'))
    return { x: -1, y: -7.5, z: -7, scale: 0.023, rotateX: -0.4, rotateY: 0 };
  if (modelKey.includes('set2_character2'))
    return { x: -1, y: -7.5, z: -7, scale: 0.023, rotateX: -0.4, rotateY: 0 };
  if (modelKey.includes('set2_character3'))
    return { x: -1, y: -7.5, z: -7, scale: 0.023, rotateX: -0.4, rotateY: 0 };
  if (modelKey.includes('set2_character4'))
    return { x: -1, y: -7.5, z: -7, scale: 0.023, rotateX: -0.4, rotateY: 0 };

  // Set 3 character 1, 2
  if (modelKey.includes('set3_character1'))
    return { x: -0.5, y: -3.5, z: 0, scale: 0.01, rotateX: -0.4, rotateY: 0.3 };
  if (modelKey.includes('set3_character2'))
    return { x: -0.5, y: -3.5, z: 0, scale: 0.01, rotateX: -0.4, rotateY: 0.3 };
  // Set 3 character 3, 4
  if (modelKey.includes('set3_character3'))
    return { x: -0.5, y: -3.5, z: 0, scale: 0.01, rotateX: -0.4, rotateY: 0 };
  if (modelKey.includes('set3_character4'))
    return { x: -0.5, y: -3.5, z: 0, scale: 0.01, rotateX: -0.4, rotateY: 0 };

  // Set 4
  if (modelKey.includes('set4_character1'))
    return { x: -0.5, y: -3.5, z: 0, scale: 0.01, rotateX: -0.4, rotateY: 0 };
  if (modelKey.includes('set4_character2'))
    return { x: -0.3, y: -3.5, z: 0, scale: 0.01, rotateX: -0.4, rotateY: 0 };
  if (modelKey.includes('set4_character3'))
    return { x: -0.5, y: -3.5, z: 0, scale: 0.01, rotateX: -0.4, rotateY: 0 };
  if (modelKey.includes('set4_character4'))
    return { x: -0.5, y: -3.5, z: 0, scale: 0.01, rotateX: -0.4, rotateY: 0 };

  // Set 5
  if (modelKey.includes('set5_character1'))
    return { x: -0.8, y: -3.5, z: 0, scale: 0.00013, rotateX: -0.2, rotateY: 0 };
  if (modelKey.includes('set5_character2'))
    return { x: -0.8, y: -3.5, z: 0, scale: 0.00013, rotateX: -0.2, rotateY: 0 };
  if (modelKey.includes('set5_character3'))
    return { x: -0.8, y: -3.5, z: 0, scale: 0.00013, rotateX: -0.2, rotateY: 0 };
  if (modelKey.includes('set5_character4'))
    return { x: -0.8, y: -3.5, z: 0, scale: 0.00013, rotateX: -0.2, rotateY: 0 };

  return { x: 0.2, y: -3, z: 0, scale: 0.015, rotateX: -0.2, rotateY: 0 }; // Default
}

// Backward compatibility
export function getGLTFPositionOffset(modelKey: string): {
  x: number;
  y: number;
  scale: number;
} {
  const config = getGLTFCharacterConfig(modelKey);
  return { x: config.x, y: config.y, scale: config.scale };
}

// Backward compatibility - keep old function name
export function getGLTFYOffset(modelKey: string): number {
  return getGLTFPositionOffset(modelKey).y;
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

  Start = ({
    modelSrc,
    scene,
    renderer,
    shouldRotating = true,
    answerIsCorrect = true,
    onLoaded, // Add the onLoaded callback parameter
  }: {
    modelSrc?: string;
    scene?: THREE.Object3D;
    shouldRotating?: boolean;
    renderer: THREE.WebGLRenderer;
    answerIsCorrect?: boolean;
    onLoaded?: () => void; // Add the type definition
  }): void => {
    console.log('Model src in character: ' + modelSrc);

    if (modelSrc) {
      if (scene instanceof THREE.Scene) {
        // Get position offset for this character (for GLTF model positioning)
        const positionOffset = getGLTFPositionOffset(modelSrc);

        LoadCharacter(
          modelSrc,
          scene,
          (character: THREE.Group, actualModelUsed: string, gltfAnimations?: THREE.AnimationClip[]) => {
            // Use actualModelUsed instead of modelSrc for all positioning and accessory logic
            console.log(
              `Original modelSrc: ${modelSrc}, Actually loaded: ${actualModelUsed}`,
            );
            console.log(`[Wing] Character GLTF animations: ${gltfAnimations?.length || 0}`);

            let mixer: THREE.AnimationMixer | null = null;
            scene?.add(character);

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

            // Use config from getGLTFCharacterConfig() for all positioning/scale/rotation
            const config = getGLTFCharacterConfig(actualModelUsed);
            character.scale.set(config.scale, config.scale, config.scale);
            character.position.x = config.x;
            character.position.y = config.y;
            character.position.z = config.z;
            if (config.rotateX !== 0) character.rotateX(config.rotateX);
            if (config.rotateY !== 0) character.rotateY(config.rotateY);

            this.model = character;
            if (onLoaded) {
              character.visible = true;
            } else {
              character.visible = false;
            }

            // Apply texture settings
            character.traverse((child: any) => {
              if (child instanceof THREE.Mesh) {
                if (child.material.map) {
                  child.material.map.minFilter = THREE.LinearFilter;
                  child.material.map.generateMipmaps = true;
                  child.material.map.anisotropy =
                    renderer.capabilities.getMaxAnisotropy();
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

            // Determine which animations to load based on the actualModelUsed
            let animationBasedOnModelSrc = '';

            //new animation path
            if (actualModelUsed.includes('set1_character1')) {
              animationBasedOnModelSrc = '/assets/animation/New-Idle/Set1/Character1.fbx';
            } else if (actualModelUsed.includes('set1_character2')) {
              animationBasedOnModelSrc = '/assets/animation/New-Idle/Set1/Character2.fbx';
            } else if (actualModelUsed.includes('set1_character3')) {
              animationBasedOnModelSrc = '/assets/animation/testIdle.fbx';
            } else if (actualModelUsed.includes('set1_character4')) {
              animationBasedOnModelSrc = '/assets/animation/New-Idle/Set1/Character4.fbx';
            } else if (actualModelUsed.includes('set2')) {
              animationBasedOnModelSrc =
                '/assets/animation/New-Idle/Set2/Character1-4.fbx';
            } else if (actualModelUsed.includes('set3_character1')) {
              animationBasedOnModelSrc =
                '/assets/animation/New-Idle/Set3/Character1-2.fbx';
            } else if (actualModelUsed.includes('set3_character2')) {
              animationBasedOnModelSrc =
                '/assets/animation/New-Idle/Set3/Character1-2.fbx';
            } else if (actualModelUsed.includes('set3_character3')) {
              animationBasedOnModelSrc =
                '/assets/animation/New-Idle/Set3/Character3-4.fbx';
            } else if (actualModelUsed.includes('set3_character4')) {
              animationBasedOnModelSrc =
                '/assets/animation/New-Idle/Set3/Character3-4.fbx';
            } else if (actualModelUsed.includes('set4')) {
              animationBasedOnModelSrc =
                '/assets/animation/New-Idle/Set4/Character1-4.fbx';
            } else if (actualModelUsed.includes('set5_character1')) {
              animationBasedOnModelSrc = '/assets/animation/New-Idle/Set5/Character1.fbx';
            } else if (actualModelUsed.includes('set5_character2')) {
              animationBasedOnModelSrc = '/assets/animation/New-Idle/Set5/Character2.fbx';
            } else if (actualModelUsed.includes('set5_character3')) {
              animationBasedOnModelSrc = '/assets/animation/New-Idle/Set5/Character3.fbx';
            } else if (actualModelUsed.includes('set5_character4')) {
              animationBasedOnModelSrc = '/assets/animation/New-Idle/Set5/Character4.fbx';
            } else {
              // Default animations
              animationBasedOnModelSrc =
                '/assets/animation/MainMenu-Idle/Neutral Idle (2).fbx';
            }

            // Use GLTF animation for all characters (per-set animation matching)
            const gltfAnimationPath = getGLTFAnimationPath(actualModelUsed);
            console.log(
              `Using GLTF animation path for ${actualModelUsed}: ${gltfAnimationPath}`,
            );

            loadGLTFAnimation(
              gltfAnimationPath,
              character,
              (loadedMixer: THREE.AnimationMixer, clip: THREE.AnimationClip) => {
                mixer = loadedMixer;
                console.log(`GLTF Animation applied: ${clip.name}`);

                const action = mixer.clipAction(clip);
                action.setLoop(THREE.LoopRepeat, Infinity);
                action.clampWhenFinished = false;
                action.play();

                this.mixer = mixer;

                // Call onLoaded callback
                if (onLoaded) {
                  console.log('Character model with GLTF animation loaded');
                  onLoaded();
                }
              },
              (error: any) => {
                console.error('Error loading GLTF animation:', error);
                // Call onLoaded even on error
                if (onLoaded) {
                  console.log('Character loaded but animation failed');
                  onLoaded();
                }
              },
            );
            // === END GLTF TEST ===
          },
          undefined, // onError
          false, // isRetry
          positionOffset, // Position offset for GLTF model positioning (x: left/right, y: up/down)
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
          onLoaded();
        }
        return;
      }
    } else {
      // Call onLoaded immediately for default model
      if (onLoaded) {
        console.log('Default model loaded, calling onLoaded callback');
        onLoaded();
      }
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
    console.log('Disposing GCAThreeModel resources (mainmenu controller)...');

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

    console.log('GCAThreeModel resources disposed (mainmenu controller)');
  };
}
