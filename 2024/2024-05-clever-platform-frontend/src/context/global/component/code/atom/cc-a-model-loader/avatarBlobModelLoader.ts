// avatarCloudLoader.ts

import { StoreModelFileMethods } from '@global/store/global/avatar-models/index';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

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
  const actualModelURL =
    modelURL === null || modelURL === undefined || modelURL === '' || modelURL === '1'
      ? defaultModelURL
      : modelURL;

  const loader = new FBXLoader();
  console.log(`LoadFBXCharacter: Loading model from URL: ${actualModelURL}`);

  const handleLoad = (object: THREE.Group) => {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        console.log(child.name);

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
    });

    if (onLoad) onLoad(object);
    if (onFinally) onFinally(); // Call finally
  };

  const handleError = (error: ErrorEvent) => {
    console.error('FBXLoader Error loading model:', actualModelURL, error);

    // If we're already trying to load the default model, create a fallback cube
    if (actualModelURL === defaultModelURL) {
      console.warn('Default model failed to load, using fallback cube');
      const fallback = new THREE.Group();
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Red cube fallback
      const boxMesh = new THREE.Mesh(geometry, material);
      fallback.add(boxMesh);
      fallback.name = 'FallbackModel';
      fallback.position.set(0, 0, 0);

      scene.add(fallback);
      if (onLoad) onLoad(fallback);
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
      // Optional progress handling
    }
  };

  try {
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
  callback: (character: THREE.Group) => void,
  onError?: (error: ErrorEvent | Error) => void,
  isRetry: boolean = false,
) {
  // Only use default character when we're doing a retry
  const defaultCharacter = 'set1_character1_level1';

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
    } else {
      // Cache miss - if we're not already in a retry, try the default
      if (!isRetry) {
        console.warn(`Model "${modelKey}" not found in cache. Trying default model.`);
        return LoadCharacter(defaultCharacter, scene, callback, onError, true);
      } else {
        // We already tried the default and it failed
        const error = new Error(
          `Default model "${defaultCharacter}" not found in cache. Please preload models first.`,
        );
        console.error(error.message);
        if (onError) onError(error);
        return;
      }
    }
  } catch (error: any) {
    console.error(`LoadCharacter: Error accessing cache for "${modelKey}":`, error);
    if (onError) onError(error instanceof Error ? error : new Error(String(error)));
    return;
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

  const handleFinally = () => {
    if (objectUrlToRevoke) {
      console.log(`LoadCharacter: Revoking Object URL for key "${modelKey}"`);
      URL.revokeObjectURL(objectUrlToRevoke);
    }
  };

  const handleLoadSuccess = (character: THREE.Group) => {
    character.position.set(0, 0, 0);
    if (character.name !== 'FallbackModel') {
      scene.add(character);
    }
    callback(character);
  };

  const handleErrorLoad = (error: ErrorEvent | Error) => {
    if (onError) onError(error);
  };

  LoadFBXCharacter(
    sourceURL,
    //'/assets/model/Set1Fixes 2/Character1/Level3-5.fbx',
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
    onSuccess?: (model: THREE.Group) => void,
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
        (model) => {
          console.log(`Successfully loaded model: ${actualModelId}`);
          if (onSuccess) onSuccess(model);
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
