//import ProgressBar from '../atoms/wc-a-progress-bar';
import { LoadFBXAnimation } from '@component/code/atom/cc-a-animation-loader';
import { LoadCharacter } from '@component/code/atom/cc-a-model-loader';
import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';

const CharacterCanvasScene = ({
  characterData,
  className,
}: {
  characterData: { src: string };
  className?: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.Camera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const timeRef = useRef<DOMHighResTimeStamp>();

  const animationIdRef = useRef<any>();

  const animationLoop = useCallback((time: DOMHighResTimeStamp, frame: XRFrame) => {
    if (rendererRef?.current && sceneRef?.current && cameraRef?.current) {
      // initial delta time to 0
      let deltaTime = 0;
      // if not first render, find delta time
      if (timeRef?.current) {
        deltaTime = time - timeRef?.current;
      }
      // update model
      //model.Update({ deltaTime });
      // update renderer
      rendererRef?.current.render(sceneRef?.current, cameraRef?.current);
      // update current time
      timeRef.current = time;
    }
  }, []);

  useEffect(() => {
    // Create a scene
    const scene = new THREE.Scene();

    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, 1280 / 720, 0.1, 1000);
    camera.position.set(0, 0, -2);

    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(1280, 720);
    renderer.setClearColor(0x000000, 0); // Set the background color to black

    // Append the renderer's DOM element to the container

    let PlayerCharacter: any = null;
    let mixer: any = null;

    // Create a Character
    LoadCharacter('A', scene, (character: any) => {
      PlayerCharacter = character;
      scene.add(character);
      character.scale.set(0.05, 0.05, 0.05);
      character.position.z = -15;

      // Load and play an animation
      //console.log(character.animations);

      LoadFBXAnimation(
        'public/assets/animation/Rumba Dancing.fbx',
        (animationClip: any) => {
          character.animations.push(animationClip); // Add the new animation clip to the character's animations array
          mixer = new THREE.AnimationMixer(character);
          const clips = character.animations;

          const clip = THREE.AnimationClip.findByName(clips, 'mixamo.com');
          const action = mixer.clipAction(clip);
          action.play();

          // Play all animations
          clips.forEach(function (clip: any) {
            //clip.play();
            mixer.clipAction(clip).play();
          });
        },
        (error: any) => {},
      );
    });

    // Create lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.y = 10;
    light.position.z = 10;
    light.castShadow = true;

    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;

    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 50;
    light.shadow.camera.left = -50;
    light.shadow.camera.right = 50;
    light.shadow.camera.top = 50;
    light.shadow.camera.bottom = -50;

    scene.add(light);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // Save references to the scene and renderer
    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Render the scene
    function animate() {
      requestAnimationFrame(animate);

      if (mixer) {
        mixer.update(0.01);
      }

      // Update cube rotation
      if (PlayerCharacter) {
        PlayerCharacter.rotation.y += 0.01;
      }
      if (rendererRef.current) rendererRef.current.render(scene, camera);
    }
    animationIdRef.current = animate;
    animate();

    // Clean up on unmount
    return () => {
      console.log('Cleanup: removing model from scene (Character Scene Canvas)');

      // Stop animation loop
      rendererRef.current?.setAnimationLoop(null);

      // Clear and dispose renderer to free GPU memory
      rendererRef.current?.clear();
      rendererRef.current?.dispose();
      rendererRef.current = undefined;

      // Clear scene
      if (sceneRef.current) {
        sceneRef.current.traverse((child: any) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat: any) => mat.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
        sceneRef.current.clear();
        sceneRef.current = undefined;
      }

      console.log('Cleanup complete: renderer and scene disposed');
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default CharacterCanvasScene;
