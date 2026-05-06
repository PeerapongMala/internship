import * as THREE from 'three';

/**
 * Optional bones that can be safely ignored in compatibility check
 * (Hair, Wings, Accessories that may not exist in all models)
 */
const OPTIONAL_BONE_PATTERNS = [
  /^Hair/i, // Hair bones (Hair_Root, Hair1, Hair2, etc.)
  /^Wing/i, // Wing bones
  /^Chest_R/i, // Wing attachment point
  /^lens_eye/i, // Eye lenses
  /^Weapon/i, // Weapon bones
  /^Shield/i, // Shield bones
  /^Headgear/i, // Headgear bones
];

/**
 * Check if a bone is optional (can be missing without causing issues)
 */
function isOptionalBone(boneName: string): boolean {
  return OPTIONAL_BONE_PATTERNS.some((pattern) => pattern.test(boneName));
}

/**
 * Check if animation skeleton matches character skeleton
 */
export function isAnimationCompatible(
  character: THREE.Group,
  animationClip: THREE.AnimationClip,
): boolean {
  // Get character's skeleton bones
  const characterBones = new Set<string>();
  character.traverse((child: any) => {
    if (child.isSkinnedMesh && child.skeleton) {
      child.skeleton.bones.forEach((bone: THREE.Bone) => {
        characterBones.add(bone.name);
      });
    }
  });

  if (characterBones.size === 0) {
    console.warn('⚠️ No skeleton found in character');
    return false;
  }

  // Get animation track bone names
  const animationBones = animationClip.tracks.map((track) => {
    // Track name format: "boneName.property"
    const boneName = track.name.split('.')[0];
    return boneName;
  });

  // Check compatibility (exclude optional bones)
  const missingBones = animationBones.filter(
    (bone) => !characterBones.has(bone) && !isOptionalBone(bone),
  );

  if (missingBones.length > 0) {
    console.error('❌ Animation incompatible with character skeleton');
    console.error('📊 Character bones:', Array.from(characterBones));
    console.error('📊 Animation bones:', animationBones);
    console.error('⚠️ Missing CRITICAL bones:', missingBones);
    return false;
  }

  // Log optional bones if any (for debugging)
  const optionalMissing = animationBones.filter(
    (bone) => !characterBones.has(bone) && isOptionalBone(bone),
  );

  if (optionalMissing.length > 0) {
    console.log(
      `ℹ️ Optional bones missing (safe to ignore): ${optionalMissing.length}`,
      optionalMissing,
    );
  }

  console.log('✅ Animation compatible with character skeleton');
  return true;
} /**
 * Apply animation with skeleton validation
 */
export function safeApplyAnimation(
  character: THREE.Group,
  animationClip: THREE.AnimationClip,
  mixer: THREE.AnimationMixer,
  options: {
    loop?: THREE.AnimationActionLoopStyles;
    weight?: number;
    clampWhenFinished?: boolean;
  } = {},
): THREE.AnimationAction | null {
  // Validate compatibility
  if (!isAnimationCompatible(character, animationClip)) {
    console.warn(`⚠️ Skipping incompatible animation: ${animationClip.name}`);
    return null;
  }

  // Apply animation
  const action = mixer.clipAction(animationClip);
  action.setLoop(options.loop || THREE.LoopRepeat, Infinity);
  action.clampWhenFinished = options.clampWhenFinished ?? false;

  if (options.weight !== undefined) {
    action.setEffectiveWeight(options.weight);
  }

  action.play();
  console.log(`✅ Applied animation: ${animationClip.name}`);

  return action;
}
