import { DataAPIResponse, PaginationAPIResponse } from '@core/helper/api-type';
import { SubLessonCheck } from '@domain/g04/g04-d01/local/type';
import { LevelDetails } from '@domain/g04/g04-d03/local/type';
import { fetchWithAuth } from '@global/helper/fetch';
import {
  downloadAndExtractZip,
  SubLessonUrlListResponseV1,
  SubLessonUrlListResponseV2,
  ZipResponse,
} from '@global/helper/zipDownload';
import StoreGlobal from '@store/global';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

export const LevelQuizGet = (
  sublessonId: string,
  pagination?: { page?: number; limit?: number },
): Promise<PaginationAPIResponse<LevelDetails>> => {
  const url = `${backendURL}/academic-level/v1/${sublessonId}/levels?page=${pagination?.page ?? 1}&limit=${pagination?.limit ?? -1}&status=enabled`;
  return fetchWithAuth(url, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((res: PaginationAPIResponse<LevelDetails>) => {
      return res;
    });
};
export const LevelGetZip = (sublessonId: string): Promise<ZipResponse<LevelDetails>> => {
  return downloadAndExtractZip(
    `${backendURL}/academic-level/v1/${sublessonId}/levels/zip`,
  );
};

export const LevelSubLessonUrlGet = (
  lessonID: string,
): Promise<DataAPIResponse<SubLessonUrlListResponseV1>> => {
  return fetchWithAuth(`${backendURL}/academic-level/v1/${lessonID}/sub-lesson-urls`)
    .then((res) => res.json())
    .then((res: DataAPIResponse<SubLessonUrlListResponseV1>) => res);
};

// Legacy format - map based
export const LevelSubLessonCaseCheck = (
  lessonID: string,
  query: SubLessonCheck[],
): Promise<DataAPIResponse<Record<string, string>>> => {
  const body = JSON.stringify({ sub_lesson_time_list: query });

  return fetchWithAuth(`${backendURL}/academic-level/v1/${lessonID}/sub-lesson-urls`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: body,
  })
    .then((res) => res.json())
    .then((res: DataAPIResponse<Record<string, string>>) => res);
};

// V2 endpoint - array based with metadata
export const LevelSubLessonCaseCheckV2 = (
  lessonID: string,
  query: SubLessonCheck[],
): Promise<DataAPIResponse<SubLessonUrlListResponseV2>> => {
  const body = JSON.stringify({ sub_lesson_time_list: query });

  return fetchWithAuth(`${backendURL}/academic-level/v1/${lessonID}/sub-lesson-urls/v2`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: body,
  })
    .then((res) => res.json())
    .then((res: DataAPIResponse<SubLessonUrlListResponseV2>) => res);
};

export default LevelQuizGet;
