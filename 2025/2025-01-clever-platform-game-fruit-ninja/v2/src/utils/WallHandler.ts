import * as THREE from 'three';

import { Cube } from './CubeUtility';
import { loadModel } from './OBJLoader';

interface WallConfig {
  readonly HEIGHT: number;
  readonly DEPTH: number;
  readonly WIDTH: number;
  readonly BASE_Y_OFFSET: number;
  readonly Z_RANGE: number;
  readonly Z_BASE: number;
  readonly VELOCITY: {
    readonly x: number;
    readonly y: number;
    readonly z: number;
  };
}

const WALL_CONFIG: WallConfig = {
  HEIGHT: 8,
  DEPTH: 3,
  WIDTH: 12,
  BASE_Y_OFFSET: 5,
  Z_RANGE: 40,
  Z_BASE: -180,
  VELOCITY: {
    x: 0,
    y: -0.01,
    z: 0,
  },
} as const;

interface WallAssets {
  readonly MODEL_PATH: string;
  readonly TEXTURE_PATH: string;
}

const WALL_ASSETS: WallAssets = {
  MODEL_PATH: '/Models/Asteriod/AsteriodModel.obj',
  TEXTURE_PATH: '/Models/Asteriod/AsteriodTexture.mtl',
} as const;

export class WallHandler {
  public static CreateNewWall(multiplier: number = 1, scene: THREE.Scene): [Cube, Cube] {
    const generateHP = (mult: number): number => {
      return Math.ceil(Math.random() * 4 * mult);
    };

    const createWallCube = (isRight: boolean, hp: number): Cube => {
      const xOffset = isRight ? WALL_CONFIG.WIDTH / 2 : -WALL_CONFIG.WIDTH / 2;
      const zPosition = WALL_CONFIG.Z_BASE + (Math.random() - 0.5) * WALL_CONFIG.Z_RANGE;

      const wall = new Cube({
        height: WALL_CONFIG.HEIGHT,
        depth: WALL_CONFIG.DEPTH,
        width: WALL_CONFIG.WIDTH,
        IsPortal: true,
        DisplayText: hp.toString(),
        IsWall: true,
        velocity: { ...WALL_CONFIG.VELOCITY },
        position: {
          x: xOffset,
          y: WALL_CONFIG.HEIGHT / 2 + WALL_CONFIG.BASE_Y_OFFSET,
          z: zPosition,
        },
      });

      // Load the asteroid model
      loadModel(WALL_ASSETS.MODEL_PATH, WALL_ASSETS.TEXTURE_PATH, scene, wall);

      // Set wall health
      (wall as Cube & { WallHP: number }).WallHP = hp;

      return wall;
    };

    const hp1 = generateHP(multiplier);
    const hp2 = generateHP(multiplier);

    const leftWall = createWallCube(false, hp1);
    const rightWall = createWallCube(true, hp2);

    return [leftWall, rightWall];
  }

  public static updateWallHealth(wall: Cube, damage: number): boolean {
    const customWall = wall as Cube & { WallHP: number };
    if (typeof customWall.WallHP !== 'number') return false;

    customWall.WallHP = Math.max(0, customWall.WallHP - damage);
    return customWall.WallHP <= 0;
  }

  public static getWallHealth(wall: Cube): number {
    return (wall as Cube & { WallHP: number }).WallHP || 0;
  }
}
