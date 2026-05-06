import {
  getGLTFAnimationPath,
  loadGLTFAnimation,
} from '@component/code/atom/cc-a-model-loader/BlobModelLoader_hide_weapon';
import { LoadCharacter } from '@component/code/atom/cc-a-model-loader/Shop-CustomAvatarModelLoader';
import { FBXLoaderHelper } from '@core/helper/fbx-model-loader';
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

// Function to determine which animation to use based on modelSrc and whether the answer is correct
function getAnimationPath(
  modelSrc: string | undefined,
  answerIsCorrect: boolean,
): string {
  // Default animations if no specific ones are found
  const defaultCorrectAnimation = 'set2_casting_final.fbx';
  const defaultIncorrectAnimation = 'set2_casting_fail.fbx';

  console.log('modelSrc from 3d model: ', modelSrc);

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
  wingMixer: THREE.AnimationMixer | undefined; // For embedded wing animations from GLTF
  shouldRotating: boolean = false;

  // Enhanced resource tracking
  private geometries: Set<THREE.BufferGeometry> = new Set();
  private materials: Set<THREE.Material> = new Set();
  private textures: Set<THREE.Texture> = new Set();
  private animationClips: Set<THREE.AnimationClip> = new Set();
  private loadedObjects: Set<THREE.Object3D> = new Set();
  private isDisposed: boolean = false;
  private configuredTextures: Set<THREE.Texture> = new Set();
  private sceneRef: THREE.Scene | null = null;
  private expectedModelSrc: string | undefined; // Track expected model to prevent stale loads

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

    // Dispose previous resources before loading new ones
    this.dispose();
    this.isDisposed = false;
    this.expectedModelSrc = modelSrc; // Track which model we expect

    if (modelSrc) {
      if (scene instanceof THREE.Scene) {
        this.sceneRef = scene;
        LoadCharacter(
          modelSrc,
          scene,
          (
            character: THREE.Group,
            actualModelUsed: string,
            embeddedAnimations?: THREE.AnimationClip[],
          ) => {
            // Check if this is still the expected model (prevent stale loads)
            if (this.expectedModelSrc !== modelSrc) {
              console.log(`Stale load detected in Shop: expected ${this.expectedModelSrc}, got ${modelSrc}. Skipping.`);
              // Remove stale character from scene (LoadCharacter adds it before callback)
              if (scene) {
                scene.remove(character);
                console.log('Removed stale character from scene (Shop)');
              }
              this.disposeObject(character);
              return;
            }

            // Use actualModelUsed instead of modelSrc for all positioning and accessory logic
            console.log(
              `Original modelSrc: ${modelSrc}, Actually loaded: ${actualModelUsed}`,
            );

            if (this.isDisposed) {
              // If disposed during loading, immediately dispose the loaded character
              this.disposeObject(character);
              return;
            }

            let mixer: THREE.AnimationMixer | null = null;
            scene?.add(character);
            this.loadedObjects.add(character);

            // Play embedded animations (e.g., wing animations from GLTF)
            if (embeddedAnimations && embeddedAnimations.length > 0) {
              const embeddedMixer = new THREE.AnimationMixer(character);
              embeddedAnimations.forEach((clip) => {
                const action = embeddedMixer.clipAction(clip);
                action.setLoop(THREE.LoopRepeat, Infinity);
                action.play();
              });
              this.wingMixer = embeddedMixer;
            }

            // Use actualModelUsed for all positioning logic
            if (
              actualModelUsed.includes('set1_character1') ||
              actualModelUsed.includes('set1_character2') ||
              actualModelUsed.includes('set1_character3') ||
              actualModelUsed.includes('set1_character4')
            ) {
              character.scale.set(0.03, 0.03, 0.03);
              character.position.y = -4;
              character.position.x = 0;
              character.position.z = -5;
              character.rotateX(-0.4);
            } else if (actualModelUsed.includes('set2')) {
              character.scale.set(0.025, 0.025, 0.025);
              character.position.y = -6.5;
              character.position.x = 0;
              character.position.z = -7;
              character.rotateX(-0.4);
            } else if (
              actualModelUsed.includes('set3_character1') ||
              actualModelUsed.includes('set3_character2')
            ) {
              character.scale.set(0.01, 0.01, 0.01);
              character.position.y = -3;
              character.position.x = 0;
              character.rotateX(-0.4);
              character.rotateY(0.3);
            } else if (
              actualModelUsed.includes('set3_character3') ||
              actualModelUsed.includes('set3_character4')
            ) {
              character.scale.set(0.01, 0.01, 0.01);
              character.position.y = -3;
              character.position.x = 0;
              character.rotateX(-0.4);
            } else if (actualModelUsed.includes('set4')) {
              character.scale.set(0.012, 0.012, 0.012);
              character.position.y = -3;
              character.position.x = 0;
              character.rotateX(-0.4);
            } else if (actualModelUsed.includes('set5')) {
              // Set 5 - เล็กกว่า Set อื่น
              character.scale.set(0.00013, 0.00013, 0.00013);
              character.position.y = -3;
              character.position.x = 0;
              character.rotateX(-0.4);
            } else {
              character.scale.set(0.015, 0.015, 0.015);
              character.position.y = -3;
              character.position.x = 0;
              character.rotateX(-0.4);
            }

            this.model = character;

            // After loading the character but before adding new wings
            character.traverse((child: any) => {
              // === GLTF TEST: Comment out wing hiding (wings already in GLTF models) ===
              // Look for mesh with name containing "Wings" or specific wing mesh names
              // if (
              //   child instanceof THREE.Mesh &&
              //   (child.name.includes('Wings') ||
              //     child.name.includes('Wings_01_Gold') ||
              //     child.name === 'Wings_01_Gold')
              // ) {
              //   console.log(`Found and hiding original wing mesh: ${child.name}`);
              //   child.visible = false;
              // }
              // === END GLTF TEST ===

              // Collect and configure resources
              if (child instanceof THREE.Mesh) {
                // Track geometry
                if (child.geometry) {
                  this.geometries.add(child.geometry);
                }

                // Track materials and textures
                if (child.material) {
                  if (Array.isArray(child.material)) {
                    child.material.forEach((material: THREE.Material) => {
                      this.materials.add(material);
                      this.trackMaterialTextures(material);
                      this.configureMaterialTexture(material, renderer);
                    });
                  } else {
                    this.materials.add(child.material);
                    this.trackMaterialTextures(child.material);
                    this.configureMaterialTexture(child.material, renderer);
                  }
                }
              }
            });

            const newCharacter = character;

            // Helper function to find bones by name
            // Bone name mapping from old FBX names to new GLTF/Mixamo names
            const boneNameMap: Record<string, string[]> = {
              Chest_R: ['mixamorig:Spine2', 'mixamorig:Spine1', 'Spine2', 'Spine1'],
              Head: ['mixamorig:Head', 'Head'],
              Hips: ['mixamorig:Hips', 'Hips'],
              Root_M: ['mixamorig:Hips', 'Hips'],
              Spine1_M: ['mixamorig:Spine', 'Spine'],
              Spine2_M: ['mixamorig:Spine1', 'Spine1'],
              Chest_M: ['mixamorig:Spine2', 'Spine2'],
              Neck_M: ['mixamorig:Neck', 'Neck'],
              Head_M: ['mixamorig:Head', 'Head'],
              Hair_Root: ['mixamorig:Head', 'Hair_Root', 'Head'],
            };

            const findBone = (name: string): THREE.Object3D | null => {
              let bone: THREE.Object3D | null = null;

              // Get list of names to try (original + mapped alternatives)
              const namesToTry = [name, ...(boneNameMap[name] || [])];

              newCharacter.traverse((object: THREE.Object3D) => {
                if (bone) return; // Already found
                // Try exact match with any of the names
                if (namesToTry.includes(object.name)) {
                  bone = object;
                }
              });

              // If still not found, try partial match with mixamorig: prefix
              if (!bone) {
                newCharacter.traverse((object: THREE.Object3D) => {
                  if (bone) return;
                  if (
                    object.name.includes(`mixamorig:${name}`) ||
                    object.name === `mixamorig:${name}`
                  ) {
                    bone = object;
                  }
                });
              }

              return bone;
            };

            // Get the appropriate animation file based on actualModelUsed and answerIsCorrect
            const animationFile = getAnimationPath(actualModelUsed, answerIsCorrect);
            console.log(
              `Using animation file: ${animationFile} for model ${actualModelUsed} (answerIsCorrect: ${answerIsCorrect})`,
            );

            // Char 3 Hair - MODIFIED TO USE FBXLoaderHelper with getBone
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

            // Load GLTF animation for character
            const gltfAnimationPath = getGLTFAnimationPath(actualModelUsed);
            loadGLTFAnimation(
              gltfAnimationPath,
              character,
              (loadedMixer: THREE.AnimationMixer, clip: THREE.AnimationClip) => {
                if (this.isDisposed) return;

                mixer = loadedMixer;
                this.animationClips.add(clip);

                const action = mixer.clipAction(clip);
                action.setLoop(THREE.LoopRepeat, Infinity);
                action.clampWhenFinished = false;
                action.play();

                this.mixer = mixer;

                if (onLoaded && !this.isDisposed) {
                  onLoaded();
                }
              },
              (error: any) => {
                console.error('Error loading GLTF animation:', error);
                if (onLoaded && !this.isDisposed) {
                  onLoaded();
                }
              },
            );
          },
        );
      } else {
        console.error(
          'Error: scene must be a THREE.Scene when modelSrc is provided for LoadCharacter.',
        );
        if (onLoaded) {
          console.log(
            'Character model loading failed (invalid scene), still calling onLoaded',
          );
          onLoaded();
        }
        return;
      }
    } else {
      if (onLoaded) {
        console.log('Default model loaded, calling onLoaded callback');
        onLoaded();
      }
    }
    this.shouldRotating = shouldRotating;
  };

  Update = ({ deltaTime }: { deltaTime: number }) => {
    if (this.isDisposed) return;

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
    if (!this.model || this.isDisposed) {
      return new THREE.Vector3(0, 0, 0);
    }

    const position = new THREE.Vector3();
    if (this.model.position) {
      position.copy(this.model.position);
    }

    position.y += 1.5;
    position.x += 0.5;

    return position;
  }

  ComponentAdd = (_parentObj: any) => {
    if (this.isDisposed) return;

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

  // Helper method to track object resources
  private trackObjectResources = (
    object: THREE.Object3D,
    renderer: THREE.WebGLRenderer,
  ): void => {
    object.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        if (child.geometry) {
          this.geometries.add(child.geometry);
        }
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((material: THREE.Material) => {
              this.materials.add(material);
              this.trackMaterialTextures(material);
              this.configureMaterialTexture(material, renderer);
            });
          } else {
            this.materials.add(child.material);
            this.trackMaterialTextures(child.material);
            this.configureMaterialTexture(child.material, renderer);
          }
        }
      }
    });
  };

  // Helper method to track material textures
  private trackMaterialTextures = (material: THREE.Material): void => {
    Object.keys(material).forEach((key) => {
      const value = (material as any)[key];
      if (value && value instanceof THREE.Texture) {
        this.textures.add(value);
      }
    });
  };

  // Detect if running on mobile/low-memory device
  private isMobileDevice = (): boolean => {
    if (typeof navigator === 'undefined') return false;
    const userAgent = navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod|android|mobile|tablet/i.test(userAgent);
  };

  // Helper method to configure material textures
  private configureMaterialTexture = (
    material: THREE.Material,
    renderer: THREE.WebGLRenderer,
  ): void => {
    const isMobile = this.isMobileDevice();

    Object.keys(material).forEach((key) => {
      const texture = (material as any)[key];
      if (
        texture &&
        texture instanceof THREE.Texture &&
        !this.configuredTextures.has(texture)
      ) {
        texture.minFilter = THREE.LinearFilter;

        // On mobile: disable mipmaps and use lower anisotropy to save GPU memory
        if (isMobile) {
          texture.generateMipmaps = false;
          texture.anisotropy = Math.min(2, renderer.capabilities.getMaxAnisotropy());
        } else {
          texture.generateMipmaps = true;
          texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        }

        this.configuredTextures.add(texture);
      }
    });
  };

  // Enhanced dispose method with improved memory management
  dispose = () => {
    console.log('Disposing GCAThreeModel resources...');
    this.isDisposed = true;

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

    // Dispose animation clips properly
    this.animationClips.forEach((clip) => {
      // Clear the tracks array instead of calling reset()
      clip.tracks.length = 0;
      // Note: mixer is already undefined at this point, so no need to uncache
    });
    this.animationClips.clear();

    // Dispose all tracked objects first
    this.loadedObjects.forEach((object) => {
      this.disposeObject(object);
    });
    this.loadedObjects.clear();

    // Dispose main model if it exists and is in scene
    if (this.model && this.sceneRef) {
      this.sceneRef.remove(this.model);
      this.disposeObject(this.model);
      this.model = undefined;
    }

    // Clean up all tracked resources
    this.textures.forEach((texture) => texture.dispose());
    this.textures.clear();
    this.configuredTextures.clear();

    this.materials.forEach((material) => this.disposeMaterialCompletely(material));
    this.materials.clear();

    this.geometries.forEach((geometry) => geometry.dispose());
    this.geometries.clear();

    // Clear references
    this.sceneRef = null;
    this.loader = null as any;

    // Clear THREE.Cache to release cached textures/models
    THREE.Cache.clear();

    console.log('GCAThreeModel resources disposed successfully');
  };

  // Helper method to recursively dispose an object and its resources
  private disposeObject = (object: THREE.Object3D): void => {
    // Remove from scene if it has a parent
    if (object.parent) {
      object.parent.remove(object);
    }

    // Recursively dispose all children and their resources
    object.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        // Dispose geometry
        if (child.geometry) {
          child.geometry.dispose();
          this.geometries.delete(child.geometry);
        }

        // Dispose material(s) and their textures
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((material: THREE.Material) => {
              this.disposeMaterialCompletely(material);
              this.materials.delete(material);
            });
          } else {
            this.disposeMaterialCompletely(child.material);
            this.materials.delete(child.material);
          }
        }
      }

      // Clear any user data
      if (child.userData) {
        child.userData = {};
      }

      // Clear animations
      if ((child as any).animations) {
        (child as any).animations.length = 0;
      }
    });

    // Clear children array
    if (object.children) {
      object.children.length = 0;
    }
  };

  // Enhanced material disposal
  private disposeMaterialCompletely = (material: THREE.Material): void => {
    // Dispose all textures in the material
    Object.keys(material).forEach((key) => {
      const value = (material as any)[key];
      if (value && value instanceof THREE.Texture) {
        value.dispose();
        this.textures.delete(value);
        this.configuredTextures.delete(value);
      }
    });

    // Clear material properties that might hold references
    if ((material as any).map) (material as any).map = null;
    if ((material as any).normalMap) (material as any).normalMap = null;
    if ((material as any).roughnessMap) (material as any).roughnessMap = null;
    if ((material as any).metalnessMap) (material as any).metalnessMap = null;
    if ((material as any).emissiveMap) (material as any).emissiveMap = null;
    if ((material as any).alphaMap) (material as any).alphaMap = null;
    if ((material as any).lightMap) (material as any).lightMap = null;
    if ((material as any).aoMap) (material as any).aoMap = null;
    if ((material as any).bumpMap) (material as any).bumpMap = null;
    if ((material as any).displacementMap) (material as any).displacementMap = null;

    // Dispose the material
    material.dispose();
  };
}
