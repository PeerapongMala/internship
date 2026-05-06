import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

/**
 * Load an FBX character model, and apply tweaks to help it render correctly.
 *
 * @param modelURL - URL of the FBX file.
 * @param scene - Three.js scene to add the loaded model.
 * @param onLoad - Callback when loading succeeds.
 * @param onError - Callback when loading fails.
 * @param faceMeshName - Name of the face mesh to adjust (defaults to "Face").
 */
function loadFBXFile(
  modelURL: string,
  onLoad?: (object: THREE.Group) => void,
  onError?: (error: ErrorEvent) => void,
) {
  const loader = new FBXLoader();
  console.log(`LoadFBXCharacter: Loading model from URL: ${modelURL}`);

  loader.load(
    modelURL,
    (object) => {
      if (onLoad) onLoad(object);
    },
    // onProgress callback for monitoring load progress.
    (xhr: ProgressEvent<EventTarget>) => {
      if (xhr.lengthComputable) {
        const percentComplete = (xhr.loaded / xhr.total) * 100;
        console.log(`FBXLoader: ${percentComplete.toFixed(2)}% loaded.`);
      }
    },
    (error) => {
      console.error('FBXLoader Error loading model:', modelURL, error);
      //if (onLoad) onLoad(fallback);
      if (onError) onError(error as ErrorEvent);
    },
  );
}

/**
 * Load a character based on a selection key. This function maps character keys to URLs,
 * then delegates to LoadFBXCharacter.
 *
 * @param selectedCharacter - The key representing the character.
 * @param scene - Three.js scene.
 * @param callback - Callback to use the loaded character.
 * @param onError - Error callback.
 */
export function loadFBXModel(
  characterURL: string,
  scene: THREE.Scene,
  callback: (character: THREE.Group) => void,
  onError?: (error: ErrorEvent) => void,
) {
  loadFBXFile(
    characterURL,
    (character: THREE.Group) => {
      scene.add(character);
      callback(character);
    },
    (error) => {
      console.error('Error loading character:', error);
      if (onError) onError(error as ErrorEvent);
    },
  );
}
