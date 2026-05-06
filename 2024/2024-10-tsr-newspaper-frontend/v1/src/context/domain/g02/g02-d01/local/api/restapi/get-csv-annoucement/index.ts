import StoreGlobalPersist from '@global/store/global/persist';
import { saveAs } from 'file-saver';

export const CSVAnnoucement = (
  startDate: string,
  endDate: string,
  publicstartDate: string,
  publicendDate: string,
): Promise<void> => {
  const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

  const url = `${BACKEND_URL}/profile/payments/download/csv?start_date=${encodeURIComponent(
    startDate,
  )}&end_date=${encodeURIComponent(endDate)}&public_start_date=${encodeURIComponent(publicstartDate)}&public_end_date=${encodeURIComponent(publicendDate)}`;

  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch CSV');
      }


      return response.text();
    })
    .then((csvText) => {

      const blob = new Blob([csvText], { type: 'text/csv;charset=UTF-8' });
      saveAs(blob, 'Annoucement-history.csv');
    })
    .catch((error) => {
      console.error('Error export CSV:', error);
    });
};
