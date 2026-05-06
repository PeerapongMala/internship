import StoreGlobalPersist, { IStoreGlobalPersist } from '@global/store/global/persist';


export const GetProfile =  (): Promise<any> => {
  const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';

  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken
  const url = `${BACKEND_URL}/profile/profile`;
  if (!accessToken) {
    return Promise.reject(new Error('Access token not available'));
  }

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  .then((res) => res.json())  
  .then((responseData) => {
    return responseData;  
  })
    .catch((err) => {
      console.error('Cant not get profile', err);
      
    });
}