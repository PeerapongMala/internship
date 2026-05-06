import ItemRestAPI from './group/item/restapi';
import { OtherRestAPI } from './group/other/restapi';
import { ItemRepository } from './repository/item';
import { OtherRepository } from './repository/other';

// ======================= Environment Import ================================
let itemAPI: ItemRepository = ItemRestAPI;
let otherAPI: OtherRepository = OtherRestAPI;

const mockIs = !import.meta.env.PROD && import.meta.env.VITE_DEBUG_API_IS_MOCK === 'true';

if (mockIs) {
  // dynamic for test only dev without include build file
  // InfrastructureAPI = Mock;
}

// ======================= Export API ================================

// ===========================================================================
const API = {
  item: itemAPI,
  other: otherAPI,
};
export default API;
