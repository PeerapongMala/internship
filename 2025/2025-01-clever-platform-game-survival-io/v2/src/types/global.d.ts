import { Cube } from '../utils/CubeUtility';
import * as THREE from 'three';

interface GameManager {
  PlayerCharacter: Cube;
  Ground: Cube;
  Gamerenderer: THREE.WebGLRenderer;
  currentScene: number;
  getScore(): number;
  resetScore(): void;
}
