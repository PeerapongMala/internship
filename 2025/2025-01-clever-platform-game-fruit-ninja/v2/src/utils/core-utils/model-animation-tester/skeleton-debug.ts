import * as THREE from 'three';

/**
 * Utility for debugging 3D model skeleton and animation issues
 * ใช้สำหรับวิเคราะห์ปัญหา skeleton ไม่ตรงกันระหว่าง model และ animation (รองรับทั้ง character, animal, และ model อื่นๆ)
 */

export interface SkeletonInfo {
  boneName: string;
  parentName: string | null;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  children: string[];
}

export interface AnimationTrackInfo {
  name: string;
  boneName: string;
  property: string; // position, quaternion, scale
  keyframeCount: number;
  duration: number;
}

export interface SkeletonComparisonResult {
  modelBones: string[];
  animationBones: string[];
  matchingBones: string[];
  missingInModel: string[]; // bones ที่ animation ต้องการแต่ model ไม่มี
  missingInAnimation: string[]; // bones ที่ model มีแต่ animation ไม่ได้ใช้
  compatibility: number; // 0-100 percent
}

/**
 * Extract all bone names and hierarchy from a model
 */
export function extractSkeletonInfo(model: THREE.Group | THREE.Object3D): SkeletonInfo[] {
  const bones: SkeletonInfo[] = [];
  const boneMap = new Map<THREE.Bone, string>();

  model.traverse((child: any) => {
    if (child.isSkinnedMesh && child.skeleton) {
      child.skeleton.bones.forEach((bone: THREE.Bone) => {
        boneMap.set(bone, bone.name);
      });
    }
  });

  model.traverse((child: any) => {
    if (child.isBone) {
      const parentBone = child.parent as THREE.Bone;
      const parentName = parentBone?.isBone
        ? boneMap.get(parentBone) || parentBone.name
        : null;

      const children: string[] = [];
      child.children.forEach((c: any) => {
        if (c.isBone) {
          children.push(c.name);
        }
      });

      bones.push({
        boneName: child.name,
        parentName,
        position: {
          x: child.position.x,
          y: child.position.y,
          z: child.position.z,
        },
        rotation: {
          x: THREE.MathUtils.radToDeg(child.rotation.x),
          y: THREE.MathUtils.radToDeg(child.rotation.y),
          z: THREE.MathUtils.radToDeg(child.rotation.z),
        },
        children,
      });
    }
  });

  return bones;
}

/**
 * Extract animation track information
 */
export function extractAnimationInfo(clip: THREE.AnimationClip): AnimationTrackInfo[] {
  return clip.tracks.map((track) => {
    const parts = track.name.split('.');
    const boneName = parts[0];
    const property = parts[1] || 'unknown';

    return {
      name: track.name,
      boneName,
      property,
      keyframeCount: track.times.length,
      duration: track.times.length > 0 ? track.times[track.times.length - 1] : 0,
    };
  });
}

/**
 * Compare skeleton structure between model and animation
 */
export function compareSkeletonWithAnimation(
  model: THREE.Group | THREE.Object3D,
  animationClip: THREE.AnimationClip,
): SkeletonComparisonResult {
  // Get model bones
  const modelBones = new Set<string>();
  model.traverse((child: any) => {
    if (child.isSkinnedMesh && child.skeleton) {
      child.skeleton.bones.forEach((bone: THREE.Bone) => {
        modelBones.add(bone.name);
      });
    }
    // Also check Bone objects directly
    if (child.isBone) {
      modelBones.add(child.name);
    }
  });

  // Get animation bones (unique)
  const animationBones = new Set<string>();
  animationClip.tracks.forEach((track) => {
    const boneName = track.name.split('.')[0];
    animationBones.add(boneName);
  });

  const modelBoneArray = Array.from(modelBones);
  const animationBoneArray = Array.from(animationBones);

  // Find matching bones
  const matchingBones = animationBoneArray.filter((bone) => modelBones.has(bone));

  // Find missing bones
  const missingInModel = animationBoneArray.filter((bone) => !modelBones.has(bone));
  const missingInAnimation = modelBoneArray.filter((bone) => !animationBones.has(bone));

  // Calculate compatibility percentage
  const compatibility =
    animationBoneArray.length > 0
      ? Math.round((matchingBones.length / animationBoneArray.length) * 100)
      : 0;

  return {
    modelBones: modelBoneArray,
    animationBones: animationBoneArray,
    matchingBones,
    missingInModel,
    missingInAnimation,
    compatibility,
  };
}

/**
 * Log detailed skeleton debug info to console
 */
export function logSkeletonDebugInfo(
  modelName: string,
  model: THREE.Group | THREE.Object3D,
  animationClip?: THREE.AnimationClip,
): void {
  console.group(`🦴 Skeleton Debug: ${modelName}`);

  // Model skeleton info
  const skeletonInfo = extractSkeletonInfo(model);
  console.log(`📊 Model has ${skeletonInfo.length} bones:`);

  // Group by hierarchy level
  const rootBones = skeletonInfo.filter((b) => !b.parentName);
  console.log(
    `  Root bones (${rootBones.length}):`,
    rootBones.map((b) => b.boneName),
  );

  // Show bone hierarchy
  console.group('📋 Bone Hierarchy:');
  const visited = new Set<string>(); // Prevent infinite loops
  const printBoneHierarchy = (boneName: string, level: number = 0) => {
    // Check for circular reference or max depth
    if (visited.has(boneName) || level > 50) {
      if (level > 50) {
        console.warn(`⚠️ Max depth reached at level ${level}, stopping traversal`);
      }
      return;
    }

    visited.add(boneName);
    const bone = skeletonInfo.find((b) => b.boneName === boneName);
    if (bone) {
      const indent = '  '.repeat(level);
      console.log(`${indent}├── ${boneName} (children: ${bone.children.length})`);
      bone.children.forEach((childName) => printBoneHierarchy(childName, level + 1));
    }
  };
  rootBones.forEach((bone) => printBoneHierarchy(bone.boneName));
  console.groupEnd();

  // Animation comparison
  if (animationClip) {
    console.group(
      `🎬 Animation: ${animationClip.name} (duration: ${animationClip.duration.toFixed(2)}s)`,
    );

    const comparison = compareSkeletonWithAnimation(model, animationClip);

    console.log(`📈 Compatibility: ${comparison.compatibility}%`);
    console.log(
      `✅ Matching bones (${comparison.matchingBones.length}):`,
      comparison.matchingBones,
    );

    if (comparison.missingInModel.length > 0) {
      console.warn(
        `⚠️ Bones in animation but MISSING in model (${comparison.missingInModel.length}):`,
        comparison.missingInModel,
      );
    }

    if (comparison.missingInAnimation.length > 0) {
      console.log(
        `ℹ️ Bones in model but NOT used in animation (${comparison.missingInAnimation.length}):`,
        comparison.missingInAnimation,
      );
    }

    // Track details
    const trackInfo = extractAnimationInfo(animationClip);
    console.group('🎞️ Animation Tracks:');

    // Group tracks by bone
    const tracksByBone = new Map<string, AnimationTrackInfo[]>();
    trackInfo.forEach((track) => {
      const existing = tracksByBone.get(track.boneName) || [];
      existing.push(track);
      tracksByBone.set(track.boneName, existing);
    });

    tracksByBone.forEach((tracks, boneName) => {
      const isMatching = comparison.matchingBones.includes(boneName);
      const status = isMatching ? '✅' : '❌';
      console.log(`${status} ${boneName}: ${tracks.map((t) => t.property).join(', ')}`);
    });
    console.groupEnd();

    console.groupEnd();
  }

  console.groupEnd();
}

/**
 * Create a visual skeleton helper for debugging
 */
export function createSkeletonHelper(
  model: THREE.Group | THREE.Object3D,
): THREE.SkeletonHelper | null {
  let skeleton: THREE.Skeleton | null = null;
  let skinnedMesh: THREE.SkinnedMesh | null = null;

  model.traverse((child: any) => {
    if (child.isSkinnedMesh && child.skeleton && !skeleton) {
      skeleton = child.skeleton;
      skinnedMesh = child;
    }
  });

  if (skinnedMesh) {
    const helper = new THREE.SkeletonHelper(skinnedMesh);
    (helper.material as THREE.LineBasicMaterial).linewidth = 2;
    return helper;
  }

  return null;
}

/**
 * Create a bone name mapping for retargeting
 * Returns a map of: animationBoneName -> modelBoneName
 */
export function createBoneMapping(
  modelBones: string[],
  animationBones: string[],
): Map<string, string> {
  const mapping = new Map<string, string>();

  // First pass: exact matches
  animationBones.forEach((animBone) => {
    if (modelBones.includes(animBone)) {
      mapping.set(animBone, animBone);
    }
  });

  // Second pass: case-insensitive matches
  animationBones.forEach((animBone) => {
    if (!mapping.has(animBone)) {
      const match = modelBones.find(
        (modelBone) => modelBone.toLowerCase() === animBone.toLowerCase(),
      );
      if (match) {
        mapping.set(animBone, match);
        console.log(`🔗 Mapped (case): "${animBone}" -> "${match}"`);
      }
    }
  });

  // Third pass: common naming convention transformations
  const transformations = [
    // Mixamo to Unity style
    (name: string) => name.replace(/^mixamorig:/, ''),
    (name: string) => name.replace(/_/g, ''),
    (name: string) => name.replace(/\s+/g, ''),
    // Unity style variations
    (name: string) => name.replace(/Bip001\s*/i, ''),
    (name: string) => name.replace(/Bip01\s*/i, ''),
  ];

  animationBones.forEach((animBone) => {
    if (!mapping.has(animBone)) {
      for (const transform of transformations) {
        const transformed = transform(animBone);
        const match = modelBones.find(
          (modelBone) => transform(modelBone).toLowerCase() === transformed.toLowerCase(),
        );
        if (match) {
          mapping.set(animBone, match);
          console.log(`🔗 Mapped (transform): "${animBone}" -> "${match}"`);
          break;
        }
      }
    }
  });

  return mapping;
}
