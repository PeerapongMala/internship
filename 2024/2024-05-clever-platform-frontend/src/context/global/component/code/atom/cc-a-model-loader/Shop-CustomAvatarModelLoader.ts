// avatarCloudLoader.ts

import { StoreModelFileMethods } from '@global/store/global/avatar-models/index';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
// === GLTF TEST: Added GLTFLoader ===
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Singleton loader to prevent memory leaks from creating multiple loaders
let sharedGLTFLoader: GLTFLoader | null = null;
function getSharedGLTFLoader(): GLTFLoader {
  if (!sharedGLTFLoader) {
    sharedGLTFLoader = new GLTFLoader();
  }
  return sharedGLTFLoader;
}

// === MODEL CACHE LIMIT SYSTEM ===
// Limit number of models in memory to prevent iPad crashes
// iPad Air 2: ผ่านที่ 2, iPad Gen 6: ต้องใช้ 1
const MAX_MODELS_IN_MEMORY = 1;
const loadedModelsCache: Array<{ name: string; object: THREE.Object3D }> = [];

function disposeObject3D(obj: THREE.Object3D) {
  obj.traverse((child: any) => {
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
}

function addToModelCache(name: string, object: THREE.Object3D, scene: THREE.Scene) {
  // Check if model already in cache
  const existingIndex = loadedModelsCache.findIndex((m) => m.name === name);
  if (existingIndex !== -1) {
    // Move to end (most recently used)
    const [existing] = loadedModelsCache.splice(existingIndex, 1);
    loadedModelsCache.push(existing);
    return;
  }

  // Add new model to cache
  loadedModelsCache.push({ name, object });
  console.log(`Model cache: Added ${name}, total models: ${loadedModelsCache.length}`);

  // If over limit, remove oldest models
  while (loadedModelsCache.length > MAX_MODELS_IN_MEMORY) {
    const oldest = loadedModelsCache.shift();
    if (oldest) {
      console.log(`Model cache: Removing oldest model ${oldest.name} to free memory`);
      disposeObject3D(oldest.object);
      scene.remove(oldest.object);
      // Force garbage collection hint
      THREE.Cache.clear();
    }
  }
}

function removeFromModelCache(name: string) {
  const index = loadedModelsCache.findIndex((m) => m.name === name);
  if (index !== -1) {
    loadedModelsCache.splice(index, 1);
    console.log(`Model cache: Removed ${name}, total models: ${loadedModelsCache.length}`);
  }
}
// === END MODEL CACHE LIMIT SYSTEM ===

/**
 * Load an FBX character model from a URL
 */
export function LoadFBXCharacter(
  modelURL: string | null | undefined,
  scene: THREE.Scene,
  onLoad: (object: THREE.Group) => void,
  onError: (error: ErrorEvent) => void,
  faceMeshName: string = 'Face',
  onFinally?: () => void,
) {
  // Set default model URL if modelURL is null, undefined, or empty string
  console.log('Received avatar name: ', modelURL);

  const defaultModelURL = 'set1_character1_level1';
  const fallbackModelURL = '/assets/model/default_avatar_model.fbx'; // Define fallback file path
  const actualModelURL =
    modelURL === null || modelURL === undefined || modelURL === '' || modelURL === '1'
      ? defaultModelURL
      : modelURL;

  const loader = new FBXLoader();
  console.log(`LoadFBXCharacter: Loading model from URL: ${actualModelURL}`);

  const handleLoad = (object: THREE.Group) => {
    console.log(`Model loaded: ${actualModelURL}`);
    console.log(`Total children in model: ${object.children.length}`);

    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.isMesh) {
          if (
            child.name === 'lens_eye_grp' ||
            child.name === 'lens_eye_grp001' ||
            child.name === 'lens_eye_grp1'
          ) {
            const material = child.material;
            if (Array.isArray(material)) {
              material.forEach((mat) => {
                if (
                  mat.name === 'Bunny_Eyes_Outside' ||
                  mat.name === 'Cat_Nature_Eye_Outside' ||
                  mat.name === 'Cat_Nature_Skin' ||
                  mat.name === 'Cartoon_Cat_Eye_Out' ||
                  mat.name === 'Cat_Girl_Eye_outside' ||
                  mat.name === 'Cat_Girl_Skin'
                ) {
                  mat.transparent = true;
                  mat.opacity = 0;
                }
              });
            } else {
              material.transparent = true;
              material.opacity = 1;
            }
            material.transparent = true;
            material.opacity = 1;
          }

          // Enable transparency for all mesh materials
        }

        // Log bounding box
        const boundingBox = new THREE.Box3().setFromObject(child);
        const size = new THREE.Vector3();
        boundingBox.getSize(size);
        console.log(
          `  - Dimensions: width=${size.x.toFixed(2)}, height=${size.y.toFixed(2)}, depth=${size.z.toFixed(2)}`,
        );

        child.castShadow = true;
        child.receiveShadow = true;

        if (child.name === 'Face' || child.name.includes('Face')) {
          const material = child.material;
          if (Array.isArray(material)) {
            material.forEach((mat) => {
              mat.transparent = true;
              mat.opacity = 1; // Set your desired transparency level
              mat.needsUpdate = true;
            });
          } else if (material) {
            material.transparent = true;
            material.opacity = 1;
            material.needsUpdate = true;
          }
        }

        // Apply material updates to all meshes
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((material) => {
              material.needsUpdate = true;
            });
          } else {
            child.material.needsUpdate = true;
          }
        }
      }
      if (child instanceof THREE.Mesh) {
        // Create a list of mesh names to hide
        const meshesToHide = [
          'HandAcc',
          'Sword_1',
          'Axe',
          'Spear',
          'Sword',
          'Root_M',
          'Bow_Wooden',
          'Bow_Steel',
          'BowMG_1',
          'M_fantasy_staff_set05_03',
          'M_fantasy_staff_set05_02',
          'M_fantasy_staff_set05_05',
          'Wand_F05',
        ];

        // Check if the current mesh name includes any of the names in our list
        if (meshesToHide.some((name) => child.name.includes(name))) {
          // Show weapon for set2_character1, hide for others
          if (modelURL?.includes('set2_character1')) {
            child.visible = true;
            console.log(`Showing mesh for set2_character1: ${child.name}`);
          } else {
            child.visible = true;
            console.log(`Hidden mesh: ${child.name}`);
          }
          console.log(`Showing mesh: ${child.name}`);
        }
      }
    });

    if (onLoad) onLoad(object);
    if (onFinally) onFinally(); // Call finally
  };

  const handleError = (error: ErrorEvent) => {
    console.error('FBXLoader Error loading model:', actualModelURL, error);

    // If we're already trying to load the fallback model, create a fallback cube
    if (actualModelURL === fallbackModelURL) {
      console.warn('Fallback model failed to load, using fallback cube');
      const fallback = new THREE.Group();
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Red cube fallback
      const boxMesh = new THREE.Mesh(geometry, material);
      fallback.add(boxMesh);
      fallback.name = 'FallbackModel';
      fallback.position.set(0, 0, 0);

      scene.add(fallback);
      if (onLoad) onLoad(fallback);
    } else if (actualModelURL === defaultModelURL) {
      console.warn('Default model failed to load, trying fallback model file');
      LoadFBXCharacter(fallbackModelURL, scene, onLoad, onError, faceMeshName, onFinally);
      return;
    } else {
      // Try to load the default model instead
      console.warn(
        `Model ${actualModelURL} failed to load, attempting to load default model`,
      );
      LoadFBXCharacter(defaultModelURL, scene, onLoad, onError, faceMeshName, onFinally);
      // Return early since we're handling this in the recursive call
      return;
    }

    if (onError) onError(error);
    if (onFinally) onFinally(); // Call finally
  };

  const onProgress = (xhr: ProgressEvent<EventTarget>) => {
    if (xhr.lengthComputable) {
      const percentComplete = (xhr.loaded / xhr.total) * 100;
      //console.log(`Loading model: ${percentComplete.toFixed(2)}% completed`);
    }
  };

  try {
    loader.load(actualModelURL, handleLoad, onProgress);
  } catch (error) {
    //console.error(`Exception while loading model ${actualModelURL}:`, error);
    handleError(error as ErrorEvent);
  }
}

// === GLTF TEST: New function to load GLTF character from local path ===

/**
 * Get Y position offset for each character type (adjust these values as needed)
 */
function getGLTFYOffset(modelKey: string): number {
  // Set 1
  if (modelKey.includes('set1_character1')) return -70;
  if (modelKey.includes('set1_character2')) return -70;
  if (modelKey.includes('set1_character3')) return -70;
  if (modelKey.includes('set1_character4')) return -70;

  // Set 2
  if (modelKey.includes('set2_character1')) return -30;
  if (modelKey.includes('set2_character2')) return -30;
  if (modelKey.includes('set2_character3')) return -30;
  if (modelKey.includes('set2_character4')) return -30;

  // Set 3
  if (modelKey.includes('set3_character1')) return -30;
  if (modelKey.includes('set3_character2')) return -30;
  if (modelKey.includes('set3_character3')) return -30;
  if (modelKey.includes('set3_character4')) return -30;

  // Set 4
  if (modelKey.includes('set4_character1')) return -30;
  if (modelKey.includes('set4_character2')) return -30;
  if (modelKey.includes('set4_character3')) return -30;
  if (modelKey.includes('set4_character4')) return -30;

  // Set 5
  if (modelKey.includes('set5_character1')) return -3000;
  if (modelKey.includes('set5_character2')) return -3000;
  if (modelKey.includes('set5_character3')) return -3000;
  if (modelKey.includes('set5_character4')) return -3000;

  return 0; // Default
}

/**
 * Convert model key (e.g., "set1_character1_level1") to local GLTF path
 */
function getLocalGLTFPath(modelKey: string): string {
  // modelKey format: set1_character1_level1
  // target path: /assets/model/gltf/Set1/character1/level1.gltf
  const match = modelKey.match(/set(\d+)_character(\d+)_level(\d+)/i);
  if (match) {
    const [, setNum, charNum, levelNum] = match;
    // All sets use optimized GLB files (smaller textures)
    return `/assets/model/gltf/Set${setNum}/character${charNum}/level${levelNum}.glb`;
  }
  // fallback to default
  return '/assets/model/gltf/Set1/character1/level1.glb';
}

/**
 * Load a GLTF character model from local path (for testing)
 */
export function LoadGLTFCharacter(
  modelKey: string | null | undefined,
  scene: THREE.Scene,
  onLoad: (
    object: THREE.Group,
    actualModelUsed: string,
    animations?: THREE.AnimationClip[],
  ) => void,
  onError?: (error: Error) => void,
) {
  const defaultModelKey = 'set1_character1_level1';
  const actualModelKey = modelKey || defaultModelKey;
  const gltfPath = getLocalGLTFPath(actualModelKey);

  console.log(`LoadGLTFCharacter (Shop): Loading GLTF from path: ${gltfPath}`);

  // Clear THREE.Cache before loading to free memory
  THREE.Cache.clear();

  // Use shared loader instead of creating new one each time
  const loader = getSharedGLTFLoader();

  loader.load(
    gltfPath,
    (gltf) => {
      console.log(`GLTF Model loaded (Shop): ${actualModelKey}`);
      const character = gltf.scene;

      // Debug: Log bounding box to check scale
      const box = new THREE.Box3().setFromObject(character);
      const size = new THREE.Vector3();
      box.getSize(size);
      console.log(
        `GLTF DEBUG (Shop): Model size before scale - width: ${size.x}, height: ${size.y}, depth: ${size.z}`,
      );

      // GLTF models are in meters (~1.1m tall), FBX models were in cm (~170-200 units)
      // Use wrapper group approach: scale character inside, let animation controller scale wrapper
      // Adjust this value if model is too big/small
      const gltfToFbxScale = 150; // Reduced from 170 - adjust as needed
      character.scale.set(gltfToFbxScale, gltfToFbxScale, gltfToFbxScale);

      // Create wrapper group - animation controller will scale this, not the character directly
      const wrapper = new THREE.Group();
      wrapper.name = `GLTF:${actualModelKey}`;
      wrapper.add(character);

      // Calculate bounding box AFTER scaling to find the bottom of the model
      const scaledBox = new THREE.Box3().setFromObject(character);
      const bottomY = scaledBox.min.y; // The lowest point of the model

      // Get per-character Y offset adjustment
      const characterYOffset = getGLTFYOffset(actualModelKey);

      // Adjust position: feet at Y=0 + per-character offset
      character.position.y = -bottomY + characterYOffset;
      console.log(
        `GLTF DEBUG (Shop): model=${actualModelKey}, bottomY=${bottomY.toFixed(2)}, offset=${characterYOffset}, finalY=${character.position.y.toFixed(2)}`,
      );

      // Apply same settings as FBX loader
      character.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          // Disable frustum culling (same as FBX fix)
          child.frustumCulled = false;
        }
      });

      wrapper.position.set(0, 0, 0);

      // Log animations from GLTF file (if any)
      const gltfAnimations = gltf.animations;
      console.log(
        `GLTF DEBUG (Shop): Found ${gltfAnimations.length} animations in GLTF file`,
      );
      if (gltfAnimations.length > 0) {
        gltfAnimations.forEach((clip, i) => {
          console.log(`  Animation ${i}: ${clip.name}, duration: ${clip.duration}s`);
        });
      }

      // Return wrapper as the "character" so animation controller scales the wrapper
      // Also pass GLTF animations if available
      if (onLoad) onLoad(wrapper as THREE.Group, actualModelKey, gltfAnimations);
    },
    (progress) => {
      if (progress.lengthComputable) {
        const percentComplete = (progress.loaded / progress.total) * 100;
        console.log(`Loading GLTF (Shop): ${percentComplete.toFixed(2)}%`);
      }
    },
    (error) => {
      console.error(`Error loading GLTF model (Shop) ${gltfPath}:`, error);
      const err = error instanceof Error ? error : new Error(String(error));
      if (onError) onError(err);
    },
  );
}
// === END GLTF TEST ===

/**
 * Load a character model from IndexedDB cache
 */
export async function LoadCharacter(
  selectedCharacter: string | null | undefined,
  scene: THREE.Scene,
  callback: (
    character: THREE.Group,
    actualModelUsed: string,
    embeddedAnimations?: THREE.AnimationClip[],
  ) => void,
  onError?: (error: ErrorEvent | Error) => void,
  isRetry: boolean = false,
) {
  // Only use default character when we're doing a retry
  const defaultCharacter = 'set1_character1_level1';
  const fallbackModelURL = '/assets/model/default_avatar_model.fbx'; // Direct file path for fallback

  // If selectedCharacter is empty/null/undefined and this is NOT a retry,
  // exit early without loading anything
  if (
    (selectedCharacter === null ||
      selectedCharacter === undefined ||
      selectedCharacter === '') &&
    !isRetry
  ) {
    console.log('LoadCharacter: Waiting for valid character selection...');
    return;
  }

  // Only use default model on explicit retry
  // Make sure modelKey is always a string
  const modelKey: string = isRetry
    ? defaultCharacter
    : selectedCharacter || defaultCharacter;

  // === GLTF TEST: Skip cache check, load directly from local GLTF files ===

  // Remove old GLTF models from scene before loading new one (prevent memory leak)
  const objectsToRemove: THREE.Object3D[] = [];
  scene.traverse((child) => {
    if (child.name.startsWith('GLTF:')) {
      objectsToRemove.push(child);
    }
  });
  objectsToRemove.forEach((obj) => {
    // Dispose resources before removing
    obj.traverse((child: any) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat: any) => {
            // Dispose textures
            Object.keys(mat).forEach((key) => {
              if (mat[key] && mat[key].isTexture) mat[key].dispose();
            });
            mat.dispose();
          });
        } else {
          Object.keys(child.material).forEach((key) => {
            if (child.material[key] && child.material[key].isTexture) child.material[key].dispose();
          });
          child.material.dispose();
        }
      }
    });
    scene.remove(obj);
    console.log(`Removed old model from scene: ${obj.name}`);
  });

  LoadGLTFCharacter(
    modelKey,
    scene,
    (character, loadedModelKey, embeddedAnimations) => {
      character.position.set(0, 0, 0);
      scene.add(character);
      // Add to model cache (will auto-remove oldest if over limit)
      addToModelCache(character.name, character, scene);
      callback(character, loadedModelKey, embeddedAnimations);
    },
    (error) => {
      console.error(`GLTF TEST (Shop): Error loading model:`, error);
      if (onError) onError(error);
    },
  );
  return;
  // === END GLTF TEST ===
}

/**
 * List all models in cache
 */
export async function listCachedModels(): Promise<string[]> {
  try {
    const modelList = await StoreModelFileMethods.getAllKeys();
    return modelList || [];
  } catch (error) {
    console.error('Error listing cached models:', error);
    return [];
  }
}

/**
 * Check if a specific model exists in cache
 */
export async function isModelCached(modelId: string): Promise<boolean> {
  try {
    const modelBlob = await StoreModelFileMethods.getItem(modelId);
    return !!modelBlob;
  } catch (error) {
    console.error(`Error checking if model ${modelId} is cached:`, error);
    return false;
  }
}

/**
 * React hook for model loading from IndexedDB
 */
export function useModelLoader() {
  const [cachedModels, setCachedModels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load the list of cached models
  useEffect(() => {
    async function loadCachedModelList() {
      setIsLoading(true);
      try {
        const models = await listCachedModels();
        setCachedModels(models);
      } catch (err) {
        console.error('Failed to load cached model list:', err);
        setError('Failed to load cached model list');
      } finally {
        setIsLoading(false);
      }
    }

    loadCachedModelList();
  }, []);

  // Function to load a model from cache
  const loadModelFromCache = async (
    modelId: string | null | undefined,
    scene: THREE.Scene,
    onSuccess?: (model: THREE.Group, actualModelUsed: string) => void, // Modified callback
  ) => {
    setIsLoading(true);

    // Handle null/undefined/empty modelId
    const defaultModelId = 'set1_character1_level1';
    const actualModelId =
      modelId === null || modelId === undefined || modelId === ''
        ? defaultModelId
        : modelId;

    setSelectedModel(actualModelId);
    setError(null);

    try {
      // Check if model exists in cache
      const exists = await isModelCached(actualModelId);
      if (!exists) {
        // If the model doesn't exist and it's not already the default, try the default
        if (actualModelId !== defaultModelId) {
          console.warn(
            `Model "${actualModelId}" not found in cache, trying default model`,
          );
          return loadModelFromCache(defaultModelId, scene, onSuccess);
        }
        throw new Error(`Default model "${defaultModelId}" not found in cache`);
      }

      // Load the model
      await LoadCharacter(
        actualModelId,
        scene,
        (model, actualModelUsed) => {
          // Updated callback parameters
          console.log(`Successfully loaded model: ${actualModelUsed}`);
          if (onSuccess) onSuccess(model, actualModelUsed);
        },
        (err) => {
          console.error(`Error loading model ${actualModelId}:`, err);
          setError(`Error loading model: ${err.message || 'Unknown error'}`);
        },
      );
    } catch (err: any) {
      console.error(`Failed to load model ${actualModelId}:`, err);
      setError(err.message || 'Failed to load model');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    cachedModels,
    isLoading,
    selectedModel,
    error,
    loadModelFromCache,
  };
}

export default {
  LoadFBXCharacter,
  LoadCharacter,
  listCachedModels,
  isModelCached,
  useModelLoader,
};
