import StoreGlobalPersist from '@global/store/global/persist';
import { Announcement } from '@domain/g02/g02-d01/g02-d01-p04-annoucement-history/component/post-history';

interface paramProp {
  page?: number;
  limit?: number;
  created_at_start_date?: string;
  created_at_end_date?: string;
  public_start_date?: string;
  public_end_date?: string;
}

export type DataAPIResponse<T> =
  | {
      status_code: number;
      message: string;
      _pagination: {
        limit: number;
        page: number;
        total_count: number;
      };
      data: T[];
    };

export const GetAnnouncementList = async (params: paramProp): Promise<DataAPIResponse<Announcement> | null> => {

  const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;


  const url = new URL(`${BACKEND_URL}/profile/announcements`);
  const searchParams = new URLSearchParams();

  const defaultParams = {
    page: 1,
    limit: 10,
    ...params,
  };

  Object.entries(defaultParams).forEach(([key, value]) => {
    if (value) searchParams.append(key, value.toString());
  });

  url.search = searchParams.toString();

  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch announcements', res.statusText);
      return null;
    }

    const responseData: DataAPIResponse<Announcement> = await res.json();
    return responseData;
  } catch (err) {
    console.error('Error fetching announcement data:', err);
    return null;
  }
};
