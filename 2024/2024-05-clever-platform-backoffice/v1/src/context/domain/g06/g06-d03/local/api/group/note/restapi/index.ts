import {} from '@domain/g01/g01-d02/local/type';
import { NoteRepository } from '../../../repository/note';
import {
  DataAPIResponse,
  DataAPIRequest,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';

import fetchWithAuth from '@global/utils/fetchWithAuth';
import { IGetNote } from '@domain/g06/g06-d03/local/type';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const NoteRestAPI: NoteRepository = {
  AddNote(data) {
    return fetchWithAuth(`${BACKEND_URL}/data-entry/v1/evaluation-sheet/note`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((res: DataAPIResponse<null>) => res);
  },
  GetNote(evaluationSheetId) {
    return fetchWithAuth(
      `${BACKEND_URL}/data-entry/v1/evaluation-sheet/note/${evaluationSheetId}`,
      {
        method: 'GET',
      },
    )
      .then((response) => response.json())
      .then((res: DataAPIResponse<IGetNote[]>) => res);
  },
};

export default NoteRestAPI;
