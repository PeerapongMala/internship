import * as THREE from 'three';

class SkyboxHandler {

  constructor(scene) {
    this.scene = scene;
    this.textureLoader = new THREE.CubeTextureLoader();
  }

  createSkybox(preset) {
    const texture = this.textureLoader.load([
      preset.right, // Right image
      preset.left, // Left image
      preset.top, // Top image
      preset.bottom, // Bottom image
      preset.front, // Front image
      preset.back, // Back image
    ]);
    console.log(preset,texture)
    //texture.encoding = THREE.sRGBEncoding;

    /*
    const skybox = new THREE.Mesh(
      new THREE.BoxGeometry(1000, 1000, 1000),
      new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide })
    );   */

		this.scene.background = texture;

    //this.scene.add(skybox);
  }

}


export default SkyboxHandler