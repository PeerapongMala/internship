import StoreGlobalPersist from '@store/global/persist';
import { redirect } from '@tanstack/react-router';

export interface CoverNewspaper {
  ID: number;
  PublicDate: string;
  Template: string;
  Param: string;
  FileURL: string;
  PreviewURL: string;
  CreatedAt: string;
  CreatedBy: number;
  UpdatedAt: string;
  UpdatedBy: number;
  NewspaperID: number;
}

export interface CoverNewspaperListResponse {
  data: CoverNewspaper[];
  message: string;
}

export interface CoverNewspaperListParams {
  start_date: string;
  end_date: string;
}

export interface CreateCoverForm {
  public_date: string;
  template: string;
  param: string;
  files?: File;
  preview_files?: File;
  files_url?: string;
  preview_files_url?: string;
}

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';

export const getCoverNewspaperList = async (
  params: CoverNewspaperListParams,
): Promise<CoverNewspaperListResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);

    const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

    const response = await fetch(
      `${BACKEND_URL}/newspaper/cover_newspaper/list?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch cover list');
    }
    if(response.status === 401) {
      redirect({to: '/sign-in'})
    }
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Network error. กรุณาลองใหม่อีกครั้ง.');
  }
};

export const createCover = async (data: CreateCoverForm) => {
  try {
    const formData = new FormData();

    formData.append('public_date', data.public_date);
    formData.append('template', data.template);
    formData.append('param', data.param);
    if (data.files) {
      formData.append('files', data.files);
    }
    if (data.preview_files) {
      formData.append('preview_files', data.preview_files);
    }

    const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

    const response = await fetch(`${BACKEND_URL}/newspaper/cover_newspaper`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to create cover');
    }
    if(response.status  === 401) {
      redirect({to: '/sign-in'})
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Network error. กรุณาลองใหม่อีกครั้ง.');
  }
};
