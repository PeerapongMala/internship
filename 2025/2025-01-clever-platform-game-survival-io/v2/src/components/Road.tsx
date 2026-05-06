import { useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, RepeatWrapping } from 'three';

export function Road() {
  const texture = useLoader(TextureLoader, '/Textures/road.jpg');
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(1, 3);

  useEffect(() => {
    let offset = 0;
    let Restarted = false;
    const animate = () => {
      texture.offset.set(0, offset);
      texture.repeat.set(1, offset);
      offset += 0.001;
      offset %= 1;
      if (!Restarted) {
        requestAnimationFrame(animate);
      }
    };

    const animationFrameId = requestAnimationFrame(animate);

    return () => {
      Restarted = true;
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.1, 0]} receiveShadow>
      <planeGeometry args={[40, 1000]} />
      <meshStandardMaterial map={texture} roughness={0.8} metalness={0.2} />
    </mesh>
  );
}
