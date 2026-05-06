import StoreGlobalPersist, { IStoreGlobalPersist } from '@global/store/global/persist';


export const GetInvoice =  (
  invoice_number: string
): Promise<any> => {
  const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';

  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken
  const url = `${BACKEND_URL}/newspaper/announcement/invoice/${invoice_number}`;

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
      console.error('invoice not get', err);
      
    });
}