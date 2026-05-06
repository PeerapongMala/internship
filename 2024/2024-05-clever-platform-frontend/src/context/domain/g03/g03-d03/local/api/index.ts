import redeemCoupon from './group/redeem/restapi';
import { RedeemRepository } from './repository';

// ======================= Environment Import ================================
let redeemAPI: RedeemRepository = { redeemCoupon: redeemCoupon };

// ===========================================================================
const API = {
  redeem: redeemAPI,
};

export default API;
