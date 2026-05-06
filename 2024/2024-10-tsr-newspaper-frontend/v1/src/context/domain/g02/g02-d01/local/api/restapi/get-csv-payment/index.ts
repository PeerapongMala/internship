import StoreGlobalPersist from '@global/store/global/persist';
import { saveAs } from 'file-saver';

export const exportCSVPayment = (startDate: string, endDate: string): Promise<void> => {
  const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

  const url = `${BACKEND_URL}/profile/payments/download/csv?start_date=${encodeURIComponent(
    startDate,
  )}&end_date=${encodeURIComponent(endDate)}`;

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
      saveAs(blob, 'payment-history.csv');
    })
    .catch((error) => {
      console.error('Error export CSV:', error);
    });
};

// import StoreGlobalPersist from '@global/store/global/persist';

// export const exportCSVApi = async (startDate: string, endDate: string): Promise<void> => {
//   const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';
//   const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

//   try {
//     const url = `${BACKEND_URL}/profile/payments/download/csv?start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}`;

//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json;charset=UTF-8',
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error('Failed to fetch CSV');
//     }

//     const blob = await response.blob();

//     const downloadUrl = URL.createObjectURL(blob);

//     const link = document.createElement('a');
//     link.href = downloadUrl;
//     link.download = 'payment-history.csv';

//     link.setAttribute('download', 'payment-history.csv');

//     link.click();

//     URL.revokeObjectURL(downloadUrl);
//   } catch (error) {
//     console.error('Error exporting CSV:', error);
//   }
// };
