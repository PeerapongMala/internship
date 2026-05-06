//import ProgressBar from '../atoms/wc-a-progress-bar';
import { LoadFBXAnimation } from '@component/code/atom/cc-a-animation-loader';
import { LoadCharacter } from '@component/code/atom/cc-a-model-loader';
import { InstallGameLighting } from '@component/game/threejs-lighting';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CreateCharacterScene = ({
  characterData,
  className,
}: {
  characterData: { src: string };
  className?: string;
}) => {
  const sceneRef = useRef<any>();
  const rendererRef = useRef<any>();
  const animationIdRef = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);

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
    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
    }

    let PlayerCharacter: any = null;
    let mixer: any = null;

    // Create a Character
    LoadCharacter(characterData.src, scene, (character: any) => {
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

    InstallGameLighting(scene);

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
      renderer.render(scene, camera);
    }
    animationIdRef.current = animate;
    animate();

    // Clean up on unmount
    return () => {
      cancelAnimationFrame(animationIdRef.current);
      if (containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  return (
    <div
      className={className}
      ref={containerRef}
      style={{
        zIndex: 3,
        //backgroundImage: `url(${ImageBGLogin})`,
        left: '100%',
        width: '100%',
        translate: 'translate(-50%,0%)',
      }}
    ></div>
  );
};

export default CreateCharacterScene;
