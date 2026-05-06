const assetPaths = {
  character: '/assets/character/', // Base path for characters
  pet: '/assets/pet/',
  frame: '/assets/frame/', // Base path for frames
  badgeBackground: '/assets/images/badge',
  badgeImage: '/assets/images/badge',
  coupon: '/assets/icons/',
  background: '/assets/icons/',
  model: '/assets/model/', // ← new
  animation: '/assets/animation/', // ← new
  // Add more assets as needed
} as const; // Add 'as const' to ensure the type of the keys is literal

export type AssetName = keyof typeof assetPaths; // Type for the valid asset names

export function getAssetPath(
  assetName: AssetName,
  fileName: string = '',
  fileType: string = '',
): string {
  return `${assetPaths[assetName]}${fileName}${fileType}`;
}

export function getBadgePaths(
  badgeBg: string,
  badgeImg: string,
  index: number = 1, // Default index is 1, but can be changed dynamically
): {
  template_path: string;
  image_url: string;
} {
  return {
    template_path: `${assetPaths.badgeBackground}/${badgeBg}/${badgeBg}-${index}.png`,
    image_url: `${assetPaths.badgeImage}/${badgeImg}/${badgeImg}-${index}.png`,
  };
}

/**
 * Returns the .fbx paths for a 3D model and its corresponding animation.
 *
 * @param baseName  The base name of your asset (e.g. "Peacock")
 * @param modelExt  The extension for the model file (default: ".fbx")
 * @param animExt   The extension for the animation file (default: "Anim.fbx")
 */
export function getModelAndAnimationPaths(
  baseName: string,
  modelExt: string = '.fbx',
  animExt: string = 'Anim.fbx',
): { modelPath: string; animationPath: string } {
  const modelPath = `${assetPaths.model}${baseName}${modelExt}`;
  const animationPath = `${assetPaths.animation}${baseName}${animExt}`;
  return { modelPath, animationPath };
}
