// weapon-model-loader.ts
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

/**
 * Load a weapon model for a character
 * @param selectedCharacter - Character key to determine which weapon to load
 * @param scene - Three.js scene
 * @param callback - Callback to use the loaded model
 * @param onError - Error callback
 */
export function LoadWeaponForCharacter(
  selectedCharacter: string | null | undefined,
  scene: THREE.Scene,
  callback: (character: THREE.Group) => void,
  onError?: (error: ErrorEvent | Error) => void,
) {
  // If selectedCharacter is empty/null/undefined, exit early without loading anything
  if (
    selectedCharacter === null ||
    selectedCharacter === undefined ||
    selectedCharacter === ''
  ) {
    console.log('LoadWeaponForCharacter: Waiting for valid character selection...');
    return;
  }

  // Map character keys to weapon names
  const characterToWeaponMap: { [key: string]: string } = {
    // Set 1
    set1_character1: 'Sword_01',
    set1_character1_level1: 'Sword_01',
    set1_character1_level2: 'Sword_01',
    set1_character1_level3: 'Silver_sword',
    set1_character1_level4: 'Silver_sword',
    set1_character1_level5: 'Black_sword',

    set1_character2: 'ArrowMG',
    set1_character2_level1: 'ArrowMG',
    set1_character2_level2: 'ArrowMG',
    set1_character2_level3: 'ArrowMG',
    set1_character2_level4: 'ArrowMG',
    set1_character2_level5: 'ArrowMG',

    set1_character3: 'Sword_01',
    set1_character3_level1: 'Sword_01',
    set1_character3_level2: 'Sword_01',
    set1_character3_level3: 'Sword_01',
    set1_character3_level4: 'Sword_01',
    set1_character3_level5: 'Sword_01',

    set1_character4: 'Staff_blue',
    set1_character4_level1: 'Staff_blue',
    set1_character4_level2: 'Staff_blue',
    set1_character4_level3: 'Staff_blue',
    set1_character4_level4: 'Staff_blue',
    set1_character4_level5: 'Staff_blue',

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
  };

  // Get the base character ID by removing level suffix if present
  const baseCharacterId = selectedCharacter.replace(/_level\d+$/, '');

  // Get the weapon name for this character
  const weaponName =
    characterToWeaponMap[baseCharacterId] ||
    characterToWeaponMap[selectedCharacter] ||
    'Sword_01'; // Default weapon if no match

  // Map of weapon names to their file paths
  const weaponURLs: { [key: string]: string } = {
    // set1
    ArrowMG: '/assets/model/weapon/Set1/ArrowMG.fbx',
    Staff_blue: '/assets/model/weapon/Set1/Staff_blue.fbx',
    Sword_01: '/assets/model/weapon/Set1/Sword_01.fbx',
    Silver_sword: '/assets/model/weapon/Set1/silver_sword.fbx',
    Black_sword: '/assets/model/weapon/Set1/black_sword.fbx',

    // set2
    Apple: '/assets/model/weapon/Set2/Apple.fbx',
    Hat: '/assets/model/weapon/Set2/Hat.fbx',
    Pencil: '/assets/model/weapon/Set2/Pencil.fbx',
    Sword_1: '/assets/model/weapon/Set2/Sword_1.fbx',

    // set3
    'Bag 01 Blue': '/assets/model/weapon/Set3/Bag 01 Blue.fbx',
    'Bag 01 Green': '/assets/model/weapon/Set3/Bag 01 Green.fbx',
    'Bag 01 Pink': '/assets/model/weapon/Set3/Bag 01 Pink.fbx',
    'Bag 01 Yellow': '/assets/model/weapon/Set3/Bag 01 Yellow.fbx',

    // set4
    Axe_3: '/assets/model/weapon/Set4/Axe_3.fbx',
    MagicWand: '/assets/model/weapon/Set4/MagicWand.fbx',
    Spear_2: '/assets/model/weapon/Set4/Spear_2.fbx',
    Sword_2: '/assets/model/weapon/Set4/Sword_2.fbx',
  };

  // Get the URL for the weapon
  const weaponURL = weaponURLs[weaponName];

  if (!weaponURL) {
    console.error(`No URL found for weapon: ${weaponName}`);
    if (onError) onError(new Error(`No URL found for weapon: ${weaponName}`));
    return;
  }

  console.log(
    `Loading weapon: ${weaponName} for character: ${selectedCharacter} from: ${weaponURL}`,
  );

  // Load the weapon model
  const loader = new FBXLoader();

  loader.load(
    weaponURL,
    (object) => {
      // Position and scale the weapon as needed
      object.scale.set(1, 1, 1); // Adjust scale as needed
      object.position.set(0, 0, 0); // Adjust position as needed

      // Add to scene
      scene.add(object);

      // Call the callback with the loaded model
      if (callback) callback(object);
    },
    (xhr) => {
      // Progress callback if needed
      console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
    },
    (error) => {
      console.error('Error loading weapon model:', error);
    },
  );
}
