import * as THREE from 'three';
import type { SkyboxFaces } from '@class/SkyboxPresets';

class SkyboxHandler {
  private scene: THREE.Scene;
  private skyboxMesh: THREE.Mesh | null = null;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  createSkybox(preset: SkyboxFaces): void {
    // โหลด texture แยกสำหรับแต่ละด้านของ box
    const textureLoader = new THREE.TextureLoader();

    const loadMaterial = (side: string) => {
      return new THREE.MeshBasicMaterial({
        map: textureLoader.load(side),
        side: THREE.BackSide,
      });
    };

    const materials = [
      loadMaterial(preset.right), // Right
      loadMaterial(preset.left), // Left
      loadMaterial(preset.top), // Top
      loadMaterial(preset.bottom), // Bottom
      loadMaterial(preset.front), // Front
      loadMaterial(preset.back), // Back
    ];

    // สร้าง BoxGeometry ขนาดใหญ่พอที่จะครอบคลุม scene
    // ขนาดควรใหญ่กว่าระยะ far ของ camera แต่ไม่ควรใหญ่เกินไป
    const skyboxGeometry = new THREE.BoxGeometry(1000, 1000, 1000);

    this.skyboxMesh = new THREE.Mesh(skyboxGeometry, materials);
    this.skyboxMesh.name = 'Skybox';
    this.scene.add(this.skyboxMesh);

    console.log('✅ Mesh-based skybox created with individual textures');
  }

  /**
   * เคลื่อนที่ skybox ในทิศทางตรงกันข้ามกับตัวละคร
   * เพื่อสร้างภาพลวงตาว่าตัวละครเคลื่อนที่จริงๆ ในอวกาศ
   *
   * Parallax Effect: ทำให้พื้นหลังเคลื่อนที่ช้ากว่าตัวละคร
   * สร้างความรู้สึกของความลึก (depth perception) ในอวกาศ
   *
   * @param offsetX การเคลื่อนที่ในแกน X ของตัวละคร
   * @param offsetY การเคลื่อนที่ในแกน Y ของตัวละคร
   * @param offsetZ การเคลื่อนที่ในแกน Z ของตัวละคร
   */
  public moveSkybox(offsetX: number, offsetY: number, offsetZ: number): void {
    if (this.skyboxMesh) {
      // เคลื่อนที่ในทิศทางตรงกันข้าม (ทวีคูณด้วยค่าน้อยกว่า 1 เพื่อให้เคลื่อนที่ช้ากว่า)
      // parallaxFactor ยิ่งน้อย skybox ยิ่งเคลื่อนที่ช้า (ดูเหมือนไกลมาก)
      // parallaxFactor ยิ่งมาก skybox ยิ่งเคลื่อนที่เร็ว (ดูเหมือนใกล้)
      const parallaxFactor = 0.3; // 0.3 = skybox เคลื่อนที่ช้ากว่าตัวละคร 70%
      this.skyboxMesh.position.x -= offsetX * parallaxFactor;
      this.skyboxMesh.position.y -= offsetY * parallaxFactor;
      this.skyboxMesh.position.z -= offsetZ * parallaxFactor;

      // 🌀 เพิ่มการหมุนเล็กน้อยให้ skybox เพื่อเพิ่มความสมจริง
      // การหมุนช้ามากๆ จะทำให้รู้สึกเหมือนกำลังลอยอยู่ในอวกาศ
      const rotationFactor = 0.0001; // หมุนช้ามากๆ
      this.skyboxMesh.rotation.y += offsetX * rotationFactor;
      this.skyboxMesh.rotation.x += offsetZ * rotationFactor * 0.5; // แกน X หมุนช้ากว่า
    }
  }

  /**
   * รีเซ็ตตำแหน่งและการหมุนของ skybox
   */
  public resetSkyboxPosition(): void {
    if (this.skyboxMesh) {
      this.skyboxMesh.position.set(0, 0, 0);
      this.skyboxMesh.rotation.set(0, 0, 0);
    }
  }

  /**
   * ดึง skybox mesh
   */
  public getSkyboxMesh(): THREE.Mesh | null {
    return this.skyboxMesh;
  }
}

export default SkyboxHandler;
