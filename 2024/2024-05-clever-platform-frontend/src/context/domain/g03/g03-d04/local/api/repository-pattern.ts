import { DataAPIResponse } from '@core/helper/api-type';
import {
  Avatar,
  AvatarResponse,
  BadgeResponse,
  Coupon,
  CouponResponse,
  Frame,
  FrameResponse,
  Pet,
  RewardItem,
} from '../types';

export interface RepositoryPatternInterface {
  Character: {
    CharacterAll: {
      Get(): Promise<DataAPIResponse<AvatarResponse[]>>;
    };
    UpdateCharacter: {
      Patch(
        avatarId: number | undefined,
        isEquipped: boolean,
      ): Promise<DataAPIResponse<Avatar>>;
    };
  };
  ItemBadge: {
    ItemBadgeAll: {
      Get(): Promise<DataAPIResponse<BadgeResponse[]>>;
    };
    UpdateItemBadge: {
      Patch(
        itemId: number | undefined,
        isEquipped: boolean,
      ): Promise<DataAPIResponse<BadgeResponse>>;
    };
  };
  Pet: {
    petAll: {
      Get(): Promise<DataAPIResponse<Pet[]>>;
    };
    UpdatePet: {
      Patch(
        petId: number | undefined,
        isEquipped: boolean,
      ): Promise<DataAPIResponse<Pet>>;
    };
  };
  Frame: {
    frameAll: {
      Get(): Promise<DataAPIResponse<FrameResponse[]>>;
    };
    UpdateFrame: {
      Patch(
        itemId: number | undefined,
        isEquipped: boolean,
      ): Promise<DataAPIResponse<Frame>>;
    };
  };
  Coupon: {
    couponAll: {
      Get(): Promise<DataAPIResponse<CouponResponse[]>>;
    };
    UpdateCoupon: {
      Patch(
        itemId: number | undefined,
        isEquipped: boolean,
      ): Promise<DataAPIResponse<Coupon>>;
    };
    UseCoupon: {
      Post(itemId: number | undefined): Promise<DataAPIResponse<Coupon>>;
    };
  };
  Log: {
    logsAll: {
      Get(): Promise<DataAPIResponse<RewardItem[]>>;
    };
  };
}
