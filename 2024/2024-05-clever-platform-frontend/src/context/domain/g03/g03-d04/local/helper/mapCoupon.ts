import { getAssetPath } from '@global/helper/assetsGateway';
import { CouponOutput, CouponResponse } from '../types';

const FrameSrcURLs: { [key: string]: string } = {
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

export const mapCouponResponseToOutput = (coupon: CouponResponse): CouponOutput => {
  console.log('Frame from mapData: ', coupon);
  return {
    id: coupon.item_id,
    item_id: coupon.item_id,

    image_url: coupon.image_url,
    name: coupon.name,
    description: coupon.description,
    amount: coupon.amount,

    is_bought: true,
    is_equipped: coupon.is_equipped,
    selected: false || coupon.is_equipped,
    src: '', // Keep the old key for src lookup
  };
};
