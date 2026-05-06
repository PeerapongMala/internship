import { AxiosError } from 'axios';
import { getList } from '../group/redeem/get-list/restapi';
import {
  TBaseResponse,
  TGetCouponIDReq,
  TGetCouponIDRes,
  TGetCouponReq,
  TGetCouponRes,
  TGetDownloadReq,
  TGetDownloadRes,
  TGetListRedeemReq,
  TGetListRedeemRes,
  TPostListRedeemReq,
  TPostListRedeemRes,
  TPostUploadReq,
  TPostUploadRes,
} from '../helper/redeem';
import { post } from '../group/redeem/post/restapi';
import { TGetListPetReq, TGetListPetRes } from '../helper/pet';
import { getPet } from '../group/redeem/get-pet/restapi';
import { getAvatar } from '../group/redeem/get-avatar/restapi';
import { TGetListAvatarReq, TGetListAvatarRes } from '../helper/avatar';
import { getDownload } from '../group/redeem/get-download/restapi';
import { postUpload } from '../group/redeem/post-upload/restapi';
import { getCoupon } from '../group/redeem/get-coupon/restapi';
import { getCouponID } from '../group/redeem/get-couponID/restapi';
import { Redeem } from '../../type';
import { bulkEditCoupon } from '../group/redeem/bulk-edit-coupon/restapi';

type TRedeemRepository = {
  GetList: (
    req: TGetListRedeemReq,
    onError?: (error: AxiosError) => void,
  ) => Promise<TGetListRedeemRes>;

  Post: (
    req: TPostListRedeemReq,
    onError?: (error: AxiosError) => void,
  ) => Promise<TPostListRedeemRes>;

  GetPet: (
    req: TGetListPetReq,
    onError?: (error: AxiosError) => void,
  ) => Promise<TGetListPetRes>;

  GetAvatar: (
    req: TGetListAvatarReq,
    onError?: (error: AxiosError) => void,
  ) => Promise<TGetListAvatarRes>;

  GetDownload: (
    req: TGetDownloadReq,
    onError?: (error: AxiosError) => void,
  ) => Promise<TGetDownloadRes>;

  PostUpload: (
    req: TPostUploadReq,
    onError?: (error: AxiosError) => void,
  ) => Promise<TPostUploadRes>;

  GetCoupon: (
    req: TGetCouponReq,
    onError?: (error: AxiosError) => void,
  ) => Promise<TGetCouponRes>;

  GetCouponID: (
    req: TGetCouponIDReq,
    onError?: (error: AxiosError) => void,
  ) => Promise<TGetCouponIDRes>;

  BulkEditCoupon: (
    redeems: Redeem[],
    status: Status,
  ) => Promise<Omit<TBaseResponse, '_pagination'>>;
};

const RedeemRepository: TRedeemRepository = {
  GetList: getList,
  Post: post,
  GetPet: getPet,
  GetAvatar: getAvatar,
  GetDownload: getDownload,
  PostUpload: postUpload,
  GetCoupon: getCoupon,
  GetCouponID: getCouponID,
  BulkEditCoupon: bulkEditCoupon,
};

export default RedeemRepository;
