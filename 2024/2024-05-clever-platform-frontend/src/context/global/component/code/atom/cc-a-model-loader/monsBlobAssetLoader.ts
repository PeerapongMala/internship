// petBlobAssetLoader.ts

import { StoreModelFileMethods } from '@global/store/global/avatar-models/index';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

// Define proper interfaces for the API response and model data
interface ModelData {
  model_id: string;
  url: string;
  size?: number;
  [key: string]: any;
}

interface ApiResponse {
  status_code: number;
  data: ModelData[];
  message: string;
}

interface ModelResult {
  size?: number;
  blob?: Blob;
  type?: string;
  lastModified?: number;
  [key: string]: any;
}

/**
 * Load an FBX character model from a URL or blob
 */
export function LoadFBXCharacter(
  modelSource: string | Blob,
  scene: THREE.Scene,
  onLoad: (object: THREE.Group) => void,
  onError: (error: ErrorEvent) => void,
  faceMeshName: string = 'Face',
  onFinally?: () => void,
) {
  const loader = new FBXLoader();
  const isBlob = modelSource instanceof Blob;
  let objectUrl: string | null = null;

  // Create object URL if source is a blob
  if (isBlob) {
    objectUrl = URL.createObjectURL(modelSource);
    console.log(
      `LoadFBXCharacter: Loading model from Blob (size: ${(modelSource as Blob).size} bytes)`,
    );
  } else {
    console.log(`LoadFBXCharacter: Loading model from URL: ${modelSource}`);
  }

  const sourceUrl = isBlob ? (objectUrl as string) : (modelSource as string);

  const handleLoad = (object: THREE.Group) => {
    // Cleanup object URL if we created one
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = null;
    }

    // Process the loaded object
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
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

    // Adjust properties for the face mesh if it exists
    const faceMesh = object.getObjectByName(faceMeshName) as THREE.Mesh | undefined;
    if (faceMesh) {
      if (Array.isArray(faceMesh.material)) {
        faceMesh.material.forEach((material) => {
          material.transparent = true;
          material.opacity = 1;
          material.needsUpdate = true;
        });
      } else if (faceMesh.material) {
        faceMesh.material.transparent = true;
        faceMesh.material.opacity = 1;
        faceMesh.material.needsUpdate = true;
      }
    } else {
      console.warn(
        `LoadFBXCharacter: Face mesh with name '${faceMeshName}' not found in model`,
      );
    }

    if (onLoad) onLoad(object);
    if (onFinally) onFinally(); // Call finally callback
  };

  const handleError = (error: ErrorEvent) => {
    // Cleanup object URL if we created one
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = null;
    }

    console.error('FBXLoader Error loading model:', error);

    // Create fallback object
    const fallback = new THREE.Group();
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Red cube fallback
    const boxMesh = new THREE.Mesh(geometry, material);
    fallback.add(boxMesh);
    fallback.name = 'FallbackModel';
    fallback.position.set(0, 0, 0);

    scene.add(fallback);
    if (onLoad) onLoad(fallback);
    if (onError) onError(error);
    if (onFinally) onFinally(); // Call finally callback
  };

  const onProgress = (xhr: ProgressEvent<EventTarget>) => {
    if (xhr.lengthComputable) {
      const percentComplete = Math.round((xhr.loaded / xhr.total) * 100);
      console.log(`FBXLoader: ${percentComplete}% loaded.`);
    }
  };

  // Load the model
  loader.load(sourceUrl, handleLoad, onProgress);
}

/**
 * Load a character model from IndexedDB cache or fallback to URL
 */
export async function LoadCharacter(
  modelId: string,
  scene: THREE.Scene,
  callback: (character: THREE.Group) => void,
  onError?: (error: ErrorEvent | Error) => void,
) {
  // Use model ID directly as the key for cache lookup
  let modelSource: string | Blob;
  let usingCache = false;

  try {
    // Try to get the model from IndexedDB
    console.log(`LoadCharacter: Checking cache for key "${modelId}"...`);
    const cachedModel = (await StoreModelFileMethods.getItem(
      modelId,
    )) as ModelResult | null;

    if (cachedModel && cachedModel.blob instanceof Blob) {
      // Cache hit - use the blob directly
      console.log(
        `LoadCharacter: Cache HIT for key "${modelId}". Size: ${cachedModel.blob.size} bytes.`,
      );
      modelSource = cachedModel.blob;
      usingCache = true;
    } else {
      // Cache miss - we need to inform the caller
      throw new Error(
        `Model "${modelId}" not found in cache. Please preload models first.`,
      );
    }
  } catch (error: any) {
    console.error(`LoadCharacter: Error accessing model "${modelId}":`, error);
    if (onError) onError(error instanceof Error ? error : new Error(String(error)));
    return;
  }

  // Wrapper for the success callback
  const handleLoadSuccess = (character: THREE.Group) => {
    // Position the character
    character.position.set(0, 0, 0);

    // Add to scene if not already added
    if (character.name !== 'FallbackModel' && !scene.getObjectById(character.id)) {
      scene.add(character);
    }

    // Call the original callback
    callback(character);
  };

  // Wrapper for the error callback
  const handleErrorLoad = (error: ErrorEvent | Error) => {
    if (onError) onError(error);
  };

  // Load the model
  LoadFBXCharacter(
    modelSource,
    scene,
    handleLoadSuccess,
    handleErrorLoad as (error: ErrorEvent) => void,
    'Face',
  );
}

/**
 * Fetch a model from URL and cache it in IndexedDB
 */
export async function fetchAndCacheModel(
  modelId: string,
  modelUrl: string,
  onProgress?: (progress: number) => void,
): Promise<boolean> {
  try {
    console.log(`Fetching and caching model: ${modelId} from ${modelUrl}`);

    // Create a fetch request with progress tracking
    const response = await fetch(modelUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the blob from the response
    const blob = await response.blob();
    console.log(`Downloaded model ${modelId}, size: ${blob.size} bytes`);

    // Store in IndexedDB with the correct structure
    await StoreModelFileMethods.addItem(modelId, modelUrl);

    console.log(`Successfully cached model ${modelId}`);
    return true;
  } catch (error) {
    console.error(`Error fetching and caching model ${modelId}:`, error);
    return false;
  }
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
    const model = await StoreModelFileMethods.getItem(modelId);
    return !!model;
  } catch (error) {
    console.error(`Error checking if model ${modelId} is cached:`, error);
    return false;
  }
}

/**
 * Preload multiple models into IndexedDB cache using API response format
 */
export async function preloadModelsFromApi(
  apiResponse: ApiResponse,
  progressCallback?: (
    loaded: number,
    total: number,
    currentSize: number,
    totalSize: number,
  ) => void,
): Promise<void> {
  if (!apiResponse || !apiResponse.data || !Array.isArray(apiResponse.data)) {
    console.error('Invalid API response format');
    return;
  }

  const modelData = apiResponse.data;
  const total = modelData.length;
  let loaded = 0;
  let currentSize = 0;

  // Estimate total size (roughly 1.5MB per model)
  const estimatedTotalSize = total * 1.5 * 1024 * 1024;

  console.log(`Starting preload of ${total} models from API response`);

  // Process in batches of 5
  for (let i = 0; i < modelData.length; i += 5) {
    const batch = modelData.slice(i, i + 5);

    await Promise.all(
      batch.map(async (model: ModelData) => {
        if (!model.model_id || !model.url) {
          console.warn('Invalid model data', model);
          loaded++;
          if (progressCallback) {
            progressCallback(loaded, total, currentSize, estimatedTotalSize);
          }
          return;
        }

        try {
          // Check if already cached
          const isCached = await isModelCached(model.model_id);

          if (!isCached) {
            // Fetch and cache
            const success = await fetchAndCacheModel(model.model_id, model.url);

            if (success) {
              // Get the model to check its size
              const cachedModel = (await StoreModelFileMethods.getItem(
                model.model_id,
              )) as ModelResult | null;
              if (cachedModel && cachedModel.size) {
                currentSize += cachedModel.size;
              } else {
                // Estimate if size not available
                currentSize += 1.5 * 1024 * 1024;
              }
            }
          } else {
            // Model already cached, get its size
            const cachedModel = (await StoreModelFileMethods.getItem(
              model.model_id,
            )) as ModelResult | null;
            if (cachedModel && cachedModel.size) {
              currentSize += cachedModel.size;
            } else {
              // Estimate if size not available
              currentSize += 1.5 * 1024 * 1024;
            }
          }
        } catch (error) {
          console.error(`Error preloading model ${model.model_id}:`, error);
        } finally {
          loaded++;
          if (progressCallback) {
            progressCallback(loaded, total, currentSize, estimatedTotalSize);
          }
        }
      }),
    );
  }

  console.log(`Completed preloading ${loaded}/${total} models`);
}

/**
 * Helper function to filter models from API response by type
 */
export function filterModelsByType(
  apiResponse: ApiResponse,
  type: 'model' | 'animation',
): ModelData[] {
  if (!apiResponse || !apiResponse.data || !Array.isArray(apiResponse.data)) {
    return [];
  }

  // Filter models based on naming convention
  if (type === 'model') {
    // Models don't have the _Anim suffix
    return apiResponse.data.filter(
      (item: ModelData) => item.model_id && item.url && !item.model_id.endsWith('_Anim'),
    );
  } else if (type === 'animation') {
    // Animations have the _Anim suffix
    return apiResponse.data.filter(
      (item: ModelData) => item.model_id && item.url && item.model_id.endsWith('_Anim'),
    );
  }

  return [];
}

/**
 * React hook for model loading from IndexedDB
 */
export function useModelLoader() {
  const [cachedModels, setCachedModels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

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
    modelId: string,
    scene: THREE.Scene,
    onSuccess?: (model: THREE.Group) => void,
  ) => {
    setIsLoading(true);
    setSelectedModel(modelId);
    setError(null);

    try {
      // Check if model exists in cache
      const exists = await isModelCached(modelId);
      if (!exists) {
        throw new Error(`Model "${modelId}" not found in cache`);
      }

      // Load the model
      await LoadCharacter(
        modelId,
        scene,
        (model) => {
          console.log(`Successfully loaded model: ${modelId}`);
          if (onSuccess) onSuccess(model);
        },
        (err) => {
          console.error(`Error loading model ${modelId}:`, err);
          setError(`Error loading model: ${err.message || 'Unknown error'}`);
        },
      );
    } catch (err: any) {
      console.error(`Failed to load model ${modelId}:`, err);
      setError(err.message || 'Failed to load model');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to preload models from API response
  const preloadModelsFromApiResponse = async (apiResponse: ApiResponse) => {
    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      await preloadModelsFromApi(apiResponse, (loaded, total, currentSize, totalSize) => {
        const percent = Math.min(Math.round((loaded / total) * 100), 100);
        setProgress(percent);
      });

      // Refresh the list of cached models
      const models = await listCachedModels();
      setCachedModels(models);
    } catch (err: any) {
      console.error('Error preloading models:', err);
      setError(err.message || 'Error preloading models');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    cachedModels,
    isLoading,
    selectedModel,
    error,
    progress,
    loadModelFromCache,
    preloadModelsFromApiResponse,
    filterModelsByType,
  };
}

/**
 * Get animation name from model ID
 */
export function getAnimationName(modelId: string): string {
  // Extract base name without _Anim suffix
  const baseName = modelId.replace('_Anim', '');

  // Map to animation name
  const animationNameMap: { [key: string]: string } = {
    Bloom: 'Bloom_Anim',
    Blossom: 'Blossom_Anim',
    Bomb: 'Bomb_Anim',
    Dragon_Fire: 'Dragon_Fire_Anim',
    Bud: 'Bud_Anim',
    Dragon_Inferno: 'Dragon_Inferno_Anim',
    Dragon_Spark: 'Dragon_Spark_Anim',
    Hermit_King: 'Hermit_King_Anim',
    Poison_Bomb: 'Poison_Bomb_Anim',
    Practice_Dummy: 'Practice_Dummy_Anim',
    Shell: 'Shell_Anim',
    Snake: 'Snake_Anim',
    Snake_Naga: 'Snake_Naga_Anim',
    Snakelet: 'Snakelet_Anim',
    Snow_Bomb: 'Snow_Bomb_Anim',
    Spike: 'Spike_Anim',
    Sun_Blossom: 'Sun_Blossom_Anim',
    Sunflora_Pixie: 'Sunflora_Pixie_Anim',
    Sunflower_Fairy: 'Sunflower_Fairy_Anim',
    Target_Dummy: 'Target_Dummy_Anim',

    // And if you want to include these too:
    Werewolf: 'Werewolf_Anim',
    Wolf: 'Wolf_Anim',
    Wolf_Pup: 'Wolf_Pup_Anim',
    Training_Dummy: 'Training_Dummy_Anim',
  };

  return animationNameMap[baseName] || 'Idle';
}

export default {
  LoadFBXCharacter,
  LoadCharacter,
  fetchAndCacheModel,
  preloadModelsFromApi,
  filterModelsByType,
  listCachedModels,
  isModelCached,
  useModelLoader,
  getAnimationName,
};
