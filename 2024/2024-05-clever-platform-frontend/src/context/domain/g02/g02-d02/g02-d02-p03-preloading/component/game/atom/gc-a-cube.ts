import { EngineThreeGameLoopPropsInterface } from 'skillvir-architecture-helper/library/game-core/engine/three';
import { GameComponent } from 'skillvir-architecture-helper/library/game-core/helper/scene-manager';
import * as THREE from 'three';

export class GCACube extends GameComponent<EngineThreeGameLoopPropsInterface> {
  cube: THREE.Mesh | undefined;

  Start = ({ context }: EngineThreeGameLoopPropsInterface) => {
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.set(0, 0, 0);
  };

  Update = ({ deltaTime }: EngineThreeGameLoopPropsInterface) => {
    // console.log('SceneStateG001Demo7.Update', sceneName);
    //console.log('Hello');
    if (this.cube) {
      this.cube.rotation.x += (90 / 180) * Math.PI * deltaTime;
      this.cube.rotation.y += (90 / 180) * Math.PI * deltaTime;
    }
  };

  ComponentAdd = (_object: any) => {
    const object = _object as THREE.Object3D;
    if (!this.cube) {
      return;
    }
    object.add(this.cube);
  };

  ComponentRemove = (_object: any) => {
    const object = _object as THREE.Object3D;
    if (!this.cube) {
      return;
    }
    object.remove(this.cube);
  };
}
