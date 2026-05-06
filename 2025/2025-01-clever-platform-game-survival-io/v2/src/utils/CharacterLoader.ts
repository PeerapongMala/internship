import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

export function LoadFBXCharacter(url: string, onLoad: any, onError: any) {
  const loader = new FBXLoader();
  loader.load(
    url,
    (object) => {
      if (onLoad) onLoad(object);
    },
    undefined,
    (error) => {
      console.error(`Error loading model: ${url}`, error);
      if (onError) onError(error);
    },
  );
}

export function LoadCharacter(characterPath: string, callback: any) {
  LoadFBXCharacter(
    characterPath,
    (character: any) => {
      //character.scale.set(0.05, 0.05, 0.05); // Adjust the scale of the character if needed
      character.position.set(0, 0, 0); // Set the initial position of the character
      (window as any).PlayerCharacter = character; // Set PlayerCharacter in the window
      // PlayerCharacter = character;
      callback(character);
    },
    () => {},
  );
}
