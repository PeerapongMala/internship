import * as THREE from "three";

function CreateNewExplosion(position: THREE.Vector3, scene: THREE.Scene) {
  const particleGeometry = new THREE.BufferGeometry(); // Fixed: Changed Geometry to BufferGeometry
  const particleMaterial = new THREE.PointsMaterial({
    color: 0xff0000, // Change the color as needed
    size: 0.1, // Adjust the size of the particles
  });

  const numParticles = 100; // Adjust the number of particles as needed
  const particlePositions = new Float32Array(numParticles * 3);
  const particleVelocities = new Float32Array(numParticles * 3);
  for (let i = 0; i < numParticles; i++) {
    const index = i * 3;
    particlePositions[index] = position.x + Math.random() * 2 - 1;
    particlePositions[index + 1] = position.y + Math.random() * 2 - 1;
    particlePositions[index + 2] = position.z + Math.random() * 2 - 1;

    particleVelocities[index] = Math.random() * 10 - 5;
    particleVelocities[index + 1] = Math.random() * 10 + 5;
    particleVelocities[index + 2] = Math.random() * 10 - 5;
  }

  const particles = new THREE.Points(
    new THREE.BufferGeometry().setFromPoints(
      Array.from({ length: numParticles }, (_, i) =>
        new THREE.Vector3().fromArray(particlePositions, i * 3)
      )
    ),
    particleMaterial
  );
  scene.add(particles);

  const updateParticles = () => {
    for (let i = 0; i < numParticles; i++) {
      const index = i * 3;
      particlePositions[index] += particleVelocities[index];
      particlePositions[index + 1] += particleVelocities[index + 1];
      particlePositions[index + 2] += particleVelocities[index + 2];

      // Remove the particle if it's too far away
      if (
        new THREE.Vector3()
          .fromArray(particlePositions, index)
          .distanceTo(position) > 10
      ) {
        particlePositions.copyWithin(index, index + 3, numParticles * 3);
        particleVelocities.copyWithin(index, index + 3, numParticles * 3);
        //numParticles--;
        i--;
      }
    }

    particles.geometry.attributes.position.array.set(particlePositions);
    particles.geometry.attributes.position.needsUpdate = true;
  };

  const animate = () => {
    requestAnimationFrame(animate);
    updateParticles();
  };

  animate();
}
