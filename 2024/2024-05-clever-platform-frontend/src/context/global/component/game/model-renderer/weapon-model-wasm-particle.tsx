import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { InstallGameLighting } from '@component/game/threejs-lighting';
import StoreGlobal from '@store/global/index.ts';
import { GCAWeaponModel, getWeaponForCharacter } from '../three-d-model/weapon-loader';
import { ParticleSystem } from './particles';

// Define an interface for the particle options
interface ParticleOptions {
  direction?: { x: number; y: number; z: number };
  speed?: number;
  spread?: number;
  lifetime?: number;
  colors?: number[];
}

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

// Function to create a single particle for the throwing effect
function createSingleTrailParticle(
  scene: THREE.Scene,
  position: THREE.Vector3,
  direction: THREE.Vector3,
  isPositive: boolean = true,
  size: number = 1.0,
  opacity: number = 0.8,
) {
  // Create particle texture
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext('2d');
  if (context) {
    const gradient = context.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2,
    );

    // Create soft glow effect
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.4, 'rgba(200, 200, 255, 0.5)');
    gradient.addColorStop(0.6, 'rgba(160, 160, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 64, 0)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  // Color palette for supernatural effect - blue for positive, red for negative
  const colorValue = isPositive
    ? [0x00ffff, 0x4169e1, 0x7df9ff, 0xadd8e6, 0xb0e0e6][Math.floor(Math.random() * 5)]
    : [0xff5500, 0xff0066, 0xff3300, 0xff6347, 0xff4500][Math.floor(Math.random() * 5)];

  const color = new THREE.Color(colorValue);

  // Create particle material
  const material = new THREE.SpriteMaterial({
    map: texture,
    color: color,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: opacity,
  });

  // Create sprite
  const particle = new THREE.Sprite(material);
  particle.position.copy(position);
  particle.scale.set(size, size, size);

  // Add custom data for animation
  particle.userData = {
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1 - 0.05,
      (Math.random() - 0.5) * 0.1,
    ),
    rotationSpeed: Math.random() * 0.2 - 0.1,
    lifetime: 2.0,
    age: 0,
    initialScale: size,
    update: function (delta: number) {
      // Update position
      particle.position.x += this.velocity.x;
      particle.position.y += this.velocity.y;
      particle.position.z += this.velocity.z;

      // Rotate particle
      particle.rotation.z += this.rotationSpeed * delta;

      // Scale down over time
      const scaleFactor = 1.0 - (this.age / this.lifetime) * 0.5;
      particle.scale.set(
        this.initialScale * scaleFactor,
        this.initialScale * scaleFactor,
        this.initialScale * scaleFactor,
      );

      // Fade out over time
      if (material.opacity) {
        material.opacity = Math.max(0, opacity * (1 - this.age / this.lifetime));
      }

      // Update age
      this.age += delta;

      // Return false when particle should be removed
      return this.age < this.lifetime;
    },
  };

  scene.add(particle);
  return particle;
}

// Function to create a throwing effect with supernatural wind-like trail
export function createThrowingEffect(
  scene: THREE.Scene,
  position: THREE.Vector3,
  direction: THREE.Vector3,
  isPositive: boolean = true,
) {
  const particles: THREE.Sprite[] = [];
  const particleCount = 30; // Reduced count for better performance

  // Create particles along the trail path
  for (let i = 0; i < particleCount; i++) {
    // Calculate position along trail
    const trailLength = Math.random() * 15.0;
    const spread = 0.5;
    const pos = new THREE.Vector3(
      position.x - direction.x * trailLength + (Math.random() - 0.5) * spread,
      position.y - direction.y * trailLength + (Math.random() - 0.5) * spread,
      position.z - direction.z * trailLength + (Math.random() - 0.5) * spread,
    );

    // Size decreases along the trail
    const size = 3.0 * (1.0 - trailLength / 15.0) + Math.random() * 0.5;

    // Opacity decreases along the trail
    const opacity = 0.8 * (1.0 - trailLength / 15.0);

    // Create particle
    const particle = createSingleTrailParticle(
      scene,
      pos,
      direction,
      isPositive,
      size,
      opacity,
    );
    particles.push(particle);
  }

  return particles;
}

// Function to update the throwing effect particles
export function updateThrowingEffectParticles(particles: THREE.Sprite[], delta: number) {
  const remainingParticles = [];

  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];
    if (particle && particle.userData && typeof particle.userData.update === 'function') {
      // Update this particle and check if it's still alive
      const isAlive = particle.userData.update(delta);

      // Remove expired particles
      if (!isAlive) {
        if (particle.parent) {
          particle.parent.remove(particle);
        }
        // Clean up sprite material
        if (particle.material && particle.material instanceof THREE.SpriteMaterial) {
          if (particle.material.map) {
            particle.material.map.dispose();
          }
          particle.material.dispose();
        }
      } else {
        remainingParticles.push(particle);
      }
    }
  }

  return remainingParticles;
}

// Add these methods to your existing ParticleSystem
export function extendParticleSystem(particleSystem: any) {
  // Add supernatural trail capability
  particleSystem.trailParticles = [];

  // Create supernatural trail
  particleSystem.createSupernatualTrail = function (
    direction = { x: 1, y: 0, z: 0 },
    isPositive = true,
  ) {
    if (!this.scene) return;

    // Get the current position
    const position = new THREE.Vector3(
      this.position?.x || 0,
      this.position?.y || 0,
      this.position?.z || 0,
    );

    // Convert direction to Vector3
    const directionVector = new THREE.Vector3(
      direction.x,
      direction.y,
      direction.z,
    ).normalize();

    // Create the throwing effect
    const particles = createThrowingEffect(
      this.scene,
      position,
      directionVector,
      isPositive,
    );

    // Store the particles for updating
    this.trailParticles = this.trailParticles.concat(particles);

    return particles;
  };

  // Update trail particles
  particleSystem.updateTrails = function (delta: number) {
    if (!this.trailParticles || this.trailParticles.length === 0) return;

    // Update each particle and get remaining ones
    this.trailParticles = updateThrowingEffectParticles(this.trailParticles, delta);
  };

  // Extend the update method
  const originalUpdate = particleSystem.update;
  particleSystem.update = function (time: number) {
    // Call original update if it exists
    if (originalUpdate) {
      originalUpdate.call(this, time);
    }

    // Calculate delta time
    const delta = time - (this.lastTime || time);
    this.lastTime = time;

    // Update trail particles
    if (this.updateTrails) {
      this.updateTrails(delta / 1000); // Convert to seconds if time is in milliseconds
    }
  };

  return particleSystem;
}

export function ThreeModelRenderer({
  modelSrc,
  className,
  style,
  canvasWidth = 600,
  canvasHeight = 250,
  isAnswerCorrect,
  onLoaded, // Add this prop
}: {
  modelSrc?: string;
  isAnswerCorrect: boolean;
  className?: string;
  style?: React.CSSProperties;
  canvasWidth?: number;
  canvasHeight?: number;
  onLoaded?: () => void;
}) {
  // Add a state to track when the model is fully loaded
  const [modelLoaded, setModelLoaded] = useState(false);

  // Main canvas for the model
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Second canvas specifically for particles
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);

  // Third canvas for additional particles
  const secondParticleCanvasRef = useRef<HTMLCanvasElement>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const particleSceneRef = useRef<THREE.Scene | null>(null);
  const secondParticleSceneRef = useRef<THREE.Scene | null>(null);

  const cameraRef = useRef<THREE.Camera | null>(null);
  const particleCameraRef = useRef<THREE.Camera | null>(null);
  const secondParticleCameraRef = useRef<THREE.Camera | null>(null);

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particleRendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const secondParticleRendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const timeRef = useRef<DOMHighResTimeStamp>();
  const particleSystemRef = useRef<any>(null);
  const secondParticleSystemRef = useRef<any>(null);

  const animationFrameRef = useRef<number | null>(null);
  const secondAnimationFrameRef = useRef<number | null>(null);

  // Sprite sheet configuration
  const spriteSheetConfig = useRef({
    columns: 3, // Number of columns in the sprite sheet
    rows: 2, // Number of rows in the sprite sheet
    totalFrames: 6, // Total number of frames in the sprite sheet
  });

  const [isLoading, setIsLoading] = useState(true);
  const [canvasPosition, setCanvasPosition] = useState<
    'initial' | 'final' | 'losing' | 'winning'
  >('initial');
  const [showParticles, setShowParticles] = useState(false);
  const [showSecondParticles, setShowSecondParticles] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSecondAnimating, setIsSecondAnimating] = useState(false);

  // Get the weapon name for this avatar
  const weaponName = useMemo(() => {
    if (!modelSrc) return '';
    return getWeaponForCharacter(modelSrc);
  }, [modelSrc]);

  const model = useMemo<GCAWeaponModel>(() => new GCAWeaponModel(), []);

  // Notify parent when model is loaded
  useEffect(() => {
    if (modelLoaded && onLoaded) {
      console.log(`Model \${modelSrc} loaded, calling onLoaded callback`);
      onLoaded();
    }
  }, [modelLoaded, modelSrc, onLoaded]);

  // Function to get a specific frame from the sprite sheet
  const configureTextureFrame = useCallback(
    (texture: THREE.Texture, frameIndex: number) => {
      if (!texture) return;

      const cols = spriteSheetConfig.current.columns;
      const rows = spriteSheetConfig.current.rows;

      // Calculate the position in the grid
      const column = frameIndex % cols;
      const row = Math.floor(frameIndex / cols);

      // Configure texture to show only one frame
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1 / cols, 1 / rows);
      texture.offset.x = column / cols;
      texture.offset.y = 1 - (row + 1) / rows; // Y is flipped in THREE.js textures
      texture.needsUpdate = true;

      return texture;
    },
    [],
  );

  // Animation loop for the model
  const animationLoop = useCallback(
    (time: DOMHighResTimeStamp) => {
      let deltaTime = 0;
      if (timeRef.current) deltaTime = time - timeRef.current;
      model.Update({ deltaTime });

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      timeRef.current = time;
    },
    [model],
  );

  // Improved particle animation loop with proper frame management
  const particleAnimationLoop = useCallback(
    (time: DOMHighResTimeStamp) => {
      // Update particle system if active
      if (showParticles && particleSystemRef.current) {
        particleSystemRef.current.update(time);
      }

      // Render the particles
      if (
        particleRendererRef.current &&
        particleSceneRef.current &&
        particleCameraRef.current
      ) {
        particleRendererRef.current.render(
          particleSceneRef.current,
          particleCameraRef.current,
        );
      }

      // Continue the animation loop if we're still animating
      if (isAnimating) {
        animationFrameRef.current = requestAnimationFrame(particleAnimationLoop);
      }
    },
    [showParticles, isAnimating],
  );

  // Create weapon movement effect with supernatural trail
  const createWeaponMovementEffect = useCallback(() => {
    console.log('Creating weapon movement effect');
    if (secondParticleSystemRef.current && model) {
      // Get weapon position using our new method
      const weaponPosition = model.getWeaponPosition
        ? model.getWeaponPosition()
        : new THREE.Vector3(0, 0, 0);

      console.log('Weapon position:', weaponPosition);

      // Add some dynamic variation based on the current position
      const dynamicOffset = {
        x: isAnswerCorrect ? 1.5 : -1.5,
        y: isAnswerCorrect ? 0.5 : -0.5,
        z: 0,
      };

      console.log('Setting particle position to:', {
        x: weaponPosition.x + dynamicOffset.x,
        y: weaponPosition.y + dynamicOffset.y,
        z: weaponPosition.z + dynamicOffset.z,
      });

      // Position the particle emitter at the weapon with offset
      if (secondParticleSystemRef.current.setPosition) {
        secondParticleSystemRef.current.setPosition(
          weaponPosition.x + dynamicOffset.x,
          weaponPosition.y + dynamicOffset.y,
          weaponPosition.z + dynamicOffset.z,
        );
      }

      console.log('Creating supernatural trail particles');

      try {
        // Create supernatural trail effect if the method exists
        if (
          typeof secondParticleSystemRef.current.createSupernatualTrail === 'function'
        ) {
          console.log('Using createSupernatualTrail method');
          secondParticleSystemRef.current.createSupernatualTrail(
            isAnswerCorrect ? { x: 1, y: 0.5, z: 0 } : { x: -1, y: -0.5, z: 0 },
            isAnswerCorrect,
          );
        } else if (
          typeof secondParticleSystemRef.current.createParticles === 'function'
        ) {
          console.log('Using createParticles method');
          secondParticleSystemRef.current.createParticles(5, {
            direction: isAnswerCorrect
              ? { x: 1, y: 0.5, z: 0 }
              : { x: -1, y: -0.5, z: 0 },
            speed: 0.8,
            spread: 0.3,
            lifetime: 1.5,
            colors: [
              isAnswerCorrect ? 0x00ffaa : 0xff5500,
              isAnswerCorrect ? 0x0066ff : 0xff0066,
            ],
          });
        } else if (typeof secondParticleSystemRef.current.create === 'function') {
          console.log('Using create method');
          secondParticleSystemRef.current.create();
        } else {
          console.log('No particle creation method found, creating manually');
          // Create particles manually
          if (
            secondParticleSceneRef.current &&
            secondParticleSystemRef.current.textures
          ) {
            // Create 3 particles with different frames from the sprite sheet
            for (let i = 0; i < 3; i++) {
              // Select a random frame from the sprite sheet
              const frameIndex = Math.floor(
                Math.random() * spriteSheetConfig.current.totalFrames,
              );

              // Create material with texture - IMPORTANT: clone the texture
              const texture = secondParticleSystemRef.current.textures[0].clone();
              const material = new THREE.SpriteMaterial({
                map: texture,
                blending: THREE.AdditiveBlending,
                transparent: true,
                color: isAnswerCorrect ? 0x00ffaa : 0xff5500,
              });

              // Configure texture to show only one frame
              if (material.map) {
                configureTextureFrame(material.map, frameIndex);
              }

              const particle = new THREE.Sprite(material);

              // Set position relative to weapon with some offset for trail effect
              const offset = i * 0.5;
              particle.position.x =
                weaponPosition.x + dynamicOffset.x - (isAnswerCorrect ? offset : -offset);
              particle.position.y = weaponPosition.y + dynamicOffset.y - offset * 0.2;
              particle.position.z = weaponPosition.z + dynamicOffset.z;

              // Set larger scale
              const scale = 5 - i * 1.5; // Larger particles that get smaller along the trail
              particle.scale.set(scale, scale, scale);

              // Add to scene
              secondParticleSceneRef.current.add(particle);

              // Add to particle system's particles array if it exists
              if (!secondParticleSystemRef.current.particles) {
                secondParticleSystemRef.current.particles = [];
              }
              secondParticleSystemRef.current.particles.push(particle);
            }
          }
        }
      } catch (err) {
        console.error('Error creating particles:', err);
      }
    } else {
      console.log('Cannot create effect:', {
        hasParticleSystem: !!secondParticleSystemRef.current,
        hasModel: !!model,
      });
    }
  }, [
    isAnswerCorrect,
    model,
    secondParticleSystemRef,
    secondParticleSceneRef,
    configureTextureFrame,
  ]);

  // Update the secondParticleAnimationLoop to handle supernatural trail updates
  const secondParticleAnimationLoop = useCallback(
    (time: DOMHighResTimeStamp) => {
      // Update second particle system if active
      if (showSecondParticles && secondParticleSystemRef.current) {
        secondParticleSystemRef.current.update(time);

        // If we're in the weapon movement phase and we have a model,
        // update particle emitter position based on model position
        if (model && model.model) {
          const weaponPosition = model.getWeaponPosition();
          const dynamicOffset = {
            x: isAnswerCorrect ? 1.5 : -1.5,
            y: isAnswerCorrect ? 0.5 : -0.5,
            z: 0,
          };

          // Update particle emitter position
          if (secondParticleSystemRef.current.setPosition) {
            secondParticleSystemRef.current.setPosition(
              weaponPosition.x + dynamicOffset.x,
              weaponPosition.y + dynamicOffset.y,
              weaponPosition.z + dynamicOffset.z,
            );
          }
        }
      }

      // Render the second particles
      if (
        secondParticleRendererRef.current &&
        secondParticleSceneRef.current &&
        secondParticleCameraRef.current
      ) {
        secondParticleRendererRef.current.render(
          secondParticleSceneRef.current,
          secondParticleCameraRef.current,
        );
      }

      // Continue the animation loop if we're still animating
      if (isSecondAnimating) {
        secondAnimationFrameRef.current = requestAnimationFrame(
          secondParticleAnimationLoop,
        );
      }
    },
    [showSecondParticles, isSecondAnimating, model, isAnswerCorrect],
  );

  // Control animation loop based on showParticles state
  useEffect(() => {
    if (showParticles) {
      // Start the animation loop when particles are shown
      setIsAnimating(true);
      animationFrameRef.current = requestAnimationFrame(particleAnimationLoop);
    } else {
      // Stop the animation loop when particles are hidden
      setIsAnimating(false);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    // Clean up on unmount or when dependencies change
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [showParticles, particleAnimationLoop]);

  // Control second animation loop based on showSecondParticles state
  useEffect(() => {
    if (showSecondParticles) {
      // Start the animation loop when second particles are shown
      setIsSecondAnimating(true);
      secondAnimationFrameRef.current = requestAnimationFrame(
        secondParticleAnimationLoop,
      );
    } else {
      // Stop the animation loop when second particles are hidden
      setIsSecondAnimating(false);
      if (secondAnimationFrameRef.current !== null) {
        cancelAnimationFrame(secondAnimationFrameRef.current);
        secondAnimationFrameRef.current = null;
      }
    }

    // Clean up on unmount or when dependencies change
    return () => {
      if (secondAnimationFrameRef.current !== null) {
        cancelAnimationFrame(secondAnimationFrameRef.current);
        secondAnimationFrameRef.current = null;
      }
    };
  }, [showSecondParticles, secondParticleAnimationLoop]);

  // Watch canvas position and hide particles when winning or losing
  useEffect(() => {
    if (canvasPosition === 'winning' || canvasPosition === 'losing') {
      // Fade out particles
      if (
        secondParticleSystemRef.current &&
        secondParticleSystemRef.current.startFadeOut
      ) {
        secondParticleSystemRef.current.startFadeOut(1000);
      }

      // Stop showing new particles after a delay
      setTimeout(() => {
        setShowSecondParticles(false);
      }, 1000);
    }
  }, [canvasPosition]);

  // Create particles at the right time - only start this sequence after model is loaded
  useEffect(() => {
    // Only start the transition sequence if the model is loaded
    if (!modelLoaded) return;

    // In the useEffect that contains transitionSequence
    // Update the transition sequence in the useEffect
    const transitionSequence = async () => {
      await delay(700);
      setCanvasPosition('final');

      // Enable second particles
      setShowSecondParticles(true);

      // Create an initial burst of particles
      createWeaponMovementEffect();
      // Wait for state update to take effect
      await delay(50);

      if (!isAnswerCorrect) {
        await delay(1500);
        setCanvasPosition('losing');
        // Particles will be hidden by the canvasPosition effect
      } else {
        console.log('Starting weapon effect sequence');

        // Show second particles first for weapon movement effect
        setShowSecondParticles(true);
        console.log('Second particles enabled:', showSecondParticles);

        // Start weapon movement effect with more particles and longer duration
        if (secondParticleSystemRef.current) {
          console.log('Creating continuous weapon trail effect');

          // Create continuous weapon trail effect
          const trailInterval = setInterval(() => {
            createWeaponMovementEffect();
          }, 100); // Create new particles every 100ms

          // Stop the trail after 2 seconds (increased from 1 second)
          setTimeout(() => {
            console.log('Stopping weapon trail effect');
            clearInterval(trailInterval);

            // Start fading out the weapon trail
            if (
              secondParticleSystemRef.current &&
              secondParticleSystemRef.current.startFadeOut
            ) {
              secondParticleSystemRef.current.startFadeOut(1200); // Increased from 800ms
            }
          }, 2000); // Increased from 1000ms
        }

        // Wait longer before showing main explosion
        await delay(1000); // Increased from 500ms

        // Show main explosion particles after weapon movement
        setShowParticles(true);

        // Create main explosion effect
        if (particleSceneRef.current && particleSystemRef.current) {
          // Position the particle system at a good spot for the effect
          particleSystemRef.current.setPosition(
            isAnswerCorrect ? 2 : -2,
            isAnswerCorrect ? 1 : -1,
            0,
          );

          // Create main explosion effect
          particleSystemRef.current.create();
          particleSystemRef.current.createSecondaryShockwave();
          particleSystemRef.current.createLightFlash();
          particleSystemRef.current.createDebris(20);

          // Start fading out particles after a delay
          setTimeout(() => {
            if (particleSystemRef.current) {
              particleSystemRef.current.startFadeOut(3000);
            }
          }, 3000);
        }

        await delay(1500);
        setCanvasPosition('winning');
        // Particles will be hidden by the canvasPosition effect
      }
    };

    transitionSequence();

    return () => {
      // Clean up any particle system resources
      if (particleSystemRef.current) {
        particleSystemRef.current.dispose();
      }
      if (secondParticleSystemRef.current) {
        secondParticleSystemRef.current.dispose();
      }
    };
  }, [isAnswerCorrect, modelLoaded, createWeaponMovementEffect]);

  // Use weaponName instead of modelSrc for style decisions
  const canvasClasses = useMemo(() => {
    if (weaponName) {
      return `${className || ''} transition-transform duration-[1.5s] ease-in-out absolute z-50 ${
        canvasPosition === 'initial' ? 'left-[35%] top-[48%]' : 'bottom-0'
      }`;
    } else {
      return `${className || ''} absolute z-50 ${
        canvasPosition === 'initial' ? 'opacity-50' : 'opacity-100'
      }`;
    }
  }, [className, canvasPosition, weaponName]);

  // Setup effect for canvases and renderers
  useEffect(() => {
    const loadModelWithDelay = async () => {
      await delay(500);
      setIsLoading(false);
    };

    loadModelWithDelay();

    // Setup for main model canvas
    const canvasElement = canvasRef.current;
    if (canvasElement) {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) {
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(
          80,
          canvasWidth / canvasHeight,
          0.01,
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

        const pixelRatio = window.devicePixelRatio || 1;
        renderer.setPixelRatio(pixelRatio);
        renderer.setSize(canvasWidth, canvasHeight);
        renderer.setClearColor(0x000000, 0); // Transparent background

        rendererRef.current = renderer;
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
            // Set the model loaded state to true when loading completes
            setModelLoaded(true);
          },
        });
      } else if (!modelSrc) {
        // If there's no model to load, consider it "loaded" immediately
        setModelLoaded(true);
      }

      if (rendererRef.current) {
        rendererRef.current.setAnimationLoop(animationLoop);
      }
    }

    // Setup for first particle canvas
    const particleCanvasElement = particleCanvasRef.current;
    if (particleCanvasElement) {
      if (
        !particleSceneRef.current ||
        !particleCameraRef.current ||
        !particleRendererRef.current
      ) {
        const particleScene = new THREE.Scene();
        particleSceneRef.current = particleScene;

        // Use a wider field of view for particles
        const particleCamera = new THREE.PerspectiveCamera(
          100, // Wider FOV
          (canvasWidth * 3) / (canvasHeight * 3),
          0.01,
          1000,
        );
        particleCamera.position.z = 10; // Further back
        particleCameraRef.current = particleCamera;

        // Add lighting for particles
        const ambientLight = new THREE.AmbientLight(0x666666, 1.5);
        particleScene.add(ambientLight);

        // Add point light for dynamic effects
        const pointLight = new THREE.PointLight(
          isAnswerCorrect ? 0xffaa00 : 0xff3300,
          3,
          15,
          2,
        );
        pointLight.position.set(isAnswerCorrect ? 2 : -2, isAnswerCorrect ? 1 : -1, 0);
        particleScene.add(pointLight);

        // Create renderer with proper settings
        const particleRenderer = new THREE.WebGLRenderer({
          canvas: particleCanvasElement,
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
        });

        particleRenderer.setClearColor(0x000000, 0); // Transparent background
        particleRenderer.setPixelRatio(window.devicePixelRatio || 1);
        particleRenderer.setSize(canvasWidth * 3, canvasHeight * 3);

        particleRendererRef.current = particleRenderer;

        // Initialize particle system
        particleSystemRef.current = new ParticleSystem(
          particleScene,
          ['/assets/gameplay_particles/blood.png'],
          10, // Number of particles
          4, // spriteSheetWidth
          7, // spriteSheetHeight
        );
      }
    }

    // Setup for second particle canvas - using standard ParticleSystem with extensions
    const secondParticleCanvasElement = secondParticleCanvasRef.current;
    if (secondParticleCanvasElement) {
      if (
        !secondParticleSceneRef.current ||
        !secondParticleCameraRef.current ||
        !secondParticleRendererRef.current
      ) {
        const secondParticleScene = new THREE.Scene();
        secondParticleSceneRef.current = secondParticleScene;

        // Use different settings for second particle system
        const secondParticleCamera = new THREE.PerspectiveCamera(
          90, // Different FOV
          (canvasWidth * 2) / (canvasHeight * 2),
          0.01,
          1000,
        );
        secondParticleCamera.position.z = 8; // Different distance
        secondParticleCameraRef.current = secondParticleCamera;

        // Add different lighting for second particle system
        const ambientLight = new THREE.AmbientLight(0x444466, 1.8);
        secondParticleScene.add(ambientLight);

        // Add different point light
        const pointLight = new THREE.PointLight(
          isAnswerCorrect ? 0x00aaff : 0xff0066, // Different colors
          4,
          12,
          2,
        );
        pointLight.position.set(isAnswerCorrect ? -2 : 2, isAnswerCorrect ? 2 : -2, 0);
        secondParticleScene.add(pointLight);

        // Create renderer for second particle system
        const secondParticleRenderer = new THREE.WebGLRenderer({
          canvas: secondParticleCanvasElement,
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
        });

        secondParticleRenderer.setClearColor(0x000000, 0); // Transparent background
        secondParticleRenderer.setPixelRatio(window.devicePixelRatio || 1);
        secondParticleRenderer.setSize(canvasWidth * 2, canvasHeight * 2);

        secondParticleRendererRef.current = secondParticleRenderer;

        // Initialize standard particle system
        secondParticleSystemRef.current = new ParticleSystem(
          secondParticleScene,
          [
            '/assets/gameplay_particles/projectile17.png', // Use the sprite sheet image
          ],
          20, // Different particle count
          spriteSheetConfig.current.columns, // Use the sprite sheet columns
          spriteSheetConfig.current.rows, // Use the sprite sheet rows
        );

        // Configure the texture for the sprite sheet
        if (
          secondParticleSystemRef.current.textures &&
          secondParticleSystemRef.current.textures.length > 0
        ) {
          const texture = secondParticleSystemRef.current.textures[0];
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          // Don't set repeat yet as we'll set it per particle
        }

        // Extend the particle system with our supernatural trail capabilities
        extendParticleSystem(secondParticleSystemRef.current);

        // Add createParticles method if it doesn't exist (for backward compatibility)
        if (!secondParticleSystemRef.current.createParticles) {
          console.log('Adding createParticles method to second particle system');

          // Add createParticles method to the particle system with proper typing
          secondParticleSystemRef.current.createParticles = (
            count = 10,
            options: ParticleOptions = {},
          ) => {
            console.log('Creating particles:', count, options);
            const direction = options.direction || { x: 0, y: 0, z: -1 };
            const speed = options.speed || 1;
            const spread = options.spread || 0.2;
            const lifetime = options.lifetime || 2;
            const colors = options.colors || [0xffffff, 0x88ccff];

            for (let i = 0; i < count; i++) {
              // Select a random frame from the sprite sheet
              const frameIndex = Math.floor(
                Math.random() * spriteSheetConfig.current.totalFrames,
              );

              // Use the first texture in the textures array but clone it
              const texture = secondParticleSystemRef.current.textures[0].clone();

              // Configure texture to show only one frame
              configureTextureFrame(texture, frameIndex);

              const material = new THREE.SpriteMaterial({
                map: texture,
                blending: THREE.AdditiveBlending,
                depthTest: true,
                transparent: true,
              });

              const particle = new THREE.Sprite(material);

              // Set position relative to the particle system's position
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
              particle.userData.age = 0;
              particle.userData.fadeRate = 0.9;
              particle.userData.rotationSpeed = Math.random() * 0.2 - 0.1;

              // Set random color from the provided color array
              const color = new THREE.Color(
                colors[Math.floor(Math.random() * colors.length)],
              );
              particle.material.color = color;

              // Set initial scale - make it larger
              const scale = 5 + Math.random() * 3; // Larger scale
              particle.scale.set(scale, scale, scale);

              // Add to scene and to our particles array - with null check
              if (secondParticleSceneRef.current) {
                secondParticleSceneRef.current.add(particle);
                if (!secondParticleSystemRef.current.particles) {
                  secondParticleSystemRef.current.particles = [];
                }
                secondParticleSystemRef.current.particles.push(particle);
              }
            }

            return secondParticleSystemRef.current.particles;
          };
        }

        // Add a custom startFadeOut method if it doesn't exist
        if (!secondParticleSystemRef.current.startFadeOut) {
          secondParticleSystemRef.current.startFadeOut = (duration = 1000) => {
            if (!secondParticleSystemRef.current.particles) return;

            secondParticleSystemRef.current.particles.forEach(
              (particle: THREE.Sprite) => {
                if (particle && particle.material) {
                  // Store original opacity
                  particle.userData.originalOpacity = particle.material.opacity || 1.0;

                  // Set fade rate based on duration
                  particle.userData.fadeRate =
                    particle.userData.originalOpacity / (duration / 16.67); // 60fps
                }
              },
            );

            // Set global fade flag
            secondParticleSystemRef.current.isFadingOut = true;
          };
        }
      }
    }

    return () => {
      // Cancel any animation frames
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      if (secondAnimationFrameRef.current !== null) {
        cancelAnimationFrame(secondAnimationFrameRef.current);
        secondAnimationFrameRef.current = null;
      }

      // Clean up model
      if (sceneRef.current) {
        sceneRef.current.traverse((child) => cleanUpModel(child));
      }

      // Clean up particles
      if (particleSystemRef.current) {
        particleSystemRef.current.dispose();
      }

      if (secondParticleSystemRef.current) {
        secondParticleSystemRef.current.dispose();
      }

      model?.ComponentRemove(sceneRef.current);

      // Stop animation loops
      if (rendererRef.current) {
        rendererRef.current.setAnimationLoop(null);
        rendererRef.current.clear();
      }

      if (particleRendererRef.current) {
        particleRendererRef.current.setAnimationLoop(null);
        particleRendererRef.current.clear();
      }

      if (secondParticleRendererRef.current) {
        secondParticleRendererRef.current.setAnimationLoop(null);
        secondParticleRendererRef.current.clear();
      }
    };
  }, [
    animationLoop,
    model,
    modelSrc,
    weaponName,
    canvasWidth,
    canvasHeight,
    isLoading,
    isAnswerCorrect,
    configureTextureFrame,
  ]);

  // Style for the main canvas (model)
  const canvasStyle = useMemo<React.CSSProperties>(() => {
    if (weaponName) {
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
        position: 'absolute',
        zIndex: 50,
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
      position: 'absolute',
      zIndex: 50,
    };
  }, [style, canvasPosition, weaponName, isAnswerCorrect]);

  // Style for the first particle canvas
  const particleCanvasStyle = useMemo<React.CSSProperties>(() => {
    const particleCanvasWidth = canvasWidth * 3;
    const particleCanvasHeight = canvasHeight * 3;

    return {
      position: 'absolute',
      width: `\${particleCanvasWidth}px`,
      height: `\${particleCanvasHeight}px`,
      zIndex: 49, // Behind the model canvas
      pointerEvents: 'none',
      top: '75%',
      left: '75%',
      transform: 'translate(-50%, -50%)',
      opacity: showParticles ? 1 : 0,
      transition: 'opacity 0.5s ease-in-out',
    };
  }, [canvasWidth, canvasHeight, showParticles]);

  // Update the secondParticleCanvasStyle to make it more visible
  const secondParticleCanvasStyle = useMemo<React.CSSProperties>(() => {
    const particleCanvasWidth = canvasWidth * 2;
    const particleCanvasHeight = canvasHeight * 2;

    return {
      position: 'absolute',
      width: `\${particleCanvasWidth}px`,
      height: `\${particleCanvasHeight}px`,
      zIndex: 68, // Behind the first particle canvas
      pointerEvents: 'none',
      top: '50%', // Changed from 25% to 50% to be more centered
      left: '50%', // Changed from 25% to 50% to be more centered
      transform: 'translate(-50%, -50%)',
      opacity: showSecondParticles ? 1 : 0,
      transition: 'opacity 0.5s ease-in-out',
    };
  }, [canvasWidth, canvasHeight, showSecondParticles]);

  return (
    <>
      {/* First particle canvas */}
      <canvas
        ref={particleCanvasRef}
        style={particleCanvasStyle}
        className="particle-canvas"
      />

      {/* Second particle canvas */}
      <canvas
        ref={secondParticleCanvasRef}
        style={secondParticleCanvasStyle}
        className="second-particle-canvas"
      />

      {/* Model canvas (rendered in front) */}
      <canvas ref={canvasRef} style={canvasStyle} className={canvasClasses} />
    </>
  );
}

export default ThreeModelRenderer;
