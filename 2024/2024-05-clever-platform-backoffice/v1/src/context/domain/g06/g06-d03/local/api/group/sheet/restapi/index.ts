import { SheetRepository } from '../../../repository/sheet';
import { DataAPIResponse, PaginationAPIResponse } from '@global/utils/apiResponseHelper';

import fetchWithAuth from '@global/utils/fetchWithAuth';
import {
  IGetSheetDetail,
  IGetSheetList,
  IGetTitleSheet,
  IGetSheetCompare,
  TSheetAdditionalData,
} from '@domain/g06/g06-d03/local/type';
import { TBaseResponse } from '@global/types/api';
import { TEvaluationFormSettingGetScoreRes } from '../../../helpers/sheet';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const SheetResAPI: SheetRepository = {
  GetSheet(evaluationSheetId, options) {
    let url = `${BACKEND_URL}/data-entry/v1/evaluation-sheet/${evaluationSheetId}`;

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
      .then((res: DataAPIResponse<IGetSheetDetail>) => {
        if (res.status_code == 200 && res.data?.sheet_data?.general_additional_data) {
          const raw = res.data?.sheet_data?.general_additional_data as unknown;
          if (typeof raw !== 'string') {
            return res;
          }

          try {
            const result: TSheetAdditionalData = JSON.parse(raw);
            res.data.sheet_data.general_additional_data = result;
          } catch (error) {
            return res;
          }
        }

        return res;
      });
  },
  GetStudentLessonScore(evaluationSheetId, indicatorId) {
    return fetchWithAuth(
      `${BACKEND_URL}/data-entry/v1/evaluation-sheet/${evaluationSheetId}?indicator_id=${indicatorId}`,
      {
        method: 'GET',
      },
    )
      .then((response) => response.json())
      .then((res: DataAPIResponse<Pick<IGetSheetDetail, 'json_student_score_data'>>) => {
        return res;
      });
  },
  GetSheetList(
    schoolId,
    typeTab,
    status,
    academic_year,
    seed_year,
    class_id,
    subject_id,
    page,
    limit,
  ) {
    let query = '';
    if (typeTab === 'คะแนนรายวิชา') {
      query = '&only_subject=true';
    } else {
      query = `&general_type=${typeTab}`;
    }

    if (academic_year !== 0) {
      query += `&academic_year=${academic_year}`;
    }

    if (seed_year !== '') {
      query += `&year=${seed_year}`;
    }

    if (class_id !== '') {
      query += `&school_room=${class_id}`;
    }

    if (subject_id !== '') {
      query += `&subject_name=${subject_id}`;
    }
    if (page !== 0) {
      query += `&page=${page}`;
    }
    if (limit !== 0) {
      query += `&limit=${limit}`;
    }

    return fetchWithAuth(
      `${BACKEND_URL}/data-entry/v1/evaluation-sheet?school_id=${schoolId}&sort_by=id&sort_order=DESC${status ? `&status=${status}` : ''}${query}`,
      {
        method: 'GET',
      },
    )
      .then((response) => response.json())
      .then((res: PaginationAPIResponse<IGetSheetList>) => res);
  },
  RetrieveVersion(sheetId, dataEntryId) {
    return fetchWithAuth(
      `${BACKEND_URL}/data-entry/v1/evaluation-sheet/${sheetId}/retrieve-version`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data_entry_id: dataEntryId,
        }),
      },
    )
      .then((response) => response.json())
      .then((res: DataAPIResponse<null>) => res);
  },
  UpdateSheet(data) {
    return fetchWithAuth(`${BACKEND_URL}/data-entry/v1/evaluation-sheet/${data.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((res: DataAPIResponse<IGetSheetDetail>) => res);
  },
  GetTitleSheet(formId) {
    return fetchWithAuth(`${BACKEND_URL}/grade-system-form/v1/subject/${formId}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((res: PaginationAPIResponse<IGetTitleSheet>) => res);
  },
  GetHistoryCompare(sheetId, versionLeft, versionRight) {
    return fetchWithAuth(
      `${BACKEND_URL}/data-entry/v1/evaluation-sheet/edit-history/compare/${sheetId}?versionLeft=${versionLeft}&versionRight=${versionRight}`,
      {
        method: 'GET',
      },
    )
      .then((response) => response.json())
      .then((res: TBaseResponse<IGetSheetCompare>) => res);
  },
  PostEvaluationFormSettingGetScore(body) {
    let url = `${BACKEND_URL}/data-entry/v1/evaluation-form-setting/score`;

    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((res: TBaseResponse<TEvaluationFormSettingGetScoreRes[]>) => res);
  },
};

export default SheetResAPI;
