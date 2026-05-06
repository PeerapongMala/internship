import * as THREE from 'three';
import { LoadedCharacter } from './CharacterLoader';
import EntityHandler, { EntityObject } from './EntityHandler';
import { useGameStore } from '@/store/gameStore';
import { ModelFileLoader } from '@core-utils/3d/model-file-loader';
import { playSoundEffect } from '@/utils/core-utils/sound';
import { SOUND_GROUPS } from '@/assets/public-sound';

interface TouchableEntity {
  IsEnemy?: boolean;
  isPlayer?: boolean;
}

interface SpawnPosition {
  x: number;
  y: number;
  z: number;
}

interface EnemyModel extends LoadedCharacter, EntityObject {
  scale: THREE.Vector3;
  position: THREE.Vector3;
  castShadow: boolean;
  receiveShadow: boolean;
  IsEnemy: boolean;
  visible: boolean;
  EntityData: EntityHandler; // แก้จาก EntityData เป็น EntityHandler
  OnUpdate?: (deltaTime: number) => void;
  OnTouch?: (TouchFrom: TouchableEntity) => void;
  boundingBox: THREE.Box3;
  rotation: THREE.Euler;
  velocity?: THREE.Vector3;
  isObject3D: true;
  isGroup: true;
  lastDamageTime?: number; // เวลาที่ให้ damage ครั้งล่าสุด
}

// const deathSound = new Audio('audio/enemyDeath.mp3');

class Enemy3DHandler {
  private scene: THREE.Scene;
  private modelUrl: string;
  private enemies: EnemyModel[];
  private pool: EnemyModel[];
  public loaded: boolean = false;
  constructor(scene: THREE.Scene, modelUrl: string) {
    this.scene = scene;
    this.modelUrl = modelUrl;
    this.enemies = [];
    this.pool = []; // Object Pool สำหรับจัดการศัตรู 3D

    // สร้างศัตรูเริ่มต้นใน pool จำนวน 20 ตัว
    for (let i = 0; i < 20; i++) {
      this.addToPool();
      if (i === 19) {
        this.loaded = true;
      }
    }
  }

  addToPool(): void {
    ModelFileLoader({
      src: this.modelUrl,
      debugEnabled: true,
      scale: 0.05,
      onLoadComplete: (loadedModel) => {
        const enemyModel = loadedModel as EnemyModel;
        // enemyModel.scale.set(0.1, 0.1, 0.1);
        // enemyModel.castShadow = true;
        // enemyModel.receiveShadow = true;
        enemyModel.IsEnemy = true;

        this.pool.push(enemyModel);
      },
    });
    // loadFBXCharacter(this.modelUrl, this.scene, (loadedModel: LoadedCharacter) => {
    //   const enemyModel = loadedModel as EnemyModel;
    //   enemyModel.scale.set(0.01, 0.01, 0.01);
    //   enemyModel.position.set(0, 0, 0); // Set initial position of the enemy
    //   enemyModel.castShadow = true;
    //   enemyModel.receiveShadow = true;
    //   enemyModel.IsEnemy = true;

    //   this.pool.push(enemyModel);
    // });
  }

  generateEnemy(spawnPosition: SpawnPosition): void {
    let enemyModel: EnemyModel | undefined;
    if (this.pool.length > 0) {
      enemyModel = this.pool.pop();
      if (enemyModel) {
        enemyModel.visible = true;
      }
    } else {
      this.addToPool();
      return;
    }

    if (enemyModel) {
      this.initializeEnemyModel(enemyModel, spawnPosition);
      this.enemies.push(enemyModel);
      this.scene.add(enemyModel);
    }
  }

  public getEnemies(): EnemyModel[] {
    return this.enemies;
  }

  private initializeEnemyModel(
    enemyModel: EnemyModel,
    spawnPosition: SpawnPosition,
  ): void {
    enemyModel.position.set(spawnPosition.x, spawnPosition.y, spawnPosition.z);
    enemyModel.lastDamageTime = 0; // รีเซ็ตเวลา damage เมื่อสร้างศัตรูใหม่
    const Handler = this;
    enemyModel.OnUpdate = function (this: EnemyModel, deltaTime: number = 0.016): void {
      if (enemyModel.EntityData.isDied) {
        const gameStore = useGameStore.getState();
        if ('setExp' in gameStore) {
          (gameStore.setExp as (exp: number) => void)(10);
        }
        this.visible = false;
        this.EntityData.OnEntityRemoved();
        // ลบ health bar ก่อนทำลายศัตรู
        enemyModel.EntityData.removeHealthBar();
        // deathSound.play();
        void playSoundEffect(SOUND_GROUPS.sfx.enemy_die);
        Handler.enemies.splice(Handler.enemies.indexOf(enemyModel), 1);
        return; // Enemy is already dead, skip the update loop
      }

      if (window.PlayerCharacter) {
        const playerPosition = window.PlayerCharacter.position;
        const enemyPosition = this.position;

        // คำนวณทิศทางในพื้นที่ 3 มิติ (รวมแกน Y สำหรับการเคลื่อนที่ในอวกาศ)
        const direction = new THREE.Vector3()
          .subVectors(playerPosition, enemyPosition)
          .normalize();

        // ความเร็วการเคลื่อนที่ของศัตรู (ใช้ deltaTime สำหรับ frame-independent movement)
        const moveSpeed = 1.875 * deltaTime; // 0.03 / 0.016 = 1.875

        // เคลื่อนที่ในทุกแกน (X, Y, Z) เพื่อติดตามผู้เล่นในอวกาศ
        this.position.x += direction.x * moveSpeed;
        this.position.y += direction.y * moveSpeed; // เพิ่มการเคลื่อนที่แนวตั้ง
        this.position.z += direction.z * moveSpeed;

        // คำนวณการหมุนแบบ lookAt ให้ศัตรูหันหน้าไปยังผู้เล่นอย่างถูกต้อง
        // ใช้ THREE.Object3D.lookAt() ซึ่งจะคำนวณการหมุนให้ถูกต้องโดยอัตโนมัติ
        enemyModel.lookAt(playerPosition);

        // หรือถ้าต้องการปรับแต่งการหมุนเพิ่มเติม สามารถเพิ่มการหมุนชดเชยได้
        // เช่น ถ้าโมเดลไม่ได้หันหน้าไปข้างหน้าตามค่าเริ่มต้น
        // enemyModel.rotateY(Math.PI); // หมุน 180 องศาถ้าโมเดลหันหลัง

        this.boundingBox.setFromObject(this);
      }
    };

    enemyModel.OnTouch = (TouchFrom: TouchableEntity): void => {
      if (!TouchFrom.isPlayer) {
        return;
      }

      // ตรวจสอบดีเลย์การรับ damage (1 วินาที)
      const currentTime = Date.now();
      const damageCooldown = 1000; // 1000ms = 1 วินาที

      if (
        enemyModel.lastDamageTime &&
        currentTime - enemyModel.lastDamageTime < damageCooldown
      ) {
        return; // ยังไม่ถึงเวลาให้ damage อีกครั้ง
      }

      // บันทึกเวลาที่ให้ damage
      enemyModel.lastDamageTime = currentTime;

      // เล่นเสียง explosion เมื่อศัตรูสัมผัสผู้เล่น
      void playSoundEffect(SOUND_GROUPS.sfx.enemy_die);
      window.playerEntityData?.takeDamage(20, true);

      // ทำให้ศัตรูระเบิดพลีชีพและหายไป
      enemyModel.visible = false;
      enemyModel.EntityData.OnEntityRemoved();
      enemyModel.EntityData.removeHealthBar();
      Handler.enemies.splice(Handler.enemies.indexOf(enemyModel), 1);
    };

    enemyModel.boundingBox = new THREE.Box3().setFromObject(enemyModel);
    enemyModel.EntityData = new EntityHandler(enemyModel, true, 10); // Enemy มี HP 10

    // 🩸 สร้าง Health Bar สำหรับศัตรู
    enemyModel.EntityData.createHealthBar(this.scene, {
      width: 1.5,
      height: 0.2,
      offsetY: 2.5,
    });
  }

  update(deltaTime: number = 0): void {
    this.enemies.forEach((enemy) => {
      if (enemy.visible && enemy.OnUpdate) {
        enemy.OnUpdate(deltaTime);
      }
    });
  }
}

export default Enemy3DHandler;
