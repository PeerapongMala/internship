import { LoadCharacter } from './BlobModelLoader_hide_weapon';
import { loadFBXAnimation } from './fbx-animation-loader';
import { FBXLoaderHelper } from './fbx-model-loader';
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

// Function to determine which animation to use based on modelSrc and whether the answer is correct
function getAnimationPath(
  modelSrc: string | undefined,
  answerIsCorrect: boolean,
): string {
  // Default animations if no specific ones are found
  const defaultCorrectAnimation = 'set2_casting_final.fbx';
  const defaultIncorrectAnimation = 'set2_casting_fail.fbx';

  // If no modelSrc, return default
  if (!modelSrc) {
    return answerIsCorrect ? defaultCorrectAnimation : defaultIncorrectAnimation;
  }

  // Extract set number from modelSrc
  const setMatch = modelSrc.match(/set(\d+)/i);
  if (!setMatch) {
    return answerIsCorrect ? defaultCorrectAnimation : defaultIncorrectAnimation;
  }

  const setNumber = setMatch[1];

  // Extract character number for special handling
  const characterMatch = modelSrc.match(/character(\d+)/i);
  const characterNumber = characterMatch ? characterMatch[1] : '';

  // Set-specific animations
  switch (setNumber) {
    case '1':
      return answerIsCorrect ? 'MainMenu-Idle/Set1.fbx' : 'MainMenu-Idle/Set1.fbx';

    case '2':
      return answerIsCorrect ? '/MainMenu-Idle/Set2,4.fbx' : '/MainMenu-Idle/Set2,4.fbx';

    case '3':
      // Special handling for set 3 based on character number
      if (characterNumber === '1' || characterNumber === '2') {
        return answerIsCorrect
          ? 'MainMenu-Idle/Set3Char12.fbx'
          : 'MainMenu-Idle/Set3Char12.fbx';
      } else if (characterNumber === '3' || characterNumber === '4') {
        return answerIsCorrect
          ? '/MainMenu-Idle/Set3Char34.fbx'
          : '/MainMenu-Idle/Set3Char34.fbx';
      }
      // Fallback for set 3 if character number not matched
      return answerIsCorrect ? 'set3_casting_success.fbx' : 'set3_casting_fail.fbx';

    case '4':
      return answerIsCorrect ? '/MainMenu-Idle/Set2,4.fbx' : '/MainMenu-Idle/Set2,4.fbx';

    case '5':
      return answerIsCorrect
        ? '/assets/animation/MainMenu-Idle/set5-main-menu-animation/Set5Char1MenuIdle.fbx'
        : '/assets/animation/MainMenu-Idle/set5-main-menu-animation/Set5Char1MenuIdle.fbx';

    default:
      // Return default animations if no specific set handling
      return answerIsCorrect ? defaultCorrectAnimation : defaultIncorrectAnimation;
  }
}

// Helper function to determine which wing model to load based on character
function getWingModelPath(modelSrc: string | undefined): string | undefined {
  if (!modelSrc) return undefined;

  if (modelSrc.includes('character1_level5')) {
    return '/assets/model/set1_wings/Wings 01 Gold (1).fbx';
  } else if (modelSrc.includes('character2_level5')) {
    return '/assets/model/set1_wings/Wings 01 Green.fbx';
  } else if (modelSrc.includes('character3_level5')) {
    return '/assets/model/set1_wings/Wings 01 Black.fbx';
  } else if (modelSrc.includes('character4_level5')) {
    return '/assets/model/set1_wings/Wings 01 Red.fbx';
  } //level4
  else if (modelSrc.includes('character1_level4')) {
    return '/assets/model/set1_wings/level-4/character1.fbx';
  } else if (modelSrc.includes('character2_level4')) {
    return '/assets/model/set1_wings/level-4/character2.fbx';
  } else if (modelSrc.includes('character3_level4')) {
    return '/assets/model/set1_wings/level-4/character3.fbx';
  } else if (modelSrc.includes('character4_level4')) {
    return '/assets/model/set1_wings/level-4/character4.fbx';
  }
  return undefined;
}

// Helper function to determine which weapon model to load based on character
function getWeaponModelPath(modelSrc: string | undefined): string | undefined {
  if (!modelSrc) return undefined;

  // Set 1 weapons
  if (modelSrc.includes('set1')) {
    if (
      modelSrc.includes('character1_level1') ||
      modelSrc.includes('character1_level2')
    ) {
      return '/assets/model/accessories/set1/Level1-2Sword.fbx';
    } else if (
      modelSrc.includes('character1_level3') ||
      modelSrc.includes('character1_level4') ||
      modelSrc.includes('character1_level5')
    ) {
      return '/assets/model/accessories/set1/Character1/Level3-5Sword.fbx';
    } else if (modelSrc.includes('character2_level1')) {
      return '/assets/model/weapon/Set1/Bow/Level1.fbx';
    } else if (modelSrc.includes('character2_level2')) {
      return '/assets/model/weapon/Set1/Bow/Level2.fbx';
    } else if (modelSrc.includes('character2')) {
      return '/assets/model/weapon/Set1/Bow/Level3-5.fbx';
    } else if (
      modelSrc.includes('character3_level1') ||
      modelSrc.includes('character3_level2')
    ) {
      return '/assets/model/accessories/set1/Character3/Level1-2Sword.fbx';
    } else if (
      modelSrc.includes('character3_level3') ||
      modelSrc.includes('character3_level4')
    ) {
      return '/assets/model/accessories/set1/Character3/Level3-4Sword.fbx';
    } else if (modelSrc.includes('character3_level5')) {
      return '/assets/model/accessories/set1/Character3/Level5Sword.fbx';
    } else if (modelSrc.includes('character4_level1')) {
      return '/assets/model/accessories/set1/Character4/Level1Staff.fbx';
    } else if (modelSrc.includes('character4_level2')) {
      return '/assets/model/accessories/set1/Character4/Level2Staff.fbx';
    } else if (modelSrc.includes('character4_level3')) {
      return '/assets/model/accessories/set1/Character4/Level3Staff.fbx';
    } else if (modelSrc.includes('character4_level4')) {
      return '/assets/model/accessories/set1/Character4/Level4Staff.fbx';
    } else if (modelSrc.includes('character4_level5')) {
      return '/assets/model/accessories/set1/Character4/Level5Staff.fbx';
    }
  }

  // Set 2 weapons
  else if (modelSrc.includes('set2')) {
    if (modelSrc.includes('character1')) {
      return '';
    } else if (modelSrc.includes('character2')) {
      return '/assets/model/weapon/Set2/Sword_1.fbx';
    } else if (
      modelSrc.includes('character3_level2') ||
      modelSrc.includes('character3_level3')
    ) {
      return '/assets/model/weapon/Set2/Pencil.fbx';
    } else if (
      modelSrc.includes('character3_level1') ||
      modelSrc.includes('character3_level4') ||
      modelSrc.includes('character3_level5')
    ) {
      return '';
    } else if (modelSrc.includes('character4')) {
      return '/assets/model/weapon/Set2/Pencil.fbx';
    }
  }

  // Set 3 weapons
  else if (modelSrc.includes('set3')) {
    if (modelSrc.includes('character1_level1')) {
      return '';
    } else if (modelSrc.includes('character1_level2')) {
      return '/assets/model/accessories/set3/Character1/Level2Gun.fbx';
    } else if (modelSrc.includes('character1_level3')) {
      return '/assets/model/accessories/set3/Character1/Level3Gun.fbx';
    } else if (modelSrc.includes('character1_level4')) {
      return '/assets/model/accessories/set3/Character1/Level4-5Gun.fbx';
    } else if (modelSrc.includes('character1_level5')) {
      return '/assets/model/accessories/set3/Character1/Level4-5Gun.fbx';
    }
    // character2
    else if (modelSrc.includes('character2_level1')) {
      return '';
    } else if (modelSrc.includes('character2_level2')) {
      return '/assets/model/accessories/set3/Character2/Level2Gun.fbx';
    } else if (modelSrc.includes('character2_level3')) {
      return '/assets/model/accessories/set3/Character2/Level3Gun.fbx';
    } else if (modelSrc.includes('character2_level4')) {
      return '/assets/model/accessories/set3/Character2/Level4-5Gun.fbx';
    } else if (modelSrc.includes('character2_level5')) {
      return '/assets/model/accessories/set3/Character2/Level4-5Gun.fbx';
    } // character3
    else if (
      modelSrc.includes('character3_level1') ||
      modelSrc.includes('character3_level2')
    ) {
      return '';
    } else if (modelSrc.includes('character3_level3')) {
      return '/assets/model/accessories/set3/Character3/Level3Sword.fbx';
    } else if (modelSrc.includes('character3_level4')) {
      return 'public/assets/model/accessories/set3/Character3/Level4Sword.fbx';
    } else if (modelSrc.includes('character3_level5')) {
      return 'public/assets/model/accessories/set3/Character3/Level5Sword.fbx';
    }
    // character4
    else if (modelSrc.includes('character4_level1')) {
      return '';
    } else if (modelSrc.includes('character4_level2')) {
      return '';
    } else if (modelSrc.includes('character4_level3')) {
      return '/assets/model/accessories/set3/Character4/Level3Sword.fbx';
    } else if (modelSrc.includes('character4_level4')) {
      return '/assets/model/accessories/set3/Character4/Level4Sword.fbx';
    } else if (modelSrc.includes('character4_level5')) {
      return '/assets/model/accessories/set3/Character4/Level5Sword.fbx';
    }
  }

  // Set 4 weapons
  else if (modelSrc.includes('set4')) {
    if (
      modelSrc.includes('character1_level1') ||
      modelSrc.includes('character1_level2') ||
      modelSrc.includes('character1_level5')
    ) {
      return '/assets/model/weapon/Set4/Axe_3.fbx';
    } else if (
      modelSrc.includes('character1_level3') ||
      modelSrc.includes('character1_level4')
    ) {
      return '';
    } else if (modelSrc.includes('character2')) {
      return '/assets/model/weapon/Set4/Spear_2.fbx';
    } else if (modelSrc.includes('character3')) {
      return '/assets/model/weapon/Set4/MagicWand.fbx';
    } else if (modelSrc.includes('character4')) {
      return '/assets/model/weapon/Set4/Sword_2.fbx';
    }
  }

  // Set 5 weapons
  else if (modelSrc.includes('set5')) {
    if (modelSrc.includes('character1_level1')) {
      return '/assets/model/accessories/set5/Character1/Level1Gun.fbx';
    } else if (modelSrc.includes('character1_level2')) {
      return '/assets/model/accessories/set5/Character1/Level2Gun.fbx';
    } else if (modelSrc.includes('character1_level3')) {
      return '/assets/model/accessories/set5/Character1/Level3Gun.fbx';
    } else if (modelSrc.includes('character1_level4')) {
      return '/assets/model/accessories/set5/Character1/Level4Gun.fbx';
    } else if (modelSrc.includes('character1_level5')) {
      return '/assets/model/accessories/set5/Character1/Level5Gun.fbx';
    }

    //character2
    else if (modelSrc.includes('character2_level1')) {
      return '/assets/model/accessories/set5/Character2/Level1Gun.fbx';
    } else if (modelSrc.includes('character2_level2')) {
      return '/assets/model/accessories/set5/Character2/Level2Gun.fbx';
    } else if (modelSrc.includes('character2_level3')) {
      return '/assets/model/accessories/set5/Character2/Level3Gun.fbx';
    } else if (modelSrc.includes('character2_level4')) {
      return '/assets/model/accessories/set5/Character2/Level4Gun.fbx';
    } else if (modelSrc.includes('character2_level5')) {
      return '/assets/model/accessories/set5/Character2/Level5Gun.fbx';
    }

    //character3
    else if (modelSrc.includes('character3_level1')) {
      return '/assets/model/accessories/set5/Character3/Level1Gun.fbx';
    } else if (modelSrc.includes('character3_level2')) {
      return '/assets/model/accessories/set5/Character3/Level2Gun.fbx';
    } else if (modelSrc.includes('character3_level3')) {
      return '/assets/model/accessories/set5/Character3/Level3Gun.fbx';
    } else if (modelSrc.includes('character3_level4')) {
      return '/assets/model/accessories/set5/Character3/Level4Gun.fbx';
    } else if (modelSrc.includes('character3_level5')) {
      return '/assets/model/accessories/set5/Character3/Level5Gun.fbx';
    }

    //character4
    else if (modelSrc.includes('character4_level1')) {
      return '/assets/model/accessories/set5/Character4/Level1Gun.fbx';
    } else if (modelSrc.includes('character4_level2')) {
      return '/assets/model/accessories/set5/Character4/Level2Gun.fbx';
    } else if (modelSrc.includes('character4_level3')) {
      return '/assets/model/accessories/set5/Character4/Level3Gun.fbx';
    } else if (modelSrc.includes('character4_level4')) {
      return '/assets/model/accessories/set5/Character4/Level4Gun.fbx';
    } else if (modelSrc.includes('character4_level5')) {
      return '/assets/model/accessories/set5/Character4/Level5Gun.fbx';
    }
  }

  // Default weapon if no specific match is found
  return '';
}

// Helper function to determine which attachment point to use for the weapon
function getWeaponAttachmentBone(modelSrc: string | undefined): string {
  if (!modelSrc) return 'Wrist_L';

  // You can customize attachment points based on the character/set if needed
  if (modelSrc.includes('set3')) {
    return 'RigLPalm'; // Example: different attachment point for set3
  } else if (
    modelSrc.includes('set5_character1') ||
    modelSrc.includes('set5_character2') ||
    modelSrc.includes('set5_character3') ||
    modelSrc.includes('set5_character4') ||
    modelSrc.includes('set5_character5')
  ) {
    return 'ik_hand_l'; // Example: different attachment point for set5
  } else if (modelSrc.includes('set1')) {
    return 'Wrist_R'; // Example: different attachment point for set5
  } else if (modelSrc.includes('set2')) {
    //return 'QuickRigCharacter2_LeftHand'; // Example: different attachment point for set5
  } else if (modelSrc.includes('set4')) {
    //return 'QuickRigCharacter2_LeftHand'; // Example: different attachment point for set5
  }

  // Default attachment point
  return 'Wrist_L';
}

// Helper function to get weapon scale based on model
function getWeaponScale(modelSrc: string | undefined): THREE.Vector3 {
  if (!modelSrc) return new THREE.Vector3(1, 1, 1);

  //Set specific scales based on character/set
  if (
    modelSrc.includes('set1_character1_level1') ||
    modelSrc.includes('set1_character1_level2')
  ) {
    return new THREE.Vector3(0.04, 0.04, 0.04);
  } else if (
    modelSrc.includes('set1_character1_level3') ||
    modelSrc.includes('set1_character1_level4') ||
    modelSrc.includes('set1_character1_level5')
  ) {
    return new THREE.Vector3(0.8, 0.8, 0.8);
  } else if (modelSrc.includes('set1_character2')) {
    return new THREE.Vector3(1, 1, 1);
  } else if (
    modelSrc.includes('set1_character3_level1') ||
    modelSrc.includes('set1_character3_level2')
  ) {
    return new THREE.Vector3(0.04, 0.04, 0.04);
  } else if (
    modelSrc.includes('set1_character3_level3') ||
    modelSrc.includes('set1_character3_level4')
  ) {
    return new THREE.Vector3(0.8, 0.8, 0.8);
  } else if (modelSrc.includes('set1_character3_level5')) {
    return new THREE.Vector3(0.8, 0.8, 0.8);
  } else if (modelSrc.includes('set1_character4')) {
    return new THREE.Vector3(0.7, 0.7, 0.7);
  } else if (modelSrc.includes('set2')) {
    return new THREE.Vector3(1, 1, 1);
  } else if (modelSrc.includes('set3')) {
    return new THREE.Vector3(0.9, 0.9, 0.9);
  } else if (modelSrc.includes('set4')) {
    return new THREE.Vector3(1.1, 1.1, 1.1);
  } else if (
    modelSrc.includes('set5_character1') ||
    modelSrc.includes('set5_character2') ||
    modelSrc.includes('set5_character3') ||
    modelSrc.includes('set5_character4')
  ) {
    return new THREE.Vector3(0.8, 0.8, 0.8);
  }

  return new THREE.Vector3(1, 1, 1);
}

// Helper function to get weapon rotation based on model
function getWeaponRotation(modelSrc: string | undefined): THREE.Euler {
  if (!modelSrc) return new THREE.Euler(0, 0, 0);

  // Set specific rotations based on character/set
  if (
    modelSrc.includes('set1_character1_level1') ||
    modelSrc.includes('set1_character1_level2')
  ) {
    return new THREE.Euler(Math.PI / -4.2, 1.9, -5.2);
  } else if (
    modelSrc.includes('set1_character1_level3') ||
    modelSrc.includes('set1_character1_level4') ||
    modelSrc.includes('set1_character1_level5')
  ) {
    return new THREE.Euler(Math.PI / -4.2, 25.9, -5.2);
  } else if (
    modelSrc.includes('set1_character2_level1') ||
    modelSrc.includes('set1_character2_level2')
  ) {
    return new THREE.Euler(0, -15.4, 0);
  } else if (
    modelSrc.includes('set1_character3_level3') ||
    modelSrc.includes('set1_character3_level4')
  ) {
    return new THREE.Euler(1, 40, 100);
  } else if (modelSrc.includes('set1_character3_level5')) {
    return new THREE.Euler(1.5, 40, 100);
  } else if (modelSrc.includes('set1_character2')) {
    // Apply specific rotation and order for set1_character2
    const rotation = new THREE.Euler(-80, 15.4, 160);
    rotation.order = 'XYZ'; //<--- set rotation order here!
    return rotation; // <---- RETURN THE ROTATION
    // } else if (modelSrc.includes('set1_character4_level1')) {
    //   return new THREE.Euler(Math.PI / -2.2, 3.4, 4.7);
  } else if (modelSrc.includes('set1_character4_level4')) {
    return new THREE.Euler(1.5, 40, 100);
  } else if (modelSrc.includes('set2')) {
    return new THREE.Euler(0, Math.PI / 4, 0);
  } else if (
    modelSrc.includes('set3_character1') ||
    modelSrc.includes('set3_character2')
  ) {
    return new THREE.Euler(0, 0.6, Math.PI / 2);
  } else if (
    modelSrc.includes('set3_character3') ||
    modelSrc.includes('set3_character4')
  ) {
    return new THREE.Euler(0, 0.5, Math.PI / 2);
  } else if (
    modelSrc.includes('set5_character1') ||
    modelSrc.includes('set5_character3') ||
    modelSrc.includes('set5_character4')
  ) {
    return new THREE.Euler(5.5, 3, 3);
  } else if (modelSrc.includes('set5_character2')) {
    return new THREE.Euler(2.5, -4.3, -5.4);
    //return new THREE.Euler(5.5, 8, 3);
  }

  return new THREE.Euler(0, 0, 0);
}

// Helper function to determine which shield model to load based on character
function getShieldModelPath(modelSrc: string | undefined): string | undefined {
  if (!modelSrc) return undefined;

  // Only add shields to specific characters
  if (modelSrc.includes('set1')) {
    if (modelSrc.includes('character2') || modelSrc.includes('character4')) {
      return '/assets/model/shields/set1_shield.fbx';
    }
  } else if (modelSrc.includes('set3')) {
    if (modelSrc.includes('character1_level5')) {
      return '/assets/model/accessories/set3/Character1/Level5Shield.fbx';
    } else if (modelSrc.includes('character2_level5')) {
      return '/assets/model/accessories/set3/Character2/Level5Shield.fbx';
    }
  } else if (modelSrc.includes('set5')) {
    return '/assets/model/shields/set5_shield.fbx';
  }

  return undefined;
}

// Helper function to determine shield attachment point
function getShieldAttachmentBone(modelSrc: string | undefined): string {
  if (!modelSrc) return 'Wrist_R';

  // You can customize attachment points based on the character/set if needed
  if (modelSrc.includes('set3')) {
    return 'RigRPalm';
  }

  // Default attachment point
  return 'Wrist_R';
}

// Helper function to get shield scale based on model
function getShieldScale(modelSrc: string | undefined): THREE.Vector3 {
  if (!modelSrc) return new THREE.Vector3(1, 1, 1);

  // Set specific scales based on character/set
  if (modelSrc.includes('set1')) {
    return new THREE.Vector3(0.7, 0.7, 0.7);
  } else if (modelSrc.includes('set3')) {
    return new THREE.Vector3(0.9, 0.9, 0.9);
  } else if (modelSrc.includes('set5')) {
    return new THREE.Vector3(1.2, 1.2, 1.2);
  }

  return new THREE.Vector3(1, 1, 1);
}

// Helper function to get shield rotation based on model
function getShieldRotation(modelSrc: string | undefined): THREE.Euler {
  if (!modelSrc) return new THREE.Euler(0, 0, 0);

  // Set specific rotations based on character/set
  if (modelSrc.includes('set1')) {
    return new THREE.Euler(0, Math.PI / 2, 0);
  } else if (modelSrc.includes('set3')) {
    return new THREE.Euler(3.3, 0, 4.5);
  } else if (modelSrc.includes('set5')) {
    return new THREE.Euler(0, 0, Math.PI / 4);
  }

  return new THREE.Euler(0, 0, 0);
}

// Helper function to determine which helmet/hat model to load based on character
function getHeadgearModelPath(modelSrc: string | undefined): string | undefined {
  if (!modelSrc) return undefined;

  // Only add headgear to specific characters and levels
  if (modelSrc.includes('level5')) {
    if (modelSrc.includes('set1')) {
      if (modelSrc.includes('character1')) {
        return '/assets/model/headgear/set1/character1_crown.fbx';
      } else if (modelSrc.includes('character3')) {
        return '/assets/model/headgear/set1/character3_hat.fbx';
      }
    } else if (modelSrc.includes('set2')) {
      return '/assets/model/headgear/set2/wizard_hat.fbx';
    } else if (modelSrc.includes('set4')) {
      if (modelSrc.includes('character2') || modelSrc.includes('character4')) {
        return '/assets/model/headgear/set4/helmet.fbx';
      }
    }
  }

  return undefined;
}

// Helper function to determine headgear attachment point
function getHeadgearAttachmentBone(_modelSrc: string | undefined): string {
  return 'Head'; // Most headgear attaches to the head bone
}

// Helper function to get headgear scale based on model
function getHeadgearScale(modelSrc: string | undefined): THREE.Vector3 {
  if (!modelSrc) return new THREE.Vector3(1, 1, 1);

  // Set specific scales based on character/set
  if (modelSrc.includes('set1')) {
    if (modelSrc.includes('character1')) {
      return new THREE.Vector3(0.8, 0.8, 0.8); // Crown scale
    } else if (modelSrc.includes('character3')) {
      return new THREE.Vector3(1.1, 1.1, 1.1); // Hat scale
    }
  } else if (modelSrc.includes('set2')) {
    return new THREE.Vector3(1.2, 1.2, 1.2); // Wizard hat scale
  } else if (modelSrc.includes('set4')) {
    return new THREE.Vector3(0.95, 0.95, 0.95); // Helmet scale
  }

  return new THREE.Vector3(1, 1, 1);
}

// Helper function to get headgear rotation based on model
function getHeadgearRotation(modelSrc: string | undefined): THREE.Euler {
  if (!modelSrc) return new THREE.Euler(0, 0, 0);

  // Set specific rotations based on character/set
  if (modelSrc.includes('set2')) {
    return new THREE.Euler(0, 0, Math.PI / 16); // Slightly tilted wizard hat
  }

  return new THREE.Euler(0, 0, 0);
}

export class GCAThreeModel {
  model: THREE.Group | THREE.Mesh | undefined;
  loader: THREE.Loader = new FBXLoader();
  mixer: THREE.AnimationMixer | undefined;
  wingMixer: THREE.AnimationMixer | undefined;
  shouldRotating: boolean = false;

  Start = ({
    modelSrc,
    scene,
    renderer,
    shouldRotating = true,
    answerIsCorrect = true,
    onLoaded, // Add the onLoaded callback parameter
  }: {
    modelSrc?: string;
    scene?: THREE.Object3D;
    shouldRotating?: boolean;
    renderer: THREE.WebGLRenderer;
    answerIsCorrect?: boolean;
    onLoaded?: () => void; // Add the type definition
  }): void => {
    console.log('Model src in character: ' + modelSrc);

    if (modelSrc) {
      if (scene instanceof THREE.Scene) {
        LoadCharacter(
          modelSrc,
          scene,
          (character: THREE.Group, actualModelUsed: string) => {
            // Use actualModelUsed instead of modelSrc for all positioning and accessory logic
            console.log(
              `Original modelSrc: ${modelSrc}, Actually loaded: ${actualModelUsed}`,
            );

            let mixer: THREE.AnimationMixer | null = null;
            scene?.add(character);

            // Use actualModelUsed for all positioning logic
            if (
              actualModelUsed.includes('set1_character1') ||
              actualModelUsed.includes('set1_character2') ||
              actualModelUsed.includes('set1_character4')
            ) {
              character.scale.set(0.038, 0.038, 0.038);
              character.position.y = -4;
              character.position.x = 0;
              character.position.z = -5;
              character.rotateX(-0.4);
            } else if (actualModelUsed.includes('set1_character3')) {
              character.scale.set(0.038, 0.038, 0.038);
              character.position.y = -5.5;
              character.position.x = 0.2;
              character.position.z = -5;
              character.rotateX(-0.4);
            } else if (actualModelUsed.includes('set2')) {
              character.scale.set(0.035, 0.035, 0.035);
              character.position.y = -6.5;
              character.position.x = 0;
              character.position.z = -7;
              character.rotateY(-15.8);
              character.rotateX(-0.4);
            } else if (
              actualModelUsed.includes('set3_character1') ||
              actualModelUsed.includes('set3_character2')
            ) {
              character.scale.set(0.013, 0.013, 0.013);
              character.position.y = -3;
              character.position.x = 0;
              character.rotateX(-0.4);
              character.rotateY(0.3);
            } else if (
              actualModelUsed.includes('set3_character3') ||
              actualModelUsed.includes('set3_character4')
            ) {
              character.scale.set(0.013, 0.013, 0.013);
              character.position.y = -3;
              character.position.x = 0;
              character.rotateX(-0.4);
            } else if (actualModelUsed.includes('set4')) {
              character.scale.set(0.015, 0.015, 0.015);
              character.position.y = -3;
              character.position.x = 0;
              character.rotateY(-15.8);
              character.rotateX(-0.4);
            } else if (actualModelUsed.includes('set5_character2')) {
              character.scale.set(0.015, 0.015, 0.015);
              character.position.y = -3;
              character.position.x = 0.2;
              character.rotateX(-0.2);
            } else {
              character.scale.set(0.015, 0.015, 0.015);
              character.position.y = -3;
              character.position.x = 0.2;
              character.rotateX(-0.2);
            }

            this.model = character;
            if (onLoaded) {
              character.visible = true;
            } else {
              character.visible = false;
            }

            // After loading the character but before adding new wings
            character.traverse((child: any) => {
              // Look for mesh with name containing "Wings" or specific wing mesh names
              if (
                child instanceof THREE.Mesh &&
                (child.name.includes('Wings') ||
                  child.name.includes('Wings_01_Gold') ||
                  child.name === 'Wings_01_Gold')
              ) {
                console.log(`Found and hiding original wing mesh: ${child.name}`);
                child.visible = false;
              }

              // Apply texture settings as in your original code
              if (child instanceof THREE.Mesh) {
                if (child.material.map) {
                  child.material.map.minFilter = THREE.LinearFilter;
                  child.material.map.generateMipmaps = true;
                  child.material.map.anisotropy =
                    renderer.capabilities.getMaxAnisotropy();
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

            const newCharacter = character;

            // Helper function to find bones by name
            const findBone = (name: string): THREE.Object3D | null => {
              let bone: THREE.Object3D | null = null;
              newCharacter.traverse((object: THREE.Object3D) => {
                if (object.name === name) {
                  bone = object;
                }
              });
              return bone;
            };

            // Load Weapon based on ACTUAL character model loaded
            const weaponPath = getWeaponModelPath(actualModelUsed);
            if (weaponPath) {
              const attachmentBone = getWeaponAttachmentBone(actualModelUsed);
              const weaponScale = getWeaponScale(actualModelUsed);
              const weaponRotation = getWeaponRotation(actualModelUsed);

              new FBXLoaderHelper(weaponPath, (loadedWeapon: THREE.Group) => {
                const bone = findBone(attachmentBone);
                if (bone) {
                  loadedWeapon.scale.copy(weaponScale);
                  loadedWeapon.rotation.order = weaponRotation.order; // <--- ADD THIS LINE
                  loadedWeapon.rotation.copy(weaponRotation);

                  //where to set weapon position - using actualModelUsed
                  if (
                    actualModelUsed.includes('set1_character1_level1') ||
                    actualModelUsed.includes('set1_character1_level2')
                  ) {
                    loadedWeapon.position.set(3.6, -7, -4);
                  } else if (
                    actualModelUsed.includes('set1_character2_level1') ||
                    actualModelUsed.includes('set1_character2_level2')
                  ) {
                    loadedWeapon.position.set(5, -2, -3);
                  } else if (
                    actualModelUsed.includes('set1_character1_level3') ||
                    actualModelUsed.includes('set1_character1_level4') ||
                    actualModelUsed.includes('set1_character1_level5')
                  ) {
                    loadedWeapon.position.set(5, 1, -2);
                  } else if (
                    actualModelUsed.includes('set1_character2_level3') ||
                    actualModelUsed.includes('set1_character2_level4') ||
                    actualModelUsed.includes('set1_character2_level5')
                  ) {
                    loadedWeapon.position.set(4.5, -1, -2);
                  } else if (
                    actualModelUsed.includes('set1_character3_level1') ||
                    actualModelUsed.includes('set1_character3_level2')
                  ) {
                    loadedWeapon.position.set(5.2, -7, -1.5);
                  } else if (
                    actualModelUsed.includes('set1_character3_level3') ||
                    actualModelUsed.includes('set1_character3_level4')
                  ) {
                    loadedWeapon.position.set(4, -2, -1);
                  } else if (
                    actualModelUsed.includes('set1_character4_level1') ||
                    actualModelUsed.includes('set1_character4_level2') ||
                    actualModelUsed.includes('set1_character4_level3') ||
                    actualModelUsed.includes('set1_character4_level5')
                  ) {
                    loadedWeapon.position.set(5, 20, -2.5);
                  } else if (actualModelUsed.includes('set1_character4_level4')) {
                    loadedWeapon.position.set(5, 0, -1.5);
                  }

                  //set 2
                  else if (actualModelUsed.includes('set2_character1')) {
                    loadedWeapon.position.set(8, -10, 14);
                  } else if (actualModelUsed.includes('set2_character2')) {
                    loadedWeapon.position.set(8, -15, 4);
                  } else if (
                    actualModelUsed.includes('set2_character3') ||
                    actualModelUsed.includes('set2_character4')
                  ) {
                    loadedWeapon.position.set(8, -15, 7);
                  } else if (
                    actualModelUsed.includes('set3_character1') ||
                    actualModelUsed.includes('set3_character2')
                  ) {
                    loadedWeapon.position.set(12, -8, -6);
                  } else if (
                    actualModelUsed.includes('set3_character3') ||
                    actualModelUsed.includes('set3_character4')
                  ) {
                    loadedWeapon.position.set(12, -5, 0);
                  }

                  //set14
                  else if (actualModelUsed.includes('set4_character1')) {
                    loadedWeapon.position.set(12, -18, 6);
                  } else if (actualModelUsed.includes('set4_character2')) {
                    loadedWeapon.position.set(12, -48, 2);
                  } else if (actualModelUsed.includes('set4_character3')) {
                    loadedWeapon.position.set(12, -22, 2);
                  } else if (actualModelUsed.includes('set4_character4')) {
                    loadedWeapon.position.set(12, -22, 2);
                  }

                  //set5
                  else if (actualModelUsed.includes('set5_character1_level1')) {
                    loadedWeapon.position.set(-2, 6, -28);
                  } else if (actualModelUsed.includes('set5_character1_level2')) {
                    loadedWeapon.position.set(-2, 6, -28);
                  } else if (actualModelUsed.includes('set5_character1_level3')) {
                    loadedWeapon.position.set(-2, 6, -28);
                  } else if (actualModelUsed.includes('set5_character1_level4')) {
                    loadedWeapon.position.set(-2, 6, -28);
                  } else if (actualModelUsed.includes('set5_character1_level5')) {
                    loadedWeapon.position.set(-2, 6, -28);
                  }

                  //set5_character2
                  else if (actualModelUsed.includes('set5_character2_level1')) {
                    loadedWeapon.position.set(2, 28, -6);
                  } else if (actualModelUsed.includes('set5_character2_level2')) {
                    loadedWeapon.position.set(2, 28, -6);
                  } else if (actualModelUsed.includes('set5_character2_level3')) {
                    loadedWeapon.position.set(2, 28, -6);
                  } else if (actualModelUsed.includes('set5_character2_level4')) {
                    loadedWeapon.position.set(2, 28, -6);
                  } else if (actualModelUsed.includes('set5_character2_level5')) {
                    loadedWeapon.position.set(2, 28, -6);
                  }

                  //set5_character1_level3
                  else if (actualModelUsed.includes('set5_character3_level1')) {
                    loadedWeapon.position.set(-2, 6, -28);
                  } else if (actualModelUsed.includes('set5_character3_level2')) {
                    loadedWeapon.position.set(-2, 6, -28);
                  } else if (actualModelUsed.includes('set5_character3_level3')) {
                    loadedWeapon.position.set(-2, 6, -28);
                  } else if (actualModelUsed.includes('set5_character3_level4')) {
                    loadedWeapon.position.set(-2, 6, -28);
                  } else if (actualModelUsed.includes('set5_character3_level5')) {
                    loadedWeapon.position.set(-2, 6, -28);
                  }

                  //set5_character4
                  else if (actualModelUsed.includes('set5_character4_level1')) {
                    loadedWeapon.position.set(-2, 6, -28);
                  } else if (actualModelUsed.includes('set5_character4_level2')) {
                    loadedWeapon.position.set(-2, 6, -28);
                  } else if (actualModelUsed.includes('set5_character4_level3')) {
                    loadedWeapon.position.set(-2, 6, -28);
                  } else if (actualModelUsed.includes('set5_character4_level4')) {
                    loadedWeapon.position.set(-2, 6, -28);
                  } else if (actualModelUsed.includes('set5_character4_level5')) {
                    loadedWeapon.position.set(-2, 6, -28);
                  }

                  // Add to attachment point
                  bone.add(loadedWeapon);
                  console.log(
                    `Added ${weaponPath} weapon to character at ${attachmentBone}`,
                  );
                } else {
                  console.warn(`Bone "${attachmentBone}" not found in character model`);
                }
              });
            }

            // Load Shield based on ACTUAL character model loaded
            const shieldPath = getShieldModelPath(actualModelUsed);
            if (shieldPath) {
              const attachmentBone = getShieldAttachmentBone(actualModelUsed);
              const shieldScale = getShieldScale(actualModelUsed);
              const shieldRotation = getShieldRotation(actualModelUsed);

              new FBXLoaderHelper(shieldPath, (loadedShield: THREE.Group) => {
                const bone = findBone(attachmentBone);
                if (bone) {
                  // Apply scale and rotation
                  loadedShield.scale.copy(shieldScale);
                  loadedShield.rotation.copy(shieldRotation);

                  if (actualModelUsed.includes('set3_character1_level5')) {
                    loadedShield.position.set(8, -5, -2);
                  } else if (actualModelUsed.includes('set3_character2_level5')) {
                    loadedShield.position.set(8, -5, -2);
                  }

                  // Add to attachment point
                  bone.add(loadedShield);
                  console.log(
                    `Added ${shieldPath} shield to character at ${attachmentBone}`,
                  );
                } else {
                  console.warn(`Bone "${attachmentBone}" not found in character model`);
                }
              });
            }

            // Load Headgear based on ACTUAL character model loaded
            const headgearPath = getHeadgearModelPath(actualModelUsed);
            if (headgearPath) {
              const attachmentBone = getHeadgearAttachmentBone(actualModelUsed);
              const headgearScale = getHeadgearScale(actualModelUsed);
              const headgearRotation = getHeadgearRotation(actualModelUsed);

              new FBXLoaderHelper(headgearPath, (loadedHeadgear: THREE.Group) => {
                const bone = findBone(attachmentBone);
                if (bone) {
                  // Apply scale and rotation
                  loadedHeadgear.scale.copy(headgearScale);
                  loadedHeadgear.rotation.copy(headgearRotation);

                  // Add to attachment point
                  bone.add(loadedHeadgear);
                  console.log(
                    `Added ${headgearPath} headgear to character at ${attachmentBone}`,
                  );
                } else {
                  console.warn(`Bone "${attachmentBone}" not found in character model`);
                }
              });
            }

            // Apply wings based on ACTUAL character model loaded
            const wingPath = getWingModelPath(actualModelUsed);
            if (wingPath) {
              new FBXLoaderHelper(wingPath, (loadedWing: THREE.Group) => {
                const chestBone = findBone('Chest_R');
                if (chestBone) {
                  chestBone.add(loadedWing);
                  console.log(`Added ${wingPath} wings to character`);

                  // Wing animation
                  loadFBXAnimation(
                    actualModelUsed.includes('level4')
                      ? '/assets/animation/wingLevel4.fbx'
                      : '/assets/animation/WingIdle.fbx',
                    'Idle',
                    (animationClip: THREE.AnimationClip) => {
                      const mixer = new THREE.AnimationMixer(loadedWing);
                      const action = mixer.clipAction(animationClip);
                      action.play();
                      this.wingMixer = mixer;
                    },
                    (error: any) => {
                      console.error('Error loading wing animation:', error);
                    },
                  );
                } else {
                  console.warn('Bone "Chest_R" not found in character model');
                }
              });
            }

            // Get the appropriate animation file based on actualModelUsed and answerIsCorrect
            const animationFile = getAnimationPath(actualModelUsed, answerIsCorrect);
            console.log(
              `Using animation file: ${animationFile} for model ${actualModelUsed} (answerIsCorrect: ${answerIsCorrect})`,
            );

            // Char 3 Hair - MODIFIED TO USE FBXLoaderHelper with getBone
            if (actualModelUsed.includes('set1_character3')) {
              const boneTarget = findBone('Hair_Root');
              if (boneTarget) {
                boneTarget.name = 'Hair_Anchored';
              }
            }

            // Determine which animations to load based on the actualModelUsed
            let animationBasedOnModelSrc = '';

            //new animation path
            if (actualModelUsed.includes('set1_character1')) {
              animationBasedOnModelSrc = '/assets/animation/New-Idle/Set1/Character1.fbx';
            } else if (actualModelUsed.includes('set1_character2')) {
              animationBasedOnModelSrc = '/assets/animation/New-Idle/Set1/Character2.fbx';
            } else if (actualModelUsed.includes('set1_character3')) {
              animationBasedOnModelSrc = '/assets/animation/testIdle.fbx';
            } else if (actualModelUsed.includes('set1_character4')) {
              animationBasedOnModelSrc = '/assets/animation/New-Idle/Set1/Character4.fbx';
            } else if (actualModelUsed.includes('set2')) {
              animationBasedOnModelSrc =
                '/assets/animation/New-Idle/Set2/Character1-4.fbx';
            } else if (actualModelUsed.includes('set3_character1')) {
              animationBasedOnModelSrc =
                '/assets/animation/New-Idle/Set3/Character1-2.fbx';
            } else if (actualModelUsed.includes('set3_character2')) {
              animationBasedOnModelSrc =
                '/assets/animation/New-Idle/Set3/Character1-2.fbx';
            } else if (actualModelUsed.includes('set3_character3')) {
              animationBasedOnModelSrc =
                '/assets/animation/New-Idle/Set3/Character3-4.fbx';
            } else if (actualModelUsed.includes('set3_character4')) {
              animationBasedOnModelSrc =
                '/assets/animation/New-Idle/Set3/Character3-4.fbx';
            } else if (actualModelUsed.includes('set4')) {
              animationBasedOnModelSrc =
                '/assets/animation/New-Idle/Set4/Character1-4.fbx';
            } else if (actualModelUsed.includes('set5_character1')) {
              animationBasedOnModelSrc = '/assets/animation/New-Idle/Set5/Character1.fbx';
            } else if (actualModelUsed.includes('set5_character2')) {
              animationBasedOnModelSrc = '/assets/animation/New-Idle/Set5/Character2.fbx';
            } else if (actualModelUsed.includes('set5_character3')) {
              animationBasedOnModelSrc = '/assets/animation/New-Idle/Set5/Character3.fbx';
            } else if (actualModelUsed.includes('set5_character4')) {
              animationBasedOnModelSrc = '/assets/animation/New-Idle/Set5/Character4.fbx';
            } else {
              // Default animations
              animationBasedOnModelSrc =
                '/assets/animation/MainMenu-Idle/Neutral Idle (2).fbx';
            }

            loadFBXAnimation(
              animationBasedOnModelSrc,
              'mixamo.com',
              (animationClip: THREE.AnimationClip) => {
                character.animations.push(animationClip);
                mixer = new THREE.AnimationMixer(character);
                const clips = character.animations;
                console.log('Clips name: ', clips);

                const resultClip = THREE.AnimationClip.findByName(clips, 'mixamo.com');
                if (resultClip && mixer) {
                  const resultAction = mixer.clipAction(resultClip);
                  // Change from LoopOnce to LoopRepeat for continuous looping
                  resultAction.setLoop(THREE.LoopRepeat, Infinity);
                  // Set to false so animation doesn't stop at the end
                  resultAction.clampWhenFinished = false;
                  resultAction.play();

                  loadFBXAnimation(
                    '/assets/animation/Idle.fbx',
                    'mixamo.com',
                    (idleClip: THREE.AnimationClip) => {
                      if (!mixer) return;

                      character.animations.push(idleClip);
                      const idleAction = mixer.clipAction(idleClip);
                      idleAction.setLoop(THREE.LoopRepeat, Infinity);

                      // Call onLoaded callback when all animations are loaded
                      if (onLoaded) {
                        console.log(
                          'Character model fully loaded, calling onLoaded callback',
                        );
                        onLoaded();
                      }
                    },
                    (error: any) => {
                      console.error('Error loading idle animation:', error);
                      // Call onLoaded even on error to avoid blocking the UI
                      if (onLoaded) {
                        console.log(
                          'Character model loading had errors, still calling onLoaded',
                        );
                        onLoaded();
                      }
                    },
                  );
                } else {
                  console.error('Result animation clip not found');
                  // Call onLoaded even if clip not found
                  if (onLoaded) {
                    console.log(
                      'Character model loading had issues, still calling onLoaded',
                    );
                    onLoaded();
                  }
                }

                this.mixer = mixer;
              },
              (error: any) => {
                console.error('Error loading result animation:', error);
                // Call onLoaded even on error to avoid blocking the UI
                if (onLoaded) {
                  console.log(
                    'Character model loading had errors, still calling onLoaded',
                  );
                  onLoaded();
                }
              },
            );
          },
        );
      } else {
        console.error(
          'Error: scene must be a THREE.Scene when modelSrc is provided for LoadCharacter.',
        );
        // Call onLoaded even on error to avoid blocking the UI
        if (onLoaded) {
          console.log(
            'Character model loading failed (invalid scene), still calling onLoaded',
          );
          onLoaded();
        }
        return;
      }
    } else {
      // Call onLoaded immediately for default model
      if (onLoaded) {
        console.log('Default model loaded, calling onLoaded callback');
        onLoaded();
      }
    }
    this.shouldRotating = shouldRotating;
  };

  Update = ({ deltaTime }: { deltaTime: number }) => {
    if (this.model && this.shouldRotating) {
      //this.model.rotation.y += 0.001 * deltaTime;
    }
    if (this.mixer) {
      this.mixer.update(deltaTime / 1000);
    }
    if (this.wingMixer) {
      this.wingMixer.update(deltaTime / 1000);
    }
  };

  getWeaponPosition(): THREE.Vector3 {
    // Simple implementation that returns a position relative to the model
    if (!this.model) {
      return new THREE.Vector3(0, 0, 0);
    }

    const position = new THREE.Vector3();
    if (this.model.position) {
      position.copy(this.model.position);
    }

    // Add offset for weapon tip - adjust these values as needed
    position.y += 1.5;
    position.x += 0.5;

    return position;
  }

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
