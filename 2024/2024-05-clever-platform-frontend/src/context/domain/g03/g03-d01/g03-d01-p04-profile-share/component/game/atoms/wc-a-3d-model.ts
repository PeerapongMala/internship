import { LoadFBXAnimation } from '@component/code/atom/cc-a-animation-loader';
import { LoadCharacter } from '@component/code/atom/cc-a-model-loader';
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

export class GCAThreeModel {
  model: THREE.Group | THREE.Mesh | undefined;
  loader: THREE.Loader = new FBXLoader();
  mixer: THREE.AnimationMixer | undefined;

  Start = ({ modelSrc, scene }: { modelSrc?: string; scene?: THREE.Object3D }): void => {
    const actualScene = scene instanceof THREE.Scene ? scene : new THREE.Scene();

    if (modelSrc) {
      LoadCharacter('A', actualScene, (character: any) => {
        let mixer: any = null;
        scene?.add(character);
        character.scale.set(0.05, 0.05, 0.05);
        character.translateY(-2.5);
        this.model = character as THREE.Group;

        LoadFBXAnimation(
          'public/assets/animation/Rumba Dancing.fbx',
          (animationClip: any) => {
            character.animations.push(animationClip); // Add the new animation clip to the character's animations array
            mixer = new THREE.AnimationMixer(character);
            const clips = character.animations;

            const clip = THREE.AnimationClip.findByName(clips, 'mixamo.com');
            const action = mixer.clipAction(clip);
            action.play();

            // Play all animations
            clips.forEach(function (clip: any) {
              //clip.play();
              mixer.clipAction(clip).play();
            });
            this.mixer = mixer;
          },
          (error: any) => {},
        );
      });
    } else {
      // make a cube model for debugging
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      this.model = new THREE.Mesh(geometry, material);
      scene?.add(this.model);
    }
  };

  Update = ({ deltaTime }: { deltaTime: number }) => {
    if (this.model) {
      this.model.rotation.y += (1 / 180) * Math.PI * deltaTime * 5e-2;
    }
    if (this.mixer) {
      this.mixer.update(0.01);
    }
  };

  ComponentAdd = (_parentObj: any) => {
    const parentObj = _parentObj as THREE.Object3D;
    if (!this.model) {
      return;
    }
    parentObj.add(this.model);
  };

  ComponentRemove = (_parentObj: any) => {
    const parentObj = _parentObj as THREE.Object3D;
    if (!this.model) {
      return;
    }
    parentObj.remove(this.model);
  };
}
