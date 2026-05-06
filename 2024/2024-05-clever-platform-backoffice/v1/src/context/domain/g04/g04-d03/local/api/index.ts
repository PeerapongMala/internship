import ItemRestAPI from './group/item/restapi';
import StoreItemRestAPI from './group/store/restapi';
import StoreTransactionRestAPI from './group/transaction/restapi';
import { ItemRepository } from './repository/item';
import { StoreItemRepository } from './repository/store';
import { StoreTransactionRepository } from './repository/transaction';

// ======================= Environment Import ================================
let storeItemAPI: StoreItemRepository = StoreItemRestAPI;
let itemAPI: ItemRepository = ItemRestAPI;
let transactionAPI: StoreTransactionRepository = StoreTransactionRestAPI;

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
};
export default API;
