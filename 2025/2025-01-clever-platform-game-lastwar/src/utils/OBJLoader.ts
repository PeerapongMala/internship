import * as THREE from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { Cube } from './CubeUtility';

interface CharacterURLs {
  readonly [key: number]: string;
}

const CHARACTER_URLS: CharacterURLs = {
  1: 'public/assets/model/M05.fbx',
  2: 'public/assets/model/M02.fbx',
  3: 'public/assets/model/F02.fbx',
  4: 'public/assets/model/M04.fbx',
} as const;

interface LoadModelOptions {
  scale?: THREE.Vector3;
  position?: THREE.Vector3;
  onProgress?: (event: ProgressEvent) => void;
}

const DEFAULT_MODEL_OPTIONS: LoadModelOptions = {
  scale: new THREE.Vector3(0.005, 0.005, 0.005),
  position: new THREE.Vector3(0, 0, 0),
};

export async function loadModel(
  modelPath: string,
  texturePath: string,
  scene?: THREE.Scene,
  objectParent?: Cube,
  options: LoadModelOptions = DEFAULT_MODEL_OPTIONS,
): Promise<THREE.Object3D> {
  const loader = new OBJLoader();
  const mtlLoader = new MTLLoader();

  try {
    const materials = await new Promise<MTLLoader.MaterialCreator>((resolve, reject) => {
      mtlLoader.load(texturePath, resolve, undefined, reject);
    });

    materials.preload();
    loader.setMaterials(materials);

    const object = await new Promise<THREE.Object3D>((resolve, reject) => {
      loader.load(modelPath, resolve, options.onProgress, reject);
    });

    const { scale, position } = { ...DEFAULT_MODEL_OPTIONS, ...options };
    object.scale.copy(scale!);
    object.position.copy(position!);

    if (scene) {
      console.log('Adding to scene');
      scene.add(object);
    }

    if (objectParent) {
      objectParent.DisplayModel = object;
    }

    return object;
  } catch (error) {
    console.error('Error loading model:', error);
    throw error;
  }
}

export function loadFBXCharacter(
  url: string,
  _scene: THREE.Scene,
  onLoad?: (object: THREE.Object3D) => void,
  onError?: (error: unknown) => void,
): void {
  const loader = new FBXLoader();
  loader.load(
    url,
    (object) => {
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          console.log(child.name);
          if (child.name === 'Face') {
            child.material.transparent = true;
            child.material.opacity = 1;
            child.material.needsUpdate = true;
          }
        }
      });

      if (onLoad) onLoad(object);
    },
    undefined,
    (error) => {
      console.error(`Error loading model: ${url}`, error);
      if (onError) onError(error);
    },
  );
}

export function loadCharacterFromFBX(
  selectedCharacter: number,
  scene: THREE.Scene,
  callback: (character: THREE.Object3D) => void,
): void {
  const characterURL = CHARACTER_URLS[selectedCharacter] || CHARACTER_URLS[1];

  loadFBXCharacter(
    characterURL,
    scene,
    (character) => {
      character.position.set(0, 0, 0);
      (window as any).PlayerCharacter = character;
      scene.add(character);
      callback(character);
    },
    (error) => {
      console.error('Error loading character:', error);
    },
  );
}

// Helper function to check if a character model exists
export function isValidCharacterModel(characterId: number): boolean {
  return characterId in CHARACTER_URLS;
}

// Helper function to get available character IDs
export function getAvailableCharacterIds(): number[] {
  return Object.keys(CHARACTER_URLS).map(Number);
}
