import { EngineThreeGameLoopPropsInterface } from 'skillvir-architecture-helper/library/game-core/engine/three';
import { CanvasScaler } from 'skillvir-architecture-helper/library/game-core/helper/canvas-scaler';
import { SceneState } from 'skillvir-architecture-helper/library/game-core/helper/scene-manager';
import * as THREE from 'three';

import StoreGame from '@global/store/game';
import { CVABG } from '../component/canvas/atom/cv-a-bg';
import { CVABGSafeZone } from '../component/canvas/atom/cv-a-bg-safezone';
import { GCACube } from '../component/game/atom/gc-a-cube';
import ConfigJson from '../config/index.json';

class SceneStateG020203Demo1 extends SceneState<EngineThreeGameLoopPropsInterface> {
  sceneObject = new THREE.Object3D();
  canvasScaler = new CanvasScaler();

  //Game Component
  gcaCube = new GCACube();
  //BG Canvas Component
  cvaBG = new CVABG();
  //Canvas Component
  cvaBGSafeZone = new CVABGSafeZone();

  constructor() {
    super(ConfigJson.id);
  }

  Start = (props: EngineThreeGameLoopPropsInterface) => {
    const { context } = props;
    context.camera.main.position.z = 5;
    context.scene.background = new THREE.Color(0x0011111);
    this.gcaCube.Start(props);

    // context.scene.add(this.sceneObject);
    //console.log('SceneStateG001Demo1', context.scene);
    this.gcaCube.ComponentAdd(this.sceneObject);
    if (this.gcaCube.cube) {
      context.scene.add(this.sceneObject);
    }

    // UI BG
    this.cvaBG.Start({}, props);

    // UI
    this.cvaBGSafeZone.Start({}, props);
  };

  Unload = () => {
    this.sceneObject.parent?.remove(this.sceneObject);
  };

  Update = (props: EngineThreeGameLoopPropsInterface) => {
    this.gcaCube.Update(props);

    // UI BG
    const uiBG = StoreGame.StateGetAllWithUnsubscribe().uiBG;
    this.cvaBG.Update({ context2d: uiBG.context2d, canvas: uiBG.canvas }, props);

    // UI
    const ui = StoreGame.StateGetAllWithUnsubscribe().ui;
    ui.context2d?.clearRect(0, 0, ui.canvas?.width || 0, ui.canvas?.height || 0);

    // CanvasScaler initial
    this.canvasScaler.initial({
      canvas: ui.canvas,
      context2d: ui.context2d,
    });
    this.canvasScaler.calculate();

    // UI
    this.cvaBGSafeZone.Update(
      {
        canvasScaler: this.canvasScaler,
        context2d: ui.context2d,
        canvas: ui.canvas,
      },
      props,
    );
  };
}

const GameInitial = SceneStateG020203Demo1;
export default GameInitial;
