import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosResponse } from 'axios';
import { Dayjs } from 'dayjs';

export const csvEvaluationFormDownload = async (
  schoolID: string,
  startDate: Dayjs,
  endDate: Dayjs,
  limit = -1,
) => {
  try {
    const response: AxiosResponse<string> = await axiosWithAuth.get(
      `/grade-system-form/v1/${schoolID}/evaluation-form/download/csv`,
      {
        params: {
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          limit: limit,
        },
        responseType: 'text',
      },
    );

    const blob = new Blob([response.data], { type: 'text/csv' });

    return blob;
  } catch (error) {
    console.error('Error fetching CSV:', error);
    throw error;
  }
};
