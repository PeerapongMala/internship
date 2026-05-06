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

// Note: getGLTFYOffset() has been moved to character-animation-controller-mainmenu.ts
// Use yOffset parameter in LoadGLTFCharacter() instead

/**
 * Get GLTF animation path - แยกตาม Set
 */
export function getGLTFAnimationPath(modelKey: string): string {
  // Changed from Look-Around to Idle (Look-Around files don't exist yet)
  if (modelKey.includes('set1')) return '/assets/animation/Idle-set1.gltf';
  if (modelKey.includes('set2')) return '/assets/animation/Idle-set2.gltf';
  if (modelKey.includes('set3')) return '/assets/animation/Idle-set3.gltf';
  if (modelKey.includes('set4')) return '/assets/animation/Idle-set4.gltf';
  if (modelKey.includes('set5')) return '/assets/animation/Idle-set5.gltf';
  // fallback
  return '/assets/animation/Idle-set1.gltf';
}

/**
 * Load animation from file (supports both FBX and GLTF) and apply to GLTF character
 * - Filters out position and scale tracks, keeps only quaternion (rotation)
 * - Adds mixamorig: prefix to track names if missing (for bone name matching)
 */
export function loadGLTFAnimation(
  animationPath: string,
  targetModel: THREE.Group,
  onSuccess: (mixer: THREE.AnimationMixer, clip: THREE.AnimationClip) => void,
  onError?: (error: Error) => void,
) {
  const isFBX = animationPath.toLowerCase().endsWith('.fbx');

  // Collect bone names from model
  const modelBones: string[] = [];
  targetModel.traverse((child: any) => {
    if (
      child.type === 'Bone' ||
      child.isBone === true ||
      child.name.includes('mixamorig')
    ) {
      modelBones.push(child.name);
    }
  });

  // Check bone naming format (mixamorig: with colon vs mixamorig without colon)
  const hasMixamorigWithColon = modelBones.some((b) => b.includes('mixamorig:'));
  const hasMixamorigWithoutColon = modelBones.some(
    (b) => b.startsWith('mixamorig') && !b.includes('mixamorig:'),
  );
  const hasMixamorigBones = hasMixamorigWithColon || hasMixamorigWithoutColon;

  // Process animation clip (shared logic for both FBX and GLTF)
  const processAnimationClip = (originalClip: THREE.AnimationClip) => {
    const modelBoneSet = new Set(modelBones);

    // Filter to keep only quaternion tracks (position/scale cause issues with different model scales)
    const processedTracks = originalClip.tracks
      .filter((track) => track.name.toLowerCase().includes('.quaternion'))
      .map((track) => {
        // Convert track bone names to match model bone names
        const parts = track.name.split('.');
        if (parts.length >= 2) {
          let boneName = parts[0];
          const property = parts.slice(1).join('.');

          if (hasMixamorigWithColon) {
            // Model uses mixamorig:X format - add prefix if missing
            if (!boneName.includes('mixamorig:')) {
              boneName = `mixamorig:${boneName}`;
            }
          } else if (hasMixamorigWithoutColon) {
            // Model uses mixamorigX format (no colon) - convert accordingly
            if (boneName.includes('mixamorig:')) {
              boneName = boneName.replace('mixamorig:', 'mixamorig');
            } else if (!boneName.startsWith('mixamorig')) {
              boneName = `mixamorig${boneName}`;
            }
          } else {
            // Model has no mixamorig prefix - remove it from tracks
            if (boneName.startsWith('mixamorig:')) {
              boneName = boneName.replace('mixamorig:', '');
            } else if (boneName.startsWith('mixamorig')) {
              boneName = boneName.replace('mixamorig', '');
            }
          }

          track.name = `${boneName}.${property}`;
        }
        return track;
      });

    // Create new clip with processed tracks
    const processedClip = new THREE.AnimationClip(
      originalClip.name,
      originalClip.duration,
      processedTracks,
    );

    // Create mixer on targetModel (wrapper) - Three.js needs to find bones from mixer's root
    const mixer = new THREE.AnimationMixer(targetModel);
    onSuccess(mixer, processedClip);
  };

  if (isFBX) {
    // Load FBX animation
    const fbxLoader = new FBXLoader();
    fbxLoader.load(
      animationPath,
      (fbx) => {
        if (fbx.animations && fbx.animations.length > 0) {
          processAnimationClip(fbx.animations[0]);
        } else {
          console.error('No animations found in FBX file');
          if (onError) onError(new Error('No animations in FBX'));
        }
      },
      undefined,
      (error) => {
        console.error(`Error loading FBX animation: ${animationPath}`, error);
        const err = error instanceof Error ? error : new Error(String(error));
        if (onError) onError(err);
      },
    );
  } else {
    // Load GLTF animation
    const gltfLoader = new GLTFLoader();
    console.log(`[loadGLTFAnimation] Loading GLTF animation from: ${animationPath}`);
    gltfLoader.load(
      animationPath,
      (gltf) => {
        console.log(`[loadGLTFAnimation] GLTF loaded, animations count: ${gltf.animations?.length || 0}`);
        if (gltf.animations && gltf.animations.length > 0) {
          console.log(`[loadGLTFAnimation] Processing animation: ${gltf.animations[0].name}, tracks: ${gltf.animations[0].tracks.length}`);
          processAnimationClip(gltf.animations[0]);
        } else {
          console.error('No animations found in GLTF file');
          if (onError) onError(new Error('No animations in GLTF'));
        }
      },
      undefined,
      (error) => {
        console.error(`Error loading GLTF animation: ${animationPath}`, error);
        const err = error instanceof Error ? error : new Error(String(error));
        if (onError) onError(err);
      },
    );
  }
}

/**
 * Remove junk objects outside the Armature from GLTF model
 * Keeps only Armature and its children, removes everything else at root level
 */
function cleanupGLTFJunkObjects(scene: THREE.Group): void {
  // Find the Armature (could be named "Armature", "Armature.001", etc.)
  let armature: THREE.Object3D | null = null;
  const objectsToRemove: THREE.Object3D[] = [];

  // First pass: find armature and identify junk objects at root level
  scene.children.forEach((child) => {
    // Check if this is the Armature (by name or by having bones)
    const isArmature =
      child.name.toLowerCase().includes('armature') ||
      child.type === 'Bone' ||
      (child.children && child.children.some((c) => c.type === 'Bone'));

    if (isArmature) {
      armature = child;
      console.log(`[GLTF Cleanup] Found Armature: "${child.name}"`);
    } else {
      // Check if it's a SkinnedMesh (these should be kept, they're attached to armature)
      const hasSkinnedMesh =
        child instanceof THREE.SkinnedMesh ||
        (child.children &&
          child.children.some((c) => c instanceof THREE.SkinnedMesh));

      if (!hasSkinnedMesh) {
        // This is likely junk - not armature, not skinned mesh
        objectsToRemove.push(child);
        console.log(
          `[GLTF Cleanup] Marked for removal: "${child.name}" (type: ${child.type})`,
        );
      }
    }
  });

  // Second pass: remove junk objects
  objectsToRemove.forEach((obj) => {
    scene.remove(obj);
    // Dispose resources
    obj.traverse((child) => {
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
  });

  if (objectsToRemove.length > 0) {
    console.log(
      `[GLTF Cleanup] Removed ${objectsToRemove.length} junk object(s) from model`,
    );
  }
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
  positionOffset?: { x?: number; y?: number }, // Optional position offset - get from getGLTFPositionOffset() in mainmenu controller
) {
  const defaultModelKey = 'set1_character1_level1';
  const actualModelKey = modelKey || defaultModelKey;
  const gltfPath = getLocalGLTFPath(actualModelKey);

  console.log(`LoadGLTFCharacter: Loading GLTF from path: ${gltfPath}`);

  // Clear THREE.Cache before loading to free memory
  THREE.Cache.clear();

  // Use shared loader instead of creating new one each time
  const loader = getSharedGLTFLoader();

  loader.load(
    gltfPath,
    (gltf) => {
      console.log(`GLTF Model loaded: ${actualModelKey}`);
      const character = gltf.scene;

      // Clean up junk objects outside Armature
      cleanupGLTFJunkObjects(character);

      // Debug: Log bounding box to check scale
      const box = new THREE.Box3().setFromObject(character);
      const size = new THREE.Vector3();
      box.getSize(size);
      console.log(
        `GLTF DEBUG: Model size before scale - width: ${size.x}, height: ${size.y}, depth: ${size.z}`,
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

      // Get per-character position offset (use parameter if provided, else default to 0)
      // Note: positionOffset should be passed from character-animation-controller-mainmenu.ts via getGLTFPositionOffset()
      const xOffset = positionOffset?.x ?? 0;
      const yOffset = positionOffset?.y ?? 0;

      // Adjust position: feet at Y=0 + per-character offset
      character.position.x = xOffset;
      character.position.y = -bottomY + yOffset;
      console.log(
        `GLTF DEBUG: model=${actualModelKey}, bottomY=${bottomY.toFixed(2)}, xOffset=${xOffset}, yOffset=${yOffset}, finalY=${character.position.y.toFixed(2)}`,
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
      console.log(`GLTF DEBUG: Found ${gltfAnimations.length} animations in GLTF file`);
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
        console.log(`Loading GLTF: ${percentComplete.toFixed(2)}%`);
      }
    },
    (error: any) => {
      console.error(`Error loading GLTF model ${gltfPath}:`, error);
      if (onError) onError(error);
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
  callback: (character: THREE.Group, actualModelUsed: string, gltfAnimations?: THREE.AnimationClip[]) => void, // Modified callback with animations
  onError?: (error: ErrorEvent | Error) => void,
  isRetry: boolean = false,
  positionOffset?: { x?: number; y?: number }, // Position offset - get from getGLTFPositionOffset() in mainmenu controller
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
  console.log(`LoadCharacter (GLTF TEST): Loading ${modelKey} directly from local GLTF`);

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
    (character, loadedModelKey, gltfAnimations) => {
      console.log(`GLTF TEST: Loaded model ${loadedModelKey}, animations: ${gltfAnimations?.length || 0}`);
      character.position.set(0, 0, 0);
      scene.add(character);
      callback(character, loadedModelKey, gltfAnimations);
    },
    (error) => {
      console.error(`GLTF TEST: Error loading model:`, error);
      if (onError) onError(error);
    },
    positionOffset, // Pass positionOffset to LoadGLTFCharacter
  );
  return; // Skip the rest of the function (FBX/cache logic)
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
