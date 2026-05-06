import { useEffect, useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, RepeatWrapping } from 'three';
import { PUBLIC_ASSETS_LOCATION } from '@public-assets';
import { TimeManager } from '@/utils/core-utils/timer/time-manager';

// Match the speed with obstacles/walls
const ROAD_SCROLL_SPEED = 2; // Config to be same speed as OBSTACLE_CONFIG.SPEED and WALL_CONFIG.SPEED
const ROAD_LENGTH = 1000; // Same as planeGeometry args[1]

export function Road(props: { lanes: number, laneWidth: number }) {
  // const texture = useLoader(TextureLoader, "/Textures/road.jpg");
  const texture = useLoader(TextureLoader, PUBLIC_ASSETS_LOCATION.image.texture.road);
  const offsetRef = useRef(0);

  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(props.lanes, 10);

  useEffect(() => {
    const timeManager = TimeManager.getInstance();

    const unsubUpdate = timeManager.update(() => {
      // Only scroll road when game is playing
      if (!timeManager.isPlaying()) return;

      // Calculate offset based on speed and road length
      // offset = (speed / roadLength) to match obstacle movement
      offsetRef.current += ROAD_SCROLL_SPEED / ROAD_LENGTH;
      offsetRef.current %= 1;

      // Only update offset.y (vertical scroll), keep repeat constant
      texture.offset.set(0, offsetRef.current);
    });

    return () => {
      unsubUpdate();
    };
  }, [texture]); return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.1, 0]} receiveShadow>
      <planeGeometry args={[props.lanes * props.laneWidth, ROAD_LENGTH]} />
      <meshStandardMaterial map={texture} roughness={0.8} metalness={0.2} />
    </mesh>
  );
}
