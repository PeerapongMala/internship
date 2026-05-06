import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import {
  logSkeletonDebugInfo,
  compareSkeletonWithAnimation,
  createSkeletonHelper,
  SkeletonComparisonResult,
} from './skeleton-debug';
import { retargetAnimationIfNeeded } from './skeleton-retarget-fix';

/**
 * Configuration interface for 3D models
 */
export interface ModelConfig {
  name: string;
  modelPath: string;
  animationPath: string;
}

/**
 * Props for ModelViewer component (internal)
 */
interface ModelViewerProps {
  config: ModelConfig;
  showSkeleton: boolean;
  useRetargeting: boolean;
  selectedClip: string;
  onDebugInfo: (info: DebugInfo) => void;
  onClipsLoaded?: (clips: string[]) => void;
}

/**
 * Debug information interface
 */
interface DebugInfo {
  modelName: string;
  modelBones: string[];
  animationBones: string[];
  comparison: SkeletonComparisonResult | null;
  animationClips: string[];
  status: 'loading' | 'success' | 'error';
  error?: string;
}

function ModelViewer({ config, showSkeleton, useRetargeting, selectedClip, onDebugInfo, onClipsLoaded }: ModelViewerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const skeletonHelperRef = useRef<THREE.SkeletonHelper | null>(null);
  const { scene } = useThree();

  useEffect(() => {
    const fbxLoader = new FBXLoader();
    let model: THREE.Group | null = null;
    let animationModel: THREE.Group | null = null;

    const loadModel = async () => {
      try {
        // Load 3D model
        model = await new Promise<THREE.Group>((resolve, reject) => {
          fbxLoader.load(config.modelPath, resolve, undefined, reject);
        });

        // Load animation
        animationModel = await new Promise<THREE.Group>((resolve, reject) => {
          fbxLoader.load(config.animationPath, resolve, undefined, reject);
        });

        // // Apply rotation
        // model.rotation.set(
        //   THREE.MathUtils.degToRad(config.rotation[0]),
        //   THREE.MathUtils.degToRad(config.rotation[1]),
        //   THREE.MathUtils.degToRad(config.rotation[2]),
        // );

        // Scale down
        model.scale.setScalar(0.02);

        // Center model
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.sub(center.multiplyScalar(0.02));
        model.position.y = 0;

        // Add to group
        if (groupRef.current) {
          groupRef.current.add(model);
        }

        // Debug: Log skeleton info
        const animClips = animationModel.animations || [];

        // Report available clips to parent
        if (onClipsLoaded) {
          onClipsLoaded(animClips.map(c => c.name));
        }

        // Use selected clip or fallback to first available
        const focusedClip = animClips.find((c) => c.name === selectedClip) || animClips[0];

        if (focusedClip) {
          logSkeletonDebugInfo(config.name, model, focusedClip);
        }

        // Get comparison info
        const comparison = focusedClip ? compareSkeletonWithAnimation(model, focusedClip) : null;

        // Get model bones
        const modelBones: string[] = [];
        model.traverse((child: any) => {
          if (child.isBone) {
            modelBones.push(child.name);
          }
        });

        // Report debug info
        onDebugInfo({
          modelName: config.name,
          modelBones,
          animationBones: focusedClip?.tracks.map((t) => t.name.split('.')[0]) || [],
          comparison,
          animationClips: animClips.map((c) => c.name),
          status: 'success',
        });

        // Setup animation
        if (focusedClip) {
          const mixer = new THREE.AnimationMixer(model);
          mixerRef.current = mixer;

          let clipToUse = focusedClip;

          // Try retargeting if enabled and there are missing bones
          if (useRetargeting && comparison && comparison.missingInModel.length > 0) {
            console.log(`🔧 Attempting retargeting for ${config.name}...`);
            clipToUse = retargetAnimationIfNeeded(model, focusedClip, animationModel);
          }

          const action = mixer.clipAction(clipToUse);
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.play();

          console.log(`✅ ${config.name}: Animation playing (${clipToUse.name})`);
        }

        // Create skeleton helper if needed
        if (showSkeleton) {
          const helper = createSkeletonHelper(model);
          if (helper && groupRef.current) {
            skeletonHelperRef.current = helper;
            scene.add(helper);
          }
        }
      } catch (error) {
        console.error(`❌ Error loading ${config.name}:`, error);
        onDebugInfo({
          modelName: config.name,
          modelBones: [],
          animationBones: [],
          comparison: null,
          animationClips: [],
          status: 'error',
          error: String(error),
        });
      }
    };

    loadModel();

    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
      if (skeletonHelperRef.current) {
        scene.remove(skeletonHelperRef.current);
      }
      if (model && groupRef.current) {
        groupRef.current.remove(model);
      }
    };
  }, [config, showSkeleton, useRetargeting]);

  useFrame((_, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
    // SkeletonHelper updates automatically, no need to call update()
  });

  return <group ref={groupRef} />;
}

/**
 * Props for ModelAnimationTester component
 */
export interface ModelAnimationTesterProps {
  /** Array of model configurations to test */
  models: ModelConfig[];
  /** Initial model name to select (default: first model) */
  // initialModel?: string;
  /** Whether to use full screen height (default: true) */
  // fullHeight?: boolean;
}

/**
 * Model Animation Tester Component
 * 
 * A reusable component for testing and debugging 3D model animations.
 * Useful for comparing model skeletons with animation clips and testing retargeting.
 * 
 * @example
 * ```tsx
 * const models = [
 *   { name: 'Character', modelPath: '/models/char.fbx', animationPath: '/anims/run.fbx' },
 *   { name: 'Animal', modelPath: '/models/animal.fbx', animationPath: '/anims/walk.fbx' }
 * ];
 * 
 * <ModelAnimationTester models={models} initialModel="Character" />
 * ```
 */
export function ModelAnimationTester({
  models,
  // initialModel,
  // fullHeight = true,
}: ModelAnimationTesterProps) {
  // const [selectedModel, setSelectedModel] = useState(
  //   initialModel || models[0]?.name || '',
  // );
  const [selectedModel, setSelectedModel] = useState('');
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [useRetargeting, setUseRetargeting] = useState(false);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [availableClips, setAvailableClips] = useState<string[]>([]);
  const [selectedClip, setSelectedClip] = useState<string>('Walk');

  const selectedConfig = models.find((m) => m.name === selectedModel) || models[0];

  return (
    // <div className={`flex w-full flex-col md:flex-row ${fullHeight ? 'h-screen pt-16 md:pt-0' : 'h-full'}`}>
    <div className={`flex w-full flex-col md:flex-row h-full`}>
      {/* 3D Canvas */}
      <div className="relative flex-1 min-h-0">
        <Canvas camera={{ position: [5, 3, 5], fov: 50 }} style={{ width: '100%', height: '100%' }}>
          <color attach="background" args={[0x111827]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Grid
            args={[20, 20]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#444"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#888"
            fadeDistance={50}
          />
          <axesHelper args={[3]} />

          <ModelViewer
            key={`${selectedModel}-${showSkeleton}-${useRetargeting}-${selectedClip}`}
            config={selectedConfig}
            showSkeleton={showSkeleton}
            useRetargeting={useRetargeting}
            selectedClip={selectedClip}
            onDebugInfo={setDebugInfo}
            onClipsLoaded={setAvailableClips}
          />

          <OrbitControls makeDefault />
        </Canvas>
      </div>

      {/* Control Panel */}
      <div className="relative z-10 h-1/3 w-full overflow-y-auto bg-gray-900 p-4 text-white md:h-full md:w-96">
        <h2 className="mb-4 text-xl font-bold">Model Animation Tester</h2>

        {/* Model Selection */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">Select Model:</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full rounded bg-gray-800 p-2 text-white"
          >
            {models.map((model) => (
              <option key={model.name} value={model.name}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        {/* Animation Clip Selection */}
        {availableClips.length > 0 && (
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">Select Animation Clip:</label>
            <select
              value={selectedClip}
              onChange={(e) => setSelectedClip(e.target.value)}
              className="w-full rounded bg-gray-800 p-2 text-white"
            >
              {availableClips.map((clip) => (
                <option key={clip} value={clip}>
                  {clip}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Options */}
        <div className="mb-4 space-y-2">
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={showSkeleton}
              onChange={(e) => setShowSkeleton(e.target.checked)}
              className="rounded"
            />
            <span>Show Skeleton Helper</span>
          </label>

          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={useRetargeting}
              onChange={(e) => setUseRetargeting(e.target.checked)}
              className="rounded"
            />
            <span>Enable Retargeting</span>
          </label>
        </div>

        {/* Debug Info */}
        {debugInfo && (
          <div className="space-y-4">
            <div className="rounded bg-gray-800 p-3">
              <h3 className="mb-2 font-medium">
                {debugInfo.modelName}
                <span
                  className={`ml-2 rounded px-2 py-0.5 text-xs ${debugInfo.status === 'success'
                    ? 'bg-green-600'
                    : debugInfo.status === 'error'
                      ? 'bg-red-600'
                      : 'bg-yellow-600'
                    }`}
                >
                  {debugInfo.status}
                </span>
              </h3>

              {debugInfo.comparison && (
                <div className="text-sm">
                  <p className="mb-1">
                    Compatibility:{' '}
                    <span
                      className={`font-bold ${debugInfo.comparison.compatibility >= 80
                        ? 'text-green-400'
                        : debugInfo.comparison.compatibility >= 50
                          ? 'text-yellow-400'
                          : 'text-red-400'
                        }`}
                    >
                      {debugInfo.comparison.compatibility}%
                    </span>
                  </p>
                  <p>Model Bones: {debugInfo.comparison.modelBones.length}</p>
                  <p>Animation Bones: {debugInfo.comparison.animationBones.length}</p>
                  <p>Matching: {debugInfo.comparison.matchingBones.length}</p>
                </div>
              )}
            </div>

            {/* Missing Bones */}
            {debugInfo.comparison && debugInfo.comparison.missingInModel.length > 0 && (
              <div className="rounded bg-red-900/50 p-3">
                <h4 className="mb-2 text-sm font-medium text-red-300">
                  Missing in Model ({debugInfo.comparison.missingInModel.length}):
                </h4>
                <div className="max-h-32 overflow-y-auto text-xs">
                  {debugInfo.comparison.missingInModel.map((bone) => (
                    <div key={bone} className="text-red-200">
                      {bone}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Animation Clips */}
            <div className="rounded bg-gray-800 p-3">
              <h4 className="mb-2 text-sm font-medium">Animation Clips:</h4>
              <div className="text-xs">
                {debugInfo.animationClips.map((clip) => (
                  <div key={clip} className="text-gray-300">
                    {clip}
                  </div>
                ))}
              </div>
            </div>

            {/* All Model Bones */}
            <details className="rounded bg-gray-800 p-3">
              <summary className="cursor-pointer text-sm font-medium">
                All Model Bones ({debugInfo.modelBones.length})
              </summary>
              <div className="mt-2 max-h-48 overflow-y-auto text-xs">
                {debugInfo.modelBones.map((bone) => (
                  <div key={bone} className="text-gray-400">
                    {bone}
                  </div>
                ))}
              </div>
            </details>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-4 rounded bg-gray-800 p-3 text-gray-400">
          <p className="mb-1">Instructions:</p>
          <ul className="list-inside list-disc text-xs">
            <li>Select a 3D model to test (character/animal/etc)</li>
            <li>Choose animation clip from available animations</li>
            <li>Check console for detailed bone info</li>
            <li>Enable skeleton helper to visualize bones</li>
            <li>Toggle retargeting to test animation compatibility fix</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ModelAnimationTester;
