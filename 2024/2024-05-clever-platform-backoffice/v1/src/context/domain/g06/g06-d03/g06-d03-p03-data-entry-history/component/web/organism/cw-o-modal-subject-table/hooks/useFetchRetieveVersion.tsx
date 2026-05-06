import API from '@domain/g06/g06-d03/local/api';
import { DataAPIResponse } from '@global/utils/apiResponseHelper';
import showMessage from '@global/utils/showMessage';
import { useState } from 'react';

const ERR_MSG = 'พบปัญหาในการเรียกคืน Version';

export default function useUpdateRetrieveVersion() {
  const [fetching, setFetching] = useState(false);

  const fetchData = async (sheetID: number, versionID: number) => {
    let res: DataAPIResponse<null>;

    setFetching(true);
    try {
      res = await API.history.PostRetrieveVersion(sheetID, versionID);
    } catch (error) {
      showMessage(ERR_MSG, 'error');
      throw error;
    } finally {
      setFetching(false);
    }

    if (res.status_code != 200) {
      showMessage(res.message || ERR_MSG, 'error');
      throw new Error('failed to retrieve version');
    }

    showMessage('เรียกคืน Version สำเร็จ');
  };

  return {
    fetching,
    fetch: fetchData,
  };
}
