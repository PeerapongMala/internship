import API from '@domain/g06/g06-d03/local/api';
import { IGetSheetDetail, IUpdateSheetRequest } from '@domain/g06/g06-d03/local/type';
import { DataAPIResponse } from '@global/utils/apiResponseHelper';
import showMessage from '@global/utils/showMessage';
import { useState } from 'react';

const useUpdateSheetData = () => {
  const [isFetching, setIsFetching] = useState(false);

  const handleUpdate = async (data: IUpdateSheetRequest) => {
    setIsFetching(true);

    let response: DataAPIResponse<IGetSheetDetail>;

    try {
      response = await API.sheet.UpdateSheet(data);
    } catch (error) {
      showMessage('พบปัญหาในการบันทึกข้อมูล', 'error');
      throw error;
    } finally {
      setIsFetching(false);
    }

    if (response.status_code == 200) {
      showMessage('บันทึกข้อมูลสำเร็จ', 'success');
      return response;
    }

    const errMsg = response.message || 'พบปัญหาในการบันทึกข้อมูล';
    showMessage(errMsg, 'error');
    throw new Error(errMsg);
  };

  return {
    isFetchUpdateSheetData: isFetching,
    fetchUpdateSheetData: handleUpdate,
  };
};

export default useUpdateSheetData;
