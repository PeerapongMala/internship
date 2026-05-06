import { RepositoryPatternInterface } from '../repository-pattern';
import { BuyAvatar, GetAllAvatar } from './avatar';
import { GetAvatarModelAssets, GetAvatarModelAssetsZip } from './model-game-assets';
import { BuyPet, GetAllPet } from './pet';
import {
  BuyBadge,
  BuyCoupon,
  BuyFrame,
  GetAllBadge,
  GetAllCoupon,
  GetAllFrame,
} from './shop-item';

const Avatar: RepositoryPatternInterface['Avatar'] = {
  AvatarAll: { Get: GetAllAvatar },
  BuyAvatar: { Post: BuyAvatar },
};

const Pet: RepositoryPatternInterface['Pet'] = {
  PetAll: { Get: GetAllPet },
  BuyPet: { Post: BuyPet },
};

const Frame: RepositoryPatternInterface['Frame'] = {
  FrameAll: { Get: GetAllFrame },
  BuyFrame: { Post: BuyFrame },
};

const Badge: RepositoryPatternInterface['Badge'] = {
  BadgeAll: { Get: GetAllBadge },
  BuyBadge: { Post: BuyBadge },
};

const Coupon: RepositoryPatternInterface['Coupon'] = {
  CouponAll: { Get: GetAllCoupon },
  BuyCoupon: { Post: BuyCoupon },
};

const AvatarModelAssets: RepositoryPatternInterface['AvatarModelAssets'] = {
  ModelAssets: {
    Get: GetAvatarModelAssets,
    GetZip: GetAvatarModelAssetsZip,
  },
};

export { Avatar, AvatarModelAssets, Badge, Coupon, Frame, Pet };
