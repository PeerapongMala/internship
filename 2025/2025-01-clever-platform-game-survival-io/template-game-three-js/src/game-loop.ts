import * as THREE from 'three';
import type {
  EngineThreeGameLoopInterface,
  EngineThreeGameLoopPropsInterface,
} from './engine-three';

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
let cube: THREE.Mesh | null = null;

const Update: EngineThreeGameLoopInterface = (
  props: EngineThreeGameLoopPropsInterface,
) => {
  if (!cube) {
    cube = new THREE.Mesh(geometry, material);
    props.context.scene.add(cube);
  }

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
};

const GameLoop = {
  Update,
};

export default GameLoop;
