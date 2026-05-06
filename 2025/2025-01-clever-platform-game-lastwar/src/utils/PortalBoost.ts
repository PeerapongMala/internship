import { Cube } from './CubeUtility';

interface PortalEffect {
  fireRate?: number;
  damage?: number;
  burst?: boolean;
}

interface PortalConfig {
  readonly PORTAL_WIDTH: number;
  readonly PORTAL_HEIGHT: number;
  readonly PORTAL_DEPTH: number;
  readonly PORTAL_SPACING: number;
  readonly PORTAL_START_Z: number;
  readonly PORTAL_VELOCITY_Y: number;
}

const PORTAL_CONFIG: PortalConfig = {
  PORTAL_WIDTH: 12,
  PORTAL_HEIGHT: 15,
  PORTAL_DEPTH: 3,
  PORTAL_SPACING: 12,
  PORTAL_START_Z: -120,
  PORTAL_VELOCITY_Y: -0.01,
};

const EFFECT_PROBABILITIES = {
  FIRE_RATE: 40,
  DAMAGE: 30,
  BURST: 30,
  TOTAL: 100,
} as const;

function generatePortalEffect(
  previousEffect: number | null = null,
): [PortalEffect, number] {
  let effectChance: number;

  do {
    effectChance = Math.floor(Math.random() * EFFECT_PROBABILITIES.TOTAL);
  } while (effectChance === previousEffect);

  const effect: PortalEffect = {};

  if (effectChance < EFFECT_PROBABILITIES.FIRE_RATE) {
    effect.fireRate = 1.5;
  } else if (
    effectChance <
    EFFECT_PROBABILITIES.FIRE_RATE + EFFECT_PROBABILITIES.DAMAGE
  ) {
    effect.damage = 1;
  } else {
    effect.burst = true;
  }

  return [effect, effectChance];
}

export function createNewPortal(): [Cube, Cube] {
  const randomNumber1 = Math.floor(Math.random() * 11);
  const randomNumber2 = Math.floor(Math.random() * 11);

  const [portalEffect, effectChance] = generatePortalEffect();
  const [portal2Effect] = generatePortalEffect(effectChance);

  const portal = new Cube({
    width: PORTAL_CONFIG.PORTAL_WIDTH,
    height: PORTAL_CONFIG.PORTAL_HEIGHT,
    depth: PORTAL_CONFIG.PORTAL_DEPTH,
    IsPortal: true,
    DisplayText: randomNumber1.toString(),
    velocity: {
      x: 0,
      y: PORTAL_CONFIG.PORTAL_VELOCITY_Y,
      z: 0,
    },
    position: {
      x: 0 - PORTAL_CONFIG.PORTAL_SPACING / 2,
      y: PORTAL_CONFIG.PORTAL_HEIGHT / 2,
      z: PORTAL_CONFIG.PORTAL_START_Z,
    },
    ...portalEffect,
  });

  const portal2 = new Cube({
    width: PORTAL_CONFIG.PORTAL_WIDTH,
    height: PORTAL_CONFIG.PORTAL_HEIGHT,
    depth: PORTAL_CONFIG.PORTAL_DEPTH,
    IsPortal: true,
    DisplayText: randomNumber2.toString(),
    velocity: {
      x: 0,
      y: PORTAL_CONFIG.PORTAL_VELOCITY_Y,
      z: 0,
    },
    position: {
      x: 0 + PORTAL_CONFIG.PORTAL_SPACING / 2,
      y: PORTAL_CONFIG.PORTAL_HEIGHT / 2,
      z: PORTAL_CONFIG.PORTAL_START_Z,
    },
    ...portal2Effect,
  });

  return [portal, portal2];
}
