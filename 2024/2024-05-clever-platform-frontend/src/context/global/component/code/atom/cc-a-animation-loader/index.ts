import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/Addons.js';

export function LoadFBXAnimation(url: string, onLoad: any, onError: any) {
  const loader = new FBXLoader();
  console.log('Active animation url: ', url);
  loader.load(
    url,
    (gltf) => {
      console.log('animation: ');
      const animationClip = THREE.AnimationClip.findByName(gltf.animations, 'mixamo.com');
      console.log('animation loader: ', animationClip);
      onLoad(animationClip);
    },
    undefined,
    (error) => {
      console.error('Error loading animation:', error);
    },
  );
}
