import * as THREE from "three";
import particleFire from "three-particle-fire";
particleFire.install({ THREE: THREE });

class FireEffect {
  scene: THREE.Scene;
  position: THREE.Vector3;
  geometry: THREE.BufferGeometry;
  material: THREE.PointsMaterial;
  maxParticles: number;
  particles: THREE.Points;
  opacity: number;

  constructor(scene: THREE.Scene, position: THREE.Vector3) {
    this.scene = scene;
    this.position = position;

    var geometry1 = new particleFire.Geometry(0.5, 1, 250);
    var material1 = new particleFire.Material({ color: 0x22ff00 });
    //material1.setPerspective(camera.fov, height);
    var particleFireMesh1 = new THREE.Points(geometry1, material1);
    //particleFireMesh1;
    particleFireMesh1.translateY(5);
    console.log("Adding to scene");
    this.scene.add(particleFireMesh1);

    function render() {
      particleFireMesh1.material.needsUpdate = true;

      //particleFireMesh0.material.update(0.01);
      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }
  initParticles() {}
}

export { FireEffect };
