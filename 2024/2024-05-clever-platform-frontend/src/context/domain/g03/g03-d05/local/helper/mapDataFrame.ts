import { getAssetPath } from '@global/helper/assetsGateway';
import { FrameOutput, FrameResponse } from '../type';

export const FrameSrcURLs: { [key: string]: string } = {
  กรอบผู้พิทักษ์: getAssetPath('frame', 'frame_1', '.svg'),
  กรอบนีออนไซเบอร์: getAssetPath('frame', 'frame_2', '.svg'),
  กรอบจักรพรรดิทองคำ: getAssetPath('frame', 'frame_3', '.svg'),
  กรอบพลังชีวภาพ: getAssetPath('frame', 'frame_4', '.svg'),
  กรอบคลื่นเวทมนตร์: getAssetPath('frame', 'frame_5', '.svg'),
  กรอบแห่งความมืด: getAssetPath('frame', 'frame_6', '.svg'),
  กรอบทูตแห่งดวงดาว: getAssetPath('frame', 'frame_7', '.svg'),
};

const petsData = {
  'frame 1': {
    name: 'กรอบผู้พิทักษ์',
  },
  'frame 2': {
    name: 'กรอบนีออนไซเบอร์',
  },
  'frame 3': {
    name: 'กรอบจักรพรรดิทองคำ',
  },
  'frame 4': {
    name: 'กรอบพลังชีวภาพ',
  },
  'frame 5': {
    name: 'กรอบคลื่นเวทมนตร์',
  },
  'frame 6': {
    name: 'กรอบแห่งความมืด',
  },
  'frame 7': {
    name: 'กรอบทูตแห่งดวงดาว',
  },
} as const;

export const mapFrameResponseToOutput = (frame: FrameResponse): FrameOutput => {
  console.log('Frame response in map Data: ', frame);
  return {
    id: frame.id,
    stock: frame.stock,
    initial_stock: frame.initial_stock,
    price: frame.price,
    item_id: frame.item_id,
    name: frame.name,
    description: frame.description,
    image_url: frame.image_url,
    template_path: frame.template_path,
    badge_description: frame.badge_description,
    amount: frame.amount,
    is_bought: frame.is_bought,
    is_equipped: frame.is_equipped,
    selected: true || frame.is_equipped,
    src: FrameSrcURLs[frame.name] || getAssetPath('pet', 'frame_1', '.svg'), // Keep the old key for src lookup
    lock: false,
    buy: frame.is_bought,
  };
};
