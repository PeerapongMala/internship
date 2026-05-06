import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { VRM, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { ModelFileLoader } from '../model-file-loader';

/**
 * ModelViewer
 * A React + TypeScript Three.js viewer that supports FBX, GLTF/GLB, OBJ+MTL, and VRM
 * - Progress overlay & error state
 * - Animation support (AnimationMixer)
 * - VRM avatar support with blinking and breathing
 * - OrbitControls (pan/zoom/rotate)
 * - Auto‑resize
 * - Proper cleanup & GPU resource disposal
 * - Simple props for quick customization
 *
 * Usage
 * -----
 * <ModelViewer src="/models/character.fbx" autoRotate />
 * <ModelViewer src="/models/scene.glb" />
 * <ModelViewer src="/models/model.obj" mtl="/models/model.mtl" />
 * <ModelViewer src="/models/avatar.vrm" />
 */

export type ModelViewerProps = {
  /** URL to the model file */
  src: string;
  /** Optional: for OBJ, provide MTL material file */
  mtl?: string;
  modelType?: 'fbx' | 'glb' | 'gltf' | 'obj' | 'vrm'; // ถ้าไม่ระบุ จะตรวจสอบจากนามสกุลไฟล์
  cameraPosition?: [number, number, number];
  background?: string | number;
  autoRotate?: boolean;
  scale?: number;
  exposure?: number;
  /** Auto-fit camera to model bounds */
  autoFitCamera?: boolean;
  /** Camera distance multiplier when auto-fitting (default: 1.5) */
  cameraDistanceMultiplier?: number;
  /** Camera vertical offset when auto-fitting (default: 0) */
  cameraVerticalOffset?: number;
  onProgress?: (p: number) => void;
  onError?: (err: unknown) => void;
};

const disposeObject3D = (obj: THREE.Object3D) => {
  obj.traverse((child: any) => {
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((m: any) => {
        for (const key in m) {
          const val = m[key];
          if (val && val.isTexture) val.dispose();
        }
        m.dispose?.();
      });
    }
  });
};

const ModelViewer: React.FC<ModelViewerProps> = ({
  src,
  mtl,
  modelType,
  cameraPosition = [0, 1.2, 3.2],
  background = 0x111827,
  autoRotate = false,
  scale = 0.01,
  exposure = 1,
  autoFitCamera = true,
  cameraDistanceMultiplier = 1.5,
  cameraVerticalOffset = 0,
  onProgress,
  onError,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  // const vrmRef = useRef<VRM | null>(null); // สำหรับ VRM models
  const reqRef = useRef<number | null>(null);

  // สำหรับวนเล่นอนิเมชั่นทั้งหมดใน FBX
  const animationIndexRef = useRef(0);
  const animationsRef = useRef<THREE.AnimationClip[]>([]);
  const currentActionRef = useRef<THREE.AnimationAction | null>(null);

  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // เพิ่มฟังก์ชันสำหรับปรับกล้องให้พอดีกับโมเดล
  const fitCameraToModel = (obj: THREE.Object3D | THREE.Group, camera: THREE.PerspectiveCamera, controls: OrbitControls) => {
    const box = new THREE.Box3().setFromObject(obj);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    box.getSize(size);
    box.getCenter(center);

    // คำนวณระยะห่างที่เหมาะสมตาม bounding box
    const maxDimension = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180); // แปลงเป็น radians
    let distance = Math.abs(maxDimension / Math.sin(fov / 2)) * cameraDistanceMultiplier;

    // ป้องกันระยะใกล้เกินไปหรือไกลเกินไป
    distance = Math.max(distance, maxDimension * 2);
    distance = Math.min(distance, maxDimension * 10);

    // ตั้งตำแหน่งกล้องให้มองโมเดลจากมุม 45 องศา
    const theta = Math.PI / 4; // 45 degrees
    const phi = Math.PI / 6;   // 30 degrees from horizontal

    camera.position.set(
      center.x + distance * Math.sin(phi) * Math.cos(theta),
      center.y + distance * Math.cos(phi) + cameraVerticalOffset,
      center.z + distance * Math.sin(phi) * Math.sin(theta)
    );

    // ตั้งค่า controls ให้มองที่ center ของโมเดล
    controls.target.copy(center);
    controls.update();

    // อัปเดต near/far planes ให้เหมาะสม
    camera.near = distance / 100;
    camera.far = distance * 100;
    camera.updateProjectionMatrix();

    console.log(`📷 Auto-fitted camera:`, {
      modelSize: { x: size.x.toFixed(2), y: size.y.toFixed(2), z: size.z.toFixed(2) },
      modelCenter: { x: center.x.toFixed(2), y: center.y.toFixed(2), z: center.z.toFixed(2) },
      cameraDistance: distance.toFixed(2),
      cameraPosition: {
        x: camera.position.x.toFixed(2),
        y: camera.position.y.toFixed(2),
        z: camera.position.z.toFixed(2)
      }
    });
  };

  useEffect(() => {
    const mount = mountRef.current!;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = exposure;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(background as any);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000,
    );

    // ตั้งตำแหน่งเริ่มต้น (อาจจะถูกเปลี่ยนโดย autoFitCamera)
    if (!autoFitCamera) {
      camera.position.set(...cameraPosition);
    }
    cameraRef.current = camera;

    const hemi = new THREE.HemisphereLight(0xffffff, 0x222244, 1.0);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 2.0);
    dir.position.set(5, 10, 7.5);
    scene.add(dir);

    const grid = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
    grid.position.y = 0;
    scene.add(grid);

    // เพิ่มแกนพิกัด (AxesHelper) เพื่อแสดงทิศทาง X, Y, Z
    const axesHelper = new THREE.AxesHelper(2); // ขนาด 2 หน่วย
    // X = สีแดง, Y = สีเขียว, Z = สีน้ำเงิน
    scene.add(axesHelper);

    // เพิ่มป้ายข้อความบอกทิศทางแกน
    const createAxisLabel = (text: string, position: THREE.Vector3, color: number) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.width = 64;
      canvas.height = 32;
      context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
      context.font = 'Bold 20px Arial';
      context.textAlign = 'center';
      context.fillText(text, 32, 20);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.copy(position);
      sprite.scale.set(0.5, 0.25, 1);
      scene.add(sprite);
    };

    // สร้างป้ายแกน X, Y, Z
    createAxisLabel('X', new THREE.Vector3(2.3, 0, 0), 0xff0000); // แดง
    createAxisLabel('Y', new THREE.Vector3(0, 2.3, 0), 0x00ff00); // เขียว  
    createAxisLabel('Z', new THREE.Vector3(0, 0, 2.3), 0x0000ff); // น้ำเงิน

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.5;
    controlsRef.current = controls;

    const onLoad = (loadedObj: THREE.Object3D | THREE.Group) => {
      loadedObj.scale.setScalar(scale);
      const box = new THREE.Box3().setFromObject(loadedObj);
      const center = new THREE.Vector3();
      box.getCenter(center);
      loadedObj.position.sub(center.multiplyScalar(scale));
      loadedObj.traverse((c: any) => {
        c.castShadow = false;
        c.receiveShadow = false;
      });
      scene.add(loadedObj);
      modelRef.current = loadedObj;

      // ปรับกล้องให้พอดีกับโมเดล (หลังจากโมเดลถูกเพิ่มในฉาก)
      if (autoFitCamera && controlsRef.current) {
        fitCameraToModel(loadedObj, camera, controlsRef.current);
      }

      // Animation support: เล่นอนิเมชั่นทั้งหมดแบบวนซ้ำ (รองรับทั้ง FBX และ GLTF/GLB)
      console.log('🔍 Checking for animations...', {
        hasAnimations: !!(loadedObj as any).animations,
        animationCount: (loadedObj as any).animations?.length || 0,
        objectType: loadedObj.type,
        objectConstructor: loadedObj.constructor.name
      });

      // ฟังก์ชันสำหรับตรวจสอบและแก้ไข animation duration
      const fixAnimationDuration = (clip: THREE.AnimationClip): THREE.AnimationClip => {
        if (clip.duration <= 0 && clip.tracks && clip.tracks.length > 0) {
          let maxTime = 0;
          clip.tracks.forEach(track => {
            if (track.times && track.times.length > 0) {
              const trackMaxTime = Math.max(...Array.from(track.times));
              maxTime = Math.max(maxTime, trackMaxTime);
            }
          });

          if (maxTime > 0) {
            clip.duration = maxTime;
            console.log(`🔧 Fixed animation "${clip.name}" duration from 0 to ${maxTime.toFixed(2)}s`);
          } else {
            // ถ้ายังไม่มี duration ให้ใช้ค่าเริ่มต้น 3 วินาที
            clip.duration = 3.0;
            console.log(`⚠️ Set default duration for "${clip.name}": 3.00s`);
          }
        }
        return clip;
      };

      // ฟังก์ชันสำหรับการเล่นอนิเมชั่น
      const setupAnimations = (animations: THREE.AnimationClip[]) => {
        if (!animations || animations.length === 0) return;

        const mixer = new THREE.AnimationMixer(loadedObj);
        mixerRef.current = mixer;

        // แก้ไข duration ของทุก animation
        const fixedClips = animations.map(fixAnimationDuration);
        animationsRef.current = fixedClips;

        console.log(`🎬 Found ${fixedClips.length} animations:`, fixedClips.map((clip, index) => ({
          index: index + 1,
          name: clip.name,
          duration: clip.duration.toFixed(2) + 's',
          tracks: clip.tracks?.length || 0,
          tracksInfo: clip.tracks?.slice(0, 3).map(track => ({
            name: track.name,
            times: track.times?.length || 0,
            values: track.values?.length || 0
          })) || []
        })));

        // กรองเฉพาะ animations ที่มี duration > 0
        const playableClips = fixedClips.filter(clip => clip.duration > 0);

        if (playableClips.length === 0) {
          console.warn('❌ No playable animations found (all have 0 duration after fixing)');
          return;
        }

        // เล่นอนิเมชั่นแรก
        animationIndexRef.current = 0;
        const firstClip = playableClips[0];
        const action = mixer.clipAction(firstClip);
        action.reset();
        action.setLoop(THREE.LoopRepeat, Infinity);
        action.play();
        currentActionRef.current = action;

        console.log(`▶️ Playing animation: ${firstClip.name} (duration: ${firstClip.duration.toFixed(2)}s)`);
        console.log('🎮 Animation action details:', {
          clipName: firstClip.name,
          clipDuration: firstClip.duration,
          enabled: action.enabled,
          paused: action.paused,
          time: action.time,
          timeScale: action.timeScale,
          weight: action.weight,
          isRunning: action.isRunning()
        });

        // ถ้ามีอนิเมชั่นที่เล่นได้มากกว่า 1 ตัว ให้ตั้ง timer เพื่อเปลี่ยนอนิเมชั่น
        if (playableClips.length > 1) {
          const switchAnimation = () => {
            animationIndexRef.current = (animationIndexRef.current + 1) % playableClips.length;
            const nextClip = playableClips[animationIndexRef.current];

            if (currentActionRef.current) {
              currentActionRef.current.fadeOut(0.5);
            }

            const nextAction = mixer.clipAction(nextClip);
            nextAction.reset();
            nextAction.setLoop(THREE.LoopRepeat, Infinity);
            nextAction.fadeIn(0.5);
            nextAction.play();
            currentActionRef.current = nextAction;

            console.log(`🔄 Switched to animation [${animationIndexRef.current + 1}/${playableClips.length}]: ${nextClip.name} (duration: ${nextClip.duration.toFixed(2)}s)`);

            // ตั้งเวลาสำหรับอนิเมชั่นถัดไป (ใช้ minimum 2 วินาทีถ้า duration น้อยเกินไป)
            const switchTime = Math.max(nextClip.duration * 1000, 2000) + 500;
            setTimeout(switchAnimation, switchTime);
          };

          // เริ่มการเปลี่ยนอนิเมชั่นหลังจากอนิเมชั่นแรกจบ
          const firstSwitchTime = Math.max(firstClip.duration * 1000, 2000);
          setTimeout(switchAnimation, firstSwitchTime);
        }
      };

      // ตรวจสอบอนิเมชั่นในระดับ root object
      if ((loadedObj as any).animations && (loadedObj as any).animations.length > 0) {
        setupAnimations((loadedObj as any).animations);
      } else {
        console.log('ℹ️ No animations found in root object, checking children...');

        // ตรวจสอบ children ของ object ด้วย (บางครั้งอนิเมชั่นอยู่ใน children)
        let foundAnimations: THREE.AnimationClip[] = [];
        loadedObj.traverse((child: any) => {
          if (child.animations && child.animations.length > 0) {
            console.log(`🔍 Found animations in child object:`, {
              childType: child.type,
              childName: child.name,
              animationCount: child.animations.length,
              animationNames: child.animations.map((clip: any) => clip.name)
            });
            foundAnimations = foundAnimations.concat(child.animations);
          }
        });

        if (foundAnimations.length > 0) {
          console.log(`✅ Collected ${foundAnimations.length} animations from children`);
          setupAnimations(foundAnimations);
        } else {
          console.log('❌ No animations found in model or its children');
        }
      }
    };

    ModelFileLoader({
      parentObj: scene,
      src: src,
      mtl: mtl,
      modelType,
      scale: scale,
      // rotation,
      // anchorPoint: 'center',
      // percentOffset,
      hitboxEnabled: false,
      debugEnabled: true,
      castShadow: false,
      receiveShadow: false,
      onLoadComplete: onLoad,
      onProgress: (p) => { setProgress(p); onProgress?.(p); },
      onError: (err) => { setError(String(err)); onError?.(err); },
    });

    const clock = new THREE.Clock();
    const tick = () => {
      const dt = clock.getDelta();
      controls.update();

      // // Update VRM
      // if (vrmRef.current) {
      //   vrmRef.current.update(dt);
      // }

      // Debug mixer update
      if (mixerRef.current) {
        mixerRef.current.update(dt);

        // // Log mixer activity occasionally (every 60 frames)
        // if (Math.floor(clock.elapsedTime) % 1 < 0.016 && currentActionRef.current) {
        //   console.log('🎭 Mixer update:', {
        //     deltaTime: dt.toFixed(4),
        //     elapsedTime: clock.elapsedTime.toFixed(2),
        //     currentAction: currentActionRef.current ? {
        //       time: currentActionRef.current.time.toFixed(2),
        //       enabled: currentActionRef.current.enabled,
        //       paused: currentActionRef.current.paused,
        //       weight: currentActionRef.current.weight,
        //       isRunning: currentActionRef.current.isRunning()
        //     } : null
        //   });
        // }
      }

      renderer.render(scene, camera);
      reqRef.current = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
      window.removeEventListener('resize', onResize);
      controls.dispose();

      // // Cleanup VRM
      // if (vrmRef.current) {
      //   // Clear blinking timer if exists
      //   if ((vrmRef.current as any).blinkingTimer) {
      //     clearInterval((vrmRef.current as any).blinkingTimer);
      //   }
      //   // VRM doesn't have dispose method, but we clear the reference
      //   vrmRef.current = null;
      // }

      if (modelRef.current) {
        disposeObject3D(modelRef.current);
        scene.remove(modelRef.current);
      }
      renderer.dispose();
      // @ts-ignore
      renderer.forceContextLoss?.();
      controlsRef.current = null;
      mixerRef.current = null;
      modelRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      mount.removeChild(renderer.domElement);
      animationsRef.current = [];
      currentActionRef.current = null;
    };
  }, [src, mtl, background, autoRotate, scale, exposure, autoFitCamera, cameraDistanceMultiplier, cameraVerticalOffset, onProgress, onError]);

  return (
    <div className="relative h-[70vh] w-full overflow-hidden rounded-2xl bg-gray-900 shadow-lg">
      <div ref={mountRef} className="absolute inset-0" />

      {progress < 1 && !error && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="rounded-2xl bg-black/50 px-5 py-3 text-white shadow-2xl">
            <div className="text-sm opacity-90">Loading 3D Model…</div>
            <div className="mt-2 h-2 w-64 overflow-hidden rounded bg-white/20">
              <div
                className="h-full bg-white"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <div className="mt-1 text-right text-xs opacity-80">
              {Math.round(progress * 100)}%
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="rounded-xl bg-red-600 px-4 py-2 text-white shadow">{error}</div>
        </div>
      )}

      <div className="absolute right-3 bottom-2 text-xs text-white/70">
        drag = rotate • wheel = zoom • shift+drag = pan
      </div>
    </div>
  );
};

export default ModelViewer;

//* Usage example
/*
{
<ModelViewer src="/models/character.fbx" autoRotate />
<ModelViewer src="/models/scene.glb" />
<ModelViewer src="/models/model.obj" mtl="/models/model.mtl" />
<ModelViewer src="/models/avatar.vrm" autoFitCamera={true} />
}
*/
