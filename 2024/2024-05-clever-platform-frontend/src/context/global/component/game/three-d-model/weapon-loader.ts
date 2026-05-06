import { LoadFBXAnimation } from '@component/code/atom/cc-a-animation-loader/Mons-animation';
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

// Character to weapon mapping
const characterToWeaponMap: { [key: string]: string } = {
  // Set 1
  set1_character1: 'Sword_01',
  set1_character1_level1: 'Sword_01',
  set1_character1_level2: 'Sword_01',
  set1_character1_level3: 'Big_sword',
  set1_character1_level4: 'Big_sword',
  set1_character1_level5: 'Big_sword',

  set1_character2: 'ArrowMG',
  set1_character2_level1: 'ArrowMG',
  set1_character2_level2: 'ArrowMG',
  set1_character2_level3: 'ArrowMG',
  set1_character2_level4: 'ArrowMG',
  set1_character2_level5: 'ArrowMG',

  set1_character3: 'Sword_01',
  set1_character3_level1: 'Sword_01',
  set1_character3_level2: 'Sword_01',
  set1_character3_level3: 'Silver_sword',
  set1_character3_level4: 'Silver_sword',
  set1_character3_level5: 'Black_sword',

  set1_character4: 'Staff_blue',
  set1_character4_level1: 'Staff_01',
  set1_character4_level2: 'Staff_02',
  set1_character4_level3: 'Staff_03',
  set1_character4_level4: 'Staff_04',
  set1_character4_level5: 'Staff_05',

  // Set 2
  set2_character1: 'Apple',
  set2_character1_level1: 'Apple',
  set2_character1_level2: 'Apple',
  set2_character1_level3: 'Apple',
  set2_character1_level4: 'Apple',
  set2_character1_level5: 'Apple',

  set2_character2: 'Sword_1',
  set2_character2_level1: 'Sword_1',
  set2_character2_level2: 'Sword_1',
  set2_character2_level3: 'Sword_1',
  set2_character2_level4: 'Sword_1',
  set2_character2_level5: 'Sword_1',

  set2_character3: 'Hat',
  set2_character3_level1: 'Hat',
  set2_character3_level2: 'Hat',
  set2_character3_level3: 'Hat',
  set2_character3_level4: 'Hat',
  set2_character3_level5: 'Hat',

  set2_character4: 'Pencil',
  set2_character4_level1: 'Pencil',
  set2_character4_level2: 'Pencil',
  set2_character4_level3: 'Pencil',
  set2_character4_level4: 'Pencil',
  set2_character4_level5: 'Pencil',

  // Set 3
  set3_character1: 'Bag 01 Pink',
  set3_character1_level1: 'Bag 01 Pink',
  set3_character1_level2: 'Bag 01 Pink',
  set3_character1_level3: 'Bag 01 Pink',
  set3_character1_level4: 'Bag 01 Pink',
  set3_character1_level5: 'Bag 01 Pink',

  set3_character2: 'Bag 01 Yellow',
  set3_character2_level1: 'Bag 01 Yellow',
  set3_character2_level2: 'Bag 01 Yellow',
  set3_character2_level3: 'Bag 01 Yellow',
  set3_character2_level4: 'Bag 01 Yellow',
  set3_character2_level5: 'Bag 01 Yellow',

  set3_character3: 'Bag 01 Blue',
  set3_character3_level1: 'Bag 01 Blue',
  set3_character3_level2: 'Bag 01 Blue',
  set3_character3_level3: 'Bag 01 Blue',
  set3_character3_level4: 'Bag 01 Blue',
  set3_character3_level5: 'Bag 01 Blue',

  set3_character4: 'Bag 01 Green',
  set3_character4_level1: 'Bag 01 Green',
  set3_character4_level2: 'Bag 01 Green',
  set3_character4_level3: 'Bag 01 Green',
  set3_character4_level4: 'Bag 01 Green',
  set3_character4_level5: 'Bag 01 Green',

  // Set 4
  set4_character1: 'Axe_3',
  set4_character1_level1: 'Axe_3',
  set4_character1_level2: 'Axe_3',
  set4_character1_level3: 'Axe_3',
  set4_character1_level4: 'Axe_3',
  set4_character1_level5: 'Axe_3',

  set4_character2: 'Spear_2',
  set4_character2_level1: 'Spear_2',
  set4_character2_level2: 'Spear_2',
  set4_character2_level3: 'Spear_2',
  set4_character2_level4: 'Spear_2',
  set4_character2_level5: 'Spear_2',

  set4_character3: 'MagicWand',
  set4_character3_level1: 'MagicWand',
  set4_character3_level2: 'MagicWand',
  set4_character3_level3: 'MagicWand',
  set4_character3_level4: 'MagicWand',
  set4_character3_level5: 'MagicWand',

  set4_character4: 'Sword_2',
  set4_character4_level1: 'Sword_2',
  set4_character4_level2: 'Sword_2',
  set4_character4_level3: 'Sword_2',
  set4_character4_level4: 'Sword_2',
  set4_character4_level5: 'Sword_2',

  set5_character1_level1: 'gun_char1_01',
  set5_character1_level2: 'gun_char1_02',
  set5_character1_level3: 'gun_char1_03',
  set5_character1_level4: 'gun_char1_04',
  set5_character1_level5: 'gun_char1_05',

  set5_character2_level1: 'gun_char2_01',
  set5_character2_level2: 'gun_char2_02',
  set5_character2_level3: 'gun_char2_03',
  set5_character2_level4: 'gun_char2_04',
  set5_character2_level5: 'gun_char2_05',

  set5_character3_level1: 'gun_char3_01',
  set5_character3_level2: 'gun_char3_02',
  set5_character3_level3: 'gun_char3_03',
  set5_character3_level4: 'gun_char3_04',
  set5_character3_level5: 'gun_char3_05',

  set5_character4_level1: 'gun_char4_01',
  set5_character4_level2: 'gun_char4_02',
  set5_character4_level3: 'gun_char4_03',
  set5_character4_level4: 'gun_char4_04',
  set5_character4_level5: 'gun_char4_05',
};

// Map of weapon names to their file paths
const weaponURLs: { [key: string]: string } = {
  // set1
  ArrowMG: '/assets/model/weapon/Set1/ArrowMG.fbx',
  Staff_01: '/assets/model/weapon/Set1/Level1Staff.fbx',
  Staff_02: '/assets/model/weapon/Set1/Level2Staff.fbx',
  Staff_03: '/assets/model/weapon/Set1/Level3Staff.fbx',
  Staff_04: '/assets/model/weapon/Set1/Level4Staff.fbx',
  Staff_05: '/assets/model/weapon/Set1/Level5Staff.fbx',
  Sword_01: '/assets/model/weapon/Set1/Sword_01.fbx',
  Silver_sword: '/assets/model/weapon/Set1/silver_sword.fbx',
  Black_sword: '/assets/model/weapon/Set1/black_sword.fbx',
  Big_sword: '/assets/model/weapon/Set1/big_sword.fbx',

  // set2
  Apple: '/assets/model/weapon/Set2/Apple.fbx',
  Hat: '/assets/model/weapon/Set2/Hat.fbx',
  Pencil: '/assets/model/weapon/Set2/Pencil.fbx',
  Sword_1: '/assets/model/weapon/Set2/Sword_1.fbx',

  // set3
  'Bag 01 Blue': '/assets/model/weapon/Set3/Character4.fbx',
  'Bag 01 Green': '/assets/model/weapon/Set3/Character3.fbx',
  'Bag 01 Pink': '/assets/model/weapon/Set3/Character1.fbx',
  'Bag 01 Yellow': '/assets/model/weapon/Set3/Character2.fbx',

  // set4
  Axe_3: '/assets/model/weapon/Set4/Axe_3.fbx',
  MagicWand: '/assets/model/weapon/Set4/MagicWand.fbx',
  Spear_2: '/assets/model/weapon/Set4/Spear_2.fbx',
  Sword_2: '/assets/model/weapon/Set4/Sword_2.fbx',

  // set5_char1
  gun_char1_01: '/assets/model/accessories/set5/Character1/Level1Gun.fbx',
  gun_char1_02: '/assets/model/accessories/set5/Character1/Level2Gun.fbx',
  gun_char1_03: '/assets/model/accessories/set5/Character1/Level3Gun.fbx',
  gun_char1_04: '/assets/model/accessories/set5/Character1/Level4Gun.fbx',
  gun_char1_05: '/assets/model/accessories/set5/Character1/Level5Gun.fbx',

  // set5_char2
  gun_char2_01: '/assets/model/accessories/set5/Character2/Level1Gun.fbx',
  gun_char2_02: '/assets/model/accessories/set5/Character2/Level2Gun.fbx',
  gun_char2_03: '/assets/model/accessories/set5/Character2/Level3Gun.fbx',
  gun_char2_04: '/assets/model/accessories/set5/Character2/Level4Gun.fbx',
  gun_char2_05: '/assets/model/accessories/set5/Character2/Level5Gun.fbx',

  // set5_char3
  gun_char3_01: '/assets/model/accessories/set5/Character3/Level1Gun.fbx',
  gun_char3_02: '/assets/model/accessories/set5/Character3/Level2Gun.fbx',
  gun_char3_03: '/assets/model/accessories/set5/Character3/Level3Gun.fbx',
  gun_char3_04: '/assets/model/accessories/set5/Character3/Level4Gun.fbx',
  gun_char3_05: '/assets/model/accessories/set5/Character3/Level5Gun.fbx',

  // set5_char4
  gun_char4_01: '/assets/model/accessories/set5/Character4/Level1Gun.fbx',
  gun_char4_02: '/assets/model/accessories/set5/Character4/Level2Gun.fbx',
  gun_char4_03: '/assets/model/accessories/set5/Character4/Level3Gun.fbx',
  gun_char4_04: '/assets/model/accessories/set5/Character4/Level4Gun.fbx',
  gun_char4_05: '/assets/model/accessories/set5/Character4/Level5Gun.fbx',
};

// Animation URLs mapping
export const animationURLs: { [key: string]: { url: string; name: string } } = {
  ArrowMG: { url: '/assets/model/weapon/Set1/ArrowMG.fbx', name: 'ArrowMG' },
  Staff_01: { url: '/assets/model/weapon/Set1/Staff_01.fbx', name: 'Staff_01' },
  Staff_02: { url: '/assets/model/weapon/Set1/Staff_02.fbx', name: 'Staff_02' },
  Staff_03: { url: '/assets/model/weapon/Set1/Staff_03.fbx', name: 'Staff_03' },
  Staff_04: { url: '/assets/model/weapon/Set1/Staff_04.fbx', name: 'Staff_04' },
  Staff_05: { url: '/assets/model/weapon/Set1/Staff_05.fbx', name: 'Staff_05' },
  Sword_01: { url: '/assets/model/weapon/Set1/Sword_01.fbx', name: 'Sword_01' },
  Apple: { url: '/assets/model/weapon/Set2/Apple.fbx', name: 'Apple' },
  Hat: { url: '/assets/model/weapon/Set2/Hat.fbx', name: 'Hat' },
  Pencil: { url: '/assets/model/weapon/Set2/Pencil.fbx', name: 'Pencil' },
  Sword_1: { url: '/assets/model/weapon/Set2/Sword_1.fbx', name: 'Sword_1' },
  Silver_sword: {
    url: '/assets/model/weapon/Set1/silver_sword.fbx',
    name: 'Silver_sword',
  },
  Black_sword: { url: '/assets/model/weapon/Set1/black_sword.fbx', name: 'Black_sword' },
  Big_sword: { url: '/assets/model/weapon/Set1/big_sword.fbx', name: 'Big_sword' },

  'Bag 01 Blue': {
    url: '/assets/model/weapon/Set3/Character4.fbx',
    name: 'Bag 01 Blue',
  },
  'Bag 01 Green': {
    url: '/assets/model/weapon/Set3/Character3.fbx',
    name: 'Bag 01 Green',
  },
  'Bag 01 Pink': {
    url: '/assets/model/weapon/Set3/Character1.fbx',
    name: 'Bag 01 Pink',
  },
  'Bag 01 Yellow': {
    url: '/assets/model/weapon/Set3/Character2.fbx',
    name: 'Bag 01 Yellow',
  },
  Axe_3: { url: '/assets/model/weapon/Set4/Axe_3.fbx', name: 'Axe_3' },
  MagicWand: { url: '/assets/model/weapon/Set4/MagicWand.fbx', name: 'MagicWand' },
  Spear_2: { url: '/assets/model/weapon/Set4/Spear_2.fbx', name: 'Spear_2' },
  Sword_2: { url: '/assets/model/weapon/Set4/Sword_2.fbx', name: 'Sword_2' },

  // set5_char1
  gun_char1_01: {
    url: '/assets/model/accessories/set5/Character1/Level1Gun.fbx',
    name: 'gun_char1_01',
  },
  gun_char1_02: {
    url: '/assets/model/accessories/set5/Character1/Level2Gun.fbx',
    name: 'gun_char1_02',
  },
  gun_char1_03: {
    url: '/assets/model/accessories/set5/Character1/Level3Gun.fbx',
    name: 'gun_char1_03',
  },
  gun_char1_04: {
    url: '/assets/model/accessories/set5/Character1/Level4Gun.fbx',
    name: 'gun_char1_04',
  },
  gun_char1_05: {
    url: '/assets/model/accessories/set5/Character1/Level5Gun.fbx',
    name: 'gun_char1_05',
  },

  // set5_char2
  gun_char2_01: {
    url: '/assets/model/accessories/set5/Character2/Level1Gun.fbx',
    name: 'gun_char2_01',
  },
  gun_char2_02: {
    url: '/assets/model/accessories/set5/Character2/Level2Gun.fbx',
    name: 'gun_char2_02',
  },
  gun_char2_03: {
    url: '/assets/model/accessories/set5/Character2/Level3Gun.fbx',
    name: 'gun_char2_03',
  },
  gun_char2_04: {
    url: '/assets/model/accessories/set5/Character2/Level4Gun.fbx',
    name: 'gun_char2_04',
  },
  gun_char2_05: {
    url: '/assets/model/accessories/set5/Character2/Level5Gun.fbx',
    name: 'gun_char2_05',
  },

  // set5_char3
  gun_char3_01: {
    url: '/assets/model/accessories/set5/Character3/Level1Gun.fbx',
    name: 'gun_char3_01',
  },
  gun_char3_02: {
    url: '/assets/model/accessories/set5/Character3/Level2Gun.fbx',
    name: 'gun_char3_02',
  },
  gun_char3_03: {
    url: '/assets/model/accessories/set5/Character3/Level3Gun.fbx',
    name: 'gun_char3_03',
  },
  gun_char3_04: {
    url: '/assets/model/accessories/set5/Character3/Level4Gun.fbx',
    name: 'gun_char3_04',
  },
  gun_char3_05: {
    url: '/assets/model/accessories/set5/Character3/Level5Gun.fbx',
    name: 'gun_char3_05',
  },

  // set5_char4
  gun_char4_01: {
    url: '/assets/model/accessories/set5/Character4/Level1Gun.fbx',
    name: 'gun_char4_01',
  },
  gun_char4_02: {
    url: '/assets/model/accessories/set5/Character4/Level2Gun.fbx',
    name: 'gun_char4_02',
  },
  gun_char4_03: {
    url: '/assets/model/accessories/set5/Character4/Level3Gun.fbx',
    name: 'gun_char4_03',
  },
  gun_char4_04: {
    url: '/assets/model/accessories/set5/Character4/Level4Gun.fbx',
    name: 'gun_char4_04',
  },
  gun_char4_05: {
    url: '/assets/model/accessories/set5/Character4/Level5Gun.fbx',
    name: 'gun_char4_05',
  },
};

/**
 * Get the weapon model name for a character
 * @param characterKey - The character key
 * @returns The weapon model name or default
 */
export function getWeaponForCharacter(characterKey: string): string {
  // Get the base character ID by removing level suffix if present
  const baseCharacterId = characterKey.replace(/_level\d+$/, '');

  // First try the exact character key
  if (characterToWeaponMap[characterKey]) {
    return characterToWeaponMap[characterKey];
  }
  // Then try the base character ID
  else if (characterToWeaponMap[baseCharacterId]) {
    return characterToWeaponMap[baseCharacterId];
  }
  // Default to Sword_01 if no match found
  return 'Sword_01';
}

/**
 * Get the weapon model URL for a character
 * @param characterKey - The character key
 * @returns The weapon model URL or undefined
 */
export function getWeaponUrlForCharacter(characterKey: string): string | undefined {
  const weaponName = getWeaponForCharacter(characterKey);
  return weaponURLs[weaponName];
}

/**
 * Load a character's weapon model
 * @param characterKey - The character key to determine which weapon to load
 * @param scene - Three.js scene
 * @param callback - Callback to use the loaded model
 * @param onError - Error callback
 */
export function LoadCharacter(
  characterKey: string,
  scene: THREE.Scene,
  callback: (character: THREE.Group) => void,
  onError?: (error: ErrorEvent | Error) => void,
): void {
  // If characterKey is empty/null/undefined, exit early without loading anything
  if (!characterKey) {
    console.log('LoadCharacter: No character key provided');
    if (onError) onError(new Error('No character key provided'));
    return;
  }

  // Get the weapon name for this character
  const weaponName = getWeaponForCharacter(characterKey);
  console.log(`Loading weapon ${weaponName} for character: ${characterKey}`);

  // Get the URL for the weapon
  const weaponURL = weaponURLs[weaponName];

  if (!weaponURL) {
    console.error(`No URL found for weapon: ${weaponName}`);
    if (onError) onError(new Error(`No URL found for weapon: ${weaponName}`));
    return;
  }

  // Load the weapon model
  const loader = new FBXLoader();

  loader.load(
    weaponURL,
    (object) => {
      // Apply default transformations
      object.scale.set(0.03, 0.03, 0.03);

      // Apply specific transformations based on weapon
      if (weaponName === 'ArrowMG') {
        object.scale.set(0.07, 0.07, 0.07);
        object.rotation.set(
          THREE.MathUtils.degToRad(180),
          THREE.MathUtils.degToRad(90),
          THREE.MathUtils.degToRad(90),
        );
      }
      if (weaponName === 'Staff_blue') {
        object.scale.set(0.04, 0.04, 0.04);
        object.rotation.set(
          THREE.MathUtils.degToRad(180),
          THREE.MathUtils.degToRad(90),
          THREE.MathUtils.degToRad(90),
        );
      } else if (weaponName === 'Sword_01') {
        object.scale.set(0.0025, 0.0025, 0.0025);
        object.rotation.set(
          THREE.MathUtils.degToRad(49.92),
          THREE.MathUtils.degToRad(4.29),
          THREE.MathUtils.degToRad(-84.92),
        );
      } else if (weaponName === 'Sword_01') {
        object.scale.set(0.0025, 0.0025, 0.0025);
        object.rotation.set(
          THREE.MathUtils.degToRad(49.92),
          THREE.MathUtils.degToRad(4.29),
          THREE.MathUtils.degToRad(-84.92),
        );
      } else if (weaponName === 'Big_sword') {
        object.scale.set(0.05, 0.05, 0.05);
        object.rotation.set(
          THREE.MathUtils.degToRad(49.92),
          THREE.MathUtils.degToRad(80.29),
          THREE.MathUtils.degToRad(-164.92),
        );
      } else if (weaponName === 'Staff_01') {
        object.scale.set(0.035, 0.035, 0.035);
        object.rotation.set(
          THREE.MathUtils.degToRad(49.92),
          THREE.MathUtils.degToRad(4.29),
          THREE.MathUtils.degToRad(-84.92),
        );
      } else if (weaponName === 'Staff_02') {
        object.scale.set(0.035, 0.035, 0.035);
        object.rotation.set(
          THREE.MathUtils.degToRad(49.92),
          THREE.MathUtils.degToRad(4.29),
          THREE.MathUtils.degToRad(-84.92),
        );
      } else if (weaponName === 'Staff_03') {
        object.scale.set(0.035, 0.035, 0.035);
        object.rotation.set(
          THREE.MathUtils.degToRad(49.92),
          THREE.MathUtils.degToRad(4.29),
          THREE.MathUtils.degToRad(-84.92),
        );
      } else if (weaponName === 'Staff_04') {
        object.scale.set(0.04, 0.04, 0.04);
        object.rotation.set(
          THREE.MathUtils.degToRad(49.92),
          THREE.MathUtils.degToRad(100.29),
          THREE.MathUtils.degToRad(-84.92),
        );
      } else if (weaponName === 'Staff_05') {
        object.scale.set(0.035, 0.035, 0.035);
        object.rotation.set(
          THREE.MathUtils.degToRad(49.92),
          THREE.MathUtils.degToRad(4.29),
          THREE.MathUtils.degToRad(-84.92),
        );
      } else if (weaponName === 'Black_sword') {
        //object.scale.set(0.0025, 0.0025, 0.0025);
        object.rotation.set(
          THREE.MathUtils.degToRad(49.92),
          THREE.MathUtils.degToRad(80.29),
          THREE.MathUtils.degToRad(-164.92),
        );
      } else if (weaponName === 'Sword_1') {
        //object.scale.set(0.03, 0.03, 0.03);
        object.rotation.set(
          THREE.MathUtils.degToRad(49.92),
          THREE.MathUtils.degToRad(4.29),
          THREE.MathUtils.degToRad(-84.92),
        );
      } else if (weaponName === 'Hat') {
        object.scale.set(0.018, 0.018, 0.018);
        object.rotation.set(
          THREE.MathUtils.degToRad(49.92),
          THREE.MathUtils.degToRad(4.29),
          THREE.MathUtils.degToRad(-84.92),
        );
      } else if (weaponName === 'Pencil') {
        //object.scale.set(0.03, 0.03, 0.03);
        object.rotation.set(
          THREE.MathUtils.degToRad(49.92),
          THREE.MathUtils.degToRad(4.29),
          THREE.MathUtils.degToRad(-84.92),
        );
      } else if (weaponName === 'Axe_3') {
        object.scale.set(0.03, 0.03, 0.03);
        object.rotation.set(
          THREE.MathUtils.degToRad(49.92),
          THREE.MathUtils.degToRad(4.29),
          THREE.MathUtils.degToRad(-84.92),
        );
      } else if (weaponName === 'Spear_2') {
        object.scale.set(0.03, 0.03, 0.03);
        object.rotation.set(
          THREE.MathUtils.degToRad(49.92),
          THREE.MathUtils.degToRad(4.29),
          THREE.MathUtils.degToRad(-84.92),
        );
      } else if (weaponName === 'MagicWand') {
        object.scale.set(0.03, 0.03, 0.03);
        object.rotation.set(
          THREE.MathUtils.degToRad(49.92),
          THREE.MathUtils.degToRad(4.29),
          THREE.MathUtils.degToRad(-84.92),
        );
      } else if (weaponName === 'Sword_2') {
        object.scale.set(0.03, 0.03, 0.03);
        object.rotation.set(
          THREE.MathUtils.degToRad(49.92),
          THREE.MathUtils.degToRad(4.29),
          THREE.MathUtils.degToRad(-84.92),
        );
      } else if (weaponName.includes('gun')) {
        object.scale.set(0.04, 0.04, 0.04);
        object.rotation.set(
          THREE.MathUtils.degToRad(49.92),
          THREE.MathUtils.degToRad(60.29),
          THREE.MathUtils.degToRad(-84.92),
        );
      }

      // Call the callback with the loaded model
      callback(object);
    },
    (xhr) => {
      // Progress callback
      console.log(`Weapon ${weaponName}: ${(xhr.loaded / xhr.total) * 100}% loaded`);
    },
    (error) => {
      console.error('Error loading weapon model:', error);
    },
  );
}

export class GCAWeaponModel {
  model: THREE.Group | THREE.Mesh | undefined;
  loader: THREE.Loader = new FBXLoader();
  mixer: THREE.AnimationMixer | undefined;
  shouldRotating: boolean = false;
  spinSpeed: number = 0.002; // Adjust this value for spin speed

  Start = ({
    modelSrc,
    scene,
    renderer,
    shouldRotating = true,
    onLoaded,
  }: {
    modelSrc?: string;
    scene?: THREE.Object3D;
    shouldRotating?: boolean;
    renderer: THREE.WebGLRenderer;
    onLoaded?: () => void;
  }): void => {
    if (modelSrc) {
      // console.log('Character key: ' + modelSrc);
      if (scene instanceof THREE.Scene) {
        // Here we're now passing the character key instead of a weapon key
        LoadCharacter(modelSrc, scene, (character: THREE.Group) => {
          let mixer: THREE.AnimationMixer | null = null;
          scene?.add(character);

          this.model = character;

          // console.log('Weapon model loaded for character:', modelSrc);
          // console.log('Name:', character.name);
          // console.log('Children:', character.children.length);
          // console.log('Model Object:', character);

          // Get the weapon name for this character
          const weaponName = getWeaponForCharacter(modelSrc);

          character.traverse((child: any) => {
            if (child instanceof THREE.Mesh) {
              if (child.material.map) {
                child.material.map.minFilter = THREE.LinearFilter;
                child.material.map.generateMipmaps = true;
                child.material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
              }
              if (child.material.materials) {
                child.material.materials.forEach((material: any) => {
                  if (material.map) {
                    material.map.minFilter = THREE.LinearFilter;
                    material.map.generateMipmaps = true;
                    material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
                  }
                });
              }
            }
          });

          // Check if animation exists for this weapon
          if (animationURLs[weaponName]) {
            LoadFBXAnimation(
              animationURLs[weaponName].url,
              animationURLs[weaponName].name,
              (animationClip: THREE.AnimationClip) => {
                character.animations.push(animationClip);
                mixer = new THREE.AnimationMixer(character);

                console.log('Weapon animation url: ', animationURLs[weaponName].name);
                if (animationClip) {
                  const action = mixer.clipAction(animationClip);
                  console.log('Attempt to play animation for weapon:', weaponName);
                  action.play();
                } else {
                  console.error('Animation clip not found for weapon:', weaponName);
                }

                this.mixer = mixer;

                if (onLoaded) onLoaded();
              },
              (error: any) => {
                console.error('Error loading animation for weapon:', weaponName, error);
                if (onLoaded) onLoaded(); // Still call onLoaded even if animation fails
              },
            );
          } else {
            console.log('No animation defined for weapon:', weaponName);
            if (onLoaded) onLoaded();
          }
        });
      } else {
        console.error(
          'Error: scene must be a THREE.Scene when modelSrc is provided for LoadCharacter.',
        );
        return;
      }
    } else {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      this.model = new THREE.Mesh(geometry, material);
      scene?.add(this.model);
      console.log('Default model added to scene');
      if (onLoaded) onLoaded();
    }
    this.shouldRotating = shouldRotating;
  };

  // Add this to weapon-loader.ts in the GCAThreeModel class
  getWeaponPosition = (): THREE.Vector3 => {
    const position = new THREE.Vector3(0, 0, 0);

    if (this.model) {
      // Get the world position of the model
      if (typeof this.model.getWorldPosition === 'function') {
        this.model.getWorldPosition(position);
        //console.log('Got weapon world position:', position);
      } else {
        console.log('Using model position directly');
        position.copy(this.model.position);
      }
    } else {
      console.log('No model available for position');
    }

    return position;
  };

  Update = ({ deltaTime }: { deltaTime: number }) => {
    if (this.model) {
      if (this.shouldRotating) {
        //this.model.rotation.y += 0.0005 * deltaTime; // Existing rotation
      }
      if (this.mixer) {
        this.mixer.update(deltaTime / 1000); // Update FBX animation
      }
    }
  };

  ComponentAdd = (_parentObj: any) => {
    const parentObj = _parentObj as THREE.Object3D;
    if (!this.model) {
      return;
    }
    parentObj.add(this.model);
    console.log('Model added to parent object');
  };

  ComponentRemove = (_parentObj: any) => {
    const parentObj = _parentObj as THREE.Object3D;
    if (!this.model) {
      return;
    }
    parentObj.remove(this.model);
    console.log('Model removed from parent object');
  };
}
