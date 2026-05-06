import * as THREE from "three";

import { FBXLoader } from "three/examples/jsm/Addons.js";

export class GCAThreeModel {
  model: THREE.Group | THREE.Mesh | undefined;
  loader: THREE.Loader = new FBXLoader();

  Start = ({
    modelSrc,
    scene,
  }: {
    modelSrc?: string;
    scene?: THREE.Object3D;
  }): void => {
    if (modelSrc) {
      this.loader.load(modelSrc, (object: any) => {
        console.log(object);
        object.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        object.translateY(-5);
        object.scale.set(0.05, 0.05, 0.05);

        this.model = object as THREE.Group;

        // after finished loading, add the model to scene
        scene?.add(this.model);
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
