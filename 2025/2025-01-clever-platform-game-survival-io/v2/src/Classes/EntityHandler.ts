import { CollisionDetector } from './CollisionHandler';
import * as THREE from 'three';
import { HealthBar } from './HealthBar';

// Declare entities on window for TypeScript. Use loose types to avoid circular declarations.
declare global {
  interface Window {
    entities: EntityHandler[];
    PlayerCharacter?: THREE.Group | THREE.Object3D;
    playerEntityData?: EntityHandler;
  }
}

export interface EntityData {
  isDied: boolean;
  OnEntityRemoved: () => void;
  takeDamage: (damage: number, force: boolean) => void;
}

// Local EntityObject type (keeps this file self-contained; mirrors declaration.d.ts)
// interface EntityObject extends THREE.Object3D {
export interface EntityObject extends THREE.Object3D {
  velocity?: THREE.Vector3;
  width?: number;
  height?: number;
  depth?: number;
  OnTouch?: (target: EntityObject) => void;
  OnUpdate?: (deltaTime: number) => void;
  isPlayer?: boolean;
  IsEnemy?: boolean;
  IsDied?: boolean;
  EntityData?: EntityData;
}

class EntityHandler {
  EntityObject: EntityObject;
  is3DModel: boolean;
  currentHP: number;
  maxHP: number;
  healthBar: HealthBar | null = null;
  right: number = 0;
  left: number = 0;
  top: number = 0;
  bottom: number = 0;
  front: number = 0;
  back: number = 0;
  velocity: THREE.Vector3;
  nextHitTime: number = 0;
  isDied: boolean = false;
  onEntityDied: () => void = () => {};

  constructor(EntityObject: EntityObject, is3DModel = false, maxHP: number = 10) {
    this.EntityObject = EntityObject;
    this.is3DModel = is3DModel; // ตรวจสอบว่าเป็นโมเดล 3D หรือไม่

    this.maxHP = maxHP;
    this.currentHP = maxHP;
    // Initialize Hitbox attributes
    this.updateBoundaries();

    this.velocity = EntityObject.velocity || new THREE.Vector3(0, 0, 0);

    if (window.entities === undefined) {
      window.entities = [];
    }
    window.entities.push(this);
  }

  updateBoundaries() {
    if (this.is3DModel) {
      // สำหรับโมเดล 3D ให้ใช้ขนาดที่มาจาก BoundingBox
      const boundingBox = new THREE.Box3().setFromObject(this.EntityObject);
      this.right = boundingBox.max.x;
      this.left = boundingBox.min.x;
      this.top = boundingBox.max.y;
      this.bottom = boundingBox.min.y;
      this.front = boundingBox.max.z;
      this.back = boundingBox.min.z;
    } else {
      // สำหรับกล่องแดงใช้ตำแหน่งและขนาดที่กำหนด
      this.right = this.EntityObject.position.x + (this.EntityObject.width ?? 0) / 2;
      this.left = this.EntityObject.position.x - (this.EntityObject.width ?? 0) / 2;
      this.bottom = this.EntityObject.position.y - (this.EntityObject.height ?? 0) / 2;
      this.top = this.EntityObject.position.y + (this.EntityObject.height ?? 0) / 2;
      this.front = this.EntityObject.position.z + (this.EntityObject.depth ?? 0) / 2;
      this.back = this.EntityObject.position.z - (this.EntityObject.depth ?? 0) / 2;
    }
  }

  static update(deltaTime: number = 0) {
    window.entities = window.entities.filter((entity) => entity.EntityObject.visible); // Remove entities that are not visible

    window.entities.forEach((entity) => {
      entity.updateBoundaries(); // Update boundaries before checking collisions

      entity.velocity = entity.EntityObject.velocity ?? new THREE.Vector3(0, 0, 0);

      // Checking for each collision
      window.entities.forEach((targetEntity) => {
        if (
          targetEntity !== entity &&
          entity.EntityObject.visible &&
          targetEntity.EntityObject.visible
        ) {
          const collisionResult = CollisionDetector.boxCollision({
            box1: targetEntity,
            box2: entity,
          });

          if (collisionResult) {
            entity.EntityObject.OnTouch?.(targetEntity.EntityObject);
          }
        }
      });

      if (entity.EntityObject.OnUpdate) {
        entity.EntityObject.OnUpdate(deltaTime);
      }
    });
  }

  OnEntityRemoved() {
    const indexnum = window.entities.indexOf(this);
    if (indexnum > -1) {
      window.entities.splice(indexnum, 1);
    }
  }

  takeDamage(damageAmount: number, forceDamage: boolean) {
    if (performance.now() > this.nextHitTime || forceDamage) {
      if (this.EntityObject.isPlayer) {
        console.log('Player taking 1 damage');
      } else {
        console.log('Entity taking ' + damageAmount + ' damage');
      }
      this.currentHP -= damageAmount;
      this.nextHitTime = performance.now() + (this.EntityObject.isPlayer ? 1000 : 300);

      // อัพเดท health bar
      if (this.healthBar) {
        this.healthBar.updateHealth(this.currentHP);
      }
    }

    if (this.currentHP <= 0) {
      this.isDied = true;
      this.onEntityDied();
    }
  }

  /**
   * สร้าง Health Bar สำหรับ Entity นี้
   */
  createHealthBar(
    scene: THREE.Scene,
    options?: {
      width?: number;
      height?: number;
      offsetY?: number;
    },
  ): void {
    // ถ้ามี health bar อยู่แล้วให้ทำลายก่อน
    if (this.healthBar) {
      this.healthBar.dispose();
    }

    // สร้าง health bar ใหม่
    this.healthBar = new HealthBar(this.maxHP, {
      width: options?.width || (this.EntityObject.isPlayer ? 2 : 1.5),
      height: options?.height || 0.2,
      offsetY: options?.offsetY || (this.EntityObject.isPlayer ? 3.5 : 2.5),
      foregroundColor: this.EntityObject.isPlayer ? 0x00ff00 : 0xff6600,
    });

    // เพิ่มเข้า scene
    scene.add(this.healthBar.getObject());

    // อัพเดทตำแหน่งเริ่มต้น
    this.healthBar.updatePosition(this.EntityObject.position);
  }

  /**
   * อัพเดท Health Bar ให้หันหน้าไปทางกล้อง
   */
  updateHealthBar(camera: THREE.Camera): void {
    if (this.healthBar && !this.isDied) {
      this.healthBar.updatePosition(this.EntityObject.position);
      this.healthBar.lookAtCamera(camera);
    }
  }

  /**
   * ลบ Health Bar
   */
  removeHealthBar(): void {
    if (this.healthBar) {
      this.healthBar.dispose();
      this.healthBar = null;
    }
  }
}

export default EntityHandler;
