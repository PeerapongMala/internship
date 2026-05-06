import RestAPIHistory from './group/history/restapi';
import NoteAPIHistory from './group/note/restapi';
import SheetAPIHistory from './group/sheet/restapi';
import DropdownRestAPI from './group/dropdown/restapi';

import { HistoryRepository } from './repository/history';
import { NoteRepository } from './repository/note';
import { SheetRepository } from './repository/sheet';

// ======================= Environment Import ================================

let historyAPI: HistoryRepository = RestAPIHistory;
let noteAPI: NoteRepository = NoteAPIHistory;
let sheetAPI: SheetRepository = SheetAPIHistory;

const mockIs = !import.meta.env.PROD && import.meta.env.VITE_DEBUG_API_IS_MOCK === 'true';

if (mockIs) {
  // dynamic for test only dev without include build file
  // InfrastructureAPI = Mock;
  // historyAPI = await import('./group/history/mock').then(
  //   (module) => module.default,
  // );
  // noteAPI = await import('./group/note/mock').then(
  //   (module) => module.default,
  // );
  // sheetAPI = await import('./group/sheet/mock').then(
  //   (module) => module.default,
  // );
}

// ===========================================================================
const API = {
  history: historyAPI,
  note: noteAPI,
  sheet: sheetAPI,
  dropdown: DropdownRestAPI,
};

export default API;
