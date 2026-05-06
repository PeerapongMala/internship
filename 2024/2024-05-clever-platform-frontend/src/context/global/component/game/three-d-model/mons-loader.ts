import { LoadFBXAnimation } from '@component/code/atom/cc-a-animation-loader/Mons-animation';
import {
  animationURLs,
  LoadCharacter,
} from '@component/code/atom/cc-a-model-loader/mons-model-load';
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

export class GCAThreeModel {
  model: THREE.Group | THREE.Mesh | undefined;
  loader: THREE.Loader = new FBXLoader();
  mixer: THREE.AnimationMixer | undefined;
  shouldRotating: boolean = false;

  Start = ({
    modelSrc,
    scene,
    renderer,
    shouldRotating = true,
    onLoaded,
  }: {
    modelSrc?: string;
    scene?: THREE.Object3D;
    shouldRotating?: boolean;
    renderer: THREE.WebGLRenderer;
    onLoaded?: () => void;
  }): void => {
    if (modelSrc) {
      console.log('Model name: ' + modelSrc);
      if (scene instanceof THREE.Scene) {
        LoadCharacter(modelSrc, scene, (character: THREE.Group) => {
          let mixer: THREE.AnimationMixer | null = null;
          scene?.add(character);
          if (modelSrc == 'Peacock') {
            character.scale.set(0.05, 0.05, 0.05); // Example: smaller size for Peacock
          } else if (modelSrc == 'Malayan_A') {
            character.scale.set(0.17, 0.17, 0.17);
          } else {
            character.scale.set(0.07, 0.07, 0.07);
          }

          character.translateY(-4);
          character.translateX(1);
          character.rotateY(-0.9);
          this.model = character;

          console.log('Pet model loaded:');
          console.log('Name:', character.name);
          console.log('Children:', character.children.length);
          console.log('Model Pet Object:', character);

          character.traverse((child: any) => {
            if (child instanceof THREE.Mesh) {
              if (child.material.map) {
                child.material.map.minFilter = THREE.LinearFilter;
                child.material.map.generateMipmaps = true;
                child.material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
              }
              if (child.material.materials) {
                child.material.materials.forEach((material: any) => {
                  if (material.map) {
                    material.map.minFilter = THREE.LinearFilter;
                    material.map.generateMipmaps = true;
                    material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
                  }
                });
              }
            }
          });

          LoadFBXAnimation(
            animationURLs[modelSrc].url, // Use the animation URL that matches the model source
            animationURLs[modelSrc].name,
            (animationClip: THREE.AnimationClip) => {
              character.animations.push(animationClip);
              mixer = new THREE.AnimationMixer(character);

              console.log('Pet animation url: ', animationURLs[modelSrc].name);
              if (animationClip) {
                const action = mixer.clipAction(animationClip);
                console.log('Attempt to play animation for model:', modelSrc);
                action.play();
              } else {
                console.error('Animation clip not found for model:', modelSrc);
              }

              this.mixer = mixer;

              if (onLoaded) onLoaded();
            },
            (error: any) => {
              console.error('Error loading animation for model:', modelSrc, error);
            },
          );
        });
      } else {
        console.error(
          'Error: scene must be a THREE.Scene when modelSrc is provided for LoadCharacter.',
        );
        return;
      }
    } else {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      this.model = new THREE.Mesh(geometry, material);
      scene?.add(this.model);
      console.log('Default model added to scene');
    }
    this.shouldRotating = shouldRotating;
  };

  Update = ({ deltaTime }: { deltaTime: number }) => {
    if (this.model && this.shouldRotating) {
      //this.model.rotation.y += 0.0005 * deltaTime;
    }
    if (this.mixer) {
      this.mixer.update(deltaTime / 1000);
    }
  };

  ComponentAdd = (_parentObj: any) => {
    const parentObj = _parentObj as THREE.Object3D;
    if (!this.model) {
      return;
    }
    parentObj.add(this.model);
    console.log('Model added to parent object');
  };

  ComponentRemove = (_parentObj: any) => {
    const parentObj = _parentObj as THREE.Object3D;
    if (!this.model) {
      return;
    }
    parentObj.remove(this.model);
    console.log('Model removed from parent object');
  };
}
