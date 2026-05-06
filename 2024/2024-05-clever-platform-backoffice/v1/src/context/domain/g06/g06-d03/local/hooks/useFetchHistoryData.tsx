import API from '@domain/g06/g06-d03/local/api';
import showMessage from '@global/utils/showMessage';
import { useState } from 'react';
import { THistorySubject } from '../type';
import { PaginationAPIResponse } from '@global/utils/apiResponseHelper';

export default function useFetchHistoryData() {
  const [fetching, setFetching] = useState(false);
  const [data, setData] = useState<THistorySubject>();

  const fetchData = async (sheetID: number, onNotFound?: () => void) => {
    setFetching(true);
    let response: PaginationAPIResponse<THistorySubject>;
    try {
      response = await API.history.GetHistorySubject(sheetID);
    } catch (error) {
      showMessage('พบปัญหาในการเรียกข้อมูลกับเซิร์ฟเวอร์', 'error');
      throw error;
    } finally {
      setFetching(false);
    }

    if (response.status_code == 404) {
      onNotFound?.();
      return;
    } else if (response.status_code == 200) {
      setData(response.data[0]);
      return;
    }

    console.error(response);
    showMessage('พบปัญหาในการเรียกข้อมูลกับเซิร์ฟเวอร์', 'error');
  };

  return { data, fetching, fetchData };
}
