import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { InstallGameLighting } from '@component/game/threejs-lighting';
import StoreGlobal from '@store/global/index.ts';
import { GCAWeaponModel, getWeaponForCharacter } from '../three-d-model/weapon-loader';

function cleanUpModel(model: THREE.Object3D, cleanedObjects = new WeakSet()) {
  if (cleanedObjects.has(model)) return;
  cleanedObjects.add(model);

  if (model instanceof THREE.Mesh) {
    if (Array.isArray(model.material)) {
      model.material.forEach((mat) => {
        if (mat instanceof THREE.Material) {
          if ((mat as any).map) (mat as any).map.dispose();
          mat.dispose();
        }
      });
    } else if (model.material instanceof THREE.Material) {
      if ((model.material as any).map) (model.material as any).map.dispose();
      model.material.dispose();
    }
    if (model.geometry) model.geometry.dispose();
  }

  model.traverse((child) => cleanUpModel(child, cleanedObjects));
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Enhanced Particle System class for realistic explosions
class ParticleSystem {
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

export function ThreeModelRenderer({
  modelSrc,
  className,
  style,
  canvasWidth = 600,
  canvasHeight = 250,
  isAnswerCorrect,
}: {
  modelSrc?: string;
  isAnswerCorrect: boolean;
  className?: string;
  style?: React.CSSProperties;
  canvasWidth?: number;
  canvasHeight?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const timeRef = useRef<DOMHighResTimeStamp>();
  const particleSystemRef = useRef<ParticleSystem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canvasPosition, setCanvasPosition] = useState<
    'initial' | 'final' | 'losing' | 'winning'
  >('initial');
  const [showParticles, setShowParticles] = useState(false);

  // Get the weapon name for this avatar
  const weaponName = useMemo(() => {
    if (!modelSrc) return '';
    return getWeaponForCharacter(modelSrc);
  }, [modelSrc]);

  const model = useMemo<GCAWeaponModel>(() => new GCAWeaponModel(), []);

  const animationLoop = useCallback(
    (time: DOMHighResTimeStamp) => {
      let deltaTime = 0;
      if (timeRef.current) deltaTime = time - timeRef.current;
      model.Update({ deltaTime });

      // Update particle system if active
      if (showParticles && particleSystemRef.current) {
        particleSystemRef.current.update();
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      timeRef.current = time;
    },
    [model, showParticles],
  );

  useEffect(() => {
    const transitionSequence = async () => {
      await delay(700);
      setCanvasPosition('final');

      // Set particles state
      setShowParticles(true);

      // Wait for state update to take effect
      await delay(50);

      // Create particles when reaching final position
      if (sceneRef.current && particleSystemRef.current) {
        // Position the particle system at a good spot for the effect
        particleSystemRef.current.setPosition(
          isAnswerCorrect ? 2 : -2, // X position based on answer
          isAnswerCorrect ? 1 : -1, // Y position based on answer
          0, // Z position
        );
        particleSystemRef.current.create();
        console.log('Creating enhanced particles');
      }

      if (!isAnswerCorrect) {
        await delay(4000);
        setCanvasPosition('losing');
      } else {
        await delay(4000);
        setCanvasPosition('winning');
      }
    };

    transitionSequence();

    return () => {
      // Cleanup timers if needed
      if (particleSystemRef.current) {
        particleSystemRef.current.dispose();
      }
    };
  }, [isAnswerCorrect]);

  // Use weaponName instead of modelSrc for style decisions
  const canvasClasses = useMemo(() => {
    if (weaponName === 'ArrowMG') {
      return `${className || ''} transition-transform duration-[1.5s] ease-in-out absolute z-50 ${
        canvasPosition === 'initial' ? 'left-[35%] top-[48%]' : 'bottom-0'
      }`;
    } else {
      return `${className || ''} absolute z-50 ${
        canvasPosition === 'initial' ? 'opacity-50' : 'opacity-100'
      }`;
    }
  }, [className, canvasPosition, weaponName]);

  // Use weaponName instead of modelSrc for style decisions
  const canvasStyle = useMemo<React.CSSProperties>(() => {
    if (weaponName === 'ArrowMG') {
      let transform = '';
      let opacity = 1;
      let transition = '';

      if (canvasPosition === 'initial') {
        transform = isAnswerCorrect
          ? 'translate(-65%, -75%) rotate(-15deg) scale(0.9)'
          : 'translate(-65%, -65%) rotate(-10deg) scale(0.9)';
        opacity = 1;
        transition = 'transform 0.6s ease-in, opacity 0.6s ease-in';
      } else if (canvasPosition === 'final') {
        transform = isAnswerCorrect
          ? 'translate(35%, -73%) rotate(7deg) scale(1)'
          : 'translate(35%, -65%) rotate(18deg) scale(0.95)';
        opacity = 1;
        transition = 'transform 1s ease-out, opacity 1s ease-out';
      } else if (canvasPosition === 'losing') {
        transform = 'translate(-20%, 0%) rotate(-185deg) scale(0.75)';
        opacity = 1;
        transition = 'transform 2s ease-out, opacity 1s ease-out';
      } else if (canvasPosition === 'winning') {
        transform = 'translate(35%, -73%) rotate(7deg) scale(1)';
        opacity = 0; // fade out
        transition = 'transform 2s ease-out, opacity 2s ease-out';
      }

      return {
        ...style,
        transform,
        opacity,
        transition,
      };
    }

    return {
      ...style,
      transform:
        canvasPosition === 'initial' && !isAnswerCorrect
          ? 'translate(-100%, -20%)'
          : 'translate(0, -19%)',
      top: '50%',
      left: '50%',
    };
  }, [style, canvasPosition, weaponName, isAnswerCorrect]);

  useEffect(() => {
    const loadModelWithDelay = async () => {
      await delay(500);
      setIsLoading(false);
    };

    loadModelWithDelay();

    const canvasElement = canvasRef.current;
    if (canvasElement) {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) {
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Add fog to the scene to fade particles at the edges
        scene.fog = new THREE.Fog(0x000000, 15, 30);

        const camera = new THREE.PerspectiveCamera(
          80,
          canvasWidth / canvasHeight,
          0.1,
          1000,
        );
        camera.position.z = 6;
        cameraRef.current = camera;

        InstallGameLighting(scene);

        const renderer = new THREE.WebGLRenderer({
          canvas: canvasElement,
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
        });

        // Increase render size to prevent cut-off effects
        const pixelRatio = window.devicePixelRatio || 1;
        renderer.setPixelRatio(pixelRatio);
        renderer.setSize(canvasWidth * 5.5, canvasHeight * 2.5);

        // Apply CSS scaling to maintain visual size while expanding render area
        canvasElement.style.width = `${canvasWidth}px`;
        canvasElement.style.height = `${canvasHeight}px`;
        canvasElement.style.transformOrigin = 'center center';

        rendererRef.current = renderer;

        // Initialize enhanced particle system with multiple texture options
        particleSystemRef.current = new ParticleSystem(
          scene,
          [
            //"/assets/gameplay_particles/projectile18.png",
            // Add these files if available, otherwise comment them out
            '/assets/gameplay_particles/Explosion1.png',
            //"/assets/gameplay_particles/projectile3.png",
          ],
          70, // Increased number of particles
        );
      }

      if (sceneRef.current) {
        sceneRef.current.traverse((child) => cleanUpModel(child));
      }

      // Only start loading when we have a valid modelSrc and loading is complete
      if (!isLoading && modelSrc) {
        console.log(
          `Starting model load for avatar key: ${modelSrc} (weapon: ${weaponName})`,
        );
        model.Start({
          modelSrc,
          scene: sceneRef.current,
          renderer: rendererRef.current,
          onLoaded: () => {
            StoreGlobal.MethodGet().loadingSet(false);
          },
        });
      }

      if (rendererRef.current) {
        rendererRef.current.setAnimationLoop(animationLoop);
      }
    }

    return () => {
      if (sceneRef.current) {
        sceneRef.current.traverse((child) => cleanUpModel(child));
      }

      // Clean up particles
      if (particleSystemRef.current) {
        particleSystemRef.current.dispose();
      }

      model?.ComponentRemove(sceneRef.current);

      if (rendererRef.current) {
        rendererRef.current.setAnimationLoop(null);
        rendererRef.current.clear();
      }
    };
  }, [animationLoop, model, modelSrc, weaponName, canvasWidth, canvasHeight, isLoading]);

  return <canvas ref={canvasRef} style={canvasStyle} className={canvasClasses} />;
}

export default ThreeModelRenderer;
