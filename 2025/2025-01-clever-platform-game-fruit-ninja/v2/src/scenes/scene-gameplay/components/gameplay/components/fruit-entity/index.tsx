import * as THREE from 'three';
import { ModelFileLoader } from '@core-utils/3d/model-file-loader';
import { PUBLIC_ASSETS_LOCATION } from '@public-assets';

export const modelList = [
  {
    key: 'cupcakeStrawberry',
    modelPath: PUBLIC_ASSETS_LOCATION.model.target.cupcakeStrawberry,
    texturePath: '',
    scale: 0.025,
  },
  {
    key: 'doughnutPink',
    modelPath: PUBLIC_ASSETS_LOCATION.model.target.doughnutPink,
    texturePath: '',
    scale: 0.025,
  },
  {
    key: 'doughnutBrown',
    modelPath: PUBLIC_ASSETS_LOCATION.model.target.doughnutBrown,
    texturePath: '',
    scale: 0.025,
  },
  {
    key: 'cakeMango',
    modelPath: PUBLIC_ASSETS_LOCATION.model.target.cakeMango,
    texturePath: '',
    scale: 0.025,
  },
  {
    key: 'croissant',
    modelPath: PUBLIC_ASSETS_LOCATION.model.target.croissant,
    texturePath: '',
    scale: 0.025,
  },
];

function getRandomElement<T>(array: T[]): T {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

const CreateNewTarget = (
  index: number,
  //sceneRef: THREE.Scene
  //PlacePosition: THREE.Vector3
) => {
  // Create an image element
  const debugEnabled = false;

  // const target = index === undefined ? getRandomElement(targetList) : targetList[index];
  const model = index < 0 ? getRandomElement(modelList) : modelList[index];

  let group = new THREE.Object3D();
  ModelFileLoader({
    src: model.modelPath,
    scale: model.scale,
    percentOffset: new THREE.Vector3(0, -50, 0),
    parentObj: group,
    hitboxEnabled: true,
    debugEnabled: debugEnabled,
  });
  return group;
};

export default CreateNewTarget;
