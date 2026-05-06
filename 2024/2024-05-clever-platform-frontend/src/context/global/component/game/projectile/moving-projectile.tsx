import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface MovingProjectileProps {
  className?: string;
  style?: React.CSSProperties;
}

export const MovingProjectile = ({ className, style }: MovingProjectileProps) => {
  const movingObjectRef = useRef<THREE.Mesh>();
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();

  useEffect(() => {
    const initScene = () => {
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const cube = createCube();
      scene.add(cube);
      movingObjectRef.current = cube;

      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(1200, 600);
      rendererRef.current = renderer;

      const container = document.querySelector('.moving-object-container');
      if (container) {
        container.appendChild(renderer.domElement);
      }

      const camera = new THREE.PerspectiveCamera(75, 800 / 400, 0.1, 1000);
      camera.position.z = 5;
      camera.position.y = 0;

      const animate = () => {
        requestAnimationFrame(animate);
        updateCubePosition();
        renderer.render(scene, camera);
      };

      animate();
    };

    const createCube = () => {
      const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const material = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.5,
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(-4, 0, 0);
      return cube;
    };

    const updateCubePosition = () => {
      if (movingObjectRef.current) {
        movingObjectRef.current.position.x += 0.1;
        if (movingObjectRef.current.position.x > 4) {
          movingObjectRef.current.position.x = -4;
        }
      }
    };

    const cleanup = () => {
      if (rendererRef.current) {
        const container = document.querySelector('.moving-object-container');
        if (container) {
          container.removeChild(rendererRef.current.domElement);
        }
      }
    };

    initScene();
    return cleanup;
  }, []);

  return <div className={`moving-object-container ${className || ''}`} style={style} />;
};

export default MovingProjectile;
