import StoreGlobalPersist, { IStoreGlobalPersist } from '@global/store/global/persist';


export const GetDownload =  (public_date: string): Promise<any> => {
  const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';
  const BACKEND_URL_LOCAL = 'http://127.0.0.1:5050';
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken
  const url = `${BACKEND_URL}/newspaper/detail/?public_date=${public_date}`;

  return fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })
  .then((res) => res.json())  
  .then((responseData) => {
    return responseData;  
  })
    .catch((err) => {
      console.error('Fag not get', err);
      
    });
}
