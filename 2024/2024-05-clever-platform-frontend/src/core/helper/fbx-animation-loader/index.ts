import { FBXLoader } from 'three/examples/jsm/Addons.js';

export function loadFBXAnimation(
  url: string,
  clipName: string,
  onLoad: any,
  onError: any,
) {
  const loader = new FBXLoader();
  loader.load(
    url,
    (loadedItem) => {
      console.log(loadedItem);
      let animationClip = loadedItem.animations.find((clip) => clip.name === clipName);
      if (!animationClip) {
        console.log(
          `No animation found by finding with name ${clipName}. Finding by index`,
        );
        animationClip = loadedItem.animations[4];
      }
      if (animationClip) {
        console.log(`Loaded animation   clip: ${animationClip.name}`);
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
