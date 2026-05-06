import { getAssetPath } from '@global/helper/assetsGateway';

const DefaultImageCharacters = [
  // {
  //   id: 1,
  //   name: 'ImageCharacter1',
  //   description:
  //     'Lorem ipsum dolor sit amet consectetur. Amet ultricies neque. Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.',
  //   src: ImageCharacter1,
  //   price: 100,
  //   buy: true,
  //   lock: false,
  //   selected: true,
  // },
  {
    id: 1,
    name: 'ImageCharacter1',
    description:
      'Lorem ipsum dolor sit amet consectetur. Amet ultricies neque. Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.',
    src: getAssetPath('character', 'set-1-character-1-level-1', '.png'),
    price: 100,
    buy: true,
    lock: false,
    selected: true,
    model_src: 'set1_character1_level1',
  },
  {
    id: 2,
    name: 'ImageCharacter2',
    description:
      'Lorem ipsum dolor sit amet consectetur. Amet ultricies neque. Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.',
    src: getAssetPath('character', 'set-1-character-1-level-2', '.png'),
    price: 100,
    buy: true,
    lock: false,
    selected: false,
    model_src: 'set1_character1_level2',
  },
  {
    id: 3,
    name: 'ImageCharacter3',
    description:
      'Lorem ipsum dolor sit amet consectetur. Amet ultricies neque. Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.',
    src: getAssetPath('character', 'set-1-character-1-level-3', '.png'),
    price: 100,
    buy: false,
    lock: false,
    selected: false,
    model_src: 'set1_character1_level3',
  },
  {
    id: 4,
    name: 'ImageCharacter4',
    description:
      'Lorem ipsum dolor sit amet consectetur. Amet ultricies neque. Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.',
    src: getAssetPath('character', 'set-1-character-2-level-1', '.png'),
    price: 100,
    buy: false,
    lock: false,
    selected: false,
    model_src: 'set1_character2_level1',
  },
  {
    id: 5,
    name: 'ImageCharacter5',
    description:
      'Lorem ipsum dolor sit amet consectetur. Amet ultricies neque. Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.',
    src: getAssetPath('character', 'set-1-character-2-level-2', '.png'),
    price: 100,
    buy: false,
    lock: true,
    selected: false,
    model_src: 'set1_character2_level2',
  },
  {
    id: 6,
    name: 'ImageCharacter6',
    description:
      'Lorem ipsum dolor sit amet consectetur. Amet ultricies neque. Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.',
    src: getAssetPath('character', 'set-1-character-2-level-3', '.png'),
    price: 100,
    buy: false,
    lock: true,
    selected: false,
    model_src: 'set1_character2_level3',
  },
];

const DefaultImagePets = [
  {
    id: 1,
    name: 'ImagePet1',
    description:
      'Lorem ipsum dolor sit amet consectetur. Amet ultricies neque. Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.',
    src: getAssetPath('pet', 'pet-1', '.png'),
    price: 100,
    buy: true,
    lock: false,
    selected: true,
    model_src: '',
  },
  {
    id: 2,
    name: 'ImagePet2',
    description:
      'Lorem ipsum dolor sit amet consectetur. Amet ultricies neque. Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.',
    src: getAssetPath('pet', 'pet-2', '.png'),
    price: 100,
    buy: false,
    lock: true,
    selected: false,
    model_src: '',
  },
  {
    id: 3,
    name: 'ImagePet3',
    description:
      'Lorem ipsum dolor sit amet consectetur. Amet ultricies neque. Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.',
    src: getAssetPath('pet', 'pet-3', '.png'),
    price: 100,
    buy: false,
    lock: true,
    selected: false,
    model_src: '',
  },
  {
    id: 4,
    name: 'ImagePet4',
    description:
      'Lorem ipsum dolor sit amet consectetur. Amet ultricies neque. Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.',
    src: getAssetPath('pet', 'pet-4', '.png'),
    price: 100,
    buy: false,
    lock: true,
    selected: false,
    model_src: '',
  },
  {
    id: 5,
    name: 'ImagePet5',
    description:
      'Lorem ipsum dolor sit amet consectetur. Amet ultricies neque. Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.',
    src: getAssetPath('pet', 'pet-5', '.png'),
    price: 100,
    buy: false,
    lock: true,
    selected: false,
    model_src: '',
  },
  {
    id: 6,
    name: 'ImagePet6',
    description:
      'Lorem ipsum dolor sit amet consectetur. Amet ultricies neque. Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.',
    src: getAssetPath('pet', 'pet-6', '.png'),
    price: 100,
    buy: false,
    lock: true,
    selected: false,
    model_src: '',
  },
];

const DefaultImageFrames = [
  {
    id: 1,
    name: 'ImageFrame1',
    description:
      'Lorem ipsum dolor sit amet consectetur. Amet ultricies neque. Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.',
    src: getAssetPath('frame', 'frame_1', '.svg'),
    price: 100,
    buy: true,
    lock: false,
    selected: true,
    model_src: '',
  },
  {
    id: 2,
    name: 'ImageFrame2',
    description:
      'Lorem ipsum dolor sit amet consectetur. Amet ultricies neque. Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.',
    src: getAssetPath('frame', 'frame_2', '.svg'),
    price: 100,
    buy: false,
    lock: true,
    selected: false,
    model_src: '',
  },
  {
    id: 3,
    name: 'ImageFrame3',
    description:
      'Lorem ipsum dolor sit amet consectetur. Amet ultricies neque. Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.',
    src: getAssetPath('frame', 'frame_3', '.svg'),
    price: 100,
    buy: false,
    lock: true,
    selected: false,
    model_src: '',
  },
  {
    id: 4,
    name: 'ImageFrame4',
    description:
      'Lorem ipsum dolor sit amet consectetur. Amet ultricies neque. Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.',
    src: getAssetPath('frame', 'frame_4', '.svg'),
    price: 100,
    buy: false,
    lock: true,
    selected: false,
    model_src: '',
  },
  {
    id: 5,
    name: 'ImageFrame5',
    description:
      'Lorem ipsum dolor sit amet consectetur. Amet ultricies neque. Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.',
    src: getAssetPath('frame', 'frame_5', '.svg'),
    price: 100,
    buy: false,
    lock: true,
    selected: false,
    model_src: '',
  },
  {
    id: 6,
    name: 'ImageFrame6',
    description:
      'Lorem ipsum dolor sit amet consectetur. Amet ultricies neque. Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.',
    src: getAssetPath('frame', 'frame_6', '.svg'),
    price: 100,
    buy: false,
    lock: true,
    selected: false,
    model_src: '',
  },
  {
    id: 7,
    name: 'ImageFrame7',
    description:
      'Lorem ipsum dolor sit amet consectetur. Amet ultricies neque. Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.Lorem ipsum dolor sit amet consectetur. Amet ultricies neque.',
    src: getAssetPath('frame', 'frame_7', '.svg'),
    price: 100,
    buy: false,
    lock: true,
    selected: false,
    model_src: '',
  },
];

export { DefaultImageCharacters, DefaultImageFrames, DefaultImagePets };
