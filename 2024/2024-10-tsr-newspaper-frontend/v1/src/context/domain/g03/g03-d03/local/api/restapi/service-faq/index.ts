import StoreGlobalPersist from '@store/global/persist';
import { redirect } from '@tanstack/react-router';

interface ApiResponse<T> {
  data?: T;
  message: string;
}

interface ReqFaqForm {
  question: string;
  answer: string;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  created_at: string;
  created_by: number;
  updated_at: string;
  updated_by: number;
}

interface CreateFaqSuccessResponse {
  message: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginationResponse {
  limit: number;
  page: number;
  total: number;
}

export interface FaqListResponse {
  data: Faq[];
  pagination: PaginationResponse;
}

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';

export const getFaqs = async (
  params: PaginationParams = {},
): Promise<FaqListResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
    const response = await fetch(
      `${BACKEND_URL}/faqs/v1/faqs?${queryParams.toString()}`,
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
      throw new Error(result.message || 'Failed to fetch FAQs');
    }

    return result;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch FAQs');
  }
};

export const createFaq = async (data: ReqFaqForm): Promise<CreateFaqSuccessResponse> => {
  try {
    const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
    const response = await fetch(`${BACKEND_URL}/faqs/v1/faqs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
        if(response.status  === 401) {
          redirect({to: '/sign-in'})
        }

    const result: ApiResponse<CreateFaqSuccessResponse> = await response.json();

    if (!response.ok) {
      console.error('Create FAQ failed', result.message);
      throw new Error(result.message || 'Failed to create FAQ');
    }

    return result.data!;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error. กรุณาลองใหม่อีกครั้ง.');
  }
};

export const updateFaq = async (id: number, data: ReqFaqForm): Promise<Faq> => {
  try {
    const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
    const response = await fetch(`${BACKEND_URL}/faqs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    

    if (!response.ok) {
      throw new Error(result.message || `Failed to update FAQ #${id}`);
    }
    if(response.status  === 401) {
      redirect({to: '/sign-in'})
    }

    return result;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : `Failed to update FAQ #${id}`,
    );
  }
};

export const deleteFaq = async (id: number): Promise<void> => {
  try {
    const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
    const response = await fetch(`${BACKEND_URL}/faqs/v1/faqs/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if(response.status  === 401) {
      redirect({to: '/sign-in'})
    }
    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || `Failed to delete FAQ #${id}`);
    }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : `Failed to delete FAQ #${id}`,
    );
  }
};
