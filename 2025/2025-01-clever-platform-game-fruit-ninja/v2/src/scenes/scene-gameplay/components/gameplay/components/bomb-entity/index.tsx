import * as THREE from 'three';
import { ModelFileLoader } from '@core-utils/3d/model-file-loader';
import { PUBLIC_ASSETS_LOCATION } from '@public-assets';

export const modelList = [
  {
    key: 'bomb',
    modelPath: PUBLIC_ASSETS_LOCATION.model.obstacle.bomb.gltf,
    texturePath: '',
    scale: 0.05,
  },
];

function getRandomElement<T>(array: T[]): T {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

const CreateNewObstacle = (index: number) => {
  const debugEnabled = false;

  const model = index < 0 ? getRandomElement(modelList) : modelList[index];

  let group = new THREE.Object3D();
  ModelFileLoader({
    // src: PUBLIC_ASSETS_LOCATION.model.obstacle.bomb.obj,
    // mtl: PUBLIC_ASSETS_LOCATION.model.obstacle.bomb.mtl,
    src: model.modelPath,
    scale: model.scale,
    percentOffset: new THREE.Vector3(0, -5, 20),
    parentObj: group,
    hitboxEnabled: true,
    debugEnabled: debugEnabled,
  });
  return group;
};

export default CreateNewObstacle;
