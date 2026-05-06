import { EngineThreeGameLoopPropsInterface } from 'skillvir-architecture-helper/library/game-core/engine/three';
import { GameComponent } from 'skillvir-architecture-helper/library/game-core/helper/scene-manager';
import * as THREE from 'three';

export class GCACube extends GameComponent<EngineThreeGameLoopPropsInterface> {
  cube: THREE.Mesh | undefined;

  Start = ({ context }: EngineThreeGameLoopPropsInterface) => {
    console.log('SceneStateG001SDemo1.Start');

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
  };

  Update = ({ deltaTime }: EngineThreeGameLoopPropsInterface) => {
    // console.log('SceneStateG001S001.Update', sceneName);
    if (this.cube) {
      this.cube.rotation.x += (90 / 180) * Math.PI * deltaTime;
      this.cube.rotation.y += (90 / 180) * Math.PI * deltaTime;
    }
  };

  ComponentAdd = (_parentObj: any) => {
    const parentObj = _parentObj as THREE.Object3D;
    if (!this.cube) {
      return;
    }
    parentObj.add(this.cube);
  };

  ComponentRemove = (_parentObj: any) => {
    const parentObj = _parentObj as THREE.Object3D;
    if (!this.cube) {
      return;
    }
    parentObj.remove(this.cube);
  };
}
