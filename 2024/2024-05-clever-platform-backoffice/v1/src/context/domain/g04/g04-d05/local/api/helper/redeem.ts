import dayjs from 'dayjs';
import { CouponStatus, Redeem, History, CouponID } from '../../type';

export type TBaseResponse = {
  status_code: number;
  _pagination: TPagination & { total_count: number };
  message: string;
  error_message?: string;
};

export type TPagination = {
  page?: number;
  limit?: number;
};

export type TGetListRedeemReq = {
  Query: TPagination & {
    search?: string;
    status?: string;
    started_at_start?: dayjs.ConfigType;
    started_at_end?: dayjs.ConfigType;
    ended_at_start?: dayjs.ConfigType;
    ended_at_end?: dayjs.ConfigType;
  };
};

export type TGetListRedeemRes = TBaseResponse & {
  data: Redeem[];
};

export type TCreateCouponBody = {
  code: string;
  started_at: string;
  ended_at: string;
  status: CouponStatus;
  stock: number;
  initial_stock: number;
  gold_coin_amount: number;
  arcade_coin_amount: number;
  ice_amount: number;
  avatar_id?: number;
  pet_id?: number;
};

export type TPostListRedeemReq = {
  Body: TCreateCouponBody;
};

export type TPostListRedeemRes = Omit<TBaseResponse, '_pagination'>;

export type TGetDownloadReq = {
  start_date: string;
  end_date: string;
};

export type TGetDownloadRes = Blob;

export type TPostUploadReq = {
  Body: {
    csv_file: File;
  };
};

export type TPostUploadRes = Omit<TBaseResponse, '_pagination'>;

export type TGetCouponReq = {
  Param: {
    couponId: string;
  };
  Query: TPagination & {
    search?: string;
    used_at_start?: Date;
    used_at_end?: Date;
  };
};

export type TGetCouponRes = Omit<TBaseResponse, 'error_message'> & {
  data: History[];
};

export type TGetCouponIDReq = Omit<TBaseResponse, '_pagination' | 'error_message'> & {
  Param: {
    couponId: string;
  };
};

export type TGetCouponIDRes = Omit<TBaseResponse, '_pagination' | 'error_message'> & {
  data: CouponID;
};
