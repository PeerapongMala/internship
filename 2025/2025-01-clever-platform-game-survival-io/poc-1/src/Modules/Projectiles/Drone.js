import ProjectileHandler from "../../Classes/ProjectileHandler";
import * as THREE from "three"; // Ensure THREE is imported
import { Fireball } from "./Fireball";
import { useSkillStore } from "../../store/skillStore";

class Drone extends ProjectileHandler {
  constructor({
    spawnposition = { x: 0, y: 0, z: 0 },
    angle = 0,
    ProjectileOwner = window.PlayerCharacter,
    speed = 0.01,
    scene = null,
  } = {}) {
    console.log("subclass ", ProjectileOwner);
    super(spawnposition, "green", ProjectileOwner);
    this.damage = 5; // ปรับค่าความเสียหายตามต้องการ
    this.speed = speed; // ปรับค่าความเร็วให้หมุนคงที่
    this.angle = angle; // เก็บค่า angle
    this.scene = scene;
    let cooldown = 1;

    /*
    this.DisplayModel.OnTouch = function (TouchFrom) {
      if (TouchFrom.IsEnemy) {
        TouchFrom.IsDied = true;
        return;
      }
    };*/
    function findClosestEnemy(displayModel) {
      let closestEnemy = null;
      let closestDistance = 10;

      window.entities.forEach((entity) => {
        if (entity.EntityObject.IsEnemy && entity.EntityObject.visible) {
          // ตรวจสอบว่าศัตรูสามารถมองเห็นได้
          const distance = displayModel.position.distanceTo(
            entity.EntityObject.position
          );
          if (distance < closestDistance) {
            closestDistance = distance;
            closestEnemy = entity.EntityObject;
          }
        }
      });

      return closestEnemy;
    }

    this.DisplayModel.OnUpdate = () => {
      cooldown -= 0.005;
      if (findClosestEnemy(this.DisplayModel) && cooldown <= 0) {
        cooldown = 1;
        for (
          let index = 0;
          index < useSkillStore.getState().currentDroneLevel;
          index++
        ) {
          const newFireball = new Fireball({
            spawnposition: this.DisplayModel.position,
          });
          scene.add(newFireball.DisplayModel);
        }
      }

      if (ProjectileOwner && ProjectileOwner.position) {
        const radius = 10; // รัศมีการหมุน
        this.angle += this.speed; // ปรับมุมตามความเร็วที่กำหนดไว้
        this.DisplayModel.position.x =
          ProjectileOwner.position.x + radius * Math.cos(this.angle);
        this.DisplayModel.position.z =
          ProjectileOwner.position.z + radius * Math.sin(this.angle);
      } else {
        console.error("ProjectileOwner or its position is undefined.");
      }
    };
  }
}

export { Drone };
