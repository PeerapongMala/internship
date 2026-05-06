import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosResponse } from 'axios';
import { TDocumentTemplate } from '../../../types/template';
import { TBasePaginationResponse, TBaseResponse } from '@global/types/api';

export const patchDocumentTemplateUpdate = async (
  template_id: string,
  body: Partial<TDocumentTemplate>,
) => {
  let response: AxiosResponse<TBaseResponse>;

  const formData = new FormData(); // multipart/form-data

  const {
    colour_setting,
    logo_image,
    background_image,
    delete_logo_image,
    delete_background_image,
    ...otherFields
  } = body;
  if (delete_logo_image) {
    formData.append('delete_logo_image', 'true');
  }

  if (delete_background_image) {
    formData.append('delete_background_image', 'true');
  }
  if (
    colour_setting &&
    typeof colour_setting === 'object' &&
    !Array.isArray(colour_setting) &&
    Object.keys(colour_setting).length > 0
  ) {
    formData.append('colour_setting', JSON.stringify(colour_setting));
  }
  // check file and do
  if (logo_image instanceof File) {
    formData.append('logo_image', logo_image);
  }
  if (background_image instanceof File) {
    formData.append('background_image', background_image);
  }

  Object.keys(otherFields).forEach((key) => {
    const propKey = key as keyof typeof otherFields;
    const value: any = otherFields[propKey];

    if (typeof value === 'object' && value !== null) {
      if (value instanceof File || value instanceof Blob) {
        formData.append(propKey, value);
      } else {
        formData.append(propKey, JSON.stringify(value));
      }
    } else if (value !== undefined && value !== null) {
      formData.append(propKey, String(value));
    }
  });

  try {
    response = await axiosWithAuth.patch(
      `/grade-settings/v1/document_template/${template_id}`,
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
