import StoreGlobalPersist from '@global/store/global/persist';

interface paramProp {
  page?: number
  limit?: number
  start_date?:string
  end_date?:string
}

export const GetPayment = (params: paramProp): Promise<any> => {
  const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';
  const BACKEND_URL_LOCAL = "http://127.0.0.1:5050";
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

  const url = new URL(`${BACKEND_URL}/profile/payments`);
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

  return fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((responseData) => {
      return responseData;
    })
    .catch((err) => {
      console.error('Announcement cant not get', err);
    });
};
