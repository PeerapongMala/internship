import { FBXLoader } from 'three/examples/jsm/Addons.js';

export function LoadFBXAnimation(
  url: string,
  clipName: string,
  onLoad: any,
  onError: any,
) {
  const loader = new FBXLoader();
  loader.load(
    url,
    (loadedItem) => {
      console.log('Animation info: ', loadedItem);
      const animationClip = loadedItem.animations.find((clip) => clip.name === clipName);
      const animationName = loadedItem.animations[4]?.name;
      console.log('Animation name: ', animationName);
      if (animationClip) {
        console.log(`Loaded animation clip: ${clipName}`);
        onLoad(animationClip);
      } else {
        console.warn(`Animation clip with name "${clipName}" not found.`);
        onError(new Error(`Animation clip with name "${clipName}" not found.`));
      }
    },
    undefined,
    (error) => {
      console.error('Error loading animation:', error);
      onError(error);
    },
  );
}
