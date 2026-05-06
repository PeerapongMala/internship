import { loadFBXAnimation } from '@core/helper/fbx-animation-loader';
import { FBXLoaderHelper } from '@core/helper/fbx-model-loader';
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

export class GCAThreeModel {
  model: THREE.Group | THREE.Mesh | undefined;
  loader: THREE.Loader = new FBXLoader();
  mixer: THREE.AnimationMixer | undefined;
  shouldRotating: boolean = false;
  eyeMaterial: THREE.Material | undefined;
  faceMaterial: THREE.Material | undefined;

  Start = ({
    modelSrc,
    scene,
    renderer,
    shouldRotating = true,
  }: {
    modelSrc?: string;
    scene?: THREE.Object3D;
    shouldRotating?: boolean;
    renderer: THREE.WebGLRenderer;
  }): void => {
    if (modelSrc) {
      console.log('Model name: ' + modelSrc);

      // Demo Usage
      const newCharacter = new FBXLoaderHelper(
        '/assets/model/Set1Fixes/Character1/Level3-5.fbx',
        (loadedModel: any) => {
          this.model = loadedModel;
          loadedModel.scale.set(0.025, 0.025, 0.025);
          loadedModel.position.y = -2;
          loadedModel.rotationY = 3;
          if (scene) {
            scene.add(loadedModel);
          }

          // Apply face material modifications
          this.setupFaceMaterials(loadedModel, renderer);

          // Character animation
          loadFBXAnimation(
            '/assets/animation/Neutral Idle.fbx',
            'mixamo.com',
            (animationClip: THREE.AnimationClip) => {
              const mixer = new THREE.AnimationMixer(loadedModel);
              const action = mixer.clipAction(animationClip);
              action.play();
              this.mixer = mixer;
            },
            (error: any) => {
              console.error('Error loading animation:', error);
            },
          );
        },
      );
    } else {
      // Default model code would go here if needed
    }
    this.shouldRotating = shouldRotating;
  };

  // New method to handle face materials
  // Updated method to handle face materials using the simpler approach
  setupFaceMaterials = (model: THREE.Object3D, renderer: THREE.WebGLRenderer) => {
    if (!model) return;

    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        console.log(child.name);

        if (child.name === 'Face') {
          const material = child.material;
          if (Array.isArray(material)) {
            material.forEach((mat) => {
              mat.transparent = true;
              mat.opacity = 1; // Set your desired transparency level
            });
          } else {
            material.transparent = true;
            material.opacity = 1;
          }
        }

        // Apply texture optimizations to all meshes
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((material) => {
              this.optimizeMaterial(material, renderer);
            });
          } else {
            this.optimizeMaterial(child.material, renderer);
          }
        }
      }
    });
  };

  // Helper method to optimize materials
  optimizeMaterial = (material: THREE.Material, renderer: THREE.WebGLRenderer) => {
    if (
      material instanceof THREE.MeshStandardMaterial ||
      material instanceof THREE.MeshBasicMaterial ||
      material instanceof THREE.MeshPhongMaterial
    ) {
      if (material.map) {
        material.map.minFilter = THREE.LinearFilter;
        material.map.generateMipmaps = true;
        material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
      }
    }
  };

  // Method to adjust eye threshold if needed
  adjustEyeThreshold = (threshold: number) => {
    if (this.faceMaterial && this.faceMaterial instanceof THREE.ShaderMaterial) {
      this.faceMaterial.uniforms.eyeThreshold.value = threshold;
      console.log('Adjusted eye threshold to:', threshold);
    }
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
    console.log('Disposing GCAThreeModel resources (index.ts)...');

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

    this.eyeMaterial = undefined;
    this.faceMaterial = undefined;

    // Clear THREE.Cache to release cached textures/models
    THREE.Cache.clear();

    console.log('GCAThreeModel resources disposed (index.ts)');
  };
}
