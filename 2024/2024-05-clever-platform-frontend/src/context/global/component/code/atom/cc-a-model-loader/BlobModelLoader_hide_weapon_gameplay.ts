// BlobModelLoader_hide_weapon_gameplay.ts

import { StoreModelFileMethods } from '@global/store/global/avatar-models/index';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

const CACHE_LOAD_MODEL: Record<string, any> = {};

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
  // console.log('Received avatar name: ', modelURL);

  const defaultModelURL = 'set1_character1_level1';
  const fallbackModelURL = '/assets/model/default_avatar_model.fbx'; // Define fallback file path
  const actualModelURL =
    modelURL === null || modelURL === undefined || modelURL === '' || modelURL === '1'
      ? defaultModelURL
      : modelURL;

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
          'HandAcc', //pencil _07 for apple
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
            child.visible = false;
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
      console.log(`Loading model: ${percentComplete.toFixed(2)}% completed`);
    }
  };

  try {
    const loader = new FBXLoader();
    // console.log(`LoadFBXCharacter: Loading model from URL: ${actualModelURL}`);
    loader.load(actualModelURL, handleLoad, onProgress);
  } catch (error) {
    console.error(`Exception while loading model ${actualModelURL}:`, error);
    handleError(error as ErrorEvent);
  }
}

/**
 * Load a character model from IndexedDB cache
 */
export async function LoadCharacter(
  selectedCharacter: string | null | undefined,
  scene: THREE.Scene,
  callback: (character: THREE.Group, actualModelUsed: string) => void, // Modified callback
  onError?: (error: ErrorEvent | Error) => void,
  onCharacterLoaded?: () => void, // Add this callback
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
  let actualModelUsed: string = modelKey; // Track which model was actually loaded

  const handleFinally = () => {
    if (objectUrlToRevoke) {
      console.log(`LoadCharacter: Revoking Object URL for key "${modelKey}"`);
      URL.revokeObjectURL(objectUrlToRevoke);
    }
  };

  const handleLoadSuccess = (character: THREE.Group) => {
    if (!(modelKey in CACHE_LOAD_MODEL)) {
      CACHE_LOAD_MODEL[modelKey] = character.clone(); // Cache the loaded model
    }

    character.position.set(0, 0, 0);
    if (character.name !== 'FallbackModel') {
      scene.add(character);
    }
    callback(character, actualModelUsed); // Pass the actual model used
  };

  const handleErrorLoad = (error: ErrorEvent | Error) => {
    // If loading failed and we're not already using the default, try the default
    if (!isRetry && modelKey !== defaultCharacter) {
      console.warn(
        `Failed to load "${modelKey}", trying default model "${defaultCharacter}"`,
      );
      actualModelUsed = defaultCharacter; // Update the actual model used
      return LoadCharacter(
        defaultCharacter,
        scene,
        callback,
        onError,
        onCharacterLoaded,
        true,
      );
    } else if (sourceURL !== fallbackModelURL) {
      console.warn(`Failed to load "${modelKey}", trying fallback model file`);
      sourceURL = fallbackModelURL;
      actualModelUsed = 'set1_character1_level1'; // Force to set1_character1_level1 for compatibility
      console.log(
        `Forcing model ID to "set1_character1_level1" for compatibility with fallback.`,
      );
      LoadFBXCharacter(
        sourceURL,
        scene,
        handleLoadSuccess,
        handleErrorLoad as (error: ErrorEvent) => void,
        'Face',
        handleFinally,
      );
      return;
    } else {
      console.error(`Failed to load fallback model file: ${sourceURL}`);
      // If even the fallback file fails, create a red cube as the last resort
      const fallback = new THREE.Group();
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Red cube fallback
      const boxMesh = new THREE.Mesh(geometry, material);
      fallback.add(boxMesh);
      fallback.name = 'FallbackModel';
      fallback.position.set(0, 0, 0);
      scene.add(fallback);
      actualModelUsed = 'set1_character1_level1'; // Still force to set1_character1_level1 even for fallback cube
      console.log(
        `Forcing model ID to "set1_character1_level1" for compatibility with fallback cube.`,
      );
      callback(fallback, actualModelUsed);
    }

    if (onError) onError(error);
  };

  // get the memory cache model first before going to IndexedDB
  if (modelKey in CACHE_LOAD_MODEL) {
    console.log(`LoadCharacter: Cache hit for key "${modelKey}"`);
    handleLoadSuccess(CACHE_LOAD_MODEL[modelKey]);
    return;
  }

  let sourceURL: string | null = null;
  let objectUrlToRevoke: string | null = null;

  try {
    console.log(`LoadCharacter: Checking cache for key "${modelKey}"...`);
    const modelBlob = await StoreModelFileMethods.getItem(modelKey);

    if (modelBlob) {
      console.log(
        `LoadCharacter: Cache HIT for key "${modelKey}". Size: ${modelBlob.size}. Creating Object URL.`,
      );
      sourceURL = URL.createObjectURL(modelBlob);
      objectUrlToRevoke = sourceURL;
      actualModelUsed = modelKey; // Set the actual model used
    } else {
      // Cache miss - if we're not already in a retry, try the default
      if (!isRetry) {
        console.warn(`Model "${modelKey}" not found in cache. Trying default model.`);
        return LoadCharacter(
          defaultCharacter,
          scene,
          callback,
          onError,
          onCharacterLoaded,
          true,
        );
      } else {
        // We already tried the default and it failed, use fallback file path
        console.warn(
          `Default model "${defaultCharacter}" not found in cache. Using fallback file path.`,
        );
        sourceURL = fallbackModelURL;
        actualModelUsed = 'set1_character1_level1'; // Force to set1_character1_level1 for compatibility
        console.log(
          `Forcing model ID to "set1_character1_level1" for compatibility with fallback.`,
        );
        // No need to revoke URL since it's a static path, not a blob
        objectUrlToRevoke = null;
      }
    }
  } catch (error: any) {
    console.error(`LoadCharacter: Error accessing cache for "${modelKey}":`, error);
    if (!isRetry) {
      console.warn(`Cache error for "${modelKey}", trying default model.`);
      return LoadCharacter(
        defaultCharacter,
        scene,
        callback,
        onError,
        onCharacterLoaded,
        true,
      );
    } else {
      console.warn(`Cache error for default model, using fallback file path.`);
      sourceURL = fallbackModelURL;
      actualModelUsed = 'set1_character1_level1'; // Force to set1_character1_level1 for compatibility
      console.log(
        `Forcing model ID to "set1_character1_level1" for compatibility with fallback.`,
      );
      objectUrlToRevoke = null;
    }
  }

  // Rest of your function remains the same
  if (!sourceURL) {
    const finalError = new Error(
      `Could not determine a valid source URL for "${modelKey}".`,
    );
    console.error(finalError.message);
    if (onError) onError(finalError);
    return;
  }

  LoadFBXCharacter(
    sourceURL,
    scene,
    handleLoadSuccess,
    handleErrorLoad as (error: ErrorEvent) => void,
    'Face',
    handleFinally,
  );
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
        () => {
          console.log('Model fully loaded');
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
