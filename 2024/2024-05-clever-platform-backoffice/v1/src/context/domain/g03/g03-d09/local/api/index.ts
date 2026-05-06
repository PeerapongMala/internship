import ItemRestAPI from './group/item/restapi';
import { OtherRestAPI } from './group/other/restapi';
import StoreItemRestAPI from './group/store/restapi';
import SubjectRestAPI from './group/subject/restapi';
import StoreTransactionRestAPI from './group/transaction/restapi';
import { ItemRepository } from './repository/item';
import { OtherRepository } from './repository/other';
import { StoreItemRepository } from './repository/store';
import { SubjectRepository } from './repository/subject';
import { StoreTransactionRepository } from './repository/transaction';

// ======================= Environment Import ================================
let storeItemAPI: StoreItemRepository = StoreItemRestAPI;
let itemAPI: ItemRepository = ItemRestAPI;
let transactionAPI: StoreTransactionRepository = StoreTransactionRestAPI;
let subjectAPI: SubjectRepository = SubjectRestAPI;
let otherAPI: OtherRepository = OtherRestAPI;

const mockIs = !import.meta.env.PROD && import.meta.env.VITE_DEBUG_API_IS_MOCK === 'true';

// if (mockIs) {
//   // dynamic for test only dev without include build file
//   // InfrastructureAPI = Mock;
//   storeItemAPI = await import('./group/store/mock').then((module) => module.default);
// }

// ======================= Export API ================================

// ===========================================================================
const API = {
  store: storeItemAPI,
  item: itemAPI,
  transaction: transactionAPI,
  subject: subjectAPI,
  other: otherAPI,
};
export default API;
