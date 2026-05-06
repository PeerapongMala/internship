import * as THREE from 'three';

type Particle = {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  alive: boolean;
  age: number;
  maxAge: number;
  size: number;
  color: THREE.Color;
  rotation: number; // For texture rotation
  rotationSpeed: number;
};

export function CreateNewExplosionCake(
  position: THREE.Vector3,
  scene: THREE.Scene,
  textureImage: string,
) {
  const numParticles = 700;

  //  CHANGED: Removed pastel colors, we'll generate grayscale instead.

  const particles: Particle[] = [];
  for (let i = 0; i < numParticles; i++) {
    //  CHANGED: Generate a random grayscale color for smoke
    const grayValue = Math.random() * 0.4 + 0.3; // Random gray from 0.3 to 0.7
    const color = new THREE.Color().setScalar(grayValue);

    //  CHANGED: Removed heart shape, now it's a small random cluster
    const spread = Math.random() * 2.0;
    const angle = Math.random() * Math.PI * 2;
    const offsetX = Math.cos(angle) * spread;
    const offsetY = (Math.random() - 0.5) * spread * 0.5; // Make it a bit flat
    const offsetZ = Math.sin(angle) * spread;

    particles.push({
      position: new THREE.Vector3(
        position.x + offsetX,
        position.y + offsetY,
        position.z + offsetZ,
      ),
      //  CHANGED: Velocity is now a gentle upward puff
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.3,
        Math.random() * 0.8 + 0.4, // Primarily upward
        (Math.random() - 0.5) * 0.3,
      ),
      alive: true,
      age: 0,
      //  CHANGED: Longer lifetime for a slower dissipation
      maxAge: Math.random() * 1.0 + 0.5,
      //  CHANGED: Larger potential size
      size: Math.random() * 2.0 + 1.5,
      color: color.clone(),
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.4,
    });
  }

  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(numParticles * 3);
  const colors = new Float32Array(numParticles * 3);
  const sizes = new Float32Array(numParticles);
  const rotations = new Float32Array(numParticles); // For rotating texture

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  particleGeometry.setAttribute('rotation', new THREE.BufferAttribute(rotations, 1));

  //  CHANGED: Using a new smoke texture loader
  const smokeTexture = new THREE.TextureLoader().load(textureImage);

  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      pointTexture: { value: smokeTexture }, // ✨ CHANGED: Use smoke texture
    },
    vertexShader: `
            attribute float size;
            attribute float rotation;
            attribute vec3 color;
            varying vec3 vColor;
            varying float vRotation;
            void main() {
                vColor = color;
                vRotation = rotation;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
    fragmentShader: `
            uniform sampler2D pointTexture;
            varying vec3 vColor;
            varying float vRotation;
            void main() {
                // Rotate the texture coordinate
                float mid = 0.5;
                vec2 rotated = vec2(
                    cos(vRotation) * (gl_PointCoord.x - mid) - sin(vRotation) * (gl_PointCoord.y - mid) + mid,
                    sin(vRotation) * (gl_PointCoord.x - mid) + cos(vRotation) * (gl_PointCoord.y - mid) + mid
                );

                vec4 texColor = texture2D(pointTexture, rotated);
                
                // Use the alpha from the texture
                if (texColor.a < 0.1) discard;

                // Fade out over lifetime
                float opacity = texColor.a;

                gl_FragColor = vec4(vColor, opacity);
            }
        `,
    transparent: true,
    depthWrite: false,
    //  CHANGED: This is the MOST IMPORTANT change for smoke!
    blending: THREE.NormalBlending,
  });

  const particlePoints = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particlePoints);

  // This function can be removed if you use the TextureLoader
  // function createCircleTexture() { ... }

  let lastTime = performance.now();
  function animate() {
    const currentTime = performance.now();
    const delta = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    let aliveCount = 0;
    //  CHANGED: Gravity is now an upward buoyancy force
    const buoyancy = new THREE.Vector3(0, 0.5, 0);

    for (let i = 0; i < numParticles; i++) {
      const p = particles[i];
      if (!p.alive) continue;

      //  CHANGED: Slower damping for a more "floaty" feel
      p.velocity.multiplyScalar(0.98);
      p.velocity.addScaledVector(buoyancy, delta);
      // p.velocity.addScaledVector(wind, delta); // Uncomment for wind effect

      // Add some turbulence
      p.velocity.x += (Math.random() - 0.5) * 0.01;
      p.velocity.z += (Math.random() - 0.5) * 0.01;

      p.position.addScaledVector(p.velocity, delta);
      p.age += delta;
      p.rotation += p.rotationSpeed * delta;

      if (p.age > p.maxAge) {
        p.alive = false;
      } else {
        positions[aliveCount * 3] = p.position.x;
        positions[aliveCount * 3 + 1] = p.position.y;
        positions[aliveCount * 3 + 2] = p.position.z;

        //  CHANGED: Fade color to black (or a darker gray) over time
        const lifeRatio = p.age / p.maxAge;
        const fadedColor = p.color.clone().lerp(new THREE.Color(0x111111), lifeRatio);
        colors[aliveCount * 3] = fadedColor.r;
        colors[aliveCount * 3 + 1] = fadedColor.g;
        colors[aliveCount * 3 + 2] = fadedColor.b;

        //  CHANGED: Size grows over time and then fades
        const sizeModifier = Math.sin(lifeRatio * Math.PI); // Starts small, grows, then shrinks
        sizes[aliveCount] = p.size * sizeModifier;

        rotations[aliveCount] = p.rotation;

        aliveCount++;
      }
    }

    if (aliveCount === 0) {
      scene.remove(particlePoints);
      particleGeometry.dispose();
      particleMaterial.dispose();
      smokeTexture.dispose();
      return; // Stop the animation
    }

    particleGeometry.setDrawRange(0, aliveCount);
    particleGeometry.attributes.position.needsUpdate = true;
    particleGeometry.attributes.color.needsUpdate = true;
    particleGeometry.attributes.size.needsUpdate = true;
    particleGeometry.attributes.rotation.needsUpdate = true;

    requestAnimationFrame(animate);
  }

  animate();
}
