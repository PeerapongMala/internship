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
    A: '/assets/model/M05.fbx',
    B: '/assets/model/M02.fbx',
    C: '/assets/model/ExportedF05.fbx',
    D: '/assets/model/M04.fbx',
    E: '/character/set2/character1/level1.fbx',
    WolfPup: '/assets/model/WolfPup.fbx',
    // ... (other mappings)
    set1_character1_level1:
      'https://cp-prod.obs.ap-southeast-2.myhuaweicloud.com:443/character/set1/character1/level1.fbx?AWSAccessKeyId=4KLUJRJMVTOMM8YDKMF2&Expires=1744288607&Signature=wpuvmmmjU0GT3Oxuv1Wte5dIPfo%3D',
    set1_character1_level2:
      'https://cp-prod.obs.ap-southeast-2.myhuaweicloud.com:443/character/set1/character1/level2.fbx?AWSAccessKeyId=4KLUJRJMVTOMM8YDKMF2&Expires=1744288607&Signature=rt3v20SF6RAPJVwfTunSuTbEKiM%3D',
    set1_character1_level3:
      'https://cp-prod.obs.ap-southeast-2.myhuaweicloud.com:443/character/set1/character1/level3.fbx?AWSAccessKeyId=4KLUJRJMVTOMM8YDKMF2&Expires=1744288607&Signature=OJ0nwtPsrNXdIWL4c%2BpaYtSddmY%3D',
    set1_character1_level4:
      'https://cp-prod.obs.ap-southeast-2.myhuaweicloud.com:443/character/set1/character1/level4.fbx?AWSAccessKeyId=4KLUJRJMVTOMM8YDKMF2&Expires=1744288607&Signature=IHpYSqzFoScOGzi3s70o1Nydjlc%3D',
    //set1_character1_level5: '/character/set1/character1/level5.fbx',
    set1_character1_level5:
      'https://cp-prod.obs.ap-southeast-2.myhuaweicloud.com:443/character/set1/character1/level5.fbx?AWSAccessKeyId=4KLUJRJMVTOMM8YDKMF2&Expires=1744288607&Signature=B8%2BEq%2Bg4nr4z%2BsdW0WJ%2BYTx6jNU%3D', //https://drive.google.com/uc?id=1aXR9XUj5TF-LacKHEZDFB6sF6o_-gY7i&export=download
    set1_character2_level1: '/character/set1/character2/level1.fbx',
    set1_character2_level2: '/character/set1/character2/level2.fbx',
    set1_character2_level3: '/character/set1/character2/level3.fbx',
    set1_character2_level4: '/character/set1/character2/level4.fbx',
    set1_character2_level5: '/character/set1/character2/level5.fbx',
    set1_character3_level1: '/character/set1/character3/level1.fbx',
    set1_character3_level2: '/character/set1/character3/level2.fbx',
    set1_character3_level3: '/character/set1/character3/level3.fbx',
    set1_character3_level4: '/character/set1/character3/level4.fbx',
    set1_character3_level5: '/character/set1/character3/level5.fbx',
    set1_character4_level1: '/character/set1/Character4/level1.fbx', // Corrected path to Character1
    set1_character4_level2: '/character/set1/Character4/level2.fbx', // Corrected path to Character1
    set1_character4_level3: '/character/set1/Character4/level3.fbx', // Corrected path to Character1
    set1_character4_level4: '/character/set1/Character4/level4.fbx', // Corrected path to Character1
    set1_character4_level5: '/character/set1/Character4/level5.fbx', // Corrected path to Character1

    set2_character1_level1: '/character/set2/character1/level1.fbx',
    set2_character1_level2: '/character/set2/character1/level2.fbx',
    set2_character1_level3: '/character/set2/character1/level3.fbx',
    set2_character1_level4: '/character/set2/character1/level4.fbx',
    set2_character1_level5: '/character/set2/character1/level5.fbx',
    set2_character2_level1: '/character/set2/character2/level1.fbx',
    set2_character2_level2: '/character/set2/character2/level2.fbx',
    set2_character2_level3: '/character/set2/character2/level3.fbx',
    set2_character2_level4: '/character/set2/character2/level4.fbx',
    set2_character2_level5: '/character/set2/character2/level5.fbx',
    set2_character3_level1: '/character/set2/character3/level1.fbx',
    set2_character3_level2: '/character/set2/character3/level2.fbx',
    set2_character3_level3: '/character/set2/character3/level3.fbx',
    set2_character3_level4: '/character/set2/character3/level4.fbx',
    set2_character3_level5: '/character/set2/character3/level5.fbx',
    set4_character1_level1: '/character/set4/Character1/level1.fbx',
    set4_character1_level2: '/character/set4/Character1/level2.fbx',
    set4_character1_level3: '/character/set4/Character1/level3.fbx',
    set4_character1_level4: '/character/set4/Character1/level4.fbx',
    set4_character1_level5: '/character/set4/Character1/level5.fbx',
    set4_character2_level1: '/character/set4/Character2/level1.fbx',
    set4_character2_level2: '/character/set4/Character2/level2.fbx',
    set4_character2_level3: '/character/set4/Character2/level3.fbx',
    set4_character2_level4: '/character/set4/Character2/level4.fbx',
    set4_character2_level5: '/character/set4/Character2/level5.fbx',
    set4_character3_level1: '/character/set4/Character3/level1.fbx',
    set4_character3_level2: '/character/set4/Character3/level2.fbx',
    set4_character3_level3: '/character/set4/Character3/level3.fbx',
    set4_character3_level4: '/character/set4/Character3/level4.fbx',
    set4_character3_level5: '/character/set4/Character3/level5.fbx',
    set4_character4_level1: '/character/set4/Character4/level1.fbx',
    set4_character4_level2: '/character/set4/Character4/level2.fbx',
    set4_character4_level3: '/character/set4/Character4/level3.fbx',
    set4_character4_level4: '/character/set4/Character4/level4.fbx',
    set4_character4_level5: '/character/set4/Character4/level5.fbx',
  };

  // Fall back to character 'A' if the key doesn’t match.
  const characterURL = characterURLs[selectedCharacter];

  LoadFBXCharacter(
    characterURL,
    scene,
    (character) => {
      // Position adjustments if needed.
      character.position.set(0, 0, 0);
      scene.add(character);
      callback(character);
    },
    (error) => {
      console.error('Error loading character:', error);
      if (onError) onError(error as ErrorEvent);
    },
  );
}
