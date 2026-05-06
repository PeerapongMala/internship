import { Cube } from './CubeUtility';
import { Vector3D } from '@/types/game';

interface PortalEffect {
  firerate?: number;
  damage?: number;
  burst?: number;
  burstspeed?: number;
  displayText: string;
}

interface PortalConfig {
  readonly WIDTH: number;
  readonly HEIGHT: number;
  readonly DEPTH: number;
  readonly SPACING: number;
  readonly START_Z: number;
  readonly VELOCITY: Vector3D;
}

const PORTAL_CONFIG: PortalConfig = {
  WIDTH: 12,
  HEIGHT: 15,
  DEPTH: 3,
  SPACING: 12,
  START_Z: -120,
  VELOCITY: {
    x: 0,
    y: -0.01,
    z: 0,
  },
} as const;

const EFFECT_LIST: readonly PortalEffect[] = [
  { firerate: 0.75, displayText: '🔫↻' },
  { damage: 1, displayText: '💥' },
  { burst: 1, displayText: 'burst' },
  { burstspeed: 0.1, displayText: 'burst speed' },
] as const;

export class PortalHandler {
  private static previousEffect: PortalEffect | null = null;

  private static createPortalCube(effect: PortalEffect, isLeftPortal: boolean): Cube {
    const xOffset = isLeftPortal ? -PORTAL_CONFIG.SPACING / 2 : PORTAL_CONFIG.SPACING / 2;

    const effectType = Object.keys(effect).find((key) => key !== 'displayText');
    const effectValue = effect[effectType as keyof Omit<PortalEffect, 'displayText'>];

    const portal = new Cube({
      width: PORTAL_CONFIG.WIDTH,
      height: PORTAL_CONFIG.HEIGHT,
      depth: PORTAL_CONFIG.DEPTH,
      IsPortal: true,
      DisplayText: `+ ${effectType} ${effectValue}`,
      velocity: PORTAL_CONFIG.VELOCITY,
      position: {
        x: xOffset,
        y: PORTAL_CONFIG.HEIGHT / 2,
        z: PORTAL_CONFIG.START_Z,
      },
      ...effect,
    });

    // Add effect property to the portal
    (portal as Cube & { effect: PortalEffect }).effect = effect;

    return portal;
  }

  public static CreateNewPortal(): [Cube, Cube] {
    let effect1: PortalEffect;
    let effect2: PortalEffect;

    do {
      effect1 = EFFECT_LIST[Math.floor(Math.random() * EFFECT_LIST.length)];
      effect2 = EFFECT_LIST[Math.floor(Math.random() * EFFECT_LIST.length)];
    } while (effect1 === effect2 || effect1 === this.previousEffect);

    this.previousEffect = effect1;

    const portal1 = this.createPortalCube(effect1, true);
    const portal2 = this.createPortalCube(effect2, false);

    return [portal1, portal2];
  }

  public static getEffectList(): readonly PortalEffect[] {
    return EFFECT_LIST;
  }
}
