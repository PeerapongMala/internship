
export type EnvMapFiles = {
  px: string;
  nx: string;
  py: string;
  ny: string;
  pz: string;
  nz: string;
};

export enum EnvironmentEnum {
  DAYTIME = 'DayTime',
  GALAXY = 'Galaxy',
  FIELD = 'Field',
  SPACE = 'Space',
  SPACE2 = 'Space2',
}

export type EnvironmentPreset = 'DayTime' | 'Galaxy' | 'Field' | 'Space' | 'Space2';

const ASSET_BASE_PATH = '/Textures/Skyboxes';

export const ENVIRONMENT_FILES: Record<EnvironmentPreset, EnvMapFiles> = {
  DayTime: {
    px: `${ASSET_BASE_PATH}/right.png`,
    nx: `${ASSET_BASE_PATH}/left.png`,
    py: `${ASSET_BASE_PATH}/up.png`,
    ny: `${ASSET_BASE_PATH}/down.png`,
    pz: `${ASSET_BASE_PATH}/front.png`,
    nz: `${ASSET_BASE_PATH}/back.png`,
  },
  Galaxy: {
    px: 'https://threejs.org/manual/examples/resources/images/equirectangularmaps/tears_of_steel_bridge_2k.jpg',
    nx: 'https://threejs.org/manual/examples/resources/images/equirectangularmaps/tears_of_steel_bridge_2k.jpg',
    py: 'https://threejs.org/manual/examples/resources/images/equirectangularmaps/tears_of_steel_bridge_2k.jpg',
    ny: 'https://threejs.org/manual/examples/resources/images/equirectangularmaps/tears_of_steel_bridge_2k.jpg',
    pz: 'https://threejs.org/manual/examples/resources/images/equirectangularmaps/tears_of_steel_bridge_2k.jpg',
    nz: 'https://threejs.org/manual/examples/resources/images/equirectangularmaps/tears_of_steel_bridge_2k.jpg',
  },
  Field: {
    px: `${ASSET_BASE_PATH}/field/posx.jpg`,
    nx: `${ASSET_BASE_PATH}/field/negx.jpg`,
    py: `${ASSET_BASE_PATH}/field/posy.jpg`,
    ny: `${ASSET_BASE_PATH}/field/negy.jpg`,
    pz: `${ASSET_BASE_PATH}/field/posz.jpg`,
    nz: `${ASSET_BASE_PATH}/field/negz.jpg`,
  },
  Space: {
    px: `${ASSET_BASE_PATH}/Space/right.png`,
    nx: `${ASSET_BASE_PATH}/Space/left.png`,
    py: `${ASSET_BASE_PATH}/Space/top.png`,
    ny: `${ASSET_BASE_PATH}/Space/bot.png`,
    pz: `${ASSET_BASE_PATH}/Space/front.png`,
    nz: `${ASSET_BASE_PATH}/Space/back.png`,
  },
  Space2: {
    px: `${ASSET_BASE_PATH}/Space2/right.png`,
    nx: `${ASSET_BASE_PATH}/Space2/left.png`,
    py: `${ASSET_BASE_PATH}/Space2/top.png`,
    ny: `${ASSET_BASE_PATH}/Space2/bot.png`,
    pz: `${ASSET_BASE_PATH}/Space2/front.png`,
    nz: `${ASSET_BASE_PATH}/Space2/back.png`,
  },
};

export const ENVIRONMENT_PRESETS = {
  DayTime: {
    name: EnvironmentEnum.DAYTIME,
    files: ENVIRONMENT_FILES.DayTime,
    background: true,
    blur: 0,
  },
  Galaxy: {
    name: EnvironmentEnum.GALAXY,
    files: ENVIRONMENT_FILES.Galaxy,
    background: true,
    blur: 0.5,
  },
  Field: {
    name: EnvironmentEnum.FIELD,
    files: ENVIRONMENT_FILES.Field,
    background: true,
    blur: 0,
  },
  Space: {
    name: EnvironmentEnum.SPACE,
    files: ENVIRONMENT_FILES.Space,
    background: true,
    blur: 0,
  },
  Space2: {
    name: EnvironmentEnum.SPACE2,
    files: ENVIRONMENT_FILES.Space2,
    background: true,
    blur: 0,
  },
} as const;
