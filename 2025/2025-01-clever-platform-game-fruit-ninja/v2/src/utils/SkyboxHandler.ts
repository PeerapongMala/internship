import * as THREE from 'three';

export interface SkyboxPreset {
  right: string;
  left: string;
  top: string;
  bottom: string;
  front: string;
  back: string;
  name?: string;
}

export class SkyboxHandler {
  private scene: THREE.Scene;
  private textureLoader: THREE.CubeTextureLoader;
  private currentTexture: THREE.CubeTexture | null;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.textureLoader = new THREE.CubeTextureLoader();
    this.currentTexture = null;
  }

  public createSkybox(preset: SkyboxPreset): void {
    try {
      const texture = this.textureLoader.load(
        [
          preset.right, // Right image
          preset.left, // Left image
          preset.top, // Top image
          preset.bottom, // Bottom image
          preset.front, // Front image
          preset.back, // Back image
        ],
        // Optional: Success callback
        (texture) => {
          console.log(`Skybox ${preset.name || 'unnamed'} loaded successfully`);
          this.currentTexture = texture;
        },
        // Optional: Progress callback
        undefined,
        // Optional: Error callback
        (error) => {
          console.error('Error loading skybox textures:', error);
        },
      );

      // Set texture encoding if needed
      // texture.encoding = THREE.sRGBEncoding;

      // Apply the skybox to the scene
      this.scene.background = texture;
    } catch (error) {
      console.error('Error creating skybox:', error);
    }
  }

  public getCurrentTexture(): THREE.CubeTexture | null {
    return this.currentTexture;
  }

  public clearSkybox(): void {
    this.scene.background = null;
    this.currentTexture = null;
  }

  // Optional: Method to create a mesh-based skybox instead of using scene.background
  public createMeshSkybox(preset: SkyboxPreset, size: number = 1000): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(size, size, size);
    const materials = [
      preset.right,
      preset.left,
      preset.top,
      preset.bottom,
      preset.front,
      preset.back,
    ].map((texturePath) => {
      const texture = new THREE.TextureLoader().load(texturePath);
      return new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide,
      });
    });

    return new THREE.Mesh(geometry, materials);
  }
}
