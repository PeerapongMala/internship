import { SkyboxPreset } from './SkyboxHandler';

interface SkyboxPresetCollection {
  readonly [key: string]: SkyboxPreset;
}

const ASSET_BASE_PATH = '/Textures/Skyboxes';

export const SkyboxPresets: SkyboxPresetCollection = {
  DayTime: {
    name: 'DayTime',
    top: `${ASSET_BASE_PATH}/up.png`,
    left: `${ASSET_BASE_PATH}/left.png`,
    right: `${ASSET_BASE_PATH}/right.png`,
    bottom: `${ASSET_BASE_PATH}/down.png`,
    back: `${ASSET_BASE_PATH}/back.png`,
    front: `${ASSET_BASE_PATH}/front.png`,
  },

  Galaxy: {
    name: 'Galaxy',
    top: 'https://threejs.org/manual/examples/resources/images/equirectangularmaps/tears_of_steel_bridge_2k.jpg',
    left: 'https://threejs.org/manual/examples/resources/images/equirectangularmaps/tears_of_steel_bridge_2k.jpg',
    right:
      'https://threejs.org/manual/examples/resources/images/equirectangularmaps/tears_of_steel_bridge_2k.jpg',
    bottom:
      'https://threejs.org/manual/examples/resources/images/equirectangularmaps/tears_of_steel_bridge_2k.jpg',
    back: 'https://threejs.org/manual/examples/resources/images/equirectangularmaps/tears_of_steel_bridge_2k.jpg',
    front:
      'https://threejs.org/manual/examples/resources/images/equirectangularmaps/tears_of_steel_bridge_2k.jpg',
  },

  Field: {
    name: 'Field',
    top: `${ASSET_BASE_PATH}/field/posy.jpg`,
    bottom: `${ASSET_BASE_PATH}/field/negy.jpg`,
    left: `${ASSET_BASE_PATH}/field/posz.jpg`,
    right: `${ASSET_BASE_PATH}/field/negz.jpg`,
    front: `${ASSET_BASE_PATH}/field/posx.jpg`,
    back: `${ASSET_BASE_PATH}/field/negx.jpg`,
  },

  Space: {
    name: 'Space',
    top: `${ASSET_BASE_PATH}/Space/top.png`,
    bottom: `${ASSET_BASE_PATH}/Space/bot.png`,
    left: `${ASSET_BASE_PATH}/Space/left.png`,
    right: `${ASSET_BASE_PATH}/Space/right.png`,
    front: `${ASSET_BASE_PATH}/Space/front.png`,
    back: `${ASSET_BASE_PATH}/Space/back.png`,
  },

  Space2: {
    name: 'Space2',
    top: `${ASSET_BASE_PATH}/Space2/top.png`,
    bottom: `${ASSET_BASE_PATH}/Space2/bot.png`,
    left: `${ASSET_BASE_PATH}/Space2/left.png`,
    right: `${ASSET_BASE_PATH}/Space2/right.png`,
    front: `${ASSET_BASE_PATH}/Space2/front.png`,
    back: `${ASSET_BASE_PATH}/Space2/back.png`,
  },
} as const;

// Helper function to get a preset by name
export function getSkyboxPreset(name: keyof typeof SkyboxPresets): SkyboxPreset {
  return SkyboxPresets[name];
}

// Helper function to get all preset names
export function getSkyboxPresetNames(): Array<keyof typeof SkyboxPresets> {
  return Object.keys(SkyboxPresets) as Array<keyof typeof SkyboxPresets>;
}

// Helper function to validate a preset
export function isValidSkyboxPreset(preset: SkyboxPreset): boolean {
  return (
    preset &&
    typeof preset === 'object' &&
    'top' in preset &&
    'bottom' in preset &&
    'left' in preset &&
    'right' in preset &&
    'front' in preset &&
    'back' in preset
  );
}
