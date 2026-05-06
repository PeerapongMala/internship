import { CharacterOutput, CharacterResponse } from '../types';

const CONFIG = Object.freeze({
  basePath: '/public',
  defaultSetFolder: 'set1',
  setFolders: ['set2', 'set4'] as const,
});

const getSetFolder = (modelId: string): string => {
  return CONFIG.defaultSetFolder;
};

const get3DModelKey = (modelId: string, level: number): string => {
  const setFolder = getSetFolder(modelId);
  const characterName = `character${modelId}`;
  const characterLevel = `level${level}`;

  const modelKey = [setFolder, characterName, characterLevel].join('_');
  console.log('Character model: ', modelKey);
  return modelKey;
};

const getCharactorInfoPath = (modelId: string): string => {
  const characterName = `character${modelId}`;
  const jsonPath = [
    `${CONFIG.basePath}/character`,
    getSetFolder(modelId),
    characterName,
    'info.json',
  ].join('/');
  console.log('Character path from custom avatar: ', jsonPath);
  return jsonPath;
};

const mapSingleCharacter = async (item: CharacterResponse): Promise<CharacterOutput> => {
  const modelPath = get3DModelKey(item.model_id, item.level);
  const jsonPath = getCharactorInfoPath(item.model_id);

  const characterData = await import(jsonPath);

  return {
    id: parseInt(item.model_id),
    name: characterData.name,
    avatar_id: item.avatar_id,
    description: characterData.description,
    model_src: modelPath,
    src: characterData.src,
    selected: item.is_equipped,
    buy: true,
  };
};

export const mapCharacterData = async (
  responseData: CharacterResponse[],
): Promise<CharacterOutput[]> => {
  return Promise.all(responseData.map(mapSingleCharacter));
};

// const mapSingleItemBadge = async (item: BadgeResponse): Promise<BadgeOutput> => {
//   const templatePath = `${CONFIG.basePath}/badge/badge-${item.item_id}${FLIE_EXTENSION.PNG}`;
//   const itemName = `ImageBadge${item.item_id}`;

//   return {
//     name: itemName,
//     id: item.item_id,
//     inventory_id: item.inventory_id,
//     amount: item.amount,
//     image_url: item.image_url,
//     src: templatePath,
//     badge_description: item.badge_description,
//     selected: item.is_equipped,
//     status: item.status,
//     buy: true,
//   };
// };

// export const mapBadgeData = async (
//   responseData: BadgeResponse[],
// ): Promise<BadgeOutput[]> => {
//   const noSelectedBadge = {
//     name: 'NoSelected',
//     selected: false,
//     src: '/public/badge/icon-no-selected.png',
//     buy: true,
//   };
//   const mappedBadges = await Promise.all(responseData.map(mapSingleItemBadge));
//   mappedBadges.unshift(noSelectedBadge);
//   return mappedBadges;
// };

// Helper function to generate the pet image source
const getPetImageSrc = (modelId: string): string =>
  `/src/context/domain/g03/g03-d04/g03-d04-p01-avatar-custom/assets/pet-${modelId}.png`;

// Update the mapping function to accept a Pet instead of PetResponse.
// (Assume that the Pet type has at least pet_id, inventory_id, model_id, and is_equipped properties.)
// const mapSinglePet = async (item: Pet): Promise<PetOutput> => {
//   // Generate a default pet name based on pet_id.
//   const petName = `Pet ${item.pet_id}`;

//   return {
//     id: item.pet_id,
//     name: petName,
//     inventory_id: item.inventory_id,
//     model_id: item.model_id,
//     selected: item.is_equipped,
//     buy: true, // Default value for buy
//     src: getPetImageSrc(item.model_id),
//     description: '', // Default empty description
//     price: 100, // You can adjust the default price as needed
//     lock: false, // Default lock value
//   };
// };

// export const mapPetData = async (responseData: Pet[]): Promise<PetOutput[]> => {
//   const noSelectedBadge: PetOutput = {
//     id: 0, // Default id for "NoSelected"
//     name: 'NoSelected',
//     inventory_id: 0, // You might set this to 0 or leave it to your application logic
//     model_id: '', // Default model id (or you can use a placeholder value)
//     selected: false,
//     buy: true,
//     src: '/public/badge/icon-no-selected.png',
//     description: '', // Default empty description
//     price: 0, // Default price
//     lock: false,
//   };

//   const mappedPet = await Promise.all(responseData.map(mapSinglePet));
//   mappedPet.unshift(noSelectedBadge);
//   return mappedPet;
// };
