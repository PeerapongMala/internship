import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

export class FBXLoaderHelper {
  private loader: FBXLoader;
  bones: Map<string, any>;
  modelPath: string;
  loadedModel?: THREE.Group;

  constructor(modelPath: string, onLoaded?: any) {
    this.loader = new FBXLoader();
    this.bones = new Map();
    this.modelPath = modelPath;

    // Load Model
    this.loader.load(
      modelPath,
      (object: THREE.Group) => {
        this.loadedModel = object;
        if (onLoaded) {
          // check for bones
          //console.log('Checking Bones');
          object.traverse((child) => {
            if (child.type == 'Bone') {
              this.bones.set(child.name, child);
            }
          });
          onLoaded(object);
        }
      },
      undefined,
      (error: any) => {
        console.error(`Error loading FBX file: ${modelPath}`, error);
      },
    );
  }

  getModel() {
    if (this.loadedModel) {
      return this.loadedModel;
    }
    return console.warn(`Error getting FBX file: ${this.modelPath} due not being loaded`);
  }

  getBone(boneName: string): any {
    if (this.bones.has(boneName)) {
      return this.bones.get(boneName);
    }
    console.warn(`${this.modelPath} not exist in model's bone`);
    return null;
  }

  getAllBone() {
    return this.bones || null;
  }
}
