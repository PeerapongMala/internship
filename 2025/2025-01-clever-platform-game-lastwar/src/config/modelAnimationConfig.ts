import { PUBLIC_ASSETS_LOCATION } from '@public-assets';

/**
 * Configuration interface for Model Animation Tester
 */
export interface ModelConfig {
  name: string;
  modelPath: string;
  animationPath: string;
}

export const OBSTACLE_MODELS: ModelConfig[] = [
  {
    name: 'Elephant',
    modelPath: PUBLIC_ASSETS_LOCATION.model.obstacle.animalModel.Elephant,
    animationPath: PUBLIC_ASSETS_LOCATION.model.obstacle.animalAnimation_typeA,
  },
  {
    name: 'Hippo',
    modelPath: PUBLIC_ASSETS_LOCATION.model.obstacle.animalModel.Hippo,
    animationPath: PUBLIC_ASSETS_LOCATION.model.obstacle.animalAnimation_typeA,
  },
  {
    name: 'Bear',
    modelPath: PUBLIC_ASSETS_LOCATION.model.obstacle.animalModel.Bear,
    animationPath: PUBLIC_ASSETS_LOCATION.model.obstacle.animalAnimation_typeA,
  },
  {
    name: 'Deer',
    modelPath: PUBLIC_ASSETS_LOCATION.model.obstacle.animalModel.Deer,
    animationPath: PUBLIC_ASSETS_LOCATION.model.obstacle.animalAnimation_typeB,
  },
  {
    name: 'Giraffe',
    modelPath: PUBLIC_ASSETS_LOCATION.model.obstacle.animalModel.Giraffe,
    animationPath: PUBLIC_ASSETS_LOCATION.model.obstacle.animalAnimation_typeB,
  },
  {
    name: 'Zebra',
    modelPath: PUBLIC_ASSETS_LOCATION.model.obstacle.animalModel.Zebra,
    animationPath: PUBLIC_ASSETS_LOCATION.model.obstacle.animalAnimation_typeB,
  },
];

/**
 * Default models configuration for this project
 */
export const PROJECT_MODELS: ModelConfig[] = [
  {
    name: 'default character',
    modelPath: PUBLIC_ASSETS_LOCATION.model.character.model.test,
    animationPath: PUBLIC_ASSETS_LOCATION.model.character.animation.default,
  },
  {
    name: 'test character',
    modelPath: PUBLIC_ASSETS_LOCATION.model.character.model.test,
    animationPath: PUBLIC_ASSETS_LOCATION.model.character.animation.test,
  },
  ...OBSTACLE_MODELS,
];
