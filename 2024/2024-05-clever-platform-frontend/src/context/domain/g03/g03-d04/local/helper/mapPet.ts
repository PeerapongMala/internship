import { getAssetPath } from '@global/helper/assetsGateway';
import { PetOutput, PetResponse } from '../types';

const PetModelURLs: { [key: string]: string } = {
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

export const noSelectedPet: PetOutput = {
  id: 0, // Default id for "NoSelected"
  name: 'NoSelected',
  selected: false,
  buy: true,
  src: '/badge/icon-no-selected.png',
  description: '', // Default empty description
  price: 0, // Default price
  lock: false,
  pet_id: 0,
  model_src: '',
  animation_src: '',
  model_name: '',
  is_equipped: false,
};

export const PetSrcURLs: { [key: string]: string } = {
  Peacock: getAssetPath('pet', 'pet-1', '.svg'),
  Malayan_A: getAssetPath('pet', 'pet-2', '.svg'),
  Elk_A: getAssetPath('pet', 'pet-3', '.svg'),
  Bison: getAssetPath('pet', 'pet-4', '.svg'),
  Mole: getAssetPath('pet', 'pet-5', '.svg'),
  Pangolin_A: getAssetPath('pet', 'pet-6', '.svg'),
  Iguana_A: getAssetPath('pet', 'pet-8', '.svg'),
  Iguana_B: getAssetPath('pet', 'pet-7', '.svg'),
  Anteater_A: getAssetPath('pet', 'pet-10', '.svg'),
  Anteater_B: getAssetPath('pet', 'pet-9', '.svg'),
  Chipmunk_A: getAssetPath('pet', 'pet-11', '.svg'),
  Possum_A: getAssetPath('pet', 'pet-12', '.svg'),
  Otter_A: getAssetPath('pet', 'pet-13', '.svg'),
  Redpanda_A: getAssetPath('pet', 'pet-14', '.svg'),
  Sloth_A: getAssetPath('pet', 'pet-15', '.svg'),
  Armadillo_A: getAssetPath('pet', 'pet-16', '.svg'),
  Armadillo_B: getAssetPath('pet', 'pet-17', '.svg'),
};

const petsData = {
  Peacock: {
    name: 'ปุยปุย (Pui-Pui)',
    description:
      'ขนนุ่มฟูเป็นประกาย ชอบรำแพนหางอวดเพื่อนๆ ถ้าได้รับคำชมจะเขินจนเต้นดุ๊กดิ๊ก!',
  },
  Malayan_A: {
    name: 'ตุ๊ปตั๊ป (Tup-Tap)',
    description:
      'เดินตุ๊บตั๊บไปมา นิสัยขี้สงสัยแต่ใจดี ถ้าเห็นน้ำจะรีบลงไปแช่ให้เย็นชื่นใจ',
  },
  Elk_A: {
    name: 'จีจี้ (Jee-Jee)',
    description:
      'วิ่งเร็วปานสายลม แต่ขี้อายสุดๆ ถ้าอยากให้จีจี้เข้าหาต้องใช้ของโปรดอย่างใบไม้สดๆ',
  },
  Bison: {
    name: 'ขนฟู (Khon-Fu)',
    description: 'ขนหนานุ่มน่ากอดที่สุด! ขนฟูตัวใหญ่ใจดี อยากให้ลูบขนทุกวันเลยนะ',
  },
  Mole: {
    name: 'เพ็บเบิ้ล (Peb-Ble)',
    description:
      'นักขุดดินมือโปร แอบเก็บของเล่นไว้ในโพรงเสมอ ใครอยากเห็นเพ็บเบิ้ลโผล่มาต้องมีขนมล่อ',
  },
  Pangolin_A: {
    name: 'นุ่มนิ่ม (Num-Nim)',
    description: 'ตัวกลมๆ จับแล้วนุ่มสุดๆ! ถ้าตกใจจะม้วนตัวเป็นลูกบอลให้กอดเล่นได้นะ',
  },
  Iguana_A: {
    name: 'มีมี่ (Mee-Mee)',
    description: 'ชอบต้นไม้เป็นชีวิตจิตใจ จะเห็นมีมี่แอบซ่อนอยู่ในพุ่มไม้เสมอ',
  },
  Iguana_B: {
    name: 'มูมู่ (Moo-Moo)',
    description: 'ขี้อ้อนสุดๆ ชอบอาบแดดอุ่นๆ ถ้าลูบหัวเบาๆ จะหลับตาพริ้มเลยล่ะ',
  },
  Anteater_A: {
    name: 'ติ๊ดตี่ (Tid-Tee)',
    description:
      'ลิ้นย้าวยาว! กินมดแบบสายฟ้าแลบ ขี้อายแต่ถ้าไว้ใจแล้วจะชอบเอาหัวมาถูเบาๆ',
  },
  Anteater_B: {
    name: 'ต้อมแต้ม (Tom-Tam)',
    description:
      'นักสำรวจตัวจริง! ชอบดมกลิ่นแล้วตามหาอาหาร ถ้าเจอมดเยอะๆ จะดีใจจนเต้นดุ๊กดิ๊กเลย',
  },
  Chipmunk_A: {
    name: 'ซุกซน (Suk-Son)',
    description:
      'ขี้เล่น วิ่งวุ่นทั้งวัน ไม่มีใครไล่ทัน! ถ้าหายตัวไป ให้ลองมองบนต้นไม้ อาจเจอแอบซ่อนอยู่',
  },
  Possum_A: {
    name: 'ปุ๊กลุก (Puk-Luk)',
    description: 'ถ้าตกใจจะทำเป็นสลบ แต่จริงๆ แค่แกล้ง! แถมยังชอบห้อยหัวนอนเล่นอีกด้วย',
  },
  Otter_A: {
    name: 'ออตโต้ (Ot-to)',
    description:
      'ว่ายน้ำเก่งที่สุด! เวลานอนจะชอบจับมือกับเพื่อนๆ ไม่ให้ลอยไปไหน เป็นตัวกอดแห่งท้องน้ำ',
  },
  Redpanda_A: {
    name: 'แพนแพน (Pan-Pan)',
    description: 'ขี้เล่น ขี้อ้อน และชอบขนมสุดๆ ถ้ามีแอปเปิ้ลให้นะ จะเดินตามต้อยๆ เลย',
  },
  Sloth_A: {
    name: 'ต้วมเตี้ยม (Tuam-Tiam)',
    description: 'เดินช้า แต่ใจดีมากกก! ต้วมเตี้ยมชอบกอด ตื่นมาทีไรต้องหาคนกอดก่อนเสมอ',
  },
  Armadillo_A: {
    name: 'เชลลี่ (Shel-Ly)',
    description: 'ขนหนานุ่มน่ากอดที่สุด! ขนฟูตัวใหญ่ใจดี อยากให้ลูบขนทุกวันเลยนะ',
  },
  Armadillo_B: {
    name: 'หลุนหลุน (Lhun-Lhun)',
    description: 'ขนหนานุ่มน่ากอดที่สุด! ขนฟูตัวใหญ่ใจดี อยากให้ลูบขนทุกวันเลยนะ',
  },
} as const;

// Helper function to get pet info with translation support
const getPetInfo = (modelId: string, tFunction: any = null) => {
  if (!tFunction) {
    // Fallback to hardcoded data if no translation function
    return petsData[modelId as keyof typeof petsData] || null;
  }

  // Use translation function to get pet data
  const petName = tFunction(`pets.${modelId}.name`);
  const petDescription = tFunction(`pets.${modelId}.description`);

  return {
    name: petName,
    description: petDescription,
  };
};

// Factory function to create the pet mapper with optional translation
export const createPetMapper = (tFunction: any = null, allPets: PetResponse[] = []) => {
  // Create a map to quickly look up pets by model_id if needed for future logic
  const petsByModelId = new Map();
  allPets.forEach((pet) => {
    petsByModelId.set(pet.model_id, pet);
  });

  return (pet: PetResponse): PetOutput => {
    const modelId = pet.model_id; // Keep as string for accessing petsData
    const petData = getPetInfo(modelId, tFunction);

    console.log('pet res data: ', pet);
    console.log('modelId: ', modelId);
    console.log('petData: ', petData);

    return {
      id: pet.pet_id,
      name: petData?.name || 'Not own any item', // Use name from petsData or fallback
      pet_id: pet.pet_id, // Use pet.id, which is already a number
      description: petData?.description || '', // Use description or fallback
      model_name: modelId, // Use PetModelURLs or fallback
      model_src: '',
      src: PetSrcURLs[modelId] || '', // Use PetSrcURLs or fallback
      selected: pet.is_equipped,
      buy: true, // Convert string to boolean
      lock: pet.id !== 1 ? !pet.is_bought : false, // Ensure the first pet is unlocked
      price: pet.price, // Keep as number
      is_equipped: pet.is_equipped,
      animation_src: '',
    };
  };
};

// Keep the old function for backward compatibility
export const mapPetResponseToOutput = (pet: PetResponse): PetOutput => {
  const mapper = createPetMapper();
  return mapper(pet);
};
