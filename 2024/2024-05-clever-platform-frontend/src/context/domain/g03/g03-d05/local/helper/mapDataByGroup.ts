import { getAssetPath } from '@global/helper/assetsGateway';
import { AvatarOutput, AvatarResponse } from '../type';

const characterModelURLs: { [key: string]: string } = {
  set1_character1_level1: '/character/set1/character1/level1.fbx',
  set1_character1_level2: '/character/set1/character1/level2.fbx',
  set1_character1_level3: '/character/set1/character1/level3.fbx',
  set1_character1_level4: '/character/set1/character1/level4.fbx',
  set1_character1_level5: '/character/set1/character1/level5.fbx',
  set1_character2_level1: '/character/set1/character2/level1.fbx',
  set1_character2_level2: '/character/set1/character2/level2.fbx',
  set1_character2_level3: '/character/set1/character2/level3.fbx',
  set1_character2_level4: '/character/set1/character2/level4.fbx',
  set1_character2_level5: '/character/set1/character2/level5.fbx',
  set1_character3_level1: '/character/set1/character3/level1.fbx',
  set1_character3_level2: '/character/set1/character3/level2.fbx',
  set1_character3_level3: '/character/set1/character3/level3.fbx',
  set1_character3_level4: '/character/set1/character3/level4.fbx',
  set1_character3_level5: '/character/set1/character3/level5.fbx',
  set1_character4_level1: '/character/set1/Character4/level1.fbx',
  set1_character4_level2: '/character/set1/Character4/level2.fbx',
  set1_character4_level3: '/character/set1/Character4/level3.fbx',
  set1_character4_level4: '/character/set1/Character4/level4.fbx',
  set1_character4_level5: '/character/set1/Character4/level5.fbx',
};

const characterSrcURLs: { [key: string]: string } = {
  set1_character1_level1: getAssetPath('character', 'Set1_Char1', '.png'),
  set1_character1_level2: getAssetPath('character', 'Set1_Char1', '.png'),
  set1_character1_level3: getAssetPath('character', 'Set1_Char1', '.png'),
  set1_character1_level4: getAssetPath('character', 'Set1_Char1', '.png'),
  set1_character1_level5: getAssetPath('character', 'Set1_Char1', '.png'),
  //set
  set1_character2_level1: getAssetPath('character', 'Set1_Char2', '.png'),
  set1_character2_level2: getAssetPath('character', 'Set1_Char2', '.png'),
  set1_character2_level3: getAssetPath('character', 'Set1_Char2', '.png'),
  set1_character2_level4: getAssetPath('character', 'Set1_Char2', '.png'),
  set1_character2_level5: getAssetPath('character', 'Set1_Char2', '.png'),
  //set
  set1_character3_level1: getAssetPath('character', 'Set1_Char3', '.png'),
  set1_character3_level2: getAssetPath('character', 'Set1_Char3', '.png'),
  set1_character3_level3: getAssetPath('character', 'Set1_Char3', '.png'),
  set1_character3_level4: getAssetPath('character', 'Set1_Char3', '.png'),
  set1_character3_level5: getAssetPath('character', 'Set1_Char3', '.png'),
  //set
  set1_character4_level1: getAssetPath('character', 'Set1_Char4', '.png'),
  set1_character4_level2: getAssetPath('character', 'Set1_Char4', '.png'),
  set1_character4_level3: getAssetPath('character', 'Set1_Char4', '.png'),
  set1_character4_level4: getAssetPath('character', 'Set1_Char4', '.png'),
  set1_character4_level5: getAssetPath('character', 'Set1_Char4', '.png'),
  //set

  set2_character1_level1: getAssetPath('character', 'Set2_Char1', '.png'),
  set2_character1_level2: getAssetPath('character', 'Set2_Char1', '.png'),
  set2_character1_level3: getAssetPath('character', 'Set2_Char1', '.png'),
  set2_character1_level4: getAssetPath('character', 'Set2_Char1', '.png'),
  set2_character1_level5: getAssetPath('character', 'Set2_Char1', '.png'),
  //set
  set2_character2_level1: getAssetPath('character', 'Set2_Char2', '.png'),
  set2_character2_level2: getAssetPath('character', 'Set2_Char2', '.png'),
  set2_character2_level3: getAssetPath('character', 'Set2_Char2', '.png'),
  set2_character2_level4: getAssetPath('character', 'Set2_Char2', '.png'),
  set2_character2_level5: getAssetPath('character', 'Set2_Char2', '.png'),
  //set
  set2_character3_level1: getAssetPath('character', 'Set2_Char3', '.png'),
  set2_character3_level2: getAssetPath('character', 'Set2_Char3', '.png'),
  set2_character3_level3: getAssetPath('character', 'Set2_Char3', '.png'),
  set2_character3_level4: getAssetPath('character', 'Set2_Char3', '.png'),
  set2_character3_level5: getAssetPath('character', 'Set2_Char3', '.png'),
  //set
  set2_character4_level1: getAssetPath('character', 'Set2_Char4', '.png'),
  set2_character4_level2: getAssetPath('character', 'Set2_Char4', '.png'),
  set2_character4_level3: getAssetPath('character', 'Set2_Char4', '.png'),
  set2_character4_level4: getAssetPath('character', 'Set2_Char4', '.png'),
  set2_character4_level5: getAssetPath('character', 'Set2_Char4', '.png'),
  //set

  set3_character1_level1: getAssetPath('character', 'Set3_Char1', '.png'),
  set3_character1_level2: getAssetPath('character', 'Set3_Char1', '.png'),
  set3_character1_level3: getAssetPath('character', 'Set3_Char1', '.png'),
  set3_character1_level4: getAssetPath('character', 'Set3_Char1', '.png'),
  set3_character1_level5: getAssetPath('character', 'Set3_Char1', '.png'),
  //set
  set3_character2_level1: getAssetPath('character', 'Set3_Char2', '.png'),
  set3_character2_level2: getAssetPath('character', 'Set3_Char2', '.png'),
  set3_character2_level3: getAssetPath('character', 'Set3_Char2', '.png'),
  set3_character2_level4: getAssetPath('character', 'Set3_Char2', '.png'),
  set3_character2_level5: getAssetPath('character', 'Set3_Char2', '.png'),
  //set
  set3_character3_level1: getAssetPath('character', 'Set3_Char3', '.png'),
  set3_character3_level2: getAssetPath('character', 'Set3_Char3', '.png'),
  set3_character3_level3: getAssetPath('character', 'Set3_Char3', '.png'),
  set3_character3_level4: getAssetPath('character', 'Set3_Char3', '.png'),
  set3_character3_level5: getAssetPath('character', 'Set3_Char3', '.png'),
  //set
  set3_character4_level1: getAssetPath('character', 'Set3_Char4', '.png'),
  set3_character4_level2: getAssetPath('character', 'Set3_Char4', '.png'),
  set3_character4_level3: getAssetPath('character', 'Set3_Char4', '.png'),
  set3_character4_level4: getAssetPath('character', 'Set3_Char4', '.png'),
  set3_character4_level5: getAssetPath('character', 'Set3_Char4', '.png'),

  set4_character1_level1: getAssetPath('character', 'Set4_Char1', '.png'),
  set4_character1_level2: getAssetPath('character', 'Set4_Char1', '.png'),
  set4_character1_level3: getAssetPath('character', 'Set4_Char1', '.png'),
  set4_character1_level4: getAssetPath('character', 'Set4_Char1', '.png'),
  set4_character1_level5: getAssetPath('character', 'Set4_Char1', '.png'),
  //set
  set4_character2_level1: getAssetPath('character', 'Set4_Char2', '.png'),
  set4_character2_level2: getAssetPath('character', 'Set4_Char2', '.png'),
  set4_character2_level3: getAssetPath('character', 'Set4_Char2', '.png'),
  set4_character2_level4: getAssetPath('character', 'Set4_Char2', '.png'),
  set4_character2_level5: getAssetPath('character', 'Set4_Char2', '.png'),
  //set
  set4_character3_level1: getAssetPath('character', 'Set4_Char3', '.png'),
  set4_character3_level2: getAssetPath('character', 'Set4_Char3', '.png'),
  set4_character3_level3: getAssetPath('character', 'Set4_Char3', '.png'),
  set4_character3_level4: getAssetPath('character', 'Set4_Char3', '.png'),
  set4_character3_level5: getAssetPath('character', 'Set4_Char3', '.png'),
  //set
  set4_character4_level1: getAssetPath('character', 'Set4_Char4', '.png'),
  set4_character4_level2: getAssetPath('character', 'Set4_Char4', '.png'),
  set4_character4_level3: getAssetPath('character', 'Set4_Char4', '.png'),
  set4_character4_level4: getAssetPath('character', 'Set4_Char4', '.png'),
  set4_character4_level5: getAssetPath('character', 'Set4_Char4', '.png'),

  set5_character1_level1: getAssetPath('character', 'Set5_Char1', '.png'),
  set5_character1_level2: getAssetPath('character', 'Set5_Char1', '.png'),
  set5_character1_level3: getAssetPath('character', 'Set5_Char1', '.png'),
  set5_character1_level4: getAssetPath('character', 'Set5_Char1', '.png'),
  set5_character1_level5: getAssetPath('character', 'Set5_Char1', '.png'),
  //set
  set5_character2_level1: getAssetPath('character', 'Set5_Char2', '.png'),
  set5_character2_level2: getAssetPath('character', 'Set5_Char2', '.png'),
  set5_character2_level3: getAssetPath('character', 'Set5_Char2', '.png'),
  set5_character2_level4: getAssetPath('character', 'Set5_Char2', '.png'),
  set5_character2_level5: getAssetPath('character', 'Set5_Char2', '.png'),
  //set
  set5_character3_level1: getAssetPath('character', 'Set5_Char3', '.png'),
  set5_character3_level2: getAssetPath('character', 'Set5_Char3', '.png'),
  set5_character3_level3: getAssetPath('character', 'Set5_Char3', '.png'),
  set5_character3_level4: getAssetPath('character', 'Set5_Char3', '.png'),
  set5_character3_level5: getAssetPath('character', 'Set5_Char3', '.png'),
  //set
  set5_character4_level1: getAssetPath('character', 'Set5_Char4', '.png'),
  set5_character4_level2: getAssetPath('character', 'Set5_Char4', '.png'),
  set5_character4_level3: getAssetPath('character', 'Set5_Char4', '.png'),
  set5_character4_level4: getAssetPath('character', 'Set5_Char4', '.png'),
  set5_character4_level5: getAssetPath('character', 'Set5_Char4', '.png'),
};

// Fallback character data in case translations are not available
const charactersData = {
  set1: {
    character1: {
      name: 'ไมตี้ นักรบผู้กล้า',
      description:
        'นักรบหนุ่มสุดแกร่ง ที่ออกเดินทางตามหาดาบศักดิ์สิทธิ์เพื่อปกป้องอาณาจักรของเขา',
    },
    character2: {
      name: 'ฟินน์ นักธนูเงาแห่งป่า',
      description: 'นักธนูผู้เงียบงัน แม่นยำระดับตำนาน คอยพิทักษ์ป่าจากอันตราย',
    },
    character3: {
      name: 'ไลอา นักเวทแห่งแสง',
      description: 'แม่มดน้อยพลังแสง ที่ใช้เวทมนตร์เยียวยาผู้คนและขจัดความมืด',
    },
    character4: {
      name: 'ดาเมียน จอมอัศวินมนต์ดำ',
      description:
        'อัศวินลึกลับ ที่ถูกแม่มดใจร้าย สาปให้ต้องออกเดินทางค้นหาความจริงของอดีตตัวเอง',
    },
  },
  set2: {
    character1: {
      name: 'ดีเจดอน ว่าที่ดีเจสายมันส์ ',
      description:
        'ชอบฟังเพลง บีทไหนมาก็โยกได้หมด! ฝันว่าวันหนึ่งจะได้เปิดเพลงให้ทั้งโลกได้แดนซ์ไปด้วยกัน!',
    },
    character2: {
      name: 'กัปตันโบ นักเดินเรือในอนาคต',
      description:
        'คลั่งไคล้ท้องทะเลที่สุด! ชอบอ่านแผนที่ เรียนรู้เรื่องเรือ และฝันว่าสักวันจะได้เป็นกัปตันที่ยิ่งใหญ่',
    },
    character3: {
      name: 'หมียู เด็กที่อยากเป็นหมี',
      description:
        'รักหมีที่สุด! มีชุดหมีทุกแบบ เก็บของใช้ลายหมีเต็มบ้าน เชื่อว่าถ้าเชื่อมากพอ วันหนึ่งตัวเองจะกลายเป็นหมีจริงๆ!',
    },
    character4: {
      name: 'กู้ดเกิร์ล เด็กน้อยอนาคตไกล',
      description:
        'ถึงจะเคยขี้เกียจเรียน แต่ตอนนี้ตั้งใจสุดๆ! เพราะฝันอยากจบให้ได้และทำให้พ่อแม่ภูมิใจ',
    },
  },
  set3: {
    character1: {
      name: 'แอช แฮ็กเกอร์ลึกลับ',
      description: 'อัจฉริยะด้านเทคโนโลยี แฮ็กทุกระบบได้ในพริบตา แต่หัวใจยังคงอ่อนโยน',
    },
    character2: {
      name: 'นีออน นักซิ่งใต้แสงไฟ',
      description: 'ซิ่งเร็วเหนือแสง ไร้ใครจับได้ พร้อมท้าทายทุกเส้นทางในเมืองแห่งอนาคต',
    },
    character3: {
      name: 'ซิกซ์ นักสู้จักรกล',
      description: 'แข็งแกร่งดั่งเครื่องจักร ไม่มีภารกิจไหนที่ซิกซ์ล้มเหลว!',
    },
    character4: {
      name: 'ลูน่า ทหารไซเบอร์',
      description:
        'เงียบสงัดดั่งราตรี คมดั่งใบมีดแห่งอนาคต ไม่มีเป้าหมายใดรอดพ้นจากสายตาเธอ',
    },
  },
  set4: {
    character1: {
      name: 'โทริ เด็กหนุ่มนักผจญภัย',
      description: 'หัวใจเต็มไปด้วยความฝัน อยากออกสำรวจโลกกว้าง',
    },
    character2: {
      name: 'เรย์ เด็กอัจฉริยะผู้ช่างคิด',
      description: 'ชอบอ่านหนังสือและคิดไอเดียใหม่ๆ อยู่เสมอ',
    },
    character3: {
      name: 'มิน เด็กน้อยผู้สดใส',
      description: 'ตัวเล็กที่สุดในกลุ่ม แต่วิ่งเร็วและอยากรู้อยากเห็นทุกอย่าง!',
    },
    character4: {
      name: 'บิ๊ก พี่ใหญ่ใจดี',
      description: 'ถึงตัวจะดูบึกบึน แต่จริงๆ แล้วเป็นคนอ่อนโยนที่สุด',
    },
  },
  set5: {
    character1: {
      name: 'เท็ดดี้ หมีน้อยขี้เล่น',
      description: 'ชอบกอดที่สุด! เจอใครก็ต้องขอกอดก่อนเสมอ',
    },
    character2: {
      name: 'บันนี่ กระต่ายจอมซน',
      description: ' กระโดดดุ๊กดิ๊กไปมา ไม่มีวันอยู่นิ่ง แถมขโมยแครอทเก่งสุดๆ',
    },
    character3: {
      name: 'มิวมิว แมวแสนรู้',
      description: 'หัวหน้าทีมความขี้อ้อน แค่ส่งสายตาไปก็ได้ขนมกินง่ายๆ',
    },
    character4: {
      name: 'สโนว์ แมวขาวสุดนุ่ม',
      description: 'ตัวฟูเหมือนปุยหิมะ ใครได้กอดเป็นต้องหลงรัก',
    },
  },
} as const;

// Utility function to find character data from the hardcoded data
const getCharacterData = (modelId: string) => {
  const regex = /set(\d+)_character(\d+)_/; // Match set and character identifiers
  const match = modelId.match(regex);
  if (match) {
    const setKey = `set${match[1]}` as keyof typeof charactersData;
    const characterKey =
      `character${match[2]}` as keyof (typeof charactersData)[typeof setKey];
    if (charactersData[setKey] && charactersData[setKey][characterKey]) {
      return charactersData[setKey][characterKey];
    }
  }
  return null; // Default to null if no match is found
};

// This function gets translated data if available, or falls back to hardcoded data
const getCharacterInfo = (modelId: string, t: any = null) => {
  // First try to get the key parts from the model ID
  const regex = /set(\d+)_character(\d+)_/;
  const match = modelId.match(regex);

  if (match) {
    const setKey = `set${match[1]}`;
    const characterKey = `character${match[2]}`;

    // If translation function is provided and working properly
    if (t && typeof t === 'function') {
      try {
        const translationPath = `characters.${setKey}.${characterKey}`;
        const name = t(`${translationPath}.name`);
        const description = t(`${translationPath}.description`);

        // If the translation returns the actual translation (not just the key)
        // and doesn't include the full path, then use it
        if (name && !name.includes(translationPath)) {
          return { name, description };
        }
      } catch (error) {
        console.warn('Translation error for', modelId, error);
        // Fall through to use hardcoded data
      }
    }

    // Fallback to hardcoded data
    return getCharacterData(modelId);
  }

  return null;
};

// Factory function to create the mapper with optional translation
export const createAvatarMapper = (
  tFunction: any = null,
  allAvatars: AvatarResponse[] = [],
) => {
  // Create a map to quickly look up avatars by model_id
  const avatarsByModelId = new Map();
  allAvatars.forEach((avatar) => {
    avatarsByModelId.set(avatar.model_id, avatar);
  });

  return (avatar: AvatarResponse): AvatarOutput => {
    const characterData = getCharacterInfo(avatar.model_id, tFunction);

    //console.log('Avatar from mapdata: ', avatar);

    // Determine if this avatar should be unlocked based on previous level
    let shouldBeUnlocked = false;

    // Extract set, character and level information
    const match = avatar.model_id.match(/^(set\d+_character\d+)_level(\d+)$/);
    if (match) {
      const [, characterBase, levelStr] = match;
      const level = parseInt(levelStr, 10);

      // If it's level 1, it's always unlocked
      if (level === 1) {
        shouldBeUnlocked = true;
      }
      // For higher levels, check if previous level was bought
      else if (level > 1) {
        const previousModelId = `${characterBase}_level${level - 1}`;
        const previousAvatar = avatarsByModelId.get(previousModelId);

        // If previous level exists and is bought, unlock this one
        if (previousAvatar && previousAvatar.is_bought) {
          shouldBeUnlocked = true;
        }
      }
    }

    return {
      id: avatar.id,
      name: characterData?.name || `Avatar ${avatar.id}`,
      avatar_id: avatar.model_id,
      description: characterData?.description || `This is avatar ${avatar.id}`,
      //model_src: characterModelURLs[avatar.model_id] || '/default/model.fbx',
      model_src: avatar.model_id,
      src:
        characterSrcURLs[avatar.model_id] ||
        getAssetPath('character', 'set-1-character-1-level-1', '.png'),
      selected: avatar.is_equipped,
      buy: avatar.is_bought,
      // Lock logic: if it's first level or previous level is bought, unlock it
      lock: shouldBeUnlocked ? false : !avatar.is_bought,
      price: avatar.price,
      is_equipped: avatar.is_equipped,
    };
  };
};

export const applyUnlockLogic = (avatars: any[]): any[] => {
  // Create a deep copy to avoid mutating the original data
  const updatedAvatars = JSON.parse(JSON.stringify(avatars));

  // First, organize avatars by character set
  const characterSets: Record<string, any[]> = {};

  // Group avatars by their character set
  updatedAvatars.forEach((avatar: any) => {
    const match = avatar.avatar_id?.match(/^(set\d+_character\d+)_level(\d+)$/);
    if (match) {
      const [, characterId, levelStr] = match;

      if (!characterSets[characterId]) {
        characterSets[characterId] = [];
      }

      characterSets[characterId].push({
        ...avatar,
        level: parseInt(levelStr),
      });
    }
  });

  // For each character set, sort by level and apply unlock rules
  Object.keys(characterSets).forEach((characterId) => {
    const avatarsInSet = characterSets[characterId];

    // Sort by level to ensure proper sequence
    avatarsInSet.sort((a, b) => a.level - b.level);

    // Apply unlock rules: if previous level is bought and unlocked, unlock current level
    for (let i = 1; i < avatarsInSet.length; i++) {
      const prevAvatar = avatarsInSet[i - 1];
      const currentAvatar = avatarsInSet[i];

      if (prevAvatar.buy === true) {
        console.log(
          `Unlocking ${currentAvatar.avatar_id} (ID: ${currentAvatar.id}) based on ${prevAvatar.avatar_id} (ID: ${prevAvatar.id})`,
        );
        currentAvatar.lock = false;
      }
    }
  });

  // Create a mapping of IDs to updated avatars
  const idToUpdatedAvatar = new Map();
  Object.values(characterSets)
    .flat()
    .forEach((avatar) => {
      idToUpdatedAvatar.set(avatar.id, avatar);
    });

  // Apply updates to the original array order
  return updatedAvatars.map((avatar: AvatarOutput) => {
    const updatedAvatar = idToUpdatedAvatar.get(avatar.id);
    return updatedAvatar || avatar;
  });
};

// Original mapper function for backward compatibility
export const mapAvatarGroupResponseToOutput = (avatar: AvatarResponse): AvatarOutput => {
  const characterData = getCharacterData(avatar.model_id);

  return {
    id: avatar.id,
    name: characterData?.name || `Avatar ${avatar.id}`,
    avatar_id: avatar.model_id,
    description: characterData?.description || `This is avatar ${avatar.id}`,
    model_src: characterModelURLs[avatar.model_id] || '/default/model.fbx',
    src:
      characterSrcURLs[avatar.model_id] ||
      getAssetPath('character', 'set-1-character-1-level-1', '.png'),
    selected: avatar.is_equipped,
    buy: avatar.is_bought,
    lock: avatar.model_id !== 'set1_character1_level1' ? !avatar.is_bought : false,
    price: avatar.price,
    is_equipped: avatar.is_equipped,
  };
};
