import { getAssetPath } from '@global/helper/assetsGateway';
import { AvatarOutput, AvatarResponse } from '../types';

// Mapping functions and constants (previously defined)
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
  set1_character1_level1: getAssetPath('character', 'set-1-character-1-level-1', '.png'),
  set1_character1_level2: getAssetPath('character', 'set-1-character-1-level-2', '.png'),
  set1_character1_level3: getAssetPath('character', 'set-1-character-1-level-3', '.png'),
  set1_character1_level4: getAssetPath('character', 'set-1-character-1-level-4', '.png'),
  set1_character1_level5: getAssetPath('character', 'set-1-character-1-level-5', '.png'),
  set1_character2_level1: getAssetPath('character', 'set-1-character-2-level-1', '.png'),
  set1_character2_level2: getAssetPath('character', 'set-1-character-2-level-2', '.png'),
  set1_character2_level3: getAssetPath('character', 'set-1-character-2-level-3', '.png'),
  set1_character2_level4: getAssetPath('character', 'set-1-character-2-level-4', '.png'),
  set1_character2_level5: getAssetPath('character', 'set-1-character-2-level-5', '.png'),
  set1_character3_level1: getAssetPath('character', 'set-1-character-3-level-1', '.png'),
  set1_character3_level2: getAssetPath('character', 'set-1-character-3-level-2', '.png'),
  set1_character3_level3: getAssetPath('character', 'set-1-character-3-level-3', '.png'),
  set1_character3_level4: getAssetPath('character', 'set-1-character-3-level-4', '.png'),
  set1_character3_level5: getAssetPath('character', 'set-1-character-3-level-5', '.png'),
  set1_character4_level1: getAssetPath('character', 'set-1-character-4-level-1', '.png'),
  set1_character4_level2: getAssetPath('character', 'set-1-character-4-level-2', '.png'),
  set1_character4_level3: getAssetPath('character', 'set-1-character-4-level-3', '.png'),
  set1_character4_level4: getAssetPath('character', 'set-1-character-4-level-4', '.png'),
  set1_character4_level5: getAssetPath('character', 'set-1-character-4-level-5', '.png'),
};

const charactersData = {
  set1: {
    character1: {
      name: 'ไมตี้ นักรบผู้กล้า',
      description:
        'นักรบหนุ่มสุดแกร่ง ที่ออกเดินทางตามหาดาบศักดิ์สิทธิ์เพื่อปกป้องอาณาจักรของเขา',
    },
    character2: {
      name: 'ฟินน์ นักธนูเงาแห่งป่า2',
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

// Utility function to find character data
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

// Mapping function for CharacterResponse to CharacterOutput
// Mapping function for CharacterResponse to CharacterOutput
export const mapCharacterResponseToOutput = (avatar: AvatarResponse): AvatarOutput => {
  const characterData = getCharacterData(avatar.model_id);

  // Reverse lookup: Find the key that matches the value of character.model_id
  const modelKey =
    Object.keys(characterModelURLs).find(
      (key) => characterModelURLs[key] === avatar.model_id,
    ) || avatar.model_id; // Default to character.model_id if no match is found

  console.log('Avatar map: ', avatar);

  return {
    id: avatar.avatar_id,
    name: characterData?.name || `Avatar ${avatar.id}`, // Use name from charactersData or fallback
    avatar_id: avatar.model_id, // Now correctly typed as string
    description: characterData?.description || `This is avatar ${avatar.id}`, // Use description or fallback
    model_src: characterModelURLs[avatar.model_id] || '/default/model.fbx', // Fallback to default
    src:
      characterSrcURLs[avatar.model_id] ||
      getAssetPath('character', 'set-1-character-1-level-1', '.png'),
    selected: avatar.is_equipped,
    buy: true, // Directly use the boolean
    lock: false, // Ensure first avatar is unlocked
    price: avatar.price, // Already a number
  };
};
