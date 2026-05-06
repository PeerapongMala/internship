import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosResponse } from 'axios';
import { TDocumentTemplate } from '../../../types/template';
import { TBasePaginationResponse, TBaseResponse } from '@global/types/api';

export const postDocumentTemplate = async (body: Partial<TDocumentTemplate>) => {
  let response: AxiosResponse<TBaseResponse>;

  const formData = new FormData();

  Object.keys(body).forEach((key) => {
    const propKey = key as keyof typeof body;
    const value = body[propKey];

    if (value instanceof File || value instanceof Blob) {
      formData.append(propKey, value);
    } else if (typeof value === 'object' && value !== null) {
      formData.append(propKey, JSON.stringify(value));
    } else if (value !== undefined && value !== null) {
      // string, number, boolean
      formData.append(propKey, String(value));
    }
  });

  try {
    response = await axiosWithAuth.post(
      `/grade-settings/v1/document_template`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  } catch (error) {
    throw error;
  }

  return response;
};
