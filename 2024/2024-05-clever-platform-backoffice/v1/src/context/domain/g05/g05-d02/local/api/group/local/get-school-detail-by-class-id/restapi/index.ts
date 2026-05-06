import { AxiosResponse } from 'axios';
import { TGetSchoolDetailByClassIDRes } from '../../../../helper/local';
import axiosWithAuth from '@global/utils/axiosWithAuth';

const getSchoolDetailByClassID = async (classId: string) => {
  let response: AxiosResponse<TGetSchoolDetailByClassIDRes>;
  try {
    response = await axiosWithAuth.get(`/line-parent/v1/school-details/${classId}`);
  } catch (error) {
    console.error('Error fetching school details:', error);
    throw error;
  }

  return response.data;
};

export default getSchoolDetailByClassID;
