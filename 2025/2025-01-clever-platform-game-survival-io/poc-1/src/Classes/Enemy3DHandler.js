import * as THREE from "three";
import { loadFBXCharacter } from "./CharacterLoader";
import EntityHandler from "./EntityHandler";
import { CollisionDetector } from "./CollisionHandler";
import { useGameStore } from "../store/gameStore";

const deathSound = new Audio("audio/enemyDeath.mp3");

class Enemy3DHandler {
  constructor(scene, modelUrl) {
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

  addToPool() {
    loadFBXCharacter(this.modelUrl, this.scene, (loadedModel) => {
      loadedModel.scale.set(0.01, 0.01, 0.01);
      loadedModel.position.set(0, 0, 0); // Set initial position of the enemy
      loadedModel.castShadow = true;
      loadedModel.receiveShadow = true;
      loadedModel.IsEnemy = true;

      this.pool.push(loadedModel);
      // console.log(
      //   `Enemy added to the pool. Current pool size: ${this.pool.length}`
      // );
    });
  }

  generateEnemy(spawnPosition) {
    let enemyModel;
    if (this.pool.length > 0) {
      enemyModel = this.pool.pop();
      //console.log(
      //  `Using enemy from the pool. Remaining in pool: ${this.pool.length}`
      //);
      enemyModel.visible = true;
    } else {
      this.addToPool();
      //console.log("No enemies left in the pool. Creating a new one.");
      return;
    }

    if (enemyModel) {
      this.initializeEnemyModel(enemyModel, spawnPosition);
      this.enemies.push(enemyModel);
      this.scene.add(enemyModel);
      //console.log(
      //  `Enemy spawned. Total enemies in the scene: ${this.enemies.length}`
      //);
    }
  }

  initializeEnemyModel(enemyModel, spawnPosition) {
    enemyModel.position.set(spawnPosition.x, spawnPosition.y, spawnPosition.z);
    const Handler = this;
    enemyModel.OnUpdate = function () {
      if (enemyModel.EntityData.isDied) {
        const gameCurrentTimeMaxSet = useGameStore.getState().setExp;

        gameCurrentTimeMaxSet(10);
        this.visible = false;
        this.EntityData.OnEntityRemoved();
        deathSound.play();
        //console.log("Enemy died and removed from the scene.");
        Handler.enemies.splice(Handler.enemies.indexOf(enemyModel), 1);
        return; // Enemy is already dead, skip the update loop
      }

      if (window.PlayerCharacter) {
        const playerPosition = window.PlayerCharacter.position;
        const enemyPosition = this.position;

        const direction = new THREE.Vector3()
          .subVectors(playerPosition, enemyPosition)
          .normalize();
        this.position.x += direction.x * 0.05;
        this.position.z += direction.z * 0.05;

        // Calculate the angle to rotate the enemy towards the player
        const angle = Math.atan2(direction.z, direction.x);
        enemyModel.rotation.set(0, angle + Math.PI / 2, 0); // Rotate only around the y-axis

        this.boundingBox.setFromObject(this);
      }
    };

    enemyModel.OnTouch = (TouchFrom) => {
      if (TouchFrom.IsEnemy) {
        return;
      }
      if (!TouchFrom.isPlayer) {
        return;
      }
      window.playerEntityData.takeDamage(1);
    };

    enemyModel.boundingBox = new THREE.Box3().setFromObject(enemyModel);
    enemyModel.EntityData = new EntityHandler(enemyModel, true);
  }

  update() {
    this.enemies.forEach((enemy) => {
      if (enemy.visible && enemy.OnUpdate) {
        enemy.OnUpdate();
      }
    });
  }
}

export default Enemy3DHandler;
