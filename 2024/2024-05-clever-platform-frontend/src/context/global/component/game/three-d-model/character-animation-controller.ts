import { LoadFBXAnimation } from '@component/code/atom/cc-a-animation-loader';
import { LoadCharacter } from '@component/code/atom/cc-a-model-loader/BlobModelLoader_hide_weapon_gameplay';
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

// Animation cache to avoid reloading the same animations
const animationCache = new Map<string, THREE.AnimationClip>();
let isModelReady = false;

// Export a getter function instead of the variable directly
export const getIsModelReady = (): boolean => {
  // console.log('getIsModelReady called, current value:', isModelReady);
  return isModelReady;
};

// Function to determine which pre-animation to use based on modelSrc
function getPreAnimationPath(modelSrc: string | undefined): string {
  const defaultPreAnimation = 'set2_pre_casting.fbx';

  if (!modelSrc) {
    return defaultPreAnimation;
  }

  const setMatch = modelSrc.match(/set(\d+)/i);
  if (!setMatch) {
    return defaultPreAnimation;
  }

  const setNumber = setMatch[1];
  const characterMatch = modelSrc.match(/character(\d+)/i);
  const characterNumber: string = characterMatch ? characterMatch[1] : ''; // Added type annotation

  switch (setNumber) {
    case '1':
      return 'set1char1attack.fbx';
    case '2':
      return 'set2_set4_casting_final.fbx';
    case '3':
      if (characterNumber === '1' || characterNumber === '2') {
        return 'casting_set3_character1-2.fbx';
      } else if (characterNumber === '3' || characterNumber === '4') {
        return 'casting_set3_character3-4.fbx';
      }
      return 'set3_pre_casting.fbx';
    case '4':
      return 'set2_set4_casting_final.fbx';
    case '5':
      return 'set5_casting_final.fbx';
    default:
      return defaultPreAnimation;
  }
}

// Function to determine which animation to use based on modelSrc and whether the answer is correct
function getAnimationPath(
  modelSrc: string | undefined,
  answerIsCorrect: boolean,
): string {
  const defaultCorrectAnimation = 'set2_casting_final.fbx';
  const defaultIncorrectAnimation = 'set2_casting_fail.fbx';

  if (!modelSrc) {
    return answerIsCorrect ? defaultCorrectAnimation : defaultIncorrectAnimation;
  }

  const setMatch = modelSrc.match(/set(\d+)/i);
  if (!setMatch) {
    return answerIsCorrect ? defaultCorrectAnimation : defaultIncorrectAnimation;
  }

  let characterNumber: string = '';
  const setNumber = setMatch[1];
  const characterMatch = modelSrc.match(/character(\d+)/i);
  characterNumber = characterMatch ? characterMatch[1] : ''; // Fixed this line

  switch (setNumber) {
    case '1':
      return answerIsCorrect ? 'set1char1win.fbx' : 'set1char1lose.fbx';
    case '2':
      return answerIsCorrect ? '/Victory/Set2.fbx' : '/Lose/Set2.fbx';
    case '3':
      if (characterNumber === '1' || characterNumber === '2') {
        return answerIsCorrect
          ? 'Victory/Set3 Character 1 and 2.fbx'
          : 'Lose/Set3 Character 1 and 2.fbx';
      } else if (characterNumber === '3' || characterNumber === '4') {
        return answerIsCorrect
          ? '/Victory/Set3 Character 3 and 4.fbx'
          : '/Lose/Set3 Character 3 and 4.fbx';
      }
      return answerIsCorrect ? 'set3_casting_success.fbx' : 'set3_casting_fail.fbx';
    case '4':
      return answerIsCorrect ? '/Victory/Set4.fbx' : '/Lose/Set4.fbx';
    case '5':
      return answerIsCorrect ? '/Victory/Set5.fbx' : '/Lose/Set5.fbx';
    default:
      return answerIsCorrect ? defaultCorrectAnimation : defaultIncorrectAnimation;
  }
}


// Optimized animation loader with caching
function loadAnimationWithCache(
  animationPath: string,
  onSuccess: (clip: THREE.AnimationClip) => void,
  onError: (error: any) => void,
): void {
  // Check cache first
  if (animationCache.has(animationPath)) {
    const cachedClip = animationCache.get(animationPath)!;
    // Clone the clip to avoid conflicts
    const clonedClip = cachedClip.clone();
    onSuccess(clonedClip);
    return;
  }

  // Load from file if not cached
  LoadFBXAnimation(
    `/assets/animation/${animationPath}`,
    (clip: THREE.AnimationClip) => {
      // Cache the original clip
      animationCache.set(animationPath, clip.clone());
      onSuccess(clip);
    },
    onError,
  );
}

export class GCACharacterModel {
  model: THREE.Group | THREE.Mesh | undefined;
  loader: THREE.Loader = new FBXLoader();
  mixer: THREE.AnimationMixer | undefined;
  shouldRotating: boolean = false;
  private preloadedAnimations = new Map<string, THREE.AnimationClip>();

  // Enhanced resource tracking
  private geometries: Set<THREE.BufferGeometry> = new Set();
  private materials: Set<THREE.Material> = new Set();
  private textures: Set<THREE.Texture> = new Set();
  private animationClips: Set<THREE.AnimationClip> = new Set();
  private loadedObjects: Set<THREE.Object3D> = new Set();
  private isDisposed: boolean = false;
  private configuredTextures: Set<THREE.Texture> = new Set();
  private scene: THREE.Scene | null = null;

  // Helper function to find bones by name - ADDED FROM REFERENCE CODE
  private findBone = (character: THREE.Group, name: string): THREE.Object3D | null => {
    let bone: THREE.Object3D | null = null;
    character.traverse((object: THREE.Object3D) => {
      if (object.name === name) {
        bone = object;
      }
    });
    return bone;
  };

  // Method to dispose of the current model and all its resources
  private disposeModel(): void {
    if (this.model) {
      console.log('Disposing old model...');

      // Stop and dispose mixer
      if (this.mixer) {
        this.mixer.stopAllAction();
        this.mixer.uncacheRoot(this.model);
        this.mixer = undefined;
      }

      // Traverse and dispose of all materials, geometries, and textures
      this.model.traverse((child: THREE.Object3D) => {
        // Changed type annotation here
        if (child instanceof THREE.Mesh) {
          // Dispose geometry
          if (child.geometry) {
            child.geometry.dispose();
          }

          // Dispose materials
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((material: THREE.Material) => {
                this.disposeMaterial(material);
              });
            } else {
              this.disposeMaterial(child.material);
            }
          }
        }
      });

      // Remove from parent if it has one
      if (this.model.parent) {
        this.model.parent.remove(this.model);
      }

      // Clear the model reference
      this.model = undefined;

      console.log('Old model disposed successfully');
    }
  }

  // Helper method to dispose of materials and their textures
  private disposeMaterial(material: THREE.Material): void {
    // Dispose of textures
    Object.keys(material).forEach((key) => {
      const value = (material as any)[key];
      if (value && value instanceof THREE.Texture) {
        value.dispose();
      }
    });

    // Dispose of the material itself
    material.dispose();
  }

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

  // Helper method to configure material textures
  private configureMaterialTexture = (
    material: THREE.Material,
    renderer: THREE.WebGLRenderer,
  ): void => {
    Object.keys(material).forEach((key) => {
      const texture = (material as any)[key];
      if (
        texture &&
        texture instanceof THREE.Texture &&
        !this.configuredTextures.has(texture)
      ) {
        texture.minFilter = THREE.LinearFilter;
        texture.generateMipmaps = false; // Disable for better performance
        texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy()); // Limit anisotropy
        this.configuredTextures.add(texture);
      }
    });
  };

  // Preload animations for smoother transitions
  private preloadAnimations(modelSrc: string, answerIsCorrect: boolean): void {
    const preAnimationFile = getPreAnimationPath(modelSrc);
    const resultAnimationFile = getAnimationPath(modelSrc, answerIsCorrect);

    // Preload pre-animation
    if (!this.preloadedAnimations.has(preAnimationFile)) {
      loadAnimationWithCache(
        preAnimationFile,
        (clip) => {
          this.preloadedAnimations.set(preAnimationFile, clip);
          this.animationClips.add(clip);
          console.log(`Preloaded pre-animation: ${preAnimationFile}`);
        },
        (error) =>
          console.error(`Failed to preload pre-animation: ${preAnimationFile}`, error),
      );
    }

    // Preload result animation
    if (!this.preloadedAnimations.has(resultAnimationFile)) {
      loadAnimationWithCache(
        resultAnimationFile,
        (clip) => {
          this.preloadedAnimations.set(resultAnimationFile, clip);
          this.animationClips.add(clip);
          console.log(`Preloaded result animation: ${resultAnimationFile}`);
        },
        (error) =>
          console.error(
            `Failed to preload result animation: ${resultAnimationFile}`,
            error,
          ),
      );
    }
  }

  Start = ({
    modelSrc,
    scene,
    renderer,
    shouldRotating = true,
    answerIsCorrect = true,
    onLoaded,
    onError,
  }: {
    modelSrc?: string;
    scene?: THREE.Object3D;
    shouldRotating?: boolean;
    renderer: THREE.WebGLRenderer;
    answerIsCorrect?: boolean;
    onLoaded?: () => void;
    onError?: (message: string) => void;
  }): void => {
    console.log('Model src in character: ' + modelSrc);

    // Dispose of the old model before loading a new one
    this.disposeModel();
    this.isDisposed = false;
    isModelReady = false;
    console.log('🔄 Set isModelReady to false at start');

    if (modelSrc) {
      if (scene instanceof THREE.Scene) {
        this.scene = scene;
        LoadCharacter(
          modelSrc,
          scene,
          (character: THREE.Group, actualModelUsed: string) => {
            if (this.isDisposed) return; // Don't proceed if disposed during loading

            let mixer: THREE.AnimationMixer | null = null;

            // Apply positioning logic (keeping your existing code) using actualModelUsed
            if (actualModelUsed.includes('set1')) {
              character.scale.set(0.98, 0.98, 0.98);
              character.position.y = 1.5;
              character.position.x = 0;
              character.position.z = 0.5;
              character.rotateX(0);
            } else if (actualModelUsed.includes('set2')) {
              character.scale.set(0.048, 0.048, 0.048);
              character.position.y = -0.5;
              character.position.x = 0;
              character.position.z = -1;
              character.rotateY(-15.8);
              character.rotateX(-0.2);
            } else if (actualModelUsed.includes('set3')) {
              character.scale.set(0.015, 0.015, 0.015);
              character.position.y = -0.5;
              character.position.x = 0;
              character.position.z = -2.2;
              character.rotateX(0.1);
              character.rotateY(-1.5);
            } else if (actualModelUsed.includes('set4')) {
              character.scale.set(0.048, 0.048, 0.048);
              character.position.y = -0.5;
              character.position.x = 0;
              character.position.z = -1;
              character.rotateY(-15.8);
              character.rotateX(-0.2);
            } else {
              character.scale.set(0.03, 0.03, 0.03);
              character.position.y = -0.5;
              character.position.x = 0.2;
              character.position.z = -0.5;
              character.rotateX(-0.0);
            }

            character.scale.set(0.04, 0.04, 0.04);
            character.translateY(-2);
            character.rotation.y = 1.0;
            this.model = character;

            // Initially hide the model
            character.visible = false;

            // Apply texture and material settings
            character.traverse((child: THREE.Object3D) => {
              if (child instanceof THREE.Mesh) {
                // Track geometry
                if (child.geometry) {
                  this.geometries.add(child.geometry);
                }

                // Disable frustum culling for better performance
                child.frustumCulled = false;

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

                if (child.material.map) {
                  child.material.map.minFilter = THREE.LinearFilter;
                  child.material.map.generateMipmaps = false; // Disable for better performance
                  child.material.map.anisotropy = Math.min(
                    4,
                    renderer.capabilities.getMaxAnisotropy(),
                  ); // Limit anisotropy
                }
                if (child.material.materials) {
                  child.material.materials.forEach((material: any) => {
                    if (material.map) {
                      material.map.minFilter = THREE.LinearFilter;
                      material.generateMipmaps = false;
                      material.anisotropy = Math.min(
                        4,
                        renderer.capabilities.getMaxAnisotropy(),
                      );
                    }
                  });
                }
              }
            });

            // Create mixer for animations
            mixer = new THREE.AnimationMixer(character);
            this.mixer = mixer;

            // Preload animations for smoother experience
            this.preloadAnimations(actualModelUsed, answerIsCorrect);

            // Get animation files
            const preAnimationFile = getPreAnimationPath(actualModelUsed);
            const resultAnimationFile = getAnimationPath(
              actualModelUsed,
              answerIsCorrect,
            );

            console.log(
              `Using pre-animation file: ${preAnimationFile} for model ${actualModelUsed}`,
            );

            // IMPROVED: Use findBone like the reference code
            if (actualModelUsed.includes('set1_character3')) {
              const boneTarget = this.findBone(character, 'Hair_Root');
              if (boneTarget) {
                boneTarget.name = 'Hair_Anchored';
              }
            }

            // Use cached animation if available, otherwise load
            const usePreloadedOrLoad = (
              animationFile: string,
              callback: (clip: THREE.AnimationClip) => void,
              errorCallback: (error: any) => void,
            ) => {
              if (this.preloadedAnimations.has(animationFile)) {
                const preloadedClip = this.preloadedAnimations.get(animationFile)!;
                callback(preloadedClip.clone());
              } else {
                loadAnimationWithCache(
                  animationFile,
                  (clip) => {
                    this.animationClips.add(clip);
                    callback(clip);
                  },
                  errorCallback,
                );
              }
            };

            // Load pre-animation
            usePreloadedOrLoad(
              preAnimationFile,
              (preClip: THREE.AnimationClip) => {
                if (!mixer || this.isDisposed) return;

                console.log('Pre-animation loaded:', preClip.name);
                const preAction = mixer.clipAction(preClip);
                preAction.setLoop(THREE.LoopOnce, 1);
                preAction.clampWhenFinished = true;

                // Use shorter timeout for better responsiveness
                setTimeout(() => {
                  if (this.isDisposed) return;
                  console.log('Switching to result animation after timeout');

                  // Load result animation
                  usePreloadedOrLoad(
                    resultAnimationFile,
                    (resultClip: THREE.AnimationClip) => {
                      if (!mixer || this.isDisposed) return;

                      console.log('Result animation loaded:', resultClip.name);
                      const resultAction = mixer.clipAction(resultClip);
                      resultAction.setLoop(THREE.LoopOnce, 1);
                      resultAction.clampWhenFinished = true;

                      // Call onLoaded callback
                      if (onLoaded && !this.isDisposed) {
                        console.log(
                          'Character model fully loaded with infinite result animation, calling onLoaded callback',
                        );
                        scene.add(character); //Add Model after it fully loaded
                        character.visible = true; //Show Model after it fully loaded

                        // SET MODEL READY TO TRUE HERE
                        isModelReady = true;
                        console.log('✅ Set isModelReady to true - model is now ready!');

                        onLoaded();
                        //resultAction.play();
                        setTimeout(() => {
                          preAction.play();
                          setTimeout(() => {
                            resultAction.play();
                          }, 1400);
                        }, 100);
                      }
                    },
                    (error: any) => {
                      console.error('Error loading result animation:', error);
                      if (onLoaded && !this.isDisposed) {
                        console.log(
                          'Character model loading had errors, still calling onLoaded',
                        );
                        scene.add(character); //Add Model after it fully loaded
                        character.visible = true; //Show Model after it fully loaded

                        // SET MODEL READY TO TRUE EVEN ON ERROR
                        isModelReady = true;
                        console.log(
                          '✅ Set isModelReady to true (with errors) - model is now ready!',
                        );

                        onLoaded();
                      }
                    },
                  );
                }, 1900); // Reduced from 2000ms to 1500ms
              },
              (error: any) => {
                console.error('Error loading pre-animation:', error);
                if (onLoaded && !this.isDisposed) {
                  console.log('Pre-animation loading had errors, still calling onLoaded');

                  // SET MODEL READY TO TRUE EVEN ON ERROR
                  isModelReady = true;
                  console.log(
                    '✅ Set isModelReady to true (pre-animation error) - model is now ready!',
                  );

                  onLoaded();
                }
              },
            );
          },
          (error: any) => {
            // <-- ADDED onError callback
            console.error('Error loading model: ', error);
            if (onError) {
              onError('Failed to load model');
            }
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
    if (this.model && this.shouldRotating) {
      //this.model.rotation.y += 0.001 * deltaTime;
    }
    if (this.mixer) {
      this.mixer.update(deltaTime / 1000);
    }
  };

  // Enhanced dispose method to clear all resources
  dispose = (): void => {
    console.log('Disposing GCAThreeModel...');
    this.isDisposed = true;

    // Stop and dispose animation mixers
    if (this.mixer) {
      this.mixer.stopAllAction();
      this.mixer.uncacheRoot(this.mixer.getRoot());
      this.mixer = undefined;
    }

    // Dispose animation clips
    this.animationClips.forEach((clip) => {
      if (this.mixer) {
        this.mixer.uncacheClip(clip);
      }
      clip.tracks = [];
    });
    this.animationClips.clear();

    // Dispose textures
    this.textures.forEach((texture) => {
      texture.dispose();
    });
    this.textures.clear();
    this.configuredTextures.clear();

    // Dispose materials
    this.materials.forEach((material) => {
      this.disposeMaterialCompletely(material);
    });
    this.materials.clear();

    // Dispose geometries
    this.geometries.forEach((geometry) => {
      geometry.dispose();
    });
    this.geometries.clear();

    // Dispose loaded objects
    this.loadedObjects.forEach((object) => {
      if (object.parent) {
        console.warn(`Object ${object.name} still has a parent after removal`);
        object.parent.remove(object);
      }
      this.disposeObject(object);
    });
    this.loadedObjects.clear();

    // Dispose main model
    if (this.model && this.scene) {
      this.scene.remove(this.model);
      this.disposeObject(this.model);
      this.model = undefined;
    }
    this.scene = null;

    // Clear preloaded animations
    this.preloadedAnimations.clear();

    // Clear loader
    this.loader = null as any;

    // Force garbage collection
    this.forceGarbageCollection();

    console.log('GCAThreeModel disposed successfully');
  };

  // Helper method to recursively dispose an object
  private disposeObject = (object: THREE.Object3D): void => {
    object.traverse((child: THREE.Object3D) => {
      // Changed type annotation here
      if (child instanceof THREE.Mesh) {
        // Dispose geometry
        if (child.geometry) {
          child.geometry.dispose();
        }

        // Dispose material(s) and their textures
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((material: THREE.Material) => {
              this.disposeMaterialCompletely(material);
            });
          } else {
            this.disposeMaterialCompletely(child.material);
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

  // Simplified garbage collection hints
  private forceGarbageCollection = (): void => {
    if (typeof window !== 'undefined' && (window as any).gc) {
      (window as any).gc();
    } else if (typeof global !== 'undefined' && (global as any).gc) {
      (global as any).gc();
    } else {
      console.log('Garbage collection not exposed; relying on automatic GC');
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
}
