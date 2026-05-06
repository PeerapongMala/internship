import { pagination as paginationHelper } from '@core/helper/api-mock';
import { PaginationAPIResponse } from '@core/helper/api-type';
import { LevelDetails } from '@domain/g04/g04-d03/local/type';
import { downloadAndExtractZip, ZipResponse } from '@global/helper/zipDownload';
import StoreGlobal from '@store/global';
const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;
export const LevelQuizGet = (
  sublessonId: string,
  pagination?: { page?: number; limit?: number },
): Promise<PaginationAPIResponse<LevelDetails>> => {
  return Promise.resolve(
    paginationHelper<LevelDetails>({
      data: [],
      page: pagination?.page ?? 1,
      limit: pagination?.limit ?? 25,
    }),
  );
};
export const LevelGetZip = async (
  sublessonId: string,
): Promise<ZipResponse<LevelDetails>> => {
  try {
    const response = await downloadAndExtractZip<LevelDetails[]>(
      `${backendURL}/academic-level/v1/${sublessonId}/levels/zip`,
    );

    if (!response.success) {
      throw new Error(response.error || 'Failed to download ZIP');
    }
    return {
      ...response,
      data: response.data?.[0],
    };
  } catch (error) {
    console.error('LevelGetZip error:', error);
    throw error;
  }
};
