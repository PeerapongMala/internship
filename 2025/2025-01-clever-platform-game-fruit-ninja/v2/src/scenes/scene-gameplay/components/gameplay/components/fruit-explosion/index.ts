import * as THREE from 'three';

type FireworkOptions = {
  color?: number; // hex
  count?: number;
  particleSize?: number;
  speed?: number;
  gravity?: number;
  lifetime?: number; // seconds
  rotationSpeed?: number;
};

const createFirework = (
  scene: THREE.Scene,
  pos: THREE.Vector3,
  opts: FireworkOptions = {},
) => {
  const {
    color = 0xffcc00,
    count = 18,
    particleSize = 0.25,
    speed = 0.2,
    gravity = -0.02,
    lifetime = 1.4,
    rotationSpeed = 0.06,
  } = opts;

  const group = new THREE.Group();
  group.position.copy(pos);

  // store particles and per-particle velocity & age
  const particles: {
    mesh: THREE.Mesh;
    velocity: THREE.Vector3;
    age: number;
  }[] = [];

  for (let i = 0; i < count; i++) {
    // small sphere for nicer look; can use Plane or InstancedMesh for perf
    const g = new THREE.SphereGeometry(particleSize, 6, 6);
    const m = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 1,
      depthWrite: false, // for additive-like blending
    });
    const mesh = new THREE.Mesh(g, m);

    // random direction: spherical distribution
    const dir = new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      Math.random() * 1.2,
      (Math.random() - 0.5) * 2,
    ).normalize();

    // random speed variance
    const sp = speed * (0.6 + Math.random() * 0.8);

    const velocity = dir.multiplyScalar(sp);

    // spread initial offset a little so they don't overlap exactly
    mesh.position.set(
      (Math.random() - 0.5) * 0.2,
      (Math.random() - 0.5) * 0.2,
      (Math.random() - 0.5) * 0.2,
    );

    group.add(mesh);
    particles.push({ mesh, velocity, age: 0 });
  }

  scene.add(group);

  const start = performance.now();
  const lifetimeMs = lifetime * 1000;

  const tick = () => {
    const now = performance.now();

    // update particles
    particles.forEach((p) => {
      // simple Euler integration
      p.velocity.y += gravity; // gravity (negative)
      p.mesh.position.add(p.velocity);

      // rotation
      p.mesh.rotation.x += rotationSpeed * (0.5 + Math.random());
      p.mesh.rotation.y += rotationSpeed * (0.5 + Math.random());

      // age
      p.age += 1 / 60; // approx per frame; not exact but fine for small lifetime

      // fade based on age
      const lifeRatio = Math.min(1, p.age / lifetime);
      const mat = p.mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 1 - lifeRatio * 1.1); // fade faster near end
    });

    // remove when oldest particle exceeded lifetime (approx)
    if (now - start >= lifetimeMs) {
      // cleanup
      particles.forEach((p) => {
        if (p.mesh.geometry) p.mesh.geometry.dispose();
        if (p.mesh.material) (p.mesh.material as THREE.Material).dispose();
      });
      scene.remove(group);
      return;
    }

    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

export default createFirework;
