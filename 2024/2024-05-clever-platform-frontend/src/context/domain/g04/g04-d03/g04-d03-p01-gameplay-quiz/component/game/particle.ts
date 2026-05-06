import * as THREE from 'three';

// Define TypeScript interface for userData
interface ParticleData {
  type: string;
  velocity: THREE.Vector3;
  rotationSpeed: number;
  expansion: number;
  fadeRate: number;
  life: number;
  initialScale: number;
  gravity: number;
}

// Enhanced Particle System class for realistic explosions
export default class ParticleSystem {
  particles: THREE.Sprite[] = [];
  scene: THREE.Scene;
  textures: THREE.Texture[] = [];
  particleCount: number;
  clock: THREE.Clock;
  emitterPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  active: boolean = false;

  constructor(
    scene: THREE.Scene,
    texturePaths: string | string[],
    particleCount: number = 50,
  ) {
    this.scene = scene;
    this.particleCount = particleCount;
    this.clock = new THREE.Clock();

    // Load multiple textures for variety
    const textureLoader = new THREE.TextureLoader();
    if (Array.isArray(texturePaths)) {
      texturePaths.forEach((path) => {
        this.textures.push(textureLoader.load(path));
      });
    } else {
      this.textures.push(textureLoader.load(texturePaths));
    }
  }

  setPosition(x: number, y: number, z: number) {
    this.emitterPosition.set(x, y, z);
  }

  create() {
    // Clear any existing particles
    this.dispose();
    this.active = true;

    // Create particle groups with different behaviors
    this.createExplosionCore();
    this.createExplosionSmoke();
    this.createExplosionSparks();
    this.createExplosionDebris();
  }

  createExplosionCore() {
    const coreCount = Math.floor(this.particleCount * 0.25);
    const texture = this.textures[0];

    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xffaa55,
    });

    for (let i = 0; i < coreCount; i++) {
      const sprite = new THREE.Sprite(spriteMaterial.clone());

      // Position slightly offset from center
      const offset = 0.5;
      sprite.position.set(
        this.emitterPosition.x + (Math.random() - 0.5) * offset,
        this.emitterPosition.y + (Math.random() - 0.5) * offset,
        this.emitterPosition.z + (Math.random() - 0.5) * offset,
      );

      // Larger scale for the core
      const scale = 3 + Math.random() * 5;
      sprite.scale.set(scale, scale, 1);

      // Particle properties
      sprite.userData = {
        type: 'core',
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3,
        ),
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        expansion: 0.05 + Math.random() * 0.05,
        fadeRate: 0.01 + Math.random() * 0.002,
        life: 1.0,
        initialScale: scale,
        gravity: 0.001,
      } as ParticleData;

      this.particles.push(sprite);
      this.scene.add(sprite);
    }
  }

  createExplosionSmoke() {
    const smokeCount = Math.floor(this.particleCount * 0.35);
    const texture = this.textures[0];

    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.2,
      color: 0x888888,
    });

    for (let i = 0; i < smokeCount; i++) {
      const sprite = new THREE.Sprite(spriteMaterial.clone());

      // Position with wider spread
      sprite.position.set(
        this.emitterPosition.x + (Math.random() - 0.5) * 2,
        this.emitterPosition.y + (Math.random() - 0.5) * 2,
        this.emitterPosition.z + (Math.random() - 0.5) * 2,
      );

      // Larger, varied scale
      const scale = 2 + Math.random() * 4;
      sprite.scale.set(scale, scale, 1);

      // Random initial opacity
      sprite.material.opacity = 0.3 + Math.random() * 0.4;

      // Particle properties
      sprite.userData = {
        type: 'smoke',
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.15,
          (Math.random() - 0.5) * 0.15 + 0.05, // Slight upward bias
          (Math.random() - 0.5) * 0.15,
        ),
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        expansion: 0.02 + Math.random() * 0.3,
        fadeRate: 0.005 + Math.random() * 0.005,
        life: 1.0,
        initialScale: scale,
        gravity: 0.0005,
      };

      this.particles.push(sprite);
      this.scene.add(sprite);
    }
  }

  createExplosionSparks() {
    const sparkCount = Math.floor(this.particleCount * 0.3);
    const texture = this.textures[0];

    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xffffaa,
    });

    for (let i = 0; i < sparkCount; i++) {
      const sprite = new THREE.Sprite(spriteMaterial.clone());

      // Position near center
      sprite.position.set(
        this.emitterPosition.x + (Math.random() - 0.5) * 2,
        this.emitterPosition.y + (Math.random() - 0.5) * 1,
        this.emitterPosition.z + (Math.random() - 0.5) * 1,
      );

      // Small scale for sparks
      const scale = 0.5 + Math.random() * 1.5;
      sprite.scale.set(scale, scale, 1);

      // Random direction with higher velocity
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.2 + Math.random() * 0.4;

      // Particle properties
      sprite.userData = {
        type: 'spark',
        velocity: new THREE.Vector3(
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          (Math.random() - 0.5) * speed,
        ),
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        expansion: -0.01, // Sparks get smaller
        fadeRate: 0.01 + Math.random() * 0.02,
        life: 1.0,
        initialScale: scale,
        gravity: 0.003,
      };

      this.particles.push(sprite);
      this.scene.add(sprite);
    }
  }

  createExplosionDebris() {
    const debrisCount = Math.floor(this.particleCount * 0.1);
    const texture = this.textures[0];

    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.19,
      color: 0x555555,
    });

    for (let i = 0; i < debrisCount; i++) {
      const sprite = new THREE.Sprite(spriteMaterial.clone());

      // Position near center
      sprite.position.set(
        this.emitterPosition.x + (Math.random() - 0.5) * 2.5,
        this.emitterPosition.y + (Math.random() - 0.5) * 0.5,
        this.emitterPosition.z + (Math.random() - 0.5) * 0.5,
      );

      // Small scale for debris
      const scale = 0.3 + Math.random() * 0.7;
      sprite.scale.set(scale, scale, 1);

      // Random direction with higher velocity
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.3 + Math.random() * 0.5;

      // Particle properties
      sprite.userData = {
        type: 'debris',
        velocity: new THREE.Vector3(
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          (Math.random() - 0.5) * speed,
        ),
        rotationSpeed: Math.random() * 0.2,
        expansion: -0.005,
        fadeRate: 0.005 + Math.random() * 0.001,
        life: 1.0,
        initialScale: scale,
        gravity: 0.005,
      };

      this.particles.push(sprite);
      this.scene.add(sprite);
    }
  }

  update() {
    if (!this.active) return;

    const deltaTime = this.clock.getDelta();
    const particlesToRemove: THREE.Sprite[] = [];

    this.particles.forEach((particle) => {
      const userData = particle.userData;

      // Apply velocity
      particle.position.x += userData.velocity.x;
      particle.position.y += userData.velocity.y;
      particle.position.z += userData.velocity.z;

      // Apply gravity
      userData.velocity.y -= userData.gravity;

      // Apply rotation
      particle.material.rotation += userData.rotationSpeed;

      // Apply scale/expansion
      if (userData.type === 'core' || userData.type === 'smoke') {
        const newScale = particle.scale.x + userData.expansion;
        particle.scale.set(newScale, newScale, 1);
      } else {
        const newScale = particle.scale.x * (1 + userData.expansion);
        particle.scale.set(newScale, newScale, 1);
      }

      // Apply fade
      particle.material.opacity -= userData.fadeRate;

      // Update life
      userData.life -= deltaTime;

      // Color transitions for core particles
      // if (userData.type === 'core') {
      //   const progress = 1 - userData.life;
      //   if (progress < 0.3) {
      //     particle.material.color.setHex(0xffaa55); // Orange
      //   } else if (progress < 0.6) {
      //     particle.material.color.setHex(0xff5500); // Red-orange
      //   } else {
      //     particle.material.color.setHex(0x551111); // Dark red
      //   }
      // }

      // Remove dead particles
      if (particle.material.opacity <= 0 || userData.life <= 0) {
        particlesToRemove.push(particle);
      }

      // Apply drag/air resistance
      userData.velocity.x *= 0.98;
      userData.velocity.y *= 0.98;
      userData.velocity.z *= 0.98;
    });

    // Remove dead particles
    particlesToRemove.forEach((particle) => {
      this.scene.remove(particle);
      const index = this.particles.indexOf(particle);
      if (index > -1) {
        this.particles.splice(index, 1);
      }

      if (particle.material) {
        if (particle.material.map) {
          particle.material.map.dispose();
        }
        particle.material.dispose();
      }
    });

    // If all particles are gone, mark system as inactive
    if (this.particles.length === 0) {
      this.active = false;
    }
  }

  dispose() {
    this.particles.forEach((particle) => {
      this.scene.remove(particle);
      if (particle.material) {
        if (particle.material.map) {
          particle.material.map.dispose();
        }
        particle.material.dispose();
      }
    });
    this.particles = [];
    this.active = false;
  }
}
