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

// Define the particle data interface outside the class to avoid TypeScript errors
interface ParticleData {
  velocity: THREE.Vector3;
  rotationSpeed: number;
  life: number;
  initialScale: number;
  fadeRate: number;
}

// Modify the ParticleSystem class to handle sprite sheet animation
class ParticleSystem {
  particles: THREE.Sprite[] = [];
  scene: THREE.Scene;
  texture: THREE.Texture | null = null;
  particleCount: number;
  clock: THREE.Clock;
  emitterPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  active: boolean = false;

  // New properties for sprite sheet animation
  spriteSheetWidth: number = 4; // Number of columns in the sprite sheet
  spriteSheetHeight: number = 7; // Number of rows in the sprite sheet
  currentFrame: number = 0; // Current frame to display
  totalFrames: number = 28; // Total number of frames in the sprite sheet
  animationSpeed: number = 0.1; // How fast to animate through frames
  lastFrameUpdate: number = 0; // Time tracker for animation

  constructor(
    scene: THREE.Scene,
    texturePath: string | string[],
    particleCount: number = 50,
    spriteSheetWidth: number = 4,
    spriteSheetHeight: number = 7,
  ) {
    this.scene = scene;
    this.particleCount = particleCount;
    this.clock = new THREE.Clock();
    this.spriteSheetWidth = spriteSheetWidth;
    this.spriteSheetHeight = spriteSheetHeight;
    this.totalFrames = spriteSheetWidth * spriteSheetHeight;

    // Load texture for pure particle effect
    const textureLoader = new THREE.TextureLoader();

    // Handle both single string and array of strings for backward compatibility
    if (Array.isArray(texturePath) && texturePath.length > 0) {
      this.texture = textureLoader.load(texturePath[0]);
    } else if (typeof texturePath === 'string') {
      this.texture = textureLoader.load(texturePath);
    }

    // Configure texture for sprite sheet
    if (this.texture) {
      this.texture.wrapS = THREE.RepeatWrapping;
      this.texture.wrapT = THREE.RepeatWrapping;
      this.updateTextureFrame(0); // Start with the first frame
    }
  }

  // New method to update the texture offset to show a specific frame
  updateTextureFrame(frameIndex: number): void {
    if (!this.texture) return;

    // Calculate the position in the grid
    const column = frameIndex % this.spriteSheetWidth;
    const row = Math.floor(frameIndex / this.spriteSheetWidth);

    // Calculate UV coordinates (normalized from 0 to 1)
    const frameWidth = 1.0 / this.spriteSheetWidth;
    const frameHeight = 1.0 / this.spriteSheetHeight;

    // Set the offset and repeat to display only one frame
    this.texture.offset.x = column * frameWidth;
    this.texture.offset.y = 1.0 - (row + 1) * frameHeight; // Y is inverted in THREE.js textures
    this.texture.repeat.set(frameWidth, frameHeight);

    // Update all existing particles with the new texture settings
    this.particles.forEach((particle) => {
      if (particle.material.map) {
        particle.material.map.offset.copy(this.texture!.offset);
        particle.material.map.repeat.copy(this.texture!.repeat);
        particle.material.needsUpdate = true;
      }
    });

    this.currentFrame = frameIndex;
  }

  setPosition(x: number, y: number, z: number): void {
    this.emitterPosition.set(x, y, z);
  }

  create(): void {
    // Clear any existing particles
    this.dispose();
    this.active = true;
    this.createPureParticles();
  }

  // Display a specific frame - new method
  showFrame(frameIndex: number): void {
    if (frameIndex >= 0 && frameIndex < this.totalFrames) {
      this.updateTextureFrame(frameIndex);
    }
  }

  createPureParticles(): void {
    if (!this.texture) {
      console.error('No texture loaded for particle system');
      return;
    }

    const spriteMaterial = new THREE.SpriteMaterial({
      map: this.texture,
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    for (let i = 0; i < this.particleCount; i++) {
      const sprite = new THREE.Sprite(spriteMaterial.clone());

      // Create a spherical distribution of particles around the emitter
      const radius = Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      sprite.position.set(
        this.emitterPosition.x + radius * Math.sin(phi) * Math.cos(theta),
        this.emitterPosition.y + radius * Math.sin(phi) * Math.sin(theta),
        this.emitterPosition.z + radius * Math.cos(phi),
      );

      // Varied scale for visual interest
      const scale = 5 + Math.random() * 2.5;
      sprite.scale.set(scale, scale, 1);

      // Particle properties
      sprite.userData = {
        velocity: new THREE.Vector3(
          (Math.random() - 0.05) * 0.2,
          (Math.random() - 0.05) * 0.2,
          (Math.random() - 0.05) * 0.2,
        ),
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        life: 1.0,
        initialScale: scale,
        fadeRate: 0.005 + Math.random() * 0.01,
        // Add frame information for animation
        startFrame: Math.floor(Math.random() * this.totalFrames), // Random starting frame
        animationSpeed: 0.05 + Math.random() * 0.1, // Random animation speed
        frameTime: 0, // Time tracker for this particle's animation
      } as ParticleData & {
        startFrame: number;
        animationSpeed: number;
        frameTime: number;
      };

      // Ensure the sprite shows the correct texture frame
      if (sprite.material.map) {
        sprite.material.map.offset.copy(this.texture.offset);
        sprite.material.map.repeat.copy(this.texture.repeat);
      }

      this.particles.push(sprite);
      this.scene.add(sprite);
    }
  }

  update(): void {
    if (!this.active) return;

    const deltaTime = this.clock.getDelta();
    const particlesToRemove: THREE.Sprite[] = [];

    // Global animation for all particles
    this.lastFrameUpdate += deltaTime;
    if (this.lastFrameUpdate > this.animationSpeed) {
      this.lastFrameUpdate = 0;
      // Advance to next frame
      const nextFrame = (this.currentFrame + 1) % this.totalFrames;
      this.updateTextureFrame(nextFrame);
    }

    this.particles.forEach((particle) => {
      const userData = particle.userData as ParticleData & {
        startFrame?: number;
        animationSpeed?: number;
        frameTime?: number;
      };

      // Apply velocity
      particle.position.x += userData.velocity.x;
      particle.position.y += userData.velocity.y;
      particle.position.z += userData.velocity.z;

      // Apply rotation
      particle.material.rotation += userData.rotationSpeed;

      // Apply fade
      particle.material.opacity -= userData.fadeRate;

      // Update life
      userData.life -= deltaTime;

      // Remove dead particles
      if (particle.material.opacity <= 0 || userData.life <= 0) {
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

  dispose(): void {
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
