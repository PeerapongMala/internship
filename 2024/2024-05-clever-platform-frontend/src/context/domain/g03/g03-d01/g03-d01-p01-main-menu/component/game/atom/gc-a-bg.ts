import { EngineThreeGameLoopPropsInterface } from 'skillvir-architecture-helper/library/game-core/engine/three';
import { GameComponent } from 'skillvir-architecture-helper/library/game-core/helper/scene-manager';
import * as THREE from 'three';

import ImageBG from '../../../assets/bg-game.png';

export class GCABackgroundImage extends GameComponent<EngineThreeGameLoopPropsInterface> {
  // imageURL: string;
  imagePlane: THREE.Mesh | undefined;

  Start = ({ context }: EngineThreeGameLoopPropsInterface) => {
    console.log('SceneState #G030101 Main Menu --- Background Image');
    const texture = new THREE.TextureLoader().load(ImageBG);
    const geometry = new THREE.PlaneGeometry(16, 9);
    const material = new THREE.MeshBasicMaterial({
      // color: 0xffff00,
      side: THREE.DoubleSide,
      map: texture,
    });
    this.imagePlane = new THREE.Mesh(geometry, material);
  };

  Update = (props: EngineThreeGameLoopPropsInterface) => {};

  ComponentAdd = (_parentObj: any) => {
    const parentObj = _parentObj as THREE.Object3D;
    if (!this.imagePlane) {
      return;
    }
    parentObj.add(this.imagePlane);
  };

  ComponentRemove = (_parentObj: any) => {
    const parentObj = _parentObj as THREE.Object3D;
    if (!this.imagePlane) {
      return;
    }
    parentObj.remove(this.imagePlane);
  };
}
