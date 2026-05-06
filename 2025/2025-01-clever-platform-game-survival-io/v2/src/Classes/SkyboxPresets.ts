interface SkyboxFaces {
  top: string;
  left: string;
  right: string;
  bottom: string;
  back: string;
  front: string;
}

const SkyboxPresets: Record<string, SkyboxFaces> = {
  DayTime: {
    top: 'Textures/Skyboxes/up.png',
    left: 'Textures/Skyboxes/left.png',
    right: 'Textures/Skyboxes/right.png',
    bottom: 'Textures/Skyboxes/down.png',
    back: 'Textures/Skyboxes/back.png',
    front: 'Textures/Skyboxes/front.png',
  },
  Galaxy: {
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
    top: 'Textures/Skyboxes/field/posy.jpg',
    bottom: 'Textures/Skyboxes/field/negy.jpg',

    left: 'Textures/Skyboxes/field/posz.jpg',
    right: 'Textures/Skyboxes/field/negz.jpg',

    front: 'Textures/Skyboxes/field/posx.jpg',
    back: 'Textures/Skyboxes/field/negx.jpg',
  },
};

export default SkyboxPresets;
export type { SkyboxFaces };
