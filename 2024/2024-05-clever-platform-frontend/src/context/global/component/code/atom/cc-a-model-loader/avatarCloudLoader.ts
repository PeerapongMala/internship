import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

import API from '@domain/g03/g03-d05/local/api';
import { StoreModelFileMethods } from '@global/store/global/avatar-models/index';

export function LoadFBXCharacter(
  modelURL: string,
  scene: THREE.Scene,
  onLoad: (object: THREE.Group) => void,
  onError: (error: ErrorEvent) => void,
  faceMeshName: string = 'Face',
  onFinally?: () => void,
) {
  const loader = new FBXLoader();
  console.log(`LoadFBXCharacter: Loading model from URL: ${modelURL}`);

  const handleLoad = (object: THREE.Group) => {
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

    // Adjust properties for the face mesh if it exists.
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
        `LoadFBXCharacter: Face mesh with name '${faceMeshName}' not found in model: ${modelURL}`,
      );
    }

    if (onLoad) onLoad(object);
    if (onFinally) onFinally(); // <-- Call finally
  };

  const handleError = (error: ErrorEvent) => {
    console.error('FBXLoader Error loading model:', modelURL, error);

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
    if (onFinally) onFinally(); // <-- Call finally
  };

  const onProgress = (xhr: ProgressEvent<EventTarget>) => {
    if (xhr.lengthComputable) {
    }
  };

  loader.load(modelURL, handleLoad, onProgress);
}

export async function LoadCharacter(
  selectedCharacter: string,
  scene: THREE.Scene,
  callback: (character: THREE.Group) => void,
  onError?: (error: ErrorEvent | Error) => void,
) {
  // Initialize the characterURLs object
  const characterURLs: { [key: string]: string } = {};

  try {
    // Fetch the latest model URLs from API
    const response = await API.AvatarModelAssets.ModelAssets.Get();

    if (response.status_code === 200 && Array.isArray(response.data)) {
      // Map the API response to our characterURLs object
      response.data.forEach((item) => {
        if (item && item.model_id && item.url) {
          characterURLs[item.model_id] = item.url;
        }
      });

      console.log(`Loaded ${Object.keys(characterURLs).length} model URLs from API`);
    } else {
      console.warn('Failed to load model URLs from API, response:', response);
    }
  } catch (error) {
    console.error('Error fetching model URLs from API:', error);
  }

  const modelKey = selectedCharacter;
  let sourceURL: string | null = null; // URL for FBXLoader (can be blob: or http:/https:)
  let objectUrlToRevoke: string | null = null; // Track blob URL for revocation

  // Get the designated network URL for this key (used *only* on cache miss)
  const networkFetchUrl = characterURLs[modelKey];

  // Handle case where the selected character key is not in our map
  if (!networkFetchUrl) {
    const error = new Error(
      `LoadCharacter Error: Character key "${modelKey}" not found in characterURLs map.`,
    );
    console.error(error.message);
    if (onError) onError(error);
    // Attempt to load fallback via LoadFBXCharacter's internal error handling
    LoadFBXCharacter(
      'invalid-url',
      scene,
      callback,
      onError as (error: ErrorEvent) => void,
    );
    return; // Stop processing for this character
  }

  // --- Standard Cache/Fetch Logic ---
  try {
    // 1. Check cache using the directly imported methods object
    console.log(`LoadCharacter: Checking cache for key "${modelKey}"...`);
    // VVVVVVVVVVVVVVVVVV USING NAMED IMPORT VVVVVVVVVVVVVVVVVV
    let modelBlob = await StoreModelFileMethods.getItem(modelKey);
    // ^^^^^^^^^^^^^^^^^^^^ USING NAMED IMPORT ^^^^^^^^^^^^^^^^^^^^

    if (modelBlob) {
      // Cache Hit!
      console.log(
        `LoadCharacter: Cache HIT for key "${modelKey}". Size: ${modelBlob.size}. Creating Object URL.`,
      );
      sourceURL = URL.createObjectURL(modelBlob);
      objectUrlToRevoke = sourceURL; // Mark this blob URL for cleanup
    } else {
      // Cache Miss!
      console.log(
        `LoadCharacter: Cache MISS for key "${modelKey}". Fetching from designated URL: ${networkFetchUrl}`,
      );
      // Use StoreModelFileMethods.addItem - it fetches the networkFetchUrl AND stores the result in IndexedDB under modelKey
      // VVVVVVVVVVVVVVVVVV USING NAMED IMPORT VVVVVVVVVVVVVVVVVV
      await StoreModelFileMethods.addItem(modelKey, networkFetchUrl); // Fetch and store
      // ^^^^^^^^^^^^^^^^^^^^ USING NAMED IMPORT ^^^^^^^^^^^^^^^^^^^^

      console.log(`LoadCharacter: Stored "${modelKey}" in cache. Retrieving Blob...`);

      // Retrieve the blob we *just stored* to ensure we use the cached version now
      // VVVVVVVVVVVVVVVVVV USING NAMED IMPORT VVVVVVVVVVVVVVVVVV
      modelBlob = await StoreModelFileMethods.getItem(modelKey); // Retrieve just stored blob
      // ^^^^^^^^^^^^^^^^^^^^ USING NAMED IMPORT ^^^^^^^^^^^^^^^^^^^^

      if (modelBlob) {
        sourceURL = URL.createObjectURL(modelBlob);
        objectUrlToRevoke = sourceURL; // Mark this blob URL for cleanup
        console.log(`LoadCharacter: Created Object URL from newly cached Blob.`);
      } else {
        // This case should be rare if addItem succeeded, but handle defensively
        console.warn(
          `LoadCharacter: Could not retrieve Blob immediately after adding to cache. Falling back to network URL: ${networkFetchUrl}`,
        );
        sourceURL = networkFetchUrl; // Fallback to the network URL
      }
    }
  } catch (error: any) {
    // Handle errors during IndexedDB access (getItem/addItem) or fetch within addItem
    console.error(
      `LoadCharacter: Error during cache check/fetch/store for "${modelKey}":`,
      error,
    );
    // Fallback to trying the original network URL directly if cache operations fail
    sourceURL = networkFetchUrl; // Use the designated network URL as fallback
    objectUrlToRevoke = null; // Ensure we don't try to revoke the network URL
    // Optionally call onError early, or let LoadFBXCharacter handle the subsequent load error
    // if (onError) onError(error instanceof Error ? error : new Error(String(error)));
  }
  // --- End Standard Cache/Fetch Logic ---

  // --- Final Loading Step ---
  // Ensure we determined a source URL
  if (!sourceURL) {
    // This path indicates a failure occurred before a URL could be set
    const finalError = new Error(
      `LoadCharacter: Could not determine a valid source URL for key "${modelKey}". Check previous errors.`,
    );
    console.error(finalError.message);
    if (onError) onError(finalError);
    return; // Stop processing for this character
  }

  // Cleanup function to revoke blob URL if one was created
  const handleFinally = () => {
    if (objectUrlToRevoke) {
      console.log(`LoadCharacter: Revoking Object URL for key "${modelKey}"`);
      URL.revokeObjectURL(objectUrlToRevoke);
    }
  };

  // Wrapper for the original success callback
  const handleLoadSuccess = (character: THREE.Group) => {
    // Perform any positioning or setup specific to LoadCharacter
    character.position.set(0, 0, 0); // Example position reset
    // Add the character to the scene unless it's the fallback object
    if (character.name !== 'FallbackModel') {
      scene.add(character);
    }
    // Call the original callback passed to LoadCharacter
    callback(character);
  };

  // Wrapper for the original error callback
  const handleErrorLoad = (error: ErrorEvent | Error) => {
    // Call the original error handler passed to LoadCharacter
    if (onError) onError(error);
  };

  // Call the FBX loader with the determined URL (blob or network) and wrapped callbacks
  LoadFBXCharacter(
    sourceURL,
    scene,
    handleLoadSuccess, // Wrapped success handler
    handleErrorLoad as (error: ErrorEvent) => void, // Wrapped error handler (cast needed)
    'Face', // Default face mesh name
    handleFinally, // Pass the cleanup handler
  );
}
