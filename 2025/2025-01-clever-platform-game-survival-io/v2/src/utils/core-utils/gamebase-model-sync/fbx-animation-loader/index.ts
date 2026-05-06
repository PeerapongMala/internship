import { FBXLoader } from 'three/examples/jsm/Addons.js';
import * as THREE from 'three';

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
      console.log('🎬 Loaded animation source:', loadedItem);

      // Debug: Log skeleton information from animation
      if (loadedItem.children && loadedItem.children.length > 0) {
        loadedItem.traverse((child: any) => {
          if (child.isSkinnedMesh && child.skeleton) {
            console.log(
              '🦴 Animation skeleton bones:',
              child.skeleton.bones.map((b: THREE.Bone) => b.name),
            );
          }
        });
      }

      let animationClip = loadedItem.animations.find((clip) => clip.name === clipName);
      if (!animationClip) {
        console.log(
          `No animation found by finding with name ${clipName}. Finding by index`,
        );
        animationClip = loadedItem.animations[4];
      }
      if (animationClip) {
        console.log(`✅ Loaded animation clip: ${animationClip.name}`);
        console.log(
          `📊 Animation tracks:`,
          animationClip.tracks.map((t) => t.name),
        );
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
