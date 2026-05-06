import ProjectileHandler from "../../Classes/ProjectileHandler";
import * as THREE from "three";
import { Explosion } from "../../context/gamePage/components/explosion";
import { getParticleSystem } from "../../Utilities/getParticleSystem";

class Molotov extends ProjectileHandler {
  constructor(
    args = {
      spawnposition: {
        x: 0,
        y: 0,
        z: 0,
      },
      scene: null,
      camera: null,
    }
  ) {
    super({ spawnposition: args.spawnposition }, "red", null, {
      width: 5,
      height: 1,
      depth: 5,
    });
    this.damage = 10;

    this.scene = args.scene;
    this.camera = args.camera;

    this.decayTime = performance.now() + 3000;
    this.DisplayModel.OnTouch = function (TouchFrom) {
      if (
        TouchFrom.IsEnemy &&
        TouchFrom.visible &&
        !performance.now() > this.decayTime
      ) {
        // ตรวจสอบว่าศัตรูสามารถมองเห็นได้
        TouchFrom.EntityData.takeDamage(1);
        return;
      }
    }.bind(this);

    this.DisplayModel.OnUpdate = this.updateMolotov.bind(this);

    const fireEffect = getParticleSystem({
      camera: args.camera,
      emitter: this.DisplayModel,
      parent: args.scene,
      rate: 150,
      texture: "image/fire.png",
    });

    this.fireEffect = fireEffect;
  }
  OnTouch(target) {
    console.log("RPG collided with:", target);
  }

  updateMolotov() {
    if (performance.now() > this.decayTime) {
      this.fireEffect.destroy();
      return;
    }
    this.scene.remove(this.DisplayModel);
    this.fireEffect.update(0.016);
  }
}

export { Molotov };
