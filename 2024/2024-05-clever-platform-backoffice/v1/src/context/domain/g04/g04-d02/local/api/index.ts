import ItemRestAPI from './group/item/restapi';
import { ItemRepository } from './repository/item';

// ======================= Environment Import ================================
let itemAPI: ItemRepository = ItemRestAPI;

const mockIs = !import.meta.env.PROD && import.meta.env.VITE_DEBUG_API_IS_MOCK === 'true';

if (mockIs) {
  // dynamic for test only dev without include build file
  // InfrastructureAPI = Mock;
  itemAPI = await import('./group/item/mock').then((module) => module.default);
}

// ======================= Export API ================================

// ===========================================================================
const API = {
  item: itemAPI,
};
export default API;
