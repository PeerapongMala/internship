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
export function LoadFBXCharacter(
  modelURL: string,
  scene: THREE.Scene,
  onLoad: (object: THREE.Group) => void,
  onError: (error: ErrorEvent) => void,
  faceMeshName: string = 'Face',
) {
  const loader = new FBXLoader();
  console.log(`LoadFBXCharacter: Loading model from URL: ${modelURL}`);

  loader.load(
    modelURL,
    (object) => {
      // Optionally, add shadow properties and check materials for every Mesh.
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

      // Finalize by calling onLoad; model loading is considered complete.
      if (onLoad) onLoad(object);
    },
    // onProgress callback for monitoring load progress.
    (xhr: ProgressEvent<EventTarget>) => {
      if (xhr.lengthComputable) {
        const percentComplete = (xhr.loaded / xhr.total) * 100;
        //console.log(`FBXLoader: ${percentComplete.toFixed(2)}% loaded.`);
      }
    },
    (error) => {
      console.error('FBXLoader Error loading model:', modelURL, error);

      // Fallback: Create a placeholder object so rendering can continue.
      const fallback = new THREE.Group();
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
      const boxMesh = new THREE.Mesh(geometry, material);
      fallback.add(boxMesh);
      fallback.name = 'FallbackModel';
      fallback.position.set(0, 0, 0); // Adjust as needed.

      // Add fallback to scene and call callbacks to continue flow.
      scene.add(fallback);
      if (onLoad) onLoad(fallback);
      if (onError) onError(error as ErrorEvent);
    },
  );
}

export const animationURLs: {
  [key: string]: { url: string; name: string };
} = {
  Bloom: {
    url: '/assets/animation/monster-animations/Bloom.fbx',
    name: 'Idle',
  },
  Blossom: {
    url: '/assets/animation/monster-animations/Blossom.fbx',
    name: 'Idle',
  },
  'Wolf Pup': {
    url: '/assets/animation/monster-animations/Wolf Pup.fbx',
    name: 'Idle',
  },
  Dragon: {
    url: '/assets/animation/monster-animations/Dragon.fbx',
    name: 'Idle',
  },
  'Practice Dummy': {
    url: '/assets/animation/monster-animations/Practice Dummy.fbx',
    name: 'Idle',
  },
};

/**
 * Load a character based on a selection key. This function maps character keys to URLs,
 * then delegates to LoadFBXCharacter.
 *
 * @param selectedCharacter - The key representing the character.
 * @param scene - Three.js scene.
 * @param callback - Callback to use the loaded character.
 * @param onError - Error callback.
 */
export function LoadCharacter(
  selectedCharacter: string,
  scene: THREE.Scene,
  callback: (character: THREE.Group) => void,
  onError?: (error: ErrorEvent) => void,
) {
  const characterURLs: { [key: string]: string } = {
    Bloom: '/assets/model/monter-models/Bloom.fbx',
    Blossom: '/assets/model/monter-models/Blossom.fbx',
    'Wolf Pup': '/assets/model/monter-models/Wolf Pup.fbx',
    Dragon: '/assets/model/monter-models/Dragon.fbx',
    'Practice Dummy': '/assets/model/monter-models/Practice Dummy.fbx',
  };

  // Fall back to character 'A' if the key doesn’t match.
  const characterURL = characterURLs[selectedCharacter];

  LoadFBXCharacter(
    characterURL,
    scene,
    (character) => {
      // Position adjustments if needed.
      character.position.set(0, 0, -3);
      scene.add(character);
      callback(character);
    },
    (error) => {
      console.error('Error loading character:', error);
      if (onError) onError(error as ErrorEvent);
    },
  );
}
