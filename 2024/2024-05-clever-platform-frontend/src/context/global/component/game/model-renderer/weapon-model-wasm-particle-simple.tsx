import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { InstallGameLighting } from '@component/game/threejs-lighting';
import StoreGlobal from '@store/global/index.ts';
import { getIsModelReady } from '../three-d-model/character-animation-controller';
import { GCAWeaponModel, getWeaponForCharacter } from '../three-d-model/weapon-loader';

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Preload textures to ensure they're available when needed
const textureCache: Record<string, THREE.Texture> = {};
const preloadTexture = (url: string): Promise<THREE.Texture> => {
  return new Promise((resolve, reject) => {
    if (textureCache[url]) {
      resolve(textureCache[url]);
      return;
    }

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      url,
      (texture) => {
        textureCache[url] = texture;
        resolve(texture);
      },
      undefined,
      (error) => {
        reject(error);
      },
    );
  });
};

// Try to preload the textures immediately
preloadTexture('/assets/gameplay_particles/projectile13.png').catch(() => {});
preloadTexture('/assets/gameplay_particles/damage_effect.png').catch(() => {});

interface WeaponModelRendererProps {
  modelSrc?: string;
  className?: string;
  style?: React.CSSProperties;
  isAnswerCorrect: boolean;
  onLoaded?: () => void;
}

export default function WeaponModelRenderer({
  modelSrc,
  className,
  style,
  isAnswerCorrect,
  onLoaded,
}: WeaponModelRendererProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireballCanvasRef = useRef<HTMLCanvasElement>(null);
  const impactCanvasRef = useRef<HTMLCanvasElement>(null);

  const [modelLoaded, setModelLoaded] = useState(false);
  const [fireballLoaded, setFireballLoaded] = useState(false);
  const [impactLoaded, setImpactLoaded] = useState(false);
  const [canvasPosition, setCanvasPosition] = useState('initial');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showImpact, setShowImpact] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isCharacterModelReady, setIsCharacterModelReady] = useState(false);

  // THREE.js refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const fireballSceneRef = useRef<THREE.Scene | null>(null);
  const impactSceneRef = useRef<THREE.Scene | null>(null);

  const cameraRef = useRef<THREE.Camera | null>(null);
  const fireballCameraRef = useRef<THREE.Camera | null>(null);
  const impactCameraRef = useRef<THREE.Camera | null>(null);

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const fireballRendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const impactRendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const timeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Fireball refs
  const fireballSpriteRef = useRef<THREE.Sprite | null>(null);
  const fireballTextureRef = useRef<THREE.Texture | null>(null);
  const fireballMaterialRef = useRef<THREE.SpriteMaterial | null>(null);

  // Impact effect refs
  const impactSpriteRef = useRef<THREE.Sprite | null>(null);
  const impactTextureRef = useRef<THREE.Texture | null>(null);
  const impactMaterialRef = useRef<THREE.SpriteMaterial | null>(null);
  const impactFrameRef = useRef<number>(0);
  const impactLastFrameTimeRef = useRef<number>(0);
  const impactFadeStartTimeRef = useRef<number | null>(null);

  // Animation state
  const frameRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const fadeStartTimeRef = useRef<number | null>(null);
  const fadeDurationRef = useRef<number>(1000);

  const hasInitializedRef = useRef(false);

  const model = useMemo(() => new GCAWeaponModel(), []);
  const weaponName = useMemo(() => getWeaponForCharacter(modelSrc || ''), [modelSrc]);

  // Update sprite position based on weapon position
  const updateSpritePosition = useCallback(
    (sprite: THREE.Sprite) => {
      if (!sprite) return;

      if (model && typeof model.getWeaponPosition === 'function') {
        try {
          const weaponPosition = model.getWeaponPosition() || { x: 0, y: 0, z: 0 };

          const offsetX = isAnswerCorrect ? 1.2 : -1.2;
          const offsetY = isAnswerCorrect ? 0.3 : -0.3;

          let finalOffsetX = offsetX;
          let finalOffsetY = offsetY;

          // Special positioning for Apple model
          if (modelSrc === 'Apple') {
            if (canvasPosition === 'initial') {
              finalOffsetX = isAnswerCorrect ? 0.8 : -0.8;
              finalOffsetY = isAnswerCorrect ? 0.5 : -0.1;
            } else if (canvasPosition === 'final') {
              finalOffsetX = isAnswerCorrect ? 1.0 : -1.0;
              finalOffsetY = isAnswerCorrect ? 0.4 : -0.2;
            } else if (canvasPosition === 'losing') {
              finalOffsetX = -0.3;
              finalOffsetY = -0.8;
            } else if (canvasPosition === 'winning') {
              finalOffsetX = 1.3;
              finalOffsetY = 0.4;
            }
          } else {
            // Original positioning for other models
            if (canvasPosition === 'losing') {
              finalOffsetX = -0.5;
              finalOffsetY = -1.0;
            } else if (canvasPosition === 'winning') {
              finalOffsetX = 1.5;
              finalOffsetY = 0.2;
            }
          }

          let adjustment = { x: 0, y: 0, z: 0.5 }; // default

          switch (true) {
            case modelSrc?.includes('set1_character1_level1') ||
              modelSrc?.includes('set1_character1_level2'):
              adjustment = { x: 4, y: 0.2, z: 0.3 }; // Sword_01
              break;
            case modelSrc?.includes('set1_character1_level3') ||
              modelSrc?.includes('set1_character1_level4') ||
              modelSrc?.includes('set1_character1_level5'):
              adjustment = { x: 4, y: -0.35, z: 0.3 }; // Sword_01
              break;
            case modelSrc?.includes('set1_character2'): // Arrow
              adjustment = { x: 4, y: 0, z: 0.7 };
              break;
            case modelSrc?.includes('set1_character3_level1') ||
              modelSrc?.includes('set1_character3_level2'):
              adjustment = { x: 4, y: 0.2, z: 0.3 }; // Sword_01
              break;
            case modelSrc?.includes('set1_character3_level3') ||
              modelSrc?.includes('set1_character3_level4') ||
              modelSrc?.includes('set1_character3_level5'):
              adjustment = { x: 4, y: -0.35, z: 0.3 }; // Sword_01
              break;
            case modelSrc?.includes('set1_character4'):
              adjustment = { x: 3, y: 0, z: 0.3 }; // Sword_01
              break;

            //set2
            case modelSrc?.includes('set2_character2'):
              adjustment = { x: 4, y: 0, z: 0.3 }; // Sword_1
              break;

            case modelSrc?.includes('set2_character3'):
              adjustment = { x: 2, y: 0, z: 0.3 }; // Hat
              break;

            case modelSrc?.includes('set4_character1'):
              adjustment = { x: 4.1, y: 0.3, z: 0.3 }; // Axe
              break;

            case modelSrc?.includes('set4_character2'):
              adjustment = { x: 6.3, y: 0.3, z: 0.3 }; // Spear
              break;

            case modelSrc?.includes('set4_character3'):
              adjustment = { x: 3.5, y: 0.3, z: 0.3 }; // Spear
              break;
            case modelSrc?.includes('set4_character4'):
              adjustment = { x: 4, y: 0.3, z: 0.3 }; // Spear
              break;
            // default case is already set above
          }

          const finalPosition = {
            x: weaponPosition.x + finalOffsetX + adjustment.x,
            y:
              weaponPosition.y +
              finalOffsetY +
              adjustment.y +
              (isAnswerCorrect ? -0.2 : 0),
            z: weaponPosition.z + adjustment.z,
          };

          sprite.position.set(finalPosition.x, finalPosition.y, finalPosition.z);
        } catch (error) {
          sprite.position.set(isAnswerCorrect ? 2 : -2, 0, 0);
        }
      } else {
        sprite.position.set(isAnswerCorrect ? 2 : -2, 0, 0);
      }
    },
    [model, isAnswerCorrect, canvasPosition, modelSrc],
  );

  // Set up the fireball sprite
  const setupFireball = useCallback(() => {
    if (!fireballSceneRef.current) return;

    const textureUrl = '/assets/gameplay_particles/projectile13.png';

    const createFireballWithTexture = (texture: THREE.Texture) => {
      fireballTextureRef.current = texture;

      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(0.25, 0.5);
      texture.offset.set(0, 0);
      texture.needsUpdate = true;

      const material = new THREE.SpriteMaterial({
        map: texture,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        depthTest: false,
      });

      fireballMaterialRef.current = material;

      const sprite = new THREE.Sprite(material);
      sprite.scale.set(6, 6, 6);

      updateSpritePosition(sprite);

      fireballSpriteRef.current = sprite;
      if (fireballSceneRef.current) {
        fireballSceneRef.current.add(sprite);
        setFireballLoaded(true);
      }
    };

    if (textureCache[textureUrl]) {
      createFireballWithTexture(textureCache[textureUrl].clone());
      return;
    }

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      textureUrl,
      (texture) => {
        textureCache[textureUrl] = texture;
        createFireballWithTexture(texture.clone());
      },
      undefined,
      (error) => {
        if (retryCount < 3) {
          setRetryCount((prev) => prev + 1);

          const alternateTextures = [
            '/assets/gameplay_particles/projectile11.png',
            '/assets/gameplay_particles/projectile16.png',
            '/assets/gameplay_particles/projectile17.png',
          ];

          textureLoader.load(
            alternateTextures[retryCount % alternateTextures.length],
            (altTexture) => {
              createFireballWithTexture(altTexture);
            },
            undefined,
            (altError) => {},
          );
        }
      },
    );
  }, [retryCount, updateSpritePosition]);

  // Set up the impact effect sprite
  const setupImpactEffect = useCallback(() => {
    if (!impactSceneRef.current) return;

    const textureUrl = '/assets/gameplay_particles/damage_effect.png';

    const createImpactWithTexture = (texture: THREE.Texture) => {
      impactTextureRef.current = texture;

      // Update to 2x4 grid
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1 / 4, 1 / 2); // 4 columns, 2 rows
      texture.offset.set(0, 0);
      texture.needsUpdate = true;

      const material = new THREE.SpriteMaterial({
        map: texture,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        depthTest: false,
      });

      impactMaterialRef.current = material;

      const sprite = new THREE.Sprite(material);
      sprite.scale.set(20, 20, 20); // Increased size for visibility

      // Initial position at center
      sprite.position.set(0, 0, 0);

      impactSpriteRef.current = sprite;
      if (impactSceneRef.current) {
        impactSceneRef.current.add(sprite);
        setImpactLoaded(true);
        sprite.visible = false;
      }
    };

    if (textureCache[textureUrl]) {
      createImpactWithTexture(textureCache[textureUrl].clone());
      return;
    }

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      textureUrl,
      (texture) => {
        textureCache[textureUrl] = texture;
        createImpactWithTexture(texture.clone());
      },
      undefined,
      (error) => {
        // Try explosion5.png as fallback
        textureLoader.load(
          '/assets/gameplay_particles/explosion5.png',
          (fallbackTexture) => {
            textureCache[textureUrl] = fallbackTexture;
            createImpactWithTexture(fallbackTexture.clone());
          },
          undefined,
          (fallbackError) => {},
        );
      },
    );
  }, []);

  // Start fading out the fireball
  const startFadeOut = useCallback((duration: number = 1000) => {
    setIsFadingOut(true);
    fadeStartTimeRef.current = performance.now();
    fadeDurationRef.current = duration;
  }, []);

  // Show impact effect
  const showImpactEffect = useCallback(() => {
    if (
      impactSpriteRef.current &&
      impactMaterialRef.current &&
      impactFadeStartTimeRef.current === null
    ) {
      // Make the sprite much larger to ensure visibility
      impactSpriteRef.current.scale.set(60, 60, 60); // Much larger scale

      // Position exactly at center
      impactSpriteRef.current.position.set(0, 0, 0);

      // Set material properties for maximum visibility
      impactMaterialRef.current.opacity = 1.0;
      impactMaterialRef.current.depthTest = false;
      impactMaterialRef.current.depthWrite = false;
      impactMaterialRef.current.blending = THREE.AdditiveBlending;

      // Reset animation state
      impactFrameRef.current = 0;
      impactLastFrameTimeRef.current = performance.now();
      impactFadeStartTimeRef.current = null;

      // Make visible
      impactSpriteRef.current.visible = true;
      setShowImpact(true);
    }
  }, []);

  // Update fireball animation frame
  const updateFireball = useCallback(
    (time: number) => {
      if (
        !fireballSpriteRef.current ||
        !fireballTextureRef.current ||
        !fireballMaterialRef.current
      )
        return;

      updateSpritePosition(fireballSpriteRef.current);

      if (isFadingOut && fadeStartTimeRef.current !== null) {
        const elapsedTime = time - fadeStartTimeRef.current;
        const progress = Math.min(elapsedTime / fadeDurationRef.current, 1.0);
        const opacity = 1.0 - progress;
        fireballMaterialRef.current.opacity = opacity;

        if (progress >= 1.0) {
          fireballSpriteRef.current.visible = false;
          setIsFadingOut(false);
          return;
        }
      }

      if (time - lastFrameTimeRef.current > 100) {
        frameRef.current = (frameRef.current + 1) % 8;
        const column = frameRef.current % 4;
        const row = Math.floor(frameRef.current / 4);
        fireballTextureRef.current.offset.x = column * 0.25;
        fireballTextureRef.current.offset.y = 0.5 - row * 0.5;
        fireballTextureRef.current.needsUpdate = true;
        lastFrameTimeRef.current = time;
      }
    },
    [updateSpritePosition, isFadingOut],
  );

  // Update impact effect animation
  const updateImpactEffect = useCallback(
    (time: number) => {
      if (
        !impactSpriteRef.current ||
        !impactTextureRef.current ||
        !impactMaterialRef.current ||
        !showImpact ||
        !impactSpriteRef.current.visible
      )
        return;

      // Handle fading with extended visibility
      if (impactFadeStartTimeRef.current !== null) {
        const elapsedTime = time - impactFadeStartTimeRef.current;
        const progress = Math.min(elapsedTime / 4500, 1.0);
        impactMaterialRef.current.opacity = 1.0 - progress;

        if (progress >= 1.0) {
          impactSpriteRef.current.visible = false;
          setShowImpact(false);
          return;
        }
      }

      // Variable frame timing for optimal smoothness
      const frameTimings = [
        50, // Frame 0: Initial impact (fast)
        50, // Frame 1: Early expansion (fast)
        70, // Frame 2: Building up (medium)
        90, // Frame 3: Peak impact (longer - key frame)
        90, // Frame 4: Peak impact 2 (longer - key frame)
        70, // Frame 5: Dissipating (medium)
        60, // Frame 6: Fading (medium)
        50, // Frame 7: Final state (fast)
      ];

      // Position adjustments for each frame to add dynamism
      const positionAdjustments = [
        { x: 0.0, y: 0.0 }, // Frame 0: Centered initial impact
        { x: 0.15, y: 0.1 }, // Frame 1: Slight movement up-right
        { x: 0.25, y: 0.2 }, // Frame 2: Continue expanding right
        { x: 0.4, y: 0.15 }, // Frame 3: Peak expansion right
        { x: 0.3, y: -0.1 }, // Frame 4: Start falling slightly
        { x: 0.2, y: -0.25 }, // Frame 5: Continue falling
        { x: 0.1, y: -0.35 }, // Frame 6: Settling down
        { x: 0.05, y: -0.3 }, // Frame 7: Final position
      ];

      const currentFrameTiming = frameTimings[impactFrameRef.current];

      if (time - impactLastFrameTimeRef.current > currentFrameTiming) {
        // Update to handle 8 frames (0-7)
        if (impactFrameRef.current < 7) {
          impactFrameRef.current += 1;
        }

        // Calculate the exact frame coordinates in the 2x4 sprite sheet
        const frames = [
          { col: 0, row: 0 }, // Frame 0: top-left
          { col: 1, row: 0 }, // Frame 1: top-second
          { col: 2, row: 0 }, // Frame 2: top-third
          { col: 3, row: 0 }, // Frame 3: top-right
          { col: 0, row: 1 }, // Frame 4: bottom-left
          { col: 1, row: 1 }, // Frame 5: bottom-second
          { col: 2, row: 1 }, // Frame 6: bottom-third
          { col: 3, row: 1 }, // Frame 7: bottom-right
        ];

        // Get the current frame's position
        const currentFrame = frames[Math.min(impactFrameRef.current, frames.length - 1)];

        // Apply position adjustment for current frame
        const currentPos = positionAdjustments[impactFrameRef.current];

        // Get the base position
        const baseX = 0;
        const baseY = 0;

        // Apply the position adjustment
        impactSpriteRef.current.position.set(
          baseX + currentPos.x,
          baseY + currentPos.y,
          0, // Z position remains unchanged
        );

        // Set the texture offset to show the correct part of the sprite sheet
        impactTextureRef.current.offset.x = currentFrame.col / 4; // 4 columns
        impactTextureRef.current.offset.y = 1.0 - (currentFrame.row + 1) / 2; // 2 rows
        impactTextureRef.current.needsUpdate = true;

        impactLastFrameTimeRef.current = time;

        // After showing frame 6, delay the fade start
        if (impactFrameRef.current >= 6 && impactFadeStartTimeRef.current === null) {
          // Start fading after showing the final frame
          impactFadeStartTimeRef.current = time + 1000;
        }
      }
    },
    [showImpact],
  );

  // Animation loop
  const animationLoop = useCallback(
    (time: number) => {
      const deltaTime = time - timeRef.current;
      model.Update({ deltaTime });
      timeRef.current = time;

      updateFireball(time);
      updateImpactEffect(time);

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      if (
        fireballRendererRef.current &&
        fireballSceneRef.current &&
        fireballCameraRef.current
      ) {
        fireballRendererRef.current.clear();
        fireballRendererRef.current.render(
          fireballSceneRef.current,
          fireballCameraRef.current,
        );
      }

      if (
        impactRendererRef.current &&
        impactSceneRef.current &&
        impactCameraRef.current &&
        showImpact
      ) {
        impactRendererRef.current.clear();
        impactRendererRef.current.render(impactSceneRef.current, impactCameraRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(animationLoop);
    },
    [model, updateFireball, updateImpactEffect, showImpact],
  );

  // Initialize THREE.js scenes, cameras, renderers
  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (canvasElement) {
      const defaultWidth = 600;
      const defaultHeight = 250;
      const canvasWidth = canvasElement.clientWidth || defaultWidth;
      const canvasHeight = canvasElement.clientHeight || defaultHeight;

      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(
        80,
        canvasWidth / canvasHeight,
        0.1,
        1000,
      );
      camera.position.set(0, 0, 6);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      InstallGameLighting(scene);

      const renderer = new THREE.WebGLRenderer({
        canvas: canvasElement,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(canvasWidth, canvasHeight);
      renderer.setClearColor(0x000000, 0);
      rendererRef.current = renderer;

      if (modelSrc) {
        model.Start({
          modelSrc,
          scene,
          renderer,
          onLoaded: () => {
            setModelLoaded(true);
            if (onLoaded) onLoaded();
          },
        });
      } else {
        setModelLoaded(true);
      }
    }

    const fireballCanvasElement = fireballCanvasRef.current;
    if (fireballCanvasElement) {
      const defaultWidth = 600;
      const defaultHeight = 250;
      let canvasWidth = fireballCanvasElement.clientWidth;
      let canvasHeight = fireballCanvasElement.clientHeight;

      if (!canvasWidth || !canvasHeight) {
        const parentElement = fireballCanvasElement.parentElement;
        if (parentElement) {
          canvasWidth = parentElement.clientWidth;
          canvasHeight = parentElement.clientHeight;
        } else {
          canvasWidth = defaultWidth;
          canvasHeight = defaultHeight;
        }
      }

      const fireballScene = new THREE.Scene();
      fireballSceneRef.current = fireballScene;

      const fireballCamera = new THREE.PerspectiveCamera(
        80,
        canvasWidth / canvasHeight,
        0.1,
        1000,
      );
      fireballCamera.position.set(0, 0, 6);
      fireballCamera.lookAt(0, 0, 0);
      fireballCameraRef.current = fireballCamera;

      const fireballRenderer = new THREE.WebGLRenderer({
        canvas: fireballCanvasElement,
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: false,
        powerPreference: 'high-performance',
      });

      fireballRenderer.setSize(canvasWidth, canvasHeight);
      fireballRenderer.setClearColor(0x000000, 0);
      fireballRenderer.render(fireballScene, fireballCamera);
      fireballRendererRef.current = fireballRenderer;
    }

    const impactCanvasElement = impactCanvasRef.current;
    if (impactCanvasElement) {
      const defaultWidth = 1200;
      const defaultHeight = 800;
      let canvasWidth = impactCanvasElement.clientWidth;
      let canvasHeight = impactCanvasElement.clientHeight;

      if (!canvasWidth || !canvasHeight) {
        const parentElement = impactCanvasElement.parentElement;
        if (parentElement) {
          canvasWidth = parentElement.clientWidth * 2; // Double the width
          canvasHeight = parentElement.clientHeight * 2; // Double the height
        } else {
          canvasWidth = defaultWidth;
          canvasHeight = defaultHeight;
        }
      }

      const impactScene = new THREE.Scene();
      impactSceneRef.current = impactScene;

      const impactCamera = new THREE.PerspectiveCamera(
        55,
        canvasWidth / canvasHeight,
        0.5,
        1000,
      );
      impactCamera.position.set(0, 0, 70);
      impactCamera.lookAt(0, 0, -2);
      impactCameraRef.current = impactCamera;

      const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
      impactScene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 3, 30);
      pointLight.position.set(0, 0, 5);
      impactScene.add(pointLight);

      const impactRenderer = new THREE.WebGLRenderer({
        canvas: impactCanvasElement,
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: false,
        powerPreference: 'high-performance',
      });

      // Set size to be much larger than needed
      impactRenderer.setSize(canvasWidth, canvasHeight);
      impactRenderer.setClearColor(0x000000, 0); // Fully transparent background
      impactRenderer.autoClear = true; // Clear before each render
      impactRendererRef.current = impactRenderer;

      setupImpactEffect();
    }

    animationFrameRef.current = requestAnimationFrame(animationLoop);

    const handleResize = () => {
      if (canvasRef.current && rendererRef.current && cameraRef.current) {
        const width = canvasRef.current.clientWidth;
        const height = canvasRef.current.clientHeight;
        rendererRef.current.setSize(width, height);
        (cameraRef.current as THREE.PerspectiveCamera).aspect = width / height;
        (cameraRef.current as THREE.PerspectiveCamera).updateProjectionMatrix();
      }

      if (
        fireballCanvasRef.current &&
        fireballRendererRef.current &&
        fireballCameraRef.current
      ) {
        const width = fireballCanvasRef.current.clientWidth;
        const height = fireballCanvasRef.current.clientHeight;
        fireballRendererRef.current.setSize(width, height);
        (fireballCameraRef.current as THREE.PerspectiveCamera).aspect = width / height;
        (fireballCameraRef.current as THREE.PerspectiveCamera).updateProjectionMatrix();
      }

      if (
        impactCanvasRef.current &&
        impactRendererRef.current &&
        impactCameraRef.current
      ) {
        const width = impactCanvasRef.current.clientWidth;
        const height = impactCanvasRef.current.clientHeight;
        impactRendererRef.current.setSize(width, height);
        (impactCameraRef.current as THREE.PerspectiveCamera).aspect = width / height;
        (impactCameraRef.current as THREE.PerspectiveCamera).updateProjectionMatrix();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      model?.ComponentRemove(sceneRef.current);

      if (rendererRef.current) {
        rendererRef.current.clear();
        rendererRef.current.dispose();
      }

      if (fireballRendererRef.current) {
        fireballRendererRef.current.clear();
        fireballRendererRef.current.dispose();
      }

      if (impactRendererRef.current) {
        impactRendererRef.current.clear();
        impactRendererRef.current.dispose();
      }

      if (fireballSpriteRef.current && fireballSpriteRef.current.parent) {
        fireballSpriteRef.current.parent.remove(fireballSpriteRef.current);
      }

      if (fireballMaterialRef.current) {
        if (fireballMaterialRef.current.map) {
          fireballMaterialRef.current.map.dispose();
        }
        fireballMaterialRef.current.dispose();
      }

      if (fireballTextureRef.current) {
        fireballTextureRef.current.dispose();
      }

      if (impactSpriteRef.current && impactSpriteRef.current.parent) {
        impactSpriteRef.current.parent.remove(impactSpriteRef.current);
      }

      if (impactMaterialRef.current) {
        if (impactMaterialRef.current.map) {
          impactMaterialRef.current.map.dispose();
        }
        impactMaterialRef.current.dispose();
      }

      if (impactTextureRef.current) {
        impactTextureRef.current.dispose();
      }
    };
  }, [model, modelSrc, animationLoop, setupImpactEffect]);

  // Setup fireball when model is loaded
  useEffect(() => {
    if (!modelLoaded || !fireballSceneRef.current) return;
    setupFireball();
  }, [modelLoaded, setupFireball]);

  // Check if character model is ready by polling the imported getIsModelReady function
  useEffect(() => {
    if (!modelLoaded || !fireballLoaded || hasInitializedRef.current) return;

    let pollCount = 0;
    const maxPolls = 100; // Prevent infinite polling

    const checkModelReady = () => {
      pollCount++;
      const currentModelReady = getIsModelReady(); // Use the getter function

      if (currentModelReady) {
        StoreGlobal.MethodGet().loadingSet(false);
        setIsCharacterModelReady(true);
      } else if (pollCount < maxPolls) {
        StoreGlobal.MethodGet().loadingSet(true);
        setTimeout(checkModelReady, 100);
      } else {
        // Proceed anyway after timeout
        setIsCharacterModelReady(true);
      }
    };

    checkModelReady();
  }, [modelLoaded, fireballLoaded]);

  // Animation sequence effect
  useEffect(() => {
    if (!isCharacterModelReady || hasInitializedRef.current) return;

    hasInitializedRef.current = true;

    const initFireball = async () => {
      await delay(800);

      setCanvasPosition('final');
      await delay(1000);

      if (!isAnswerCorrect) {
        await delay(1000);
        setCanvasPosition('losing');
        await delay(100);

        setShowImpact(true);
        setTimeout(() => {
          showImpactEffect();
        }, 500);

        await delay(1200);
        startFadeOut(800);
      } else {
        await delay(700);
        setCanvasPosition('winning');
        await delay(50);

        setShowImpact(true);
        setTimeout(() => {
          showImpactEffect();
        }, 50);

        await delay(1200);
        startFadeOut(1200);
      }
    };

    initFireball();
  }, [isCharacterModelReady, isAnswerCorrect, startFadeOut, showImpactEffect]);

  // Retry fireball setup on failure
  useEffect(() => {
    if (!fireballLoaded && modelLoaded && fireballSceneRef.current && retryCount > 0) {
      setupFireball();
    }
  }, [fireballLoaded, modelLoaded, retryCount, setupFireball]);

  const wrapperStyle = useMemo<React.CSSProperties>(() => {
    let transform = '';
    let opacity = 1;

    if (canvasPosition === 'initial') {
      transform = isAnswerCorrect
        ? 'translate(-65%, -75%) rotate(-15deg) scale(0.9)'
        : 'translate(-65%, -65%) rotate(-10deg) scale(0.9)';
    } else if (canvasPosition === 'final') {
      transform = isAnswerCorrect
        ? 'translate(35%, -73%) rotate(7deg) scale(1)'
        : 'translate(35%, -65%) rotate(18deg) scale(0.95)';
      setTimeout(() => {
        setShowImpact(true);
        showImpactEffect();
      }, 1500);
    } else if (canvasPosition === 'losing') {
      transform = 'translate(-10%, 70%) rotate(-185deg) scale(0.75)';
    } else if (canvasPosition === 'winning') {
      transform = 'translate(35%, -73%) rotate(7deg) scale(1)';
      opacity = 0;
    }

    return {
      position: 'absolute',
      width: '100%',
      height: '100%',
      transform,
      opacity,
      transition: 'transform 1s ease-out, opacity 1s ease-out',
      zIndex: 50,
    };
  }, [canvasPosition, isAnswerCorrect, showImpactEffect]);

  const individualCanvasStyle = useMemo<React.CSSProperties>(
    () => ({
      ...style,
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: '70%',
      left: 0,
    }),
    [style],
  );

  const fireballCanvasStyle = useMemo<React.CSSProperties>(
    () => ({
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: 100,
      pointerEvents: 'none',
      top: isAnswerCorrect ? '69.5%' : '68%',
      left: isAnswerCorrect ? '-11%' : '1%',
    }),
    [isAnswerCorrect],
  );

  const impactCanvasStyle = useMemo<React.CSSProperties>(
    () => ({
      position: 'absolute',
      width: '150%',
      height: '100%',
      zIndex: 110,
      pointerEvents: 'none',
      top: isAnswerCorrect ? '57.5%' : '52%',
      left: isAnswerCorrect ? '81%' : '21%',
      transform: 'translate(-50%, -50%)',
      opacity: showImpact ? 1 : 0,
      transition: 'opacity 0.3s ease-in-out',
      backgroundColor: 'transparent',
    }),
    [showImpact, isAnswerCorrect],
  );

  return (
    <>
      <div
        style={wrapperStyle}
        className={className + `${isCharacterModelReady ? 'visible' : 'hidden'}`}
      >
        <canvas
          ref={canvasRef}
          style={individualCanvasStyle}
          className={`${isCharacterModelReady ? 'opacity-100' : 'opacity-0'}`}
        />
        <canvas
          ref={fireballCanvasRef}
          style={fireballCanvasStyle}
          className={`absolute z-100 ${isCharacterModelReady ? 'visible' : 'hidden'}`}
        />
      </div>

      <canvas
        ref={impactCanvasRef}
        style={impactCanvasStyle}
        className={`absolute z-110 ${isCharacterModelReady ? 'visible' : 'hidden'}`}
      />
    </>
  );
}
