import ProjectileHandler, {
  ProjectileArgs,
  ProjectileModel,
} from '@class/ProjectileHandler';
import * as THREE from 'three';
import { PUBLIC_ASSETS_LOCATION } from '@/assets/public-assets-locations';
import { ModelFileLoader } from '@core-utils/3d/model-file-loader';
import { playSoundEffect } from '@/utils/core-utils/sound';
import { SOUND_GROUPS } from '@/assets/public-sound';

interface Enemy extends THREE.Object3D {
  IsEnemy: boolean;
  IsDied: boolean;
  visible: boolean;
  EntityData?: {
    isDied?: boolean;
    takeDamage: (damage: number, isCritical: boolean) => void;
  };
}

// interface CustomSize {
//   width: number;
//   height: number;
//   depth: number;
// }

// interface LaserArgs {
//   spawnposition: {
//     x: number;
//     y: number;
//     z: number;
//   };
//   scene: THREE.Scene;
//   color?: string;
//   customSize?: CustomSize;
//   speed?: number;
// }

class Laser extends ProjectileHandler {
  protected damage: number;
  private isDestroyed: boolean;
  private lifespan: number;
  private maxLifespan: number;
  private sourceModel: THREE.Group | null; // โมเดลแหล่งกำเนิด (laser source) ที่ลอยอยู่ใกล้ตัวละคร
  private targetEnemy: Enemy | null; // ศัตรูเป้าหมายปัจจุบัน
  private nearbyEnemies: Enemy[]; // ศัตรูที่อยู่ใกล้เคียง
  private currentTargetIndex: number; // index ของศัตรูที่กำลังโจมตี
  private sweepTimer: number; // ตัวนับเวลาสำหรับกวาดไปหาศัตรูถัดไป
  private sweepInterval: number; // ระยะเวลาที่ใช้โจมตีศัตรูแต่ละตัว (วินาที)
  private playerPosition: THREE.Vector3; // ตำแหน่งของตัวละครเมื่อสร้าง Laser
  private collisionBox: THREE.Mesh | null; // collision box ที่มองไม่เห็นสำหรับตรวจจับการชน

  // constructor(args: Partial<LaserArgs>) {
  constructor(args: ProjectileArgs) {
    // กำหนดตำแหน่งสร้างให้อยู่ที่เป้าหมาย (พื้นดิน)
    const spawnPos = args.spawnPosition || { x: 0, y: 0, z: 0 };

    // สร้าง ProjectileHandler โดยไม่ใช้ modelURL (จะสร้าง beam geometry เอง)
    super({
      spawnPosition: spawnPos, // spawn ที่ตัวละคร
      targetEntities: args.targetEntities,
      scene: args.scene!,
      customSize: args.customSize || { width: 0.6, height: 30, depth: 0.6 }, // ความยาว beam
      color: args.color || 'cyan',
      speed: 0, // ไม่เคลื่อนที่
    });

    // เก็บตำแหน่งของตัวละคร
    this.playerPosition = new THREE.Vector3(spawnPos.x, spawnPos.y, spawnPos.z);

    this.damage = 9999; // 🔥 MASSIVE DAMAGE - ตายทันที! (ทดสอบ collision detection)
    this.isDestroyed = false;
    this.maxLifespan = 2.5; // เพิ่มระยะเวลาให้กวาดได้หลายตัว
    this.lifespan = this.maxLifespan;
    this.sourceModel = null;
    this.targetEnemy = null;
    this.nearbyEnemies = [];
    this.currentTargetIndex = 0;
    this.sweepTimer = 0;
    this.sweepInterval = 0.8; // กวาดไปหาศัตรูใหม่ทุก 0.8 วินาที
    this.collisionBox = null;

    // ใช้ศัตรูที่ส่งมาจาก gameplay แทนการหาใหม่
    if (args.targetEntities && args.targetEntities.length > 0) {
      // ใช้ Enemy objects ที่ส่งมาโดยตรง (ไม่ต้องแปลงจาก position)
      this.nearbyEnemies = args.targetEntities as Enemy[];
      console.log(
        '🎯 Laser targeting',
        this.nearbyEnemies.length,
        'enemies directly from gameplay',
      );
    } else {
      // Fallback: หาเองถ้าไม่มีส่งมา
      this.nearbyEnemies = this.findNearbyEnemies(3);
      console.log('⚠️ No targetEntities provided, finding enemies manually');
    }

    if (this.nearbyEnemies.length > 0) {
      this.targetEnemy = this.nearbyEnemies[0];
    }

    // แทนที่ DisplayModel เดิม (cube) ด้วย beam และ source model
    this.createLaserBeam(spawnPos, args.scene!);

    // ตั้งค่า collision detection และ update
    // OnTouch อยู่กับ collision box (เพื่อให้ระบบ EntityHandler เจอได้)
    // OnUpdate อยู่กับ DisplayModel (เพื่อ updateLaser)
    const updateFunc = this.updateLaser.bind(this);
    const touchFunc = (TouchFrom: Enemy) => {
      // 🛡️ CRITICAL: ป้องกันไม่ให้ชนกับ Player!
      if ((TouchFrom as any).isPlayer === true) {
        console.log('🛡️ Collision ignored - This is the PLAYER! (Protected)');
        return;
      }

      console.log('🎯🎯🎯 LASER COLLISION DETECTED! 🎯🎯🎯', {
        enemyName: TouchFrom.name,
        isEnemy: TouchFrom.IsEnemy,
        isPlayer: (TouchFrom as any).isPlayer,
        visible: TouchFrom.visible,
        isDied: TouchFrom.IsDied,
        hasEntityData: !!TouchFrom.EntityData,
        hasTakeDamage: !!TouchFrom.EntityData?.takeDamage,
        entityDataIsDied: TouchFrom.EntityData?.isDied,
        damageAmount: this.damage,
      });

      // เช็คทั้ง IsEnemy และ isEnemy (case-sensitive)
      const isActualEnemy =
        TouchFrom.IsEnemy === true || (TouchFrom as any).isEnemy === true;

      if (!isActualEnemy) {
        console.log(
          '⚠️ Collision ignored - NOT an enemy (probably other projectile or object)',
        );
        return;
      }

      // เช็คว่าศัตรูยังมีชีวิตอยู่ (เช็คทั้ง IsDied และ EntityData.isDied)
      const isAlreadyDead =
        TouchFrom.IsDied === true || TouchFrom.EntityData?.isDied === true;

      if (isAlreadyDead || !TouchFrom.visible) {
        console.log('⚠️ Collision ignored - enemy already dead or invisible');
        return;
      }

      // สร้าง damage ให้ศัตรู
      if (TouchFrom.EntityData && typeof TouchFrom.EntityData.takeDamage === 'function') {
        console.log('💥💥💥 DEALING MASSIVE DAMAGE:', this.damage, '💥💥💥');
        TouchFrom.EntityData.takeDamage(this.damage, true);

        void playSoundEffect(SOUND_GROUPS.sfx.enemy_hit);

        console.log('⚡ Laser beam OBLITERATED enemy with', this.damage, 'damage!');
        console.log(
          '   Enemy status - IsDied:',
          TouchFrom.IsDied,
          'EntityData.isDied:',
          TouchFrom.EntityData?.isDied,
        );
      } else {
        console.warn('⚠️ Enemy has no takeDamage function!', TouchFrom);
      }
    };

    // DisplayModel (beam) มี OnUpdate สำหรับอัพเดตเอฟเฟกต์
    this.DisplayModel.OnUpdate = updateFunc;

    // collision box มี OnTouch สำหรับตรวจจับการชน
    if (this.collisionBox) {
      (this.collisionBox as any).OnTouch = touchFunc;
    }

    console.log('✅ Laser created with beam collision detection enabled');
  }

  // Override getDisplayModel เพื่อ return dummy object
  // เพราะ sourceModel ถูก add เข้า scene แล้วใน createSourceModel()
  public getDisplayModel(): ProjectileModel {
    // Return empty group ที่ไม่มีอะไรเพื่อไม่ให้ gameplay add cube เข้า scene
    const dummyGroup = new THREE.Group();
    dummyGroup.visible = false; // ซ่อนเพื่อไม่ให้เห็น
    console.log(
      '⚠️ getDisplayModel() called - returning dummy (sourceModel already in scene)',
    );
    return dummyGroup as any;
  }

  // ฟังก์ชันหาศัตรูที่ใกล้ที่สุดหลายตัว (Fallback เมื่อไม่มี targetEntities)
  private findNearbyEnemies(count: number): Enemy[] {
    const enemies: { enemy: Enemy; distance: number }[] = [];

    (window as any).entities?.forEach((entity: { EntityObject: Enemy }) => {
      if (
        entity.EntityObject.IsEnemy &&
        entity.EntityObject.visible &&
        !entity.EntityObject.IsDied
      ) {
        const distance = this.DisplayModel.position.distanceTo(
          entity.EntityObject.position,
        );
        enemies.push({ enemy: entity.EntityObject, distance });
      }
    });

    // เรียงตามระยะทางและเอาแค่ตัวที่ใกล้ที่สุด
    enemies.sort((a, b) => a.distance - b.distance);
    return enemies.slice(0, count).map((e) => e.enemy);
  }

  private createLaserBeam(
    spawnPos: { x: number; y: number; z: number },
    scene: THREE.Scene,
  ): void {
    const beamLength = 30; // ความยาวของลำแสง
    const sourceHeight = 3; // ความสูงของ source model เหนือตัวละคร

    // สร้างโมเดลแหล่งกำเนิด (weapon4) ที่ลอยอยู่ใกล้ตัวละคร ก่อน
    const sourcePos = new THREE.Vector3(
      spawnPos.x,
      spawnPos.y + sourceHeight,
      spawnPos.z,
    );
    this.createSourceModel(sourcePos, scene);

    // เก็บ OnUpdate และ OnTouch ไว้ชั่วคราวก่อนแทนที่
    const savedOnUpdate = this.DisplayModel.OnUpdate;
    const savedOnTouch = this.DisplayModel.OnTouch;

    // ลบ DisplayModel เดิม (cube) ออกจาก scene ก่อนแทนที่
    if (this.DisplayModel.parent) {
      this.DisplayModel.parent.remove(this.DisplayModel);
      console.log('🗑️ Removed old DisplayModel (cube) from scene');
    }

    // สร้าง cylinder เป็นลำแสง
    const geometry = new THREE.CylinderGeometry(0.4, 0.4, beamLength, 16);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.8,
      emissive: 0x00ffff,
      emissiveIntensity: 2,
      metalness: 0.5,
      roughness: 0.2,
    });

    const beamMesh = new THREE.Mesh(geometry, material);

    // หมุน beam 90 องศาให้นอนในแกน Z
    beamMesh.rotation.x = Math.PI / 2;

    // วาง beam ให้ปลายด้านหนึ่งอยู่ที่ origin ของ sourceModel
    // beam ยาว 30, origin ตรงกลาง, ดังนั้นเลื่อนไป -15 ในแกน Z
    beamMesh.position.set(0, 0, -beamLength / 2);

    // แทนที่ DisplayModel เดิมด้วย beam
    this.DisplayModel = beamMesh as any;

    // กู้คืน OnUpdate และ OnTouch
    if (savedOnUpdate) {
      this.DisplayModel.OnUpdate = savedOnUpdate;
    }
    if (savedOnTouch) {
      this.DisplayModel.OnTouch = savedOnTouch;
    }

    // เพิ่ม properties สำหรับ collision detection
    (this.DisplayModel as any).IsProjectile = true;
    (this.DisplayModel as any).ProjectileType = 'Laser';

    // เพิ่มแสงรอบๆ ลำแสง
    const pointLight = new THREE.PointLight(0x00ffff, 8, 20);
    pointLight.position.set(0, 0, 0); // ตรงกลาง beam
    this.DisplayModel.add(pointLight);

    // เพิ่มเอฟเฟกต์เรืองแสงรอบนอก
    const glowGeometry = new THREE.CylinderGeometry(0.6, 0.6, beamLength, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.3,
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    glowMesh.name = 'BeamGlow';
    this.DisplayModel.add(glowMesh);

    console.log('✨ Glow mesh added to beam at position:', glowMesh.position);

    // สร้าง collision box ที่มองไม่เห็น (จะอยู่ใน scene โดยตรง ไม่ใช่ child)
    // เพื่อให้ระบบ collision detection เจอได้
    const collisionGeometry = new THREE.BoxGeometry(1, 1, beamLength); // กว้าง 1, สูง 1, ยาว 30
    const collisionMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0, // มองไม่เห็น (แต่ยังทำงานกับ collision)
      wireframe: true, // สำหรับ debug
    });
    this.collisionBox = new THREE.Mesh(collisionGeometry, collisionMaterial);
    this.collisionBox.name = 'LaserCollisionBox';

    // เพิ่ม properties สำหรับ collision detection
    (this.collisionBox as any).IsProjectile = true;
    (this.collisionBox as any).ProjectileType = 'Laser';
    (this.collisionBox as any).isPlayer = false; // ไม่ใช่ player!
    (this.collisionBox as any).IsEnemy = false; // ไม่ใช่ enemy!
    (this.collisionBox as any).width = 1;
    (this.collisionBox as any).height = 1;
    (this.collisionBox as any).depth = beamLength; // Add to scene directly (not as child)
    scene.add(this.collisionBox);

    // 🎯 สร้าง EntityHandler สำหรับ collision box เพื่อเข้าระบบ collision detection
    // const collisionEntity = new EntityHandler(this.collisionBox as any, false);
    // console.log('🎯 Collision box added to scene with EntityHandler');

    // เพิ่ม beam เข้าไปใน sourceModel เป็น child
    if (this.sourceModel) {
      this.sourceModel.add(this.DisplayModel);

      void playSoundEffect(SOUND_GROUPS.sfx.laser);

      // ⚡ CRITICAL: Force update matrix hierarchy หลังจาก add เป็น child
      // เพื่อให้ Three.js คำนวณ world matrix ใหม่ทันที
      this.sourceModel.updateMatrixWorld(true);
      this.DisplayModel.updateMatrixWorld(true);

      console.log('✅ Beam (Cylinder) added to sourceModel');
      console.log(
        '   Beam parent UUID:',
        this.DisplayModel.parent ? this.DisplayModel.parent.uuid : 'null',
      );
      console.log('   sourceModel UUID:', this.sourceModel.uuid);
      console.log('   UUIDs match:', this.DisplayModel.parent === this.sourceModel);

      // ทดสอบ world position (หลัง update matrix)
      const worldPos = this.DisplayModel.getWorldPosition(new THREE.Vector3());
      console.log('   Beam world position (after matrix update):', worldPos);
      console.log('   sourceModel position:', this.sourceModel.position);

      // หมุน sourceModel ไปหาศัตรูถ้ามี
      if (this.targetEnemy && this.targetEnemy.visible && !this.targetEnemy.IsDied) {
        this.sourceModel.lookAt(this.targetEnemy.position);
        console.log('🎯 Initial target lock to:', this.targetEnemy.position);
      }

      //* เพิ่ม debug arrow สีแดง
      // const arrowHelper = new THREE.ArrowHelper(
      //   new THREE.Vector3(0, 0, -1),
      //   new THREE.Vector3(0, 0, 0),
      //   30,
      //   0xff0000,
      //   3,
      //   2,
      // );
      // this.sourceModel.add(arrowHelper);

      console.log(
        '🔫 Laser created with sourceModel children:',
        this.sourceModel.children.length,
      );
      console.log('   Children details:');
      this.sourceModel.children.forEach((child, index) => {
        console.log(`   Child ${index}:`, {
          type: child.type,
          name: child.name,
          position: child.position,
          rotation: child.rotation,
          visible: child.visible,
        });
      });
      console.log('   Beam local position:', this.DisplayModel.position);
      console.log('   Beam rotation:', this.DisplayModel.rotation);
    } else {
      console.error('❌ sourceModel is null!');
    }
  }

  private createSourceModel(sourcePos: THREE.Vector3, scene: THREE.Scene): void {
    this.sourceModel = new THREE.Group();

    // วาง source model ใกล้ตัวละคร (ไม่เคลื่อนที่ตามศัตรู)
    this.sourceModel.position.copy(sourcePos);

    // ⚡ ย้ายจาก gameplay ไปเป็น sourceModel ที่ถูก add เข้า scene แทน
    scene.add(this.sourceModel);
    console.log('🔫 sourceModel added to scene at:', this.sourceModel.position);

    // โหลดโมเดล laser เพื่อเป็นแหล่งกำเนิดลำแสง
    ModelFileLoader({
      src: PUBLIC_ASSETS_LOCATION.model.weapon.laser,
      debugEnabled: false,
      scale: 0.75,
      parentObj: this.sourceModel,
    });
  }

  private updateLaser = (deltaTime: number = 0.016) => {
    if (!this.DisplayModel) {
      console.warn('⚠️ Laser: DisplayModel is null in updateLaser');
      return;
    }

    // ลด lifespan (ใช้ deltaTime จาก parameter แทน hardcode 0.016)
    if (this.lifespan > 0) {
      this.lifespan -= deltaTime;
      this.sweepTimer += deltaTime; // เพิ่มตัวนับเวลาสำหรับกวาด

      // Debug: แสดง lifespan ทุกๆ 0.5 วินาที
      if (Math.floor(this.lifespan * 2) !== Math.floor((this.lifespan + deltaTime) * 2)) {
        console.log(
          `⚡ Laser lifespan: ${this.lifespan.toFixed(2)}s / ${this.maxLifespan}s`,
        );
      }
    } else {
      this.isDestroyed = true;
      console.log('⚡ Laser lifespan expired - marking for destruction');
    }

    if (this.isDestroyed) {
      // ทำลายทั้งโมเดล beam, source model และ collision box พร้อมกัน
      console.log('🗑️ Destroying Laser - removing from scene');

      // ซ่อน DisplayModel และหยุดการทำงาน (ให้ระบบ cleanup ของ game loop ลบออก)
      if (this.DisplayModel) {
        this.DisplayModel.visible = false;
        this.DisplayModel.position.set(10000, 10000, 10000);
        this.DisplayModel.OnUpdate = undefined;
      }

      // ซ่อน source model
      if (this.sourceModel) {
        this.sourceModel.visible = false;
        this.sourceModel.position.set(10000, 10000, 10000);
      }

      // ซ่อน collision box
      if (this.collisionBox) {
        this.collisionBox.visible = false;
        this.collisionBox.position.set(10000, 10000, 10000);
        (this.collisionBox as any).OnTouch = undefined;
      }

      return;
    }

    // ระบบกวาดลำแสงไปยังศัตรูถัดไป
    if (this.sweepTimer >= this.sweepInterval && this.nearbyEnemies.length > 0) {
      this.sweepTimer = 0; // รีเซ็ตตัวนับ
      this.currentTargetIndex = (this.currentTargetIndex + 1) % this.nearbyEnemies.length;

      // เปลี่ยนเป้าหมายไปยังศัตรูตัวถัดไป
      const nextEnemy = this.nearbyEnemies[this.currentTargetIndex];
      if (nextEnemy && nextEnemy.visible && !nextEnemy.IsDied) {
        this.targetEnemy = nextEnemy;
        console.log(
          `⚡ Laser sweeping to enemy ${this.currentTargetIndex + 1}/${this.nearbyEnemies.length}`,
          'at position:',
          nextEnemy.position,
        );
      } else {
        console.log(`⚠️ Next enemy is dead or invisible, skipping...`);
      }
    }

    // อัพเดตเอฟเฟกต์ของลำแสง (DisplayModel)
    if (this.DisplayModel && this.sourceModel) {
      // ถ้ามีศัตรูเป้าหมาย ให้ sourceModel หมุนไปหาศัตรู (beam จะตามอัตโนมัติ)
      if (this.targetEnemy && this.targetEnemy.visible && !this.targetEnemy.IsDied) {
        const targetPos = this.targetEnemy.position.clone();

        // ค่อยๆ หมุน sourceModel (และ beam ที่เป็น child) ไปหาศัตรู
        // ใช้ quaternion slerp เพื่อให้หมุนแบบ smooth

        // คำนวณ quaternion ที่ต้องการโดยใช้ lookAt matrix
        const sourcePos = this.sourceModel.position.clone();

        // สร้าง matrix เพื่อหมุน sourceModel ให้แกน Z ชี้ไปหาศัตรู
        const matrix = new THREE.Matrix4();
        matrix.lookAt(sourcePos, targetPos, new THREE.Vector3(0, 1, 0));

        // แปลง matrix เป็น quaternion
        const targetQuaternion = new THREE.Quaternion();
        targetQuaternion.setFromRotationMatrix(matrix);

        // ค่อยๆ หมุนไปหาเป้าหมาย (sweep effect)
        this.sourceModel.quaternion.slerp(targetQuaternion, 0.1);
      }

      // ไม่ต้องหมุน beam เพิ่มเพราะ sourceModel จะหมุนไปกวาดเอง
      // beam (ArrowHelper) จะตาม sourceModel อัตโนมัติเพราะเป็น child

      // ปรับ opacity ตามเวลาที่เหลือ
      const lifeRatio = this.lifespan / this.maxLifespan;

      // Cast เป็น THREE.Mesh เพื่อเข้าถึง material
      const beamMesh = this.DisplayModel as THREE.Mesh;
      if (beamMesh.material) {
        const materials = Array.isArray(beamMesh.material)
          ? beamMesh.material
          : [beamMesh.material];

        materials.forEach((material: any) => {
          if (material && 'opacity' in material) {
            // ค่อยๆ จางหายในช่วง 40% สุดท้าย
            if (lifeRatio < 0.4) {
              material.opacity = (lifeRatio / 0.4) * 0.8;
            }
            material.needsUpdate = true;
          }
        });
      }
    }

    // ทำให้โมเดล source (laser source) ลอยขึ้นลง (ไม่หมุนรอบตัวเองเพราะกำลังหมุนไปหาศัตรู)
    if (this.sourceModel) {
      // เพิ่มเอฟเฟกต์ลอยขึ้นลง (เล็กน้อย) - รักษาตำแหน่ง X, Z ไว้
      const float = Math.sin(Date.now() * 0.003) * 0.1;
      const baseY = this.playerPosition.y + 4; // ความสูงพื้นฐาน
      this.sourceModel.position.y = baseY + float;

      // รักษาตำแหน่ง X, Z ให้อยู่ใกล้ตัวละคร
      this.sourceModel.position.x = this.playerPosition.x;
      this.sourceModel.position.z = this.playerPosition.z;
    }

    // 🎯 CRITICAL: Sync collision box position & rotation with beam's world transform
    if (this.collisionBox && this.DisplayModel) {
      // Get beam's world position
      const worldPos = new THREE.Vector3();
      this.DisplayModel.getWorldPosition(worldPos);
      this.collisionBox.position.copy(worldPos);

      // Get beam's world rotation
      const worldQuat = new THREE.Quaternion();
      this.DisplayModel.getWorldQuaternion(worldQuat);
      this.collisionBox.quaternion.copy(worldQuat);

      // Make sure collision box is visible for collision detection
      this.collisionBox.visible = this.DisplayModel.visible;
    }
  };

  OnTouch(target: Enemy): void {
    console.log('Laser collided with:', target);
  }
}

export { Laser };
