import StoreGlobalPersist, { IStoreGlobalPersist } from '@global/store/global/persist';

export const getPrice  =  (): Promise<any> => {
    const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';
    const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken
    const url = `${BACKEND_URL}/profile/ppp`;
  
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
        console.error('Upload failed', err);
        
      });
  }
  