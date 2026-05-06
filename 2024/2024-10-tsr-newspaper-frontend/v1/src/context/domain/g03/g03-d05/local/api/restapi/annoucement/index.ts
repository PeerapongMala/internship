import StoreGlobalPersist from '@store/global/persist';
import { redirect } from '@tanstack/react-router';

export enum EStatusAnnouncement {
  Draft = 'draft',
  WaitingApproval = 'waiting_approval',
  Cancelled = 'cancelled',
  Approved = 'approved',
  Rejected = 'rejected',
}

export interface Announcement {
  id: number;
  no: string;
  public_date: string;
  title: string;
  image_url_list: string[];
  status: EStatusAnnouncement;
  newspaper_id: number | null;
  newspaper_display_order: number | null;
  payment_id: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  user_email: string;
  net_amount: number;
}

export interface AnnouncementResponse {
  data: Announcement[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

interface ApiResponse {
  data: AnnouncementResponse;
  message: string;
}

export interface StatusUpdate {
  id: number;
  status: EStatusAnnouncement;
}

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';

export const getAnnouncementList = async (publicDate?: string): Promise<ApiResponse> => {
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
  let url = `${BACKEND_URL}/newspaper/announcement/list`;

  if (publicDate) {
    url += `?public_date=${publicDate}`;
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    if(response.status  === 401) {
      redirect({to: '/sign-in'})
    }
    if (!response.ok) {
      throw new Error('Failed to fetch announcements');
    }

    const responseData: ApiResponse = await response.json();
    return responseData;
  } catch (error) {
    console.error('Failed to fetch announcements:', error);
    throw error;
  }
};

export const updateAnnouncementStatus = async (
  updates: StatusUpdate[],
): Promise<ApiResponse> => {
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
  const url = `${BACKEND_URL}/newspaper/announcement/admin/update_status`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ list: updates }),
    });

    if (!response.ok) {
      throw new Error('Failed to update announcements');
    }

    const responseData: ApiResponse = await response.json();
    return responseData;
  } catch (error) {
    console.error('Failed to update announcements:', error);
    throw error;
  }
};
