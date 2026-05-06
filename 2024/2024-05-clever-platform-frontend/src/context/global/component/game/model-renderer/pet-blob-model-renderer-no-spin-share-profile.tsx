import { StoreModelFileMethods } from '@global/store/global/avatar-models/index';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

/**
 * Pet position/scale config for Share Profile page
 * ปรับค่าที่นี่เพื่อเปลี่ยนตำแหน่ง/ขนาดของสัตว์เลี้ยงในหน้า Share
 */
function getShareProfilePetConfig(petName: string): {
  scale: number;
  positionX: number;
  positionY: number;
  positionZ: number;
  rotateY: number;
} {
  // Default config
  const defaultConfig = {
    scale: 0.055,
    positionX: 0,
    positionY: 0,
    positionZ: -1.5,
    rotateY: -0.7,
  };

  const configs: Record<string, Partial<typeof defaultConfig>> = {
    Peacock: { scale: 0.01, positionX: 0.5 },
    Anteater_B: { scale: 0.05, positionX: 0.5 },
    Anteater_A: { scale: 0.065, positionX: 0.7 },
    Armadillo_A: { scale: 0.055, positionX: 0.3 },
    Armadillo_B: { scale: 0.055, positionX: 0.3 },
    Bison: { scale: 0.065, positionX: 0.8 },
    Chipmunk_A: { scale: 0.065, positionX: 0.4 },
    Elk_A: { scale: 0.065, positionX: 0.2 },
    Iguana_A: { scale: 0.045, positionX: 0.2 },
    Iguana_B: { scale: 0.045, positionX: 0.2 },
    Malayan_A: { scale: 0.055, positionX: 0 },
    Mole: { scale: 0.065, positionX: 0.2 },
    Otter_A: { scale: 0.075, positionX: 0.2 },
    Pangolin_A: { scale: 0.055, positionX: 0.2 },
    Possum_A: { scale: 0.055, positionX: 0.2 },
    Redpanda_A: { scale: 0.055, positionX: 0.2 },
    Sloth_A: { scale: 0.055, positionX: 0.3 },
  };

  const petConfig = configs[petName] || {};
  return { ...defaultConfig, ...petConfig };
}

interface PetModelRendererProps {
  modelSrc: string;
  className?: string;
  style?: React.CSSProperties;
  autoRotate?: boolean;
}

const PetBlobModelRenderer: React.FC<PetModelRendererProps> = ({
  modelSrc,
  className = 'h-full w-full',
  style,
  autoRotate = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scene] = useState<THREE.Scene>(new THREE.Scene());
  const [camera] = useState<THREE.PerspectiveCamera>(
    new THREE.PerspectiveCamera(70, 1, 0.005, 2000),
  );
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null);
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const requestRef = useRef<number | null>(null);
  const clock = useRef<THREE.Clock>(new THREE.Clock());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [animationInterval, setAnimationInterval] = useState(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    camera.position.z = 3;
    camera.position.y = 1;
    camera.lookAt(0, 0, 0);

    const newRenderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    newRenderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    newRenderer.setPixelRatio(window.devicePixelRatio);
    newRenderer.outputColorSpace = THREE.SRGBColorSpace;
    setRenderer(newRenderer);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 2);
    scene.add(directionalLight);

    const handleResize = () => {
      if (!canvasRef.current || !renderer) return;

      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }

      if (newRenderer) {
        newRenderer.dispose();
      }

      while (scene.children.length > 0) {
        const object = scene.children[0];
        scene.remove(object);
      }
    };
  }, []);

  useEffect(() => {
    if (!renderer) return;

    const animate = () => {
      if (mixer) {
        mixer.update(clock.current.getDelta());
      }

      if (autoRotate && model) {
      }

      renderer.render(scene, camera);
      requestRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };
  }, [renderer, mixer, model, autoRotate, scene, camera]);

  useEffect(() => {
    console.log('Pet model name: ', modelSrc);
    if (!modelSrc || !renderer) return;

    setIsLoading(true);

    const loadModel = async () => {
      try {
        const modelBlob = await StoreModelFileMethods.getItem(modelSrc);
        if (!modelBlob) {
          console.error(`Model ${modelSrc} not found in IndexedDB`);
          setIsLoading(false);
          return;
        }

        const objectUrl = URL.createObjectURL(modelBlob);

        if (model) {
          scene.remove(model);
          setModel(null);
        }

        const loader = new FBXLoader();
        loader.load(
          objectUrl,
          (fbxModel) => {
            fbxModel.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });

            // Use config function instead of switch statement
            const petConfig = getShareProfilePetConfig(modelSrc);
            fbxModel.scale.set(petConfig.scale, petConfig.scale, petConfig.scale);

            const box = new THREE.Box3().setFromObject(fbxModel);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            // Apply position from config + centering adjustment
            fbxModel.position.x = -center.x + petConfig.positionX;
            fbxModel.position.y = -center.y + size.y / 2 + petConfig.positionY;
            fbxModel.position.z = petConfig.positionZ;
            fbxModel.rotateY(petConfig.rotateY);
            scene.add(fbxModel);
            setModel(fbxModel);

            if (fbxModel.animations && fbxModel.animations.length > 0) {
              const newMixer = new THREE.AnimationMixer(fbxModel);
              const action = newMixer.clipAction(fbxModel.animations[0]);
              action.play();
              setMixer(newMixer);
            }

            loadAnimation(modelSrc, fbxModel);

            URL.revokeObjectURL(objectUrl);
            setIsLoading(false);
            setTimeout(() => {
              setModelLoaded(true);
            }, 100);
          },
          undefined,
          (error) => {
            console.error('Error loading model:', error);
            URL.revokeObjectURL(objectUrl);
            setIsLoading(false);
          },
        );
      } catch (error) {
        console.error('Error loading model:', error);
        setIsLoading(false);
      }
    };

    const loadAnimation = async (modelId: string, loadedModel: THREE.Group) => {
      try {
        const animId = `${modelId}_Anim`;
        const animBlob = await StoreModelFileMethods.getItem(animId);

        if (!animBlob) {
          return;
        }

        const objectUrl = URL.createObjectURL(animBlob);

        const loader = new FBXLoader();
        loader.load(
          objectUrl,
          (animModel) => {
            if (!animModel.animations || animModel.animations.length === 0) {
              URL.revokeObjectURL(objectUrl);
              return;
            }

            const newMixer = new THREE.AnimationMixer(loadedModel);
            const action = newMixer.clipAction(animModel.animations[4]);
            action.play();

            setMixer(newMixer);
            URL.revokeObjectURL(objectUrl);
          },
          undefined,
          (error) => {
            console.error('Error loading animation:', error);
            URL.revokeObjectURL(objectUrl);
          },
        );
      } catch (error) {
        console.error('Error loading animation:', error);
      }
    };

    loadModel();
  }, [modelSrc, renderer, scene]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className={className + `${modelLoaded ? ' opacity-100' : ' opacity-0'}`}
        style={style}
      />
    </>
  );
};

export default PetBlobModelRenderer;
