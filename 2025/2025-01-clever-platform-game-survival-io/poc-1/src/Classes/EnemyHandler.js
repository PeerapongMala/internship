import { useGameStore } from "../store/gameStore";
import { CollisionDetector } from "./CollisionHandler";
import { Cube } from "./CubeUltity";
import * as THREE from "three";

const deathSound = new Audio(
  "/public/minecraft-death-sound-made-with-Voicemod.mp3"
);

class EnemyHandler {
  static generateEnemy(scene, spawnPosition) {
    const enemy = new Cube({
      width: 1,
      height: 1,
      depth: 1,
      position: spawnPosition || {
        x: (Math.random() - 0.5) * 10,
        y: 0,
        z: -20,
      },
      velocity: {
        x: 0,
        y: 0,
        z: 0,
      },
      color: "red",
      zAcceleration: true,
      DoUseTexture: false,
    });

    enemy.IsEnemy = true;
    enemy.OnUpdate = function () {
      if (window.PlayerCharacter) {
        const playerPosition = window.PlayerCharacter.position;
        const enemyPosition = enemy.position;

        const direction = new THREE.Vector3()
          .subVectors(playerPosition, enemyPosition)
          .normalize();
        enemy.velocity.x = direction.x * 0.05;
        enemy.velocity.z = direction.z * 0.05;

        // Calculate the angle to rotate the enemy towards the player
        const angle = Math.atan2(direction.z, direction.x);

        enemy.EntityData.EntityObject.rotation.set(0, angle, 0); // Rotate only around the y-axis

        // Update the enemy position based on its velocity
        enemy.position.x += enemy.velocity.x;
        enemy.position.z += enemy.velocity.z;

        if (this.IsDied) {
          console.log("Oh no im ded");

          scene.remove(enemy);
          enemy.EntityData.OnEntityRemoved();
          deathSound.play();
        }
      }
    };

    enemy.OnTouch = function (TouchFrom) {
      if (window.entities.player === TouchFrom) {
        window.GameManager.gameOver = true;
        return;
      } else if (TouchFrom.IsFireball) {
        enemy.visible = false; // Hide the enemy on collision
        scene.remove(enemy);
        enemy.EntityData.OnEntityRemoved();
      }
    };

    enemy.castShadow = true;
    scene.add(enemy);

    return enemy;
  }

  static update(ground) {
    // Your logic here
  }
}

export default EnemyHandler;
