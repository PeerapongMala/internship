import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
// import { VRM, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';

const addParentObj = (
  loadedObj: THREE.Object3D | THREE.Group,
  scale: number,
  rotation?: [number, number, number],
  anchorPoint: string = 'center',
  parentObj?: THREE.Object3D,
  percentOffset?: THREE.Vector3,
  hitboxEnabled?: boolean,
  debugEnabled?: boolean,
  onLoadComplete?: (obj: THREE.Object3D | THREE.Group, group: THREE.Object3D) => void,
) => {
  // debugEnabled = true;
  // hitboxEnabled = true;

  if (parentObj === undefined) parentObj = new THREE.Object3D();

  // Apply rotation first
  if (rotation) {
    loadedObj.rotation.set(
      THREE.MathUtils.degToRad(rotation[0]),
      THREE.MathUtils.degToRad(rotation[1]),
      THREE.MathUtils.degToRad(rotation[2]),
    );
  }

  loadedObj.scale.setScalar(scale);
  const box = new THREE.Box3().setFromObject(loadedObj);
  const center = new THREE.Vector3();
  const size = new THREE.Vector3();

  // Compute the bounding box
  box.getCenter(center);
  box.getSize(size);

  // Calculate anchor position based on anchorPoint
  let anchorPosition = new THREE.Vector3();

  switch (anchorPoint) {
    case 'bottom':
    case 'bottom-center':
      anchorPosition.set(center.x, box.min.y, center.z);
      break;
    case 'top':
    case 'top-center':
      anchorPosition.set(center.x, box.max.y, center.z);
      break;
    case 'front':
      anchorPosition.set(center.x, center.y, box.max.z);
      break;
    case 'back':
      anchorPosition.set(center.x, center.y, box.min.z);
      break;
    case 'left':
      anchorPosition.set(box.min.x, center.y, center.z);
      break;
    case 'right':
      anchorPosition.set(box.max.x, center.y, center.z);
      break;
    case 'center':
    default:
      anchorPosition.copy(center);
      break;
  }

  // Position object so anchor point is at origin
  loadedObj.position.sub(anchorPosition.multiplyScalar(scale));

  if (percentOffset) {
    loadedObj.position.set(
      (size.x * percentOffset.x) / 100,
      (size.y * percentOffset.y) / 100,
      (size.z * percentOffset.z) / 100,
    );
  }

  if (debugEnabled) {
    const helper = new THREE.BoxHelper(loadedObj, 0x0000ff);
    parentObj.add(helper);
    helper.update();

    // แสดง anchor point ด้วย sphere สีแดง
    const anchorSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.1 * scale, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    );
    anchorSphere.position.set(0, 0, 0); // Anchor point จะอยู่ที่ origin
    parentObj.add(anchorSphere);

    // แสดง center ด้วย sphere สีเขียว
    const centerSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.08 * scale, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
    );

    // คำนวณ center position หลังจาก anchor adjustment
    const currentBox = new THREE.Box3().setFromObject(loadedObj);
    const currentCenter = new THREE.Vector3();
    currentBox.getCenter(currentCenter);
    centerSphere.position.copy(currentCenter);
    parentObj.add(centerSphere);
  }

  if (hitboxEnabled) {
    const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: debugEnabled ? 1 : 0,
      wireframe: debugEnabled,
      color: new THREE.Color(0, 255, 0),
      // side: THREE.DoubleSide,
    });
    let hitbox = new THREE.Mesh(geometry, material);
    parentObj.add(hitbox);
  }

  parentObj.add(loadedObj);

  // return parentObj;
  onLoadComplete?.(loadedObj, parentObj);
};

export type ModelLoaderProps = {
  parentObj?: THREE.Object3D | THREE.Group;
  /** URL to the model file */
  src: string;
  /** Optional: for OBJ, provide MTL material file */
  mtl?: string;
  modelType?: 'fbx' | 'glb' | 'gltf' | 'obj' | 'vrm'; // ถ้าไม่ระบุ จะตรวจสอบจากนามสกุลไฟล์
  scale?: number;
  /** Rotation in degrees [x, y, z] */
  rotation?: [number, number, number];
  /** Which face of the bounding box should touch the origin point */
  anchorPoint?:
    | 'center'
    | 'bottom'
    | 'top'
    | 'front'
    | 'back'
    | 'left'
    | 'right'
    | 'bottom-center'
    | 'top-center';
  percentOffset?: THREE.Vector3;
  hitboxEnabled?: boolean;
  debugEnabled?: boolean;
  castShadow?: boolean;
  receiveShadow?: boolean;
  onLoadComplete?: (obj: THREE.Object3D | THREE.Group, group: THREE.Object3D) => void;
  onProgress?: (p: number) => void;
  onError?: (err: unknown) => void;
};

export const ModelFileLoader = ({
  parentObj,
  src,
  mtl,
  modelType,
  scale = 0.01,
  rotation,
  anchorPoint = 'center',
  percentOffset,
  hitboxEnabled,
  debugEnabled,
  castShadow = false,
  receiveShadow = false,
  onLoadComplete,
  onProgress,
  onError,
}: ModelLoaderProps) => {
  // const [error, setError] = useState<string | null>(null);
  // const modelRef = useRef<THREE.Object3D | null>(null);
  // const mixerRef = useRef<THREE.AnimationMixer | null>(null);

  const onLoad = (loadedObj: THREE.Object3D | THREE.Group) => {
    loadedObj.traverse((c: any) => {
      // Disable shadows for brighter appearance
      if (c.isMesh) {
        c.castShadow = castShadow;
        c.receiveShadow = receiveShadow;

        // Keep materials bright and colorful
        if (c.material) {
          const cleanMaterial = (mat: any) => {
            // 🛠️ Clean up undefined textures BEFORE Three.js processes them
            const textureProps = [
              'map',
              'normalMap',
              'bumpMap',
              'specularMap',
              'emissiveMap',
              'alphaMap',
              'aoMap',
              'lightMap',
              'displacementMap',
              'roughnessMap',
              'metalnessMap',
            ];

            textureProps.forEach((prop) => {
              if (mat[prop] === undefined) {
                delete mat[prop]; // ลบ property แทนการ set เป็น null
              }
            });

            // Adjust material properties for better appearance
            if (mat.isMeshStandardMaterial || mat.isMeshPhongMaterial) {
              mat.metalness = 0.0; // Less metallic for brighter appearance
              mat.roughness = 1.0; // More diffuse for even lighting
            }
          };

          if (Array.isArray(c.material)) {
            c.material.forEach(cleanMaterial);
          } else {
            cleanMaterial(c.material);
          }
        }
      }
    });
    // scene.add(obj);
    // const returnObj =
    addParentObj?.(
      loadedObj,
      scale,
      rotation,
      anchorPoint,
      parentObj,
      percentOffset,
      hitboxEnabled,
      debugEnabled,
      onLoadComplete,
    );
    // onLoadComplete?.(returnObj);

    // modelRef.current = obj;
    // if ((obj as any).animations && (obj as any).animations.length > 0) {
    //   const mixer = new THREE.AnimationMixer(obj);
    //   mixerRef.current = mixer;
    //   const clip = (obj as any).animations[0] as THREE.AnimationClip;
    //   const action = mixer.clipAction(clip);
    //   action.play();
    // }
  };

  const manager = new THREE.LoadingManager();
  manager.onProgress = (_url, loaded, total) => {
    const p = total ? loaded / total : 0;
    onProgress?.(p);
  };

  // ตรวจสอบ file type จาก modelType หรือ src
  // ถ้าไม่ได้ระบุ modelType ต้องเช็คจากนามสกุลไฟล์แทน
  let fileType = modelType;
  if (!fileType) {
    // ถ้า src เป็น blob URL (ไม่มีนามสกุลไฟล์) ให้ default เป็น fbx
    if (src.startsWith('blob:')) {
      fileType = 'fbx';
      console.log('🔍 Detected blob URL, using default type: fbx');
    } else {
      fileType = src.split('.').pop()?.toLowerCase() as any;
    }
  }

  console.log('📦 Loading model type:', fileType, 'from:', src.substring(0, 50));

  switch (fileType) {
    case 'fbx':
      const fbxLoader = new FBXLoader(manager);

      // 🔧 Override texture loader เพื่อจัดการ undefined textures
      const originalTextureLoad = (fbxLoader as any).textureLoader?.load;
      if ((fbxLoader as any).textureLoader) {
        (fbxLoader as any).textureLoader.load = function (
          url: any,
          onLoad: any,
          onProgress: any,
          onError: any,
        ) {
          if (url === undefined || url === null || url === '') {
            console.warn('⚠️ Skipping undefined/null texture');
            return null;
          }
          return originalTextureLoad?.call(this, url, onLoad, onProgress, onError);
        };
      }

      fbxLoader.load(src, onLoad, undefined, (err) => {
        console.error('FBX load error', err);
        // setError('Failed to load FBX');
        onError?.(err);
      });
      break;
    case 'glb':
    case 'gltf':
      new GLTFLoader(manager).load(
        src,
        (gltf) => {
          // ส่งอนิเมชั่นจาก GLTF ไปยัง scene
          const scene = gltf.scene;
          if (gltf.animations && gltf.animations.length > 0) {
            (scene as any).animations = gltf.animations;
            console.log(
              `🎬 GLTF has ${gltf.animations.length} animations:`,
              gltf.animations.map((clip) => clip.name),
            );
          }
          onLoad(scene);
        },
        undefined,
        (err) => {
          console.error('GLTF load error', err);
          // setError('Failed to load GLTF');
          onError?.(err);
        },
      );
      break;
    // case 'vrm':// VRM loader
    //   const loader = new GLTFLoader(manager);
    //   loader.register((parser) => new VRMLoaderPlugin(parser));

    //   loader.load(
    //     src,
    //     (gltf) => {
    //       const vrm = gltf.userData.vrm as VRM;

    //       if (vrm) {
    //         console.log('🎭 VRM model loaded:', {
    //           name: (vrm.meta as any)?.title || (vrm.meta as any)?.name || 'Unknown',
    //           version: vrm.meta?.version || 'Unknown',
    //           author: (vrm.meta as any)?.authors?.[0] || (vrm.meta as any)?.author || 'Unknown',
    //           hasExpressions: !!vrm.expressionManager,
    //           hasLookAt: !!vrm.lookAt,
    //           hasFirstPerson: !!vrm.firstPerson
    //         });

    //         // บันทึก VRM reference
    //         vrmRef.current = vrm;

    //         // ปรับ VRM ให้พร้อมสำหรับการแสดงผล
    //         VRMUtils.removeUnnecessaryVertices(gltf.scene);
    //         VRMUtils.removeUnnecessaryJoints(gltf.scene);

    //         // ตั้งค่า VRM expressions และ look-at
    //         if (vrm.expressionManager) {
    //           // เพิ่ม subtle blinking animation
    //           const blinkingTimer = setInterval(() => {
    //             if (vrmRef.current?.expressionManager) {
    //               vrmRef.current.expressionManager.setValue('blink', 1.0);
    //               setTimeout(() => {
    //                 if (vrmRef.current?.expressionManager) {
    //                   vrmRef.current.expressionManager.setValue('blink', 0.0);
    //                 }
    //               }, 150);
    //             }
    //           }, 3000 + Math.random() * 2000); // Random blink every 3-5 seconds

    //           // Store timer for cleanup
    //           (vrm as any).blinkingTimer = blinkingTimer;
    //         }

    //         // ส่งอนิเมชั่นจาก VRM ไปยัง scene
    //         const scene = gltf.scene;
    //         if (gltf.animations && gltf.animations.length > 0) {
    //           (scene as any).animations = gltf.animations;
    //           console.log(`🎬 VRM has ${gltf.animations.length} animations:`, gltf.animations.map(clip => clip.name));
    //         }

    //         onLoad(scene);
    //       } else {
    //         console.error('No VRM found in file');
    //         // setError('Invalid VRM file');
    //       }
    //     },
    //     undefined,
    //     (err) => {
    //       console.error('VRM load error', err);
    //       // setError('Failed to load VRM');
    //       onError?.(err);
    //     }
    //   );
    //   break;
    case 'obj':
      if (mtl) {
        new MTLLoader(manager).load(mtl, (materials) => {
          materials.preload();
          new OBJLoader(manager)
            .setMaterials(materials)
            .load(src, onLoad, undefined, (err) => {
              console.error('OBJ load error', err);
              // setError('Failed to load OBJ');
              onError?.(err);
            });
        });
      } else {
        new OBJLoader(manager).load(src, onLoad, undefined, (err) => {
          console.error('OBJ load error', err);
          // setError('Failed to load OBJ');
          onError?.(err);
        });
      }
      break;
    default:
      // setError('Unsupported file format');
      onError?.('Unsupported file format');
      return;
  }
};
