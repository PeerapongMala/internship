import { TGetLevelListByIndicatorIDRes } from '@domain/g06/local/api/helpers/academic';
import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosResponse } from 'axios';

export const getLevelListByIndicatorID = async (indicatorID: number) => {
  let response: AxiosResponse<TGetLevelListByIndicatorIDRes>;

  try {
    response = await axiosWithAuth.get(
      `/academic-level/v1/indicators/${indicatorID}/levels`,
    );
  } catch (error) {
    throw error;
  }

  return response;
};
