import { EngineThreeGameLoopPropsInterface } from 'skillvir-architecture-helper/library/game-core/engine/three';
import { GameComponent } from 'skillvir-architecture-helper/library/game-core/helper/scene-manager';
import * as THREE from 'three';

export class GCAPlayerModel extends GameComponent<EngineThreeGameLoopPropsInterface> {
  playerModel: THREE.Mesh | undefined;

  Start = ({ context }: EngineThreeGameLoopPropsInterface) => {
    console.log('SceneState #G030101 Main Menu --- PlayerModel');
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.playerModel = new THREE.Mesh(geometry, material);
  };

  Update = ({ deltaTime }: EngineThreeGameLoopPropsInterface) => {
    // console.log('SceneStateG001S001.Update', sceneName);
    if (this.playerModel) {
      this.playerModel.rotation.x += (90 / 180) * Math.PI * deltaTime;
      this.playerModel.rotation.y += (90 / 180) * Math.PI * deltaTime;
    }
  };

  ComponentAdd = (_parentObj: any) => {
    const parentObj = _parentObj as THREE.Object3D;
    if (!this.playerModel) {
      return;
    }
    parentObj.add(this.playerModel);
  };

  ComponentRemove = (_parentObj: any) => {
    const parentObj = _parentObj as THREE.Object3D;
    if (!this.playerModel) {
      return;
    }
    parentObj.remove(this.playerModel);
  };
}
