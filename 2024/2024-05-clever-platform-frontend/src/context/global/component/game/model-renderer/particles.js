import * as THREE from 'three';
import init, { ParticleSystem as WasmParticleSystem } from './WASM/particle';

// Initialize the WASM module
let wasmModule;
let wasmParticleSystem;

// Initialize the WASM module
const initWasm = async () => {
  try {
    wasmModule = await init();
    console.log('WASM particles module initialized');
    return true;
  } catch (error) {
    console.error('Failed to initialize WASM module:', error);
    return false;
  }
};

// Enhanced ParticleSystem class that uses Rust WASM
class ParticleSystem {
  particles = [];
  scene;
  texture = null;
  particleCount;
  clock;
  emitterPosition = new THREE.Vector3(0, 0, 0);
  active = false;
  particleGroups = {};

  // Sprite sheet properties
  spriteSheetWidth = 4;
  spriteSheetHeight = 7;
  currentFrame = 0;
  totalFrames = 28;
  animationSpeed = 0.1;
  lastFrameUpdate = 0;

  // Environmental settings
  gravity = 0.05;
  windX = 0.01;
  windZ = 0.005;

  // Global fade settings
  globalFadeActive = false;
  globalFadeStartTime = 0;
  globalFadeDuration = 5000; // 5 seconds fade out by default
  globalFadeIntensity = 1.0;

  constructor(
    scene,
    texturePaths,
    particleCount = 200,
    spriteSheetWidth = 4,
    spriteSheetHeight = 7,
  ) {
    this.scene = scene;
    this.particleCount = particleCount;
    this.clock = new THREE.Clock();
    this.spriteSheetWidth = spriteSheetWidth;
    this.spriteSheetHeight = spriteSheetHeight;
    this.totalFrames = spriteSheetWidth * spriteSheetHeight;

    // Initialize particle groups
    this.particleGroups = {
      explosion: [],
      smoke: [],
      fire: [],
      spark: [],
      ember: [],
      debris: [],
    };

    // Load texture for particles
    const textureLoader = new THREE.TextureLoader();

    // Handle both single string and array of strings for backward compatibility
    if (Array.isArray(texturePaths) && texturePaths.length > 0) {
      console.log('Loading texture from array:', texturePaths[0]);
      this.texture = textureLoader.load(
        texturePaths[0],
        (texture) => {
          console.log('Texture loaded successfully!');
          this.updateTextureFrame(texture, 0);
        },
        undefined,
        (error) => {
          console.error('Error loading texture:', error);
          // Create colored particles as fallback
          this.createSimpleColoredParticles();
        },
      );
    } else if (typeof texturePaths === 'string') {
      console.log('Loading texture from string:', texturePaths);
      this.texture = textureLoader.load(
        texturePaths,
        (texture) => {
          console.log('Texture loaded successfully!');
          this.updateTextureFrame(texture, 0);
        },
        undefined,
        (error) => {
          console.error('Error loading texture:', error);
          // Create colored particles as fallback
          this.createSimpleColoredParticles();
        },
      );
    }

    // Configure texture for sprite sheet
    if (this.texture) {
      this.texture.wrapS = THREE.RepeatWrapping;
      this.texture.wrapT = THREE.RepeatWrapping;
      this.texture.minFilter = THREE.LinearFilter;
      this.texture.magFilter = THREE.LinearFilter;
      this.updateTextureFrame(this.texture, 0); // Start with the first frame
    } else {
      console.warn('No texture loaded for particle system');
    }

    // Initialize WASM particle system
    initWasm().then((success) => {
      if (success) {
        wasmParticleSystem = new WasmParticleSystem(
          particleCount,
          spriteSheetWidth,
          spriteSheetHeight,
        );
        console.log('WASM particle system created');
      }
    });
  }

  // NEW METHOD: Start a slow fade out of all particles
  startFadeOut(duration = 5000) {
    console.log(`Starting global fade out over ${duration}ms`);
    this.globalFadeActive = true;
    this.globalFadeStartTime = performance.now();
    this.globalFadeDuration = duration;
    this.globalFadeIntensity = 1.0;
  }

  updateTextureFrame(texture, frameIndex) {
    if (!texture) return;

    // Calculate the position in the grid
    const column = frameIndex % this.spriteSheetWidth;
    const row = Math.floor(frameIndex / this.spriteSheetWidth);

    // Calculate UV coordinates
    const frameWidth = 1.0 / this.spriteSheetWidth;
    const frameHeight = 1.0 / this.spriteSheetHeight;

    // Set the offset and repeat to display only one frame
    texture.offset.x = column * frameWidth;
    texture.offset.y = 1.0 - (row + 1) * frameHeight;
    texture.repeat.set(frameWidth, frameHeight);

    // Update all existing particles with the new texture settings
    this.particles.forEach((particle) => {
      if (
        particle instanceof THREE.Sprite &&
        particle.material &&
        particle.material.map
      ) {
        particle.material.map.offset.copy(texture.offset);
        particle.material.map.repeat.copy(texture.repeat);
        particle.material.needsUpdate = true;
      }
    });

    this.currentFrame = frameIndex;
  }

  setPosition(x, y, z) {
    this.emitterPosition.set(x, y, z);
    if (wasmParticleSystem) {
      wasmParticleSystem.set_position(x, y, z);
    }
  }

  setGravity(gravity) {
    this.gravity = gravity;
    if (wasmParticleSystem) {
      try {
        wasmParticleSystem.set_gravity(gravity);
      } catch (e) {
        console.warn('set_gravity not implemented in WASM:', e);
      }
    }
  }

  setWind(x, z) {
    this.windX = x;
    this.windZ = z;
    if (wasmParticleSystem) {
      try {
        wasmParticleSystem.set_wind(x, z);
      } catch (e) {
        console.warn('set_wind not implemented in WASM:', e);
      }
    }
  }

  create() {
    // Clear any existing particles
    this.dispose();
    this.active = true;

    // Reset global fade state
    this.globalFadeActive = false;
    this.globalFadeIntensity = 1.0;

    if (wasmParticleSystem) {
      try {
        wasmParticleSystem.create();
      } catch (e) {
        console.warn('Error creating WASM particles:', e);
      }
    }

    // Create Three.js visual particles
    if (this.texture) {
      this.createPureParticles();
    } else {
      console.log('No texture available, creating colored particles instead');
      this.createSimpleColoredParticles();
    }

    // Create additional visual effects
    this.createShockwave();

    // Start automatic fade out after 3 seconds
    setTimeout(() => this.startFadeOut(3000), 3000);
  }

  // Add this method to your ParticleSystem class
  createParticle() {
    const material = new THREE.SpriteMaterial({
      map: this.texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const sprite = new THREE.Sprite(material);

    // Set initial position at the emitter
    sprite.position.copy(this.emitterPosition);

    // Add to scene
    this.scene.add(sprite);

    // Set basic userData
    sprite.userData = {
      type: 'generic',
      velocity: new THREE.Vector3(0, 0, 0),
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      life: 1.0,
      maxLife: 1.0,
      initialScale: 1.0,
      fadeRate: 0.01,
      scaleRate: 0,
    };

    return sprite;
  }

  createShockwave() {
    // Create a circular shockwave that expands from the explosion center
    const shockwaveGeometry = new THREE.RingGeometry(0.1, 0.2, 32);
    const shockwaveMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.01,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });

    const shockwave = new THREE.Mesh(shockwaveGeometry, shockwaveMaterial);
    shockwave.position.copy(this.emitterPosition);
    shockwave.lookAt(this.emitterPosition.clone().add(new THREE.Vector3(0, 0, 1)));

    // Store properties for animation
    shockwave.userData = {
      type: 'shockwave',
      initialScale: 0.1,
      maxScale: 5.0,
      expansionRate: 3.0,
      life: 1.0,
      fadeRate: 0.7,
    };

    this.scene.add(shockwave);
    this.particles.push(shockwave);
  }

  createPureParticles() {
    if (!this.texture) {
      console.error('No texture loaded for particle system');
      this.createSimpleColoredParticles();
      return;
    }

    // Create different particle types
    this.createExplosionParticles();
    this.createSmokeParticles();
    this.createFireParticles();
    this.createSparkParticles();
  }

  createExplosionParticles() {
    const explosionCount = Math.floor(this.particleCount * 0.3);
    const spriteMaterial = new THREE.SpriteMaterial({
      map: this.texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    for (let i = 0; i < explosionCount; i++) {
      const sprite = new THREE.Sprite(spriteMaterial.clone());

      // Create a spherical distribution close to the center
      const radius = Math.random() * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      sprite.position.set(
        this.emitterPosition.x + radius * Math.sin(phi) * Math.cos(theta),
        this.emitterPosition.y + radius * Math.sin(phi) * Math.sin(theta),
        this.emitterPosition.z + radius * Math.cos(phi),
      );

      // Larger scale for explosion particles
      const scale = 20 + Math.random() * 3;
      sprite.scale.set(scale, scale, 1);

      // Orange-yellow color for explosion
      sprite.material.color.setRGB(1.0, 0.7 + Math.random() * 0.3, 0.2);

      // IMPROVED: Better particle properties for smoother fading
      sprite.userData = {
        type: 'explosion',
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3,
        ),
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        life: 0.5 + Math.random() * 0.3,
        maxLife: 0.5 + Math.random() * 0.3, // Store initial life for fade calculations
        initialScale: scale,
        fadeRate: 0.01 + Math.random() * 0.005, // Slower fade rate
        scaleRate: -0.05 - Math.random() * 0.05, // Gentler shrinking
      };

      if (sprite.material.map) {
        sprite.material.map.offset.copy(this.texture.offset);
        sprite.material.map.repeat.copy(this.texture.repeat);
      }

      this.particles.push(sprite);
      this.scene.add(sprite);
      this.particleGroups.explosion.push(sprite);
    }
  }

  createSmokeParticles() {
    const smokeCount = Math.floor(this.particleCount * 0.3);
    const spriteMaterial = new THREE.SpriteMaterial({
      map: this.texture,
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    for (let i = 0; i < smokeCount; i++) {
      const sprite = new THREE.Sprite(spriteMaterial.clone());

      // Create a spherical distribution around the emitter
      const radius = Math.random() * 1.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      sprite.position.set(
        this.emitterPosition.x + radius * Math.sin(phi) * Math.cos(theta),
        this.emitterPosition.y + radius * Math.sin(phi) * Math.sin(theta),
        this.emitterPosition.z + radius * Math.cos(phi),
      );

      // Medium scale for smoke particles
      const scale = 30 + Math.random() * 2;
      sprite.scale.set(scale, scale, 1);

      // Gray color for smoke
      const gray = 0.5 + Math.random() * 0.5;
      sprite.material.color.setRGB(gray, gray, gray);

      // IMPROVED: Better particle properties for smoother fading
      sprite.userData = {
        type: 'smoke',
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.1,
          0.05 + Math.random() * 0.1, // Upward bias
          (Math.random() - 0.5) * 0.1,
        ),
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        life: 1.5 + Math.random() * 1.0,
        maxLife: 1.5 + Math.random() * 1.0, // Store initial life for fade calculations
        initialScale: scale,
        fadeRate: 0.002 + Math.random() * 0.001, // Slower fade rate for longer-lived smoke
        scaleRate: 0.02 + Math.random() * 0.01, // Expand slowly
      };

      if (sprite.material.map) {
        sprite.material.map.offset.copy(this.texture.offset);
        sprite.material.map.repeat.copy(this.texture.repeat);
      }

      this.particles.push(sprite);
      this.scene.add(sprite);
      this.particleGroups.smoke.push(sprite);
    }
  }

  createFireParticles() {
    const fireCount = Math.floor(this.particleCount * 0.2);
    const spriteMaterial = new THREE.SpriteMaterial({
      map: this.texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    for (let i = 0; i < fireCount; i++) {
      const sprite = new THREE.Sprite(spriteMaterial.clone());

      // Create a distribution near the center
      const radius = Math.random() * 0.7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      sprite.position.set(
        this.emitterPosition.x + radius * Math.sin(phi) * Math.cos(theta),
        this.emitterPosition.y + radius * Math.sin(phi) * Math.sin(theta),
        this.emitterPosition.z + radius * Math.cos(phi),
      );

      // Medium-small scale for fire particles
      const scale = 4 + Math.random() * 2;
      sprite.scale.set(scale, scale, 1);

      // Orange-red color for fire
      sprite.material.color.setRGB(1.0, 0.3 + Math.random() * 0.4, 0.0);

      // IMPROVED: Better particle properties for smoother fading
      sprite.userData = {
        type: 'fire',
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.15,
          0.1 + Math.random() * 0.15, // Strong upward bias
          (Math.random() - 0.5) * 0.15,
        ),
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        life: 0.7 + Math.random() * 0.5,
        maxLife: 0.7 + Math.random() * 0.5, // Store initial life for fade calculations
        initialScale: scale,
        fadeRate: 0.005 + Math.random() * 0.005, // Slower fade for more natural look
        scaleRate: -0.01 - Math.random() * 0.005, // Gentler shrinking
      };

      if (sprite.material.map) {
        sprite.material.map.offset.copy(this.texture.offset);
        sprite.material.map.repeat.copy(this.texture.repeat);
      }

      this.particles.push(sprite);
      this.scene.add(sprite);
      this.particleGroups.fire.push(sprite);
    }
  }

  createSparkParticles() {
    const sparkCount = Math.floor(this.particleCount * 0.2);
    const spriteMaterial = new THREE.SpriteMaterial({
      map: this.texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    for (let i = 0; i < sparkCount; i++) {
      const sprite = new THREE.Sprite(spriteMaterial.clone());

      // Create a spherical distribution from the center
      const radius = Math.random() * 0.3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      sprite.position.set(
        this.emitterPosition.x + radius * Math.sin(phi) * Math.cos(theta),
        this.emitterPosition.y + radius * Math.sin(phi) * Math.sin(theta),
        this.emitterPosition.z + radius * Math.cos(phi),
      );

      // Small scale for spark particles
      const scale = 1 + Math.random() * 1.5;
      sprite.scale.set(scale, scale, 1);

      // Bright yellow-white color for sparks
      sprite.material.color.setRGB(1.0, 0.9 + Math.random() * 0.1, 0.7);

      // IMPROVED: Better particle properties for smoother fading
      sprite.userData = {
        type: 'spark',
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.5,
          0.1 + Math.random() * 0.4,
          (Math.random() - 0.5) * 0.5,
        ),
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        life: 0.5 + Math.random() * 0.5,
        maxLife: 0.5 + Math.random() * 0.5, // Store initial life for fade calculations
        initialScale: scale,
        fadeRate: 0.008 + Math.random() * 0.01, // More gradual fade
        scaleRate: -0.005, // Minimal shrinking
      };

      if (sprite.material.map) {
        sprite.material.map.offset.copy(this.texture.offset);
        sprite.material.map.repeat.copy(this.texture.repeat);
      }

      this.particles.push(sprite);
      this.scene.add(sprite);
      this.particleGroups.spark.push(sprite);
    }
  }

  createSimpleColoredParticles() {
    console.log('Creating fallback colored particles');

    // Create explosion particles
    const explosionCount = Math.floor(this.particleCount * 0.3);
    for (let i = 0; i < explosionCount; i++) {
      const material = new THREE.SpriteMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const sprite = new THREE.Sprite(material);

      // Create a spherical distribution close to the center
      const radius = Math.random() * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      sprite.position.set(
        this.emitterPosition.x + radius * Math.sin(phi) * Math.cos(theta),
        this.emitterPosition.y + radius * Math.sin(phi) * Math.sin(theta),
        this.emitterPosition.z + radius * Math.cos(phi),
      );

      // Larger scale for explosion particles
      const scale = 6 + Math.random() * 3;
      sprite.scale.set(scale, scale, 1);

      // Orange-yellow color for explosion
      sprite.material.color.setRGB(1.0, 0.7 + Math.random() * 0.3, 0.2);

      // IMPROVED: Better particle properties for smoother fading
      sprite.userData = {
        type: 'explosion',
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3,
        ),
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        life: 0.5 + Math.random() * 0.3,
        maxLife: 0.5 + Math.random() * 0.3, // Store initial life for fade calculations
        initialScale: scale,
        fadeRate: 0.01 + Math.random() * 0.005, // Slower fade rate
        scaleRate: -0.05 - Math.random() * 0.05, // Gentler shrinking
      };

      this.particles.push(sprite);
      this.scene.add(sprite);
      this.particleGroups.explosion.push(sprite);
    }

    // Create smoke particles with similar improvements to the above
    const smokeCount = Math.floor(this.particleCount * 0.3);
    // ... (Similar modifications for smoke particles)

    // Create fire and spark particles with similar improvements
    const fireCount = Math.floor(this.particleCount * 0.2);
    const sparkCount = Math.floor(this.particleCount * 0.2);
    // ... (Similar modifications for fire and spark particles)
  }

  update(time) {
    if (!this.active) return;

    // Use a fixed delta time for smoother animation
    const deltaTime = Math.min(this.clock.getDelta(), 0.1);

    // Calculate global fade factor if fade out is active
    let globalFadeFactor = 1.0;
    if (this.globalFadeActive) {
      const fadeElapsed = performance.now() - this.globalFadeStartTime;
      if (fadeElapsed >= this.globalFadeDuration) {
        globalFadeFactor = 0;
        // If fade is complete and no particles remain, mark as inactive
        if (this.particles.length === 0) {
          this.active = false;
          return;
        }
      } else {
        // Calculate smooth fade factor (1.0 to 0.0)
        globalFadeFactor = 1.0 - fadeElapsed / this.globalFadeDuration;

        // Apply easing for smoother fade (optional)
        globalFadeFactor = Math.sin((globalFadeFactor * Math.PI) / 2); // Easing function
      }

      // Store for reference
      this.globalFadeIntensity = globalFadeFactor;
    }

    // Update WASM particle system if available
    if (wasmParticleSystem) {
      try {
        const isActive = wasmParticleSystem.update(deltaTime);
        // Don't set this.active = isActive here, as we're managing our own particles
      } catch (e) {
        console.warn('Error updating WASM particles:', e);
      }
    }

    const particlesToRemove = [];

    // Update all particles
    this.particles.forEach((particle) => {
      // Skip non-sprite objects or already removed particles
      if (!particle.userData || !particle.parent) return;

      // Handle special objects like shockwaves
      if (particle.userData.type === 'shockwave') {
        // Expand the shockwave
        const userData = particle.userData;
        const newScale = userData.initialScale + userData.expansionRate * deltaTime;
        const scaleFactor = newScale / userData.initialScale;

        particle.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Fade out as it expands, applying global fade factor
        if (particle.material) {
          // Apply both individual fade and global fade
          particle.material.opacity -= userData.fadeRate * deltaTime;
          particle.material.opacity *= globalFadeFactor;

          // Remove when fully faded
          if (particle.material.opacity <= 0 || scaleFactor >= userData.maxScale) {
            particlesToRemove.push(particle);
          }
        }
        return;
      }

      // Handle light objects
      if (particle.userData.type === 'light') {
        const userData = particle.userData;
        userData.life -= deltaTime;

        // Fade light intensity
        if (particle instanceof THREE.Light) {
          // Apply both natural fade and global fade
          const lifeFactor = Math.max(0, userData.life / userData.maxLife);
          particle.intensity = userData.initialIntensity * lifeFactor * globalFadeFactor;

          if (userData.life <= 0 || particle.intensity <= 0.1) {
            particlesToRemove.push(particle);
          }
        }
        return;
      }

      // Regular particles
      const userData = particle.userData;

      // Apply gravity based on particle type
      if (userData.type === 'smoke') {
        // Smoke rises
        userData.velocity.y += 0.01 * deltaTime;
      } else if (userData.type === 'fire') {
        // Fire rises quickly
        userData.velocity.y += 0.02 * deltaTime;
      } else if (userData.type === 'spark') {
        // Sparks fall due to gravity
        userData.velocity.y -= this.gravity * deltaTime;
      } else if (userData.type === 'explosion') {
        // Explosion particles slow down
        userData.velocity.x *= 0.98;
        userData.velocity.y *= 0.98;
        userData.velocity.z *= 0.98;
      }

      // Apply wind to smoke and fire
      if (userData.type === 'smoke' || userData.type === 'fire') {
        userData.velocity.x += this.windX * deltaTime;
        userData.velocity.z += this.windZ * deltaTime;
      }

      // Apply velocity
      particle.position.x += userData.velocity.x;
      particle.position.y += userData.velocity.y;
      particle.position.z += userData.velocity.z;

      // Apply rotation
      if (particle.material) {
        particle.material.rotation += userData.rotationSpeed;
      }

      // Apply scale changes
      if (userData.scaleRate) {
        const newScale = particle.scale.x + userData.scaleRate * deltaTime * 10;
        particle.scale.set(newScale, newScale, 1);
      }

      // Update life
      userData.life -= deltaTime;

      // IMPROVED: Calculate opacity based on both life remaining and global fade
      if (particle.material) {
        // Calculate life-based opacity (smoother transition)
        const lifeRatio = Math.max(0, userData.life / userData.maxLife);

        // Apply easing for more natural fade (optional)
        const easedLifeRatio = Math.pow(lifeRatio, 1.5); // Power easing

        // Combine natural fade with global fade
        const combinedOpacity = easedLifeRatio * globalFadeFactor;

        // Apply the calculated opacity
        particle.material.opacity = combinedOpacity;
      }

      // Special effects based on particle type
      if (userData.type === 'fire') {
        // Fire gets redder as it burns out
        if (
          particle.material &&
          particle.material.color &&
          particle.material.color.g > 0.1
        ) {
          particle.material.color.g -= 0.01;
        }

        // Fire flickers
        if (Math.random() < 0.1) {
          if (particle.scale) {
            particle.scale.x *= 0.9 + Math.random() * 0.2;
            particle.scale.y = particle.scale.x;
          }
        }
      } else if (userData.type === 'spark') {
        // Sparks flicker
        if (Math.random() < 0.2) {
          if (particle.material) {
            // Maintain global fade factor when flickering
            const flickerIntensity = 0.5 + Math.random() * 0.5;
            particle.material.opacity = flickerIntensity * globalFadeFactor;
          }
        }
      }

      // Remove dead particles
      if (
        (particle.material && particle.material.opacity <= 0.01) ||
        userData.life <= 0
      ) {
        particlesToRemove.push(particle);
      }
    });

    // Remove dead particles
    particlesToRemove.forEach((particle) => {
      this.scene.remove(particle);
      const index = this.particles.indexOf(particle);
      if (index > -1) {
        this.particles.splice(index, 1);
      }

      // Also remove from particle groups
      if (particle.userData && particle.userData.type) {
        const groupName = particle.userData.type;
        if (this.particleGroups[groupName]) {
          const groupIndex = this.particleGroups[groupName].indexOf(particle);
          if (groupIndex > -1) {
            this.particleGroups[groupName].splice(groupIndex, 1);
          }
        }
      }

      // Dispose materials and textures
      if (particle instanceof THREE.Sprite && particle.material) {
        if (particle.material.map) {
          particle.material.map.dispose();
        }
        particle.material.dispose();
      } else if (particle instanceof THREE.Mesh && particle.material) {
        if (particle.geometry) {
          particle.geometry.dispose();
        }
        if (Array.isArray(particle.material)) {
          particle.material.forEach((mat) => mat.dispose());
        } else {
          particle.material.dispose();
        }
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

      if (particle instanceof THREE.Sprite && particle.material) {
        if (particle.material.map) {
          particle.material.map.dispose();
        }
        particle.material.dispose();
      } else if (particle instanceof THREE.Mesh && particle.material) {
        if (particle.geometry) {
          particle.geometry.dispose();
        }
        if (Array.isArray(particle.material)) {
          particle.material.forEach((mat) => mat.dispose());
        } else {
          particle.material.dispose();
        }
      }
    });

    this.particles = [];
    this.active = false;

    // Clear particle groups
    Object.keys(this.particleGroups).forEach((key) => {
      this.particleGroups[key] = [];
    });

    if (wasmParticleSystem) {
      try {
        wasmParticleSystem.dispose();
      } catch (e) {
        console.warn('Error disposing WASM particle system:', e);
      }
    }
  }

  // Create a secondary shockwave effect
  createSecondaryShockwave() {
    // Create a more subtle, slower expanding shockwave
    const shockwaveGeometry = new THREE.RingGeometry(0.2, 0.4, 32);
    const shockwaveMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa44,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });

    const shockwave = new THREE.Mesh(shockwaveGeometry, shockwaveMaterial);
    shockwave.position.copy(this.emitterPosition);
    shockwave.lookAt(this.emitterPosition.clone().add(new THREE.Vector3(0, 0, 1)));

    // Store properties for animation
    shockwave.userData = {
      type: 'shockwave',
      initialScale: 0.2,
      maxScale: 8.0,
      expansionRate: 1.5,
      life: 2.0,
      maxLife: 2.0, // Store initial life for fade calculations
      fadeRate: 0.2,
    };

    this.scene.add(shockwave);
    this.particles.push(shockwave);
  }

  // Create a light flash effect at the explosion point
  createLightFlash() {
    // Create a point light that quickly fades
    const flashLight = new THREE.PointLight(0xffaa66, 5, 15, 2);
    flashLight.position.copy(this.emitterPosition);

    // Store properties for animation
    flashLight.userData = {
      type: 'light',
      initialIntensity: 5,
      fadeRate: 4.0,
      life: 1.0,
      maxLife: 1.0, // Store initial life for fade calculations
    };

    this.scene.add(flashLight);
    this.particles.push(flashLight);

    // Create a second, longer-lasting, less intense light
    const ambientFlashLight = new THREE.PointLight(0xff7744, 2, 10, 2);
    ambientFlashLight.position.copy(this.emitterPosition);

    // Store properties for animation
    ambientFlashLight.userData = {
      type: 'light',
      initialIntensity: 2,
      fadeRate: 1.0,
      life: 2.0,
      maxLife: 2.0, // Store initial life for fade calculations
    };

    this.scene.add(ambientFlashLight);
    this.particles.push(ambientFlashLight);
  }

  createWeaponTrail(options) {
    const {
      direction = { x: 0, y: 0, z: -1 },
      speed = 1,
      spread = 0.2,
      lifetime = 2,
      colors = [0xffffff, 0x88ccff],
    } = options;

    // Create particles that emit in the direction of weapon movement
    for (let i = 0; i < 10; i++) {
      // Create a particle with trail-like properties
      const particle = this.createParticle();

      // Set initial position with slight randomization for spread effect
      particle.position.x += (Math.random() - 0.5) * spread;
      particle.position.y += (Math.random() - 0.5) * spread;
      particle.position.z += (Math.random() - 0.5) * spread;

      // Set velocity in the direction of weapon movement
      particle.userData.velocity = new THREE.Vector3(
        direction.x * speed + (Math.random() - 0.5) * spread,
        direction.y * speed + (Math.random() - 0.5) * spread,
        direction.z * speed + (Math.random() - 0.5) * spread,
      );

      // Set other particle properties for trail effect
      particle.userData.lifetime = lifetime * (0.7 + Math.random() * 0.6);
      particle.userData.fadeRate = 0.9;
      particle.userData.scaleRate = -0.2; // Shrink over time

      // Set random color from the provided color array
      const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
      particle.material.color = color;

      // Set initial scale smaller for trail effect
      const scale = 0.3 + Math.random() * 0.3;
      particle.scale.set(scale, scale, scale);

      // Add to active particles
      this.particles.push(particle);
    }
  }

  // Add this method to your ParticleSystem class in particles.js
  createParticles(count = 10, options = {}) {
    const {
      direction = { x: 0, y: 0, z: -1 },
      speed = 1,
      spread = 0.2,
      lifetime = 2,
      colors = [0xffffff, 0x88ccff],
    } = options;

    for (let i = 0; i < count; i++) {
      // Create a particle
      const particle = this.createParticle();

      // Set initial position with slight randomization for spread effect
      particle.position.x += (Math.random() - 0.5) * spread;
      particle.position.y += (Math.random() - 0.5) * spread;
      particle.position.z += (Math.random() - 0.5) * spread;

      // Set velocity in the direction specified
      particle.userData.velocity = new THREE.Vector3(
        direction.x * speed + (Math.random() - 0.5) * spread,
        direction.y * speed + (Math.random() - 0.5) * spread,
        direction.z * speed + (Math.random() - 0.5) * spread,
      );

      // Set other particle properties
      particle.userData.lifetime = lifetime * (0.7 + Math.random() * 0.6);
      particle.userData.fadeRate = 0.9;
      particle.userData.scaleRate = -0.2; // Shrink over time

      // Set random color from the provided color array
      const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
      particle.material.color = color;

      // Set initial scale
      const scale = 0.3 + Math.random() * 0.3;
      particle.scale.set(scale, scale, scale);

      // Add to active particles
      this.particles.push(particle);
    }
  }
  // Helper method to create debris pieces
  createDebris(count = 15) {
    // Create debris particles
    for (let i = 0; i < count; i++) {
      const material = new THREE.SpriteMaterial({
        map: this.texture,
        transparent: true,
        blending: THREE.NormalBlending,
        depthWrite: false,
      });

      const sprite = new THREE.Sprite(material);

      // Random position around the explosion center
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.5;
      sprite.position.set(
        this.emitterPosition.x + Math.cos(angle) * radius,
        this.emitterPosition.y + Math.sin(angle) * radius,
        this.emitterPosition.z + (Math.random() - 0.5) * radius,
      );

      // Random scale
      const scale = 0.5 + Math.random() * 1.5;
      sprite.scale.set(scale, scale, 1);

      // Random rotation
      sprite.material.rotation = Math.random() * Math.PI * 2;

      // Set color to dark gray/brown
      const gray = 0.3 + Math.random() * 0.2;
      sprite.material.color.setRGB(gray + 0.1, gray, gray - 0.1);

      // IMPROVED: Better properties for smoother fading
      sprite.userData = {
        type: 'debris',
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3,
        ),
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        life: 1.0 + Math.random() * 2.0,
        maxLife: 1.0 + Math.random() * 2.0, // Store initial life for fade calculations
        fadeRate: 0.005 + Math.random() * 0.005, // Slower fade rate
        scaleRate: -0.005, // Very slow shrinking
        gravity: 0.05,
      };

      this.scene.add(sprite);
      this.particles.push(sprite);

      // Add to debris group
      if (!this.particleGroups.debris) {
        this.particleGroups.debris = [];
      }
      this.particleGroups.debris.push(sprite);
    }
  }
}

export { ParticleSystem };
