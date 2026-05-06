import StoreGlobalPersist from '@store/global/persist';
import { redirect } from '@tanstack/react-router';

interface ApiResponse {
  display_order: number;
  image_url: string;
  message: string;
}

export interface CoverImage {
  id: number;
  display_order: number;
  cover_image_url: string;
  created_at: string;
  created_by: number;
  updated_at: string;
  updated_by: number;
}

interface DeleteResponse {
  message: string;
}

interface UpdateOrderResponse {
  display_order: number;
  message: string;
}

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';

export const fetchCoverImages = async (): Promise<CoverImage[]> => {
  try {
    const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
    const response = await fetch(`${BACKEND_URL}/cover/v1/images`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cover images');
    }
    if(response.status  === 401) {
      redirect({to: '/sign-in'})
    }

    const result = await response.json();
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Something went wrong. Please try again.');
  }
};

export const uploadImageCover = async (
  file: File,
  display_order: number,
): Promise<ApiResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('display_order', display_order.toString());

    const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

    const response = await fetch(`${BACKEND_URL}/cover/v1/images`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Upload failed');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Something went wrong. Please try again.');
  }
};

export const sortOrderCoverImage = async (
  id: number,
  display_order: number,
): Promise<UpdateOrderResponse> => {
  try {
    const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
    const response = await fetch(`${BACKEND_URL}/cover/v1/images/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },

      body: JSON.stringify({ display_order }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Update failed');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Something went wrong. Please try again.');
  }
};

export const deleteCoverImage = async (id: number): Promise<DeleteResponse> => {
  try {
    const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
    const response = await fetch(`${BACKEND_URL}/cover/v1/images/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Delete failed');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Something went wrong. Please try again.');
  }
};
