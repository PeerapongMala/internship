import * as THREE from 'three';

class Explosion {
  scene: THREE.Scene;
  position: THREE.Vector3;
  geometry: THREE.BufferGeometry;
  material: THREE.PointsMaterial | undefined;
  maxParticles: number;
  particles: THREE.Points;
  opacity: number;

  constructor(scene: THREE.Scene, position: THREE.Vector3) {
    this.scene = scene;
    this.position = position;
    const geometry = new THREE.BufferGeometry();
    this.geometry = geometry;
    let currentOpacity = 1;
    const material = new THREE.PointsMaterial({
      color: 0xffff00, // Change the color from red (0xff0000) to yellow (0xffff00)
      size: 0.1, // Adjust the size as needed
      transparent: true,
      opacity: 1,
    });

    const maxParticles = 1000;
    this.maxParticles = maxParticles; // Adjust the number of particles as needed
    this.particles = new THREE.Points(this.geometry, material);
    this.particles.position.copy(this.position);
    this.scene.add(this.particles);

    this.opacity = 1;
    this.initParticles();

    function render() {
      for (let i = 0; i < maxParticles; i++) {
        const forces = new THREE.Vector3();
        const randomForce = new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5,
        ).normalize();

        forces.add(randomForce.multiplyScalar(0.7)); // Adjust the force strength as needed

        geometry.attributes.position.array[i * 3] += forces.x;
        geometry.attributes.position.array[i * 3 + 1] += forces.y;
        geometry.attributes.position.array[i * 3 + 2] += forces.z;
      }

      geometry.attributes.position.needsUpdate = true;

      currentOpacity -= 0.005; // Adjust the opacity decay rate as needed
      material.opacity = currentOpacity;

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }
  initParticles() {
    const positions = new Float32Array(this.maxParticles * 3);
    for (let i = 0; i < this.maxParticles; i++) {
      const x = Math.random() - 0.5;
      const y = Math.random() - 0.5;
      const z = Math.random() - 0.5;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.computeBoundingSphere();
  }
}

export { Explosion };
