import { HistoryRepository } from '../../../repository/history';
import { DataAPIResponse, PaginationAPIResponse } from '@global/utils/apiResponseHelper';

import fetchWithAuth from '@global/utils/fetchWithAuth';
import {
  IGetHistoryCompare,
  IGetHistoryList,
  THistorySubject,
} from '@domain/g06/g06-d03/local/type';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const HistoryRestAPI: HistoryRepository = {
  GetHistoryCompare(evaluationSheetId, versionIdLeft, versionIdRight) {
    return fetchWithAuth(
      `${BACKEND_URL}/data-entry/v1/evaluation-sheet/edit-history/compare/${evaluationSheetId}?versionLeft=${versionIdLeft}&versionRight=${versionIdRight}`,
      {
        method: 'GET',
      },
    )
      .then((response) => response.json())
      .then((res: DataAPIResponse<IGetHistoryCompare>) => res);
  },
  GetHistoryList(evaluationSheetId, options) {
    let url = `${BACKEND_URL}/data-entry/v1/evaluation-sheet/edit-history/${evaluationSheetId}`;
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(options ?? {})) {
      if (!value) continue;
      params.append(key, String(value));
    }
    if (params.size > 0) url += `?${params.toString()}`;

    return fetchWithAuth(url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((res: PaginationAPIResponse<IGetHistoryList>) => res);
  },
  GetHistorySubject(evaluationSheetId) {
    let url = `${BACKEND_URL}/data-entry/v1/evaluation-sheet/${evaluationSheetId}/subject`;

    return fetchWithAuth(url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((res: PaginationAPIResponse<THistorySubject>) => res);
  },
  PostRetrieveVersion(sheetId, versionId) {
    let url = `${BACKEND_URL}/data-entry/v1/evaluation-sheet/${sheetId}/retrieve-version`;

    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ data_entry_id: versionId }),
    })
      .then((response) => response.json())
      .then((res: DataAPIResponse<null>) => res);
  },
};

export default HistoryRestAPI;
