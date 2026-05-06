import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

/**
 * Retarget animation to 3D model skeleton if bones don't match
 * รองรับทั้ง character, animal และ model อื่นๆ
 */
export function retargetAnimationIfNeeded(
  character: THREE.Group,
  animationClip: THREE.AnimationClip,
  animationSource: THREE.Group,
): THREE.AnimationClip {
  console.log('🔧 Attempting skeleton retargeting...');

  try {
    // Find model skeleton
    let characterSkeleton: THREE.Skeleton | null = null;
    character.traverse((child: any) => {
      if (child.isSkinnedMesh && child.skeleton) {
        characterSkeleton = child.skeleton;
      }
    });

    if (!characterSkeleton) {
      console.warn('⚠️ No skeleton found in model, using original clip');
      return animationClip;
    }

    // Retarget clip using SkeletonUtils
    const retargetedClip = SkeletonUtils.retargetClip(
      animationSource,
      character,
      animationClip,
    );

    console.log('✅ Animation retargeted successfully');
    return retargetedClip || animationClip;
  } catch (error) {
    console.error('❌ Retargeting failed:', error);
    return animationClip;
  }
}
