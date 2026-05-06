import ItemRestAPI from './group/item/restapi';
import { OtherRestAPI } from './group/other/restapi';
import RedeemRestAPI from './group/redeem/restapi';
import RestAPITranslation from './group/reward/restapi';
import StoreItemRestAPI from './group/store/restapi';
import SubjectRestAPI from './group/subject/restapi';
import StoreTransactionRestAPI from './group/transaction/restapi';
import { ItemRepository } from './repository/item';
import { OtherRepository } from './repository/other';
import { RedeemRepository } from './repository/redeem';
import { RewardRepository } from './repository/reward';
import { StoreItemRepository } from './repository/store';
import { SubjectRepository } from './repository/subject';
import { StoreTransactionRepository } from './repository/transaction';

// ======================= Environment Import ================================
let rewardAPI: RewardRepository = RestAPITranslation;
let storeItemAPI: StoreItemRepository = StoreItemRestAPI;
let itemAPI: ItemRepository = ItemRestAPI;
let transactionAPI: StoreTransactionRepository = StoreTransactionRestAPI;
let subjectAPI: SubjectRepository = SubjectRestAPI;
let otherAPI: OtherRepository = OtherRestAPI;
let redeemAPI: RedeemRepository = RedeemRestAPI;
// ===========================================================================
const API = {
  reward: rewardAPI,
  store: storeItemAPI,
  item: itemAPI,
  transaction: transactionAPI,
  subject: subjectAPI,
  other: otherAPI,
  redeem: redeemAPI,
};

export default API;
