import {
  EngineThreeGameLoopInterface,
  EngineThreeGameLoopPropsInterface,
} from 'skillvir-architecture-helper/library/game-core/engine/three';
import {
  SceneManager,
  SceneState,
} from 'skillvir-architecture-helper/library/game-core/helper/scene-manager';

import StoreGame from '../store/game';

const sceneManager = new SceneManager<EngineThreeGameLoopPropsInterface>();
const SceneStateInit = (
  sceneStateList: SceneState<EngineThreeGameLoopPropsInterface>[],
) => {
  sceneManager.AddList(sceneStateList);
};
StoreGame.MethodGet().SceneManagerSet(sceneManager);

const GameLoop: EngineThreeGameLoopInterface = (
  props: EngineThreeGameLoopPropsInterface,
) => {
  sceneManager.Update(props);
};

const MainGameLoop = { GameLoop, SceneStateInit };
export default MainGameLoop;
