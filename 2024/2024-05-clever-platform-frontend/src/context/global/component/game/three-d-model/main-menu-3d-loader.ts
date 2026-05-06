import { loadFBXAnimation } from '@core/helper/fbx-animation-loader';
import { FBXLoaderHelper } from '@core/helper/fbx-model-loader';
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { StoreModelFileMethods } from '@global/store/global/avatar-models/index';
import { cameraNear } from 'three/webgpu';

export class GCAThreeModel {
  model: THREE.Group | THREE.Mesh | undefined;
  loader: THREE.Loader = new FBXLoader();
  mixer: THREE.AnimationMixer | undefined;
  shouldRotating: boolean = false;

  Start = async ({
    modelSrc,
    scene,
    renderer,
    shouldRotating = true,
  }: {
    modelSrc?: string;
    scene?: THREE.Object3D;
    shouldRotating?: boolean;
    renderer: THREE.WebGLRenderer;
  }): Promise<void> => {
    if (modelSrc) {
      console.log('Model name: ' + modelSrc);

      const modelBlob = await StoreModelFileMethods.getItem(modelSrc);

      if (modelBlob) {
        // Convert Blob to URL string that can be used by FBXLoaderHelper
        const modelUrl = URL.createObjectURL(modelBlob);

        // Demo Usage
        const newCharacter = new FBXLoaderHelper(modelUrl, (loadedModel: any) => {
          this.model = loadedModel;
          loadedModel.scale.set(0.035, 0.035, 0.035);
          loadedModel.position.set(0, -2, 2);

          if (scene) {
            scene.add(loadedModel);
          }

          // Load Weapons.
          // Animations path list
          /*
              'assets/model/demo/Sword_dragon.fbx'
              'assets/model/demo/Sword_M05.fbx'
              'assets/model/demo/Sword_F05.fbx'
            */
          new FBXLoaderHelper(
            'assets/model/demo/Sword_dragon.fbx',
            (loadedSword: any) => {
              newCharacter.getBone('QuickRigCharacter2_LeftHand').add(loadedSword);
            },
          );

          loadFBXAnimation(
            '/assets/animation/demo/Hip Hop Dancing.fbx',
            'mixamo.com',
            (animationClip: THREE.AnimationClip) => {
              const mixer = new THREE.AnimationMixer(loadedModel);
              const action = mixer.clipAction(animationClip);
              console.log(action);
              action.play();
              this.mixer = mixer;
            },
            (error: any) => {
              console.error('Error loading animation:', error);
            },
          );

          // Clean up the URL when done (optional, but good practice)
          URL.revokeObjectURL(modelUrl);
        });
      } else {
        console.error('Failed to load model: ' + modelSrc);
      }
    } else {
      // Fallback code when no modelSrc is provided
    }
    this.shouldRotating = shouldRotating;
  };

  Update = ({ deltaTime }: { deltaTime: number }) => {
    if (this.model && this.shouldRotating) {
      //this.model.rotation.y += 0.001 * deltaTime;
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

  // Dispose method to free GPU memory
  dispose = () => {
    console.log('Disposing GCAThreeModel resources (main-menu-3d-loader)...');

    // Stop and dispose mixer
    if (this.mixer) {
      this.mixer.stopAllAction();
      this.mixer.uncacheRoot(this.mixer.getRoot());
      this.mixer = undefined;
    }

    // Dispose model resources
    if (this.model) {
      this.model.traverse((child: any) => {
        if (child.geometry) {
          child.geometry.dispose();
        }
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat: any) => {
              // Dispose textures
              Object.keys(mat).forEach((key) => {
                if (mat[key] && mat[key].isTexture) mat[key].dispose();
              });
              mat.dispose();
            });
          } else {
            Object.keys(child.material).forEach((key) => {
              if (child.material[key] && child.material[key].isTexture) {
                child.material[key].dispose();
              }
            });
            child.material.dispose();
          }
        }
      });
      this.model = undefined;
    }

    // Clear THREE.Cache to release cached textures/models
    THREE.Cache.clear();

    console.log('GCAThreeModel resources disposed (main-menu-3d-loader)');
  };
}
