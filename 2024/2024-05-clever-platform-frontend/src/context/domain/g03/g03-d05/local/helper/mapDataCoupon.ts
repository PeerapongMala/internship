import { getAssetPath } from '@global/helper/assetsGateway';
import { CouponOutput, CouponResponse } from '../type';

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
  console.log('Coupon response in shop: ', coupon);
  return {
    id: coupon.id,
    stock: coupon.stock,
    initial_stock: coupon.initial_stock,
    price: coupon.price,
    item_id: coupon.item_id,
    name: coupon.name,
    description: coupon.description,
    image_url: coupon.image_url,
    template_path: coupon.template_path,
    badge_description: coupon.badge_description,
    amount: coupon.amount,
    is_bought: coupon.is_bought,
    is_equipped: coupon.is_equipped,
    selected: true || coupon.is_equipped,
    src: FrameSrcURLs[coupon.name] || getAssetPath('pet', 'frame_1', '.svg'), // Keep the old key for src lookup
    lock: false,
    buy: coupon.is_bought,
  };
};
