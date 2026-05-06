import { LoadFBXAnimation } from '@component/code/atom/cc-a-animation-loader';
import { LoadCharacter } from '@component/code/atom/cc-a-model-loader/avatarBlobModelLoader';
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

// Function to determine which animation to use based on modelSrc and whether the answer is correct
function getAnimationPath(
  modelSrc: string | undefined,
  answerIsCorrect: boolean,
): string {
  // Default animations if no specific ones are found
  const defaultCorrectAnimation = 'set2_casting_final.fbx';
  const defaultIncorrectAnimation = 'set2_casting_fail.fbx';

  // If no modelSrc, return default
  if (!modelSrc) {
    return answerIsCorrect ? defaultCorrectAnimation : defaultIncorrectAnimation;
  }

  // Extract set number from modelSrc
  const setMatch = modelSrc.match(/set(\d+)/i);
  if (!setMatch) {
    return answerIsCorrect ? defaultCorrectAnimation : defaultIncorrectAnimation;
  }

  const setNumber = setMatch[1];

  // Extract character number for special handling
  const characterMatch = modelSrc.match(/character(\d+)/i);
  const characterNumber = characterMatch ? characterMatch[1] : '';

  // Set-specific animations
  switch (setNumber) {
    case '1':
      return answerIsCorrect ? 'set1_casting_success.fbx' : 'set1_casting_fail.fbx';

    case '2':
      return answerIsCorrect ? '/Victory/Set2.fbx' : '/Lose/Set2.fbx';

    case '3':
      // Special handling for set 3 based on character number
      if (characterNumber === '1' || characterNumber === '2') {
        return answerIsCorrect
          ? 'Victory/Set3 Character 1 and 2.fbx'
          : 'Lose/Set3 Character 1 and 2.fbx';
      } else if (characterNumber === '3' || characterNumber === '4') {
        return answerIsCorrect
          ? '/Victory/Set3 Character 3 and 4.fbx'
          : '/Lose/Set3 Character 3 and 4.fbx';
      }
      // Fallback for set 3 if character number not matched
      return answerIsCorrect ? 'set3_casting_success.fbx' : 'set3_casting_fail.fbx';

    case '4':
      return answerIsCorrect ? '/Victory/Set4.fbx' : '/Lose/Set4.fbx';

    case '5':
      return answerIsCorrect ? '/Victory/Set5.fbx' : '/Lose/Set5.fbx';

    default:
      // Return default animations if no specific set handling
      return answerIsCorrect ? defaultCorrectAnimation : defaultIncorrectAnimation;
  }
}

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
    answerIsCorrect = true,
    onLoaded, // Add the onLoaded callback parameter
  }: {
    modelSrc?: string;
    scene?: THREE.Object3D;
    shouldRotating?: boolean;
    renderer: THREE.WebGLRenderer;
    answerIsCorrect?: boolean;
    onLoaded?: () => void; // Add the type definition
  }): void => {
    console.log('Model src in character: ' + modelSrc);
    if (modelSrc) {
      if (scene instanceof THREE.Scene) {
        LoadCharacter(modelSrc, scene, (character: THREE.Group) => {
          let mixer: THREE.AnimationMixer | null = null;
          scene?.add(character);

          if (modelSrc.includes('set2')) {
            character.scale.set(0.038, 0.038, 0.038);
            character.position.y = -4;
            character.position.x = 0;
            character.position.z = 0;
            character.rotateY(-15.8);
            character.rotateX(-0.25);
          } else if (modelSrc.includes('set3')) {
            character.scale.set(0.032, 0.032, 0.032);
            character.position.y = -4;
            character.position.x = 0;
          } else if (modelSrc.includes('set4')) {
            character.scale.set(0.038, 0.038, 0.038);
            character.position.y = -4;
            character.position.x = 0;
          } else {
            character.scale.set(0.05, 0.05, 0.05);
            character.position.y = -4;
            character.position.x = 0;
          }

          this.model = character;

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

          // Get the appropriate animation file based on modelSrc and answerIsCorrect
          const animationFile = getAnimationPath(modelSrc, answerIsCorrect);
          console.log(
            `Using animation file: ${animationFile} for model ${modelSrc} (answerIsCorrect: \${answerIsCorrect})`,
          );

          LoadFBXAnimation(
            `/assets/animation/${animationFile}`,
            (animationClip: THREE.AnimationClip) => {
              character.animations.push(animationClip);
              mixer = new THREE.AnimationMixer(character);
              const clips = character.animations;
              console.log('Clips name: ', clips);

              const resultClip = THREE.AnimationClip.findByName(clips, 'mixamo.com');
              if (resultClip && mixer) {
                const resultAction = mixer.clipAction(resultClip);
                resultAction.setLoop(THREE.LoopOnce, 1);
                resultAction.clampWhenFinished = true;
                resultAction.play();

                LoadFBXAnimation(
                  '/assets/animation/Idle.fbx',
                  (idleClip: THREE.AnimationClip) => {
                    if (!mixer) return;

                    character.animations.push(idleClip);
                    const idleAction = mixer.clipAction(idleClip);
                    idleAction.setLoop(THREE.LoopRepeat, Infinity);

                    const onAnimationFinished = () => {
                      if (!mixer) return;
                      idleAction.play();
                      mixer.removeEventListener('finished', onAnimationFinished);
                    };
                    mixer.addEventListener('finished', onAnimationFinished);

                    // Call onLoaded callback when all animations are loaded
                    if (onLoaded) {
                      console.log(
                        'Character model fully loaded, calling onLoaded callback',
                      );
                      onLoaded();
                    }
                  },
                  (error: any) => {
                    console.error('Error loading idle animation:', error);
                    // Call onLoaded even on error to avoid blocking the UI
                    if (onLoaded) {
                      console.log(
                        'Character model loading had errors, still calling onLoaded',
                      );
                      onLoaded();
                    }
                  },
                );
              } else {
                console.error('Result animation clip not found');
                // Call onLoaded even if clip not found
                if (onLoaded) {
                  console.log(
                    'Character model loading had issues, still calling onLoaded',
                  );
                  onLoaded();
                }
              }

              this.mixer = mixer;
            },
            (error: any) => {
              console.error('Error loading result animation:', error);
              // Call onLoaded even on error to avoid blocking the UI
              if (onLoaded) {
                console.log('Character model loading had errors, still calling onLoaded');
                onLoaded();
              }
            },
          );
        });
      } else {
        console.error(
          'Error: scene must be a THREE.Scene when modelSrc is provided for LoadCharacter.',
        );
        // Call onLoaded even on error to avoid blocking the UI
        if (onLoaded) {
          console.log(
            'Character model loading failed (invalid scene), still calling onLoaded',
          );
          onLoaded();
        }
        return;
      }
    } else {
      // Call onLoaded immediately for default model
      if (onLoaded) {
        console.log('Default model loaded, calling onLoaded callback');
        onLoaded();
      }
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

  getWeaponPosition(): THREE.Vector3 {
    // Simple implementation that returns a position relative to the model
    if (!this.model) {
      return new THREE.Vector3(0, 0, 0);
    }

    const position = new THREE.Vector3();
    if (this.model.position) {
      position.copy(this.model.position);
    }

    // Add offset for weapon tip - adjust these values as needed
    position.y += 1.5;
    position.x += 0.5;

    return position;
  }

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
    console.log('Disposing GCAThreeModel resources (initial controller)...');

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

    console.log('GCAThreeModel resources disposed (initial controller)');
  };
}
