import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

// export let PlayerCharacter: THREE.Group;

export interface LoadedCharacter extends THREE.Group {
  scale: THREE.Vector3;
  position: THREE.Vector3;
  rotation: THREE.Euler;
}

export function setPlayerCharacter(playerCharacter: THREE.Group): void {
  // PlayerCharacter = playerCharacter;
  window.PlayerCharacter = playerCharacter;
}

function loadFBXCharacter(
  url: string,
  scene: THREE.Scene,
  onLoad?: (object: LoadedCharacter, scene: THREE.Scene) => void,
  onError?: (error: ErrorEvent) => void,
): void {
  const loader = new FBXLoader();
  loader.load(
    url,
    (object) => {
      // scene.add(object);
      if (onLoad) onLoad(object as LoadedCharacter, scene);
    },
    undefined,
    (error) => {
      console.error(`Error loading model: ${url}`, error);
      if (onError) onError(new ErrorEvent('error', { error }));
    },
  );
}

export function loadCharacter(
  selectedCharacter: string,
  scene: THREE.Scene,
  callback: (character: LoadedCharacter) => void,
): void {
  const characterURL = selectedCharacter;

  loadFBXCharacter(characterURL, scene, (character, scene) => {
    character.scale.set(0.025, 0.025, 0.025); // Adjust the scale of the character if needed
    character.position.set(0, 0, 0); // Set the initial position of the character
    character.rotation.set(-3.14 / 2, 0, 0);

    window.PlayerCharacter = character; // Set PlayerCharacter in the window
    // PlayerCharacter = character; // Set PlayerCharacter in the window
    scene.add(character);
    callback(character);
  });
}
