import * as THREE from 'three';
import { Cube } from './Cube';
import { EntityObject } from './EntityHandler';

interface Vector3 {
  x: number;
  y: number;
  z: number;
}

interface Size {
  width: number;
  height: number;
  depth: number;
}

export interface ProjectileArgs {
  modelURL?: string;
  spawnPosition: Vector3;
  targetEntities?: EntityObject[];
  scene?: THREE.Scene;
  ProjectileOwner?: THREE.Group | THREE.Object3D;
  speed?: number;
  angle?: number;
  color?: string;
  customSize?: Size;
}

export interface ProjectileModel extends THREE.Object3D {
  OnUpdate?: (deltaTime: number) => void;
  OnTouch?: (TouchFrom: any) => void;
  castShadow: boolean;
  position: THREE.Vector3;
}

class ProjectileHandler {
  protected modelURL!: string;
  protected DisplayModel: ProjectileModel;
  protected ProjectileFromPlayer: boolean;
  protected scene: THREE.Scene | undefined;
  protected ProjectileOwner: THREE.Group | THREE.Object3D | undefined;
  protected color: string;
  protected speed: number;
  protected angle: number;
  protected targetEntities?: EntityObject[];

  constructor({
    modelURL,
    spawnPosition,
    targetEntities,
    scene,
    ProjectileOwner,
    speed = 30,
    angle = 0,
    color = 'orange',
    customSize = {
      width: 1,
      height: 1,
      depth: 1,
    },
  }: ProjectileArgs) {
    this.ProjectileOwner = ProjectileOwner;
    this.targetEntities = targetEntities;
    this.scene = scene;
    this.speed = speed;
    this.color = color;
    this.angle = angle;

    const NewCube = new Cube({
      modelURL: modelURL,
      width: customSize.width,
      height: customSize.height,
      depth: customSize.depth,
      position: spawnPosition,
      velocity: {
        x: 0,
        y: 0,
        z: 0.005,
      },
      color: color,
      zAcceleration: true,
      DoUseTexture: false,
    });

    // NewCube.OnUpdate = function () {
    //   NewCube.position.z -= 0.1;
    // };

    NewCube.OnTouch = function (_TouchFrom: any) {
      // Placeholder for touch event handling
    };
    this.DisplayModel = NewCube;
    this.DisplayModel.castShadow = true;
    this.ProjectileFromPlayer = true;
  }

  public getDisplayModel(): ProjectileModel {
    return this.DisplayModel;
  }
}

export default ProjectileHandler;
