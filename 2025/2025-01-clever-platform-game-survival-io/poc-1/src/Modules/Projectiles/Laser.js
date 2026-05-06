import ProjectileHandler from "../../Classes/ProjectileHandler";
import * as THREE from "three";

class Laser extends ProjectileHandler {
  constructor(
    spawnposition = {
      x: 0,
      y: 0,
      z: 0,
    }
  ) {
    super(spawnposition, "red", null, {
      width: 0.2,
      height: 30,
      depth: 0.2,
    });
    this.damage = 10;
    this.speed = 10;
    this.target = null;

    let lifespan = 1;
    const displayModel = this.DisplayModel;
    this.DisplayModel.OnTouch = function (TouchFrom) {
      if (TouchFrom.IsEnemy && TouchFrom.visible) {
        // ตรวจสอบว่าศัตรูสามารถมองเห็นได้
        TouchFrom.IsDied = true;
        //this.isDestroyed = true;
        return;
      }
    }.bind(this);

    this.DisplayModel.OnUpdate = function () {
      if (lifespan > 0) {
        lifespan -= 0.01;
      } else {
        this.isDestroyed = true;
      }
      if (this.isDestroyed) {
        displayModel.visible = false;
        displayModel.position.set(10000, 10000, 10000); // ย้ายออกจากหน้าจอ
        return;
      }
      displayModel.material.opacity -= 0.1;

      displayModel.material.needsUpdate = true;
      displayModel.scale.set(
        displayModel.scale.x + 0.1,
        1,
        displayModel.scale.z + 0.1
      );
      /*
      this.DisplayModel.scale.set(
        this.DisplayModel.scale.x * 1.1,
        this.DisplayModel.scale.y * 1.1,
        this.DisplayModel.scale.z * 1.1
      );*/
    };
    //this.DisplayModel.scale.set(2, 2, 2);
  }
  OnTouch(target) {
    console.log("Laser collided with:", target);
  }
}

export { Laser };
