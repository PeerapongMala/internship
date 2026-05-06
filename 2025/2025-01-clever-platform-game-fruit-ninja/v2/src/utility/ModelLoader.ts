import { GLTFLoader } from 'three-stdlib';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export async function loadOBJModel(ModelPath: string, TexturePath: string) {
  const newobjloader = new OBJLoader();
  const mtlLoader = new MTLLoader();
  return new Promise((resolve, reject) => {
    try {
      mtlLoader.load(TexturePath, (materials) => {
        newobjloader.setMaterials(materials);
        newobjloader.load(ModelPath, (object) => {
          resolve(object);
        });
      });
    } catch (e) {
      console.error('Error loading model:', e);
      reject(e);
    }
  });
}

export function loadGLTFModel(ModelPath: string) {
  const newobjloader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    try {
      newobjloader.load(ModelPath, (object) => {
        resolve(object);
      });
    } catch (e) {
      console.error('Error loading model:', e);
      reject(e);
    }
  });
}
