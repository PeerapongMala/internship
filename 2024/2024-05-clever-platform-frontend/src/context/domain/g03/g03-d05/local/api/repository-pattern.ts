import { DataAPIResponse } from '@core/helper/api-type';
import { ZipResponse } from '@global/helper/zipDownload';
import {
  Avatar,
  AvatarResponse,
  Badge,
  BadgeResponse,
  Coupon,
  CouponResponse,
  Frame,
  FrameResponse,
  ModelAvatar,
  Pet,
  PetResponse,
} from '../type';

export interface RepositoryPatternInterface {
  Avatar: {
    AvatarAll: {
      Get(): Promise<DataAPIResponse<AvatarResponse[]>>;
    };
    BuyAvatar: {
      Post(avatarId: number): Promise<DataAPIResponse<Avatar>>;
    };
  };
  Pet: {
    PetAll: {
      Get(): Promise<DataAPIResponse<PetResponse[]>>;
    };
    BuyPet: {
      Post(petId: number): Promise<DataAPIResponse<Pet>>;
    };
  };
  Frame: {
    FrameAll: {
      Get(subject_id: string): Promise<DataAPIResponse<FrameResponse[]>>;
    };
    BuyFrame: {
      Post(frameId: number): Promise<DataAPIResponse<Frame>>;
    };
  };
  Badge: {
    BadgeAll: {
      Get(subject_id: string): Promise<DataAPIResponse<BadgeResponse[]>>;
    };
    BuyBadge: {
      Post(badgeId: number): Promise<DataAPIResponse<Badge>>;
    };
  };
  Coupon: {
    CouponAll: {
      Get(subject_id: string): Promise<DataAPIResponse<CouponResponse[]>>;
    };
    BuyCoupon: {
      Post(couponId: number): Promise<DataAPIResponse<Coupon>>;
    };
  };

  AvatarModelAssets: {
    ModelAssets: {
      Get(): Promise<DataAPIResponse<ModelAvatar[]>>;
      GetZip(): Promise<ZipResponse<ModelAvatar[]>>;
    };
  };
}
