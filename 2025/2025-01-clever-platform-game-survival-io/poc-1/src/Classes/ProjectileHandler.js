import { Cube } from "./CubeUltity";

class ProjectileHandler {
  constructor(
    position = {
      x: 0,
      y: 0,
      z: 0,
    },
    color = "orange", // เพิ่มพารามิเตอร์สี
    ProjectileOwner,
    customSize = {
      width: 1,
      height: 1,
      depth: 1,
    }
  ) {
    this.ProjectileOwner = ProjectileOwner;
    this.speed = 30;

    const NewCube = new Cube({
      width: customSize.width,
      height: customSize.height,
      depth: customSize.depth,
      position: position.spawnposition,
      velocity: {
        x: 0,
        y: 0,
        z: 0.005,
      },
      color: color, // ใช้พารามิเตอร์สีที่กำหนด
      zAcceleration: true,
      DoUseTexture: false,
    });

    NewCube.OnUpdate = function () {
      NewCube.position.z -= 0.1;
    };

    NewCube.OnTouch = function (TouchFrom) {
      // Placeholder for touch event handling
    };
    this.DisplayModel = NewCube;
    this.DisplayModel.castShadow = true;
    this.ProjectileFromPlayer = true;
  }
}

export default ProjectileHandler;
