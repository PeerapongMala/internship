import StoreGlobalPersist, { IStoreGlobalPersist } from '@global/store/global/persist';


export const uploadFile =  (query: FormData): Promise<any> => {
  const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken
  const url = `${BACKEND_URL}/newspaper/announcement`;

  return fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: query,
  })
  .then((res) => res.json())  
  .then((responseData) => {
    return responseData;  
  })
    .catch((err) => {
      console.error('Upload failed', err);
      
    });
}







